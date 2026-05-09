import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";

/**
 * Resend webhook receiver.
 *
 * Configure in the Resend dashboard:
 *   URL:    https://primedealerfund.com/api/resend-webhook
 *   Events: email.bounced, email.complained
 *
 * Resend signs every payload with Svix, which ships three headers:
 *   svix-id          unique id for this delivery attempt
 *   svix-timestamp   unix seconds when the payload was sent
 *   svix-signature   space-separated list of "v1,<base64-hmac>" signatures
 *
 * The signing input is `${id}.${timestamp}.${rawPayload}`, and the secret
 * starts with "whsec_" — strip the prefix and base64-decode the rest before
 * using it as the HMAC key.
 *
 * Auth lives entirely in the signature check. No admin login is required
 * because Resend can't carry one.
 */

const SECRET_HEADER_PREFIX = "whsec_";

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Verify the Svix signature on a Resend webhook request.
 * Returns true if any of the comma/space-separated signatures match.
 */
function verifySvixSignature(
  rawPayload: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  secret: string,
): boolean {
  if (!svixId || !svixTimestamp || !svixSignature || !secret) return false;

  // Reject anything older than 5 minutes — protects against replay.
  const ts = Number(svixTimestamp);
  if (!Number.isFinite(ts)) return false;
  const driftSeconds = Math.abs(Math.floor(Date.now() / 1000) - ts);
  if (driftSeconds > 300) return false;

  const keyB64 = secret.startsWith(SECRET_HEADER_PREFIX)
    ? secret.slice(SECRET_HEADER_PREFIX.length)
    : secret;
  const key = Buffer.from(keyB64, "base64");

  const signedPayload = `${svixId}.${svixTimestamp}.${rawPayload}`;
  const expected = crypto
    .createHmac("sha256", key)
    .update(signedPayload)
    .digest("base64");

  // Header is "v1,<sig> v1,<sig>..." — accept if any v1 entry matches.
  for (const part of svixSignature.split(" ")) {
    const [version, sig] = part.split(",");
    if (version !== "v1" || !sig) continue;
    if (timingSafeEqual(sig, expected)) return true;
  }
  return false;
}

/**
 * Mark an email as bounced everywhere — investors row + audit log.
 * Idempotent: re-running for the same email is safe (just appends a new
 * audit row with the latest reason).
 */
async function markBounced(opts: {
  email: string;
  reason: string | null;
  source: string;
  rawPayload: unknown;
}) {
  const supabase = createServerClient();
  const lowerEmail = opts.email.toLowerCase();

  // Find any matching investor (case-insensitive). Multiple investors with
  // the same email is unlikely but possible — flag all of them.
  const { data: matchingInvestors } = await supabase
    .from("investors")
    .select("id, email")
    .ilike("email", lowerEmail);

  const investorIds = (matchingInvestors || []).map((i) => i.id);

  // Always insert an audit row so manual recipients get blocked too.
  await supabase.from("email_bounces").insert({
    email: lowerEmail,
    investor_id: investorIds[0] || null,
    source: opts.source,
    reason: opts.reason,
    raw_payload: opts.rawPayload as object,
  });

  // Flip the denormalized flag on every matching investor.
  if (investorIds.length > 0) {
    await supabase
      .from("investors")
      .update({
        email_bounced: true,
        email_bounced_at: new Date().toISOString(),
        email_bounce_reason: opts.reason,
        email_bounce_source: opts.source,
      })
      .in("id", investorIds);
  }
}

export async function POST(request: Request) {
  // Read raw body BEFORE parsing so the signature check sees the exact bytes
  // Resend signed.
  const rawPayload = await request.text();
  const svixId = request.headers.get("svix-id") || "";
  const svixTimestamp = request.headers.get("svix-timestamp") || "";
  const svixSignature = request.headers.get("svix-signature") || "";

  const secret = process.env.RESEND_WEBHOOK_SECRET || "";
  if (!secret) {
    console.error("[resend-webhook] RESEND_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  if (!verifySvixSignature(rawPayload, svixId, svixTimestamp, svixSignature, secret)) {
    console.warn("[resend-webhook] Signature verification failed", { svixId });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type || "";
  const data = event.data || {};

  // Resend's bounce + complaint payloads share a similar shape:
  //   { type: 'email.bounced', data: { to: ['x@y.com', ...], bounce: { ... } } }
  //   { type: 'email.complained', data: { to: ['x@y.com', ...] } }
  // We only act on these two — opens, deliveries, sends, etc. are ignored.
  if (eventType !== "email.bounced" && eventType !== "email.complained") {
    return NextResponse.json({ ok: true, ignored: eventType });
  }

  const toRaw = data.to;
  const recipients: string[] = Array.isArray(toRaw)
    ? toRaw.map(String).filter(Boolean)
    : typeof toRaw === "string"
    ? [toRaw]
    : [];

  if (recipients.length === 0) {
    return NextResponse.json({ ok: true, marked: 0 });
  }

  // Pull a human-readable reason — bounce object on bounced events,
  // generic "spam complaint" on complaint events.
  let reason: string | null = null;
  if (eventType === "email.bounced") {
    const bounce = data.bounce as Record<string, unknown> | undefined;
    if (bounce) {
      const subType = bounce.subType || bounce.type;
      const message = bounce.message || bounce.diagnosticCode;
      reason = [subType, message].filter(Boolean).join(" — ") || "Bounced";
    } else {
      reason = "Bounced";
    }
  } else {
    reason = "Spam complaint";
  }

  // Process recipients in parallel — the ops are idempotent.
  await Promise.all(
    recipients.map((email) =>
      markBounced({
        email,
        reason,
        source: `resend-webhook:${eventType}`,
        rawPayload: event,
      }),
    ),
  );

  return NextResponse.json({ ok: true, marked: recipients.length, type: eventType });
}
