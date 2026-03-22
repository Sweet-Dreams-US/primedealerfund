import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/microsoft-graph";
import { createServerClient } from "@/lib/supabase";

const TURNSTILE_SECRET = "0x4AAAAAACW5I3nMP3JcBGPk99Ew6exxAIg";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/a/macros/sweetdreams.us/s/AKfycbxeBJ7lABLRHUIZKkHEBcljPSArBOgt9mUM2thHkyaYqHNIGOTqqQInAJfior8C_lxSaw/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      turnstileToken,
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      investorType,
      accredited,
      capitalRange,
      timeline,
      referralSource,
      guestName,
      guestEmail,
    } = body;

    // Verify Turnstile
    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET,
          response: turnstileToken,
        }),
      }
    );
    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      return NextResponse.json(
        { error: "Bot verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Save to Google Sheets (all submissions, whether they book or not)
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "schedule",
          timestamp: new Date().toISOString(),
          firstName,
          lastName,
          email,
          phone,
          investorType,
          accredited,
          capitalRange,
          timeline,
          referralSource,
          scheduledDate: date,
          scheduledTime: time,
          guestName: guestName || "",
          guestEmail: guestEmail || "",
        }),
      });
    } catch (sheetErr) {
      console.error("Google Sheets error:", sheetErr);
    }

    // Create calendar event
    const result = await createBooking({
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      investorType,
      capitalRange,
      guestName,
      guestEmail,
    });

    if (!result.success) {
      console.error("Booking error:", result.error);
      return NextResponse.json(
        { error: "Unable to create booking. Please try again or contact us directly." },
        { status: 500 }
      );
    }

    // Auto-save lead to Supabase investors table + create task
    try {
      const supabase = createServerClient();

      // Check if investor already exists by email
      const { data: existing } = await supabase
        .from("investors")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      let investorId: string;

      if (existing) {
        // Update existing investor
        investorId = existing.id;
        await supabase
          .from("investors")
          .update({
            zoom_scheduled: true,
            last_contact_date: new Date().toISOString().split("T")[0],
            next_action: `Zoom scheduled for ${date} at ${time}`,
            next_action_date: date,
          })
          .eq("id", investorId);
      } else {
        // Create new investor from booking
        const capitalMap: Record<string, number> = {
          "100k-249k": 175000, "$100k-$249k": 175000,
          "250k-500k": 375000, "$250k-$500k": 375000,
          "500k-1m": 750000, "$500k-$1M": 750000,
          "1m-5m": 3000000, "$1M-$5M": 3000000,
          "5m+": 5000000, "$5M+": 5000000,
        };
        const interest = capitalMap[capitalRange] || 0;

        const { data: newInv } = await supabase
          .from("investors")
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            category: "New Lead",
            source: `Website Schedule${referralSource ? ` (${referralSource})` : ""}`,
            zoom_scheduled: true,
            amount_of_interest: interest,
            added_date: new Date().toISOString().split("T")[0],
            last_contact_date: new Date().toISOString().split("T")[0],
            next_action: `Zoom scheduled for ${date} at ${time}`,
            next_action_date: date,
            notes: `Investor type: ${investorType}\nAccredited: ${accredited}\nCapital range: ${capitalRange}\nTimeline: ${timeline}${guestName ? `\nGuest: ${guestName} (${guestEmail})` : ""}`,
          })
          .select("id")
          .single();

        investorId = newInv?.id || "";
      }

      // Log communication
      if (investorId) {
        await supabase.from("communication_log").insert({
          investor_id: investorId,
          date: new Date().toISOString().split("T")[0],
          type: "Zoom Meeting",
          subject: `Zoom scheduled: ${date} at ${time}`,
          response: "Pending",
          next_step: "Conduct meeting",
        });

        // Create follow-up task for after the meeting
        await supabase.from("tasks").insert({
          investor_id: investorId,
          title: `Follow up after Zoom with ${firstName} ${lastName}`,
          description: `Send docs and schedule follow-up call. Capital interest: ${capitalRange}`,
          type: "follow_up",
          due_date: date, // Due the day of the meeting
          priority: "high",
        });
      }

      // Also save to form_submissions
      await supabase.from("form_submissions").insert({
        type: "schedule",
        status: "processed",
        data: {
          firstName, lastName, email, phone,
          investorType, accredited, capitalRange,
          timeline, referralSource, date, time,
          guestName, guestEmail,
        },
      });
    } catch (dbErr) {
      console.error("Supabase save error:", dbErr);
      // Don't fail the booking response — calendar event was already created
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Book endpoint error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
