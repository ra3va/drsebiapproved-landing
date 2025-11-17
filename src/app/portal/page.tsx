'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { getLoyaltyTier } from '@/lib/utils/loyalty';

export default function PortalDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentOrders(ordersData || []);

      // Fetch active subscriptions
      const { data: subsData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      setSubscriptions(subsData || []);

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tier = profile ? getLoyaltyTier(profile.lifetime_value) : null;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name || 'there'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your account
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loyalty Points */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90">Loyalty Points</div>
          <div className="text-3xl font-bold mt-2">{profile?.loyalty_points || 0}</div>
          <div className="text-sm mt-2">
            = ${((profile?.loyalty_points || 0) / 100).toFixed(2)} in rewards
          </div>
          <Link
            href="/portal/rewards"
            className="inline-block mt-4 text-sm font-medium underline hover:no-underline"
          >
            Redeem Points →
          </Link>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{recentOrders.length}</div>
          <div className="text-sm text-gray-600 mt-2">
            Lifetime Value: ${profile?.lifetime_value.toFixed(2)}
          </div>
          <Link
            href="/portal/orders"
            className="inline-block mt-4 text-sm font-medium text-green-600 hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Active Subscriptions</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{subscriptions.length}</div>
          <div className="text-sm text-gray-600 mt-2">
            {subscriptions.length > 0 ? 'Saving with auto-delivery' : 'Save 10-20% with subscriptions'}
          </div>
          <Link
            href="/portal/subscriptions"
            className="inline-block mt-4 text-sm font-medium text-green-600 hover:underline"
          >
            {subscriptions.length > 0 ? 'Manage Subscriptions' : 'Start Subscription'} →
          </Link>
        </div>
      </div>

      {/* Loyalty Tier */}
      {tier && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Your Status: <span className={tier.color}>{tier.name}</span></h2>
              <p className="text-sm text-gray-600 mt-1">
                {tier.name === 'Gold' ? 'You\'re at the highest tier!' : `Spend $${(tier.minValue + 100)} to reach ${tier.name === 'Bronze' ? 'Silver' : 'Gold'}`}
              </p>
            </div>
            <div className="text-4xl">{tier.name === 'Gold' ? '👑' : tier.name === 'Silver' ? '⭐' : '🥉'}</div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Your Benefits:</h3>
            <ul className="space-y-1">
              {tier.benefits.map((benefit, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link
              href="/portal/orders"
              className="text-sm text-green-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <div className="font-medium">
                    {order.order_items.map((item: any) => item.product_name).join(', ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${order.total_amount.toFixed(2)}</div>
                  <div className={`text-sm ${
                    order.status === 'delivered' ? 'text-green-600' :
                    order.status === 'shipped' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/portal/referrals"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="text-2xl mb-2">🎁</div>
          <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">
            Refer a Friend
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Give 500 points, get 500 points
          </p>
        </Link>

        <Link
          href="/"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="text-2xl mb-2">🛍️</div>
          <h3 className="font-bold text-lg group-hover:text-green-600 transition-colors">
            Shop Products
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Browse our full collection
          </p>
        </Link>
      </div>
    </div>
  );
}
