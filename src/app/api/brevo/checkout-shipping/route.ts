import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      shippingAddress,
      checkoutStep
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email required' },
        { status: 400 }
      );
    }

    // Build attributes object with shipping data
    const attributes: Record<string, any> = {
      CHECKOUT_STEP: checkoutStep || 'shipping_info',
      CHECKOUT_UPDATED_DATE: new Date().toISOString()
    };

    // Add shipping address fields if provided
    if (shippingAddress) {
      if (shippingAddress.locality) {
        attributes.SHIPPING_CITY = shippingAddress.locality;
      }
      if (shippingAddress.administrativeDistrictLevel1) {
        attributes.SHIPPING_STATE = shippingAddress.administrativeDistrictLevel1;
      }
      if (shippingAddress.postalCode) {
        attributes.SHIPPING_ZIP = shippingAddress.postalCode;
      }
    }

    // Update contact with shipping info
    await brevoClient.updateContact(email, {
      attributes
    });

    console.log(`✅ Shipping info captured for ${email} - ${attributes.SHIPPING_CITY}, ${attributes.SHIPPING_STATE}`);

    return NextResponse.json({
      success: true,
      message: 'Shipping info captured'
    });

  } catch (error: any) {
    console.error('❌ Shipping tracking error:', error);
    // Don't fail - this is non-critical tracking
    return NextResponse.json({
      success: true,
      message: 'Tracking skipped (non-critical error)'
    });
  }
}
