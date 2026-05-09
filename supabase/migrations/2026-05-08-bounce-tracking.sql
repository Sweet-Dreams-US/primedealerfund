-- ============================================================================
-- Bounce tracking for outbound email
-- ============================================================================
-- Adds the columns and audit table needed by:
--   - /api/resend-webhook            (Resend bounce/complaint events)
--   - /api/admin/scan-bounces        (Outlook NDR scanner — covers emails
--                                     Ralph sends directly from his Outlook)
--   - /api/admin/send-email          (filters bounced contacts at enqueue)
--   - /api/admin/email-queue/process (defense-in-depth filter at send time)
--
-- Safe to run multiple times — every change is guarded by IF NOT EXISTS.
-- ============================================================================

-- 1. Investor flag — denormalized for fast filter queries.
ALTER TABLE investors
  ADD COLUMN IF NOT EXISTS email_bounced BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_bounce_reason TEXT,
  ADD COLUMN IF NOT EXISTS email_bounce_source TEXT;

-- Partial index — only the bounced rows are interesting and that subset is
-- tiny relative to the table.
CREATE INDEX IF NOT EXISTS idx_investors_email_bounced
  ON investors (email_bounced)
  WHERE email_bounced = true;

-- 2. Audit log — every bounce event lands here, even for manual recipients
-- that aren't in the investors table. Used by the send pipeline to also
-- block ad-hoc addresses that have bounced before, and by the admin UI to
-- show "why" and "when" on each bounced contact.
CREATE TABLE IF NOT EXISTS email_bounces (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL,
  investor_id   UUID REFERENCES investors(id) ON DELETE SET NULL,
  bounced_at    TIMESTAMPTZ DEFAULT NOW(),
  source        TEXT NOT NULL,  -- 'resend-webhook' | 'outlook-scan' | 'manual'
  reason        TEXT,
  raw_payload   JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Lookups are always by lowercased email — make the index match.
CREATE INDEX IF NOT EXISTS idx_email_bounces_email_lower
  ON email_bounces (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_email_bounces_investor
  ON email_bounces (investor_id);
CREATE INDEX IF NOT EXISTS idx_email_bounces_bounced_at
  ON email_bounces (bounced_at DESC);

-- 3. RLS — the service role bypasses RLS entirely, which is what every
-- /api/admin/* endpoint uses. Public reads are not allowed.
ALTER TABLE email_bounces ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DONE
-- ============================================================================
