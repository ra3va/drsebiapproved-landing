// =====================================================
// Brevo Contact Sync Utility
// =====================================================
// Syncs Supabase profiles to Brevo for email marketing
// Updates contact attributes automatically
// =====================================================

import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Sync Supabase profile to Brevo
 */
export async function syncBrevoContact(userId: string) {
  try {
    console.log(`[Brevo Sync] Starting sync for user: ${userId}`);

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('[Brevo Sync] Profile not found:', profileError);
      throw new Error('Profile not found');
    }

    // Split name
    const nameParts = profile.full_name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Prepare contact data
    const contactData = {
      email: profile.email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        SMS: profile.phone || '',
        CUSTOMER_STATUS: 'registered',
        LOYALTY_POINTS: profile.loyalty_points,
        LIFETIME_VALUE: profile.lifetime_value,
        REGISTERED_DATE: profile.created_at,
        MARKETING_CONSENT: profile.marketing_consent ? 'true' : 'false',
        SMS_CONSENT: profile.sms_consent ? 'true' : 'false',
      },
    };

    // Call Brevo API via our endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/brevo/create-update-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error(`Brevo API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Store Brevo contact ID if returned
    if (data.contact?.id && !profile.brevo_contact_id) {
      await supabaseAdmin
        .from('profiles')
        .update({ brevo_contact_id: data.contact.id })
        .eq('id', userId);

      console.log(`[Brevo Sync] Updated profile with Brevo contact ID: ${data.contact.id}`);
    }

    console.log('[Brevo Sync] Sync completed successfully');

    return { success: true, contactId: data.contact?.id };
  } catch (error) {
    console.error('[Brevo Sync] Sync failed:', error);
    throw error;
  }
}

/**
 * Update Brevo contact attributes only
 */
export async function updateBrevoAttributes(email: string, attributes: Record<string, any>) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/brevo/create-update-contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes,
      }),
    });

    if (!response.ok) {
      throw new Error(`Brevo API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Brevo] Failed to update attributes:', error);
    throw error;
  }
}

/**
 * Sync order data to Brevo
 */
export async function syncOrderToBrevo(orderId: string) {
  try {
    console.log(`[Brevo] Syncing order ${orderId}`);

    // Get order with customer info
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*), profiles(*)')
      .eq('id', orderId)
      .single();

    if (!order) {
      console.error('[Brevo] Order not found');
      return;
    }

    // Get product names
    const productNames = order.order_items.map((item: any) => item.product_name).join(', ');

    // Update Brevo contact
    await updateBrevoAttributes(order.customer_email, {
      LAST_PURCHASE_PRODUCT: order.order_items[0]?.product_name || '',
      LAST_PURCHASE_VALUE: order.total_amount,
      LAST_PURCHASE_DATE: order.created_at,
      ORDER_ID: order.square_order_id,
      PRODUCTS_OWNED: productNames,
    });

    console.log('[Brevo] Order synced successfully');
  } catch (error) {
    console.error('[Brevo] Failed to sync order:', error);
  }
}

/**
 * Create Brevo contact endpoint wrapper
 */
export async function createBrevoContact(email: string, attributes: Record<string, any> = {}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/brevo/create-update-contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      attributes,
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo API error: ${response.statusText}`);
  }

  return await response.json();
}
