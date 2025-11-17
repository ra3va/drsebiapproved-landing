import { NextResponse } from 'next/server';
import { syncSquareOrder } from '@/lib/integrations/square-sync';
import { syncOrderToBrevo } from '@/lib/integrations/brevo-sync';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('[Square Webhook] Received:', body.type);

    // Verify webhook signature (important for production)
    // TODO: Implement Square webhook signature verification

    // Handle different event types
    if (body.type === 'order.created' || body.type === 'order.updated') {
      const orderId = body.data?.object?.order_created?.order_id || body.data?.id;

      if (!orderId) {
        console.error('[Square Webhook] No order ID in webhook');
        return NextResponse.json({ error: 'No order ID' }, { status: 400 });
      }

      // Sync order to Supabase
      const result = await syncSquareOrder(orderId);

      // Sync to Brevo if successful
      if (result.success && result.orderId) {
        await syncOrderToBrevo(result.orderId);
      }

      return NextResponse.json({ success: true });
    }

    // Unknown event type
    return NextResponse.json({ message: 'Event type not handled' });
  } catch (error) {
    console.error('[Square Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
