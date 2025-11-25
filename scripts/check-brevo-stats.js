#!/usr/bin/env node
/**
 * Check Brevo Campaign Statistics
 * 
 * Usage:
 *   node scripts/check-brevo-stats.js [campaign-id]
 * 
 * If no campaign ID provided, shows list of recent campaigns.
 */

require('dotenv').config({ path: '.env.local' });

const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY not found');
  process.exit(1);
}

async function brevoRequest(endpoint) {
  const response = await fetch(`https://api.brevo.com/v3${endpoint}`, {
    headers: { 'api-key': BREVO_API_KEY }
  });
  return response.json();
}

async function listCampaigns() {
  const data = await brevoRequest('/emailCampaigns?status=sent&limit=10');
  
  console.log('\n📧 RECENT CAMPAIGNS\n');
  
  if (!data.campaigns || data.campaigns.length === 0) {
    console.log('No sent campaigns found.');
    return;
  }
  
  data.campaigns.forEach(c => {
    console.log(`ID: ${c.id} | ${c.name}`);
    console.log(`   Subject: ${c.subject}`);
    console.log(`   Sent: ${new Date(c.sentDate).toLocaleString()}`);
    console.log('');
  });
  
  console.log('Run with campaign ID for detailed stats:');
  console.log('  node scripts/check-brevo-stats.js 6\n');
}

async function getCampaignStats(campaignId) {
  const campaign = await brevoRequest(`/emailCampaigns/${campaignId}`);
  
  if (campaign.code === 'document_not_found') {
    console.error(`❌ Campaign ${campaignId} not found`);
    process.exit(1);
  }
  
  const stats = campaign.statistics?.globalStats || {};
  const sent = stats.sent || 0;
  const delivered = stats.delivered || 0;
  const opens = stats.uniqueOpens || 0;
  const clicks = stats.uniqueClicks || 0;
  const bounces = stats.hardBounces + stats.softBounces || 0;
  const unsubs = stats.unsubscriptions || 0;
  
  const openRate = sent > 0 ? ((opens / sent) * 100).toFixed(1) : 0;
  const clickRate = sent > 0 ? ((clicks / sent) * 100).toFixed(1) : 0;
  const bounceRate = sent > 0 ? ((bounces / sent) * 100).toFixed(1) : 0;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 CAMPAIGN STATS: ${campaign.name}`);
  console.log('='.repeat(50));
  console.log(`   Subject: ${campaign.subject}`);
  console.log(`   Status: ${campaign.status}`);
  if (campaign.sentDate) {
    console.log(`   Sent: ${new Date(campaign.sentDate).toLocaleString()}`);
  }
  console.log('');
  console.log('📈 DELIVERY');
  console.log(`   Sent:      ${sent}`);
  console.log(`   Delivered: ${delivered}`);
  console.log(`   Bounced:   ${bounces} (${bounceRate}%)`);
  console.log('');
  console.log('👀 ENGAGEMENT');
  console.log(`   Opens:     ${opens} (${openRate}%)`);
  console.log(`   Clicks:    ${clicks} (${clickRate}%)`);
  console.log(`   Unsubs:    ${unsubs}`);
  console.log('');
  
  if (campaign.status === 'queued' || campaign.status === 'in_process') {
    console.log('⏳ Campaign is still sending... check back in a few minutes.\n');
  }
}

// Main
const campaignId = process.argv[2];

if (campaignId) {
  getCampaignStats(campaignId);
} else {
  listCampaigns();
}
