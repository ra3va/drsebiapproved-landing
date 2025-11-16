---
name: square-payment-integration
description: Complete Square payment integration setup, product management, image uploads, and troubleshooting for Next.js applications. Use when setting up Square payments, creating products in Square catalog, uploading product images, removing duplicates, debugging Square API issues, or integrating Square checkout.
---

# Square Payment Integration

Complete Square payment integration setup, product management, and troubleshooting for Next.js applications.

**Version**: 1.1
**Last Updated**: November 16, 2025

## Prerequisites Check

Before starting, verify these environment variables exist in `.env.local`:

```bash
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-...
SQUARE_ACCESS_TOKEN=EAAA...
SQUARE_ENVIRONMENT=production  # or sandbox
NEXT_PUBLIC_SQUARE_LOCATION_ID=...
```

## Part 1: Testing Square Connection

### Step 1: Create Connection Test Script

Create `test-square-connection.js` in project root:

```javascript
require('dotenv').config({ path: '.env.local' });
const { SquareClient, SquareEnvironment } = require('square');

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox
});

async function testConnection() {
  console.log('Testing Square Connection...\n');

  // Test Locations
  const locResponse = await client.locations.list();
  const locations = locResponse.result || locResponse;
  console.log(`✓ Found ${locations.locations?.length || 0} location(s)`);

  if (locations.locations) {
    locations.locations.forEach(loc => {
      console.log(`  - ${loc.name} (ID: ${loc.id})`);
    });
  }

  // Test Catalog
  const catResponse = await client.catalog.search({
    objectTypes: ['ITEM']
  });
  const catalog = catResponse.result || catResponse;
  console.log(`\n✓ Found ${catalog.objects?.length || 0} catalog item(s)`);

  console.log('\n✅ Connection verified!');
}

testConnection().catch(console.error);
```

### Step 2: Run Connection Test

```bash
node test-square-connection.js
```

## Part 2: Creating Products Programmatically

### Critical Square SDK Methods Reference

**IMPORTANT**: The Square SDK uses these exact method names:

| API | Correct Method | NOT This |
|-----|---------------|----------|
| Catalog List | `client.catalog.list({ types: 'ITEM' })` | ❌ `listCatalog()` |
| Catalog Search | `client.catalog.search({ objectTypes: ['ITEM'] })` | ❌ `searchCatalog()` |
| Catalog Upsert | `client.catalog.batchUpsert({ batches: [...] })` | ❌ `upsertCatalogObject()` |
| Locations | `client.locations.list()` | ❌ `listLocations()` |
| Payments | `client.payments` | ❌ `paymentsApi` |

### Step 1: Update Square Library

Ensure `src/lib/square.ts` exports are correct:

```typescript
const { SquareClient, SquareEnvironment } = require('square');

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
});

export const squareClient = client;
export const catalogApi = client.catalog;
export const paymentsApi = client.payments;
export const ordersApi = client.orders;
export const customersApi = client.customers;
```

### Step 2: Create Product Setup API Route

File: `src/app/api/square/setup-catalog/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { catalogApi } from '@/lib/square';

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Starting Square catalog setup...');

    const products = [
      {
        name: 'ParaCleanse Elite',
        description: 'Dr. Sebi\'s Two-Phase Parasite Cleansing System',
        price: 8999,
      },
      {
        name: 'Maya Formula',
        description: 'Dr. Sebi\'s 26-Herb Iron-Rich Formula',
        price: 5999,
      },
      {
        name: 'Sea Moss Capsules',
        description: 'Honduran Wildcrafted Sea Moss - 92 minerals',
        price: 4999,
      },
      {
        name: 'Mucus Cleanser',
        description: 'Dr. Sebi\'s Respiratory Cleansing Formula',
        price: 5999,
      }
    ];

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

    const response = await catalogApi.batchUpsert({
      idempotencyKey: `catalog-setup-${Date.now()}`,
      batches: [{
        objects: catalogObjects
      }]
    });

    const result = response.result || response;
    const createdItems = result.objects || [];

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
      message: 'Products created successfully',
      createdItems: createdItems.length,
      data: serializedItems
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create products',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
```

