/**
 * Batch Email Sender with Rate Limiting & Multi-Touch Logic
 * POST /api/campaign/send-batch
 *
 * Sends emails to customers based on "Bucket Logic":
 * 1. Priority: Follow-ups (active customers due for next email)
 * 2. Fill: New leads (pending customers)
 *
 * Rate limited to 50-75 emails per day total.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured, ReengagementCampaign } from '@/lib/supabase';
import { sendEmail, getDefaultUserEmail, isZohoConfigured } from '@/lib/zoho';
import { wrapAllLinks } from '@/lib/email-tracking';

// --- TEMPLATES ---

function getTemplateForStage(stage: number, customerName: string | null, customerEmail: string, campaignId: string = 'winback-2025') {
  const firstName = customerName?.split(' ')[0] || 'Friend';

  // Base HTML templates WITHOUT tracking (tracking will be added by wrapAllLinks)
  switch (stage) {
    case 1: // Intro / Win-Back
      const stage1Html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2D5016;">Welcome Back, ${firstName}!</h1>
          <p>It's been a while since we've seen you. Your health journey matters to us, and we'd love to support you again.</p>
          <div style="background: #f4f4f4; padding: 20px; border-left: 4px solid #4A7C2F; margin: 20px 0;">
            <h2 style="margin: 0; color: #2D5016;">20% OFF EVERYTHING</h2>
            <p style="margin: 5px 0;">Code: <strong>WELCOME20</strong></p>
          </div>
          <p>Restock your favorites like ParaCleanse Elite or Sea Moss today.</p>
          <a href="/paracleanse" style="display: inline-block; background: #4A7C2F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Shop Now & Save 20%</a>
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            <a href="/unsubscribe">Unsubscribe</a>
          </p>
        </div>
      `;
      return {
        subject: `${firstName}, we miss you! Here's 20% off your favorite Dr. Sebi products`,
        htmlContent: wrapAllLinks(stage1Html, customerEmail, campaignId, stage)
      };

    case 2: // Follow-Up (Value)
      const stage2Html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <p>Hi ${firstName},</p>
          <p>Just wanted to make sure you saw the special 20% discount we sent earlier. We know life gets busy!</p>
          <p>The <strong>ParaCleanse Elite</strong> is currently our top-rated product for a reason—it works.</p>
          <a href="/paracleanse" style="color: #4A7C2F; font-weight: bold;">Claim your 20% off here »</a>
          <p>Best,<br>The Dr. Sebi Approved Team</p>
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            <a href="/unsubscribe">Unsubscribe</a>
          </p>
        </div>
      `;
      return {
        subject: `Did you see this, ${firstName}? (Your 20% off is waiting)`,
        htmlContent: wrapAllLinks(stage2Html, customerEmail, campaignId, stage)
      };

    case 3: // Urgency
      const stage3Html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d9534f;">Don't miss out, ${firstName}</h2>
          <p>Your <strong>WELCOME20</strong> code is set to expire soon.</p>
          <p>Don't let your health goals wait another day.</p>
          <a href="/shop" style="display: inline-block; background: #d9534f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Shop Before It Expires</a>
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            <a href="/unsubscribe">Unsubscribe</a>
          </p>
        </div>
      `;
      return {
        subject: `Last chance: Your code expires in 48 hours`,
        htmlContent: wrapAllLinks(stage3Html, customerEmail, campaignId, stage)
      };

    default:
      const defaultHtml = `<p>Visit <a href="/shop">Dr. Sebi Approved</a></p>`;
      return {
        subject: `Special Offer for ${firstName}`,
        htmlContent: wrapAllLinks(defaultHtml, customerEmail, campaignId, stage)
      };
  }
}

// --- MAIN HANDLER ---

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    if (!isSupabaseConfigured() || !isZohoConfigured()) {
      return NextResponse.json({ error: 'System not configured' }, { status: 503 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      batchSize = 75, // Changed default from 50 to 75
      delaySeconds = 120,
      dryRun = false,
      campaignName = null, // NEW: Optional campaign filter
      overrideDailyLimit = false, // NEW: Allow manual override
    } = body;

    console.log(`Starting Bucket Batch: Campaign="${campaignName || 'auto'}", Limit ${batchSize}, Delay ${delaySeconds}s`);

    // 1. CHECK DAILY SEND LIMIT
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: todayLogs, error: logError } = await supabaseAdmin
      .from('batch_send_log')
      .select('emails_sent')
      .eq('sent_date', today);

    if (logError) {
      console.error('[Send Batch] Error checking daily logs:', logError);
      // Continue anyway - don't block on logging errors
    }

    const sentToday = (todayLogs || []).reduce((sum, log) => sum + log.emails_sent, 0);
    const dailyLimit = batchSize; // For now, daily limit = batch size (can be made separate)

    console.log(`[Send Batch] Daily status: ${sentToday}/${dailyLimit} sent today`);

    if (sentToday >= dailyLimit && !overrideDailyLimit) {
      return NextResponse.json({
        error: 'Daily send limit reached',
        sentToday,
        dailyLimit,
        remaining: 0,
        nextAvailable: 'tomorrow',
        message: `Already sent ${sentToday} emails today. Limit is ${dailyLimit}/day. Come back tomorrow or enable "Override Limit" to send anyway.`
      }, { status: 429 });
    }

    if (overrideDailyLimit) {
      console.warn(`[Send Batch] ⚠️ OVERRIDE: Daily limit bypassed (${sentToday}/${dailyLimit})`);
    }

    // 2. DETERMINE TARGET CAMPAIGN
    let targetCampaign = campaignName;

    if (!targetCampaign) {
      // Auto-select oldest campaign with pending customers
      const { data: availableCampaigns } = await supabaseAdmin
        .from('reengagement_campaign')
        .select('campaign_name, uploaded_at')
        .eq('status', 'pending')
        .order('uploaded_at', { ascending: true })
        .limit(1);

      targetCampaign = availableCampaigns?.[0]?.campaign_name || null;

      if (!targetCampaign) {
        return NextResponse.json({
          message: 'No pending campaigns found. All customers have been contacted.',
          sentToday,
          dailyLimit
        });
      }

      console.log(`[Send Batch] Auto-selected campaign: "${targetCampaign}"`);
    }

    // 3. BUILD QUERY WITH CAMPAIGN FILTER
    const baseFollowUpQuery = supabaseAdmin
      .from('reengagement_campaign')
      .select('*')
      .eq('status', 'active')
      .lte('next_action_date', new Date().toISOString());

    const followUpQuery = targetCampaign
      ? baseFollowUpQuery.eq('campaign_name', targetCampaign)
      : baseFollowUpQuery;

    // FETCH FOLLOW-UPS (Priority 1)
    // Customers who are 'active' and due for next email
    const { data: followUps, error: followUpError } = await followUpQuery.limit(batchSize) as { data: ReengagementCampaign[] | null; error: any };


    if (followUpError) throw followUpError;

    const followUpCount = followUps?.length || 0;
    const remainingSlots = batchSize - followUpCount;

    console.log(`Bucket Status: ${followUpCount} follow-ups found. ${remainingSlots} slots for new leads.`);

    // 2. FETCH NEW LEADS (Priority 2)
    // Only if we have slots left
    let newLeads: ReengagementCampaign[] = [];
    if (remainingSlots > 0) {
      const baseLeadsQuery = supabaseAdmin
        .from('reengagement_campaign')
        .select('*')
        .eq('status', 'pending')
        .order('batch_number', { ascending: true });

      const leadsQuery = targetCampaign
        ? baseLeadsQuery.eq('campaign_name', targetCampaign)
        : baseLeadsQuery;

      const { data: leads, error: leadsError } = await leadsQuery.limit(remainingSlots) as { data: ReengagementCampaign[] | null; error: any };

      if (leadsError) throw leadsError;
      newLeads = leads || [];
    }

    // Combine lists
    const batch = [...(followUps || []), ...newLeads];

    if (batch.length === 0) {
      return NextResponse.json({ message: 'No emails to send today.' });
    }

    // 3. SEND LOOP
    const results = { sent: 0, failed: 0, errors: [] as string[] };
    const senderEmail = getDefaultUserEmail();

    for (let i = 0; i < batch.length; i++) {
      const customer = batch[i];
      const isNewLead = customer.status === 'pending';
      const currentStage = customer.campaign_stage || 1;

      // Determine next state
      // If new lead: Stage 1 -> Next: Stage 2 in 3 days
      // If follow up: Stage X -> Next: Stage X+1 in 3 days (or complete if max reached)

      const nextStage = isNewLead ? 2 : currentStage + 1;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 3); // 3 days gap

      // Max stages = 3 for now
      const isComplete = nextStage > 3;
      const newStatus = isComplete ? 'completed' : 'active';

      try {
        console.log(`[${i + 1}/${batch.length}] Sending Stage ${currentStage} to ${customer.customer_email}`);

        if (!dryRun) {
          // Pass actual campaign name for click tracking
          const campaignId = (customer as any).campaign_name || targetCampaign || 'unknown-campaign';
          const template = getTemplateForStage(currentStage, customer.customer_name, customer.customer_email, campaignId);


          const result = await sendEmail(senderEmail, {
            to: [{ address: customer.customer_email, name: customer.customer_name || undefined }],
            subject: template.subject,
            htmlContent: template.htmlContent,
          });

          // Update DB using admin client to bypass RLS
          await supabaseAdmin.from('reengagement_campaign').update({
            status: newStatus,
            // Actually, let's store the stage we JUST sent, or the one pending?
            // Let's say it tracks the one currently active.
            // So if we just sent Stage 1, we update to Stage 2 for next time.
            campaign_stage: nextStage,
            next_action_date: nextDate.toISOString(),
            sent_at: new Date().toISOString(),
            zoho_message_id: result.data?.messageId
          }).eq('id', customer.id);

          results.sent++;
        } else {
          results.sent++;
          console.log(`[DRY RUN] Sent Stage ${currentStage}`);
        }

        // Delay
        if (i < batch.length - 1 && !dryRun) {
          await new Promise(r => setTimeout(r, delaySeconds * 1000));
        }

      } catch (err: any) {
        console.error(`Failed: ${err.message}`);
        results.failed++;
        results.errors.push(err.message);
      }
    }

    // 4. LOG BATCH TO DATABASE
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    if (!dryRun && results.sent > 0) {
      try {
        await supabaseAdmin.from('batch_send_log').insert({
          campaign_name: targetCampaign || 'Unknown',
          sent_date: today,
          emails_sent: results.sent,
          follow_ups_sent: followUpCount,
          new_leads_sent: newLeads.length,
          batch_size_limit: batchSize,
          duration_seconds: durationSeconds,
          status: results.failed > 0 ? 'partial' : 'completed',
          error_message: results.errors.length > 0 ? results.errors.join('; ') : null,
          override_limit: overrideDailyLimit,
        });
        console.log(`[Send Batch] ✅ Logged batch to database: ${results.sent} emails sent`);
      } catch (logError: any) {
        console.error('[Send Batch] Failed to log batch (non-fatal):', logError.message);
        // Don't fail the request if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      results,
      bucket: {
        followUps: followUpCount,
        newLeads: newLeads.length
      },
      campaign: targetCampaign,
      dailyStatus: {
        sentBefore: sentToday,
        sentNow: results.sent,
        sentTotal: sentToday + results.sent,
        dailyLimit,
        overridden: overrideDailyLimit,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Ready for multi-touch batching' });
}
