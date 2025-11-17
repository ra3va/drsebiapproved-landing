'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getLoyaltyTier, getRedemptionValue, LOYALTY_CONFIG } from '@/lib/utils/loyalty';

interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus';
  points: number;
  description: string;
  created_at: string;
}

interface LoyaltyCoupon {
  id: string;
  code: string;
  discount_value: number;
  points_redeemed: number;
  expires_at: string;
  used_at: string | null;
}

export default function RewardsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [coupons, setCoupons] = useState<LoyaltyCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<number>(500);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(profileData);

    // Fetch transactions
    const { data: transactionsData } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    setTransactions((transactionsData || []) as LoyaltyTransaction[]);

    // Fetch coupons
    const { data: couponsData } = await supabase
      .from('loyalty_coupons')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setCoupons((couponsData || []) as LoyaltyCoupon[]);

    setLoading(false);
  }

  const handleRedeem = async () => {
    if (!profile || selectedPoints > profile.loyalty_points) {
      alert('Insufficient points');
      return;
    }

    if (selectedPoints < 500) {
      alert('Minimum redemption is 500 points');
      return;
    }

    setRedeeming(true);

    try {
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointsToRedeem: selectedPoints }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Success! Your coupon code is: ${data.couponCode}\n\nDiscount Value: $${data.discountValue.toFixed(
            2
          )}\n\nUse this code at checkout within 30 days.`
        );
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to redeem points');
      }
    } catch (error) {
      console.error('Redemption error:', error);
      alert('Failed to redeem points. Please try again.');
    }

    setRedeeming(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tier = profile ? getLoyaltyTier(profile.lifetime_value) : null;
  const availableCoupons = coupons.filter((c) => !c.used_at && new Date(c.expires_at) > new Date());
  const usedCoupons = coupons.filter((c) => c.used_at);
  const expiredCoupons = coupons.filter((c) => !c.used_at && new Date(c.expires_at) <= new Date());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Loyalty Rewards</h1>
        <p className="text-gray-600 mt-1">Earn points, get rewards, and enjoy exclusive benefits</p>
      </div>

      {/* Points Balance Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm opacity-90 mb-2">Your Points Balance</div>
            <div className="text-5xl font-bold mb-2">{profile?.loyalty_points || 0}</div>
            <div className="text-lg opacity-90">
              = ${((profile?.loyalty_points || 0) / 100).toFixed(2)} in rewards
            </div>
          </div>
          {tier && (
            <div className="text-right">
              <div className="text-4xl mb-2">
                {tier.name === 'Gold' ? '👑' : tier.name === 'Silver' ? '⭐' : '🥉'}
              </div>
              <div className={`font-bold text-lg ${tier.color}`}>{tier.name} Member</div>
            </div>
          )}
        </div>
      </div>

      {/* Tier Benefits */}
      {tier && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your {tier.name} Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tier.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-green-600 mr-3 text-xl">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          {tier.name !== 'Gold' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Spend ${(tier.minValue + 100).toFixed(2)} more to reach{' '}
                {tier.name === 'Bronze' ? 'Silver' : 'Gold'} status!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Redeem Points */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Redeem Points for Discounts</h2>
        <p className="text-sm text-gray-600 mb-6">
          Convert your points into coupon codes you can use at checkout. Higher redemptions earn bonus
          value!
        </p>

        {/* Redemption Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {LOYALTY_CONFIG.REDEMPTION_TIERS.map((tier) => {
            const value = getRedemptionValue(tier.points);
            const canAfford = (profile?.loyalty_points || 0) >= tier.points;
            const bonusPercent = Math.round((tier.rate / 0.01 - 1) * 100);

            return (
              <button
                key={tier.points}
                onClick={() => setSelectedPoints(tier.points)}
                disabled={!canAfford}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPoints === tier.points
                    ? 'border-green-600 bg-green-50'
                    : canAfford
                    ? 'border-gray-300 hover:border-green-300'
                    : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="font-bold text-lg">{tier.points} pts</div>
                <div className="text-2xl font-bold text-green-600 my-2">${value.toFixed(2)}</div>
                {bonusPercent > 0 && (
                  <div className="text-xs text-green-600 font-medium">+{bonusPercent}% Bonus</div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRedeem}
          disabled={redeeming || (profile?.loyalty_points || 0) < selectedPoints}
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400 font-medium transition-colors"
        >
          {redeeming
            ? 'Generating Coupon...'
            : `Redeem ${selectedPoints} Points for $${getRedemptionValue(selectedPoints).toFixed(2)}`}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Coupons are valid for 30 days and can be used once at checkout.
        </p>
      </div>

      {/* Available Coupons */}
      {availableCoupons.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Active Coupons</h2>
          <div className="space-y-3">
            {availableCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="border-2 border-dashed border-green-600 rounded-lg p-4 bg-green-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-xl text-green-700">{coupon.code}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Worth ${coupon.discount_value.toFixed(2)} • Expires{' '}
                      {new Date(coupon.expires_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      alert('Coupon code copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Earn Points */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">How to Earn Points</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-green-600 mr-3 text-xl">🛍️</span>
            <div>
              <div className="font-medium">Make Purchases</div>
              <div className="text-sm text-gray-600">Earn 1 point for every $1 spent</div>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-600 mr-3 text-xl">🎁</span>
            <div>
              <div className="font-medium">Refer Friends</div>
              <div className="text-sm text-gray-600">Get 500 points when they make their first purchase</div>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-600 mr-3 text-xl">🎂</span>
            <div>
              <div className="font-medium">Birthday Bonus</div>
              <div className="text-sm text-gray-600">Receive 500 points on your birthday</div>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-green-600 mr-3 text-xl">✨</span>
            <div>
              <div className="font-medium">Special Promotions</div>
              <div className="text-sm text-gray-600">Watch for double point events and bonuses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Points History</h2>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(transaction.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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
