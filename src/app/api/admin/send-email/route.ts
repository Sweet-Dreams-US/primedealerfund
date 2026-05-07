import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Enqueues an email batch — does NOT send synchronously.
 *
 * Writes one email_log row (status='queued') and one email_recipients row
 * per recipient, then fires-and-forgets a request to the queue worker so
 * the first batch starts immediately. The Vercel cron at /api/admin/email-
 * queue/process is the safety net that picks up any rows the inline trigger
 * misses (function timeout, transient failure, etc.).
 *
 * Response is instant. The UI polls /api/admin/email-queue/status?jobId=X
 * for live progress.
 */
export async function POST(request: Request) {
  try {
    const { recipientIds, manualRecipients, adhocEmails, subject, body } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service not configured: RESEND_API_KEY is missing" }, { status: 500 });
    }

    const supabase = createServerClient();

    // Resolve database investors -> { id, first, last, email }
    let investorRecipients: { id: string; first: string; last: string; email: string }[] = [];
    if (recipientIds?.length) {
      const { data } = await supabase
        .from("investors")
        .select("id, first_name, last_name, email")
        .in("id", recipientIds);
      investorRecipients = (data || [])
        .filter((r) => r.email)
        .map((r) => ({
          id: r.id,
          first: r.first_name || "",
          last: r.last_name || "",
          email: r.email,
        }));
    }

    // Manual + adhoc: not in database, no investor_id
    const externalRecipients = [
      ...((manualRecipients || []) as { name?: string; address: string }[]).map((r) => ({
        email: r.address,
        name: r.name || r.address.split("@")[0],
      })),
      ...((adhocEmails || []) as { email: string; name: string }[]).map((r) => ({
        email: r.email,
        name: r.name || r.email.split("@")[0],
      })),
    ];

    const total = investorRecipients.length + externalRecipients.length;
    if (total === 0) {
      return NextResponse.json({ error: "No valid recipients found" }, { status: 400 });
    }

    // Create the job row
    const { data: jobRow, error: jobErr } = await supabase
      .from("email_log")
      .insert({
        sender: "Ralph@PrimeDealerFund.com",
        subject,
        body,
        recipient_count: total,
        total_count: total,
        recipients: [], // legacy column — leave empty, real per-recipient data lives in email_recipients
        status: "queued",
      })
      .select()
      .single();

    if (jobErr || !jobRow) {
      return NextResponse.json({ error: `Could not create job: ${jobErr?.message ?? "unknown"}` }, { status: 500 });
    }

    // Pre-personalize bodies and persist all recipient rows in queued state.
    // We do personalization at enqueue time (not in the worker) so that the
    // worker stays fast and idempotent — re-running it never re-personalizes.
    const personalize = (text: string, first: string, last: string) =>
      text
        .replace(/{{first_name}}/g, first)
        .replace(/{{last_name}}/g, last)
        .replace(/{{full_name}}/g, `${first} ${last}`.trim());

    const recipientRows = [
      ...investorRecipients.map((r) => ({
        email_log_id: jobRow.id,
        investor_id: r.id,
        email: r.email,
        recipient_name: `${r.first} ${r.last}`.trim() || r.email,
        subject_personalized: personalize(subject, r.first, r.last),
        body_personalized: personalize(body, r.first, r.last),
        status: "queued",
        attempts: 0,
      })),
      ...externalRecipients.map((r) => ({
        email_log_id: jobRow.id,
        investor_id: null,
        email: r.email,
        recipient_name: r.name,
        subject_personalized: personalize(subject, r.name, ""),
        body_personalized: personalize(body, r.name, ""),
        status: "queued",
        attempts: 0,
      })),
    ];

    const { error: insertErr } = await supabase.from("email_recipients").insert(recipientRows);
    if (insertErr) {
      // Rollback the job row to avoid an orphaned half-enqueued state
      await supabase.from("email_log").delete().eq("id", jobRow.id);
      return NextResponse.json({ error: `Could not enqueue recipients: ${insertErr.message}` }, { status: 500 });
    }

    // Fire-and-forget the worker so the first batch starts immediately.
    // We don't await — the worker will respond in its own time, and our
    // user gets the jobId back instantly. The cron is the safety net if
    // this trigger fails for any reason.
    const baseUrl = new URL(request.url).origin;
    fetch(`${baseUrl}/api/admin/email-queue/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-queue-secret": process.env.QUEUE_TRIGGER_SECRET || "",
      },
      body: JSON.stringify({ jobId: jobRow.id }),
    }).catch(() => {
      // Worker trigger failed — cron will pick it up within 60 seconds
    });

    return NextResponse.json({ jobId: jobRow.id, total, status: "queued" });
  } catch (err) {
    return NextResponse.json(
      { error: `Enqueue failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}
