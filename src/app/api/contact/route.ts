import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

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

    // Auto-save to Supabase
    try {
      const supabase = createServerClient();

      // Check if investor already exists
      const { data: existing } = formData.email
        ? await supabase.from("investors").select("id").eq("email", formData.email).maybeSingle()
        : { data: null };

      if (!existing && formData.firstName) {
        const capitalMap: Record<string, number> = {
          "100k-249k": 175000, "$100k-$249k": 175000,
          "250k-500k": 375000, "$250k-$500k": 375000,
          "500k-1m": 750000, "$500k-$1M": 750000,
          "1m-5m": 3000000, "$1M-$5M": 3000000,
          "5m+": 5000000, "$5M+": 5000000,
        };

        await supabase.from("investors").insert({
          first_name: formData.firstName,
          last_name: formData.lastName || null,
          email: formData.email || null,
          phone: formData.phone || null,
          category: "New Lead",
          source: "Website Contact Form",
          amount_of_interest: capitalMap[formData.investmentRange] || 0,
          added_date: new Date().toISOString().split("T")[0],
          notes: formData.message ? `Contact form message: ${formData.message}` : null,
        });
      }

      // Save form submission
      await supabase.from("form_submissions").insert({
        type: "contact",
        status: "new",
        data: formData,
      });
    } catch (dbErr) {
      console.error("Supabase contact save error:", dbErr);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
