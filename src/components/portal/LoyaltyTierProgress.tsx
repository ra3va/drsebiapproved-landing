import { getLoyaltyTier } from '@/lib/utils/loyalty';

interface LoyaltyTierProgressProps {
  lifetimeValue: number;
  currentPoints: number;
}

export function LoyaltyTierProgress({ lifetimeValue, currentPoints }: LoyaltyTierProgressProps) {
  const currentTier = getLoyaltyTier(lifetimeValue);

  const tiers = [
    { name: 'Bronze', minValue: 0, color: 'from-orange-400 to-orange-600', icon: '🥉' },
    { name: 'Silver', minValue: 200, color: 'from-gray-300 to-gray-500', icon: '⭐' },
    { name: 'Gold', minValue: 500, color: 'from-yellow-400 to-yellow-600', icon: '👑' },
  ];

  const currentTierIndex = tiers.findIndex((t) => t.name === currentTier.name);
  const nextTier = tiers[currentTierIndex + 1];

  let progress = 100;
  let amountToNext = 0;

  if (nextTier) {
    const tierRange = nextTier.minValue - currentTier.minValue;
    const currentProgress = lifetimeValue - currentTier.minValue;
    progress = (currentProgress / tierRange) * 100;
    amountToNext = nextTier.minValue - lifetimeValue;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Your Loyalty Tier</h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{currentTier.name === 'Gold' ? '👑' : currentTier.name === 'Silver' ? '⭐' : '🥉'}</span>
          <span className={`font-bold ${currentTier.color}`}>{currentTier.name}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{currentTier.name} Member</span>
          {nextTier ? (
            <span className="text-gray-600">Next: {nextTier.name}</span>
          ) : (
            <span className="text-green-600 font-medium">Max Tier! 🎉</span>
          )}
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentTier.name === 'Gold' ? 'from-yellow-400 to-yellow-600' : currentTier.name === 'Silver' ? 'from-gray-300 to-gray-500' : 'from-orange-400 to-orange-600'} transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        {nextTier && (
          <p className="text-xs text-gray-600">
            Spend ${amountToNext.toFixed(2)} more to reach {nextTier.name} tier!
          </p>
        )}
      </div>

      {/* Current Benefits */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Benefits:</h4>
        <div className="space-y-1">
          {currentTier.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start text-sm">
              <span className="text-green-600 mr-2 mt-0.5">✓</span>
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Points Balance */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current Points Balance</span>
          <span className="text-2xl font-bold text-green-600">{currentPoints}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          = ${(currentPoints / 100).toFixed(2)} in rewards
        </p>
      </div>
    </div>
  );
}
