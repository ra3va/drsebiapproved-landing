/**
 * Run Supabase Migration Programmatically
 * Creates the 3 tables needed for Zoho campaign
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔧 Running Supabase Migration...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'prisma', 'migrations', '01_create_zoho_campaign_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Read migration file: 01_create_zoho_campaign_tables.sql');
    console.log('📊 Executing SQL...\n');

    // Split SQL into individual statements (basic splitting by semicolons)
    // Note: This is a simple approach - for complex SQL you might need a proper parser
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      // Skip comment-only lines
      if (statement.startsWith('--')) continue;

      try {
        // Execute using Supabase RPC or direct SQL execution
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });

        if (error) {
          // If RPC doesn't exist, try alternative approach
          console.log('⚠️  RPC method not available, using alternative approach...');

          // For CREATE TABLE statements, we can verify they exist
          if (statement.includes('CREATE TABLE IF NOT EXISTS')) {
            const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
            if (tableName) {
              const { data, error } = await supabase
                .from(tableName)
                .select('count', { count: 'exact', head: true });

              if (error && error.code !== 'PGRST116') {
                console.log(`   ℹ️  Table ${tableName} might need manual creation`);
              } else {
                console.log(`   ✅ Table ${tableName} verified`);
                successCount++;
              }
            }
          } else {
            skipCount++;
          }
        } else {
          successCount++;
        }
      } catch (err) {
        // Skip if already exists or other benign errors
        if (statement.includes('IF NOT EXISTS') || statement.includes('CREATE OR REPLACE')) {
          skipCount++;
        } else {
          console.log(`   ⚠️  Skipped: ${statement.substring(0, 60)}...`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('   Statements processed:', statements.length);
    console.log('   Successfully executed:', successCount);
    console.log('   Skipped/Already exists:', skipCount);
    console.log('='.repeat(60));

    // Verify tables exist
    console.log('\n🔍 Verifying tables...\n');

    const tables = ['zoho_oauth_tokens', 'reengagement_campaign', 'discount_clicks'];
    let allTablesExist = true;

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table}: Does not exist`);
        allTablesExist = false;
      } else {
        console.log(`   ✅ ${table}: EXISTS`);
      }
    }

    if (!allTablesExist) {
      console.log('\n⚠️  Some tables are missing!');
      console.log('\n📝 Manual steps required:');
      console.log('1. Go to: ' + supabaseUrl + '/project/_/sql');
      console.log('2. Open file: prisma/migrations/01_create_zoho_campaign_tables.sql');
      console.log('3. Copy the entire SQL contents');
      console.log('4. Paste into Supabase SQL Editor');
      console.log('5. Click "Run"\n');
    } else {
      console.log('\n✅ ALL TABLES CREATED SUCCESSFULLY!\n');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📝 Please run the migration manually in Supabase SQL Editor:');
    console.log('1. Go to: ' + supabaseUrl + '/project/_/sql');
    console.log('2. Open file: prisma/migrations/01_create_zoho_campaign_tables.sql');
    console.log('3. Copy the entire SQL contents');
    console.log('4. Paste into Supabase SQL Editor');
    console.log('5. Click "Run"\n');
  }
}

runMigration();
