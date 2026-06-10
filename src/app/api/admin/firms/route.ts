import { NextResponse } from "next/server";
import { createServerClient, getSessionEmail } from "@/lib/supabase";

// mandate_areas is a Postgres text[] — accept either a real array or a
// comma-separated string from the form and normalize to string[] | null.
function normalizeMandateAreas(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const clean = value.map((v) => String(v).trim()).filter(Boolean);
    return clean.length ? clean : null;
  }
  if (typeof value === "string" && value.trim()) {
    const clean = value.split(",").map((s) => s.trim()).filter(Boolean);
    return clean.length ? clean : null;
  }
  return null;
}

// GET — list firms. Optional filters: channel, firm_type, priority, state, search.
// Each firm includes a contact count from the linked investors rows.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel");
  const firmType = searchParams.get("firm_type");
  const priority = searchParams.get("priority");
  const state = searchParams.get("state");
  const search = searchParams.get("search");

  const supabase = createServerClient();
  let query = supabase
    .from("firms")
    .select("*, contacts:investors(count)")
    .order("name", { ascending: true });

  if (channel && channel !== "all") query = query.eq("channel", channel);
  if (firmType && firmType !== "all") query = query.eq("firm_type", firmType);
  if (priority && priority !== "all") query = query.eq("priority", priority);
  if (state) query = query.eq("state", state.toUpperCase());
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,city.ilike.%${search}%,notes.ilike.%${search}%,recent_activity.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST — create a firm. name, firm_type, channel are required.
export async function POST(request: Request) {
  const body = await request.json();
  const { name, firm_type, channel } = body;

  if (!name || !firm_type || !channel) {
    return NextResponse.json(
      { error: "Name, firm type, and channel are required" },
      { status: 400 }
    );
  }

  const createdBy = await getSessionEmail();
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("firms")
    .insert({
      created_by: createdBy,
      name,
      firm_type,
      channel,
      city: body.city || null,
      state: body.state ? String(body.state).toUpperCase() : null,
      country: body.country || "US",
      website: body.website || null,
      linkedin_url: body.linkedin_url || null,
      hq_address: body.hq_address || null,
      founded_year: body.founded_year || null,
      aum_usd: body.aum_usd || null,
      source_of_wealth: body.source_of_wealth || null,
      mandate_areas: normalizeMandateAreas(body.mandate_areas),
      recent_activity: body.recent_activity || null,
      priority: body.priority || "medium",
      regulatory_note: body.regulatory_note || null,
      intro_path: body.intro_path || null,
      draft_email_subject: body.draft_email_subject || null,
      draft_email_body: body.draft_email_body || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PATCH — update a firm by id.
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Firm ID required" }, { status: 400 });
  }

  // Normalize the array column if the caller included it.
  if ("mandate_areas" in updates) {
    updates.mandate_areas = normalizeMandateAreas(updates.mandate_areas);
  }
  if (typeof updates.state === "string" && updates.state) {
    updates.state = updates.state.toUpperCase();
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("firms")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE — remove a firm. Linked investors are kept; their firm_id is set to
// null automatically by the ON DELETE SET NULL foreign key.
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Firm ID required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("firms").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
