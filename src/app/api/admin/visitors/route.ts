import { NextResponse } from "next/server";
import { createServerClient, getSessionEmail } from "@/lib/supabase";

// GET — list identified visitors. Filters: status, search (name/email/company).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const supabase = createServerClient();
  let query = supabase
    .from("site_visitors")
    .select("*")
    .order("last_seen_at", { ascending: false, nullsFirst: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%,job_title.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Lightweight summary for the metric cards.
  const { data: all } = await supabase
    .from("site_visitors")
    .select("status, company_domain, company_name, enrichment_level, last_seen_at");
  const now = Date.now();
  const weekAgo = now - 7 * 86_400_000;
  // Business-grade = a real company match or any enrichment beyond email-only.
  // Email-only / no-company matches are the unreliable residential ones.
  const isBiz = (v: { company_name: string | null; enrichment_level: string | null }) =>
    !!v.company_name || (!!v.enrichment_level && v.enrichment_level !== "email_only");
  const summary = {
    total: all?.length ?? 0,
    businessGrade: (all || []).filter(isBiz).length,
    new: (all || []).filter((v) => v.status === "new").length,
    thisWeek: (all || []).filter(
      (v) => v.last_seen_at && new Date(v.last_seen_at).getTime() >= weekAgo
    ).length,
    companies: new Set((all || []).map((v) => v.company_domain).filter(Boolean)).size,
  };

  return NextResponse.json({ visitors: data, summary });
}

// PATCH — update review fields (status, notes). Stamps reviewer + flips a
// fresh "new" visitor to "reviewed" automatically when notes are added.
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const reviewer = await getSessionEmail();
  if (reviewer && (updates.status || updates.notes)) {
    updates.reviewed_by = reviewer;
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_visitors")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — actions. action='add_lead' converts a visitor into an investors
// (CRM contact) row, links it back, and marks the visitor 'promoted'.
export async function POST(request: Request) {
  const { action, id } = await request.json();
  if (action !== "add_lead") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const supabase = createServerClient();
  const { data: v, error: vErr } = await supabase
    .from("site_visitors")
    .select("*")
    .eq("id", id)
    .single();
  if (vErr || !v) {
    return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
  }

  const createdBy = await getSessionEmail();

  // If we already linked an investor, don't create a duplicate.
  if (v.linked_investor_id) {
    return NextResponse.json({ ok: true, investorId: v.linked_investor_id, already: true });
  }

  // Reuse an existing investor with the same email if one exists.
  let investorId: string | null = null;
  if (v.email) {
    const { data: existingInv } = await supabase
      .from("investors")
      .select("id")
      .eq("email", v.email)
      .maybeSingle();
    investorId = existingInv?.id ?? null;
  }

  if (!investorId) {
    const companyLine = v.company_name
      ? `Company: ${v.company_name}${v.company_domain ? ` (${v.company_domain})` : ""}`
      : "";
    const locLine = [v.city, v.state, v.country].filter(Boolean).join(", ");
    const pages = Array.isArray(v.pages_viewed) ? v.pages_viewed.join(", ") : "";
    const notes = [
      "Identified on the website via LeadPipe.",
      v.job_title ? `Title: ${v.job_title}` : "",
      companyLine,
      locLine ? `Location: ${locLine}` : "",
      pages ? `Pages viewed: ${pages}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const { data: newInv, error: insErr } = await supabase
      .from("investors")
      .insert({
        first_name: v.first_name || (v.email ? v.email.split("@")[0] : "Unknown"),
        last_name: v.last_name || null,
        email: v.email || null,
        phone: v.phone || null,
        title: v.job_title || null,
        linkedin_url: v.linkedin_url || null,
        category: "New Lead",
        channel: "channel_1_industry",
        role_type: "investor",
        priority: "medium",
        source: "LeadPipe",
        created_by: createdBy,
        amount_of_interest: 0,
        amount_invested: 0,
        zoom_scheduled: false,
        zoom_completed: false,
        docs_sent: false,
        invested: false,
        email_sequence: 0,
        notes,
      })
      .select("id")
      .single();

    if (insErr || !newInv) {
      return NextResponse.json(
        { error: `Could not create lead: ${insErr?.message ?? "unknown"}` },
        { status: 500 }
      );
    }
    investorId = newInv.id;
  }

  await supabase
    .from("site_visitors")
    .update({ status: "promoted", linked_investor_id: investorId, reviewed_by: createdBy })
    .eq("id", id);

  return NextResponse.json({ ok: true, investorId });
}
