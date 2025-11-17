/**
 * Batch Email Sender with Rate Limiting
 * POST /api/campaign/send-batch
 *
 * Sends emails to the next batch of customers (default: 50-75 emails)
 * Rate limited to avoid spam flags and respect Zoho limits
 *
 * Usage:
 * - Run manually via API call
 * - Or set up daily cron job (Render.com, Vercel Cron, etc.)
 *
 * Spacing strategy:
 * - 50-75 emails per day
 * - 2-3 minute delays between individual sends
 * - Respects Zoho API rate limits (200/min)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, ReengagementCampaign } from '@/lib/supabase';
import { sendEmail, getDefaultUserEmail, isZohoConfigured } from '@/lib/zoho';

// Email template generator
// This will be replaced with the actual template later
function generateWinBackEmail(customerName: string | null, customerEmail: string) {
  const firstName = customerName?.split(' ')[0] || 'Friend';

  return {
    subject: `${firstName}, we miss you! Here's 20% off your favorite Dr. Sebi products`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2D5016 0%, #4A7C2F 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome Back, ${firstName}!</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
                      We noticed it's been a while since you last ordered from <strong>Dr. Sebi Approved</strong>.
                    </p>

                    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 20px;">
                      As a valued customer, we want to welcome you back with a special offer:
                    </p>

                    <div style="background-color: #FFF8DC; border-left: 4px solid #4A7C2F; padding: 20px; margin: 30px 0;">
                      <p style="font-size: 24px; font-weight: bold; color: #2D5016; margin: 0 0 10px 0;">
                        20% OFF YOUR NEXT ORDER
                      </p>
                      <p style="font-size: 14px; color: #666666; margin: 0;">
                        Use code: <strong style="color: #4A7C2F; font-size: 18px;">WELCOME20</strong>
                      </p>
                    </div>

                    <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 30px;">
                      Whether you're looking to restock your favorites or try something new, we've got you covered with our full line of alkaline herbs and natural remedies.
                    </p>

                    <!-- CTA Button with Tracking -->
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="https://drsebiapproved.com/api/campaign/track-click?email=${encodeURIComponent(customerEmail)}&redirect=/paracleanse"
                         style="display: inline-block; background: linear-gradient(135deg, #4A7C2F 0%, #2D5016 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        Claim Your 20% Discount
                      </a>
                    </div>

                    <p style="font-size: 14px; line-height: 1.6; color: #666666; margin-top: 30px;">
                      <strong>Popular products you might love:</strong><br>
                      • ParaCleanse Elite - Deep intestinal cleanse<br>
                      • Maya Formula - Fertility & reproductive health<br>
                      • Sea Moss Capsules - 92 essential minerals<br>
                      • Mucus Cleanser - Respiratory support
                    </p>

                    <p style="font-size: 14px; line-height: 1.6; color: #666666; margin-top: 20px;">
                      <em>This offer expires in 7 days. Don't miss out!</em>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="font-size: 14px; color: #666666; margin: 0 0 10px 0;">
                      Questions? Reply to this email or visit our website.
                    </p>
                    <p style="font-size: 12px; color: #999999; margin: 0;">
                      Dr. Sebi Approved | info@drsebiapproved.com
                    </p>
                    <p style="font-size: 11px; color: #cccccc; margin: 20px 0 0 0;">
                      You're receiving this email because you previously purchased from Dr. Sebi Approved.
                      <a href="https://drsebiapproved.com/api/campaign/track-click?email=${encodeURIComponent(customerEmail)}&redirect=/unsubscribe" style="color: #4A7C2F;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check if systems are configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured', message: 'Database not ready' },
        { status: 503 }
      );
    }

    if (!isZohoConfigured()) {
      return NextResponse.json(
        { error: 'Zoho not configured', message: 'Email system not ready. Waiting for credentials from Carl.' },
        { status: 503 }
      );
    }

    // Get parameters from request
    const body = await request.json().catch(() => ({}));
    const {
      batchSize = 50, // Default: 50 emails per batch
      delaySeconds = 120, // Default: 2 minute delay between sends
      dryRun = false, // Test mode: don't actually send emails
    } = body;

    console.log(`Starting batch send: ${batchSize} emails, ${delaySeconds}s delay, dryRun: ${dryRun}`);

    // Get next batch of pending customers
    const { data: customers, error } = await supabase
      .from('reengagement_campaign')
      .select('*')
      .eq('status', 'pending')
      .order('batch_number', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(batchSize) as { data: ReengagementCampaign[] | null; error: any };

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customers', message: error.message },
        { status: 500 }
      );
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending customers to send to',
        sent: 0,
        failed: 0,
        remaining: 0,
      });
    }

    console.log(`Found ${customers.length} pending customers to email`);

    // Track results
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    const senderEmail = getDefaultUserEmail();

    // Send emails with delays
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];

      try {
        console.log(`[${i + 1}/${customers.length}] Sending to: ${customer.customer_email}`);

        if (!dryRun) {
          // Generate email content
          const emailTemplate = generateWinBackEmail(customer.customer_name, customer.customer_email);

          // Send via Zoho
          const result = await sendEmail(senderEmail, {
            to: [{ address: customer.customer_email, name: customer.customer_name || undefined }],
            subject: emailTemplate.subject,
            htmlContent: emailTemplate.htmlContent,
          });

          // Update database with success
          await supabase
            .from('reengagement_campaign')
            .update({
              status: 'sent' as const,
              sent_at: new Date().toISOString(),
              zoho_message_id: result.data?.messageId || null,
            })
            .eq('id', customer.id);

          results.sent++;
          console.log(`✅ Sent successfully (Message ID: ${result.data?.messageId})`);
        } else {
          // Dry run mode: just log
          console.log(`[DRY RUN] Would send to: ${customer.customer_email}`);
          results.sent++;
        }

        // Add delay between sends (except after last email)
        if (i < customers.length - 1 && !dryRun) {
          console.log(`Waiting ${delaySeconds} seconds before next send...`);
          await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        }

      } catch (error: any) {
        console.error(`❌ Failed to send to ${customer.customer_email}:`, error.message);
        results.failed++;
        results.errors.push(`${customer.customer_email}: ${error.message}`);

        // Update database with failure
        await supabase
          .from('reengagement_campaign')
          .update({
            status: 'failed' as const,
            error_message: error.message,
          })
          .eq('id', customer.id);
      }
    }

    // Get remaining count
    const { count: remainingCount } = await supabase
      .from('reengagement_campaign')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const totalSent = results.sent;
    const totalFailed = results.failed;
    const remaining = remainingCount || 0;

    console.log(`Batch complete: ${totalSent} sent, ${totalFailed} failed, ${remaining} remaining`);

    return NextResponse.json({
      success: true,
      message: `Batch complete: ${totalSent} sent, ${totalFailed} failed`,
      sent: totalSent,
      failed: totalFailed,
      remaining,
      errors: results.errors.length > 0 ? results.errors : undefined,
      estimatedDaysRemaining: Math.ceil(remaining / batchSize),
      dryRun,
    });

  } catch (error: any) {
    console.error('Batch send error:', error);
    return NextResponse.json(
      { error: 'Batch send failed', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/campaign/send-batch
 * Returns instructions for batch sending
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/campaign/send-batch',
    method: 'POST',
    description: 'Send emails to next batch of pending customers',
    requestFormat: {
      batchSize: 50, // Number of emails to send (default: 50)
      delaySeconds: 120, // Delay between sends in seconds (default: 120 = 2 min)
      dryRun: false, // Test mode: log without sending (default: false)
    },
    rateLimits: {
      recommended: '50-75 emails per day',
      delayBetweenEmails: '2-3 minutes',
      zohoLimit: '200 API requests per minute',
    },
    automation: {
      cronSyntax: '0 10 * * *', // Daily at 10am
      renderCron: 'https://render.com/docs/cronjobs',
      vercelCron: 'https://vercel.com/docs/cron-jobs',
    },
    example: {
      manual: 'POST /api/campaign/send-batch with {"batchSize": 50, "delaySeconds": 120}',
      dryRun: 'POST /api/campaign/send-batch with {"dryRun": true}',
    },
  });
}
