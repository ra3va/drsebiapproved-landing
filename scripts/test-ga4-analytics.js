#!/usr/bin/env node

/**
 * Test Claude GA4 Control System
 * 
 * Tests the natural language analytics interface
 */

require('dotenv').config({ path: '.env.local' });

const testCommands = [
  'show newsletter conversions last 7 days',
  'get traffic sources this month', 
  'real-time users right now',
  'list all conversion goals',
  'show account summary',
  'audience demographics last 30 days'
];

async function testClaudeGA4() {
  console.log('🤖 Testing Claude GA4 Control System...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  for (const command of testCommands) {
    console.log(`\n📋 Testing: "${command}"`);
    console.log('─'.repeat(50));
    
    try {
      const response = await fetch(`${baseUrl}/api/analytics/claude`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command })
      });
      
      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
        continue;
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Intent: ${result.intent}`);
        console.log(`📊 Message: ${result.message}`);
        
        if (result.insights) {
          console.log('💡 Insights:');
          result.insights.forEach(insight => {
            console.log(`   • ${insight}`);
          });
        }
        
        if (result.data) {
          console.log('📈 Data sample:', JSON.stringify(result.data, null, 2).slice(0, 200) + '...');
        }
      } else {
        console.log(`❌ Failed: ${result.message}`);
      }
      
    } catch (error) {
      console.error(`💥 Error: ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Claude GA4 testing complete!');
}

// Test API documentation endpoint
async function testDocumentation() {
  console.log('\n📚 Testing API Documentation...');
  
  try {
    const response = await fetch('http://localhost:3000/api/analytics/claude');
    const docs = await response.json();
    
    console.log('✅ Documentation loaded:');
    console.log(`   • Name: ${docs.name}`);
    console.log(`   • Version: ${docs.version}`);
    console.log(`   • Examples: ${Object.keys(docs.examples).length} categories`);
    
  } catch (error) {
    console.error('❌ Documentation test failed:', error.message);
  }
}

// Run tests
if (require.main === module) {
  testDocumentation()
    .then(() => testClaudeGA4())
    .catch(error => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { testClaudeGA4, testDocumentation };