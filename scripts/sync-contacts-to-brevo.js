#!/usr/bin/env node
/**
 * Sync Contacts from Supabase to Brevo
 * 
 * Uploads pending contacts from reengagement_campaign table to a Brevo list
 * for Black Friday 2025 campaign.
 * 
 * Usage:
 *   node scripts/sync-contacts-to-brevo.js [--dry-run] [--limit=100]
 * 
 * Options:
 *   --dry-run    Preview what would be uploaded without making changes
 *   --limit=N    Only process N contacts (for testing)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Config
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LIST_NAME = 'Black Friday 2025';
const RATE_LIMIT_DELAY = 150; // ms between contacts (safe for 10/sec limit)

// Parse CLI args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1]) : null;

// Validate env
if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY not found in .env.local');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Brevo API helper
async function brevoRequest(endpoint, options = {}) {
  const url = `https://api.brevo.com/v3${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  
  const text = await response.text();
  if (!text) return { success: true, status: response.status };
  
  try {
    const data = JSON.parse(text);
    if (!response.ok) {
      throw new Error(`Brevo API Error ${response.status}: ${data.message || text}`);
    }
    return data;
  } catch (e) {
    if (!response.ok) throw new Error(`Brevo API Error ${response.status}: ${text}`);
    return { success: true };
  }
}

// Get or create list
async function getOrCreateList(name) {
  // Check existing lists
  const lists = await brevoRequest('/contacts/lists?limit=50');
  const existing = lists.lists?.find(l => l.name === name);
  if (existing) {
    console.log(`📋 Found existing list: "${name}" (ID: ${existing.id})`);
    return existing.id;
  }
  
  // Get default folder
  const folders = await brevoRequest('/contacts/folders');
  const folderId = folders.folders?.[0]?.id;
  
  // Create new list
  const newList = await brevoRequest('/contacts/lists', {
    method: 'POST',
    body: JSON.stringify({ name, folderId })
  });
  
  console.log(`✅ Created new list: "${name}" (ID: ${newList.id})`);
  return newList.id;
}

// Add single contact to Brevo
async function addContact(email, name, listId) {
  const firstName = name?.split(' ')[0] || '';
  const lastName = name?.split(' ').slice(1).join(' ') || '';
  
  return brevoRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        SOURCE: 'black-friday-2025',
        CUSTOMER_TYPE: 'returning'
      },
      listIds: [listId],
      updateEnabled: true // Update if exists
    })
  });
}

// Main sync function
async function syncContacts() {
  console.log('\n🚀 Starting Brevo Sync');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  if (LIMIT) console.log(`   Limit: ${LIMIT} contacts`);
  console.log('');
  
  // 1. Get or create list
  let listId;
  if (!DRY_RUN) {
    listId = await getOrCreateList(LIST_NAME);
  } else {
    console.log(`📋 [DRY RUN] Would create/find list: "${LIST_NAME}"`);
    listId = 'dry-run-list-id';
  }
  
  // 2. Fetch pending contacts from Supabase
  let query = supabase
    .from('reengagement_campaign')
    .select('id, customer_email, customer_name, status')
    .eq('status', 'pending')
    .order('id', { ascending: true });
  
  if (LIMIT) {
    query = query.limit(LIMIT);
  }
  
  const { data: contacts, error } = await query;
  
  if (error) {
    console.error('❌ Supabase query failed:', error.message);
    process.exit(1);
  }
  
  console.log(`📊 Found ${contacts.length} pending contacts to sync\n`);
  
  if (contacts.length === 0) {
    console.log('✅ No contacts to sync. Done!');
    return;
  }
  
  // 3. Upload contacts
  const results = { success: 0, failed: 0, errors: [] };
  const syncedIds = [];
  
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const progress = `[${i + 1}/${contacts.length}]`;
    
    try {
      if (!DRY_RUN) {
        await addContact(contact.customer_email, contact.customer_name, listId);
        
        // Update Supabase immediately (not at end)
        await supabase
          .from('reengagement_campaign')
          .update({ status: 'sent', brevo_synced_at: new Date().toISOString() })
          .eq('id', contact.id);
      }
      
      console.log(`${progress} ✅ ${contact.customer_email}`);
      results.success++;
      
      // Rate limit delay
      if (!DRY_RUN && i < contacts.length - 1) {
        await new Promise(r => setTimeout(r, RATE_LIMIT_DELAY));
      }
      
    } catch (err) {
      console.log(`${progress} ❌ ${contact.customer_email}: ${err.message}`);
      results.failed++;
      results.errors.push({ email: contact.customer_email, error: err.message });
    }
  }
  
  // 4. Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SYNC COMPLETE');
  console.log('='.repeat(50));
  console.log(`   ✅ Success: ${results.success}`);
  console.log(`   ❌ Failed:  ${results.failed}`);
  console.log(`   📋 List:    ${LIST_NAME} (ID: ${listId})`);
  if (DRY_RUN) {
    console.log('\n   ⚠️  DRY RUN - No changes were made');
  }
  console.log('');
}

// Run
syncContacts().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
