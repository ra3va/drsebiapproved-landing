'use client';

interface ProductRevenueChartProps {
  data: {
    product_name: string;
    revenue: number;
    orders: number;
  }[];
}

export function ProductRevenueChart({ data }: ProductRevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Revenue by Product</h3>
        <div className="text-center text-gray-500 py-12">No data available</div>
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  // Colors for different products
  const colors = [
    'from-green-500 to-green-600',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-yellow-500 to-yellow-600',
    'from-red-500 to-red-600',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Revenue by Product</h3>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4">
        {sortedData.map((product, idx) => {
          const percentage = (product.revenue / totalRevenue) * 100;
          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{product.product_name}</span>
                <span className="text-sm text-gray-600">${(product.revenue / 100).toFixed(2)}</span>
              </div>
              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[idx % colors.length]} flex items-center px-3 transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-xs font-medium text-white">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{product.orders} orders</span>
                <span className="text-xs text-gray-500">
                  ${(product.revenue / product.orders / 100).toFixed(2)} avg
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-lg font-bold">
          <span>Total Revenue</span>
          <span className="text-green-600">${(totalRevenue / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
