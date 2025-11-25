#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const token = process.env.META_ACCESS_TOKEN;
const accountId = 'act_789466743256239';

// Get campaigns with insights to see what's actually spending
const url = `https://graph.facebook.com/v19.0/${accountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,created_time,effective_status,configured_status&access_token=${token}`;

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

    // Group by effective status
    const active = [];
    const paused = [];
    const other = [];

    campaigns.data.forEach(campaign => {
      const status = campaign.effective_status || campaign.status;
      if (status === 'ACTIVE') {
        active.push(campaign);
      } else if (status === 'PAUSED') {
        paused.push(campaign);
      } else {
        other.push(campaign);
      }
    });

    console.log(`\n📊 Campaign Status Summary:\n`);
    console.log(`🟢 Actually Delivering: ${active.length}`);
    console.log(`⏸️  Paused/Not Delivering: ${paused.length}`);
    console.log(`⚠️  Other Status: ${other.length}`);
    console.log('');

    if (active.length > 0) {
      console.log('🟢 ACTIVE & DELIVERING:\n');
      active.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name}`);
        console.log(`   Status: ${c.effective_status || c.status}`);
        console.log(`   Budget: ${c.daily_budget ? '$' + (c.daily_budget / 100).toFixed(2) + '/day' : (c.lifetime_budget ? '$' + (c.lifetime_budget / 100).toFixed(2) + ' lifetime' : 'No budget')}`);
        console.log('');
      });
    }

    if (paused.length > 0) {
      console.log('⏸️  PAUSED/NOT DELIVERING:\n');
      paused.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name}`);
        console.log(`   Status: ${c.effective_status || c.status}`);
        console.log('');
      });
    }

    if (other.length > 0) {
      console.log('⚠️  OTHER STATUS:\n');
      other.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name}`);
        console.log(`   Status: ${c.effective_status || c.status}`);
        console.log('');
      });
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});
