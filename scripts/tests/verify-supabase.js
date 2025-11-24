/**
 * Verify Supabase Connection and Get Database Info
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Verifying Supabase Connection...\n');
console.log('='.repeat(60));
console.log('Connection Details:');
console.log('='.repeat(60));
console.log('URL:', supabaseUrl);
console.log('Project ID:', supabaseUrl ? supabaseUrl.split('//')[1].split('.')[0] : 'N/A');
console.log('Key (first 30 chars):', supabaseKey ? supabaseKey.substring(0, 30) + '...' : 'MISSING');
console.log('='.repeat(60));

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  try {
    // Try to list tables using the information_schema
    console.log('\n📊 Attempting to connect and list tables...\n');

    // First, just try a simple health check by attempting to select from a system table
    const { data, error } = await supabase
      .from('reengagement_campaign')
      .select('*')
      .limit(1);

    if (error) {
      console.log('⚠️  Table query result:', error.code, '-', error.message);

      if (error.code === '42P01') {
        console.log('\n✅ Connected to database successfully!');
        console.log('❌ BUT: Table "reengagement_campaign" does NOT exist yet');
        console.log('\n📝 You need to create the tables by running the SQL migration.');
      } else if (error.code === 'PGRST116') {
        console.log('\n✅ Connected to database successfully!');
        console.log('❌ BUT: Table "reengagement_campaign" does NOT exist yet');
        console.log('\n📝 You need to create the tables by running the SQL migration.');
      } else {
        console.log('\n⚠️  Unexpected error:', error);
      }
    } else {
      console.log('✅ Connected to database successfully!');
      console.log('✅ Table "reengagement_campaign" EXISTS!');
      console.log('📊 Sample data count:', data ? data.length : 0, 'rows');

      if (data && data.length > 0) {
        console.log('\n📋 Sample row:');
        console.log(JSON.stringify(data[0], null, 2));
      }
    }

    // Try to check all three tables
    console.log('\n🔍 Checking all three tables...\n');

    const tables = [
      'zoho_oauth_tokens',
      'reengagement_campaign',
      'discount_clicks'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table}: Does NOT exist (${error.code})`);
      } else {
        console.log(`   ✅ ${table}: EXISTS`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Database Project URL:');
    console.log('https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0]);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
  }
}

verifyConnection();
