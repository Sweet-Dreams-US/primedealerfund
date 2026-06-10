-- ============================================================================
-- investors.category += 'Website Visitor' — Applied 2026-06-09 via Supabase
-- MCP (investors_category_website_visitor). Repo record of the live migration.
--
-- Leads promoted from the Visitors tab ("Add Lead") are flagged strictly as
-- website visitors instead of landing in the generic 'New Lead' bucket, so
-- they can be reviewed separately from manually-added contacts.
-- ============================================================================
alter table public.investors drop constraint if exists investors_category_check;
alter table public.investors add constraint investors_category_check
  check (category = any (array[
    'Never Responded'::text, 'Had Zoom - No Commitment'::text,
    'Friend - Possible Investor'::text, 'Current Investor'::text,
    'New Lead'::text, 'Website Visitor'::text, 'Identified'::text,
    'First Touch'::text, 'Introductory Call'::text, 'Active Conduit'::text,
    'Cold'::text, 'Discovery Call'::text, 'Diligence'::text,
    'IC Review'::text, 'Committed'::text, 'Wired'::text, 'Pass'::text
  ]));
