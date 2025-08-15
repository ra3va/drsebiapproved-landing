/**
 * Setup Brevo Organization API Endpoint
 * Creates strategic folder and list structure
 */

import brevoClient from '../../../src/lib/brevo-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🚀 Setting up Brevo organization structure...');

  try {
    // Step 1: Create Folder Structure
    const folders = [
      'Lead Magnets',
      'Sales Funnels', 
      'Customers',
      'Behavioral Segments',
      'Blog & Content'
    ];

    const createdFolders = {};
    
    for (const folderName of folders) {
      try {
        const folder = await brevoClient.createFolder(folderName);
        createdFolders[folderName] = folder.id;
        console.log(`✅ Created folder: "${folderName}" (ID: ${folder.id})`);
      } catch (error) {
        if (error.response?.code === 'duplicate_parameter') {
          console.log(`⚠️  Folder "${folderName}" already exists`);
          // Get existing folders to find ID
          const existingFolders = await brevoClient.getFolders();
          const existingFolder = existingFolders.folders.find(f => f.name === folderName);
          if (existingFolder) {
            createdFolders[folderName] = existingFolder.id;
          }
        } else {
          console.error(`❌ Failed to create folder "${folderName}": ${error.message}`);
        }
      }
    }

    // Step 2: Create Strategic Lists
    const lists = [
      // Lead Magnets
      { name: 'Gut Health Guide Downloads', folder: 'Lead Magnets' },
      { name: 'Quiz Completers', folder: 'Lead Magnets' },
      
      // Sales Funnels
      { name: 'Product Page Visitors', folder: 'Sales Funnels' },
      { name: 'Cart Abandoners', folder: 'Sales Funnels' },
      { name: 'High-Intent Prospects', folder: 'Sales Funnels' },
      
      // Customers
      { name: 'ParaCleanse Buyers', folder: 'Customers' },
      { name: 'Repeat Customers', folder: 'Customers' },
      { name: 'VIP Customers', folder: 'Customers' },
      
      // Behavioral Segments
      { name: 'Highly Engaged', folder: 'Behavioral Segments' },
      { name: 'At-Risk Subscribers', folder: 'Behavioral Segments' },
      { name: 'Blog Power Readers', folder: 'Behavioral Segments' },
      
      // Blog & Content
      { name: 'Blog Subscribers', folder: 'Blog & Content' },
      { name: 'Newsletter Subscribers', folder: 'Blog & Content' }
    ];

    const createdLists = [];

    for (const list of lists) {
      try {
        const folderId = createdFolders[list.folder];
        if (!folderId) {
          console.log(`⚠️  Skipping "${list.name}" - folder not found`);
          continue;
        }

        const newList = await brevoClient.createList(list.name, folderId);
        createdLists.push({
          name: list.name,
          id: newList.id,
          folder: list.folder
        });
        console.log(`✅ Created list: "${list.name}" in "${list.folder}"`);
      } catch (error) {
        if (error.response?.code === 'duplicate_parameter') {
          console.log(`⚠️  List "${list.name}" already exists`);
        } else {
          console.error(`❌ Failed to create list "${list.name}": ${error.message}`);
        }
      }
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Brevo organization setup completed',
      data: {
        foldersCreated: Object.keys(createdFolders).length,
        listsCreated: createdLists.length,
        folders: createdFolders,
        lists: createdLists
      }
    });

  } catch (error) {
    console.error('Setup failed:', error);
    res.status(500).json({
      success: false,
      error: 'Organization setup failed',
      message: error.message
    });
  }
}