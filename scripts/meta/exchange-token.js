#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const SHORT_TOKEN = process.argv[2];

if (!SHORT_TOKEN) {
  console.log('Usage: node scripts/meta/exchange-token.js <SHORT_LIVED_TOKEN>');
  process.exit(1);
}

async function exchangeToken() {
  const url = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', process.env.META_APP_ID);
  url.searchParams.set('client_secret', process.env.META_APP_SECRET);
  url.searchParams.set('fb_exchange_token', SHORT_TOKEN);

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error('Error:', data.error.message);
    process.exit(1);
  }

  console.log('\n✅ Long-lived token (60 days):');
  console.log(data.access_token);
  console.log(`\nExpires in: ${Math.round(data.expires_in / 86400)} days`);
  console.log('\nAdd to .env.local as META_ACCESS_TOKEN');
}

exchangeToken();
