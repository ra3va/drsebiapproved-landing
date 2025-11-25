/**
 * Clear All Campaign Records API
 * DELETE /api/campaign/clear-all
 *
 * DANGER: Deletes ALL records from the reengagement_campaign table.
 * Use this to start over with a fresh campaign.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  return handleClearAll(request);
}

export async function DELETE(request: NextRequest) {
  return handleClearAll(request);
}

async function handleClearAll(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    // Optional: Check for confirmation parameter (skip for POST from dashboard)
    const { searchParams } = new URL(request.url);
    const confirmed = searchParams.get('confirmed') === 'true';
    const isPost = request.method === 'POST';

    if (!confirmed && !isPost) {
      return NextResponse.json(
        {
          error: 'Confirmation required',
          message: 'Add ?confirmed=true to proceed with deletion',
        },
        { status: 400 }
      );
    }

    console.log('[Clear All] Deleting all campaign records...');

    // First, count records to track what we're deleting
    const { count: beforeCount } = await supabaseAdmin
      .from('reengagement_campaign')
      .select('*', { count: 'exact', head: true });

    console.log(`[Clear All] Found ${beforeCount || 0} records to delete`);

    // Delete ALL records using a simple "not equal" to a value that never exists
    // This works for both integer and UUID types
    const { error: campaignError } = await supabaseAdmin
      .from('reengagement_campaign')
      .delete()
      .not('customer_email', 'eq', 'this-email-will-never-exist@invalid-domain-9999.com');

    if (campaignError) {
      console.error('[Clear All] Campaign deletion error:', campaignError);
      return NextResponse.json(
        { error: 'Failed to clear campaign records', details: campaignError },
        { status: 500 }
      );
    }

    console.log('[Clear All] Campaign records deleted successfully');

    // Clear click tracking data
    const { count: clicksBefore } = await supabaseAdmin
      .from('campaign_clicks')
      .select('*', { count: 'exact', head: true });

    await supabaseAdmin
      .from('campaign_clicks')
      .delete()
      .not('customer_email', 'eq', 'this-email-will-never-exist@invalid-domain-9999.com');

    // Try clearing legacy discount_clicks table
    await supabaseAdmin
      .from('discount_clicks')
      .delete()
      .neq('id', 0); // Delete all (legacy table uses integer IDs)

    // Clear today's batch send logs (reset daily limit)
    const today = new Date().toISOString().split('T')[0];
    const { count: logsBefore } = await supabaseAdmin
      .from('batch_send_log')
      .select('*', { count: 'exact', head: true })
      .eq('sent_date', today);

    await supabaseAdmin
      .from('batch_send_log')
      .delete()
      .eq('sent_date', today);

    console.log(`✅ [Clear All] Deleted ${beforeCount || 0} campaign records, ${clicksBefore || 0} click records, ${logsBefore || 0} send logs`);

    return NextResponse.json({
      success: true,
      message: 'All campaign records cleared',
      deleted: {
        campaigns: beforeCount || 0,
        clicks: clicksBefore || 0,
        sendLogs: logsBefore || 0,
      },
    });

  } catch (error: any) {
    console.error('[Clear All] Error:', error);
    return NextResponse.json(
      { error: 'Clear all failed', message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to show warning
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/campaign/clear-all',
    method: 'DELETE',
    warning: '⚠️ DANGER: This will delete ALL campaign records permanently!',
    usage: 'DELETE /api/campaign/clear-all?confirmed=true',
    description: 'Clears all records from reengagement_campaign and campaign_clicks tables',
  });
}
