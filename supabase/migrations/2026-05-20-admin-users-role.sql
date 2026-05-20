-- ============================================================================
-- admin_users.role — Applied 2026-05-20 via Supabase MCP (admin_users_add_role).
-- This file is the repo record of that migration — already live in production.
--
-- Adds a role to the admin allowlist:
--   'admin'  — full admin panel access
--   'cowork' — restricted to the Firms + Pipeline tabs (research / outreach prep)
-- Existing admins are backfilled to 'admin' by the column default.
-- ============================================================================
alter table public.admin_users
  add column if not exists role text not null default 'admin';

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check
  check (role in ('admin','cowork'));
