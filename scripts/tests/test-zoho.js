/**
 * Zoho Configuration Test Script
 * Verifies Zoho credentials and generates authorization URL
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Testing Zoho Configuration...\n');

const config = {
  clientId: process.env.ZOHO_CLIENT_ID,
  clientSecret: process.env.ZOHO_CLIENT_SECRET,
  redirectUri: process.env.ZOHO_REDIRECT_URI,
  email: process.env.ZOHO_EMAIL,
  accountsBaseUrl: process.env.ZOHO_ACCOUNTS_BASE_URL || 'https://accounts.zoho.com',
  apiBaseUrl: process.env.ZOHO_API_BASE_URL || 'https://mail.zoho.com/api',
};

console.log('Configuration Check:');
console.log('='.repeat(60));
console.log('✓ Client ID:', config.clientId ? `${config.clientId.substring(0, 20)}...` : '❌ MISSING');
console.log('✓ Client Secret:', config.clientSecret ? `${config.clientSecret.substring(0, 20)}...` : '❌ MISSING');
console.log('✓ Redirect URI:', config.redirectUri || '❌ MISSING');
console.log('✓ Email:', config.email || '❌ MISSING');
console.log('✓ Accounts URL:', config.accountsBaseUrl);
console.log('✓ API URL:', config.apiBaseUrl);
console.log('='.repeat(60));

// Check if all required fields are present
const missingFields = [];
if (!config.clientId) missingFields.push('ZOHO_CLIENT_ID');
if (!config.clientSecret) missingFields.push('ZOHO_CLIENT_SECRET');
if (!config.redirectUri) missingFields.push('ZOHO_REDIRECT_URI');
if (!config.email) missingFields.push('ZOHO_EMAIL');

if (missingFields.length > 0) {
  console.log('\n❌ Missing required environment variables:');
  missingFields.forEach(field => console.log(`   - ${field}`));
  console.log('\nPlease add these to your .env.local file\n');
  process.exit(1);
}

// Generate authorization URLs for both production and local
const scopes = 'ZohoMail.messages.CREATE,ZohoMail.accounts.READ';

// Production URL
const prodParams = new URLSearchParams({
  scope: scopes,
  client_id: config.clientId,
  response_type: 'code',
  access_type: 'offline',
  redirect_uri: config.redirectUri,
});
const prodAuthUrl = `${config.accountsBaseUrl}/oauth/v2/auth?${prodParams.toString()}`;

// Local URL (for testing)
const localRedirectUri = 'http://localhost:3000/api/auth/zoho/callback';
const localParams = new URLSearchParams({
  scope: scopes,
  client_id: config.clientId,
  response_type: 'code',
  access_type: 'offline',
  redirect_uri: localRedirectUri,
});
const localAuthUrl = `${config.accountsBaseUrl}/oauth/v2/auth?${localParams.toString()}`;

console.log('\n✅ Zoho is configured correctly!\n');
console.log('📝 Choose your authorization method:\n');

console.log('🏠 FOR LOCAL TESTING (recommended for first test):');
console.log('='.repeat(60));
console.log(localAuthUrl);
console.log('='.repeat(60));
console.log('\n1. Start dev server: npm run dev');
console.log('2. Open the URL above in your browser');
console.log('3. Login to Zoho with: ' + config.email);
console.log('4. You\'ll be redirected to: http://localhost:3000/api/auth/zoho/callback');
console.log('5. Tokens will be stored in Supabase\n');

console.log('\n🌍 FOR PRODUCTION:');
console.log('='.repeat(60));
console.log(prodAuthUrl);
console.log('='.repeat(60));
console.log('\n1. Make sure app is deployed to: drsebiapproved.com');
console.log('2. Open the URL above in your browser');
console.log('3. You\'ll be redirected to: ' + config.redirectUri + '\n');

console.log('\n💡 TIP: Use the LOCAL url for testing first!\n');
