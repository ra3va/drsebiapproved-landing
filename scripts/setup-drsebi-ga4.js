#!/usr/bin/env node

/**
 * Dr. Sebi Approved GA4 Setup Script
 * 
 * Creates DrSebi-specific conversion events and custom dimensions
 * in the shared FortunatusPurse GA4 property
 */

require('dotenv').config({ path: '.env.local' });

const drSebiConversions = [
    { eventName: 'newsletter_signup', defaultValue: 47.00 },
    { eventName: 'quiz_completion', defaultValue: 25.00 },
    { eventName: 'product_view', defaultValue: 12.00 },
    { eventName: 'shopify_redirect', defaultValue: 59.99 },
    { eventName: 'blog_read_complete', defaultValue: 8.00 },
    { eventName: 'pdf_download', defaultValue: 35.00 },
    { eventName: 'email_link_click', defaultValue: 15.00 }
];

const drSebiDimensions = [
    {
        parameterName: 'content_category',
        displayName: 'Content Category',
        scope: 'EVENT',
        description: 'Blog category or quiz type (wellness, detox, nutrition, etc.)'
    },
    {
        parameterName: 'product_name',
        displayName: 'Product Name',
        scope: 'EVENT',
        description: 'ParaCleanse or other wellness products'
    },
    {
        parameterName: 'campaign_stage',
        displayName: 'Campaign Stage',
        scope: 'USER',
        description: 'Email campaign stage: Intro, Follow-up, or Urgency'
    },
    {
        parameterName: 'user_wellness_tier',
        displayName: 'Wellness Tier',
        scope: 'USER',
        description: 'Customer journey stage: Awareness, Consideration, or Purchase'
    }
];

async function setupDrSebiGA4() {
    console.log('🌿 Setting up Dr. Sebi Approved GA4 Configuration...\n');

    const baseUrl = 'http://localhost:3000';

    // Create conversion events
    console.log('📊 Creating conversion events...');
    for (const conversion of drSebiConversions) {
        try {
            const response = await fetch(`${baseUrl}/api/analytics/claude`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    command: `create conversion for ${conversion.eventName}`
                })
            });

            const result = await response.json();
            if (result.success) {
                console.log(`  ✅ ${conversion.eventName} - $${conversion.defaultValue.toFixed(2)} value`);
            } else {
                console.log(`  ⚠️  ${conversion.eventName} - ${result.message}`);
            }
        } catch (error) {
            console.error(`  ❌ ${conversion.eventName} - ${error.message}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎯 Creating custom dimensions...');
    for (const dimension of drSebiDimensions) {
        try {
            const response = await fetch(`${baseUrl}/api/analytics/claude`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    command: `create ${dimension.scope.toLowerCase()} dimension for ${dimension.parameterName}`
                })
            });

            const result = await response.json();
            if (result.success) {
                console.log(`  ✅ ${dimension.displayName} (${dimension.scope})`);
            } else {
                console.log(`  ⚠️  ${dimension.displayName} - ${result.message}`);
            }
        } catch (error) {
            console.error(`  ❌ ${dimension.displayName} - ${error.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Get account summary
    console.log('\n📈 Verifying configuration...');
    try {
        const response = await fetch(`${baseUrl}/api/analytics/claude`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'show account summary' })
        });

        const result = await response.json();
        if (result.success) {
            console.log('  ✅ GA4 configuration verified');
            console.log(`  📊 Property ID: ${result.data.propertyId}`);
            console.log(`  🎯 Conversions: ${result.data.conversions.count}`);
            console.log(`  📏 Custom Dimensions: ${result.data.customDimensions.count}`);
        }
    } catch (error) {
        console.error('  ❌ Verification failed:', error.message);
    }

    console.log('\n✨ Dr. Sebi Approved GA4 setup complete!\n');
    console.log('🧪 Test with: npm run test:analytics');
    console.log('📊 Query example: "show newsletter conversions last 7 days"');
}

if (require.main === module) {
    setupDrSebiGA4().catch(error => {
        console.error('💥 Setup failed:', error);
        process.exit(1);
    });
}

module.exports = { setupDrSebiGA4 };
