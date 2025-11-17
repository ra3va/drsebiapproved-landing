import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ valid: false, error: 'Code required' });
  }

  // Check if it's a loyalty coupon
  if (code.startsWith('LOYALTY-')) {
    const { data: coupon, error } = await supabase
      .from('loyalty_coupons')
      .select('*')
      .eq('code', code)
      .eq('status', 'active')
      .single();

    if (error || !coupon) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or expired loyalty code',
      });
    }

    // Check if expired
    if (new Date(coupon.expires_at) < new Date()) {
      // Mark as expired
      await supabase
        .from('loyalty_coupons')
        .update({ status: 'expired' })
        .eq('id', coupon.id);

      return NextResponse.json({
        valid: false,
        error: 'This code has expired',
      });
    }

    return NextResponse.json({
      valid: true,
      type: 'loyalty',
      discountValue: coupon.discount_value,
      discountType: coupon.discount_type,
      description: `Loyalty Reward: $${coupon.discount_value} off`,
      couponId: coupon.id,
    });
  }

  // Check Square coupons (existing TEST99 flow)
  // This would call your existing Square coupon validation
  return NextResponse.json({
    valid: false,
    error: 'Invalid coupon code',
  });
}
