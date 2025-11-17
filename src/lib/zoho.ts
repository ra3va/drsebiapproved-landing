/**
 * Zoho Mail OAuth 2.0 Integration - Dr. Sebi Re-engagement Campaign
 * Simplified version optimized for batch email sending
 *
 * Based on Amber Unbound CRM integration, adapted for:
 * - 8K customer win-back campaign
 * - Rate-limited batch sends (50-75 emails/day)
 * - Discount link tracking
 * - Brevo re-opt-in sync
 */

import axios from 'axios';
import { supabase, isSupabaseConfigured } from './supabase';

// Zoho OAuth configuration
// WAITING FOR CARL: Replace PENDING_SETUP values when credentials ready
const ZOHO_CONFIG = {
  clientId: process.env.ZOHO_CLIENT_ID || 'PENDING_SETUP',
  clientSecret: process.env.ZOHO_CLIENT_SECRET || 'PENDING_SETUP',
  redirectUri: process.env.ZOHO_REDIRECT_URI || 'https://drsebiapproved.com/api/auth/zoho/callback',
  accountsBaseUrl: process.env.ZOHO_ACCOUNTS_BASE_URL || 'https://accounts.zoho.com',
  apiBaseUrl: process.env.ZOHO_API_BASE_URL || 'https://mail.zoho.com/api',
  userEmail: process.env.ZOHO_EMAIL || 'info@drsebiapproved.com',
};

// OAuth scopes for Zoho Mail API
// Simplified: Only need message sending, not inbox reading
export const ZOHO_SCOPES = [
  'ZohoMail.messages.CREATE',  // Send emails
  'ZohoMail.accounts.READ',    // Get account info
].join(',');

/**
 * Check if Zoho is configured with real credentials
 */
export function isZohoConfigured(): boolean {
  return ZOHO_CONFIG.clientId !== 'PENDING_SETUP'
    && ZOHO_CONFIG.clientSecret !== 'PENDING_SETUP'
    && isSupabaseConfigured();
}

/**
 * Generate authorization URL for OAuth flow
 * User clicks this to authorize app access to Zoho Mail
 */
