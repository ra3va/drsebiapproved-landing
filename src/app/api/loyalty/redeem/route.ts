import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  generateCouponCode,
  getCouponExpirationDate,
  getRedemptionValue,
  canRedeem,
} from '@/lib/utils/loyalty';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { pointsToRedeem } = await request.json();

  if (!pointsToRedeem || pointsToRedeem < 500) {
    return NextResponse.json(
      { error: 'Minimum 500 points required' },
      { status: 400 }
    );
  }

  try {
    // Get user's current points
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('loyalty_points')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    if (!profile || !canRedeem(profile.loyalty_points, pointsToRedeem)) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      );
    }

    // Calculate discount value
    const discountValue = getRedemptionValue(pointsToRedeem);
    const couponCode = generateCouponCode();
    const expiresAt = getCouponExpirationDate();

    // Create coupon
    const { error: couponError } = await supabase
      .from('loyalty_coupons')
      .insert({
        user_id: user.id,
        code: couponCode,
        discount_type: 'fixed_amount',
        discount_value: discountValue,
        points_redeemed: pointsToRedeem,
        status: 'active',
        expires_at: expiresAt.toISOString(),
      });

    if (couponError) throw couponError;

    // Deduct points
    const newBalance = profile.loyalty_points - pointsToRedeem;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ loyalty_points: newBalance })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Record transaction
    await supabase.from('loyalty_transactions').insert({
      user_id: user.id,
      points_change: -pointsToRedeem,
      reason: 'redemption',
      description: `Redeemed for $${discountValue.toFixed(2)} discount code: ${couponCode}`,
      balance_after: newBalance,
    });

    return NextResponse.json({
      success: true,
      couponCode,
      discountValue,
      newBalance,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Redemption error:', error);
    return NextResponse.json(
      { error: 'Redemption failed' },
      { status: 500 }
    );
  }
}
