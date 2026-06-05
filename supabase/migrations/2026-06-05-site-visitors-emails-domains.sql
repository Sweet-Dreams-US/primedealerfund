-- ============================================================================
-- site_visitors all_emails + domains — Applied 2026-06-05 via Supabase MCP.
-- Repo record of the live migration.
--
-- Backs the Visitors tab's "Emails" (primary + "+N more") and "Sites" columns,
-- matching the LeadPipe dashboard's column set.
-- ============================================================================
alter table public.site_visitors
  add column if not exists all_emails text[],
  add column if not exists domains text[];
