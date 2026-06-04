import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// Shared LeadPipe visitor mapping + upsert. Used by BOTH ingestion paths:
//   - /api/leadpipe-webhook        (push — real-time, if a dashboard webhook
//                                    is ever configured)
//   - /api/admin/leadpipe-sync     (pull — scheduled + manual, the primary
//                                    path; uses the REST API + API key)
//
// LeadPipe documents two payload shapes (flat snake_case vs nested
// person/company/visit) and the REST /v1/data record schema is undocumented,
// so normalizeVisitor reads from both shapes and upsertVisitor always stores
// the full raw record in raw_payload as a safety net.
// ============================================================================

export type RawBody = Record<string, unknown>;

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
export function normalizeVisitor(body: RawBody) {
  const person = (body.person as RawBody) || {};
  const company = (body.company as RawBody) || {};
  const visit = (body.visit as RawBody) || {};

  const pagesRaw = (visit.pages as unknown) ?? (body.pages_viewed as unknown) ?? null;
  const pages = Array.isArray(pagesRaw) ? pagesRaw.map((p) => String(p)) : null;

  const email =
    (
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
      asString(person.linkedIn) ?? asString(person.linkedin) ?? asString(body.linkedin_url),
    company_name: asString(company.name) ?? asString(body.company_name),
    company_domain:
      asString(company.website) ?? asString(company.domain) ?? asString(body.company_domain),
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
    timestamp: asString(body.timestamp) ?? asString(body.identifiedAt) ?? asString(body.lastSeenAt),
  };
}

/**
 * Normalize a raw LeadPipe record and upsert it into site_visitors.
 * Dedupes by lowercased email; on a returning visitor it refreshes the data
 * fields, merges page lists, and bumps visit_count WITHOUT disturbing the
 * human review state (status / reviewed_by / linked_* / notes).
 * Returns the action taken.
 */
export async function upsertVisitor(
  supabase: SupabaseClient,
  body: RawBody,
): Promise<"created" | "updated"> {
  const n = normalizeVisitor(body);
  const ts =
    n.timestamp && !Number.isNaN(new Date(n.timestamp).getTime())
      ? new Date(n.timestamp).toISOString()
      : new Date().toISOString();

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

  if (n.email) {
    const { data: existing } = await supabase
      .from("site_visitors")
      .select("id, visit_count, first_page, identified_at, pages_viewed")
      .eq("email", n.email)
      .maybeSingle();

    if (existing) {
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
      return "updated";
    }
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
  return "created";
}

/**
 * Pull resolved visitors from the LeadPipe REST API and upsert them.
 * Paginated (50/page). Returns counts. Server-side only — needs LEADPIPE_API_KEY.
 */
export async function syncVisitorsFromLeadPipe(
  supabase: SupabaseClient,
  opts: { timeframe?: string; maxPages?: number } = {},
): Promise<{ fetched: number; created: number; updated: number; pages: number; error?: string }> {
  const apiKey = process.env.LEADPIPE_API_KEY;
  if (!apiKey) return { fetched: 0, created: 0, updated: 0, pages: 0, error: "LEADPIPE_API_KEY not set" };

  const timeframe = opts.timeframe || "30d";
  const maxPages = opts.maxPages ?? 40; // safety cap (40 * 50 = 2000 records)
  let page = 1;
  let fetched = 0;
  let created = 0;
  let updated = 0;

  while (page <= maxPages) {
    const url = `https://api.aws53.cloud/v1/data?timeframe=${encodeURIComponent(timeframe)}&page=${page}`;
    let json: { data?: RawBody[]; meta?: { hasMore?: boolean; totalPages?: number } };
    try {
      const res = await fetch(url, { headers: { "X-API-Key": apiKey } });
      if (!res.ok) {
        return { fetched, created, updated, pages: page - 1, error: `LeadPipe API ${res.status}` };
      }
      json = await res.json();
    } catch (err) {
      return {
        fetched,
        created,
        updated,
        pages: page - 1,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    const records = Array.isArray(json.data) ? json.data : [];
    for (const rec of records) {
      fetched++;
      try {
        const action = await upsertVisitor(supabase, rec);
        if (action === "created") created++;
        else updated++;
      } catch {
        // Skip a bad record; raw_payload of good ones is still saved.
      }
    }

    const hasMore = json.meta?.hasMore ?? (json.meta?.totalPages ? page < json.meta.totalPages : false);
    if (!hasMore || records.length === 0) break;
    page++;
  }

  return { fetched, created, updated, pages: page };
}
