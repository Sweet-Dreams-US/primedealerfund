import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getInboxMessages } from "@/lib/microsoft-graph";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMsg = any;

// Helper to fetch multiple pages of emails
async function fetchAllMessages(folder: string, maxPages: number = 5): Promise<AnyMsg[]> {
  const allMessages: AnyMsg[] = [];
  const pageSize = 100; // Max per page for Graph API

  for (let page = 0; page < maxPages; page++) {
    try {
      const result = await getInboxMessages({
        folder,
        top: pageSize,
        skip: page * pageSize,
      });
      allMessages.push(...result.messages);
      // Stop if we got fewer than requested (no more pages)
      if (result.messages.length < pageSize) break;
    } catch {
      break;
    }
  }
  return allMessages;
}

// POST — Deep sync Outlook emails to communication_log
// Scans sent + inbox, matches to investors, creates logs, updates ball-in-court
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deep = searchParams.get("deep") === "true"; // deep=true for full scan
    const maxPages = deep ? 10 : 3; // 1000 emails deep vs 300 normal

    const supabase = createServerClient();

    // Fetch emails from Outlook — sent items and inbox
    const [sentMessages, inboxMessages] = await Promise.all([
      fetchAllMessages("sentitems", maxPages),
      fetchAllMessages("inbox", maxPages),
    ]);

    // Get all investor emails for matching
    const { data: investors } = await supabase
      .from("investors")
      .select("id, email, first_name, last_name");

    if (!investors) {
      return NextResponse.json({ error: "Could not fetch investors" }, { status: 500 });
    }

    const emailToInvestor = new Map<string, { id: string; name: string }>();
    for (const inv of investors) {
      if (inv.email) {
        emailToInvestor.set(inv.email.toLowerCase(), {
          id: inv.id,
          name: `${inv.first_name} ${inv.last_name || ""}`.trim(),
        });
      }
    }

    // Get ALL existing comm log subjects to avoid duplicates (not just 3 days)
    const { data: existingComms } = await supabase
      .from("communication_log")
      .select("investor_id, subject, date");

    // Build a dedup key: investor_id + subject + date
    const existingKeys = new Set(
      (existingComms || []).map((c) => `${c.investor_id}|${c.subject}|${c.date}`)
    );

    const newEntries: {
      investor_id: string;
      date: string;
      type: string;
      subject: string;
      response: string;
      next_step: string;
      direction: string;
    }[] = [];

    // Track per-investor latest activity for ball-in-court
    const investorActivity = new Map<string, { lastSent: string | null; lastReceived: string | null }>();

    // Process sent emails — match recipients to investors
    for (const msg of sentMessages) {
      for (const recipient of msg.toRecipients || []) {
        const addr = recipient.emailAddress?.address?.toLowerCase();
        if (!addr) continue;
        const investor = emailToInvestor.get(addr);
        if (!investor) continue;

        const sentDT = msg.sentDateTime || msg.receivedDateTime || "";
        const date = sentDT.split("T")[0];
        if (!date) continue;

        const subject = msg.subject || "(no subject)";
        const subjectKey = `[Outlook Sent] ${subject}`;
        const dedupKey = `${investor.id}|${subjectKey}|${date}`;

        if (!existingKeys.has(dedupKey)) {
          newEntries.push({
            investor_id: investor.id,
            date,
            type: "Email",
            subject: subjectKey,
            response: "Sent",
            next_step: "Await response",
            direction: "outbound",
          });
          existingKeys.add(dedupKey);
        }

        // Track latest sent date per investor
        const activity = investorActivity.get(investor.id) || { lastSent: null, lastReceived: null };
        if (!activity.lastSent || sentDT > activity.lastSent) activity.lastSent = sentDT;
        investorActivity.set(investor.id, activity);
      }
    }

    // Process inbox emails — match senders to investors
    for (const msg of inboxMessages) {
      const senderAddr = (msg.from?.emailAddress?.address || "").toLowerCase();
      if (!senderAddr) continue;
      const investor = emailToInvestor.get(senderAddr);
      if (!investor) continue;

      const receivedDT = msg.receivedDateTime || "";
      const date = receivedDT.split("T")[0];
      if (!date) continue;

      const subject = msg.subject || "(no subject)";
      const subjectKey = `[Outlook Received] ${subject}`;
      const dedupKey = `${investor.id}|${subjectKey}|${date}`;

      if (!existingKeys.has(dedupKey)) {
        newEntries.push({
          investor_id: investor.id,
          date,
          type: "Email",
          subject: subjectKey,
          response: "Received",
          next_step: "Review and respond",
          direction: "inbound",
        });
        existingKeys.add(dedupKey);
      }

      // Track latest received date per investor
      const activity = investorActivity.get(investor.id) || { lastSent: null, lastReceived: null };
      if (!activity.lastReceived || receivedDT > activity.lastReceived) activity.lastReceived = receivedDT;
      investorActivity.set(investor.id, activity);
    }

    // Insert new entries in batches
    let inserted = 0;
    if (newEntries.length > 0) {
      // Insert in chunks of 50 to avoid payload limits
      for (let i = 0; i < newEntries.length; i += 50) {
        const chunk = newEntries.slice(i, i + 50);
        const { error } = await supabase.from("communication_log").insert(chunk);
        if (error) {
          console.error("Insert error:", error.message);
        } else {
          inserted += chunk.length;
        }
      }
    }

    // Update ball_in_court for every investor we found emails for
    // Logic: whoever sent the MOST RECENT email determines the ball
    // If Ralph sent last → ball is theirs (waiting on reply)
    // If investor sent last → ball is ours (we need to respond)
    let ballUpdated = 0;
    for (const [investorId, activity] of investorActivity.entries()) {
      const updates: Record<string, unknown> = {};

      if (activity.lastSent) {
        updates.last_outbound_at = activity.lastSent;
      }
      if (activity.lastReceived) {
        updates.last_inbound_at = activity.lastReceived;
      }

      // Determine ball based on most recent activity
      if (activity.lastSent && activity.lastReceived) {
        // Both exist — most recent wins
        if (activity.lastReceived > activity.lastSent) {
          // They replied more recently → our turn
          updates.ball_in_court = "ours";
          updates.ball_changed_at = activity.lastReceived;
          updates.last_contact_date = activity.lastReceived.split("T")[0];
        } else {
          // We sent more recently → their turn
          updates.ball_in_court = "theirs";
          updates.ball_changed_at = activity.lastSent;
          updates.last_contact_date = activity.lastSent.split("T")[0];
        }
      } else if (activity.lastReceived) {
        // Only received → our turn
        updates.ball_in_court = "ours";
        updates.ball_changed_at = activity.lastReceived;
        updates.last_contact_date = activity.lastReceived.split("T")[0];
      } else if (activity.lastSent) {
        // Only sent → their turn
        updates.ball_in_court = "theirs";
        updates.ball_changed_at = activity.lastSent;
        updates.last_contact_date = activity.lastSent.split("T")[0];
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from("investors").update(updates).eq("id", investorId);
        ballUpdated++;
      }
    }

    return NextResponse.json({
      synced: inserted,
      sent_scanned: sentMessages.length,
      received_scanned: inboxMessages.length,
      investors_matched: investorActivity.size,
      ball_updated: ballUpdated,
      new_entries: newEntries.length,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
