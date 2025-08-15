# Kit (ConvertKit) API Integration Documentation

## Overview

This document provides comprehensive guidance for integrating Kit's API as a replacement for Brevo in the ParaCleanse Elite email marketing system. Kit offers superior free tier limits (10,000 subscribers vs Brevo's 300) and excellent deliverability for creator-focused businesses.

## Kit API Basics

### Base URL
- **V3 (Legacy)**: `https://api.convertkit.com/v3/`
- **V4 (Beta)**: `https://api.convertkit.com/`

### API Status
- **V3**: Stable but no longer in active development
- **V4**: Closed beta, requires invitation
- **Recommendation**: Use V3 for immediate implementation, plan V4 migration

## Authentication

### API Key Authentication (V3)
```javascript
// Required for all API calls
const API_KEY = process.env.KIT_API_KEY;
const API_SECRET = process.env.KIT_API_SECRET; // Required for some endpoints

// Example request
const response = await fetch(`https://api.convertkit.com/v3/account?api_key=${API_KEY}&api_secret=${API_SECRET}`);
```

### OAuth Authentication (V4)
```javascript
// Bearer token authentication
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

### Getting API Credentials
1. Go to Kit Account Settings
2. Navigate to the "Advanced" section
3. Find "API" tab
4. Copy API Key and API Secret
5. Store in environment variables

## Core API Endpoints

### 1. Account Information
```javascript
GET /v3/account
// Returns account details, subscriber count, plan info
```

### 2. Subscriber Management
```javascript
// List all subscribers
GET /v3/subscribers

// Get single subscriber
GET /v3/subscribers/:id

// Subscribe to form (primary method for adding contacts)
POST /v3/forms/:form_id/subscribe
```

### 3. Forms Management
```javascript
// List all forms
GET /v3/forms

// Get specific form
GET /v3/forms/:id

// Subscribe to form
POST /v3/forms/:id/subscribe
```

### 4. Tags Management
```javascript
// List all tags
GET /v3/tags

// Create tag
POST /v3/tags

// Tag a subscriber
POST /v3/tags/:tag_id/subscribe
```

### 5. Sequences (Email Automation)
```javascript
// List sequences
GET /v3/sequences

// Subscribe to sequence
POST /v3/sequences/:sequence_id/subscribe
```

### 6. Custom Fields
```javascript
// List custom fields
GET /v3/custom_fields

// Create custom field
POST /v3/custom_fields
```

## Rate Limits

### V3 Limits
- **120 requests per 60-second rolling window**
- **429 status code** when limit exceeded
- **Recommendation**: Implement exponential backoff

### Rate Limiting Implementation
```javascript
class KitAPIClient {
  constructor(apiKey, apiSecret) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.rateLimitDelay = 500; // Start with 500ms delay
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, options);
      
      if (response.status === 429) {
        // Rate limited - implement exponential backoff
        await this.sleep(this.rateLimitDelay);
        this.rateLimitDelay *= 2; // Double the delay
        return this.makeRequest(endpoint, options); // Retry
      }
      
      // Reset delay on successful request
      this.rateLimitDelay = 500;
      return response;
    } catch (error) {
      console.error('Kit API request failed:', error);
      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Lead Magnet Integration

### Form Subscription Endpoint
```javascript
// Primary method for adding new subscribers
POST /v3/forms/:form_id/subscribe

