import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServerClient();

  const [investorsRes, commsRes, formsRes] = await Promise.all([
    supabase.from("investors").select("id, category, amount_of_interest, amount_invested, invested, zoom_completed, friend_of_ralph"),
    supabase.from("communication_log").select("id, date").order("date", { ascending: false }).limit(5),
    supabase.from("form_submissions").select("id, status, type, created_at").order("created_at", { ascending: false }).limit(10),
  ]);

  const investors = investorsRes.data || [];

  const categories: Record<string, number> = {};
  let totalInterest = 0;
  let totalInvested = 0;
  let currentInvestors = 0;
  let zoomsCompleted = 0;
  let friendsOfRalph = 0;

  for (const inv of investors) {
    categories[inv.category] = (categories[inv.category] || 0) + 1;
    totalInterest += Number(inv.amount_of_interest) || 0;
    totalInvested += Number(inv.amount_invested) || 0;
    if (inv.invested) currentInvestors++;
    if (inv.zoom_completed) zoomsCompleted++;
    if (inv.friend_of_ralph) friendsOfRalph++;
  }

  return NextResponse.json({
    totalInvestors: investors.length,
    categories,
    totalInterest,
    totalInvested,
    currentInvestors,
    zoomsCompleted,
    friendsOfRalph,
    recentComms: commsRes.data || [],
    recentForms: formsRes.data || [],
    newFormCount: (formsRes.data || []).filter((f: { status: string }) => f.status === "new").length,
  });
}
