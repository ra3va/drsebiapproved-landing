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
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { BrevoClient } from '@/lib/brevo-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const redirect = searchParams.get('redirect') || searchParams.get('dest') || searchParams.get('url') || '/';
    // NEW: Capture campaign context from URL
    const campaignName = searchParams.get('campaign');
    const emailStage = searchParams.get('stage') ? parseInt(searchParams.get('stage')!) : null;


    // Validate email parameter
    if (!email) {
      return NextResponse.redirect(new URL('/?error=missing_email', request.url));
    }

    // Decode email if URL encoded
    const decodedEmail = decodeURIComponent(email);

    console.log(`📊 Click tracked: ${decodedEmail} (Campaign: ${campaignName || 'unknown'}, Stage: ${emailStage || 'unknown'})`);

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

    // Update campaign status to 'clicked' (only if not converted/completed)
    // Using admin client to bypass RLS
    if (campaign.status !== 'converted' && campaign.status !== 'completed') {
      const { error: updateError } = await supabaseAdmin
        .from('reengagement_campaign')
        .update({
          status: 'clicked',
          clicked_at: new Date().toISOString(),
        })
        .eq('id', campaign.id);

      if (updateError) console.error('Failed to update campaign status:', updateError);
    }

    // Log click to campaign_clicks table (New System)
    // Using admin client to bypass RLS
    const { error: logError } = await supabaseAdmin
      .from('campaign_clicks')
      .insert({
        campaign_id: campaign.id,
        customer_email: decodedEmail,
        url_destination: redirect,
        ip_address: ipAddress,
        user_agent: userAgent,
        clicked_at: new Date().toISOString(),
        // NEW: Campaign context fields
        campaign_name: campaignName || campaign.campaign_name || null,
        email_stage: emailStage || campaign.campaign_stage || 1,
      });

    if (logError) {
      // Fallback to legacy table if new one fails (e.g. migration not run)
      console.warn('Failed to log to campaign_clicks, trying discount_clicks:', logError.message);
      await supabaseAdmin.from('discount_clicks').insert({
        campaign_id: campaign.id,
        customer_email: decodedEmail,
        clicked_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer
      });
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

      // Update database with Brevo sync status using admin client
      await supabaseAdmin
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
