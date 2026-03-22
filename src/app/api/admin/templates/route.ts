import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET — Fetch all templates, optionally filtered by sequence_group
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const group = searchParams.get("group");

  const supabase = createServerClient();

  let query = supabase
    .from("email_templates")
    .select("*")
    .order("sequence_group")
    .order("sequence_order");

  if (group) {
    query = query.eq("sequence_group", group);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group templates by sequence_group
  const groups: Record<string, typeof data> = {};
  for (const t of data || []) {
    const g = t.sequence_group || "Ungrouped";
    if (!groups[g]) groups[g] = [];
    groups[g].push(t);
  }

  return NextResponse.json({ templates: data, groups });
}

// POST — Create a new template
export async function POST(request: Request) {
  const body = await request.json();
  const { name, subject, body: templateBody, sequence_order, sequence_group, delay_days } = body;

  if (!name || !subject || !templateBody) {
    return NextResponse.json({ error: "Name, subject, and body required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("email_templates")
    .insert({
      name,
      subject,
      body: templateBody,
      sequence_order: sequence_order || 0,
      sequence_group: sequence_group || null,
      delay_days: delay_days || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH — Update a template
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Template ID required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("email_templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE — Remove a template
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Template ID required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("email_templates").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
