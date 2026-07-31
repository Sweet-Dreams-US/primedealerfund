/**
 * Pure, client-safe helpers for turning a LeadPipe-identified visitor into a
 * single best outreach recipient. No server/database deps, so it runs in the
 * browser (used by the admin composer to draft investor-call outreach).
 */

export type ContactCandidate = {
  email: string | null;
  all_emails: string[] | null;
  first_name: string | null;
  last_name: string | null;
  company_domain: string | null;
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "me.com", "live.com", "msn.com", "proton.me",
  "protonmail.com", "gmx.com", "ymail.com",
]);

const ROLE_LOCAL_PARTS = new Set([
  "info", "admin", "sales", "support", "contact", "hello", "office",
  "team", "billing", "noreply", "no-reply", "help", "service",
]);

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function normDomain(d: string | null): string {
  return (d || "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").trim();
}

/**
 * Pick the single most likely real, personal email from a visitor's primary
 * email + all_emails. Each candidate is scored on a corporate-domain match,
 * name match, and "looks like a real personal mailbox" signals; LeadPipe's own
 * primary pick breaks ties. Returns null when there is no valid email at all.
 */
export function mostLikelyEmail(v: ContactCandidate): string | null {
  const raw = [v.email, ...(v.all_emails || [])]
    .filter(Boolean)
    .map((e) => String(e).trim().toLowerCase());
  const candidates = Array.from(new Set(raw)).filter(isValidEmail);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const first = (v.first_name || "").toLowerCase().trim();
  const last = (v.last_name || "").toLowerCase().trim();
  const company = normDomain(v.company_domain);
  const primary = (v.email || "").toLowerCase().trim();

  const score = (e: string): number => {
    const [local, domain] = e.split("@");
    let s = 0;
    if (company && domain === company) s += 5;              // corporate mailbox
    if (first.length >= 2 && local.includes(first)) s += 3; // name in local part
    if (last.length >= 2 && local.includes(last)) s += 2;
    if (!ROLE_LOCAL_PARTS.has(local)) s += 1;               // not a role inbox
    if (!/^\d+$/.test(local) && local.length >= 3) s += 1;  // not "4@gmail" junk
    if (!FREE_EMAIL_DOMAINS.has(domain)) s += 1;            // business domain
    if (e === primary) s += 0.5;                            // LeadPipe's own pick
    return s;
  };

  return candidates.slice().sort((a, b) => score(b) - score(a))[0];
}

/**
 * A clean, title-cased first name suitable for a greeting, or null when there
 * is no real name to address them by — so the caller can skip that person
 * rather than send "Hi ,". LeadPipe often stores names lowercase.
 */
export function properFirstName(v: { first_name: string | null }): string | null {
  const f = (v.first_name || "").trim();
  if (f.length < 2 || !/[a-zA-Z]/.test(f)) return null;
  const token = f.split(/\s+/)[0];
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

/**
 * Starter outreach template seeded into the composer when adding LeadPipe
 * contacts (only if the composer is empty). Greets via {{first_name}}; the
 * branded HTML wrapper appends Ralph's signature, so none is included here.
 * Investor-facing language — have counsel review before wide use.
 */
export const LEADPIPE_OUTREACH_TEMPLATE = {
  subject: "A quick call about Prime Dealer Equity Fund?",
  body: `Hi {{first_name}},

I noticed some interest in Prime Dealer Equity Fund and wanted to reach out personally. We co-invest alongside Coleman Automotive Group to acquire and operate franchise car dealerships across the U.S., targeting a minimum 8% annual distribution to fund investors.

We're opening a limited round to accredited investors, and I'd welcome a short call to walk you through the thesis and see whether it's a fit.

You can grab a time that works here: https://www.primedealerfund.com/schedule

This message is intended for accredited investors only and is not an offer to sell or a solicitation to buy any security. Investing involves risk, including possible loss of principal. More at https://www.primedealerfund.com/disclosures.`,
};
