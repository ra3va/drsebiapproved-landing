/**
 * Minimal Supabase Client for Dr. Sebi Zoho Campaign System
 *
 * This is a lightweight version compared to Amber Unbound CRM.
 * Only handles Zoho OAuth tokens and re-engagement campaign tracking.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables (managed via .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'PENDING_SETUP';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'PENDING_SETUP';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'PENDING_SETUP';

// Create Supabase client with fallback values to allow build to succeed
// Runtime checks will prevent actual use without credentials

// Client for public/client-side operations (read-only with RLS)
export const supabase = createClient(
  supabaseUrl !== 'PENDING_SETUP' ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey !== 'PENDING_SETUP' ? supabaseAnonKey : 'placeholder-key-for-build'
);

// Admin client for server-side API routes (bypasses RLS, full access)
export const supabaseAdmin = createClient(
  supabaseUrl !== 'PENDING_SETUP' ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseServiceRoleKey !== 'PENDING_SETUP' ? supabaseServiceRoleKey : 'placeholder-service-key-for-build',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public'
    }
  }
);

// TypeScript types for our 3 tables

/**
 * Zoho OAuth Tokens Table
 * Stores access/refresh tokens for Zoho Mail API
 */
export interface ZohoOAuthToken {
  id: number;
  user_email: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string; // ISO timestamp
  scope: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Re-engagement Campaign Table
 * Tracks email sends for multi-campaign system (Win-Back, Warm, Cold, etc.)
 */
export interface ReengagementCampaign {
  id: number;
  customer_email: string;
  customer_name: string | null;
  sent_at: string | null; // ISO timestamp
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'clicked' | 'active' | 'converted' | 'unsubscribed' | 'completed';
  error_message: string | null;
  zoho_message_id: string | null;
  clicked_at: string | null; // ISO timestamp when discount link clicked
  converted_at: string | null; // When they purchased
  campaign_stage: number | null; // 1=Intro, 2=FollowUp1, 3=Urgency
  next_action_date: string | null; // When next email is due
  added_to_brevo: boolean;
  brevo_synced_at: string | null;
  batch_number: number | null; // Which daily batch (1-160 for 8000 emails at 50/day)
  // NEW: Campaign Management Fields
  campaign_name: string; // e.g., "Win-Back - Former Paid Customers"
  campaign_type: 'winback' | 'warm' | 'cold' | 'general';
  campaign_description: string | null;
  uploaded_at: string; // ISO timestamp
  created_at: string;
  updated_at: string;
}

/**
 * Discount Click Tracking Table
 * Logs when customers click the win-back discount link
 */
export interface DiscountClick {
  id: number;
  campaign_id: number; // Foreign key to reengagement_campaign
  customer_email: string;
  clicked_at: string; // ISO timestamp
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

/**
 * Batch Send Log Table
 * Tracks daily email batch sends for rate limiting and audit trail
 */
export interface BatchSendLog {
  id: string; // UUID
  campaign_name: string;
  sent_date: string; // Date string (YYYY-MM-DD)
  emails_sent: number;
  follow_ups_sent: number;
  new_leads_sent: number;
  batch_size_limit: number;
  duration_seconds: number | null;
  status: 'completed' | 'failed' | 'partial' | 'cancelled';
  error_message: string | null;
  override_limit: boolean;
  created_at: string; // ISO timestamp
}

/**
 * Campaign Click Table (Enhanced)
 * Tracks link clicks with campaign and email stage context
 */
export interface CampaignClick {
  id: string; // UUID
  campaign_id: string | null; // UUID reference to reengagement_campaign
  customer_email: string;
  url_destination: string;
  user_agent: string | null;
  ip_address: string | null;
  clicked_at: string; // ISO timestamp
  // NEW: Campaign context fields
  campaign_name: string | null;
  email_stage: number | null; // Which email (1, 2, 3) generated this click
  campaign_id_legacy: string | null; // For backward compat
}

/**
 * Helper function to check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl !== 'PENDING_SETUP' && supabaseAnonKey !== 'PENDING_SETUP';
}

/**
 * Helper function to safely execute Supabase queries
 * Returns error message if not configured
 */
export async function safeSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any }> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: {
        message: 'Supabase not configured. Please check environment variables.',
        code: 'SUPABASE_NOT_CONFIGURED'
      }
    };
  }

  return queryFn();
}
