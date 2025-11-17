// =====================================================
// Referral Program Utilities
// =====================================================

export const REFERRAL_CONFIG = {
  POINTS_PER_REFERRAL: 500,
  POINTS_FOR_REFEREE: 500,
} as const;

/**
 * Generate unique referral code from user ID
 */
export function generateReferralCode(userId: string): string {
  // Take first 6 chars of user ID and make uppercase
  return userId.substring(0, 6).toUpperCase();
}

/**
 * Generate referral URL
 */
export function generateReferralUrl(referralCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/portal/register?ref=${referralCode}`;
}

/**
 * Check if referral code is valid format
 */
export function isValidReferralCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}
