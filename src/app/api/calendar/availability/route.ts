import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/microsoft-graph";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Missing or invalid date parameter (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  // Don't allow dates in the past or more than 30 days out
  const requested = new Date(date + "T12:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  if (requested < today || requested > maxDate) {
    return NextResponse.json(
      { error: "Date must be within the next 30 days" },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date);
    return NextResponse.json({ date, slots });
  } catch (err) {
    console.error("Availability error:", err);
    return NextResponse.json(
      { error: "Unable to fetch availability. Please try again." },
      { status: 500 }
    );
  }
}
