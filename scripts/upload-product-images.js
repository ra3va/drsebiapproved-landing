/**
 * Square Image Upload - Direct API Call
 * Bypasses SDK to call Square REST API directly
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const crypto = require('crypto');
const FormData = require('form-data');
const fetch = require('node-fetch');

const SQUARE_API_BASE = process.env.SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com'
  : 'https://connect.squareupsandbox.com';

const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

const PRODUCTS = [
  {
    id: 'MZ76PLNQ64DBID54NETFPDQ6',
    name: 'Maya Formula',
    imagePath: 'public/maya.png'
  },
  {
    id: '3E3EHDMMOEKCHL3ZXWOFRHS6',
    name: 'Mucus Cleanser',
    imagePath: 'public/mucus.png'
  },
  {
    id: '5K4ROITULVLR66CLYQMQ73UH',
    name: 'Sea Moss Capsules',
    imagePath: 'public/seamoss.png'
  },
  {
    id: 'VNXJGMIAONQW6E2YWZ44YW3J',
    name: 'ParaCleanse Elite',
    imagePath: 'public/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview (1).png'
  }
];

async function uploadImageDirect(productId, productName, imagePath) {
  const form = new FormData();

  // Add request JSON data
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

  // Make API call
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

async function uploadAllImages() {
  console.log('📸 Uploading product images to Square (Direct API)...\n');

  for (const product of PRODUCTS) {
    try {
      console.log(`\n📦 ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Image: ${product.imagePath}`);

      if (!fs.existsSync(product.imagePath)) {
        console.log(`   ⚠️  Image file not found, skipping...`);
        continue;
      }

      const stats = fs.statSync(product.imagePath);
      console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   Uploading...`);

      const result = await uploadImageDirect(product.id, product.name, product.imagePath);

      if (result.image) {
        console.log(`   ✅ Success!`);
        console.log(`   Image ID: ${result.image.id}`);
        if (result.image.image_data?.url) {
          console.log(`   URL: ${result.image.image_data.url}`);
        }
      } else {
        console.log(`   ⚠️  Uploaded but unexpected response format`);
        console.log(JSON.stringify(result, null, 2));
      }

    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }

  console.log('\n\n✨ Image upload complete!');
  console.log('\n💡 View products: https://squareup.com/dashboard/items/library');
}

uploadAllImages().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
