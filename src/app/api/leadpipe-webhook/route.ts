import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";

/**
 * LeadPipe webhook receiver — identified website visitors.
 *
 * Configure in the LeadPipe dashboard (Integrations → Webhooks):
 *   Destination URL: https://primedealerfund.com/api/leadpipe-webhook
 *   Pixel:           Prime Dealer Fund - Production
 *   Trigger:         Every Update (enriches behavioral data; repeat visits
 *                    don't consume extra credits)
 *
 * Auth: LeadPipe sends an `x-leadpipe-signature` header whose value equals
 * your webhook secret (a plain shared secret, NOT an HMAC — confirmed from
 * LeadPipe's own verification example). We compare it constant-time against
 * LEADPIPE_WEBHOOK_SECRET.
 *
 * Payload shape: LeadPipe documents two formats — a flat snake_case body
 * and a nested person/company/visit body. We normalize both and always
 * persist the raw payload so nothing is lost if the mapping misses a field.
 */

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

type RawBody = Record<string, unknown>;

function asString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return null;
}

function asInt(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

/** Map either payload shape (nested person/company/visit OR flat snake_case)
 *  into our canonical column set. */
function normalize(body: RawBody) {
  const person = (body.person as RawBody) || {};
  const company = (body.company as RawBody) || {};
  const visit = (body.visit as RawBody) || {};

  const pagesRaw = (visit.pages as unknown) ?? (body.pages_viewed as unknown) ?? null;
  const pages = Array.isArray(pagesRaw) ? pagesRaw.map((p) => String(p)) : null;

  const email = (
    asString(person.email) ||
    asString(body.email) ||
    asString(person.personalEmail) ||
    ""
  ).toLowerCase() || null;

  const lastPage =
    (pages && pages.length ? pages[pages.length - 1] : null) ||
    asString(body.page_url) ||
    asString(visit.url);
  const firstPage = (pages && pages.length ? pages[0] : null) || asString(body.page_url);

  return {
    email,
    first_name: asString(person.firstName) ?? asString(body.first_name),
    last_name: asString(person.lastName) ?? asString(body.last_name),
    phone: asString(person.phone) ?? asString(body.phone),
    job_title: asString(person.jobTitle) ?? asString(body.job_title),
    seniority: asString(person.seniority) ?? asString(body.seniority),
    linkedin_url:
      asString(person.linkedIn) ??
      asString(person.linkedin) ??
      asString(body.linkedin_url),
    company_name: asString(company.name) ?? asString(body.company_name),
    company_domain:
      asString(company.website) ??
      asString(company.domain) ??
      asString(body.company_domain),
    company_industry: asString(company.industry) ?? asString(body.industry),
    company_size:
      asString(company.employeeCount) ?? asString(body.employee_count) ?? asString(body.company_size),
    company_revenue: asString(company.revenue) ?? asString(body.company_revenue),
    city: asString(body.city) ?? asString(person.city),
    state: asString(body.state) ?? asString(person.state),
    country: asString(body.country) ?? asString(person.country),
    first_page: firstPage,
    last_page: lastPage,
    pages_viewed: pages,
    referrer: asString(visit.referrer) ?? asString(body.referrer),
    visit_duration: asInt(visit.duration) ?? asInt(body.visit_duration),
    timestamp: asString(body.timestamp),
  };
}

export async function POST(request: Request) {
  const rawPayload = await request.text();
  const signature = request.headers.get("x-leadpipe-signature") || "";

  const secret = process.env.LEADPIPE_WEBHOOK_SECRET || "";
  if (!secret) {
    console.error("[leadpipe-webhook] LEADPIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }
  if (!timingSafeEqual(signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: RawBody;
  try {
    body = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const n = normalize(body);
  const ts = n.timestamp && !Number.isNaN(new Date(n.timestamp).getTime())
    ? new Date(n.timestamp).toISOString()
    : new Date().toISOString();

  const supabase = createServerClient();

  // Data fields shared by insert + update (workflow fields are NOT touched on update).
  const dataFields = {
    first_name: n.first_name,
    last_name: n.last_name,
    phone: n.phone,
    job_title: n.job_title,
    seniority: n.seniority,
    linkedin_url: n.linkedin_url,
    company_name: n.company_name,
    company_domain: n.company_domain,
    company_industry: n.company_industry,
    company_size: n.company_size,
    company_revenue: n.company_revenue,
    city: n.city,
    state: n.state,
    country: n.country,
    last_page: n.last_page,
    referrer: n.referrer,
    visit_duration: n.visit_duration,
    raw_payload: body,
  };

  try {
    if (n.email) {
      const { data: existing } = await supabase
        .from("site_visitors")
        .select("id, visit_count, first_page, identified_at, pages_viewed")
        .eq("email", n.email)
        .maybeSingle();

      if (existing) {
        // Merge page lists (unique, order-preserving).
        const prevPages: string[] = Array.isArray(existing.pages_viewed)
          ? (existing.pages_viewed as string[])
          : [];
        const merged = Array.from(new Set([...prevPages, ...(n.pages_viewed || [])]));

        await supabase
          .from("site_visitors")
          .update({
            ...dataFields,
            first_page: existing.first_page ?? n.first_page,
            pages_viewed: merged.length ? merged : null,
            identified_at: existing.identified_at ?? ts,
            last_seen_at: ts,
            visit_count: (existing.visit_count ?? 1) + 1,
          })
          .eq("id", existing.id);

        return NextResponse.json({ ok: true, action: "updated" });
      }

      await supabase.from("site_visitors").insert({
        email: n.email,
        ...dataFields,
        first_page: n.first_page,
        pages_viewed: n.pages_viewed,
        identified_at: ts,
        last_seen_at: ts,
        visit_count: 1,
        status: "new",
      });
      return NextResponse.json({ ok: true, action: "created" });
    }

    // No email — can't dedup; store anyway so the data isn't lost.
    await supabase.from("site_visitors").insert({
      ...dataFields,
      first_page: n.first_page,
      pages_viewed: n.pages_viewed,
      identified_at: ts,
      last_seen_at: ts,
      visit_count: 1,
      status: "new",
    });
    return NextResponse.json({ ok: true, action: "created_no_email" });
  } catch (err) {
    console.error("[leadpipe-webhook] write failed", err);
    return NextResponse.json(
      { error: `Write failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
