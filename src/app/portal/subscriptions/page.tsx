'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { SUBSCRIPTION_CONFIG } from '@/lib/utils/subscriptions';
import Link from 'next/link';

interface Subscription {
  id: string;
  product_name: string;
  quantity: number;
  frequency: 'monthly' | 'every_60_days' | 'every_90_days';
  price: number;
  status: 'active' | 'paused' | 'cancelled';
  next_shipment_date: string | null;
  created_at: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setSubscriptions((data || []) as Subscription[]);
    setLoading(false);
  }

  const handlePause = async (id: string) => {
    const response = await fetch(`/api/subscriptions/${id}/pause`, {
      method: 'POST',
    });

    if (response.ok) {
      fetchSubscriptions();
    } else {
      alert('Failed to pause subscription. Please try again.');
    }
  };

  const handleResume = async (id: string) => {
    const response = await fetch(`/api/subscriptions/${id}/resume`, {
      method: 'POST',
    });

    if (response.ok) {
      fetchSubscriptions();
    } else {
      alert('Failed to resume subscription. Please try again.');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    const response = await fetch(`/api/subscriptions/${id}/cancel`, {
      method: 'POST',
    });

    if (response.ok) {
      fetchSubscriptions();
    } else {
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      monthly: 'Every 30 Days',
      every_60_days: 'Every 60 Days',
      every_90_days: 'Every 90 Days',
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyDiscount = (frequency: string) => {
    const config = SUBSCRIPTION_CONFIG.FREQUENCIES[frequency as keyof typeof SUBSCRIPTION_CONFIG.FREQUENCIES];
    return config ? config.discount : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
  const pausedSubscriptions = subscriptions.filter((s) => s.status === 'paused');
  const cancelledSubscriptions = subscriptions.filter((s) => s.status === 'cancelled');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
        <p className="text-gray-600 mt-1">Manage your recurring orders and save 10-20%</p>
      </div>

      {/* Subscription Benefits Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-3">Subscription Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold">10-20% Off</div>
            <div className="text-sm opacity-90">Save on every shipment</div>
          </div>
          <div>
            <div className="text-2xl font-bold">Free Shipping</div>
            <div className="text-sm opacity-90">On all subscription orders</div>
          </div>
          <div>
            <div className="text-2xl font-bold">Easy Management</div>
            <div className="text-sm opacity-90">Pause or cancel anytime</div>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSubscriptions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{sub.product_name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {sub.quantity}</p>
                    <p className="text-sm text-gray-600">{getFrequencyLabel(sub.frequency)}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Price per shipment</span>
                    <span className="font-bold text-lg">${sub.price.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Saving {getFrequencyDiscount(sub.frequency)}% with subscription
                  </div>
                </div>

                {sub.next_shipment_date && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">Next shipment</div>
                    <div className="font-medium">
                      {new Date(sub.next_shipment_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePause(sub.id)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleCancel(sub.id)}
                    className="flex-1 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paused Subscriptions */}
      {pausedSubscriptions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Paused Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pausedSubscriptions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{sub.product_name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {sub.quantity}</p>
                    <p className="text-sm text-gray-600">{getFrequencyLabel(sub.frequency)}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Paused
                  </span>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price per shipment</span>
                    <span className="font-bold text-lg">${sub.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleResume(sub.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => handleCancel(sub.id)}
                    className="flex-1 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Subscriptions */}
      {cancelledSubscriptions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cancelled Subscriptions</h2>
          <div className="space-y-3">
            {cancelledSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-lg shadow-sm p-4 opacity-50 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{sub.product_name}</h3>
                  <p className="text-sm text-gray-600">
                    Cancelled on{' '}
                    {new Date(sub.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  Cancelled
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-5xl mb-4">🔄</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Subscriptions Yet</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to your favorite products and save 10-20% on every order!
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
