'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderDetails {
  id: string;
  square_order_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_number: string | null;
  shipping_carrier: string | null;
  shipping_address: string;
  order_items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        router.push('/portal/orders');
        return;
      }

      setOrder(data as OrderDetails);
      setLoading(false);
    }

    fetchOrder();
  }, [params.id, router]);

  const handleReorder = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}/reorder`, {
        method: 'POST',
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        alert('Failed to reorder. Please try again.');
      }
    } catch (error) {
      console.error('Reorder error:', error);
      alert('Failed to reorder. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/portal/orders"
          className="text-green-600 hover:underline text-sm font-medium mb-2 inline-block"
        >
          ← Back to Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.square_order_id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on{' '}
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              order.status === 'delivered'
                ? 'bg-green-100 text-green-800'
                : order.status === 'shipped'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-bold text-lg mb-4">Order Status</h2>
        <div className="flex items-center justify-between">
          {['pending', 'processing', 'shipped', 'delivered'].map((status, idx) => {
            const isCompleted =
              ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= idx;
            const isCurrent = order.status === status;

            return (
              <div key={status} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs mt-2 font-medium">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tracking Info */}
        {order.tracking_number && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-sm text-gray-700 mb-2">Tracking Information</h3>
            <div className="flex items-center justify-between bg-gray-50 rounded-md p-4">
              <div>
                <div className="text-sm text-gray-600">
                  Carrier: <span className="font-medium">{order.shipping_carrier}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Tracking #: <span className="font-medium">{order.tracking_number}</span>
                </div>
              </div>
              <a
                href={`https://www.google.com/search?q=${order.tracking_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline font-medium"
              >
                Track Package →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-bold text-lg mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <div className="font-medium">{item.product_name}</div>
                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">${item.price.toFixed(2)}</div>
                <div className="text-xs text-gray-600">
                  ${(item.price / item.quantity).toFixed(2)} each
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Order Total</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
        <p className="text-gray-700 whitespace-pre-line">{order.shipping_address}</p>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={handleReorder}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
        >
          Reorder Items
        </button>
        <a
          href="mailto:info@drsebiapproved.com"
          className="flex-1 text-center border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 font-medium"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
