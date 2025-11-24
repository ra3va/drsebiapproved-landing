/**
 * Cleanup Test Emails - Remove Fake Addresses
 * Keeps only real email addresses to protect spam rating
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupTestEmails() {
  try {
    console.log('\n🧹 Cleaning up test email addresses...\n');

    // Step 1: Show current state
    const { data: before, error: beforeError } = await supabase
      .from('reengagement_campaign')
      .select('customer_email, status');

    if (beforeError) {
      throw new Error(`Failed to fetch current data: ${beforeError.message}`);
    }

    console.log('📋 Current emails in database:');
    before.forEach(row => {
      console.log(`   ${row.status.padEnd(10)} ${row.customer_email}`);
    });

    // Step 2: Delete all test@example.com addresses
    console.log('\n🗑️  Deleting test@example.com addresses...');

    const { error: deleteError } = await supabase
      .from('reengagement_campaign')
      .delete()
      .like('customer_email', '%@example.com');

    if (deleteError) {
      throw new Error(`Failed to delete test emails: ${deleteError.message}`);
    }

    console.log('✅ Test emails deleted');

    // Step 3: Ensure Ra's email exists and is pending
    console.log('\n✅ Ensuring kingthriva@gmail.com is ready...');

    const { data: raEmail, error: raError } = await supabase
      .from('reengagement_campaign')
      .upsert({
        customer_email: 'kingthriva@gmail.com',
        customer_name: 'Ra Thriva',
        status: 'pending',
        batch_number: 1,
      }, {
        onConflict: 'customer_email'
      })
      .select();

    if (raError) {
      throw new Error(`Failed to add Ra's email: ${raError.message}`);
    }

    // Step 4: Show final state
    const { data: after, error: afterError } = await supabase
      .from('reengagement_campaign')
      .select('customer_email, customer_name, status, batch_number')
      .order('batch_number');

    if (afterError) {
      throw new Error(`Failed to fetch final data: ${afterError.message}`);
    }

    console.log('\n✅ Cleanup complete! Final database state:');
    console.log('='.repeat(60));
    after.forEach(row => {
      console.log(`   ${row.status.padEnd(10)} ${row.customer_email} (${row.customer_name || 'No name'}) [Batch ${row.batch_number || 'N/A'}]`);
    });
    console.log('='.repeat(60));
    console.log(`\n📊 Total emails: ${after.length}`);
    console.log('🎯 Safe to send - no fake addresses!\n');

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

cleanupTestEmails();