## Part 3: Common Issues and Solutions

### Issue 1: "Cannot find module 'square'"
**Solution**: `npm install square`

### Issue 2: "catalogApi.upsertCatalogObject is not a function"
**Solution**: Use `catalogApi.batchUpsert()` instead

### Issue 3: "Do not know how to serialize a BigInt"
**Solution**: Convert BigInt to string: `amount?.toString()`

### Issue 4: "Expected bigint. Received 8999"
**Solution**: Wrap in BigInt(): `amount: BigInt(product.price)`

### Issue 5: catalog.list() returns 0 items
**Solution**: Use `search()` instead:
```typescript
const response = await catalogApi.search({ objectTypes: ['ITEM'] });
```

### Issue 6: "Failed to parse URL from production/v2/..."
**Solution**: Use SquareEnvironment enum:
```typescript
import { SquareEnvironment } from 'square';
environment: SquareEnvironment.Production
```

## Part 4: Product IDs for Integration

### ParaCleanse Elite
- Product ID: `VNXJGMIAONQW6E2YWZ44YW3J`
- Variation ID: `5JV44RI47GC5IMYSENVXMV3D`
- Price: $89.99

### Maya Formula
- Product ID: `MZ76PLNQ64DBID54NETFPDQ6`
- Variation ID: `TWJMT4CUFNFNQKG3S5EQRPLO`
- Price: $59.99

### Sea Moss Capsules
- Product ID: `5K4ROITULVLR66CLYQMQ73UH`
- Variation ID: `YGDG42LYJKWH75NNW6HPWP5M`
- Price: $49.99

### Mucus Cleanser
- Product ID: `3E3EHDMMOEKCHL3ZXWOFRHS6`
- Variation ID: `6JARPI34BXU27SS36ZFSEJQP`
- Price: $59.99

## Part 5: Uploading Product Images

### Overview
Square supports uploading images to catalog items via their REST API. The Node.js SDK has a bug with the images endpoint, so we use direct API calls with FormData.

### Image Requirements
- **Formats**: JPG, PNG, GIF
- **Max Size**: 15MB per image
- **Recommended**: Square images (1:1 ratio) for best display

### Upload Script

Create `scripts/upload-product-images.js`:

