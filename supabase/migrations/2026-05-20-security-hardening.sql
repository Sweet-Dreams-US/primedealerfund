-- ============================================================================
-- Security hardening — Applied 2026-05-20 via Supabase MCP
-- (security_hardening_rls_and_view). Repo record — already live in production.
--
-- Resolves Supabase ERROR/WARN security advisors. All admin data access uses
-- the service-role client (bypasses RLS); the browser/anon Supabase client is
-- dead code (never imported), so enabling RLS with no policy is safe and
-- closes anon-key exposure of these tables.
-- ============================================================================

-- 1. ERROR (rls_disabled_in_public): tables exposed to PostgREST with RLS off.
-- The public anon key ships in the browser bundle, so these were readable /
-- writable by anyone. No policies → anon/authenticated get zero access;
-- the service role still has full access.
ALTER TABLE public.email_templates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_sequences  ENABLE ROW LEVEL SECURITY;

-- 2. ERROR (security_definer_view): outreach_pipeline ran as its definer,
-- bypassing the querying user's RLS. security_invoker makes it respect the
-- caller's permissions (anon → blocked by investors/firms RLS; service role
-- → full access).
ALTER VIEW public.outreach_pipeline SET (security_invoker = true);

-- 3. WARN (function_search_path_mutable): trigger functions with a mutable
-- search_path. Both are trivial (NEW.updated_at = now()); now() resolves from
-- pg_catalog regardless, so an empty search_path is safe and removes the
-- search_path-injection surface.
ALTER FUNCTION public.firms_set_updated_at() SET search_path = '';
ALTER FUNCTION public.update_updated_at()    SET search_path = '';
