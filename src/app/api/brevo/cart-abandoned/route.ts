import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      cartItems,
      cartValue,
      checkoutUrl
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'No email provided' },
        { status: 400 }
      );
    }

    // Extract product names from cart
    const productNames = cartItems.map((item: any) => {
      const name = item.name.toLowerCase();
      if (name.includes('paracleanse')) return 'paracleanse';
      if (name.includes('maya')) return 'maya';
      if (name.includes('sea moss') || name.includes('seamoss')) return 'seamoss';
      if (name.includes('mucus')) return 'mucus-cleanser';
      return item.name;
    });

    // Update contact with cart abandonment data
    await brevoClient.updateContact(email, {
      attributes: {
        CART_ABANDONED: true,
        CART_VALUE: cartValue,
        CART_PRODUCTS: productNames.join(','),
        CART_ABANDONED_DATE: new Date().toISOString(),
        CHECKOUT_URL: checkoutUrl || ''
      }
    });

    console.log(`Cart abandonment tracked for ${email} - Value: $${cartValue} - Products: ${productNames.join(', ')}`);

    // Your AI agent will trigger cart abandonment recovery sequence
    // (typically 3 emails: 15min, 2hr, 24hr)

    return NextResponse.json({
      success: true,
      message: 'Cart abandonment tracked and recovery sequence triggered'
    });

  } catch (error: any) {
    console.error('Cart abandonment tracking error:', error);
    // Don't fail - this is non-critical
    return NextResponse.json({ success: true });
  }
}
