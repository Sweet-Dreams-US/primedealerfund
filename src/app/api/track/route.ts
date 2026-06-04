import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * First-party pageview beacon. Called fire-and-forget from <TrafficBeacon/>
 * on every public page load / client navigation. Records one row per unique
 * browser per day (deduped by visitor_id) and counts repeat views in `hits`,
 * so the admin can compare total site traffic vs the LeadPipe-identified
 * subset. Admin pages are excluded client-side.
 */
export async function POST(request: Request) {
  try {
    const { visitor_id, path } = await request.json();
    if (typeof visitor_id !== "string" || visitor_id.length < 6 || visitor_id.length > 100) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const cleanPath = typeof path === "string" ? path.slice(0, 300) : null;
    const day = new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD

    const supabase = createServerClient();
    const { data: existing } = await supabase
      .from("site_traffic")
      .select("hits")
      .eq("day", day)
      .eq("visitor_id", visitor_id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("site_traffic")
        .update({ hits: (existing.hits ?? 1) + 1, last_path: cleanPath, updated_at: new Date().toISOString() })
        .eq("day", day)
        .eq("visitor_id", visitor_id);
    } else {
      await supabase
        .from("site_traffic")
        .insert({ day, visitor_id, hits: 1, first_path: cleanPath, last_path: cleanPath });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
