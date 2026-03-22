import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET — Fetch tasks (optionally filtered by investor, status, date range)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const investorId = searchParams.get("investorId");
  const status = searchParams.get("status") || "pending"; // pending | completed | all
  const days = parseInt(searchParams.get("days") || "14"); // lookahead window

  const supabase = createServerClient();

  let query = supabase
    .from("tasks")
    .select("*, investors(id, first_name, last_name, email, category)")
    .order("due_date", { ascending: true });

  if (investorId) {
    query = query.eq("investor_id", investorId);
  }

  if (status === "pending") {
    query = query.eq("completed", false);
    // Show overdue + upcoming within window
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    query = query.lte("due_date", futureDate.toISOString().split("T")[0]);
  } else if (status === "completed") {
    query = query.eq("completed", true).order("completed_at", { ascending: false }).limit(50);
  }
  // status === "all" → no filter

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Separate into overdue, today, upcoming
  const today = new Date().toISOString().split("T")[0];
  const categorized = {
    overdue: (data || []).filter((t) => !t.completed && t.due_date < today),
    today: (data || []).filter((t) => !t.completed && t.due_date === today),
    upcoming: (data || []).filter((t) => !t.completed && t.due_date > today),
    completed: (data || []).filter((t) => t.completed),
    total: data?.length || 0,
  };

  return NextResponse.json(categorized);
}

// POST — Create a new task
export async function POST(request: Request) {
  const body = await request.json();
  const { investor_id, title, description, type, due_date, priority } = body;

  if (!title || !due_date) {
    return NextResponse.json({ error: "Title and due date required" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      investor_id: investor_id || null,
      title,
      description: description || null,
      type: type || "follow_up",
      due_date,
      priority: priority || "normal",
    })
    .select("*, investors(id, first_name, last_name, email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH — Update task (complete, reschedule, edit)
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Task ID required" }, { status: 400 });
  }

  const supabase = createServerClient();

  // If completing, set completed_at
  if (updates.completed === true) {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select("*, investors(id, first_name, last_name, email)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE — Remove a task
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task ID required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
