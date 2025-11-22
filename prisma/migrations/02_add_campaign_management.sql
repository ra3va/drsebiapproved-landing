-- ============================================
-- Campaign Management & Daily Tracking Migration
-- Dr. Sebi Approved - Multi-Campaign System
-- ============================================
-- Run this in Supabase SQL Editor after 01_create_zoho_campaign_tables.sql
-- ============================================

-- ============================================
-- STEP 1: Add Campaign Fields to Existing Table
-- ============================================
-- Adds campaign organization fields to track multiple CSV uploads
-- Backward compatible: existing records get default values

ALTER TABLE reengagement_campaign
  ADD COLUMN IF NOT EXISTS campaign_name TEXT DEFAULT 'Default Campaign',
  ADD COLUMN IF NOT EXISTS campaign_type TEXT DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS campaign_description TEXT,
  ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for fast campaign filtering
CREATE INDEX IF NOT EXISTS idx_campaign_name ON reengagement_campaign(campaign_name);
CREATE INDEX IF NOT EXISTS idx_campaign_type ON reengagement_campaign(campaign_type);

-- Add comment to explain campaign types
COMMENT ON COLUMN reengagement_campaign.campaign_type IS 
  'Campaign segment type: winback (hot former customers), warm (engaged leads), cold (new prospects), general (other)';

-- ============================================
-- STEP 2: Update Existing Records
-- ============================================
-- Label the current 1181 customers as Win-Back campaign

UPDATE reengagement_campaign 
SET 
  campaign_name = 'Win-Back - Former Paid Customers',
  campaign_type = 'winback',
  campaign_description = 'Former paid customers from 2023-2024, high-value re-engagement campaign',
  uploaded_at = NOW()
WHERE campaign_name = 'Default Campaign' OR campaign_name IS NULL;

-- ============================================
-- STEP 3: Create Daily Send Tracking Table
-- ============================================
-- Tracks batch sends per day to enforce daily limits and prevent double-sending

CREATE TABLE IF NOT EXISTS batch_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  sent_date DATE NOT NULL,
  emails_sent INTEGER NOT NULL DEFAULT 0,
  follow_ups_sent INTEGER DEFAULT 0,
  new_leads_sent INTEGER DEFAULT 0,
  batch_size_limit INTEGER DEFAULT 75,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'completed', -- 'completed', 'failed', 'partial', 'cancelled'
  error_message TEXT,
  override_limit BOOLEAN DEFAULT FALSE, -- Track if daily limit was manually overridden
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast daily lookups
CREATE INDEX IF NOT EXISTS idx_batch_log_date ON batch_send_log(sent_date DESC);
CREATE INDEX IF NOT EXISTS idx_batch_log_campaign ON batch_send_log(campaign_name);

-- Composite index for daily + campaign queries
CREATE INDEX IF NOT EXISTS idx_batch_log_campaign_date ON batch_send_log(campaign_name, sent_date DESC);

-- Unique constraint: prevent duplicate batches for same campaign on same day
-- Note: This is commented out to allow override functionality
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_batch_log_unique_daily 
--   ON batch_send_log(campaign_name, sent_date) WHERE override_limit = FALSE;

-- Add helpful comments
COMMENT ON TABLE batch_send_log IS 
  'Tracks daily email batch sends for rate limiting and audit trail';
COMMENT ON COLUMN batch_send_log.override_limit IS 
  'TRUE if user manually overrode daily send limit for this batch';

-- ============================================
-- STEP 4: Enhance Click Tracking
-- ============================================
-- Add campaign context to click tracking (already has customer_email and url_destination)
-- This helps attribute clicks to specific campaigns and email stages

ALTER TABLE campaign_clicks
  ADD COLUMN IF NOT EXISTS campaign_name TEXT,
  ADD COLUMN IF NOT EXISTS email_stage INTEGER, -- Which email (1, 2, 3) generated this click
  ADD COLUMN IF NOT EXISTS campaign_id_legacy UUID; -- For backward compat with existing clicks

-- Index for campaign-specific click analysis
CREATE INDEX IF NOT EXISTS idx_clicks_campaign_name ON campaign_clicks(campaign_name);
CREATE INDEX IF NOT EXISTS idx_clicks_email_stage ON campaign_clicks(email_stage);

