-- ============================================================================
-- created_by — Applied 2026-05-20 via Supabase MCP (firms_investors_created_by).
-- This file is the repo record of that migration — already live in production.
--
-- Records which admin/cowork account added a firm or contact, so the UI can
-- show "Added by Cowork" vs an admin. Nullable — rows predating attribution
-- have no creator.
-- ============================================================================
alter table public.firms     add column if not exists created_by text;
alter table public.investors add column if not exists created_by text;
