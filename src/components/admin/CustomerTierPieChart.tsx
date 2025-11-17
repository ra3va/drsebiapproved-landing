'use client';

interface CustomerTierPieChartProps {
  data: {
    tier: string;
    count: number;
    revenue: number;
  }[];
}

export function CustomerTierPieChart({ data }: CustomerTierPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Customers by Tier</h3>
        <div className="text-center text-gray-500 py-12">No data available</div>
      </div>
    );
  }

  const totalCustomers = data.reduce((sum, d) => sum + d.count, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);

  const tierConfig: Record<string, { color: string; icon: string }> = {
    Bronze: { color: 'bg-orange-500', icon: '🥉' },
    Silver: { color: 'bg-gray-400', icon: '⭐' },
    Gold: { color: 'bg-yellow-500', icon: '👑' },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Customers by Tier</h3>

      {/* Pie Chart (Simplified as Donut) */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {data.map((tier, idx) => {
              const percentage = (tier.count / totalCustomers) * 100;
              const circumference = 2 * Math.PI * 80; // radius = 80
              const offset = (percentage / 100) * circumference;
              const prevPercentage = data
                .slice(0, idx)
                .reduce((sum, t) => sum + (t.count / totalCustomers) * 100, 0);
              const rotation = (prevPercentage / 100) * 360;

              const config = tierConfig[tier.tier];

              return (
                <circle
                  key={tier.tier}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={config.color.replace('bg-', '#')}
                  strokeWidth="40"
                  strokeDasharray={`${offset} ${circumference - offset}`}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center',
                  }}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900">{totalCustomers}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((tier) => {
          const percentage = (tier.count / totalCustomers) * 100;
          const config = tierConfig[tier.tier];

          return (
            <div key={tier.tier} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${config.color} rounded-full`}></div>
                <span className="text-2xl">{config.icon}</span>
                <span className="font-medium text-gray-900">{tier.tier}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{tier.count}</div>
                <div className="text-xs text-gray-600">{percentage.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Revenue by Tier</h4>
        {data.map((tier) => {
          const revenuePercentage = (tier.revenue / totalRevenue) * 100;
          const config = tierConfig[tier.tier];

          return (
            <div key={`revenue-${tier.tier}`} className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{tier.tier}</span>
                <span className="font-medium">${(tier.revenue / 100).toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${config.color} transition-all duration-500`}
                  style={{ width: `${revenuePercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
