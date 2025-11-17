import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

// Format phone number to E.164 format (international format with country code)
// Brevo requires: +[country code][number] (e.g., +12145551234)
function formatPhoneForBrevo(phone: string): string | null {
  if (!phone) return null;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it's empty after cleaning, return null
  if (!digits) return null;

  // If it starts with 1 and has 11 digits (US/Canada with country code)
  if (digits.length === 11 && digits[0] === '1') {
    return `+${digits}`;
  }

  // If it has 10 digits (US/Canada without country code)
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If it already has country code and is 11+ digits
  if (digits.length >= 11) {
    return `+${digits}`;
  }

  // Invalid format - return null to skip
  console.log(`⚠️ Invalid phone format, skipping: ${phone}`);
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      cartItems,
      cartValue,
      checkoutStep,
      source
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email required' },
        { status: 400 }
      );
    }

    // Extract product slugs from cart items
    const productSlugs = cartItems.map((item: any) => {
      const name = item.name.toLowerCase();
      if (name.includes('paracleanse')) return 'paracleanse';
      if (name.includes('maya')) return 'maya';
      if (name.includes('sea moss')) return 'seamoss';
      if (name.includes('mucus')) return 'mucus-cleanser';
      return name;
    });

    // Find or create "Checkout Started" list
    const checkoutList = await brevoClient.findOrCreateList('Checkout Started');

    // Build attributes object
    const attributes: Record<string, any> = {
      FIRSTNAME: firstName || '',
      LASTNAME: lastName || '',
      SOURCE: source || 'checkout',
      CHECKOUT_STEP: checkoutStep || 'contact_info',
      CART_VALUE: cartValue || 0,
      CART_PRODUCTS: productSlugs.join(','),
      CHECKOUT_STARTED_DATE: new Date().toISOString(),
      CHECKOUT_IN_PROGRESS: 'true'
    };

    // Add SMS attribute only if phone is valid E.164 format
    if (phone) {
      const formattedPhone = formatPhoneForBrevo(phone);
      if (formattedPhone) {
        attributes.SMS = formattedPhone;
      }
    }

    // Create/update contact in Brevo
    await brevoClient.addContact({
      email,
      attributes,
      listIds: [checkoutList.id],
      updateEnabled: true
    });

    console.log(`✅ Checkout started tracked for ${email} - Step: ${checkoutStep}, Cart: $${cartValue}`);

    return NextResponse.json({
      success: true,
      message: 'Checkout progress tracked'
    });

  } catch (error: any) {
    console.error('❌ Checkout tracking error:', error);
    // Don't fail - this is non-critical tracking
    // Return success so checkout flow isn't blocked
    return NextResponse.json({
      success: true,
      message: 'Tracking skipped (non-critical error)'
    });
  }
}
