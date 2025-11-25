#!/usr/bin/env node
/**
 * Create Brevo Email Campaign for Black Friday 2025
 * 
 * Creates a marketing campaign targeting the "Black Friday 2025" list.
 * Does NOT send automatically - requires confirmation.
 * 
 * Usage:
 *   node scripts/create-brevo-campaign.js [--preview]
 * 
 * Options:
 *   --preview    Just show the email HTML, don't create campaign
 */

require('dotenv').config({ path: '.env.local' });

// Config
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const LIST_NAME = 'Black Friday 2025';
const SENDER_EMAIL = 'info@drsebiapproved.com';
const SENDER_NAME = 'Dr. Sebi Approved';

// Parse CLI args
const args = process.argv.slice(2);
const PREVIEW_ONLY = args.includes('--preview');

if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY not found in .env.local');
  process.exit(1);
}

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
      throw new Error(`Brevo API Error ${response.status}: ${data.message || JSON.stringify(data)}`);
    }
    return data;
  } catch (e) {
    if (!response.ok) throw new Error(`Brevo API Error ${response.status}: ${text}`);
    return { success: true };
  }
}

// Email HTML template (same as Stage 1 from Zoho campaign)
function getEmailHtml() {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333;">
    
    <p style="margin: 0 0 16px 0;">{{ contact.FIRSTNAME | default: "Friend" }},</p>
    
    <p style="margin: 0 0 16px 0;">Dr. Sebi once said Maya was the greatest formula he ever created.</p>
    
    <p style="margin: 0 0 16px 0;">We still make it the same way. Same herbs. Sourced directly from Honduras - the exact region Sebi himself traveled to.</p>
    
    <p style="margin: 0 0 16px 0;">This week, it's 30% off. <strong>The lowest price we've ever offered.</strong></p>
    
    <p style="margin: 0 0 20px 0;"><strong>Use code BLACKFRIDAY30 at checkout.</strong></p>
    
    <p style="margin: 0 0 12px 0;"><strong>Here's what's on sale:</strong></p>
    
    <p style="margin: 0 0 16px 0;">
      <strong>Maya Formula - $41.99</strong> (normally $59.99) — <em>Lowest price ever!</em><br>
      Dr. Sebi's masterpiece. For energy, vitality, and overall wellness.<br>
      <a href="https://drsebiapproved.com/go/maya?utm_source=brevo&utm_medium=email&utm_campaign=blackfriday2025" style="color: #2563eb;">https://drsebiapproved.com/go/maya</a>
    </p>
    
    <p style="margin: 0 0 16px 0;">
      <strong>Sea Moss Capsules - $27.99</strong> (normally $39.99)<br>
      92 minerals your body craves. No prep, no blending.<br>
      <a href="https://drsebiapproved.com/go/seamoss?utm_source=brevo&utm_medium=email&utm_campaign=blackfriday2025" style="color: #2563eb;">https://drsebiapproved.com/go/seamoss</a>
    </p>
    
    <p style="margin: 0 0 16px 0;">
      <strong>Mucus Cleanser - $27.99</strong> (normally $39.99)<br>
      Clear the pathways. Breathe easier.<br>
      <a href="https://drsebiapproved.com/go/mucus?utm_source=brevo&utm_medium=email&utm_campaign=blackfriday2025" style="color: #2563eb;">https://drsebiapproved.com/go/mucus</a>
    </p>
    
    <p style="margin: 0 0 20px 0;">
      <strong>ParaCleanse Elite - $62.99</strong> (normally $89.99)<br>
      The deep clean. 90 capsules, 30-day protocol.<br>
      <a href="https://drsebiapproved.com/go/paracleanse?utm_source=brevo&utm_medium=email&utm_campaign=blackfriday2025" style="color: #2563eb;">https://drsebiapproved.com/go/paracleanse</a>
    </p>
    
    <p style="margin: 0 0 20px 0;">Sale ends November 30th.</p>
    
    <p style="margin: 0 0 8px 0;">- The Dr. Sebi Approved Team</p>
    
  </div>
</body>
</html>
  `.trim();
}

// Find list by name
async function findListByName(name) {
  const lists = await brevoRequest('/contacts/lists?limit=50');
  return lists.lists?.find(l => l.name === name);
}

// Create campaign
async function createCampaign(listId) {
  const campaign = await brevoRequest('/emailCampaigns', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Black Friday 2025 - Stage 1',
      subject: "Dr. Sebi's greatest formula is 30% off!",
      sender: {
        name: SENDER_NAME,
        email: SENDER_EMAIL
      },
      type: 'classic',
      htmlContent: getEmailHtml(),
      recipients: {
        listIds: [listId]
      }
    })
  });
  
  return campaign;
}

// Main
async function main() {
  console.log('\n🎄 Black Friday 2025 Campaign Creator\n');
  
  if (PREVIEW_ONLY) {
    console.log('📧 EMAIL PREVIEW:\n');
    console.log('Subject: Dr. Sebi\'s greatest formula is 30% off!');
    console.log('From:', SENDER_NAME, `<${SENDER_EMAIL}>`);
    console.log('\n--- HTML CONTENT ---\n');
    console.log(getEmailHtml());
    console.log('\n--- END ---\n');
    return;
  }
  
  // 1. Find the list
  console.log(`📋 Looking for list: "${LIST_NAME}"...`);
  const list = await findListByName(LIST_NAME);
  
  if (!list) {
    console.error(`❌ List "${LIST_NAME}" not found!`);
    console.log('   Run sync-contacts-to-brevo.js first to create the list.');
    process.exit(1);
  }
  
  console.log(`   Found! ID: ${list.id}, Contacts: ${list.uniqueSubscribers || 'unknown'}\n`);
  
  // 2. Create campaign
  console.log('📧 Creating campaign...');
  const campaign = await createCampaign(list.id);
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ CAMPAIGN CREATED');
  console.log('='.repeat(50));
  console.log(`   Campaign ID: ${campaign.id}`);
  console.log(`   Name: Black Friday 2025 - Stage 1`);
  console.log(`   Subject: Dr. Sebi's greatest formula is 30% off!`);
  console.log(`   List: ${LIST_NAME} (ID: ${list.id})`);
  console.log(`   Status: DRAFT (not sent)`);
  console.log('');
  console.log('📌 NEXT STEPS:');
  console.log('   1. Go to Brevo dashboard: https://app.brevo.com/campaigns');
  console.log('   2. Find "Black Friday 2025 - Stage 1" campaign');
  console.log('   3. Preview and test');
  console.log('   4. Schedule or send when ready');
  console.log('');
  console.log('⚠️  Campaign is in DRAFT mode - nothing has been sent yet!');
  console.log('');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
