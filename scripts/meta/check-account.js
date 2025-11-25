#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

async function checkAccount() {
  const url = `https://graph.facebook.com/v19.0/${AD_ACCOUNT_ID}?fields=name,account_status,amount_spent,currency&access_token=${ACCESS_TOKEN}`;
  
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error('Error:', data.error.message);
    process.exit(1);
  }

  console.log('✅ Ad Account Connected');
  console.log('Name:', data.name);
  console.log('Status:', data.account_status === 1 ? 'Active' : 'Inactive');
  console.log('Currency:', data.currency);
  console.log('Amount Spent:', (parseInt(data.amount_spent) / 100).toFixed(2), data.currency);
}

checkAccount();
