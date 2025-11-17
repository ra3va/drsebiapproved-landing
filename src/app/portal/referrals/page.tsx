'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface Referral {
  id: string;
  referee_email: string;
  status: 'pending' | 'completed';
  points_awarded: number;
  created_at: string;
  completed_at: string | null;
}

export default function ReferralsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

    // Fetch referrals
    const { data: referralsData } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    setReferrals((referralsData || []) as Referral[]);

    setLoading(false);
  }

  const handleCopyLink = () => {
    if (!profile?.referral_code) return;

    const referralUrl = `${window.location.origin}/portal/register?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'email' | 'facebook' | 'twitter') => {
    if (!profile?.referral_code) return;

    const referralUrl = `${window.location.origin}/portal/register?ref=${profile.referral_code}`;
    const message = `Join me at Dr. Sebi Approved and get 500 bonus points on your first purchase!`;

    const urls: Record<string, string> = {
      email: `mailto:?subject=${encodeURIComponent(
        'Check out Dr. Sebi Approved!'
      )}&body=${encodeURIComponent(`${message}\n\n${referralUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}&url=${encodeURIComponent(referralUrl)}`,
    };

    window.open(urls[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const completedReferrals = referrals.filter((r) => r.status === 'completed');
  const pendingReferrals = referrals.filter((r) => r.status === 'pending');
  const totalPointsEarned = completedReferrals.reduce((sum, r) => sum + r.points_awarded, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Refer & Earn</h1>
        <p className="text-gray-600 mt-1">Share the love and earn 500 points for every friend who joins</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Total Referrals</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{referrals.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Successful Referrals</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{completedReferrals.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm text-gray-600">Points Earned</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{totalPointsEarned}</div>
          <div className="text-xs text-gray-600 mt-1">
            = ${(totalPointsEarned / 100).toFixed(2)} in rewards
          </div>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-8 text-white">
        <div className="flex items-start mb-6">
          <div className="text-5xl mr-4">🎁</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Give 500 Points, Get 500 Points</h2>
            <p className="opacity-90">
              Share your unique referral link with friends. When they make their first purchase, you both
              earn 500 loyalty points!
            </p>
          </div>
        </div>

        {profile?.referral_code ? (
          <div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
              <div className="text-xs opacity-75 mb-2">Your Referral Link</div>
              <div className="font-mono text-sm break-all">
                {window.location.origin}/portal/register?ref={profile.referral_code}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 bg-white text-green-600 px-6 py-3 rounded-md hover:bg-gray-100 font-medium transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={() => handleShare('email')}
                className="px-6 py-3 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 font-medium transition-colors"
              >
                📧 Email
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="px-6 py-3 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 font-medium transition-colors"
              >
                f Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="px-6 py-3 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 font-medium transition-colors"
              >
                🐦 Twitter
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <p>Generating your referral code...</p>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              1️⃣
            </div>
            <h3 className="font-bold mb-2">Share Your Link</h3>
            <p className="text-sm text-gray-600">
              Send your unique referral link to friends via email, social media, or text
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              2️⃣
            </div>
            <h3 className="font-bold mb-2">Friend Signs Up</h3>
            <p className="text-sm text-gray-600">
              Your friend creates an account and receives 500 bonus points
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              3️⃣
            </div>
            <h3 className="font-bold mb-2">You Both Earn</h3>
            <p className="text-sm text-gray-600">
              When they make their first purchase, you both get 500 points automatically
            </p>
          </div>
        </div>
      </div>

      {/* Completed Referrals */}
      {completedReferrals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Successful Referrals</h2>
          <div className="space-y-3">
            {completedReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <div className="font-medium">{referral.referee_email}</div>
                  <div className="text-xs text-gray-600">
                    Joined {new Date(referral.created_at).toLocaleDateString()} • Completed{' '}
                    {referral.completed_at
                      ? new Date(referral.completed_at).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+{referral.points_awarded} pts</div>
                  <div className="text-xs text-gray-600">Earned</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Referrals */}
      {pendingReferrals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Pending Referrals</h2>
          <p className="text-sm text-gray-600 mb-4">
            These friends have signed up but haven't made their first purchase yet.
          </p>
          <div className="space-y-3">
            {pendingReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <div className="font-medium">{referral.referee_email}</div>
                  <div className="text-xs text-gray-600">
                    Joined {new Date(referral.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {referrals.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Referrals Yet</h2>
          <p className="text-gray-600 mb-6">
            Start sharing your referral link to earn 500 points for every friend who makes a purchase!
          </p>
        </div>
      )}

      {/* Terms */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-sm mb-2">Referral Program Terms</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Both you and your friend receive 500 points when they make their first purchase</li>
          <li>• Referral links are unique to your account and cannot be transferred</li>
          <li>• Points are awarded automatically within 24 hours of the qualifying purchase</li>
          <li>• Self-referrals are not permitted</li>
          <li>• We reserve the right to void points earned through fraudulent activity</li>
        </ul>
      </div>
    </div>
  );
}
