/**
 * Zoho OAuth Authorization Initiator
 * GET /api/auth/zoho/authorize
 *
 * Redirects user to Zoho authorization page to grant email sending permissions.
 * This is Step 1 of the OAuth flow - only needs to be done once per account.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl, isZohoConfigured } from '@/lib/zoho';

export async function GET(request: NextRequest) {
  try {
    // Check if Zoho credentials are configured
    if (!isZohoConfigured()) {
      return NextResponse.json(
        {
          error: 'Zoho not configured',
          message: 'Waiting for Zoho API credentials from Carl. Please add ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET to environment variables.',
          instructions: 'See ZOHO_SETUP_INSTRUCTIONS.md for setup details'
        },
        { status: 503 }
      );
    }

    // Generate authorization URL with CSRF protection state
    const state = Math.random().toString(36).substring(7);
    const authUrl = getAuthorizationUrl(state);

    console.log('Redirecting to Zoho authorization page...');
    console.log('State:', state);

    // Redirect user to Zoho login/authorization page
    return NextResponse.redirect(authUrl);

  } catch (error: any) {
    console.error('Authorization error:', error);
    return NextResponse.json(
      {
        error: 'Failed to initiate OAuth flow',
        message: error.message
      },
      { status: 500 }
    );
  }
}
