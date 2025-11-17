import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      firstName,
      lastName,
      productsPurchased,
      orderValue,
      orderId,
      shippingAddress
    } = await req.json();

    // Validate required fields
    if (!email || !orderId) {
      return NextResponse.json(
        { error: 'Email and order ID are required' },
        { status: 400 }
      );
    }

    // Extract product slugs from products array
    const productSlugs = productsPurchased.map((p: any) => {
      // Map product names to slugs
      const name = p.name.toLowerCase();
      if (name.includes('paracleanse')) return 'paracleanse';
      if (name.includes('maya')) return 'maya';
      if (name.includes('sea moss') || name.includes('seamoss')) return 'seamoss';
      if (name.includes('mucus')) return 'mucus-cleanser';
      return name;
    });

    // Determine if bundle purchase
    const isBundle = productSlugs.length > 1;
    const primaryProduct = productSlugs[0];

    // Customer list names
    const customerListNames = productSlugs.map((slug: string) => {
      const productNames: Record<string, string> = {
        'paracleanse': 'ParaCleanse Customers',
        'maya': 'Maya Customers',
        'seamoss': 'Sea Moss Customers',
        'mucus-cleanser': 'Mucus Cleanser Customers'
      };
      return productNames[slug] || 'Customers';
    });

    // Add to bundle list if applicable
    if (isBundle) {
      customerListNames.push('Bundle Buyers');
    }

    // Create/get all customer lists
    console.log(`Creating/finding customer lists: ${customerListNames.join(', ')}`);
    const lists = await Promise.all(
      customerListNames.map((name: string) => brevoClient.findOrCreateList(name))
    );

    // Update contact with purchase data
    await brevoClient.addContact({
      email,
      attributes: {
        FIRSTNAME: firstName || '',
        LASTNAME: lastName || '',
        LAST_PURCHASE_PRODUCT: primaryProduct,
        LAST_PURCHASE_VALUE: orderValue,
        LAST_PURCHASE_DATE: new Date().toISOString().split('T')[0],
        ORDER_ID: orderId,
        IS_BUNDLE_BUYER: isBundle ? 'true' : 'false',
        CUSTOMER_STATUS: 'active',
        PRODUCTS_OWNED: productSlugs.join(','),
        SHIPPING_CITY: shippingAddress?.locality || '',
        SHIPPING_STATE: shippingAddress?.administrativeDistrictLevel1 || '',
        SHIPPING_ZIP: shippingAddress?.postalCode || ''
      },
      listIds: lists.map(l => l.id),
      updateEnabled: true
    });

    console.log(`Purchase tracked for ${email} - Products: ${productSlugs.join(', ')} - Order: ${orderId}`);

    // Your AI agent will trigger product-specific welcome sequences
    // based on which customer lists they joined

    return NextResponse.json({
      success: true,
      message: 'Purchase tracked and customer automation triggered',
      customerLists: customerListNames
    });

  } catch (error: any) {
    console.error('Purchase tracking error:', error);

    // Log error but don't fail the request
    // We don't want to break the checkout flow
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track purchase',
        message: error.message
      },
      { status: 500 }
    );
  }
}
