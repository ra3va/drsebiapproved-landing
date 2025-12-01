import { NextRequest, NextResponse } from 'next/server';
import { catalogApi } from '@/lib/square';

export async function POST(request: NextRequest) {
  try {
    // Simple security check (optional - can be removed if not needed)
    const adminPassword = request.headers.get('x-admin-password');

    if (adminPassword && adminPassword !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin credentials' },
        { status: 401 }
      );
    }

    console.log('🎯 Starting Square catalog setup for Dr. Sebi products...');

    // Define products for parasite cleanse landing
    const products = [
      {
        name: 'ParaCleanse Elite',
        description: 'Dr. Sebi\'s Two-Phase Internal Cleansing System - Complete 14-day herbal protocol designed to support gentle detoxification and digestive wellness',
        price: 8999, // $89.99
      },
      {
        name: 'Maya Formula',
        description: 'Dr. Sebi\'s 26-Herb Iron-Rich Formula - Blood, brain, and nervous system support with wildcrafted herbs from Honduras',
        price: 5999, // $59.99
      },
      {
        name: 'Sea Moss Capsules',
        description: 'Honduran Wildcrafted Sea Moss - 92 essential minerals for thyroid, immune, and digestive health',
        price: 4999, // $49.99
      },
      {
        name: 'Mucus Cleanser',
        description: 'Dr. Sebi\'s Respiratory & Cellular Cleansing Formula - Supports healthy mucus balance and respiratory wellness with cascara, mullein, and African bird pepper',
        price: 5999, // $59.99
      }
    ];

    const createdItems = [];

    // Prepare all catalog objects for batch upsert
    const catalogObjects = products.map(product => ({
      type: 'ITEM',
      id: `#${product.name.replace(/\s+/g, '-').toLowerCase()}`,
      itemData: {
        name: product.name,
        description: product.description,
        productType: 'REGULAR',
        variations: [
          {
            type: 'ITEM_VARIATION',
            id: `#${product.name.replace(/\s+/g, '-').toLowerCase()}-variation`,
            itemVariationData: {
              itemId: `#${product.name.replace(/\s+/g, '-').toLowerCase()}`,
              name: 'Regular',
              pricingType: 'FIXED_PRICING',
              priceMoney: {
                amount: BigInt(product.price),
                currency: 'USD'
              }
            }
          }
        ]
      }
    }));

    // Use batchUpsert to create all products at once
    const response = await catalogApi.batchUpsert({
      idempotencyKey: `catalog-setup-${Date.now()}`,
      batches: [{
        objects: catalogObjects
      }]
    });

    const result = response.result || response;

    if (result.objects) {
      createdItems.push(...result.objects);
      result.objects.forEach((obj: any) => {
        console.log(`✅ Created: ${obj.itemData?.name} (ID: ${obj.id})`);
      });
    }

    console.log('✅ Square catalog setup completed successfully');

    // Convert BigInt to string for JSON serialization
    const serializedItems = createdItems.map((item: any) => ({
      id: item.id,
      name: item.itemData?.name,
      description: item.itemData?.description,
      variations: item.itemData?.variations?.map((v: any) => ({
        id: v.id,
        name: v.itemVariationData?.name,
        price: v.itemVariationData?.priceMoney?.amount?.toString(),
        currency: v.itemVariationData?.priceMoney?.currency
      }))
    }));

    return NextResponse.json({
      success: true,
      message: 'Dr. Sebi products created successfully in Square catalog',
      createdItems: createdItems.length,
      data: serializedItems
    });

  } catch (error) {
    console.error('❌ API route error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during Square setup',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // List all catalog items
    const response = await catalogApi.list({ types: 'ITEM' });
    const result = response.result || response;

    return NextResponse.json({
      success: true,
      message: 'Square catalog status check',
      data: {
        itemsCount: result.objects?.length || 0,
        items: result.objects?.map((item: any) => ({
          id: item.id,
          name: item.itemData?.name,
          description: item.itemData?.description,
          variations: item.itemData?.variations?.length || 0
        })) || []
      }
    });

  } catch (error) {
    console.error('❌ Status check error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check Square catalog status',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
