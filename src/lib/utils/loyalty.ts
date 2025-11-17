// =====================================================
// Loyalty Program Utilities
// =====================================================
// Calculations and logic for loyalty points system
// Industry Standard: 1 point per $1 spent
// =====================================================

// Points earning rates
export const LOYALTY_CONFIG = {
  // Points per dollar spent
  POINTS_PER_DOLLAR: 1,

  // Bonuses
  SIGNUP_BONUS: 100,
  BIRTHDAY_BONUS: 500,
  REFERRAL_POINTS: 500,
  REVIEW_POINTS: 50,

  // Redemption tiers (points → discount value)
  REDEMPTION_TIERS: [
    { points: 500, value: 5, rate: 0.01 }, // 1¢ per point
    { points: 1000, value: 12, rate: 0.012 }, // 1.2¢ per point (20% bonus)
    { points: 2000, value: 25, rate: 0.0125 }, // 1.25¢ per point (25% bonus)
    { points: 5000, value: 60, rate: 0.012 }, // Free ParaCleanse!
  ],
} as const;

/**
 * Calculate points earned from purchase amount
 */
export function calculatePointsEarned(amountInDollars: number): number {
  return Math.floor(amountInDollars * LOYALTY_CONFIG.POINTS_PER_DOLLAR);
}

/**
 * Get redemption value for points with bonus tiers
 */
export function getRedemptionValue(points: number): number {
  // Find the highest tier that applies
  const tier = [...LOYALTY_CONFIG.REDEMPTION_TIERS]
    .reverse()
    .find((t) => points >= t.points);

  if (!tier) {
    // Below minimum redemption
    return 0;
  }

  // Calculate discount value with tier rate
  return Number((points * tier.rate).toFixed(2));
}

/**
 * Get all available redemption options for user's points
 */
export function getRedemptionOptions(currentPoints: number) {
  return LOYALTY_CONFIG.REDEMPTION_TIERS.filter(
    (tier) => currentPoints >= tier.points
  ).map((tier) => ({
    points: tier.points,
    value: tier.value,
    bonusPercentage: tier.rate > 0.01 ? Math.round((tier.rate / 0.01 - 1) * 100) : 0,
    description: `${tier.points} points = $${tier.value} off`,
  }));
}

/**
 * Generate unique coupon code
 */
export function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Remove confusing chars
  let code = 'LOYALTY-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calculate coupon expiration date (30 days from now)
 */
export function getCouponExpirationDate(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  return expiresAt;
}

/**
 * Check if user has enough points for redemption
 */
export function canRedeem(currentPoints: number, pointsToRedeem: number): boolean {
  return currentPoints >= pointsToRedeem && pointsToRedeem >= 500;
}

/**
 * Get loyalty tier based on lifetime value
 */
export function getLoyaltyTier(lifetimeValue: number): {
  name: string;
  color: string;
  minValue: number;
  benefits: string[];
} {
  if (lifetimeValue >= 500) {
    return {
      name: 'Gold',
      color: 'text-yellow-600',
      minValue: 500,
      benefits: [
        'Double points on birthdays',
        'Early access to new products',
        'Free shipping always',
        'Exclusive member pricing',
      ],
    };
  }

  if (lifetimeValue >= 200) {
    return {
      name: 'Silver',
      color: 'text-gray-400',
      minValue: 200,
      benefits: [
        'Bonus birthday points',
        'Priority support',
        'Member-only deals',
      ],
    };
  }

  return {
    name: 'Bronze',
    color: 'text-orange-600',
    minValue: 0,
    benefits: ['Earn points on every purchase', 'Birthday bonus', 'Referral rewards'],
  };
}
