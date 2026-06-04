-- ============================================================================
-- site_visitors enrichment confidence — Applied 2026-06-04 via Supabase MCP
-- (site_visitors_enrichment_confidence). Repo record of the live migration.
--
-- Stores LeadPipe's own match-confidence signals so the admin Visitors tab
-- can hide unreliable residential / email-only matches by default.
-- ============================================================================
alter table public.site_visitors
  add column if not exists enrichment_level text,
  add column if not exists enrichment_score integer;
