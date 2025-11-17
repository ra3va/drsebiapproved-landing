'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeSubscriptions: number;
  pendingOrders: number;
  recentOrders: any[];
  recentCustomers: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your CRM control center</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Customers</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalCustomers || 0}
              </div>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalOrders || 0}
              </div>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                ${(stats?.totalRevenue || 0).toFixed(2)}
              </div>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Avg Order Value</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                ${(stats?.averageOrderValue || 0).toFixed(2)}
              </div>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Active Subscriptions</h2>
            <Link
              href="/admin/customers?filter=subscriptions"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="text-4xl font-bold text-green-600">{stats?.activeSubscriptions || 0}</div>
          <div className="text-sm text-gray-600 mt-2">Recurring revenue customers</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Pending Orders</h2>
            <Link
              href="/admin/orders?status=pending"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="text-4xl font-bold text-yellow-600">{stats?.pendingOrders || 0}</div>
          <div className="text-sm text-gray-600 mt-2">Require attention</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <div className="font-medium">
                      Order #{order.square_order_id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${order.total_amount.toFixed(2)}</div>
                    <div
                      className={`text-xs ${
                        order.status === 'delivered'
                          ? 'text-green-600'
                          : order.status === 'shipped'
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No recent orders</div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">New Customers</h2>
            <Link href="/admin/customers" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          {stats?.recentCustomers && stats.recentCustomers.length > 0 ? (
            <div className="space-y-3">
              {stats.recentCustomers.slice(0, 5).map((customer: any) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <div className="font-medium">{customer.full_name || 'Unknown'}</div>
                    <div className="text-sm text-gray-600">{customer.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{customer.loyalty_points} pts</div>
                    <div className="text-xs text-gray-600">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No new customers</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/customers"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
            Manage Customers
          </h3>
          <p className="text-sm text-gray-600 mt-1">Search, filter, and manage customer accounts</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="text-3xl mb-3">📦</div>
          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
            Process Orders
          </h3>
          <p className="text-sm text-gray-600 mt-1">Update order status and tracking information</p>
        </Link>

        <Link
          href="/admin/integrations"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="text-3xl mb-3">🔌</div>
          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
            Check Integrations
          </h3>
          <p className="text-sm text-gray-600 mt-1">Monitor Square and Brevo sync status</p>
        </Link>
      </div>
    </div>
  );
}
