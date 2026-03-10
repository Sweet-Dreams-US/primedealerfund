import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/microsoft-graph";

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Book endpoint error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
