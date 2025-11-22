/**
 * Delete Specific Email from Campaign API
 * DELETE /api/campaign/delete-email?email=customer@example.com
 *
 * Removes a single customer email from the campaign database.
 * Useful for removing duplicates, test emails, or opt-outs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email parameter', message: 'Provide ?email=customer@example.com' },
        { status: 400 }
      );
    }

    const decodedEmail = decodeURIComponent(email);

    console.log(`[Delete Email] Removing ${decodedEmail} from campaign...`);

    // First, let's see ALL records that match (without .single())
    const { data: allMatches, error: searchError } = await supabaseAdmin
      .from('reengagement_campaign')
      .select('*')
      .eq('customer_email', decodedEmail);

    console.log(`[Delete Email] Search for ${decodedEmail}:`, {
      count: allMatches?.length || 0,
      records: allMatches,
      searchError
    });

    // Find the campaign record first to get the ID
    const { data: record, error: findError } = await supabaseAdmin
      .from('reengagement_campaign')
      .select('id')
      .eq('customer_email', decodedEmail)
      .single();

    console.log(`[Delete Email] Find result for ${decodedEmail}:`, { record, findError });

    if (findError || !record) {
      console.log(`[Delete Email] Email not found in DB:`, findError?.message);
      return NextResponse.json(
        { error: 'Email not found', message: `${decodedEmail} is not in the campaign database`, details: findError },
        { status: 404 }
      );
    }

    // Delete from campaign table
    const { error: deleteError } = await supabaseAdmin
      .from('reengagement_campaign')
      .delete()
      .eq('customer_email', decodedEmail);

    if (deleteError) {
      console.error('[Delete Email] Error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete email', details: deleteError },
        { status: 500 }
      );
    }

    // Also delete any click tracking data for this email
    await supabaseAdmin
      .from('campaign_clicks')
      .delete()
      .eq('customer_email', decodedEmail)
      .then(({ error }) => {
        if (error) console.warn('[Delete Email] Clicks not deleted:', error.message);
      });

    // Try legacy table too
    await supabaseAdmin
      .from('discount_clicks')
      .delete()
      .eq('customer_email', decodedEmail)
      .then(({ error }) => {
        if (error) console.warn('[Delete Email] Legacy clicks not deleted:', error.message);
      });

    console.log(`✅ [Delete Email] Removed ${decodedEmail}`);

    return NextResponse.json({
      success: true,
      message: `${decodedEmail} removed from campaign`,
      email: decodedEmail,
    });

  } catch (error: any) {
    console.error('[Delete Email] Error:', error);
    return NextResponse.json(
      { error: 'Delete failed', message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/campaign/delete-email',
    method: 'DELETE',
    usage: 'DELETE /api/campaign/delete-email?email=customer@example.com',
    description: 'Removes a single email from the campaign database',
  });
}