```javascript
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const crypto = require('crypto');
const FormData = require('form-data');
const fetch = require('node-fetch');

const SQUARE_API_BASE = process.env.SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

async function uploadImageDirect(productId, productName, imagePath) {
  const form = new FormData();

  // Add request JSON
  const request = {
    idempotency_key: crypto.randomUUID(),
    object_id: productId,
    image: {
      type: 'IMAGE',
      id: `#${productName.replace(/\s+/g, '-').toLowerCase()}-image`,
      image_data: {
        caption: productName
      }
    }
  };

  form.append('request', JSON.stringify(request), {
    contentType: 'application/json'
  });

  // Add image file
  const imageBuffer = fs.readFileSync(imagePath);
  const fileName = imagePath.split('/').pop();

  form.append('image_file', imageBuffer, {
    filename: fileName,
    contentType: fileName.endsWith('.png') ? 'image/png' : 'image/jpeg'
  });

  // Call API
  const response = await fetch(`${SQUARE_API_BASE}/v2/catalog/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Square-Version': '2025-10-16',
      ...form.getHeaders()
    },
    body: form
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data;
}

// Example usage
async function uploadAllImages() {
  const images = [
    { id: 'MZ76PLNQ64DBID54NETFPDQ6', name: 'Maya Formula', path: 'public/images/maya-formula.jpg' },
    { id: '3E3EHDMMOEKCHL3ZXWOFRHS6', name: 'Mucus Cleanser', path: 'public/images/mucus-cleanser.jpg' },
    { id: '5K4ROITULVLR66CLYQMQ73UH', name: 'Sea Moss Capsules', path: 'public/images/sea-moss.jpg' },
    { id: 'VNXJGMIAONQW6E2YWZ44YW3J', name: 'ParaCleanse Elite', path: 'public/images/paracleanse.jpg' }
  ];

  for (const img of images) {
    try {
      const result = await uploadImageDirect(img.id, img.name, img.path);
      console.log(`✅ Uploaded ${img.name}: ${result.image?.id}`);
    } catch (error) {
      console.error(`❌ Failed ${img.name}:`, error.message);
    }
  }
}

uploadAllImages();
```

### Usage

```bash
# Install dependencies
npm install form-data node-fetch

# Upload all product images
node scripts/upload-product-images.js
```

### Product Images Uploaded

| Product | Image ID | Status |
|---------|----------|--------|
| Maya Formula | QRARO5ZE2FUTKEWJ4NTZFVEI | ✅ Uploaded |
| Mucus Cleanser | 5MHINJZWDKT7TIKPSPJUJVSD | ✅ Uploaded |
| Sea Moss Capsules | PEIPB6FWTPNKW7SPN5ZNMKUI | ✅ Uploaded |
| ParaCleanse Elite | 6KM7MHDYT2CQXCNUTYQLFANV | ✅ Uploaded |

### Troubleshooting Images

**Issue**: "SDK images.create() returns idempotency_key error"
- **Solution**: Use direct API call with FormData (see script above)
- **Reason**: Square Node.js SDK v37 has a bug with the images endpoint

**Issue**: Image not showing in Square Dashboard
- **Wait Time**: Images may take 1-2 minutes to process
- **Check**: https://squareup.com/dashboard/items/library
- **Verify**: Image ID was returned in upload response

## Part 6: Removing Duplicate Products

### Quick Duplicate Removal Script

Create `scripts/remove-duplicates.js`:

```javascript
require('dotenv').config({ path: '.env.local' });
const { SquareClient, SquareEnvironment } = require('square');

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox
});

async function removeDuplicates() {
  const response = await client.catalog.search({
    objectTypes: ['ITEM']
  });

  const productsByName = {};
  response.objects?.forEach(product => {
    const name = product.itemData?.name;
    if (!productsByName[name]) productsByName[name] = [];
    productsByName[name].push(product);
  });

  const toDelete = [];
  for (const [name, items] of Object.entries(productsByName)) {
    if (items.length > 1) {
      // Keep most recent, delete rest
      items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      toDelete.push(...items.slice(1).map(i => i.id));
      console.log(`Found ${items.length} duplicates of "${name}"`);
    }
  }

  if (toDelete.length > 0) {
    await client.catalog.batchDelete({ objectIds: toDelete });
    console.log(`✅ Deleted ${toDelete.length} duplicate products`);
  } else {
    console.log('✅ No duplicates found');
  }
}

removeDuplicates();
```

### Usage

```bash
node scripts/remove-duplicates.js
```

## Part 7: Quick Reference Commands

### Connection Test
```bash
node test-square-connection.js
```

### Create All Products
```bash
curl -X POST http://localhost:3000/api/square/setup-catalog | jq .
```

### Verify Products
```bash
node verify-catalog.js
```

### Upload Product Images
```bash
node scripts/upload-product-images.js
```

### Remove Duplicates
```bash
node scripts/remove-duplicates.js
```

## Deployment Checklist

- [ ] All 4 products created in Square
- [ ] Product images uploaded to Square
- [ ] Product IDs saved and added to product pages
- [ ] No duplicate products in catalog
- [ ] Test checkout flow with sandbox
- [ ] Environment variables added to hosting platform
- [ ] Square webhook configured (if using)
- [ ] Test payment with TEST99 coupon in production

## Test Cards (Sandbox)

| Card Number | CVV | Result |
|-------------|-----|--------|
| 4111 1111 1111 1111 | 111 | Success |
| 4000 0000 0000 0002 | 111 | Card Declined |

## Support

- Square Support: 1-855-700-6000
- Square Docs: https://developer.squareup.com/docs
- Square Dashboard: https://squareup.com/dashboard
