interface OrderTrackingTimelineProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string | null;
  shippingCarrier?: string | null;
}

export function OrderTrackingTimeline({ status, trackingNumber, shippingCarrier }: OrderTrackingTimelineProps) {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: '📦' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
  ];

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">❌</div>
        <h3 className="font-bold text-red-900 text-lg mb-1">Order Cancelled</h3>
        <p className="text-sm text-red-700">
          This order has been cancelled. Please contact support if you have any questions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-6">Order Status</h3>

      {/* Timeline */}
      <div className="relative">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex items-start mb-8 last:mb-0">
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-12 w-0.5 h-16 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                  style={{ top: `${(idx + 1) * 80 + 12}px` }}
                ></div>
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="ml-4 flex-1">
                <h4 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </h4>
                {isCurrent && (
                  <p className="text-sm text-gray-600 mt-1">
                    {status === 'pending' && 'We received your order and are preparing it for shipment.'}
                    {status === 'processing' && 'Your order is being packed and will ship soon.'}
                    {status === 'shipped' && 'Your order is on its way!'}
                    {status === 'delivered' && 'Your order has been delivered. Enjoy!'}
                  </p>
                )}
              </div>

              {/* Status Indicator */}
              {isCurrent && (
                <div className="ml-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Current
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tracking Info */}
      {trackingNumber && status === 'shipped' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-sm text-gray-700 mb-3">Tracking Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">
                  Carrier: <span className="font-medium text-gray-900">{shippingCarrier}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Tracking #: <span className="font-medium text-gray-900">{trackingNumber}</span>
                </div>
              </div>
              <a
                href={`https://www.google.com/search?q=${trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
              >
                Track Package
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
