-- ============================================================================
-- investors.source += 'LeadPipe' — Applied 2026-06-09 via Supabase MCP
-- (investors_source_check_leadpipe). Repo record of the live migration.
--
-- The Visitors tab's "Add Lead" action (/api/admin/visitors POST) inserts
-- source='LeadPipe', which the previous check constraint rejected with
-- "violates check constraint investors_source_check" — so identified website
-- visitors could never be promoted into the CRM.
-- ============================================================================
alter table public.investors drop constraint if exists investors_source_check;
alter table public.investors add constraint investors_source_check
  check (source = any (array[
    'import'::text, 'form'::text, 'manual'::text, 'Admin Added'::text,
    'Referral'::text, 'LinkedIn'::text, 'Apollo'::text, 'Website'::text,
    'Podcast'::text, 'Event'::text, 'Other'::text,
    'website_contact'::text, 'calendar_booking'::text, 'LeadPipe'::text
  ]));
