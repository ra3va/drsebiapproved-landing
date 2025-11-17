'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface CustomerDetails {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  birthday: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  loyalty_points: number;
  lifetime_value: number;
  referral_code: string;
  created_at: string;
  orders: any[];
  subscriptions: any[];
  loyalty_transactions: any[];
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  async function fetchCustomer() {
    try {
      const response = await fetch(`/api/admin/customers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
      } else {
        router.push('/admin/customers');
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      router.push('/admin/customers');
    }
    setLoading(false);
  }

  const handleAdjustPoints = async (amount: number, description: string) => {
    if (!confirm(`${amount > 0 ? 'Add' : 'Deduct'} ${Math.abs(amount)} points?\n\n${description}`)) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/customers/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pointsAdjustment: amount,
          description,
        }),
      });

      if (response.ok) {
        fetchCustomer(); // Refresh data
      } else {
        alert('Failed to adjust points');
      }
    } catch (error) {
      console.error('Failed to adjust points:', error);
      alert('Failed to adjust points');
    }

    setUpdating(false);
  };

  const getTierBadge = (lifetimeValue: number) => {
    if (lifetimeValue >= 500) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 font-medium rounded">👑 Gold Member</span>;
    } else if (lifetimeValue >= 200) {
      return <span className="px-3 py-1 bg-gray-200 text-gray-700 font-medium rounded">⭐ Silver Member</span>;
    } else {
      return <span className="px-3 py-1 bg-orange-100 text-orange-700 font-medium rounded">🥉 Bronze Member</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/customers"
          className="text-blue-600 hover:underline text-sm font-medium mb-2 inline-block"
        >
          ← Back to Customers
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {customer.full_name || 'Unknown Customer'}
            </h1>
            <p className="text-gray-600 mt-1">{customer.email}</p>
          </div>
          <div>{getTierBadge(customer.lifetime_value)}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Loyalty Points</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{customer.loyalty_points}</div>
          <div className="text-xs text-gray-500 mt-1">
            ${(customer.loyalty_points / 100).toFixed(2)} value
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Lifetime Value</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            ${customer.lifetime_value.toFixed(2)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{customer.orders?.length || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Active Subscriptions</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {customer.subscriptions?.filter((s) => s.status === 'active').length || 0}
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium">{customer.email}</div>
            </div>
            {customer.phone && (
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-medium">{customer.phone}</div>
              </div>
            )}
            {customer.birthday && (
              <div>
                <div className="text-sm text-gray-600">Birthday</div>
                <div className="font-medium">
                  {new Date(customer.birthday).toLocaleDateString()}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600">Member Since</div>
              <div className="font-medium">
                {new Date(customer.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Address</h2>
          {customer.address ? (
            <div className="space-y-1">
              <div>{customer.address}</div>
              <div>
                {customer.city}, {customer.state} {customer.zip_code}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No address on file</div>
          )}
        </div>
      </div>

      {/* Points Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4">Points Management</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAdjustPoints(100, 'Admin bonus - Customer appreciation')}
            disabled={updating}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            +100 Points
          </button>
          <button
            onClick={() => handleAdjustPoints(500, 'Admin bonus - Loyalty reward')}
            disabled={updating}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            +500 Points
          </button>
          <button
            onClick={() => handleAdjustPoints(-100, 'Admin deduction - Points adjustment')}
            disabled={updating}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            -100 Points
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      {customer.orders && customer.orders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {customer.orders.slice(0, 5).map((order: any) => (
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
                  <div className="text-xs text-gray-600">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loyalty Transactions */}
      {customer.loyalty_transactions && customer.loyalty_transactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Points History</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {customer.loyalty_transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div
                  className={`font-bold ${
                    transaction.type === 'redeemed' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {transaction.type === 'redeemed' ? '-' : '+'}
                  {transaction.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
