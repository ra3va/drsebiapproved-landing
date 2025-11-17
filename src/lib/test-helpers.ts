/**
 * Test Helpers and Utilities
 *
 * These utilities help with testing the customer portal and admin CRM.
 */

import { supabase } from './supabase/client';

// Mock user profiles for testing
export const mockProfiles = {
  bronzeCustomer: {
    id: 'test-bronze-001',
    email: 'bronze@test.com',
    full_name: 'Bronze Test User',
    loyalty_points: 150,
    lifetime_value: 75.50,
    referral_code: 'BRONZE001',
  },
  silverCustomer: {
    id: 'test-silver-001',
    email: 'silver@test.com',
    full_name: 'Silver Test User',
    loyalty_points: 500,
    lifetime_value: 350.00,
    referral_code: 'SILVER001',
  },
  goldCustomer: {
    id: 'test-gold-001',
    email: 'gold@test.com',
    full_name: 'Gold Test User',
    loyalty_points: 2500,
    lifetime_value: 1250.00,
    referral_code: 'GOLD001',
  },
};

// Mock orders
export const mockOrders = [
  {
    id: 'order-001',
    square_order_id: 'sq-order-123',
    user_id: 'test-bronze-001',
    total_amount: 4999,
    status: 'delivered',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    order_items: [
      {
        product_name: 'ParaCleanse Elite',
        quantity: 1,
        price: 4999,
      },
    ],
  },
  {
    id: 'order-002',
    square_order_id: 'sq-order-456',
    user_id: 'test-silver-001',
    total_amount: 7698,
    status: 'shipped',
    tracking_number: '1Z999AA10123456784',
    shipping_carrier: 'UPS',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    order_items: [
      {
        product_name: 'Maya Formula',
        quantity: 1,
        price: 4499,
      },
      {
        product_name: 'Sea Moss Capsules',
        quantity: 1,
        price: 3199,
      },
    ],
  },
];

// Mock subscriptions
export const mockSubscriptions = [
  {
    id: 'sub-001',
    user_id: 'test-silver-001',
    product_name: 'ParaCleanse Elite',
    quantity: 1,
    frequency: 'monthly' as const,
    price: 4499,
    status: 'active' as const,
    next_shipment_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Test data generators
export const testHelpers = {
  /**
   * Generate a test customer profile
   */
  generateTestProfile: (tier: 'bronze' | 'silver' | 'gold' = 'bronze') => {
    const lifetimeValues = {
      bronze: 50 + Math.random() * 150,
      silver: 200 + Math.random() * 300,
      gold: 500 + Math.random() * 500,
    };

    return {
      id: `test-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      full_name: `Test User ${Date.now()}`,
      loyalty_points: Math.floor(lifetimeValues[tier]),
      lifetime_value: lifetimeValues[tier],
      referral_code: `TEST${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Generate a test order
   */
  generateTestOrder: (userId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' = 'pending') => {
    const amount = 3000 + Math.floor(Math.random() * 5000);

    return {
      id: `order-${Date.now()}`,
      square_order_id: `sq-${Date.now()}`,
      user_id: userId,
      total_amount: amount,
      status,
      created_at: new Date().toISOString(),
      tracking_number: status === 'shipped' || status === 'delivered' ? `1Z${Date.now()}` : null,
      shipping_carrier: status === 'shipped' || status === 'delivered' ? 'USPS' : null,
      order_items: [
        {
          product_name: 'Test Product',
          quantity: 1,
          price: amount,
        },
      ],
    };
  },

  /**
   * Calculate expected loyalty points for an order
   */
  calculateExpectedPoints: (orderAmount: number): number => {
    // 1 point per $1 spent (amount is in cents)
    return Math.floor(orderAmount / 100);
  },

  /**
   * Validate subscription pricing
   */
  validateSubscriptionPrice: (
    basePrice: number,
    frequency: 'monthly' | 'every_60_days' | 'every_90_days'
  ): number => {
    const discounts = {
      monthly: 0.10,
      every_60_days: 0.15,
      every_90_days: 0.20,
    };

    return Math.floor(basePrice * (1 - discounts[frequency]));
  },

  /**
   * Check if user can redeem points
   */
  canRedeemPoints: (currentPoints: number, pointsToRedeem: number): boolean => {
    return pointsToRedeem >= 500 && pointsToRedeem <= currentPoints;
  },
};

// API testing helpers
export const apiTestHelpers = {
  /**
   * Test customer creation flow
   */
  testCustomerCreation: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test Customer',
        },
      },
    });

    return { data, error };
  },

  /**
   * Test order sync
   */
  testOrderSync: async (squareOrderId: string) => {
    const response = await fetch('/api/sync/square-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ squareOrderId }),
    });

    return response.json();
  },

  /**
   * Test loyalty point redemption
   */
  testPointsRedemption: async (pointsToRedeem: number) => {
    const response = await fetch('/api/loyalty/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pointsToRedeem }),
    });

    return response.json();
  },

  /**
   * Test subscription creation
   */
  testSubscriptionCreation: async (productId: string, frequency: string) => {
    const response = await fetch('/api/subscriptions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        productName: 'Test Product',
        quantity: 1,
        frequency,
        price: 4999,
      }),
    });

    return response.json();
  },
};

// Validation helpers
export const validationHelpers = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Validate phone number
   */
  isValidPhone: (phone: string): boolean => {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
  },

  /**
   * Validate ZIP code
   */
  isValidZipCode: (zipCode: string): boolean => {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  },

  /**
   * Validate coupon code format
   */
  isValidCouponCode: (code: string): boolean => {
    return /^[A-Z0-9-]{6,20}$/.test(code);
  },
};

// Export all helpers
export default {
  mockProfiles,
  mockOrders,
  mockSubscriptions,
  testHelpers,
  apiTestHelpers,
  validationHelpers,
};
