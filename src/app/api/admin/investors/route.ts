import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const friendOfRalph = searchParams.get("friendOfRalph");

  const supabase = createServerClient();
  let query = supabase
    .from("investors")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (friendOfRalph === "true") {
    query = query.eq("friend_of_ralph", true);
  }

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,notes.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { first_name, last_name, email, phone, category, notes, source, friend_of_ralph, amount_of_interest } = body;

  if (!first_name) {
    return NextResponse.json({ error: "First name is required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("investors")
    .insert({
      first_name,
      last_name: last_name || null,
      email: email || null,
      phone: phone || null,
      category: category || "New Lead",
      notes: notes || null,
      source: source || "Admin Added",
      friend_of_ralph: friend_of_ralph || false,
      amount_of_interest: amount_of_interest || 0,
      amount_invested: 0,
      zoom_scheduled: false,
      zoom_completed: false,
      docs_sent: false,
      invested: false,
      email_sequence: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const supabase = createServerClient();

  // Smart category auto-progression
  // Get current state first
  const { data: current } = await supabase
    .from("investors")
    .select("category, zoom_completed, docs_sent, invested, amount_invested")
    .eq("id", id)
    .single();

  if (current) {
    const merged = { ...current, ...updates };

    // If invested flag just turned on or amount_invested set → "Current Investor"
    if ((updates.invested === true || (updates.amount_invested && updates.amount_invested > 0)) && current.category !== "Current Investor") {
      updates.category = "Current Investor";
    }
    // If zoom completed and not invested → "Had Zoom - No Commitment"
    else if (merged.zoom_completed && !merged.invested && current.category === "New Lead") {
      updates.category = "Had Zoom - No Commitment";
    }

    // Auto-create follow-up task when zoom is marked complete
    if (updates.zoom_completed === true && !current.zoom_completed) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await supabase.from("tasks").insert({
        investor_id: id,
        title: "Send fund docs after Zoom meeting",
        type: "follow_up",
        due_date: tomorrow.toISOString().split("T")[0],
        priority: "high",
      });
    }

    // Auto-create task when docs are sent
    if (updates.docs_sent === true && !current.docs_sent) {
      const followUp = new Date();
      followUp.setDate(followUp.getDate() + 7);
      await supabase.from("tasks").insert({
        investor_id: id,
        title: "Follow up on fund documentation review",
        type: "follow_up",
        due_date: followUp.toISOString().split("T")[0],
        priority: "normal",
      });
    }
  }

  const { data, error } = await supabase
    .from("investors")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
