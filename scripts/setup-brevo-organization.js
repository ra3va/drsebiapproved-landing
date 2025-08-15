/**
 * Setup Brevo Folder and List Organization
 * Creates strategic folder structure for ParaCleanse Elite business
 */

import brevoClient from '../src/lib/brevo-client.js';

async function setupBrevoOrganization() {
  console.log('🚀 Setting up Brevo folder and list organization...\n');

  try {
    // Step 1: Create Folder Structure
    console.log('📁 Creating folder structure...');
    
    const folders = [
      { name: 'Lead Magnets', description: 'Free content downloads and opt-ins' },
      { name: 'Sales Funnels', description: 'Product interest and purchase intent' },
      { name: 'Customers', description: 'Purchasers and repeat buyers' },
      { name: 'Behavioral Segments', description: 'Engagement and activity-based groups' },
      { name: 'Blog & Content', description: 'Content engagement and education' }
    ];

    const createdFolders = {};
    
    for (const folder of folders) {
      try {
        const newFolder = await brevoClient.createFolder(folder.name);
        createdFolders[folder.name] = newFolder.id;
        console.log(`✅ Created folder: "${folder.name}" (ID: ${newFolder.id})`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
      } catch (error) {
        if (error.message.includes('already exists') || error.response?.code === 'duplicate_parameter') {
          console.log(`⚠️  Folder "${folder.name}" already exists`);
          // Get existing folder ID
          const existingFolders = await brevoClient.getFolders();
          const existingFolder = existingFolders.folders.find(f => f.name === folder.name);
          if (existingFolder) {
            createdFolders[folder.name] = existingFolder.id;
          }
        } else {
          console.error(`❌ Failed to create folder "${folder.name}": ${error.message}`);
        }
      }
    }

    // Step 2: Create Strategic Lists
    console.log('\n📋 Creating strategic lists...');
    
    const lists = [
      // Lead Magnets Folder
      { name: 'Gut Health Guide Downloads', folder: 'Lead Magnets', description: 'Users who downloaded gut health guide' },
      { name: 'Quiz Completers', folder: 'Lead Magnets', description: 'Completed health assessment quiz' },
      { name: 'Recipe Guide Downloads', folder: 'Lead Magnets', description: 'Downloaded Dr. Sebi recipes' },
      
      // Sales Funnels Folder  
      { name: 'Product Page Visitors', folder: 'Sales Funnels', description: 'Visited ParaCleanse product page' },
      { name: 'Cart Abandoners', folder: 'Sales Funnels', description: 'Added to cart but didn\'t complete purchase' },
      { name: 'High-Intent Prospects', folder: 'Sales Funnels', description: 'Multiple product page visits + email engagement' },
      { name: 'Price Shoppers', folder: 'Sales Funnels', description: 'Clicked pricing links multiple times' },
      
      // Customers Folder
      { name: 'ParaCleanse Buyers', folder: 'Customers', description: 'Purchased ParaCleanse Elite package' },
      { name: 'Repeat Customers', folder: 'Customers', description: 'Made multiple purchases' },
      { name: 'VIP Customers', folder: 'Customers', description: 'High-value customers ($500+)' },
      { name: 'Referral Partners', folder: 'Customers', description: 'Customers who refer others' },
      
      // Behavioral Segments Folder
      { name: 'Highly Engaged', folder: 'Behavioral Segments', description: 'Opened 5+ emails in last 30 days' },
      { name: 'Moderately Engaged', folder: 'Behavioral Segments', description: 'Opened 2-4 emails in last 30 days' },
      { name: 'At-Risk Subscribers', folder: 'Behavioral Segments', description: 'No email opens in 30+ days' },
      { name: 'Blog Power Readers', folder: 'Behavioral Segments', description: 'Visited 3+ blog posts' },
      
      // Blog & Content Folder
      { name: 'Blog Subscribers', folder: 'Blog & Content', description: 'Subscribed via blog content' },
      { name: 'Newsletter Subscribers', folder: 'Blog & Content', description: 'Weekly newsletter subscribers' },
      { name: 'Video Watchers', folder: 'Blog & Content', description: 'Engaged with video content' }
    ];

    const createdLists = [];

    for (const list of lists) {
      try {
        const folderId = createdFolders[list.folder];
        if (!folderId) {
          console.log(`⚠️  Skipping "${list.name}" - folder "${list.folder}" not found`);
          continue;
        }

        const newList = await brevoClient.createList(list.name, folderId);
        createdLists.push({
          name: list.name,
          id: newList.id,
          folder: list.folder,
          description: list.description
        });
        console.log(`✅ Created list: "${list.name}" in "${list.folder}" folder (ID: ${newList.id})`);
        await new Promise(resolve => setTimeout(resolve, 300)); // Rate limiting
      } catch (error) {
        if (error.message.includes('already exists') || error.response?.code === 'duplicate_parameter') {
          console.log(`⚠️  List "${list.name}" already exists`);
        } else {
          console.error(`❌ Failed to create list "${list.name}": ${error.message}`);
        }
      }
    }

    // Step 3: Move existing "Gut Health Leads" to Lead Magnets folder if needed
    console.log('\n🔄 Organizing existing lists...');
    
    try {
      const existingList = await brevoClient.getListByName('Gut Health Leads');
      if (existingList) {
        console.log(`📋 Found existing "Gut Health Leads" list (ID: ${existingList.id})`);
        // Note: Brevo API doesn't allow moving lists between folders after creation
        // We'll rename this list to be more specific and create new organized structure
        console.log('ℹ️  Existing list will remain in current folder - new downloads will use organized structure');
      }
    } catch (error) {
      console.log('ℹ️  No existing "Gut Health Leads" list found');
    }

    // Step 4: Summary Report
    console.log('\n📊 ORGANIZATION SETUP COMPLETE!\n');
    console.log('📁 FOLDERS CREATED:');
    Object.entries(createdFolders).forEach(([name, id]) => {
      console.log(`   ${name} (ID: ${id})`);
    });
    
    console.log('\n📋 LISTS CREATED:');
    createdLists.forEach(list => {
      console.log(`   📁 ${list.folder} → 📋 ${list.name} (ID: ${list.id})`);
    });

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Update lead magnet to use "Gut Health Guide Downloads" list');
    console.log('2. Set up behavioral automation to move contacts between lists');
    console.log('3. Create targeted campaigns for each audience segment');
    console.log('4. Set up cart abandonment tracking → "Cart Abandoners" list');
    console.log('5. Configure purchase webhooks → "ParaCleanse Buyers" list');

    return {
      success: true,
      folders: createdFolders,
      lists: createdLists
    };

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the setup
setupBrevoOrganization().then(result => {
  if (result.success) {
    console.log('\n🎉 Brevo organization setup completed successfully!');
    process.exit(0);
  } else {
    console.error('\n💥 Setup failed:', result.error);
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});