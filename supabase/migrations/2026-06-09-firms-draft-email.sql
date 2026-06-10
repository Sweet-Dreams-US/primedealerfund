-- ============================================================================
-- firms.draft_email_subject + draft_email_body — Applied 2026-06-09 via
-- Supabase MCP. Repo record of the live migration.
--
-- Lets Cowork draft an outreach email per firm (based on the firm's intro_path)
-- for Ralph to review, personalize per contact, and send.
-- ============================================================================
alter table public.firms
  add column if not exists draft_email_subject text,
  add column if not exists draft_email_body text;
