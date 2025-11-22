/**
 * Email Link Tracking Utilities
 *
 * Wraps all URLs in email templates with tracking parameters.
 * This is the ONLY way to track engagement since we can't detect opens.
 *
 * What we CAN track:
 * ✅ Clicks - User clicked a link in the email
 * ✅ Bounces - Email returned to sender (handled by inbox monitoring)
 * ❌ Opens - Not trackable without pixel/webhook support
 */

interface TrackingParams {
  email: string;
  campaign: string;
  stage?: number;
  dest: string;
}

/**
 * Wraps a destination URL with tracking parameters
 *
 * @param dest - Final destination URL (e.g., /paracleanse, https://example.com/shop)
 * @param email - Customer email being tracked
 * @param campaign - Campaign identifier (e.g., "winback-2025", "product-launch")
 * @param stage - Optional email stage (1, 2, 3, etc.)
 *
 * @returns Tracking URL that redirects to destination after logging click
 *
 * @example
 * wrapTrackingLink('/shop', 'john@example.com', 'winback-2025', 1)
 * // Returns: https://drsebiapproved.com/api/campaign/track-click?email=john@example.com&campaign=winback-2025&stage=1&dest=/shop
 */
export function wrapTrackingLink(
  dest: string,
  email: string,
  campaign: string,
  stage?: number
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://drsebiapproved.com';

  const params = new URLSearchParams({
    email: email,
    campaign: campaign,
    dest: dest
  });

  if (stage) {
    params.append('stage', stage.toString());
  }

  return `${baseUrl}/api/campaign/track-click?${params.toString()}`;
}

/**
 * Wraps all <a> tags in HTML content with tracking links
 *
 * @param htmlContent - Email HTML template
 * @param email - Customer email
 * @param campaign - Campaign identifier
 * @param stage - Email stage number
 *
 * @returns HTML with all links wrapped for tracking
 *
 * @example
 * const html = '<a href="/shop">Shop Now</a>';
 * wrapAllLinks(html, 'john@example.com', 'winback-2025', 1);
 * // Returns: '<a href="https://drsebiapproved.com/api/campaign/track-click?email=john@...&dest=/shop">Shop Now</a>'
 */
export function wrapAllLinks(
  htmlContent: string,
  email: string,
  campaign: string,
  stage?: number
): string {
  // Regex to find all href attributes
  const hrefRegex = /href=["']([^"']+)["']/g;

  return htmlContent.replace(hrefRegex, (match, url) => {
    // Skip if already wrapped (contains track-click)
    if (url.includes('/track-click')) {
      return match;
    }

    // Skip mailto: and tel: links
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      return match;
    }

    // Skip anchor links
    if (url.startsWith('#')) {
      return match;
    }

    // Wrap the link
    const trackedUrl = wrapTrackingLink(url, email, campaign, stage);
    return `href="${trackedUrl}"`;
  });
}

/**
 * Gets tracking stats for a campaign
 *
 * @param campaign - Campaign identifier
 * @returns Click statistics
 */
export async function getCampaignClickStats(campaign: string) {
  // This will query the campaign_clicks table
  // Implementation in API route
  return {
    totalClicks: 0,
    uniqueClicks: 0,
    clickThroughRate: '0.00%',
    topLinks: []
  };
}

/**
 * Generate unsubscribe link for email
 *
 * @param email - Customer email
 * @param campaign - Campaign identifier
 * @returns Unsubscribe tracking URL
 */
export function getUnsubscribeLink(email: string, campaign: string): string {
  return wrapTrackingLink('/unsubscribe', email, campaign);
}

/**
 * Zoho Rate Limits (Free Account)
 *
 * These limits must be respected to avoid API throttling:
 * - 300 emails/day maximum
 * - 100 API requests/hour
 * - 10 requests/second for contacts
 *
 * Recommended batch sizes:
 * - Conservative: 75 emails/day (leaves buffer)
 * - Standard: 150 emails/day
 * - Maximum: 250 emails/day (monitor closely)
 */
export const ZOHO_RATE_LIMITS = {
  MAX_EMAILS_PER_DAY: 300,
  MAX_REQUESTS_PER_HOUR: 100,
  MAX_CONTACT_REQUESTS_PER_SECOND: 10,

  // Recommended delays between sends
  DELAY_CONSERVATIVE: 120, // 2 minutes (720 emails/day if running 24/7)
  DELAY_STANDARD: 600, // 10 minutes (144 emails/day)
  DELAY_SAFE: 900, // 15 minutes (96 emails/day)

  // Batch size recommendations
  BATCH_SIZE_CONSERVATIVE: 75,
  BATCH_SIZE_STANDARD: 150,
  BATCH_SIZE_AGGRESSIVE: 250,
};

/**
 * Calculate estimated send duration
 *
 * @param totalEmails - Total emails to send
 * @param dailyLimit - Emails per day limit
 * @returns Estimated days to complete campaign
 */
export function calculateSendDuration(totalEmails: number, dailyLimit: number): number {
  return Math.ceil(totalEmails / dailyLimit);
}

/**
 * Validate batch size against Zoho limits
 *
 * @param batchSize - Requested batch size
 * @returns Validation result with warnings
 */
export function validateBatchSize(batchSize: number): {
  valid: boolean;
  warning?: string;
  severity?: 'info' | 'warning' | 'error';
} {
  if (batchSize > ZOHO_RATE_LIMITS.MAX_EMAILS_PER_DAY) {
    return {
      valid: false,
      warning: `Exceeds Zoho free limit (${ZOHO_RATE_LIMITS.MAX_EMAILS_PER_DAY}/day). Reduce batch size.`,
      severity: 'error'
    };
  }

  if (batchSize > ZOHO_RATE_LIMITS.BATCH_SIZE_STANDARD) {
    return {
      valid: true,
      warning: `High batch size. Monitor for throttling. Consider ${ZOHO_RATE_LIMITS.BATCH_SIZE_STANDARD}/day.`,
      severity: 'warning'
    };
  }

  if (batchSize < ZOHO_RATE_LIMITS.BATCH_SIZE_CONSERVATIVE) {
    return {
      valid: true,
      warning: `Conservative batch size. You can safely increase to ${ZOHO_RATE_LIMITS.BATCH_SIZE_CONSERVATIVE}/day.`,
      severity: 'info'
    };
  }

  return { valid: true };
}
