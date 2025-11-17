/**
 * Minimal Supabase Client for Dr. Sebi Zoho Campaign System
 *
 * This is a lightweight version compared to Amber Unbound CRM.
 * Only handles Zoho OAuth tokens and re-engagement campaign tracking.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables (will use placeholders until Carl provides Supabase account)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'PENDING_SETUP';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'PENDING_SETUP';

// Create Supabase client with fallback values to allow build to succeed
// Runtime checks will prevent actual use without credentials
export const supabase = createClient(
  supabaseUrl !== 'PENDING_SETUP' ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey !== 'PENDING_SETUP' ? supabaseAnonKey : 'placeholder-key-for-build'
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
 * Tracks email sends for the 8K customer win-back campaign
 */
export interface ReengagementCampaign {
  id: number;
  customer_email: string;
  customer_name: string | null;
  sent_at: string | null; // ISO timestamp
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'clicked';
  error_message: string | null;
  zoho_message_id: string | null;
  clicked_at: string | null; // ISO timestamp when discount link clicked
  added_to_brevo: boolean;
  brevo_synced_at: string | null;
  batch_number: number | null; // Which daily batch (1-160 for 8000 emails at 50/day)
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
        message: 'Supabase not configured. Waiting for credentials from Carl.',
        code: 'SUPABASE_NOT_CONFIGURED'
      }
    };
  }

  return queryFn();
}
