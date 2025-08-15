/**
 * Check Brevo Organization Status
 * Verify folder and list structure
 */

import brevoClient from '../../../src/lib/brevo-client.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Checking Brevo organization status...');

    // Get all folders
    const folders = await brevoClient.getFolders();
    console.log('📁 Folders found:', folders.folders?.length || 0);

    // Get all lists (limit 50 for free account)
    const lists = await brevoClient.getLists(50);
    console.log('📋 Lists found:', lists.lists?.length || 0);

    // Organize data
    const folderMap = {};
    if (folders.folders) {
      folders.folders.forEach(folder => {
        folderMap[folder.id] = folder.name;
      });
    }

    const listsWithFolders = lists.lists?.map(list => ({
      id: list.id,
      name: list.name,
      folder: folderMap[list.folderId] || 'No folder assigned',
      folderId: list.folderId,
      contacts: list.totalSubscribers || 0
    })) || [];

    // Group by folder
    const organized = {};
    listsWithFolders.forEach(list => {
      const folderName = list.folder;
      if (!organized[folderName]) {
        organized[folderName] = [];
      }
      organized[folderName].push(list);
    });

    res.status(200).json({
      success: true,
      data: {
        folders: folders.folders || [],
        lists: listsWithFolders,
        organized,
        summary: {
          totalFolders: folders.folders?.length || 0,
          totalLists: lists.lists?.length || 0,
          listsWithoutFolder: listsWithFolders.filter(l => l.folder === 'No folder assigned').length
        }
      }
    });

  } catch (error) {
    console.error('Check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check organization',
      message: error.message
    });
  }
}