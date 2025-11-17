import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      cartItems,
      cartValue,
      checkoutUrl,
      abandonmentStage,
      checkoutStep,
      intentLevel
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

    // Update contact with cart abandonment data (stage-aware)
    await brevoClient.updateContact(email, {
      attributes: {
        CART_ABANDONED: 'true',
        CART_VALUE: cartValue,
        CART_PRODUCTS: productNames.join(','),
        CART_ABANDONED_DATE: new Date().toISOString(),
        CHECKOUT_URL: checkoutUrl || '',
        CHECKOUT_ABANDONED_STAGE: abandonmentStage || 'step_1',  // NEW: step_1/step_2/step_3
        CHECKOUT_STEP: `step_${checkoutStep || 1}`,  // NEW: step_1, step_2, or step_3
        ABANDONMENT_INTENT_LEVEL: intentLevel || 'low',  // NEW: low/medium/high
        CHECKOUT_IN_PROGRESS: 'false'  // NEW: mark as no longer in progress
      }
    });

    console.log(`Cart abandonment tracked for ${email} - Stage: ${abandonmentStage} - Intent: ${intentLevel} - Value: $${cartValue}`);

    // Stage-aware recovery sequences can be triggered based on:
    // - CHECKOUT_ABANDONED_STAGE: Different sequences per step
    // - ABANDONMENT_INTENT_LEVEL: Adjust timing and urgency
    // Example sequences:
    // - step_1 (low intent): 4hr → 2day → 5day (educational)
    // - step_2 (medium intent): 1hr → 6hr → 24hr (value-focused)
    // - step_3 (high intent): 5min → 30min → 2hr (aggressive recovery)

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
