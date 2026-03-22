import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const investorId = searchParams.get("investorId");

  const supabase = createServerClient();
  let query = supabase
    .from("communication_log")
    .select("*, investors(first_name, last_name, email)")
    .order("date", { ascending: false });

  if (investorId) {
    query = query.eq("investor_id", investorId);
  }

  const { data, error } = await query.limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { investor_id, date, type, subject, response, next_step } = body;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("communication_log")
    .insert({ investor_id, date, type, subject, response, next_step })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
