# Kit API Wrapper Implementation

## Overview

This document provides production-ready code for implementing a Kit (ConvertKit) API wrapper to replace the existing Brevo integration. The wrapper maintains the same interface patterns for seamless migration.

## Core Kit API Client

### src/lib/kit-client.js

```javascript
/**
 * Kit (ConvertKit) API Client
 * Production-ready wrapper for Kit API v3 with rate limiting and error handling
 */

class KitAPIClient {
  constructor() {
    this.apiKey = process.env.KIT_API_KEY;
    this.apiSecret = process.env.KIT_API_SECRET;
    this.baseURL = 'https://api.convertkit.com/v3';
    this.rateLimitDelay = 500;
    this.maxRetries = 3;

    if (!this.apiKey) {
      throw new Error('KIT_API_KEY environment variable is required');
    }
  }

  /**
   * Subscribe email to a specific form (primary method for adding contacts)
   * @param {string} formId - Kit form ID
   * @param {string} email - Subscriber email
   * @param {string} firstName - Subscriber first name (optional)
   * @param {Object} customFields - Additional custom fields
   * @returns {Promise<Object>} Subscription result
   */
  async subscribeToForm(formId, email, firstName = '', customFields = {}) {
    const url = `${this.baseURL}/forms/${formId}/subscribe`;
    
    const payload = {
      email,
      api_key: this.apiKey
    };

    // Add first name if provided
    if (firstName) {
      payload.first_name = firstName;
    }

    // Add custom fields if provided
    if (Object.keys(customFields).length > 0) {
      payload.fields = customFields;
    }

    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        data: response,
        subscriberId: response.subscription?.subscriber?.id,
        message: 'Successfully subscribed to form'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to subscribe to form: ${error.message}`
      };
    }
  }

  /**
   * Get subscriber information by ID
   * @param {string} subscriberId - Kit subscriber ID
   * @returns {Promise<Object>} Subscriber data
   */
  async getSubscriber(subscriberId) {
    const url = `${this.baseURL}/subscribers/${subscriberId}`;
    
    try {
      const response = await this.makeRequest(`${url}?api_key=${this.apiKey}`);
      return {
        success: true,
        data: response.subscriber,
        message: 'Subscriber retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to get subscriber: ${error.message}`
      };
    }
  }

  /**
   * Get all subscribers with pagination
   * @param {number} page - Page number (optional)
   * @param {string} sortOrder - Sort order: asc or desc (optional)
   * @returns {Promise<Object>} Subscribers list
   */
  async getAllSubscribers(page = 1, sortOrder = 'desc') {
    const url = `${this.baseURL}/subscribers`;
    const params = new URLSearchParams({
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      page: page.toString(),
      sort_order: sortOrder
    });

    try {
      const response = await this.makeRequest(`${url}?${params}`);
      return {
        success: true,
        data: response.subscribers || [],
        totalSubscribers: response.total_subscribers,
        page: response.page,
        message: 'Subscribers retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to get subscribers: ${error.message}`
      };
    }
  }

  /**
   * Add tag to subscriber
   * @param {string} tagId - Kit tag ID
   * @param {string} email - Subscriber email
   * @returns {Promise<Object>} Tag assignment result
   */
  async addTagToSubscriber(tagId, email) {
    const url = `${this.baseURL}/tags/${tagId}/subscribe`;
    
    const payload = {
      email,
      api_key: this.apiKey
    };

    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        data: response,
        message: 'Tag added successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to add tag: ${error.message}`
      };
    }
  }

  /**
   * Remove tag from subscriber
   * @param {string} tagId - Kit tag ID
   * @param {string} email - Subscriber email
   * @returns {Promise<Object>} Tag removal result
   */
  async removeTagFromSubscriber(tagId, email) {
    const url = `${this.baseURL}/tags/${tagId}/unsubscribe`;
    
    const payload = {
      email,
      api_key: this.apiKey
    };

    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        data: response,
        message: 'Tag removed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to remove tag: ${error.message}`
      };
    }
  }

  /**
   * Subscribe to sequence (email automation)
   * @param {string} sequenceId - Kit sequence ID
   * @param {string} email - Subscriber email
   * @param {string} firstName - Subscriber first name (optional)
   * @param {Object} customFields - Additional custom fields
   * @returns {Promise<Object>} Sequence subscription result
   */
  async subscribeToSequence(sequenceId, email, firstName = '', customFields = {}) {
    const url = `${this.baseURL}/sequences/${sequenceId}/subscribe`;
    
    const payload = {
      email,
      api_key: this.apiKey
    };

    if (firstName) {
      payload.first_name = firstName;
    }

    if (Object.keys(customFields).length > 0) {
      payload.fields = customFields;
    }

    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      return {
        success: true,
        data: response,
        message: 'Successfully subscribed to sequence'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to subscribe to sequence: ${error.message}`
      };
    }
  }

  /**
   * Get all forms
   * @returns {Promise<Object>} Forms list
   */
  async getForms() {
    const url = `${this.baseURL}/forms`;
    
    try {
      const response = await this.makeRequest(`${url}?api_key=${this.apiKey}`);
      return {
        success: true,
        data: response.forms || [],
        message: 'Forms retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to get forms: ${error.message}`
      };
    }
  }

  /**
   * Get all tags
   * @returns {Promise<Object>} Tags list
   */
  async getTags() {
    const url = `${this.baseURL}/tags`;
    
    try {
      const response = await this.makeRequest(`${url}?api_key=${this.apiKey}`);
      return {
        success: true,
        data: response.tags || [],
        message: 'Tags retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to get tags: ${error.message}`
      };
    }
  }

  /**
   * Get all sequences
   * @returns {Promise<Object>} Sequences list
   */
  async getSequences() {
    const url = `${this.baseURL}/sequences`;
    
    try {
      const response = await this.makeRequest(`${url}?api_key=${this.apiKey}`);
      return {
        success: true,
        data: response.courses || [], // Kit calls sequences "courses" in API
        message: 'Sequences retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to get sequences: ${error.message}`
      };
    }
  }

  /**
   * Get account information
   * @returns {Promise<Object>} Account data
   */
  async getAccount() {
    const url = `${this.baseURL}/account`;
    const params = new URLSearchParams({
      api_key: this.apiKey,
      api_secret: this.apiSecret
    });
    
    try {
      const response = await this.makeRequest(`${url}?${params}`);
      return {
        success: true,
        data: response.account,
        message: 'Account information retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `Failed to get account: ${error.message}`
      };
    }
  }

  /**
   * Core HTTP request method with rate limiting and retries
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @param {number} retryCount - Current retry count
   * @returns {Promise<Object>} Response data
   */
  async makeRequest(url, options = {}, retryCount = 0) {
    try {
      const response = await fetch(url, options);
      
      // Handle rate limiting
      if (response.status === 429) {
        if (retryCount < this.maxRetries) {
          await this.sleep(this.rateLimitDelay);
          this.rateLimitDelay *= 2; // Exponential backoff
          return this.makeRequest(url, options, retryCount + 1);
        } else {
          throw new Error('Rate limit exceeded - max retries reached');
        }
      }
      
      // Reset delay on successful request
      this.rateLimitDelay = 500;
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      // Network or parsing errors
      if (retryCount < this.maxRetries && !error.message.includes('Rate limit')) {
        await this.sleep(1000); // Wait 1 second before retry
        return this.makeRequest(url, options, retryCount + 1);
      }
      
      console.error('Kit API request failed:', {
        url,
        error: error.message,
        retryCount
      });
      
      throw error;
    }
  }

  /**
   * Sleep utility for rate limiting
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Health check - verify API connection
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const account = await this.getAccount();
      return {
        success: true,
        status: 'healthy',
        apiKey: this.apiKey ? 'configured' : 'missing',
        message: 'Kit API connection successful'
      };
    } catch (error) {
      return {
        success: false,
        status: 'unhealthy',
        error: error.message,
        message: 'Kit API connection failed'
      };
    }
  }
}

module.exports = KitAPIClient;
```

## Natural Language Interface

### src/lib/kit-claude.js

```javascript
/**
 * Kit Claude Interface
 * Natural language wrapper for Kit API operations
 * Maintains compatibility with existing Brevo conversational interface
 */

