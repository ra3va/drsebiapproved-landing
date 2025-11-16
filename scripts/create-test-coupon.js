require('dotenv').config({ path: '.env.local' });
const { SquareClient, SquareEnvironment } = require('square');

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox
});

async function createTestCoupon() {
  try {
    console.log('🎫 Creating TEST99 coupon (99% off)...\n');

    const response = await client.catalog.batchUpsert({
      idempotencyKey: `test-coupon-${Date.now()}`,
      batches: [{
        objects: [{
          type: 'DISCOUNT',
          id: '#test99-discount',
          discountData: {
            name: 'TEST99',
            discountType: 'FIXED_PERCENTAGE',
            percentage: '99.0',
            pinRequired: false
          }
        }]
      }]
    });

    const result = response.result || response;
    const discount = result.objects?.[0];

    if (discount) {
      console.log('✅ TEST99 coupon created successfully!\n');
      console.log('Discount Details:');
      console.log(`  - ID: ${discount.id}`);
      console.log(`  - Name: ${discount.discountData.name}`);
      console.log(`  - Type: ${discount.discountData.discountType}`);
      console.log(`  - Percentage: ${discount.discountData.percentage}%`);
      console.log('\n📝 Copy this ID to use in your verify-coupon route:');
      console.log(`  TEST99: '${discount.id}'`);
      console.log('\n💡 Usage: Enter "TEST99" at checkout to get 99% off');
      console.log('   Example: $89.99 → $0.90');
    } else {
      console.error('❌ Failed to create coupon');
      console.error(result);
    }
  } catch (error) {
    console.error('❌ Error creating coupon:', error);
  }
}

createTestCoupon();
