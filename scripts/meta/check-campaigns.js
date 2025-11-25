#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const token = process.env.META_ACCESS_TOKEN;
const accountId = 'act_789466743256239';

// Get all campaigns
const url = `https://graph.facebook.com/v19.0/${accountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time,updated_time&access_token=${token}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const campaigns = JSON.parse(data);

    if (campaigns.error) {
      console.error('Error:', campaigns.error.message);
      process.exit(1);
    }

    if (!campaigns.data || campaigns.data.length === 0) {
      console.log('No campaigns found.');
      process.exit(0);
    }

    console.log(`\n📊 Found ${campaigns.data.length} campaign(s):\n`);

    campaigns.data.forEach((campaign, index) => {
      console.log(`${index + 1}. ${campaign.name}`);
      console.log(`   ID: ${campaign.id}`);
      console.log(`   Status: ${campaign.status}`);
      console.log(`   Objective: ${campaign.objective || 'N/A'}`);
      console.log(`   Daily Budget: ${campaign.daily_budget ? '$' + (campaign.daily_budget / 100).toFixed(2) : 'N/A'}`);
      console.log(`   Lifetime Budget: ${campaign.lifetime_budget ? '$' + (campaign.lifetime_budget / 100).toFixed(2) : 'N/A'}`);
      console.log(`   Created: ${new Date(campaign.created_time).toLocaleDateString()}`);
      console.log(`   Updated: ${new Date(campaign.updated_time).toLocaleDateString()}`);
      console.log('');
    });
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});
