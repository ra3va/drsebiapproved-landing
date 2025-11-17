'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeSubscriptions: number;
  totalLoyaltyPoints: number;
  revenueByProduct: { product_name: string; revenue: number; orders: number }[];
  customersByTier: { tier: string; count: number; revenue: number }[];
  ordersOverTime: { date: string; orders: number; revenue: number }[];
  topCustomers: {
    id: string;
    full_name: string;
    email: string;
    lifetime_value: number;
    orders_count: number;
  }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  async function fetchAnalytics() {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/analytics?days=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Business metrics and insights</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            ${(analytics?.totalRevenue || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{analytics?.totalOrders || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Average Order Value</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            ${(analytics?.averageOrderValue || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Active Subscriptions</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {analytics?.activeSubscriptions || 0}
          </div>
        </div>
      </div>

      {/* Revenue by Product */}
      {analytics?.revenueByProduct && analytics.revenueByProduct.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Revenue by Product</h2>
          <div className="space-y-4">
            {analytics.revenueByProduct.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{product.product_name}</div>
                  <div className="text-sm text-gray-600">{product.orders} orders</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${product.revenue.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">
                    ${(product.revenue / product.orders).toFixed(2)} avg
                  </div>
                </div>
                <div className="ml-4 w-32">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 rounded-full h-2"
                      style={{
                        width: `${
                          (product.revenue / (analytics.totalRevenue || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customers by Tier */}
      {analytics?.customersByTier && analytics.customersByTier.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.customersByTier.map((tier) => (
            <div key={tier.tier} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{tier.tier} Members</h3>
                <div className="text-2xl">
                  {tier.tier === 'Gold' ? '👑' : tier.tier === 'Silver' ? '⭐' : '🥉'}
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                  <div className="text-2xl font-bold">{tier.count}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-2xl font-bold">${tier.revenue.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Avg per Customer</div>
                  <div className="text-lg font-medium">
                    ${(tier.revenue / tier.count).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Customers */}
      {analytics?.topCustomers && analytics.topCustomers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Top Customers</h2>
          <div className="space-y-3">
            {analytics.topCustomers.map((customer, idx) => (
              <div
                key={customer.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 mr-3">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{customer.full_name || 'Unknown'}</div>
                    <div className="text-sm text-gray-600">{customer.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${customer.lifetime_value.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">{customer.orders_count} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loyalty Points Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Loyalty Program Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600">Total Points Issued</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {(analytics?.totalLoyaltyPoints || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${((analytics?.totalLoyaltyPoints || 0) / 100).toFixed(2)} liability
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Active Subscriptions</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {analytics?.activeSubscriptions || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Recurring revenue customers</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Customer Lifetime Value</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              ${
                analytics?.totalCustomers
                  ? ((analytics.totalRevenue || 0) / analytics.totalCustomers).toFixed(2)
                  : '0.00'
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">Average per customer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
