/**
 * Supabase Connection Test Script
 * Tests database connection and table existence
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Testing Supabase Connection...\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n✅ Supabase client created successfully');

    // Test 1: Check if tables exist by trying to query them
    console.log('\n📊 Checking database tables...\n');

    // Check zoho_oauth_tokens table
    console.log('1. Testing zoho_oauth_tokens table...');
    const { data: tokens, error: tokensError } = await supabase
      .from('zoho_oauth_tokens')
      .select('count', { count: 'exact', head: true });

    if (tokensError) {
      console.log(`   ❌ Table does not exist or has error: ${tokensError.message}`);
      console.log('   📝 Need to run migration SQL script');
    } else {
      console.log('   ✅ zoho_oauth_tokens table exists');
    }

    // Check reengagement_campaign table
    console.log('\n2. Testing reengagement_campaign table...');
    const { data: campaign, error: campaignError } = await supabase
      .from('reengagement_campaign')
      .select('count', { count: 'exact', head: true });

    if (campaignError) {
      console.log(`   ❌ Table does not exist or has error: ${campaignError.message}`);
      console.log('   📝 Need to run migration SQL script');
    } else {
      console.log('   ✅ reengagement_campaign table exists');
    }

    // Check discount_clicks table
    console.log('\n3. Testing discount_clicks table...');
    const { data: clicks, error: clicksError } = await supabase
      .from('discount_clicks')
      .select('count', { count: 'exact', head: true });

    if (clicksError) {
      console.log(`   ❌ Table does not exist or has error: ${clicksError.message}`);
      console.log('   📝 Need to run migration SQL script');
    } else {
      console.log('   ✅ discount_clicks table exists');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    if (tokensError || campaignError || clicksError) {
      console.log('⚠️  TABLES NEED TO BE CREATED');
      console.log('\nNext step: Run the SQL migration script in Supabase:');
      console.log('   File: prisma/migrations/01_create_zoho_campaign_tables.sql');
      console.log('   Location: Supabase Dashboard → SQL Editor → New Query');
      console.log('='.repeat(60) + '\n');
    } else {
      console.log('✅ ALL TABLES EXIST - DATABASE READY!');
      console.log('='.repeat(60) + '\n');
    }

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