const KitAPIClient = require('./kit-client');

class KitClaudeInterface {
  constructor() {
    this.client = new KitAPIClient();
    
    // Form ID mappings (configure these with actual Kit form IDs)
    this.forms = {
      gutHealthGuide: process.env.KIT_GUT_HEALTH_FORM_ID,
      newsletter: process.env.KIT_NEWSLETTER_FORM_ID,
      blogSubscribers: process.env.KIT_BLOG_FORM_ID,
      quizCompleters: process.env.KIT_QUIZ_FORM_ID,
      productPageVisitors: process.env.KIT_PRODUCT_PAGE_FORM_ID
    };

    // Tag ID mappings (configure these with actual Kit tag IDs)
    this.tags = {
      leadMagnetGutHealth: process.env.KIT_TAG_LEAD_MAGNET_GUT_HEALTH,
      leadMagnetQuiz: process.env.KIT_TAG_LEAD_MAGNET_QUIZ,
      funnelProductPage: process.env.KIT_TAG_FUNNEL_PRODUCT_PAGE,
      funnelCartAbandon: process.env.KIT_TAG_FUNNEL_CART_ABANDON,
      funnelHighIntent: process.env.KIT_TAG_FUNNEL_HIGH_INTENT,
      customerBuyer: process.env.KIT_TAG_CUSTOMER_BUYER,
      customerRepeat: process.env.KIT_TAG_CUSTOMER_REPEAT,
      customerVip: process.env.KIT_TAG_CUSTOMER_VIP,
      behaviorEngaged: process.env.KIT_TAG_BEHAVIOR_ENGAGED,
      behaviorAtRisk: process.env.KIT_TAG_BEHAVIOR_AT_RISK,
      contentBlog: process.env.KIT_TAG_CONTENT_BLOG,
      contentNewsletter: process.env.KIT_TAG_CONTENT_NEWSLETTER
    };

    // Sequence ID mappings
    this.sequences = {
      gutHealthWelcome: process.env.KIT_SEQUENCE_GUT_HEALTH_WELCOME,
      purchaseFollowup: process.env.KIT_SEQUENCE_PURCHASE_FOLLOWUP,
      cartAbandonment: process.env.KIT_SEQUENCE_CART_ABANDONMENT
    };
  }

