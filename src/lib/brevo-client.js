/**
 * Brevo API Client - Core wrapper for all Brevo operations
 * Enables Claude to manage email marketing through natural language
 */

class BrevoAPIError extends Error {
  constructor(status, response) {
    super(`Brevo API Error: ${status} - ${response.message || 'Unknown error'}`);
    this.status = status;
    this.response = response;
  }
}

class RateLimiter {
  constructor(tokensPerInterval = 100, interval = 3600000) { // 100/hour default
    this.tokens = tokensPerInterval;
    this.maxTokens = tokensPerInterval;
    this.interval = interval;
    this.lastRefill = Date.now();
  }

  async removeTokens(count = 1) {
    this.refillTokens();
    
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    
    // Wait and retry if rate limited
    const waitTime = (count - this.tokens) * (this.interval / this.maxTokens);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    this.refillTokens();
    this.tokens -= count;
    return true;
  }

  refillTokens() {
    const now = Date.now();
    const tokensToAdd = Math.floor((now - this.lastRefill) / this.interval * this.maxTokens);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }
}

export class BrevoClient {
  constructor(apiKey = process.env.BREVO_API_KEY) {
    if (!apiKey) {
      throw new Error('Brevo API key is required');
    }
    
    this.apiKey = apiKey;
    this.baseURL = 'https://api.brevo.com/v3';
    
    // Rate limiters for different endpoint types
    this.rateLimiters = {
      general: new RateLimiter(100, 3600000), // 100/hour
      contacts: new RateLimiter(36000, 3600000), // 10/second
      transactional: new RateLimiter(3600000, 3600000) // 1000/second
    };
  }

