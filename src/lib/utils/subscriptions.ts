// =====================================================
// Subscription Utilities
// =====================================================
// Calculations and logic for recurring subscriptions
// =====================================================

import { addDays } from 'date-fns';

// Subscription configuration
export const SUBSCRIPTION_CONFIG = {
  FREQUENCIES: {
    monthly: {
      days: 30,
      label: 'Monthly',
      description: 'Every 30 days',
      discount: 10,
    },
    every_60_days: {
      days: 60,
      label: 'Every 60 Days',
      description: 'Every 2 months',
      discount: 15,
    },
    every_90_days: {
      days: 90,
      label: 'Every 90 Days',
      description: 'Every 3 months',
      discount: 20,
    },
  },

  // Product recommendations
  RECOMMENDED_FREQUENCY: {
    paracleanse: 'every_90_days', // 3-month cleanse cycle
    maya: 'monthly', // Daily supplement
    seamoss: 'monthly', // Daily supplement
    'mucus-cleanser': 'every_60_days', // Periodic cleanse
  },
} as const;

export type SubscriptionFrequency = keyof typeof SUBSCRIPTION_CONFIG.FREQUENCIES;
export type ProductId = keyof typeof SUBSCRIPTION_CONFIG.RECOMMENDED_FREQUENCY;

/**
 * Calculate discounted price for subscription
 */
export function calculateSubscriptionPrice(
  basePrice: number,
  frequency: SubscriptionFrequency
): number {
  const discount = SUBSCRIPTION_CONFIG.FREQUENCIES[frequency].discount;
  const discountedPrice = basePrice * (1 - discount / 100);
  return Number(discountedPrice.toFixed(2));
}

/**
 * Calculate next shipment date
 */
export function calculateNextShipmentDate(
  frequency: SubscriptionFrequency,
  lastShipmentDate?: Date
): Date {
  const baseDate = lastShipmentDate || new Date();
  const days = SUBSCRIPTION_CONFIG.FREQUENCIES[frequency].days;
  return addDays(baseDate, days);
}

/**
 * Get discount percentage for frequency
 */
export function getFrequencyDiscount(frequency: SubscriptionFrequency): number {
  return SUBSCRIPTION_CONFIG.FREQUENCIES[frequency].discount;
}

/**
 * Get recommended frequency for product
 */
export function getRecommendedFrequency(productId: string): SubscriptionFrequency {
  return SUBSCRIPTION_CONFIG.RECOMMENDED_FREQUENCY[productId as ProductId] || 'monthly';
}

/**
 * Calculate total savings for subscription
 */
export function calculateSubscriptionSavings(
  basePrice: number,
  frequency: SubscriptionFrequency,
  shipmentsPerYear: number
): {
  oneTimeTotal: number;
  subscriptionTotal: number;
  totalSavings: number;
  savingsPercentage: number;
} {
  const discountedPrice = calculateSubscriptionPrice(basePrice, frequency);
  const oneTimeTotal = basePrice * shipmentsPerYear;
  const subscriptionTotal = discountedPrice * shipmentsPerYear;
  const totalSavings = oneTimeTotal - subscriptionTotal;
  const savingsPercentage = (totalSavings / oneTimeTotal) * 100;

  return {
    oneTimeTotal: Number(oneTimeTotal.toFixed(2)),
    subscriptionTotal: Number(subscriptionTotal.toFixed(2)),
    totalSavings: Number(totalSavings.toFixed(2)),
    savingsPercentage: Number(savingsPercentage.toFixed(1)),
  };
}

/**
 * Get frequency options for product
 */
export function getFrequencyOptions(productId: string) {
  const recommended = getRecommendedFrequency(productId);

  return Object.entries(SUBSCRIPTION_CONFIG.FREQUENCIES).map(([key, config]) => ({
    value: key as SubscriptionFrequency,
    label: config.label,
    description: config.description,
    discount: config.discount,
    isRecommended: key === recommended,
  }));
}

/**
 * Calculate shipments per year for frequency
 */
export function getShipmentsPerYear(frequency: SubscriptionFrequency): number {
  const days = SUBSCRIPTION_CONFIG.FREQUENCIES[frequency].days;
  return Math.floor(365 / days);
}
