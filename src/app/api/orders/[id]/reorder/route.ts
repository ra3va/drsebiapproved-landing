import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

  try {
    // Get order with items
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Create checkout URL with items
    const items = order.order_items.map((item: any) => ({
      productId: item.product_id,
      quantity: item.quantity,
    }));

    const checkoutUrl = `/checkout?items=${encodeURIComponent(JSON.stringify(items))}`;

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json(
      { error: 'Failed to create reorder' },
      { status: 500 }
    );
  }
}
