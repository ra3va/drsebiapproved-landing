#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const token = process.env.META_ACCESS_TOKEN;
const accountId = 'act_789466743256239';

// Get insights for last 7 days to see what's actually spending
const url = `https://graph.facebook.com/v19.0/${accountId}/insights?fields=campaign_id,campaign_name,spend,impressions,clicks,actions&level=campaign&date_preset=last_7d&access_token=${token}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const response = JSON.parse(data);

    if (response.error) {
      console.error('Error:', response.error.message);
      process.exit(1);
    }

    const insights = response.data || [];

    if (insights.length === 0) {
      console.log('No ad spend in the last 7 days.');
      process.exit(0);
    }

    console.log(`\n💰 Campaigns with ACTUAL SPEND (Last 7 Days):\n`);

    let totalSpend = 0;

    insights.forEach((insight, i) => {
      const spend = parseFloat(insight.spend || 0);
      const impressions = parseInt(insight.impressions || 0);
      const clicks = parseInt(insight.clicks || 0);
      const conversions = insight.actions ? insight.actions.find(a => a.action_type === 'purchase')?.value || 0 : 0;

      totalSpend += spend;

      console.log(`${i + 1}. ${insight.campaign_name}`);
      console.log(`   ID: ${insight.campaign_id}`);
      console.log(`   Spend: $${spend.toFixed(2)}`);
      console.log(`   Impressions: ${impressions.toLocaleString()}`);
      console.log(`   Clicks: ${clicks}`);
      if (conversions > 0) {
        console.log(`   Conversions: ${conversions}`);
      }
      console.log('');
    });

    console.log(`📊 Total Spend (Last 7 Days): $${totalSpend.toFixed(2)}`);
    console.log('');
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});
