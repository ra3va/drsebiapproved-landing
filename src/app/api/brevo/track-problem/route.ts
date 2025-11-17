import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      problem,
      productClicked,
      source
    } = await req.json();

    // If email provided, update their interest
    // This is optional - mainly used for logged-in users or returning visitors
    if (email) {
      await brevoClient.updateContact(email, {
        attributes: {
          PRIMARY_PROBLEM: problem,
          INTERESTED_PRODUCT: productClicked,
          NAVIGATION_SOURCE: source || 'homepage',
          LAST_INTERACTION: new Date().toISOString()
        }
      });
      console.log(`Updated problem interest for ${email}: ${problem} -> ${productClicked}`);
    }

    // Client-side Brevo tracking will handle anonymous visitor tracking
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Problem tracking error:', error);
    // Don't fail - this is non-critical tracking
    return NextResponse.json({ success: true });
  }
}
