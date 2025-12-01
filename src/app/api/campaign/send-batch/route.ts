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

  // Light HTML styling - spam-safe inline CSS only
  // Black Friday Sale: BLACKFRIDAY30 = 30% off, ends Dec 5
  switch (stage) {
    case 1: // Black Friday Announcement
      const stage1Html = `
<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333;">
  <p style="margin: 0 0 16px 0;">${firstName},</p>
  
  <p style="margin: 0 0 16px 0;">Dr. Sebi once said Maya was the greatest formula he ever created.</p>
  
  <p style="margin: 0 0 16px 0;">We still make it the same way. Same herbs. Sourced directly from Honduras - the exact region Sebi himself traveled to.</p>
  
  <p style="margin: 0 0 16px 0;">This week, it's 30% off. Everything is.</p>
  
  <p style="margin: 0 0 20px 0;"><strong>Use code BLACKFRIDAY30 at checkout.</strong></p>
  
  <p style="margin: 0 0 12px 0;"><strong>Here's what's on sale:</strong></p>
  
  <p style="margin: 0 0 16px 0;">
    <strong>Maya Formula - $41.99</strong> (normally $59.99)<br>
    Dr. Sebi's masterpiece. For energy, vitality, and overall wellness.<br>
    <a href="https://drsebiapproved.com/go/maya" style="color: #2563eb;">https://drsebiapproved.com/go/maya</a>
  </p>
  
  <p style="margin: 0 0 16px 0;">
    <strong>Sea Moss Capsules - $27.99</strong> (normally $39.99)<br>
    92 minerals your body craves. No prep, no blending.<br>
    <a href="https://drsebiapproved.com/go/seamoss" style="color: #2563eb;">https://drsebiapproved.com/go/seamoss</a>
  </p>
  
  <p style="margin: 0 0 16px 0;">
    <strong>Mucus Cleanser - $27.99</strong> (normally $39.99)<br>
    Clear the pathways. Breathe easier.<br>
    <a href="https://drsebiapproved.com/go/mucus" style="color: #2563eb;">https://drsebiapproved.com/go/mucus</a>
  </p>
  
  <p style="margin: 0 0 20px 0;">
    <strong>ParaCleanse Elite - $62.99</strong> (normally $89.99)<br>
    The deep clean. 90 capsules, 30-day protocol.<br>
    <a href="https://drsebiapproved.com/go/paracleanse" style="color: #2563eb;">https://drsebiapproved.com/go/paracleanse</a>
  </p>
  
  <p style="margin: 0 0 20px 0;">Sale ends December 5th.</p>
  
  <p style="margin: 0 0 8px 0;">- The Dr. Sebi Approved Team</p>
  
  <p style="margin: 24px 0 0 0; font-size: 12px; color: #888;">
    <a href="https://drsebiapproved.com/unsubscribe" style="color: #888;">Unsubscribe</a>
  </p>
</div>
      `.trim();
      return {
        subject: `Dr. Sebi's greatest formula is 30% off!`,
        htmlContent: wrapAllLinks(stage1Html, customerEmail, campaignId, stage)
      };

    case 2: // Reminder
      const stage2Html = `
${firstName},

Quick reminder - our Black Friday sale is still going.

30% OFF with code BLACKFRIDAY30

If you've been thinking about trying ParaCleanse or restocking your Sea Moss, now's the time.

Shop here: https://drsebiapproved.com/go/paracleanse

Sale ends December 5th.

- Dr. Sebi Approved Team

To unsubscribe: https://drsebiapproved.com/unsubscribe
      `.trim();
      return {
        subject: `Reminder: 30% off ends soon`,
        htmlContent: wrapAllLinks(`<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${stage2Html}</pre>`, customerEmail, campaignId, stage)
      };

    case 3: // Last Chance
      const stage3Html = `
${firstName},

Last call - Black Friday ends tomorrow.

After December 5th, prices go back to normal.

Use BLACKFRIDAY30 for 30% off: https://drsebiapproved.com/go/paracleanse

- Dr. Sebi Approved Team

To unsubscribe: https://drsebiapproved.com/unsubscribe
      `.trim();
      return {
        subject: `Last chance: Black Friday ends tomorrow`,
        htmlContent: wrapAllLinks(`<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${stage3Html}</pre>`, customerEmail, campaignId, stage)
      };

    default:
      const defaultHtml = `Visit Dr. Sebi Approved: https://drsebiapproved.com`;
      return {
        subject: `Special Offer for ${firstName}`,
        htmlContent: wrapAllLinks(`<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${defaultHtml}</pre>`, customerEmail, campaignId, stage)
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
      batchSize = 200, // Bumped for Black Friday push (Zoho limit: 300/day)
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
    // Follow-ups: 'sent' status customers due for next email stage
    const baseFollowUpQuery = supabaseAdmin
      .from('reengagement_campaign')
      .select('*')
      .eq('status', 'sent')
      .lt('campaign_stage', 4) // Not yet completed all 3 stages
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
      const newStatus = isComplete ? 'sent' : 'sent'; // DB constraint: pending, sent, failed, bounced, clicked, converted

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
          const { error: updateError } = await supabaseAdmin.from('reengagement_campaign').update({
            status: newStatus,
            campaign_stage: nextStage,
            next_action_date: nextDate.toISOString(),
            sent_at: new Date().toISOString(),
            zoho_message_id: result?.data?.messageId || result?.messageId || 'sent'
          }).eq('id', customer.id);

          if (updateError) {
            console.error(`DB update failed for ${customer.customer_email}:`, updateError);
          }

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
