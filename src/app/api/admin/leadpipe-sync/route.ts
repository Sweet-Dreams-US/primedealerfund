import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { syncVisitorsFromLeadPipe } from "@/lib/leadpipe";

/**
 * Pulls identified visitors from the LeadPipe REST API into site_visitors.
 *
 * Triggered two ways:
 *   - Vercel cron (GET) every few hours — the automated path.
 *   - The "Sync from LeadPipe" button in the admin Visitors tab (POST).
 *
 * This is the primary ingestion path (no dashboard webhook required). Reads
 * are idempotent and don't consume identification credits — credits are spent
 * by the pixel at identification time, not by reading data back.
 *
 * Default look-back is 30 days; the cron passes a wider window occasionally is
 * unnecessary because upsert dedupes by email.
 */

async function run(timeframe: string) {
  const supabase = createServerClient();
  const result = await syncVisitorsFromLeadPipe(supabase, { timeframe });
  const status = result.error ? 500 : 200;
  return NextResponse.json(result, { status });
}

// Cron entry point.
export async function GET() {
  return run("30d");
}

// Admin "Sync now" button. Accepts an optional timeframe override.
export async function POST(request: Request) {
  let timeframe = "30d";
  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body.timeframe === "string" && ["24h", "7d", "14d", "30d", "90d", "all"].includes(body.timeframe)) {
      timeframe = body.timeframe;
    }
  } catch {
    /* default */
  }
  return run(timeframe);
}
