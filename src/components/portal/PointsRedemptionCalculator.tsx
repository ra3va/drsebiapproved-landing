'use client';

import { useState } from 'react';
import { LOYALTY_CONFIG, getRedemptionValue } from '@/lib/utils/loyalty';

interface PointsRedemptionCalculatorProps {
  currentPoints: number;
  onRedeem: (points: number) => void;
}

export function PointsRedemptionCalculator({
  currentPoints,
  onRedeem,
}: PointsRedemptionCalculatorProps) {
  const [selectedPoints, setSelectedPoints] = useState<number>(500);
  const [customPoints, setCustomPoints] = useState<string>('');
  const [useCustom, setUseCustom] = useState(false);

  const pointsToRedeem = useCustom ? parseInt(customPoints) || 0 : selectedPoints;
  const canRedeem = pointsToRedeem >= 500 && pointsToRedeem <= currentPoints;
  const discountValue = canRedeem ? getRedemptionValue(pointsToRedeem) : 0;

  // Calculate bonus percentage
  const tier = LOYALTY_CONFIG.REDEMPTION_TIERS.find((t) => pointsToRedeem >= t.points);
  const bonusPercent = tier ? Math.round((tier.rate / 0.01 - 1) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Redeem Your Points</h3>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 mb-6">
        <div className="text-sm text-green-800 mb-1">Available Points</div>
        <div className="text-3xl font-bold text-green-900">{currentPoints}</div>
        <div className="text-xs text-green-700 mt-1">
          = ${(currentPoints / 100).toFixed(2)} base value
        </div>
      </div>

      {/* Quick Select Tiers */}
      {!useCustom && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Amount to Redeem
          </label>
          <div className="grid grid-cols-2 gap-3">
            {LOYALTY_CONFIG.REDEMPTION_TIERS.map((tier) => {
              const value = getRedemptionValue(tier.points);
              const canAfford = currentPoints >= tier.points;
              const isSelected = selectedPoints === tier.points;
              const bonus = Math.round((tier.rate / 0.01 - 1) * 100);

              return (
                <button
                  key={tier.points}
                  onClick={() => setSelectedPoints(tier.points)}
                  disabled={!canAfford}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-green-600 bg-green-50'
                      : canAfford
                      ? 'border-gray-300 hover:border-green-300 bg-white'
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold text-lg">{tier.points} pts</div>
                  <div className="text-2xl font-bold text-green-600 my-1">
                    ${value.toFixed(2)}
                  </div>
                  {bonus > 0 && (
                    <div className="text-xs text-green-600 font-medium">
                      +{bonus}% Bonus!
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Amount Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setUseCustom(!useCustom)}
          className="text-sm text-green-600 hover:underline font-medium"
        >
          {useCustom ? 'Use quick select' : 'Enter custom amount'}
        </button>
      </div>

      {/* Custom Amount Input */}
      {useCustom && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Points Amount
          </label>
          <input
            type="number"
            value={customPoints}
            onChange={(e) => setCustomPoints(e.target.value)}
            min="500"
            max={currentPoints}
            step="100"
            placeholder="Minimum 500 points"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {parseInt(customPoints) > 0 && parseInt(customPoints) < 500 && (
            <p className="text-sm text-red-600 mt-1">Minimum redemption is 500 points</p>
          )}
        </div>
      )}

      {/* Redemption Summary */}
      {canRedeem && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Points to Redeem</span>
            <span className="font-medium">{pointsToRedeem}</span>
          </div>
          {bonusPercent > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-green-600">Bonus Applied</span>
              <span className="font-medium text-green-600">+{bonusPercent}%</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold">Discount Value</span>
            <span className="text-2xl font-bold text-green-600">
              ${discountValue.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Remaining balance: {currentPoints - pointsToRedeem} points
          </p>
        </div>
      )}

      {/* Redeem Button */}
      <button
        onClick={() => canRedeem && onRedeem(pointsToRedeem)}
        disabled={!canRedeem}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          canRedeem
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {canRedeem ? `Redeem ${pointsToRedeem} Points` : 'Insufficient Points'}
      </button>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          💡 <strong>Tip:</strong> Redeem more points at once to unlock bonus value! Gold tier
          redemptions (2000+ points) get an extra 25% bonus.
        </p>
      </div>
    </div>
  );
}
