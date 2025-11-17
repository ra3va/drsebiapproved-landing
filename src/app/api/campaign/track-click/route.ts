/**
 * Click Tracking & Brevo Auto-Sync Route
 * GET /api/campaign/track-click?email=customer@example.com&redirect=/paracleanse
 *
 * Tracks when customers click the discount link in win-back emails.
 * - Logs click event to database
 * - Updates campaign status to 'clicked'
 * - Auto-syncs customer to Brevo "Re-engaged Customers" list
 * - Redirects to product/discount page
 *
 * This serves as the re-opt-in signal for Brevo marketing sequences.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BrevoClient } from '@/lib/brevo-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const redirect = searchParams.get('redirect') || '/';

    // Validate email parameter
    if (!email) {
      return NextResponse.redirect(new URL('/?error=missing_email', request.url));
    }

    // Decode email if URL encoded
    const decodedEmail = decodeURIComponent(email);

    console.log(`📊 Click tracked: ${decodedEmail}`);

    // Extract tracking data from request
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
    const userAgent = request.headers.get('user-agent') || null;
    const referrer = request.headers.get('referer') || null;

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - skipping tracking');
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    // Find campaign record
    const { data: campaign, error: findError } = await supabase
      .from('reengagement_campaign')
      .select('*')
      .eq('customer_email', decodedEmail)
      .single();

    if (findError || !campaign) {
      console.warn(`Campaign record not found for: ${decodedEmail}`);
      // Still redirect user, just don't track
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    // Update campaign status to 'clicked'
    const { error: updateError } = await supabase
      .from('reengagement_campaign')
      .update({
        status: 'clicked',
        clicked_at: new Date().toISOString(),
      })
      .eq('id', campaign.id);

    if (updateError) {
      console.error('Failed to update campaign status:', updateError);
    }

    // Log click to discount_clicks table
    const { error: logError } = await supabase
      .from('discount_clicks')
      .insert({
        campaign_id: campaign.id,
        customer_email: decodedEmail,
        clicked_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer,
        utm_source: searchParams.get('utm_source'),
        utm_medium: searchParams.get('utm_medium'),
        utm_campaign: searchParams.get('utm_campaign'),
      });

    if (logError) {
      console.error('Failed to log click:', logError);
    }

    // Sync to Brevo (re-opt-in signal)
    try {
      const brevoClient = new BrevoClient(process.env.BREVO_API_KEY);

      // Update or create contact in Brevo
      await brevoClient.updateContact(decodedEmail, {
        attributes: {
          FIRSTNAME: campaign.customer_name?.split(' ')[0] || '',
          LASTNAME: campaign.customer_name?.split(' ').slice(1).join(' ') || '',
          REENGAGEMENT_DATE: new Date().toISOString().split('T')[0],
          CLICKED_WINBACK: true,
          CUSTOMER_STATUS: 'Re-engaged',
        },
        listIds: [], // Will add to list separately
        updateEnabled: true,
      });

      // Find or create "Re-engaged Customers" list
      const lists = await brevoClient.getLists();
      let reengagedList = lists.lists?.find((list: any) => list.name === 'Re-engaged Customers');

      if (!reengagedList) {
        // Create list if it doesn't exist
        reengagedList = await brevoClient.createList('Re-engaged Customers', null);
        console.log('Created "Re-engaged Customers" list');
      }

      // Add contact to re-engaged list
      await brevoClient.addContactsToList(reengagedList.id, [decodedEmail]);

      // Update database with Brevo sync status
      await supabase
        .from('reengagement_campaign')
        .update({
          added_to_brevo: true,
          brevo_synced_at: new Date().toISOString(),
        })
        .eq('id', campaign.id);

      console.log(`✅ Synced ${decodedEmail} to Brevo "Re-engaged Customers" list`);

    } catch (brevoError: any) {
      console.error('Brevo sync error:', brevoError.message);
      // Don't fail the redirect if Brevo sync fails
      // User still gets their discount, we just missed the tracking
    }

    // Redirect to destination (product page, discount page, etc.)
    const redirectUrl = new URL(redirect, request.url);

    // Add success parameter to URL
    redirectUrl.searchParams.set('welcome_back', 'true');
    redirectUrl.searchParams.set('discount', 'WELCOME20');

    return NextResponse.redirect(redirectUrl);

  } catch (error: any) {
    console.error('Click tracking error:', error);

    // Still redirect user even if tracking fails
    const redirect = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirect, request.url));
  }
}
