'use client';

interface RevenueChartProps {
  data: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Revenue Over Time</h3>
        <div className="text-center text-gray-500 py-12">No data available</div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const chartHeight = 200;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Revenue Over Time</h3>

      {/* Chart */}
      <div className="relative" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-600">
          <span>${(maxRevenue / 100).toFixed(0)}</span>
          <span>${(maxRevenue / 200).toFixed(0)}</span>
          <span>$0</span>
        </div>

        {/* Chart area */}
        <div className="ml-16 h-full flex items-end justify-between gap-2">
          {data.map((item, idx) => {
            const height = (item.revenue / maxRevenue) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                {/* Bar */}
                <div className="w-full flex flex-col justify-end" style={{ height: chartHeight }}>
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md transition-all hover:opacity-80 relative group-hover:shadow-lg"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                      <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                        <div className="font-bold">${(item.revenue / 100).toFixed(2)}</div>
                        <div className="opacity-75">{item.orders} orders</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-16 flex justify-between mt-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center">
            <span className="text-[10px] text-gray-600">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            ${(data.reduce((sum, d) => sum + d.revenue, 0) / 100).toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.orders, 0)}
          </div>
          <div className="text-xs text-gray-600">Total Orders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            $
            {(
              data.reduce((sum, d) => sum + d.revenue, 0) /
              data.reduce((sum, d) => sum + d.orders, 0) /
              100
            ).toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Avg Order Value</div>
        </div>
      </div>
    </div>
  );
}
