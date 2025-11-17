// =====================================================
// Square Order Sync Utility
// =====================================================
// Syncs Square orders to Supabase database
// Awards loyalty points automatically
// =====================================================

import { Client as SquareClient } from 'square';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculatePointsEarned } from '@/lib/utils/loyalty';

const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'production',
});

// Product ID mapping from Square catalog IDs
const PRODUCT_ID_MAP: Record<string, string> = {
  '5JV44RI47GC5IMYSENVXMV3D': 'paracleanse',
  'TWJMT4CUFNFNQKG3S5EQRPLO': 'maya',
  'YGDG42LYJKWH75NNW6HPWP5M': 'seamoss',
  '6JARPI34BXU27SS36ZFSEJQP': 'mucus-cleanser',
};

/**
 * Sync a Square order to Supabase
 */
export async function syncSquareOrder(squareOrderId: string) {
  const startTime = Date.now();

  try {
    console.log(`[Square Sync] Starting sync for order: ${squareOrderId}`);

    // 1. Fetch order from Square
    const { result } = await squareClient.ordersApi.retrieveOrder(squareOrderId);
    const order = result.order;

    if (!order) {
      throw new Error('Order not found in Square');
    }

    // 2. Extract customer email
    const customerEmail = extractCustomerEmail(order);

    if (!customerEmail) {
      console.warn('[Square Sync] No customer email found in order');
    }

    // 3. Find user by email (if exists)
    let userId: string | null = null;
    if (customerEmail) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      userId = profile?.id || null;
    }

    // 4. Calculate amounts
    const totalAmount = (order.totalMoney?.amount || 0) / 100;
    const subtotalAmount = (order.netAmounts?.totalMoney?.amount || 0) / 100;
    const shippingAmount = (order.totalShippingMoney?.amount || 0) / 100;
    const discountAmount = (order.totalDiscountMoney?.amount || 0) / 100;
    const taxAmount = (order.totalTaxMoney?.amount || 0) / 100;

    // 5. Calculate loyalty points
    const pointsEarned = calculatePointsEarned(totalAmount);

    // 6. Extract customer details
    const fulfillment = order.fulfillments?.[0];
    const recipient = fulfillment?.shipmentDetails?.recipient;

    // 7. Check if order already exists
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('square_order_id', order.id!)
      .single();

    if (existingOrder) {
      console.log('[Square Sync] Order already exists, skipping');
      return { success: true, orderId: existingOrder.id, duplicate: true };
    }

    // 8. Create order in Supabase
    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        square_order_id: order.id!,
        square_payment_id: order.tenders?.[0]?.id || null,
        status: 'processing',
        total_amount: totalAmount,
        subtotal_amount: subtotalAmount,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        customer_email: customerEmail || '',
        customer_name: recipient?.displayName || null,
        customer_phone: recipient?.phoneNumber || null,
        shipping_address: recipient?.address || {},
        points_earned: pointsEarned,
      })
      .select()
      .single();

    if (orderError) {
      console.error('[Square Sync] Error creating order:', orderError);
      throw orderError;
    }

    console.log(`[Square Sync] Order created: ${newOrder.id}`);

    // 9. Create order items
    for (const lineItem of order.lineItems || []) {
      const productId = getProductIdFromCatalogId(lineItem.catalogObjectId || '');

      await supabaseAdmin.from('order_items').insert({
        order_id: newOrder.id,
        product_id: productId,
        product_name: lineItem.name!,
        quantity: parseInt(lineItem.quantity!),
        unit_price: (lineItem.basePriceMoney?.amount || 0) / 100,
        total_price: (lineItem.totalMoney?.amount || 0) / 100,
        square_catalog_object_id: lineItem.catalogObjectId || null,
      });

      console.log(`[Square Sync] Line item created: ${lineItem.name}`);
    }

    // 10. Award loyalty points if user exists
    if (userId) {
      await awardLoyaltyPoints(userId, newOrder.id, pointsEarned);
      console.log(`[Square Sync] Awarded ${pointsEarned} points to user ${userId}`);
    }

    // 11. Log successful sync
    await supabaseAdmin.from('sync_logs').insert({
      service: 'square',
      sync_type: 'order',
      direction: 'inbound',
      status: 'success',
      entity_id: squareOrderId,
      local_id: newOrder.id,
      duration_ms: Date.now() - startTime,
      metadata: {
        items_count: order.lineItems?.length || 0,
        total_amount: totalAmount,
        points_earned: pointsEarned,
      },
    });

    console.log(`[Square Sync] Sync completed successfully in ${Date.now() - startTime}ms`);

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error('[Square Sync] Sync failed:', error);

    // Log failed sync
    await supabaseAdmin.from('sync_logs').insert({
      service: 'square',
      sync_type: 'order',
      direction: 'inbound',
      status: 'failed',
      entity_id: squareOrderId,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      error_details: error,
      duration_ms: Date.now() - startTime,
    });

    throw error;
  }
}

