-- ============================================================================
-- Prime Dealer Fund — Investor Outreach Schema Extension
-- Applied 2026-05-20 via Supabase MCP (migration:
--   outreach_channels_firms_and_investor_extensions).
-- This file is the repo record of that migration — already live in production.
--
-- Adds Channel 2 (buy-sell advisors) and Channel 3 (family office) support.
-- Additive only: new firms table, new nullable columns on investors, a view.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. New table: firms
-- ---------------------------------------------------------------------------
create table if not exists public.firms (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  firm_type           text not null check (firm_type in (
                        'buy_sell_advisor','cpa_dealer_practice','dealer_law_firm',
                        'wealth_advisor','family_office_sfo','family_office_mfo',
                        'peer_network','dealer_group','industry_association','other')),
  channel             text not null check (channel in (
                        'channel_1_industry','channel_2_buy_sell','channel_3_family_office')),
  city                text,
  state               text,
  country             text default 'US',
  website             text,
  linkedin_url        text,
  hq_address          text,
  founded_year        int,
  aum_usd             bigint,
  source_of_wealth    text,
  mandate_areas       text[],
  recent_activity     text,
  priority            text default 'medium' check (priority in ('top','high','medium','low','watch')),
  regulatory_note     text,
  intro_path          text,
  notes               text,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

create index if not exists firms_channel_idx      on public.firms (channel);
create index if not exists firms_firm_type_idx    on public.firms (firm_type);
create index if not exists firms_priority_idx     on public.firms (priority);
create index if not exists firms_state_idx        on public.firms (state);
create index if not exists firms_name_search_idx  on public.firms using gin (to_tsvector('english', name));

-- updated_at trigger (uniquely named to avoid clobbering any shared function)
create or replace function public.firms_set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists firms_set_updated_at on public.firms;
create trigger firms_set_updated_at
  before update on public.firms
  for each row execute function public.firms_set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. Extend investors table
-- ---------------------------------------------------------------------------
alter table public.investors
  add column if not exists firm_id uuid references public.firms(id) on delete set null,
  add column if not exists title text,
  add column if not exists linkedin_url text,
  add column if not exists role_type text default 'investor'
    check (role_type in ('investor','conduit','both')),
  add column if not exists channel text
    check (channel in ('channel_1_industry','channel_2_buy_sell','channel_3_family_office')),
  add column if not exists priority text default 'medium'
    check (priority in ('top','high','medium','low','watch')),
  add column if not exists introduced_by_investor_id uuid references public.investors(id),
  add column if not exists regulatory_note text;

create index if not exists investors_firm_id_idx       on public.investors (firm_id);
create index if not exists investors_channel_idx       on public.investors (channel);
create index if not exists investors_role_type_idx     on public.investors (role_type);
create index if not exists investors_priority_idx      on public.investors (priority);
create index if not exists investors_introduced_by_idx on public.investors (introduced_by_investor_id);

-- ---------------------------------------------------------------------------
-- 3. Backfill: existing investor rows belong to channel_1_industry
-- ---------------------------------------------------------------------------
update public.investors
   set channel = 'channel_1_industry',
       role_type = coalesce(role_type, 'investor')
 where channel is null;

-- ---------------------------------------------------------------------------
-- 4. Widen the category CHECK constraint to include Channel 2/3 stages.
--    (The original constraint allowed only the 5 Channel-1 categories.)
-- ---------------------------------------------------------------------------
alter table public.investors drop constraint if exists investors_category_check;
alter table public.investors add constraint investors_category_check
  check (category = any (array[
    -- Channel 1 — industry network
    'Never Responded','Had Zoom - No Commitment','Friend - Possible Investor',
    'Current Investor','New Lead',
    -- Channel 2 — buy-sell advisors
    'Identified','First Touch','Introductory Call','Active Conduit','Cold',
    -- Channel 3 — family offices
    'Discovery Call','Diligence','IC Review','Committed','Wired','Pass'
  ]));

-- ---------------------------------------------------------------------------
-- 5. View: outreach_pipeline — convenience join for the admin UI / Cowork
-- ---------------------------------------------------------------------------
create or replace view public.outreach_pipeline as
select
  i.id              as investor_id,
  i.first_name,
  i.last_name,
  i.email,
  i.title,
  i.linkedin_url,
  i.role_type,
  i.channel         as investor_channel,
  i.category,
  i.priority        as investor_priority,
  i.ball_in_court,
  i.last_outbound_at,
  i.last_inbound_at,
  i.amount_of_interest,
  i.amount_invested,
  i.invested,
  i.notes           as investor_notes,
  f.id              as firm_id,
  f.name            as firm_name,
  f.firm_type,
  f.channel         as firm_channel,
  f.priority        as firm_priority,
  f.city            as firm_city,
  f.state           as firm_state,
  f.website         as firm_website,
  f.source_of_wealth,
  f.mandate_areas,
  f.regulatory_note as firm_regulatory_note,
  f.intro_path
from public.investors i
left join public.firms f on f.id = i.firm_id;

-- ---------------------------------------------------------------------------
-- 6. Row-Level Security on firms — locked down; admin API uses the service
--    role, which bypasses RLS. anon/authenticated get no access (no policies).
-- ---------------------------------------------------------------------------
alter table public.firms enable row level security;
