import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";

/**
 * Email queue worker.
 *
 * Drains queued/retrying email_recipients rows and sends them via Resend
 * with a 200ms throttle (5 req/sec — matches Pro plan rate limit).
 *
 * Triggered three ways:
 *   1. POST from /api/admin/send-email immediately after enqueue (fast path)
 *   2. Vercel cron every 1 minute (safety net for stuck jobs)
 *   3. POST from another worker invocation if it ran out of time
 *
 * Either accepts a jobId in the body to drain a specific job, or runs
 * across all queued jobs (used by cron).
 *
 * Auth: requires x-queue-secret header matching QUEUE_TRIGGER_SECRET env
 * var, or the Vercel cron user-agent.
 */

const RATE_LIMIT_DELAY_MS = 200; // 5 req/sec — Resend Pro plan
const MAX_ATTEMPTS = 2; // initial + one retry
const MAX_BATCH_SIZE = 250; // soft cap per worker invocation to stay under fn timeout

const FROM_ADDRESS = "Ralph Marcuccilli <Ralph@PrimeDealerFund.com>";
const SUMMARY_TO = "Ralph@PrimeDealerFund.com";

function buildEmailHtml(body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:20px;">
    <tr>
      <td>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0;">
              <div style="color:#000000;font-size:14px;line-height:1.6;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;">
                ${body.split("\n").map((line: string) => line.trim() === "" ? "<br>" : `<p style="margin:0 0 12px 0;">${line}</p>`).join("\n")}
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="padding-right:16px;vertical-align:top;">
                    <img src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png" alt="Prime Dealer Equity Fund" width="100" style="height:auto;display:block;" />
                  </td>
                  <td style="vertical-align:top;font-family:Aptos,Calibri,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#000000;">
                    <strong>Ralph E. Marcuccilli</strong>, Manager<br>
                    Prime Management Partners LLC<br>
                    P: 260.417.6016<br>
                    <a href="mailto:Ralph@PrimeDealerFund.com" style="color:#0563C1;text-decoration:underline;">Ralph@PrimeDealerFund.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Verify the request is allowed: secret header OR Vercel cron user-agent */
function isAuthorized(request: Request): boolean {
  const secret = request.headers.get("x-queue-secret");
  if (secret && secret === process.env.QUEUE_TRIGGER_SECRET) return true;
  const userAgent = request.headers.get("user-agent") || "";
  if (userAgent.startsWith("vercel-cron")) return true;
  // Allow Vercel internal trigger when no secret is configured (dev convenience)
  if (!process.env.QUEUE_TRIGGER_SECRET && process.env.NODE_ENV !== "production") return true;
  return false;
}

async function processOnce(jobId?: string): Promise<{
  drained: number;
  sent: number;
  failed: number;
  retried: number;
  jobsCompleted: string[];
}> {
  const supabase = createServerClient();

  // Pull queued/retrying rows for this job (or globally if no jobId)
  let query = supabase
    .from("email_recipients")
    .select("id, email_log_id, investor_id, email, recipient_name, subject_personalized, body_personalized, attempts, status")
    .in("status", ["queued", "retrying"])
    .lt("attempts", MAX_ATTEMPTS)
    .order("created_at", { ascending: true })
    .limit(MAX_BATCH_SIZE);

  if (jobId) query = query.eq("email_log_id", jobId);

  const { data: rows, error } = await query;
  if (error) throw new Error(`Could not fetch queue: ${error.message}`);

  const counters = { drained: 0, sent: 0, failed: 0, retried: 0, jobsCompleted: [] as string[] };
  if (!rows || rows.length === 0) return counters;

  // Lazily construct the Resend client only when there's actual work.
  // Avoids the SDK throwing "Missing API key" on empty cron ticks during
  // brief env var transitions and keeps idle worker invocations silent.
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Mark the parent job(s) as 'processing' so the UI reflects the state.
  const jobIds = Array.from(new Set(rows.map((r) => r.email_log_id).filter(Boolean) as string[]));
  for (const jid of jobIds) {
    await supabase.from("email_log").update({ status: "processing", last_processed_at: new Date().toISOString() }).eq("id", jid);
  }

  for (const row of rows) {
    counters.drained++;
    const nextAttempt = (row.attempts ?? 0) + 1;
    const subject = row.subject_personalized || "";
    const html = buildEmailHtml(row.body_personalized || "");

    try {
      const { data, error: sendErr } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: row.email,
        subject,
        html,
      });

      if (sendErr) throw new Error(sendErr.message || JSON.stringify(sendErr));

      await supabase
        .from("email_recipients")
        .update({
          status: "sent",
          attempts: nextAttempt,
          processed_at: new Date().toISOString(),
          resend_id: data?.id || null,
          error_message: null,
        })
        .eq("id", row.id);

      counters.sent++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const willRetry = nextAttempt < MAX_ATTEMPTS;

      await supabase
        .from("email_recipients")
        .update({
          status: willRetry ? "retrying" : "failed",
          attempts: nextAttempt,
          processed_at: new Date().toISOString(),
          error_message: message.slice(0, 500),
        })
        .eq("id", row.id);

      if (willRetry) counters.retried++;
      else counters.failed++;
    }

    // Throttle BEFORE the next iteration. Skip after the last one.
    if (counters.drained < rows.length) await sleep(RATE_LIMIT_DELAY_MS);
  }

  // After the batch: update each affected job's processed_count and possibly mark it done.
  for (const jid of jobIds) {
    const { data: jobStats } = await supabase
      .from("email_recipients")
      .select("status")
      .eq("email_log_id", jid);

    const stats = (jobStats || []).reduce(
      (acc, r) => {
        acc.total++;
        if (r.status === "sent") acc.sent++;
        else if (r.status === "failed") acc.failed++;
        else acc.pending++;
        return acc;
      },
      { total: 0, sent: 0, failed: 0, pending: 0 }
    );

    const isComplete = stats.pending === 0;
    const updates: Record<string, unknown> = {
      processed_count: stats.sent + stats.failed,
      total_count: stats.total,
      last_processed_at: new Date().toISOString(),
    };
    if (isComplete) {
      updates.status = stats.failed === 0 ? "sent" : (stats.sent === 0 ? "failed" : "partial");
      updates.completed_at = new Date().toISOString();
    }

    await supabase.from("email_log").update(updates).eq("id", jid);

    if (isComplete) {
      counters.jobsCompleted.push(jid);
      await sendCompletionSummary(jid, stats);

      // Also bump the ball-in-court for successfully-sent investor recipients.
      // (Same behavior the old synchronous route had — preserved here.)
      const { data: sentRows } = await supabase
        .from("email_recipients")
        .select("investor_id")
        .eq("email_log_id", jid)
        .eq("status", "sent")
        .not("investor_id", "is", null);

      const sentInvestorIds = (sentRows || []).map((r) => r.investor_id).filter(Boolean) as string[];
      if (sentInvestorIds.length > 0) {
        await supabase
          .from("investors")
          .update({
            ball_in_court: "theirs",
            ball_changed_at: new Date().toISOString(),
            last_outbound_at: new Date().toISOString(),
            last_contact_date: new Date().toISOString().split("T")[0],
          })
          .in("id", sentInvestorIds);
      }

      // Also log to communication_log for the investor recipients so the
      // CRM history shows the outbound. Same behavior as the old route.
      const { data: investorSends } = await supabase
        .from("email_recipients")
        .select("investor_id, status")
        .eq("email_log_id", jid)
        .not("investor_id", "is", null);

      const { data: jobInfo } = await supabase
        .from("email_log")
        .select("subject")
        .eq("id", jid)
        .single();

      const today = new Date().toISOString().split("T")[0];
      const commEntries = (investorSends || []).map((r) => ({
        investor_id: r.investor_id as string,
        date: today,
        type: "Email" as const,
        subject: `[Admin Email] ${jobInfo?.subject ?? ""}`,
        response: r.status === "sent" ? "Pending" : "Failed to send",
        next_step: r.status === "sent" ? "Await response" : "Retry send",
        direction: "outbound" as const,
      }));
      if (commEntries.length > 0) {
        await supabase.from("communication_log").insert(commEntries);
      }
    }
  }

  return counters;
}

