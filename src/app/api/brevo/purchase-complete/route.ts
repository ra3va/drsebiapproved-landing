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
      productsPurchased,
      orderValue,
      orderId,
      shippingAddress,
      phone
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

    // Build attributes object
    const attributes: Record<string, any> = {
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
      SHIPPING_ZIP: shippingAddress?.postalCode || '',
      CHECKOUT_IN_PROGRESS: 'false',  // NEW: mark checkout complete
      CART_ABANDONED: 'false'  // NEW: clear abandoned flag (they purchased!)
    };

    // Add SMS attribute only if phone is valid E.164 format
    if (phone) {
      const formattedPhone = formatPhoneForBrevo(phone);
      if (formattedPhone) {
        attributes.SMS = formattedPhone;
      }
    }

    // Update contact with purchase data and add to customer lists
    await brevoClient.addContact({
      email,
      attributes,
      listIds: lists.map(l => l.id),
      updateEnabled: true
    });

    // Remove from abandonment and checkout lists (they completed purchase!)
    const cleanupLists = [
      'Checkout Started',
      'Abandoned Cart - Low Intent',
      'Abandoned Cart - High Intent'
    ];

    for (const listName of cleanupLists) {
      try {
        const list = await brevoClient.getListByName(listName);
        if (list) {
          // Remove contact from this list
          await brevoClient.request(`/contacts/lists/${list.id}/contacts/remove`, {
            method: 'POST',
            body: JSON.stringify({ emails: [email] })
          });
          console.log(`✅ Removed ${email} from "${listName}"`);
        }
      } catch (error) {
        // List might not exist yet - that's okay
        console.log(`ℹ️ List "${listName}" not found or contact not in list`);
      }
    }

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
