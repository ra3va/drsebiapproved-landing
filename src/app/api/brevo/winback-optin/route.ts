import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      firstName,
      source
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email required' },
        { status: 400 }
      );
    }

    // Find or create "Win-Back - Mucus Cleanser" list
    const winbackList = await brevoClient.findOrCreateList('Win-Back - Mucus Cleanser');

    // Calculate countdown expiry (72 hours from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 72);

    // Build attributes object
    const attributes: Record<string, any> = {
      FIRSTNAME: firstName || '',
      SOURCE: source || 'winback-landing',
      WINBACK_SOURCE: 'mucus-cleanser-winback',
      DISCOUNT_CODE: 'STOPMUCUS',
      COUNTDOWN_EXPIRES: expiryDate.toISOString(),
      OPTIN_DATE: new Date().toISOString(),
      CUSTOMER_STATUS: 'win-back-lead'
    };

    // Create/update contact in Brevo
    await brevoClient.addContact({
      email,
      attributes,
      listIds: [winbackList.id],
      updateEnabled: true
    });

    console.log(`✅ Win-back opt-in tracked for ${email} - Discount: STOPMUCUS`);

    // Return success with discount code
    return NextResponse.json({
      success: true,
      message: 'Opt-in successful',
      discountCode: 'STOPMUCUS',
      expiresAt: expiryDate.toISOString()
    });

  } catch (error: any) {
    console.error('❌ Win-back opt-in error:', error);

    // Return error response
    return NextResponse.json({
      success: false,
      message: 'Failed to process opt-in. Please try again.'
    }, { status: 500 });
  }
}