/**
 * Sends a one-off summary email to Ralph when a batch completes.
 * Best-effort — failure here doesn't fail the worker.
 */
async function sendCompletionSummary(
  jobId: string,
  stats: { total: number; sent: number; failed: number }
) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const supabase = createServerClient();
    const { data: job } = await supabase
      .from("email_log")
      .select("subject")
      .eq("id", jobId)
      .single();
    const resend = new Resend(process.env.RESEND_API_KEY);
    const subjectLine = job?.subject ?? "(unknown)";
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: SUMMARY_TO,
      subject: `Batch send complete — ${stats.sent}/${stats.total} delivered`,
      html: `<p>Batch send finished.</p>
<ul>
  <li><strong>Subject:</strong> ${subjectLine}</li>
  <li><strong>Total:</strong> ${stats.total}</li>
  <li><strong>Sent:</strong> ${stats.sent}</li>
  <li><strong>Failed:</strong> ${stats.failed}</li>
</ul>
<p>View details in the admin dashboard.</p>`,
    });
  } catch {
    // Swallow — summary email failure shouldn't block the queue
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const counters = await processOnce(body.jobId);

    // If we drained the full batch cap, more rows likely remain.
    // Self-trigger another worker invocation so we keep moving without
    // waiting for the next cron tick.
    if (counters.drained >= MAX_BATCH_SIZE) {
      const baseUrl = new URL(request.url).origin;
      fetch(`${baseUrl}/api/admin/email-queue/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-queue-secret": process.env.QUEUE_TRIGGER_SECRET || "",
        },
        body: JSON.stringify(body.jobId ? { jobId: body.jobId } : {}),
      }).catch(() => {});
    }

    return NextResponse.json(counters);
  } catch (err) {
    return NextResponse.json(
      { error: `Worker failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}

// Vercel cron uses GET — alias to the same handler so the cron config can
// point at this route without a body.
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const counters = await processOnce();
    return NextResponse.json(counters);
  } catch (err) {
    return NextResponse.json(
      { error: `Worker failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 }
    );
  }
}

export const maxDuration = 300; // give the worker the full 300s function ceiling
