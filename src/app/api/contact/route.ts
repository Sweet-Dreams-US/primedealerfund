import { NextRequest, NextResponse } from "next/server";

const TURNSTILE_SECRET = "0x4AAAAAACW5I3nMP3JcBGPk99Ew6exxAIg";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { turnstileToken, ...formData } = body;

    // Verify Turnstile token
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

    // Forward to Google Apps Script
    const GOOGLE_SCRIPT_URL = "https://script.google.com/a/macros/sweetdreams.us/s/AKfycbxeBJ7lABLRHUIZKkHEBcljPSArBOgt9mUM2thHkyaYqHNIGOTqqQInAJfior8C_lxSaw/exec";
    {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
