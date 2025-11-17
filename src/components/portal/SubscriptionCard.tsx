interface SubscriptionCardProps {
  subscription: {
    id: string;
    product_name: string;
    quantity: number;
    frequency: 'monthly' | 'every_60_days' | 'every_90_days';
    price: number;
    status: 'active' | 'paused' | 'cancelled';
    next_shipment_date: string | null;
  };
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function SubscriptionCard({ subscription, onPause, onResume, onCancel }: SubscriptionCardProps) {
  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      monthly: 'Every 30 Days',
      every_60_days: 'Every 60 Days',
      every_90_days: 'Every 90 Days',
    };
    return labels[frequency] || frequency;
  };

  const getFrequencyDiscount = (frequency: string) => {
    const discounts: Record<string, number> = {
      monthly: 10,
      every_60_days: 15,
      every_90_days: 20,
    };
    return discounts[frequency] || 0;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">{subscription.product_name}</h3>
          <p className="text-sm text-gray-600">Quantity: {subscription.quantity}</p>
          <p className="text-sm text-gray-600">{getFrequencyLabel(subscription.frequency)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </span>
      </div>

      <div className="bg-gray-50 rounded-md p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Price per shipment</span>
          <span className="font-bold text-lg">${subscription.price.toFixed(2)}</span>
        </div>
        <div className="text-xs text-green-600 font-medium">
          Saving {getFrequencyDiscount(subscription.frequency)}% with subscription
        </div>
      </div>

      {subscription.next_shipment_date && subscription.status === 'active' && (
        <div className="mb-4">
          <div className="text-sm text-gray-600">Next shipment</div>
          <div className="font-medium">
            {new Date(subscription.next_shipment_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        {subscription.status === 'active' && onPause && (
          <button
            onClick={() => onPause(subscription.id)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Pause
          </button>
        )}
        {subscription.status === 'paused' && onResume && (
          <button
            onClick={() => onResume(subscription.id)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            Resume
          </button>
        )}
        {subscription.status !== 'cancelled' && onCancel && (
          <button
            onClick={() => onCancel(subscription.id)}
            className="flex-1 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
