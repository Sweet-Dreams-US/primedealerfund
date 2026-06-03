-- ============================================================================
-- site_visitors — Applied 2026-06-03 via Supabase MCP (site_visitors_leadpipe).
-- Repo record of the live migration.
--
-- Stores identified website visitors from LeadPipe (populated by
-- /api/leadpipe-webhook, reviewed in the admin "Visitors" tab). raw_payload
-- always captures the full webhook body since LeadPipe documents two payload
-- shapes (flat snake_case vs nested person/company/visit).
-- ============================================================================
create table if not exists public.site_visitors (
  id                 uuid primary key default gen_random_uuid(),
  email              text,
  first_name         text,
  last_name          text,
  phone              text,
  job_title          text,
  seniority          text,
  linkedin_url       text,
  company_name       text,
  company_domain     text,
  company_industry   text,
  company_size       text,
  company_revenue    text,
  city               text,
  state              text,
  country            text,
  first_page         text,
  last_page          text,
  pages_viewed       jsonb,
  referrer           text,
  visit_duration     integer,
  visit_count        integer default 1,
  identified_at      timestamptz,
  last_seen_at       timestamptz,
  status             text not null default 'new'
    check (status in ('new','reviewed','contacted','promoted','dismissed')),
  reviewed_by        text,
  linked_investor_id uuid references public.investors(id) on delete set null,
  linked_firm_id     uuid references public.firms(id) on delete set null,
  notes              text,
  raw_payload        jsonb,
  created_at         timestamptz default now() not null,
  updated_at         timestamptz default now() not null
);

create unique index if not exists site_visitors_email_uniq
  on public.site_visitors (email) where email is not null;
create index if not exists site_visitors_status_idx     on public.site_visitors (status);
create index if not exists site_visitors_last_seen_idx  on public.site_visitors (last_seen_at desc);
create index if not exists site_visitors_company_idx    on public.site_visitors (company_domain);

drop trigger if exists site_visitors_set_updated_at on public.site_visitors;
create trigger site_visitors_set_updated_at
  before update on public.site_visitors
  for each row execute function public.update_updated_at();

alter table public.site_visitors enable row level security;
