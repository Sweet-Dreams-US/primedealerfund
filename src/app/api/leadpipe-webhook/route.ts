import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";
import { upsertVisitor, type RawBody } from "@/lib/leadpipe";

/**
 * LeadPipe webhook receiver — OPTIONAL real-time push path.
 *
 * The primary ingestion path is the scheduled pull at /api/admin/leadpipe-sync
 * (uses the REST API + LEADPIPE_API_KEY, needs no dashboard setup). This
 * endpoint only does anything if a webhook is registered in the LeadPipe
 * dashboard pointing here, with a signing secret stored as
 * LEADPIPE_WEBHOOK_SECRET.
 *
 * Auth: LeadPipe sends `x-leadpipe-signature` whose value equals the webhook
 * secret (plain shared secret, NOT an HMAC). Compared constant-time.
 *
 * Mapping + upsert are shared with the pull sync via src/lib/leadpipe.ts so
 * both paths behave identically and store the full raw payload.
 */

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Verify the x-leadpipe-signature header. Accepts either configuration so the
 * webhook works whether HMAC signatures are toggled ON or OFF in the LeadPipe
 * dashboard:
 *   - HMAC OFF: header is the raw shared secret.
 *   - HMAC ON:  header is HMAC-SHA256(rawBody, secret), hex or base64,
 *               with an optional "sha256=" prefix.
 * Every accepted form still requires knowledge of the secret.
 */
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  const sig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  const candidates = [
    secret, // HMAC off — plain shared secret
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    crypto.createHmac("sha256", secret).update(rawBody).digest("base64"),
  ];
  return candidates.some((c) => safeEq(sig, c));
}

export async function POST(request: Request) {
  const rawPayload = await request.text();
  const signature = request.headers.get("x-leadpipe-signature") || "";

  const secret = process.env.LEADPIPE_WEBHOOK_SECRET || "";
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }
  if (!verifySignature(rawPayload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: RawBody;
  try {
    body = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const action = await upsertVisitor(createServerClient(), body);
    return NextResponse.json({ ok: true, action });
  } catch (err) {
    console.error("[leadpipe-webhook] write failed", err);
    return NextResponse.json(
      { error: `Write failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
