/**
 * Zoho OAuth Callback Handler
 * GET /api/auth/zoho/callback?code=AUTH_CODE
 *
 * Handles redirect after user authorizes the app on Zoho.
 * Exchanges authorization code for access/refresh tokens and stores them.
 * This is Step 2 of the OAuth flow - only runs once per account.
 */

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, storeTokens, getDefaultUserEmail } from '@/lib/zoho';

export async function GET(request: NextRequest) {
  try {
    // Extract authorization code from query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    // Handle authorization errors
    if (error) {
      console.error('OAuth authorization error:', error);
      return NextResponse.redirect(
        new URL(`/?error=oauth_denied&message=${error}`, request.url)
      );
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=missing_code&message=No authorization code received', request.url)
      );
    }

    console.log('Received authorization code, exchanging for tokens...');

    // Exchange code for access and refresh tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens in database for info@drsebiapproved.com
    const userEmail = getDefaultUserEmail();
    await storeTokens(userEmail, tokens);

    console.log('✅ OAuth tokens stored successfully for:', userEmail);
    console.log('Access token expires at:', tokens.expiresAt);

    // Redirect to success page (you can create a campaign dashboard later)
    return NextResponse.redirect(
      new URL('/?success=zoho_connected&message=Email system ready for campaign!', request.url)
    );

  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/?error=oauth_failed&message=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
