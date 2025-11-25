#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

async function createTestCampaign() {
  console.log('Creating test campaign on account:', AD_ACCOUNT_ID);

  const url = `https://graph.facebook.com/v19.0/${AD_ACCOUNT_ID}/campaigns`;
  
  const params = new URLSearchParams({
    access_token: ACCESS_TOKEN,
    name: 'API Programmatic Test [Droid]',
    objective: 'OUTCOME_TRAFFIC',
    status: 'PAUSED',
    special_ad_categories: '[]'
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const data = await res.json();

  if (data.error) {
    console.error('Error:', data.error.message);
    process.exit(1);
  }

  console.log('\n✅ Campaign created!');
  console.log('Campaign ID:', data.id);
  console.log('\nView in Ads Manager: https://business.facebook.com/adsmanager/manage/campaigns?act=' + AD_ACCOUNT_ID.replace('act_', ''));
}

createTestCampaign();
