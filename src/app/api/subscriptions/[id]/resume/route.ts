import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { calculateNextShipmentDate } from '@/lib/utils/subscriptions';
import type { SubscriptionFrequency } from '@/lib/utils/subscriptions';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get subscription to get frequency
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('frequency')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!subscription) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Calculate new next shipment date
  const nextShipmentDate = calculateNextShipmentDate(subscription.frequency as SubscriptionFrequency);

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      paused_at: null,
      next_shipment_date: nextShipmentDate.toISOString().split('T')[0],
    })
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
