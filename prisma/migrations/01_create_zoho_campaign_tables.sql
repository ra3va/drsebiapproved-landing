-- ============================================
-- Zoho Re-engagement Campaign Database Schema
-- Dr. Sebi Approved - Parasite Cleanse Landing
-- ============================================
--
-- This migration creates 3 tables for the Zoho email campaign system:
-- 1. zoho_oauth_tokens - OAuth credentials for Zoho Mail API
-- 2. reengagement_campaign - 8K customer win-back email tracking
-- 3. discount_clicks - Track discount link clicks for Brevo sync
--
-- Run this in Supabase SQL Editor after creating your database
-- ============================================

-- ============================================
-- TABLE 1: Zoho OAuth Tokens
-- ============================================
-- Stores OAuth 2.0 access and refresh tokens for Zoho Mail API
-- Tokens auto-refresh before expiration (1 hour access token lifetime)

CREATE TABLE IF NOT EXISTS zoho_oauth_tokens (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_type VARCHAR(50) DEFAULT 'Bearer',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    scope TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_zoho_tokens_email ON zoho_oauth_tokens(user_email);

-- Index for expiration checks
CREATE INDEX IF NOT EXISTS idx_zoho_tokens_expires_at ON zoho_oauth_tokens(expires_at);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_zoho_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER zoho_tokens_updated_at
    BEFORE UPDATE ON zoho_oauth_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_zoho_tokens_updated_at();

-- ============================================
-- TABLE 2: Re-engagement Campaign
-- ============================================
-- Tracks the 8,000 customer win-back email campaign
-- Rate limited to 50-75 emails per day to avoid spam flags

CREATE TABLE IF NOT EXISTS reengagement_campaign (
    id SERIAL PRIMARY KEY,
    customer_email VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'clicked')),
    error_message TEXT,
    zoho_message_id VARCHAR(255),
    clicked_at TIMESTAMP WITH TIME ZONE,
    added_to_brevo BOOLEAN DEFAULT FALSE,
    brevo_synced_at TIMESTAMP WITH TIME ZONE,
    batch_number INTEGER, -- Which daily batch (1-160 for 8000 emails at 50/day)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_campaign_email ON reengagement_campaign(customer_email);

-- Index for status filtering (find pending emails to send)
CREATE INDEX IF NOT EXISTS idx_campaign_status ON reengagement_campaign(status);

-- Index for batch processing
CREATE INDEX IF NOT EXISTS idx_campaign_batch ON reengagement_campaign(batch_number);

-- Index for finding emails that need Brevo sync
CREATE INDEX IF NOT EXISTS idx_campaign_brevo_sync ON reengagement_campaign(clicked_at, added_to_brevo)
    WHERE clicked_at IS NOT NULL AND added_to_brevo = FALSE;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_campaign_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaign_updated_at
    BEFORE UPDATE ON reengagement_campaign
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_updated_at();

-- ============================================
-- TABLE 3: Discount Click Tracking
-- ============================================
-- Logs when customers click the win-back discount link
-- Used for detailed analytics and Brevo re-opt-in signal

CREATE TABLE IF NOT EXISTS discount_clicks (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES reengagement_campaign(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast campaign lookups
CREATE INDEX IF NOT EXISTS idx_clicks_campaign ON discount_clicks(campaign_id);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON discount_clicks(clicked_at);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_clicks_email ON discount_clicks(customer_email);

-- ============================================
-- SAMPLE DATA (FOR TESTING ONLY)
-- ============================================
-- Comment out before production deployment
-- This gives you test data to verify the system works

-- Insert test campaign records (10 customers)
INSERT INTO reengagement_campaign (customer_email, customer_name, status, batch_number) VALUES
    ('test1@example.com', 'John Doe', 'pending', 1),
    ('test2@example.com', 'Jane Smith', 'pending', 1),
    ('test3@example.com', 'Bob Johnson', 'pending', 1),
    ('test4@example.com', 'Alice Williams', 'pending', 2),
    ('test5@example.com', 'Charlie Brown', 'pending', 2),
    ('test6@example.com', 'Diana Prince', 'sent', 3),
    ('test7@example.com', 'Edward Norton', 'sent', 3),
    ('test8@example.com', 'Fiona Apple', 'clicked', 4),
    ('test9@example.com', 'George Clooney', 'failed', 4),
    ('test10@example.com', 'Helen Mirren', 'pending', 5)
ON CONFLICT (customer_email) DO NOTHING;

-- ============================================
-- HELPFUL QUERIES FOR MONITORING
-- ============================================

-- See campaign progress
-- SELECT
--     status,
--     COUNT(*) as count,
--     ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reengagement_campaign), 2) as percentage
-- FROM reengagement_campaign
-- GROUP BY status
-- ORDER BY count DESC;

-- Find next batch to send (50 pending emails)
-- SELECT id, customer_email, customer_name
-- FROM reengagement_campaign
-- WHERE status = 'pending'
-- ORDER BY batch_number NULLS LAST, created_at
-- LIMIT 50;

-- See customers who clicked but not yet added to Brevo
-- SELECT id, customer_email, clicked_at
-- FROM reengagement_campaign
-- WHERE clicked_at IS NOT NULL
--   AND added_to_brevo = FALSE
-- ORDER BY clicked_at DESC;

-- Check if Zoho tokens are valid
-- SELECT
--     user_email,
--     expires_at,
--     CASE
--         WHEN expires_at > NOW() THEN 'VALID'
--         ELSE 'EXPIRED - NEEDS REFRESH'
--     END as token_status
-- FROM zoho_oauth_tokens;

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Get Zoho OAuth credentials from Carl
-- 3. Upload 8K customer CSV
-- 4. Start daily batch sends!
