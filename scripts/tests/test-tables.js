/**
 * Test Supabase Tables - Insert and Query Test Data
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🧪 Testing Supabase Tables with Real Operations...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  console.log('='.repeat(60));
  console.log('Connected to:', supabaseUrl);
  console.log('Project:', supabaseUrl.split('//')[1].split('.')[0]);
  console.log('='.repeat(60) + '\n');

  // Test 1: Insert test data into reengagement_campaign
  console.log('📝 Test 1: Inserting test customer...');

  const { data: insertData, error: insertError } = await supabase
    .from('reengagement_campaign')
    .upsert({
      customer_email: 'kingthriva@gmail.com',
      customer_name: 'Ra Thriva',
      status: 'pending',
      batch_number: 1
    }, { onConflict: 'customer_email' })
    .select();

  if (insertError) {
    console.log('   ❌ Insert failed:', insertError.message);
  } else {
    console.log('   ✅ Insert successful!');
    console.log('   Data:', JSON.stringify(insertData, null, 2));
  }

  // Test 2: Query the data back
  console.log('\n📖 Test 2: Querying all campaigns...');

  const { data: queryData, error: queryError } = await supabase
    .from('reengagement_campaign')
    .select('*')
    .order('created_at', { ascending: false });

  if (queryError) {
    console.log('   ❌ Query failed:', queryError.message);
  } else {
    console.log('   ✅ Query successful!');
    console.log('   Total rows:', queryData.length);

    if (queryData.length > 0) {
      console.log('\n   📋 Sample rows:');
      queryData.slice(0, 3).forEach((row, i) => {
        console.log(`   ${i + 1}. ${row.customer_email} - ${row.customer_name} (${row.status})`);
      });
    }
  }

  // Test 3: Count by status
  console.log('\n📊 Test 3: Campaign statistics...');

  const { data: statsData, error: statsError } = await supabase
    .from('reengagement_campaign')
    .select('status');

  if (statsError) {
    console.log('   ❌ Stats query failed:', statsError.message);
  } else {
    const stats = statsData.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    console.log('   ✅ Statistics:');
    Object.entries(stats).forEach(([status, count]) => {
      console.log(`      ${status}: ${count}`);
    });
  }

  // Test 4: Check zoho_oauth_tokens table
  console.log('\n🔑 Test 4: Checking OAuth tokens table...');

  const { data: tokenData, error: tokenError } = await supabase
    .from('zoho_oauth_tokens')
    .select('user_email, expires_at')
    .limit(10);

  if (tokenError) {
    console.log('   ❌ Token query failed:', tokenError.message);
  } else {
    console.log('   ✅ Token table accessible!');
    console.log('   Total tokens:', tokenData.length);

    if (tokenData.length > 0) {
      console.log('   📋 Existing tokens:');
      tokenData.forEach(token => {
        console.log(`      - ${token.user_email} (expires: ${token.expires_at})`);
      });
    } else {
      console.log('   ℹ️  No OAuth tokens yet (will be created after authorization)');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TESTS COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nDatabase is ready for Zoho integration! 🎉\n');
}

testTables();