// Request body
{
  "email": "subscriber@example.com",
  "first_name": "John", // Optional
  "fields": {           // Custom fields
    "source": "gut_health_guide",
    "page_url": "https://drsebiapproved.com"
  },
  "api_key": "your_api_key"
}
```

### Complete Subscription Example
```javascript
async function subscribeToForm(formId, email, firstName, customFields = {}) {
  const url = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;
  
  const payload = {
    email,
    first_name: firstName,
    fields: customFields,
    api_key: process.env.KIT_API_KEY
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to subscribe user:', error);
    throw error;
  }
}
```

### Double Opt-in Handling
Kit uses double opt-in by default:
1. User submits form
2. Confirmation email sent
3. User clicks confirmation link
4. Subscription activated
5. Welcome sequence triggered

## Webhook Configuration

### Available Webhook Events
- `subscriber.subscriber_activate` - Confirmed subscription
- `subscriber.subscriber_unsubscribe` - Unsubscribed
- `subscriber.form_subscribe` - Form submission (before confirmation)
- `subscriber.tag_add` - Tag added to subscriber
- `subscriber.sequence_complete` - Sequence completed
- `subscriber.purchase_create` - Purchase made

### Webhook Setup
```javascript
// Example webhook payload for subscriber activation
{
  "subscriber": {
    "id": 123456,
    "email": "subscriber@example.com",
    "first_name": "John",
    "state": "active",
    "created_at": "2025-08-14T18:00:00Z",
    "fields": {
      "source": "gut_health_guide"
    }
  }
}
```

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found (invalid endpoint or resource)
- `422` - Unprocessable Entity (validation errors)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Response Format
```javascript
{
  "error": "Invalid email address",
  "message": "The email address provided is not valid"
}
```

## Migration from Brevo

### Functionality Mapping

| Brevo Feature | Kit Equivalent | Implementation |
|---------------|----------------|----------------|
| Contact Lists | Forms + Tags | Use forms for subscription, tags for segmentation |
| Folders | Tags | Organize with tag naming conventions |
| Contact Attributes | Custom Fields | Create custom fields for metadata |
| Transactional Emails | Sequences | Use automated sequences for triggered emails |
| Campaign Sending | Broadcasts | Create and send broadcast emails |
| Automation | Visual Automations | Use Kit's visual automation builder |

### Data Export from Brevo
```javascript
// Export contacts from Brevo before migration
// Use Brevo API to get all contacts with their attributes
// Format data for Kit import
```

### Kit Data Import
```javascript
// Bulk import contacts using form subscription
async function bulkImportContacts(contacts, formId) {
  const results = [];
  
  for (const contact of contacts) {
    try {
      const result = await subscribeToForm(
        formId,
        contact.email,
        contact.firstName,
        contact.customFields
      );
      results.push({ success: true, email: contact.email, data: result });
    } catch (error) {
      results.push({ success: false, email: contact.email, error: error.message });
    }
    
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 600)); // ~100 requests/minute
  }
  
  return results;
}
```

## Environment Variables

```env
# Kit API Configuration
KIT_API_KEY=your_kit_api_key_here
KIT_API_SECRET=your_kit_api_secret_here

# Form IDs for different purposes
KIT_LEAD_MAGNET_FORM_ID=form_id_for_gut_health_guide
KIT_NEWSLETTER_FORM_ID=form_id_for_newsletter
KIT_BLOG_SUBSCRIBER_FORM_ID=form_id_for_blog_subscribers

# Webhook configuration
KIT_WEBHOOK_SECRET=webhook_secret_for_verification
```

## Next Steps

1. **Create Kit Account** - Sign up for free Kit account
2. **Set Up Forms** - Create forms for different lead magnets
3. **Configure API Access** - Get API credentials from account settings
4. **Implement API Wrapper** - Build client wrapper similar to Brevo
5. **Test Integration** - Test with kingthriva@gmail.com
6. **Migration Plan** - Export Brevo data and import to Kit
7. **Webhook Setup** - Configure webhooks for automation
8. **Monitor Performance** - Track deliverability and engagement

## Resources

- [Kit Developer Documentation](https://developers.kit.com/)
- [Kit API V3 Reference](https://developers.kit.com/v3)
- [Kit Community Forum](https://community.kit.com/)
- [Kit Status Page](https://status.kit.com/)

---

*This documentation provides the foundation for migrating from Brevo to Kit while maintaining all existing functionality and improving subscriber limits.*