-- Update existing clicks to reference Win-Back campaign (best effort)
UPDATE campaign_clicks
SET 
  campaign_name = 'Win-Back - Former Paid Customers',
  email_stage = 1 -- Assume Stage 1 for existing clicks
WHERE campaign_name IS NULL;

-- ============================================
-- STEP 5: Create Helpful Views
-- ============================================

-- View: Campaign Summary
-- Quick overview of all campaigns with progress stats
CREATE OR REPLACE VIEW campaign_summary AS
SELECT 
  campaign_name,
  campaign_type,
  COUNT(*) as total_customers,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'active') as active,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'converted') as converted,
  COUNT(*) FILTER (WHERE status = 'bounced') as bounced,
  COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as clicked,
  ROUND(
    COUNT(*) FILTER (WHERE sent_at IS NOT NULL)::NUMERIC * 100.0 / 
    COUNT(*)::NUMERIC, 
    2
  ) as progress_percent,
  MIN(created_at) as first_upload,
  MAX(uploaded_at) as last_upload
FROM reengagement_campaign
GROUP BY campaign_name, campaign_type
ORDER BY last_upload DESC;

-- View: Daily Send Summary
-- Shows send activity by day across all campaigns
CREATE OR REPLACE VIEW daily_send_summary AS
SELECT 
  sent_date,
  COUNT(*) as batch_count,
  SUM(emails_sent) as total_sent,
  SUM(follow_ups_sent) as total_follow_ups,
  SUM(new_leads_sent) as total_new_leads,
  AVG(batch_size_limit) as avg_batch_limit,
  SUM(duration_seconds) as total_duration_seconds,
  COUNT(*) FILTER (WHERE override_limit = TRUE) as override_count
FROM batch_send_log
GROUP BY sent_date
ORDER BY sent_date DESC;

-- ============================================
-- STEP 6: Add Helper Functions
-- ============================================

-- Function: Get today's send count
CREATE OR REPLACE FUNCTION get_todays_send_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(emails_sent), 0)
    FROM batch_send_log
    WHERE sent_date = CURRENT_DATE
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Check if can send today
CREATE OR REPLACE FUNCTION can_send_today(daily_limit INTEGER DEFAULT 75)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_todays_send_count() < daily_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Get campaign progress
CREATE OR REPLACE FUNCTION get_campaign_progress(p_campaign_name TEXT)
RETURNS TABLE (
  total INTEGER,
  sent INTEGER,
  pending INTEGER,
  progress_percent NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total,
    COUNT(*) FILTER (WHERE sent_at IS NOT NULL)::INTEGER as sent,
    COUNT(*) FILTER (WHERE status = 'pending')::INTEGER as pending,
    ROUND(
      COUNT(*) FILTER (WHERE sent_at IS NOT NULL)::NUMERIC * 100.0 / 
      COUNT(*)::NUMERIC, 
      2
    ) as progress_percent
  FROM reengagement_campaign
  WHERE campaign_name = p_campaign_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 7: Helpful Queries (Commented)
-- ============================================

-- See all campaigns
-- SELECT * FROM campaign_summary;

-- See today's send activity
-- SELECT 
--   get_todays_send_count() as sent_today,
--   can_send_today(75) as can_send_more;

-- Get specific campaign progress
-- SELECT * FROM get_campaign_progress('Win-Back - Former Paid Customers');

-- Recent clicks with full context
-- SELECT 
--   cc.customer_email,
--   cc.url_destination,
--   cc.campaign_name,
--   cc.email_stage,
--   cc.clicked_at,
--   rc.customer_name,
--   rc.campaign_type
-- FROM campaign_clicks cc
-- LEFT JOIN reengagement_campaign rc ON cc.customer_email = rc.customer_email
-- ORDER BY cc.clicked_at DESC
-- LIMIT 20;

-- Daily send history
-- SELECT * FROM daily_send_summary LIMIT 7;

-- Campaign performance comparison
-- SELECT 
--   campaign_name,
--   total_customers,
--   progress_percent,
--   clicked,
--   ROUND(clicked::NUMERIC * 100.0 / NULLIF(sent, 0), 2) as click_rate
-- FROM campaign_summary
-- WHERE sent > 0
-- ORDER BY click_rate DESC;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Verify data: SELECT * FROM campaign_summary;
-- 2. Check existing campaign: SELECT * FROM get_campaign_progress('Win-Back - Former Paid Customers');
-- 3. Update API routes to use new fields
-- 4. Update frontend dashboard
