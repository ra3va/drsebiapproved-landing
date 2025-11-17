/**
 * Campaign Status Tracking API
 * GET /api/campaign/status
 *
 * Returns comprehensive campaign progress statistics:
 * - Total customers uploaded
 * - Emails sent/failed/pending
 * - Click-through rate
 * - Brevo sync status
 * - Estimated days remaining
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          message: 'Database not ready. Please configure Supabase first.',
        },
        { status: 503 }
      );
    }

    // Get total counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('reengagement_campaign')
      .select('status');

    if (statusError) {
      throw statusError;
    }

    // Calculate status breakdown
    const breakdown = statusCounts.reduce((acc: any, row: any) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    const total = statusCounts.length;
    const pending = breakdown.pending || 0;
    const sent = breakdown.sent || 0;
    const failed = breakdown.failed || 0;
    const bounced = breakdown.bounced || 0;
    const clicked = breakdown.clicked || 0;

    // Get click-through data
    const { data: clickData, error: clickError } = await supabase
      .from('reengagement_campaign')
      .select('*')
      .not('clicked_at', 'is', null);

    const totalClicks = clickData?.length || 0;
    const clickThroughRate = sent > 0 ? ((totalClicks / sent) * 100).toFixed(2) : '0.00';

    // Get Brevo sync status
    const { data: brevoSyncData } = await supabase
      .from('reengagement_campaign')
      .select('*')
      .not('clicked_at', 'is', null)
      .eq('added_to_brevo', false);

    const pendingBrevoSync = brevoSyncData?.length || 0;

    // Calculate estimated completion
    const batchSize = 50; // Default batch size
    const estimatedDaysRemaining = Math.ceil(pending / batchSize);

    // Get recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentSends } = await supabase
      .from('reengagement_campaign')
      .select('*')
      .eq('status', 'sent')
      .gte('sent_at', yesterday);

    const sentLast24h = recentSends?.length || 0;

    // Get next batch preview (first 5 pending emails)
    const { data: nextBatch } = await supabase
      .from('reengagement_campaign')
      .select('customer_email, customer_name, batch_number')
      .eq('status', 'pending')
      .order('batch_number', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(5);

    // Calculate progress percentage
    const progressPercent = total > 0 ? ((sent / total) * 100).toFixed(2) : '0.00';

    // Return comprehensive stats
    return NextResponse.json({
      campaign: {
        total,
        progressPercent: `${progressPercent}%`,
      },
      status: {
        pending,
        sent,
        failed,
        bounced,
        clicked,
      },
      engagement: {
        totalClicks,
        clickThroughRate: `${clickThroughRate}%`,
        pendingBrevoSync,
      },
      progress: {
        estimatedDaysRemaining,
        sentLast24h,
        dailyRate: batchSize,
      },
      nextBatch: nextBatch?.map((customer) => ({
        email: customer.customer_email,
        name: customer.customer_name || 'N/A',
        batch: customer.batch_number,
      })) || [],
      recommendations: [
        pending === 0 ? '✅ Campaign complete! All emails sent.' : null,
        failed > 0 ? `⚠️ ${failed} failed sends - check error logs` : null,
        pendingBrevoSync > 0 ? `🔄 ${pendingBrevoSync} customers clicked but not synced to Brevo` : null,
        sent > 100 && totalClicks === 0 ? '📊 No clicks yet - consider A/B testing subject lines' : null,
      ].filter(Boolean),
    });

  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign status', message: error.message },
      { status: 500 }
    );
  }
}
