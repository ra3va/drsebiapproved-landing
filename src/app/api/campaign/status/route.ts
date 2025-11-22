import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Force dynamic to ensure we always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedCampaign = searchParams.get('campaign'); // Optional: filter by specific campaign

    // 1. FETCH CAMPAIGN STATS DIRECTLY (fallback when DB view is missing)
    const createEmptyStats = () => ({
      total: 0,
      pending: 0,
      sent: 0,
      failed: 0,
      bounced: 0,
      clicked: 0,
      converted: 0,
      active: 0
    });

    type RawCampaignRow = {
      campaign_name: string | null;
      campaign_type: string | null;
      status: string | null;
      sent_at: string | null;
      clicked_at: string | null;
      converted_at: string | null;
    };

    type CampaignAggregate = ReturnType<typeof createEmptyStats> & {
      name: string;
      type: string;
    };

    const fallbackCampaignName = 'Default Campaign';
    const campaignMap = new Map<string, CampaignAggregate>();

    const ensureAggregate = (name: string, type: string) => {
      if (!campaignMap.has(name)) {
        campaignMap.set(name, { ...createEmptyStats(), name, type: type || 'general' });
      }
      const aggregate = campaignMap.get(name)!;
      if (type && aggregate.type !== type) {
        aggregate.type = type;
      }
      return aggregate;
    };

    const pageSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data: rawCampaignRows, error: recordsError } = await supabaseAdmin
        .from('reengagement_campaign')
        .select('campaign_name, campaign_type, status, sent_at, clicked_at, converted_at')
        .range(offset, offset + pageSize - 1);

      if (recordsError) {
        console.error('Error fetching campaign records:', recordsError);
        throw recordsError;
      }

      const campaignRows = (rawCampaignRows || []) as RawCampaignRow[];

      campaignRows.forEach((row) => {
        const name = row.campaign_name || fallbackCampaignName;
        const type = row.campaign_type || 'general';
        const aggregate = ensureAggregate(name, type);

        aggregate.total += 1;

        const status = row.status || 'pending';
        if (status === 'pending') aggregate.pending += 1;
        if (status === 'active') aggregate.active += 1;
        if (status === 'failed') aggregate.failed += 1;
        if (status === 'bounced') aggregate.bounced += 1;

        if (row.sent_at) {
          aggregate.sent += 1;
        }

        const hasClicked = Boolean(row.clicked_at) || status === 'clicked';
        if (hasClicked) {
          aggregate.clicked += 1;
        }

        const hasConverted = Boolean(row.converted_at) || status === 'converted';
        if (hasConverted) {
          aggregate.converted += 1;
        }
      });

      if (campaignRows.length < pageSize) {
        hasMore = false;
      } else {
        offset += pageSize;
      }
    }

    const campaignsList = Array.from(campaignMap.values()).map(({ name, type, total, pending, sent, active }) => ({
      name,
      type,
      total,
      pending,
      sent,
      active,
    }));

    const totalStats = Array.from(campaignMap.values()).reduce((acc, curr) => ({
      total: acc.total + curr.total,
      pending: acc.pending + curr.pending,
      sent: acc.sent + curr.sent,
      failed: acc.failed + curr.failed,
      bounced: acc.bounced + curr.bounced,
      clicked: acc.clicked + curr.clicked,
      converted: acc.converted + curr.converted,
      active: acc.active + curr.active,
    }), createEmptyStats());

    // Filter stats if a specific campaign is selected
    let currentStats = totalStats;
    let currentCampaignName = 'All Campaigns';
    let currentCampaignType = campaignsList.length === 1 ? campaignsList[0].type : 'mixed';

    if (selectedCampaign) {
      const specific = campaignMap.get(selectedCampaign);
      if (specific) {
        currentStats = {
          total: specific.total,
          pending: specific.pending,
          sent: specific.sent,
          failed: specific.failed,
          bounced: specific.bounced,
          clicked: specific.clicked,
          converted: specific.converted,
          active: specific.active,
        };
        currentCampaignName = specific.name;
        currentCampaignType = specific.type;
      }
    }

    // Re-declare variables used by response
    const { total, pending, sent, failed, bounced, clicked, converted } = currentStats;

    // Calculate progress
    const progressPercent = total > 0 ? ((sent / total) * 100).toFixed(2) : '0.00';

    // 2. DAILY SEND TRACKING
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyLogs } = await supabaseAdmin
      .from('batch_send_log')
      .select('emails_sent, batch_size_limit, override_limit')
      .eq('sent_date', today);

    const sentToday = dailyLogs?.reduce((sum, log) => sum + (log.emails_sent || 0), 0) || 0;
    // Use the limit from the most recent log, or default to 75
    const dailyLimit = dailyLogs && dailyLogs.length > 0 ? dailyLogs[dailyLogs.length - 1].batch_size_limit : 75;
    const remaining = Math.max(0, dailyLimit - sentToday);
    const canSendAgain = remaining > 0 || (dailyLogs && dailyLogs.some(l => l.override_limit));

    // 3. ENHANCED CLICK TRACKING (with email stage)
    const clickQuery = selectedCampaign
      ? supabaseAdmin.from('campaign_clicks').select('*').eq('campaign_name', selectedCampaign).range(0, 9999)
      : supabaseAdmin.from('campaign_clicks').select('*').range(0, 9999);

    const { data: clickRecords } = await clickQuery;

    // Calculate engagement metrics
    const uniqueClicks = new Set(clickRecords?.map((c: any) => c.customer_email)).size;
    const clickThroughRate = total > 0 ? ((uniqueClicks / total) * 100).toFixed(2) : '0.00';
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(2) : '0.00';

    // Recent clicks for table
    const recentClicks = clickRecords?.slice(0, 50).map((c: any) => ({
      customerEmail: c.customer_email,
      clickedUrl: c.url_destination,
      fromEmailStage: c.email_stage || 1,
      campaignName: c.campaign_name || 'Unknown',
      clickedAt: c.clicked_at
    })) || [];

    // 4. BUCKET LOGIC STATS (Priority Queue)
    // Priority 1: Follow-ups (active customers due for next email)
    const followUpQuery = selectedCampaign
      ? supabaseAdmin.from('reengagement_campaign')
        .select('*')
        .eq('campaign_name', selectedCampaign)
        .eq('status', 'active')
        .lte('next_action_date', new Date().toISOString())
        .range(0, 9999)
      : supabaseAdmin.from('reengagement_campaign')
        .select('*')
        .eq('status', 'active')
        .lte('next_action_date', new Date().toISOString())
        .range(0, 9999);

    const { data: followUps } = await followUpQuery;
    const followUpsCount = followUps?.length || 0;

    // Priority 2: New leads (pending customers)
    const newLeadsCount = pending;

    // Fetch a small sample of pending records for "Next Up" preview
    // We only need enough to fill the batch size
    const batchSize = 75;
    const remainingSlots = Math.max(0, batchSize - followUpsCount);

    let nextBatchRecords: any[] = [...(followUps || [])];

    if (remainingSlots > 0) {
      const newLeadsQuery = selectedCampaign
        ? supabaseAdmin.from('reengagement_campaign')
          .select('*')
          .eq('campaign_name', selectedCampaign)
          .eq('status', 'pending')
          .order('batch_number', { ascending: true })
          .limit(remainingSlots)
        : supabaseAdmin.from('reengagement_campaign')
          .select('*')
          .eq('status', 'pending')
          .order('batch_number', { ascending: true })
          .limit(remainingSlots);

      const { data: newLeads } = await newLeadsQuery;
      if (newLeads) {
        nextBatchRecords = [...nextBatchRecords, ...newLeads];
      }
    }

    // 5. RETURN ENHANCED STATS
    return NextResponse.json({
      campaigns: campaignsList,

      // ENHANCED: Current campaign details
      campaign: {
        name: currentCampaignName,
        total,
        progressPercent: `${progressPercent}%`,
        type: currentCampaignType,
      },

      // ENHANCED: Daily Progress
      dailyProgress: {
        sentToday,
        dailyLimit,
        remaining,
        canSendAgain,
        percentUsed: dailyLimit > 0 ? ((sentToday / dailyLimit) * 100).toFixed(1) : '0',
        nextAvailableAt: canSendAgain ? 'Now' : 'Tomorrow'
      },

      // Standard status breakdown
      status: {
        pending,
        sent,
        failed,
        bounced,
        clicked,
        converted,
      },

      // Bucket logic for queue visualization
      buckets: {
        newLeads: newLeadsCount,
        followUps: followUpsCount,
      },

      // Engagement metrics
      engagement: {
        totalClicks: clickRecords?.length || 0,
        uniqueClicks,
        clickThroughRate: `${clickThroughRate}%`,
        conversionRate: `${conversionRate}%`,
      },

      // ENHANCED: Click details
      clicks: {
        total: clickRecords?.length || 0,
        unique: uniqueClicks,
        rate: `${clickThroughRate}%`,
        recent: recentClicks
      },

      // Preview of next batch
      nextBatch: nextBatchRecords.map((r: any) => ({
        email: r.customer_email,
        name: r.customer_name || 'Customer',
        stage: r.campaign_stage,
        campaign: r.campaign_name
      })),
    });

  } catch (error: any) {
    console.error('Status API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status', details: error.message },
      { status: 500 }
    );
  }
}
