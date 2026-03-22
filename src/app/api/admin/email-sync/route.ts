import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getInboxMessages } from "@/lib/microsoft-graph";

// POST — Sync recent Outlook emails to communication_log
// Cross-references email addresses with investor database
export async function POST() {
  try {
    const supabase = createServerClient();

    // Fetch recent sent emails from Ralph's Outlook (last 3 days)
    const sentResult = await getInboxMessages({ folder: "sentitems", top: 50 });
    const inboxResult = await getInboxMessages({ folder: "inbox", top: 50 });

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

    // Get existing comm log entries to avoid duplicates
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const { data: existingComms } = await supabase
      .from("communication_log")
      .select("subject")
      .gte("date", threeDaysAgo.toISOString().split("T")[0]);

    const existingSubjects = new Set((existingComms || []).map((c) => c.subject));

    const newEntries: {
      investor_id: string;
      date: string;
      type: string;
      subject: string;
      response: string;
      next_step: string;
    }[] = [];

    // Process sent emails — match recipients to investors
    for (const msg of sentResult.messages) {
      for (const recipient of msg.toRecipients || []) {
        const addr = recipient.emailAddress?.address?.toLowerCase();
        if (!addr) continue;
        const investor = emailToInvestor.get(addr);
        if (!investor) continue;

        const subjectKey = `[Outlook Sent] ${msg.subject}`;
        if (existingSubjects.has(subjectKey)) continue;

        const date = (msg.sentDateTime || msg.receivedDateTime || "").split("T")[0];
        if (!date) continue;

        newEntries.push({
          investor_id: investor.id,
          date,
          type: "Email",
          subject: subjectKey,
          response: "Sent",
          next_step: "Await response",
        });
        existingSubjects.add(subjectKey);
      }
    }

    // Process inbox emails — match senders to investors
    for (const msg of inboxResult.messages) {
      const senderAddr = msg.from?.emailAddress?.address?.toLowerCase();
      if (!senderAddr) continue;
      const investor = emailToInvestor.get(senderAddr);
      if (!investor) continue;

      const subjectKey = `[Outlook Received] ${msg.subject}`;
      if (existingSubjects.has(subjectKey)) continue;

      const date = (msg.receivedDateTime || "").split("T")[0];
      if (!date) continue;

      newEntries.push({
        investor_id: investor.id,
        date,
        type: "Email",
        subject: subjectKey,
        response: "Received",
        next_step: "Review and respond",
      });
      existingSubjects.add(subjectKey);
    }

    // Insert new entries
    let inserted = 0;
    if (newEntries.length > 0) {
      const { error } = await supabase.from("communication_log").insert(newEntries);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      inserted = newEntries.length;
    }

    // Update ball_in_court based on direction of communication
    const inboundInvestorIds = [...new Set(newEntries.filter((e) => e.response === "Received").map((e) => e.investor_id))];
    const outboundInvestorIds = [...new Set(newEntries.filter((e) => e.response === "Sent").map((e) => e.investor_id))];
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toISOString();

    // Received email from investor → ball is in OUR court
    for (const invId of inboundInvestorIds) {
      await supabase
        .from("investors")
        .update({ last_contact_date: today, ball_in_court: "ours", ball_changed_at: now, last_inbound_at: now })
        .eq("id", invId);
    }

    // Sent email to investor → ball is in THEIR court
    for (const invId of outboundInvestorIds) {
      if (!inboundInvestorIds.includes(invId)) {
        await supabase
          .from("investors")
          .update({ last_contact_date: today, ball_in_court: "theirs", ball_changed_at: now, last_outbound_at: now })
          .eq("id", invId);
      }
    }

    return NextResponse.json({
      synced: inserted,
      sent: sentResult.messages.length,
      received: inboxResult.messages.length,
      matched: [...new Set([...inboundInvestorIds, ...outboundInvestorIds])].length,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