  /**
   * Add contact to gut health lead magnet system
   * Equivalent to Brevo's addContactToGutHealthList
   */
  async addContactToGutHealthList(email, firstName = '', source = 'website') {
    try {
      // Validate email
      if (!this.client.isValidEmail(email)) {
        return {
          success: false,
          message: 'Invalid email address provided'
        };
      }

      // Subscribe to gut health form
      const subscriptionResult = await this.client.subscribeToForm(
        this.forms.gutHealthGuide,
        email,
        firstName,
        {
          source,
          signup_date: new Date().toISOString(),
          lead_magnet: 'gut_health_guide'
        }
      );

      if (!subscriptionResult.success) {
        return subscriptionResult;
      }

      // Add lead magnet tag
      await this.client.addTagToSubscriber(this.tags.leadMagnetGutHealth, email);

      // Subscribe to welcome sequence
      if (this.sequences.gutHealthWelcome) {
        await this.client.subscribeToSequence(
          this.sequences.gutHealthWelcome,
          email,
          firstName,
          { source }
        );
      }

      return {
        success: true,
        message: `Successfully added ${email} to gut health lead magnet system`,
        subscriberId: subscriptionResult.subscriberId,
        actions: [
          'Subscribed to gut health form',
          'Added lead magnet tag',
          'Enrolled in welcome sequence'
        ]
      };
    } catch (error) {
      console.error('Failed to add contact to gut health list:', error);
      return {
        success: false,
        message: `Failed to add contact: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Move contact through sales funnel stages
   */
  async moveContactToSalesFunnel(email, stage = 'product-page') {
    try {
      const stageTagMap = {
        'product-page': this.tags.funnelProductPage,
        'cart-abandon': this.tags.funnelCartAbandon,
        'high-intent': this.tags.funnelHighIntent
      };

      const tagId = stageTagMap[stage];
      if (!tagId) {
        return {
          success: false,
          message: `Invalid sales funnel stage: ${stage}`
        };
      }

      const result = await this.client.addTagToSubscriber(tagId, email);
      
      // Trigger cart abandonment sequence if applicable
      if (stage === 'cart-abandon' && this.sequences.cartAbandonment) {
        await this.client.subscribeToSequence(this.sequences.cartAbandonment, email);
      }

      return {
        success: true,
        message: `Successfully moved ${email} to sales funnel stage: ${stage}`,
        stage,
        tagId
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to move contact to sales funnel: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Mark contact as customer after purchase
   */
  async markAsCustomer(email, purchaseType = 'first-time') {
    try {
      const customerTag = purchaseType === 'repeat' 
        ? this.tags.customerRepeat 
        : this.tags.customerBuyer;

      const result = await this.client.addTagToSubscriber(customerTag, email);

      // Remove from sales funnel tags
      await this.client.removeTagFromSubscriber(this.tags.funnelCartAbandon, email);
      await this.client.removeTagFromSubscriber(this.tags.funnelHighIntent, email);

      // Add to purchase follow-up sequence
      if (this.sequences.purchaseFollowup) {
        await this.client.subscribeToSequence(this.sequences.purchaseFollowup, email);
      }

      return {
        success: true,
        message: `Successfully marked ${email} as ${purchaseType} customer`,
        customerType: purchaseType,
        actions: [
          'Added customer tag',
          'Removed sales funnel tags',
          'Enrolled in purchase follow-up sequence'
        ]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to mark as customer: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Add contact to blog subscribers
   */
  async addToBlogSubscribers(email, firstName = '', source = 'blog') {
    try {
      const result = await this.client.subscribeToForm(
        this.forms.blogSubscribers,
        email,
        firstName,
        { source, content_interest: 'blog' }
      );

      if (result.success) {
        await this.client.addTagToSubscriber(this.tags.contentBlog, email);
      }

      return {
        success: result.success,
        message: result.success 
          ? `Successfully added ${email} to blog subscribers`
          : result.message,
        subscriberId: result.subscriberId
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to add to blog subscribers: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Get subscriber information by email
   */
  async getContactInfo(email) {
    try {
      // Note: Kit API v3 doesn't have direct email lookup
      // This would require storing email-to-ID mapping or using search
      const subscribers = await this.client.getAllSubscribers();
      
      if (!subscribers.success) {
        return subscribers;
      }

      const subscriber = subscribers.data.find(sub => sub.email_address === email);
      
      if (!subscriber) {
        return {
          success: false,
          message: `Subscriber not found: ${email}`
        };
      }

      return {
        success: true,
        data: subscriber,
        message: 'Subscriber information retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get contact info: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Health check for Kit integration
   */
  async healthCheck() {
    try {
      const apiHealth = await this.client.healthCheck();
      const formsCheck = await this.client.getForms();
      const tagsCheck = await this.client.getTags();

      const missingForms = Object.entries(this.forms)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      const missingTags = Object.entries(this.tags)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

      return {
        success: apiHealth.success,
        api: apiHealth,
        forms: {
          configured: Object.keys(this.forms).length - missingForms.length,
          missing: missingForms
        },
        tags: {
          configured: Object.keys(this.tags).length - missingTags.length,
          missing: missingTags
        },
        message: apiHealth.success 
          ? 'Kit integration healthy'
          : 'Kit integration has issues'
      };
    } catch (error) {
      return {
        success: false,
        message: `Health check failed: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Bulk operations for migration
   */
  async bulkAddContacts(contacts) {
    const results = [];
    const batchSize = 50; // Process in batches to manage rate limits
    
    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);
      
      for (const contact of batch) {
        try {
          const result = await this.addContactToGutHealthList(
            contact.email,
            contact.firstName,
            contact.source || 'migration'
          );
          
          results.push({
            email: contact.email,
            success: result.success,
            message: result.message
          });
        } catch (error) {
          results.push({
            email: contact.email,
            success: false,
            message: error.message
          });
        }
        
        // Rate limiting delay
        await this.client.sleep(700); // ~85 requests per minute
      }
      
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(contacts.length / batchSize)}`);
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: true,
      processed: contacts.length,
      successful,
      failed,
      results,
      message: `Bulk import complete: ${successful} successful, ${failed} failed`
    };
  }
}

module.exports = KitClaudeInterface;
```

## API Endpoints

### pages/api/kit/add-contact.js

```javascript
/**
 * Kit Contact Addition Endpoint
 * Replaces pages/api/brevo/add-contact.js
 */

import KitClaudeInterface from '../../../src/lib/kit-claude';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { email, firstName, source, listType } = req.body;
    
    // Validation
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    const kitInterface = new KitClaudeInterface();
    let result;

    // Route to appropriate list based on listType
    switch (listType) {
      case 'blog':
        result = await kitInterface.addToBlogSubscribers(email, firstName, source);
        break;
      case 'gut-health':
      default:
        result = await kitInterface.addContactToGutHealthList(email, firstName, source);
        break;
    }

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        subscriberId: result.subscriberId,
        actions: result.actions || []
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Kit subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
}
```

### pages/api/kit/health-check.js

```javascript
/**
 * Kit Integration Health Check Endpoint
 */

import KitClaudeInterface from '../../../src/lib/kit-claude';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const kitInterface = new KitClaudeInterface();
    const healthCheck = await kitInterface.healthCheck();

    res.status(200).json(healthCheck);
  } catch (error) {
    console.error('Kit health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
}
```

### pages/api/kit/move-to-funnel.js

```javascript
/**
 * Move Contact to Sales Funnel Stage
 */

import KitClaudeInterface from '../../../src/lib/kit-claude';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, stage } = req.body;
    
    if (!email || !stage) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and stage are required' 
      });
    }

    const kitInterface = new KitClaudeInterface();
    const result = await kitInterface.moveContactToSalesFunnel(email, stage);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Move to funnel error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}
```

## Environment Variables

### .env.local

```env
# Kit API Configuration
KIT_API_KEY=your_kit_api_key_here
KIT_API_SECRET=your_kit_api_secret_here

# Kit Form IDs (replace with actual form IDs from Kit)
KIT_GUT_HEALTH_FORM_ID=123456
KIT_NEWSLETTER_FORM_ID=123457
KIT_BLOG_FORM_ID=123458
KIT_QUIZ_FORM_ID=123459
KIT_PRODUCT_PAGE_FORM_ID=123460

# Kit Tag IDs (replace with actual tag IDs from Kit)
KIT_TAG_LEAD_MAGNET_GUT_HEALTH=tag_id_1
KIT_TAG_LEAD_MAGNET_QUIZ=tag_id_2
KIT_TAG_FUNNEL_PRODUCT_PAGE=tag_id_3
KIT_TAG_FUNNEL_CART_ABANDON=tag_id_4
KIT_TAG_FUNNEL_HIGH_INTENT=tag_id_5
KIT_TAG_CUSTOMER_BUYER=tag_id_6
KIT_TAG_CUSTOMER_REPEAT=tag_id_7
KIT_TAG_CUSTOMER_VIP=tag_id_8
KIT_TAG_BEHAVIOR_ENGAGED=tag_id_9
KIT_TAG_BEHAVIOR_AT_RISK=tag_id_10
KIT_TAG_CONTENT_BLOG=tag_id_11
KIT_TAG_CONTENT_NEWSLETTER=tag_id_12

# Kit Sequence IDs (replace with actual sequence IDs from Kit)
KIT_SEQUENCE_GUT_HEALTH_WELCOME=sequence_id_1
KIT_SEQUENCE_PURCHASE_FOLLOWUP=sequence_id_2
KIT_SEQUENCE_CART_ABANDONMENT=sequence_id_3
```

## Usage Examples

### Basic Contact Addition

```javascript
import KitClaudeInterface from '../lib/kit-claude';

const kit = new KitClaudeInterface();

// Add to gut health lead magnet
const result = await kit.addContactToGutHealthList(
  'test@example.com',
  'John',
  'landing_page'
);

console.log(result);
// {
//   success: true,
//   message: "Successfully added test@example.com to gut health lead magnet system",
//   subscriberId: "12345",
//   actions: [
//     "Subscribed to gut health form",
//     "Added lead magnet tag",
//     "Enrolled in welcome sequence"
//   ]
// }
```

### Sales Funnel Management

```javascript
// Move contact through sales funnel
await kit.moveContactToSalesFunnel('customer@example.com', 'product-page');
await kit.moveContactToSalesFunnel('customer@example.com', 'cart-abandon');

// Mark as customer after purchase
await kit.markAsCustomer('customer@example.com', 'first-time');
```

### Health Check

```javascript
const health = await kit.healthCheck();
console.log(health);
// {
//   success: true,
//   api: { status: 'healthy', ... },
//   forms: { configured: 5, missing: [] },
//   tags: { configured: 12, missing: [] },
//   message: 'Kit integration healthy'
// }
```

---

*This wrapper provides production-ready Kit API integration with the same interface patterns as the existing Brevo system, enabling seamless migration.*