  /**
   * Core API request method with rate limiting and error handling
   */
  async request(endpoint, options = {}, rateLimitType = 'general') {
    await this.rateLimiters[rateLimitType].removeTokens(1);
    
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new BrevoAPIError(response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof BrevoAPIError) {
        throw error;
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  // ========================================
  // CONTACT MANAGEMENT
  // ========================================

  /**
   * Add or update a contact
   */
  async addContact(contactData) {
    return await this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email: contactData.email,
        attributes: contactData.attributes || {},
        listIds: contactData.listIds || [],
        updateEnabled: contactData.updateEnabled !== false
      })
    }, 'contacts');
  }

  /**
   * Get contact information
   */
  async getContact(identifier) {
    return await this.request(`/contacts/${encodeURIComponent(identifier)}`, {}, 'contacts');
  }

  /**
   * Update contact information
   */
  async updateContact(identifier, updateData) {
    return await this.request(`/contacts/${encodeURIComponent(identifier)}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }, 'contacts');
  }

  /**
   * Delete a contact
   */
  async deleteContact(identifier) {
    return await this.request(`/contacts/${encodeURIComponent(identifier)}`, {
      method: 'DELETE'
    }, 'contacts');
  }

  // ========================================
  // LIST MANAGEMENT
  // ========================================

  /**
   * Get folders first to find default folder
   */
  async getFolders() {
    return await this.request('/contacts/folders');
  }

  /**
   * Create a new list (requires folder ID)
   */
  async createList(name, folderId = null) {
    // If no folderId provided, get the first available folder
    if (!folderId) {
      try {
        const folders = await this.getFolders();
        if (folders.folders && folders.folders.length > 0) {
          folderId = folders.folders[0].id;
        } else {
          // Create a default folder if none exists
          const defaultFolder = await this.createFolder('Email Lists');
          folderId = defaultFolder.id;
        }
      } catch (error) {
        // If we can't get/create folders, try without folder (some accounts may not need it)
        console.warn('Could not get/create folder for list, trying without folder:', error.message);
      }
    }

    const body = { name };
    if (folderId) body.folderId = folderId;

    return await this.request('/contacts/lists', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * Create a folder
   */
  async createFolder(name) {
    return await this.request('/contacts/folders', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }

  /**
   * Get all lists
   */
  async getLists(limit = 50, offset = 0) {
    return await this.request(`/contacts/lists?limit=${limit}&offset=${offset}`);
  }

  /**
   * Get list by name
   */
  async getListByName(name) {
    const lists = await this.getLists();
    return lists.lists.find(list => list.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Find or create a list
   */
  async findOrCreateList(name, folderId = null) {
    const existingList = await this.getListByName(name);
    if (existingList) {
      return existingList;
    }
    return await this.createList(name, folderId);
  }

  /**
   * Add contacts to a list
   */
  async addContactsToList(listId, emails) {
    return await this.request(`/contacts/lists/${listId}/contacts/add`, {
      method: 'POST',
      body: JSON.stringify({ emails })
    });
  }

  /**
   * Get contacts in a list
   */
  async getListContacts(listId, limit = 50, offset = 0) {
    return await this.request(`/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`);
  }

  // ========================================
  // SEGMENT MANAGEMENT
  // ========================================

  /**
   * Create a segment
   */
  async createSegment(name, queryString, categoryId = null) {
    const body = { name, queryString };
    if (categoryId) body.categoryId = categoryId;

    return await this.request('/contacts/segments', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * Get all segments
   */
  async getSegments() {
    return await this.request('/contacts/segments');
  }

  // ========================================
  // CAMPAIGN MANAGEMENT
  // ========================================

  /**
   * Create an email campaign
   */
  async createEmailCampaign(campaignData) {
    return await this.request('/emailCampaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  /**
   * Get all campaigns
   */
  async getCampaigns(type = 'classic', status = 'sent', limit = 50, offset = 0) {
    return await this.request(`/emailCampaigns?type=${type}&status=${status}&limit=${limit}&offset=${offset}`);
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStats(campaignId) {
    return await this.request(`/emailCampaigns/${campaignId}/statistics`);
  }

  /**
   * Send campaign immediately
   */
  async sendCampaign(campaignId) {
    return await this.request(`/emailCampaigns/${campaignId}/sendNow`, {
      method: 'POST'
    });
  }

  // ========================================
  // TRANSACTIONAL EMAILS
  // ========================================

  /**
   * Send transactional email
   */
  async sendTransactionalEmail(emailData) {
    return await this.request('/smtp/email', {
      method: 'POST',
      body: JSON.stringify(emailData)
    }, 'transactional');
  }

  /**
   * Send email using template
   */
  async sendTemplatedEmail(templateId, to, params = {}) {
    return await this.sendTransactionalEmail({
      templateId,
      to: Array.isArray(to) ? to : [{ email: to }],
      params
    });
  }

  // ========================================
  // AUTOMATION WORKFLOWS
  // ========================================

  /**
   * Create marketing automation
   */
  async createAutomation(automationData) {
    return await this.request('/marketing/automation', {
      method: 'POST',
      body: JSON.stringify(automationData)
    });
  }

  /**
   * Get all automations
   */
  async getAutomations() {
    return await this.request('/marketing/automation');
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Build segment query string from criteria
   */
  buildSegmentQuery(criteria) {
    // Convert natural language criteria to Brevo query format
    const queryParts = [];
    
    if (criteria.emailOpened) {
      queryParts.push(`EMAIL_OPENED[Campaign] >= ${criteria.emailOpened}`);
    }
    
    if (criteria.emailClicked) {
      queryParts.push(`EMAIL_CLICKED[Campaign] >= ${criteria.emailClicked}`);
    }
    
    if (criteria.pageVisited) {
      queryParts.push(`PAGE_VISITED["${criteria.pageVisited}"] exists`);
    }
    
    if (criteria.noActivityDays) {
      queryParts.push(`LAST_ACTIVITY < "${criteria.noActivityDays} days ago"`);
    }

    return queryParts.join(' AND ');
  }

  /**
   * Get account information
   */
  async getAccount() {
    return await this.request('/account');
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      await this.getAccount();
      return { success: true, message: 'Brevo API connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

// Export singleton instance
const brevoClient = new BrevoClient();
export default brevoClient;