export function getAuthorizationUrl(state?: string): string {
  if (!isZohoConfigured()) {
    throw new Error('Zoho not configured. Waiting for credentials from Carl.');
  }

  const params = new URLSearchParams({
    scope: ZOHO_SCOPES,
    client_id: ZOHO_CONFIG.clientId,
    response_type: 'code',
    access_type: 'offline', // Get refresh token for long-term access
    redirect_uri: ZOHO_CONFIG.redirectUri,
    prompt: 'consent', // Force re-authorization to get refresh token
    ...(state && { state }),
  });

  return `${ZOHO_CONFIG.accountsBaseUrl}/oauth/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for access and refresh tokens
 * Called once after user authorizes the app
 */
export async function exchangeCodeForTokens(code: string) {
  try {
    const params = new URLSearchParams({
      code,
      client_id: ZOHO_CONFIG.clientId,
      client_secret: ZOHO_CONFIG.clientSecret,
      redirect_uri: ZOHO_CONFIG.redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await axios.post(
      `${ZOHO_CONFIG.accountsBaseUrl}/oauth/v2/token`,
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token, expires_in, token_type } = response.data;

    // Calculate expiration timestamp (access tokens last 1 hour)
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Note: Zoho sometimes doesn't return refresh_token on subsequent authorizations
    // This is normal - it only gives refresh token on first authorization
    if (!refresh_token) {
      console.warn('⚠️ No refresh token received. This may be a subsequent authorization.');
    }

    return {
      accessToken: access_token,
      refreshToken: refresh_token || null,
      expiresAt,
      tokenType: token_type,
      scope: ZOHO_SCOPES,
    };
  } catch (error: any) {
    console.error('Error exchanging code for tokens:', error.response?.data || error.message);
    throw new Error('Failed to exchange authorization code for tokens');
  }
}

/**
 * Refresh access token using refresh token
 * Automatically called when access token expires (every 1 hour)
 */
export async function refreshAccessToken(refreshToken: string) {
  try {
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: ZOHO_CONFIG.clientId,
      client_secret: ZOHO_CONFIG.clientSecret,
      grant_type: 'refresh_token',
    });

    const response = await axios.post(
      `${ZOHO_CONFIG.accountsBaseUrl}/oauth/v2/token`,
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    return {
      accessToken: access_token,
      expiresAt,
    };
  } catch (error: any) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
}

/**
 * Store OAuth tokens in Supabase database
 */
export async function storeTokens(
  userEmail: string,
  tokens: {
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date;
    tokenType?: string;
    scope?: string;
  }
) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot store tokens.');
  }

  const { data, error } = await supabase
    .from('zoho_oauth_tokens')
    .upsert({
      user_email: userEmail,
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.expiresAt.toISOString(),
      token_type: tokens.tokenType || 'Bearer',
      scope: tokens.scope || ZOHO_SCOPES,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing tokens:', error);
    throw new Error('Failed to store OAuth tokens');
  }

  return data;
}

/**
 * Get valid access token (auto-refreshes if expired)
 * This is the main function used before every API call
 */
export async function getValidAccessToken(userEmail: string): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot retrieve tokens.');
  }

  // Fetch tokens from database
  const { data: tokenData, error } = await supabase
    .from('zoho_oauth_tokens')
    .select('*')
    .eq('user_email', userEmail)
    .single();

  if (error || !tokenData) {
    throw new Error('No OAuth tokens found. Please authorize the application first.');
  }

  const expiresAt = new Date(tokenData.expires_at);
  const now = new Date();

  // Check if token is expired or expiring soon (5-minute buffer to avoid race conditions)
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    console.log('Access token expired, refreshing...');

    // Refresh the token
    const refreshed = await refreshAccessToken(tokenData.refresh_token);

    // Update database with new access token
    await supabase
      .from('zoho_oauth_tokens')
      .update({
        access_token: refreshed.accessToken,
        expires_at: refreshed.expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail);

    return refreshed.accessToken;
  }

  return tokenData.access_token;
}

/**
 * Get Zoho Mail account information
 * Used to retrieve account ID needed for API calls
 */
export async function getAccountInfo(accessToken: string) {
  try {
    const response = await axios.get(`${ZOHO_CONFIG.apiBaseUrl}/accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error fetching account info:', error.response?.data || error.message);
    throw new Error('Failed to fetch account information');
  }
}

/**
 * Send email via Zoho Mail API
 * Main function for the re-engagement campaign
 *
 * @param userEmail - Sender email (info@drsebiapproved.com)
 * @param emailData - Email details
 * @returns Zoho message ID and send status
 */
export async function sendEmail(
  userEmail: string,
  emailData: {
    to: { address: string; name?: string }[];
    subject: string;
    htmlContent: string;
    textContent?: string;
    cc?: { address: string; name?: string }[];
    bcc?: { address: string; name?: string }[];
  }
) {
  try {
    if (!isZohoConfigured()) {
      throw new Error('Zoho not configured. Waiting for credentials from Carl.');
    }

    // Get valid access token (auto-refreshes if needed)
    const accessToken = await getValidAccessToken(userEmail);

    // Get account info to find account ID
    const accounts = await getAccountInfo(accessToken);
    const accountId = accounts.data[0]?.accountId;

    if (!accountId) {
      throw new Error('No Zoho Mail account found');
    }

    // Prepare email payload
    const payload = {
      fromAddress: `Dr. Sebi Approved <${userEmail}>`,
      toAddress: emailData.to.map(t => t.address).join(','),
      ccAddress: emailData.cc?.map(c => c.address).join(',') || '',
      bccAddress: emailData.bcc?.map(b => b.address).join(',') || '',
      subject: emailData.subject,
      content: emailData.htmlContent,
      mailFormat: 'html',
    };

    // Send email via Zoho API
    const response = await axios.post(
      `${ZOHO_CONFIG.apiBaseUrl}/accounts/${accountId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw new Error('Failed to send email via Zoho Mail API');
  }
}

/**
 * Check if OAuth tokens exist for a user
 */
export async function hasValidTokens(userEmail: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const { data, error } = await supabase
    .from('zoho_oauth_tokens')
    .select('id')
    .eq('user_email', userEmail)
    .single();

  return !error && !!data;
}

/**
 * Get default user email from config
 */
export function getDefaultUserEmail(): string {
  return ZOHO_CONFIG.userEmail;
}
