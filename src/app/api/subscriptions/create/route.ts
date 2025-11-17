import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { calculateNextShipmentDate, calculateSubscriptionPrice } from '@/lib/utils/subscriptions';
import type { SubscriptionFrequency } from '@/lib/utils/subscriptions';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, productName, basePrice, frequency } = await request.json();

    if (!productId || !productName || !basePrice || !frequency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user's Square customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('square_customer_id')
      .eq('id', user.id)
      .single();

    // Calculate discounted price
    const discountPercentage = frequency === 'monthly' ? 10 : frequency === 'every_60_days' ? 15 : 20;
    const nextShipmentDate = calculateNextShipmentDate(frequency as SubscriptionFrequency);

    // Create subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        status: 'active',
        frequency,
        base_price: basePrice / 100, // Convert cents to dollars
        discount_percentage: discountPercentage,
        next_shipment_date: nextShipmentDate.toISOString().split('T')[0],
        square_customer_id: profile?.square_customer_id || null,
      })
      .select()
      .single();

    if (subscriptionError) throw subscriptionError;

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
