import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import {
  getRecentBounceMessages,
  extractBouncedRecipients,
  markMessageRead,
} from "@/lib/microsoft-graph";

/**
 * Outlook NDR scanner.
 *
 * Pulls recent NDR (Non-Delivery Report) messages from Ralph's inbox and
 * marks every recipient extracted from each NDR body as bounced. This
 * catches messages Ralph sent directly from his own Outlook (i.e. not
 * routed through Resend, so Resend's webhook never fires).
 *
 * Triggered three ways:
 *   1. Vercel cron every hour (safety net for the daily volume)
 *   2. POST from the admin "Scan Outlook for Bounces" button
 *   3. POST from anything carrying x-queue-secret matching QUEUE_TRIGGER_SECRET
 *
 * Once an NDR has been processed it's marked as read so re-runs skip it,
 * AND we deduplicate by (email + outlook_message_id) via the email_bounces
 * table so a re-run on an unread message is still a no-op.
 *
 * Default look-back window is 7 days.
 */

function isAuthorized(request: Request): boolean {
  // Same auth pattern as the email queue worker.
  const secret = request.headers.get("x-queue-secret");
  if (secret && secret === process.env.QUEUE_TRIGGER_SECRET) return true;
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  if (ua.includes("vercel-cron")) return true;
  // Dev fallback so the manual button works during local development.
  if (!process.env.QUEUE_TRIGGER_SECRET && process.env.NODE_ENV !== "production") return true;
  return false;
}

async function runScan(opts: { lookbackDays: number; markRead: boolean }) {
  const supabase = createServerClient();
  const sinceIso = new Date(Date.now() - opts.lookbackDays * 24 * 60 * 60 * 1000).toISOString();

  let scanned = 0;
  let newBounces = 0;
  let investorsMarked = 0;
  const errors: string[] = [];

  let messages;
  try {
    messages = await getRecentBounceMessages({ sinceIso, top: 100 });
  } catch (err) {
    errors.push(`Graph fetch failed: ${err instanceof Error ? err.message : String(err)}`);
    return { scanned: 0, newBounces: 0, investorsMarked: 0, errors };
  }

  for (const msg of messages) {
    scanned++;
    const recipients = extractBouncedRecipients(msg);
    if (recipients.length === 0) continue;

    // Skip recipients we've already logged from THIS exact NDR. We use the
    // outlook message id stored in raw_payload as the dedup key.
    const { data: existingForMessage } = await supabase
      .from("email_bounces")
      .select("email")
      .eq("source", "outlook-scan")
      .filter("raw_payload->>outlook_message_id", "eq", msg.id);

    const alreadyLogged = new Set(
      (existingForMessage || []).map((r) => (r.email || "").toLowerCase()),
    );

    for (const email of recipients) {
      if (alreadyLogged.has(email)) continue;

      const reason = msg.subject?.startsWith("Undeliverable:")
        ? msg.subject.slice("Undeliverable:".length).trim()
        : msg.subject || "Bounced (Outlook NDR)";

      // Find investor by email (case-insensitive).
      const { data: matchingInvestors } = await supabase
        .from("investors")
        .select("id")
        .ilike("email", email);
      const investorId = matchingInvestors?.[0]?.id || null;

      const { error: insertErr } = await supabase.from("email_bounces").insert({
        email,
        investor_id: investorId,
        source: "outlook-scan",
        reason,
        raw_payload: {
          outlook_message_id: msg.id,
          outlook_subject: msg.subject,
          outlook_from: msg.from?.emailAddress?.address,
          received_at: msg.receivedDateTime,
        },
      });

      if (insertErr) {
        errors.push(`Insert bounce ${email}: ${insertErr.message}`);
        continue;
      }
      newBounces++;

      if (investorId) {
        const { error: updateErr } = await supabase
          .from("investors")
          .update({
            email_bounced: true,
            email_bounced_at: new Date().toISOString(),
            email_bounce_reason: reason,
            email_bounce_source: "outlook-scan",
          })
          .eq("id", investorId);
        if (updateErr) {
          errors.push(`Update investor ${investorId}: ${updateErr.message}`);
        } else {
          investorsMarked++;
        }
      }
    }

    // Mark the NDR as read so the next scan can skip it cheaply via the
    // outlook_message_id dedup. (Some NDRs may already be read if Ralph
    // looked at them — that's fine, the dedup still works.)
    if (opts.markRead && !msg.isRead) {
      try {
        await markMessageRead(msg.id, true);
      } catch {
        // Non-fatal — the dedup keys still prevent re-processing.
      }
    }
  }

  return { scanned, newBounces, investorsMarked, errors };
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let lookbackDays = 7;
  let markRead = true;
  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body.lookbackDays === "number" && body.lookbackDays > 0 && body.lookbackDays <= 90) {
      lookbackDays = body.lookbackDays;
    }
    if (typeof body.markRead === "boolean") markRead = body.markRead;
  } catch {
    /* default values */
  }

  const result = await runScan({ lookbackDays, markRead });
  return NextResponse.json({ ok: true, lookbackDays, ...result });
}

// GET handler for the Vercel cron trigger — same scan, default settings.
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runScan({ lookbackDays: 7, markRead: true });
  return NextResponse.json({ ok: true, lookbackDays: 7, ...result });
}