/**
 * Award loyalty points to user
 */
async function awardLoyaltyPoints(userId: string, orderId: string, points: number) {
  // Get current points
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('loyalty_points, lifetime_value')
    .eq('id', userId)
    .single();

  if (!profile) {
    console.error(`[Loyalty] Profile not found for user ${userId}`);
    return;
  }

  const newBalance = profile.loyalty_points + points;
  const newLifetimeValue = profile.lifetime_value + points;

  // Update profile
  await supabaseAdmin
    .from('profiles')
    .update({
      loyalty_points: newBalance,
      lifetime_value: newLifetimeValue,
    })
    .eq('id', userId);

  // Record transaction
  await supabaseAdmin.from('loyalty_transactions').insert({
    user_id: userId,
    points_change: points,
    reason: 'purchase',
    description: `Points earned from purchase`,
    order_id: orderId,
    balance_after: newBalance,
  });

  console.log(`[Loyalty] Updated user ${userId}: ${profile.loyalty_points} → ${newBalance} points`);
}

/**
 * Get product ID from Square catalog object ID
 */
function getProductIdFromCatalogId(catalogObjectId: string): string {
  return PRODUCT_ID_MAP[catalogObjectId] || 'unknown';
}

/**
 * Extract customer email from Square order
 */
function extractCustomerEmail(order: any): string | null {
  // Try fulfillment recipient email
  const recipientEmail = order.fulfillments?.[0]?.shipmentDetails?.recipient?.emailAddress;
  if (recipientEmail) return recipientEmail;

  // Try tender buyer email
  const buyerEmail = order.tenders?.[0]?.buyerEmailAddress;
  if (buyerEmail) return buyerEmail;

  // Try customer email
  if (order.customerEmail) return order.customerEmail;

  return null;
}

/**
 * Create Square customer for user (if doesn't exist)
 */
export async function createSquareCustomer(userId: string, email: string, name: string) {
  try {
    // Check if customer already exists in Square
    const { result: searchResult } = await squareClient.customersApi.searchCustomers({
      query: {
        filter: {
          emailAddress: {
            exact: email,
          },
        },
      },
    });

    let squareCustomerId: string;

    if (searchResult.customers && searchResult.customers.length > 0) {
      // Customer exists
      squareCustomerId = searchResult.customers[0].id!;
      console.log(`[Square] Customer already exists: ${squareCustomerId}`);
    } else {
      // Create new customer
      const nameParts = name.split(' ');
      const { result: createResult } = await squareClient.customersApi.createCustomer({
        emailAddress: email,
        givenName: nameParts[0] || '',
        familyName: nameParts.slice(1).join(' ') || '',
        referenceId: userId, // Link back to Supabase
      });

      squareCustomerId = createResult.customer!.id!;
      console.log(`[Square] Created new customer: ${squareCustomerId}`);
    }

    // Update Supabase profile
    await supabaseAdmin
      .from('profiles')
      .update({ square_customer_id: squareCustomerId })
      .eq('id', userId);

    return squareCustomerId;
  } catch (error) {
    console.error('[Square] Error creating customer:', error);
    throw error;
  }
}
