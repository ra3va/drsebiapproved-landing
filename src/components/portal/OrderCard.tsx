import Link from 'next/link';

interface OrderCardProps {
  order: {
    id: string;
    square_order_id: string;
    total_amount: number;
    status: string;
    created_at: string;
    order_items: {
      product_name: string;
      quantity: number;
      price: number;
    }[];
  };
  onReorder?: (orderId: string) => void;
}

export function OrderCard({ order, onReorder }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-lg">
              Order #{order.square_order_id.slice(-8).toUpperCase()}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl">${order.total_amount.toFixed(2)}</div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.order_items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div>
              <span className="font-medium">{item.product_name}</span>
              <span className="text-gray-600"> × {item.quantity}</span>
            </div>
            <span className="text-gray-600">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
        <Link
          href={`/portal/orders/${order.id}`}
          className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View Details
        </Link>
        {onReorder && (
          <button
            onClick={() => onReorder(order.id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            Reorder
          </button>
        )}
      </div>
    </div>
  );
}
