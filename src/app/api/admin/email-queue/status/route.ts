import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * Returns live progress for a single email job. Polled by the admin UI
 * every ~2 seconds while a batch is in flight.
 *
 * Response shape:
 *   {
 *     jobId, status: 'queued'|'processing'|'sent'|'partial'|'failed',
 *     total, sent, failed, queued, retrying,
 *     percent, completedAt
 *   }
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data: job, error: jobErr } = await supabase
    .from("email_log")
    .select("id, subject, status, total_count, processed_count, completed_at, created_at")
    .eq("id", jobId)
    .single();

  if (jobErr || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const { data: rows } = await supabase
    .from("email_recipients")
    .select("status")
    .eq("email_log_id", jobId);

  const counts = (rows || []).reduce(
    (acc, r) => {
      acc.total++;
      if (r.status === "sent") acc.sent++;
      else if (r.status === "failed") acc.failed++;
      else if (r.status === "queued") acc.queued++;
      else if (r.status === "retrying") acc.retrying++;
      return acc;
    },
    { total: 0, sent: 0, failed: 0, queued: 0, retrying: 0 }
  );

  const total = counts.total || job.total_count || 0;
  const processed = counts.sent + counts.failed;
  const percent = total > 0 ? Math.round((processed / total) * 100) : 0;

  return NextResponse.json({
    jobId: job.id,
    subject: job.subject,
    status: job.status,
    total,
    sent: counts.sent,
    failed: counts.failed,
    queued: counts.queued,
    retrying: counts.retrying,
    percent,
    completedAt: job.completed_at,
    createdAt: job.created_at,
  });
}
