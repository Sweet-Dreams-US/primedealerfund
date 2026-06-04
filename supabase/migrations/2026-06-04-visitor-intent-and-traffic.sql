-- ============================================================================
-- Visitor intent + first-party traffic — Applied 2026-06-04 via Supabase MCP
-- (visitor_intent_and_site_traffic). Repo record of the live migration.
-- ============================================================================

-- LeadPipe's intent signal per identified visitor.
alter table public.site_visitors
  add column if not exists intent_score text;

-- First-party visit counter for the admin's total-traffic-vs-identified
-- comparison. One row per unique browser per day (deduped by visitor_id);
-- hits counts repeat pageviews that day. Written by /api/track.
create table if not exists public.site_traffic (
  day         date not null,
  visitor_id  text not null,
  hits        int  not null default 1,
  first_path  text,
  last_path   text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  primary key (day, visitor_id)
);
create index if not exists site_traffic_day_idx on public.site_traffic (day);
alter table public.site_traffic enable row level security;
