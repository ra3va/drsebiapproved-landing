# Brevo API Wrapper for Claude - Complete Documentation

## 🎯 Project Overview

This wrapper enables Claude to manage your entire Brevo email marketing operation through natural language commands. Primary goal: Connect lead magnet to Brevo and enable zero-dashboard campaign management.

## 🔑 Authentication & Setup

### API Credentials
```env
# Configure in .env.local (not committed to repo)
BREVO_API_KEY=your_brevo_api_key_here
```

### Brevo JS Tracker Installation ✅ INSTALLED
```html
<!-- Behavioral tracking for campaign automation -->
<script src="https://cdn.brevo.com/js/sdk-loader.js" async></script>
<script>
    // Version: 2.0
    window.Brevo = window.Brevo || [];
    Brevo.push([
        "init",
        {
        client_key: "fe6w1ww57kreu47ho3uax9h2",
        // Optional: Add other initialization options, see documentation
        }
    ]);
</script>
```

### Tracker Configuration
- **Client Key**: `fe6w1ww57kreu47ho3uax9h2`
- **Tracking Method**: Email-based visitor identification (privacy-compliant)
- **Behavioral Data**: Page views, clicks, cart abandonment, purchases, custom events

### Base Configuration
```javascript
const BREVO_CONFIG = {
  baseURL: 'https://api.brevo.com/v3',
  apiKey: process.env.BREVO_API_KEY,
  rateLimits: {
    general: 100, // requests/hour
    contacts: 36000, // requests/hour (10/second)
    transactional: 3600000 // requests/hour (1000/second)
  }
};
```

## 📊 Free Account Capabilities & Limitations

### ✅ What We Can Do
- **100,000 contacts** storage
- **300 emails/day** (9,000/month)
- **Full API access** to all endpoints
- **Marketing automation** for 2,000 contacts
- **Transactional emails** included
- **Advanced segmentation**
- **Campaign analytics**
- **A/B testing** (basic)

### ❌ Limitations
- Brevo branding in emails
- 1 user account only
- Rate limits: 100 requests/hour (general)
- No landing page builder
- Limited campaign reporting

## 🛠️ Core API Endpoints

### 1. Contact Management
```javascript
// Add Contact
POST /contacts
{
  "email": "user@example.com",
  "attributes": {
    "FIRSTNAME": "John",
    "SOURCE": "gut-health-guide"
  },
  "listIds": [1],
  "updateEnabled": true
}

// Get Contact
GET /contacts/{identifier}

// Update Contact
PUT /contacts/{identifier}

// Delete Contact
DELETE /contacts/{identifier}

// Import Contacts
POST /contacts/import
```

### 2. List Management  
```javascript
// Create List
POST /contacts/lists
{
  "name": "Gut Health Leads",
  "folderId": 1
}

// Get Lists
GET /contacts/lists

// Update List
PUT /contacts/lists/{listId}

// Delete List
DELETE /contacts/lists/{listId}

// Add Contacts to List
POST /contacts/lists/{listId}/contacts/add
{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

### 3. Segment Management
```javascript
// Create Segment
POST /contacts/segments
{
  "name": "High Intent Leads",
  "categoryId": 1,
  "queryString": "EMAIL_OPENED[Campaign] >= 2 AND EMAIL_CLICKED[Campaign] >= 1"
}

// Get Segments
GET /contacts/segments

// Update Segment
PUT /contacts/segments/{segmentId}
```

### 4. Campaign Management
```javascript
// Create Email Campaign
POST /emailCampaigns
{
  "name": "Welcome Series - Part 1",
  "subject": "Your Free Gut Health Guide is Here!",
  "htmlContent": "<html>...</html>",
  "sender": {
    "name": "Dr. Sebi Approved",
    "email": "info@drsebiapproved.com"
  },
  "recipients": {
    "listIds": [1]
  },
  "scheduledAt": "2025-01-15T10:00:00Z"
}

// Get Campaigns
GET /emailCampaigns

// Send Campaign
POST /emailCampaigns/{campaignId}/sendNow

// Get Campaign Statistics
GET /emailCampaigns/{campaignId}/statistics
```

### 5. Automation Workflows
```javascript
// Create Automation
POST /marketing/automation
{
  "name": "Welcome Series Automation",
  "triggerSettings": {
    "triggerType": "contact_list_addition",
    "listId": 1
  },
  "steps": [
    {
      "type": "email",
      "delay": 0,
      "emailTemplate": "welcome-email-1"
    },
    {
      "type": "email", 
      "delay": 259200, // 3 days in seconds
      "emailTemplate": "welcome-email-2"
    }
  ]
}
```

### 6. Transactional Emails
```javascript
// Send Transactional Email
POST /smtp/email
{
  "sender": {
    "name": "Dr. Sebi Approved",
    "email": "info@drsebiapproved.com"
  },
  "to": [{"email": "user@example.com", "name": "John Doe"}],
  "subject": "Your Gut Health Guide Download",
  "htmlContent": "<html>...</html>",
  "tags": ["lead-magnet", "gut-health-guide"]
}
```

## 🔍 Behavioral Tracking & Automation Triggers

### Available Tracking Events
```javascript
// Track page views automatically
// Track custom events manually:
window.Brevo = window.Brevo || [];

// Track product page visits
Brevo.push(['track', 'page_view', {
  'page': 'product',
  'product_name': 'ParaCleanse Elite',
  'product_price': 197
}]);

// Track cart abandonment
Brevo.push(['track', 'cart_abandoned', {
  'cart_value': 197,
  'product_name': 'ParaCleanse Elite'
}]);

// Track purchases
Brevo.push(['track', 'purchase', {
  'order_id': 'ORD-12345',
  'revenue': 197,
  'product': 'ParaCleanse Elite'
}]);

// Identify users (connects email to behavior)
Brevo.push(['identify', {
  'email': 'user@example.com',
  'firstname': 'John',
  'source': 'gut-health-guide'
}]);
```

### Automation Scenarios Enabled
- **Cart Abandonment Recovery**: Trigger email series when user leaves checkout
- **Product Interest Nurturing**: Follow up on product page visits  
- **Content Engagement Scoring**: Tag highly engaged blog readers
- **Purchase Follow-up**: Post-purchase education and upsells
- **Return Visitor Campaigns**: Personalized messaging for repeat visitors

## 🎨 Claude Wrapper Functions

### Natural Language to API Mapping

```javascript
class BrevoClaudeWrapper {
  
  // "Add email to gut health list"
  async addContactToList(email, listName, attributes = {}) {
    const list = await this.findOrCreateList(listName);
    return await this.addContact({
      email,
      listIds: [list.id],
      attributes: {
        SOURCE: 'claude-conversation',
        ...attributes
      }
    });
  }

  // "Create welcome series for new subscribers"  
  async createWelcomeSeries(seriesName, emails, listId) {
    const automation = await this.createAutomation({
      name: seriesName,
      trigger: { type: 'list_addition', listId },
      steps: emails.map((email, index) => ({
        type: 'email',
        delay: index * 3 * 24 * 60 * 60, // 3 days apart
        content: email
      }))
    });
    return automation;
  }

  // "Show me campaign performance"
  async getCampaignAnalytics(campaignName) {
    const campaign = await this.findCampaign(campaignName);
    const stats = await this.getCampaignStats(campaign.id);
    return {
      opens: stats.uniqueOpens,
      clicks: stats.uniqueClicks,
      conversions: stats.unsubscriptions,
      revenue: await this.calculateRevenue(campaign.id)
    };
  }

  // "Create segment of engaged users"
  async createEngagementSegment(name, criteria) {
    const queryString = this.buildSegmentQuery(criteria);
    return await this.createSegment({
      name,
      queryString
    });
  }
}
```

## 🚀 Implementation Phases

### Phase 1: Lead Magnet Integration (PRIORITY)
```javascript
// Immediate implementation for gut health lead magnet
const leadMagnetFlow = {
  1: 'Capture email from blog component',
  2: 'Add to "Gut Health Leads" list via API',
  3: 'Trigger transactional email with PDF',
  4: 'Start 7-day nurture sequence',
  5: 'Tag for future segmentation'
};
```

### Phase 2: Campaign Management
```javascript
const campaignManagement = {
  1: 'Natural language campaign creation',
  2: 'Template library management', 
  3: 'Automated scheduling optimization',
  4: 'Performance monitoring & alerts'
};
```

### Phase 3: Advanced Automation
```javascript
const advancedFeatures = {
  1: 'Behavioral trigger workflows',
  2: 'Revenue attribution tracking',
  3: 'Predictive send time optimization',
  4: 'Cross-channel campaign orchestration'
};
```

## 🎯 Immediate Next Steps

### 1. Lead Magnet API Integration
```javascript
// /api/brevo/add-contact.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  
  try {
    // Add to Brevo list
    const contact = await brevoClient.addContact({
      email,
      listIds: [process.env.BREVO_GUT_HEALTH_LIST_ID],
      attributes: {
        SOURCE: 'gut-health-guide',
        SIGNUP_DATE: new Date().toISOString()
      }
    });

    // Send PDF via transactional email
    await brevoClient.sendTransactionalEmail({
      to: [{ email }],
      templateId: process.env.BREVO_PDF_TEMPLATE_ID,
      params: {
        DOWNLOAD_LINK: process.env.PDF_DOWNLOAD_URL
      }
    });

    res.status(200).json({ success: true, contactId: contact.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 2. Claude Command Interface
```javascript
// Claude understands these natural commands:
const claudeCommands = {
  // Contact Management
  "add [email] to [list]": "addContactToList",
  "create list called [name]": "createList", 
  "show me [list] subscribers": "getListContacts",
  
  // Campaign Management  
  "create campaign about [topic]": "createCampaign",
  "schedule [campaign] for [time]": "scheduleCampaign",
  "show [campaign] performance": "getCampaignStats",
  
  // Automation
  "create welcome series for [list]": "createWelcomeAutomation",
  "segment users who [criteria]": "createSegment",
  "setup automation for [trigger]": "createAutomation"
};
```

## 🔍 Error Handling & Rate Limiting

```javascript
class BrevoAPIClient {
  constructor() {
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: 100,
      interval: 'hour'
    });
  }

  async request(endpoint, options = {}) {
    await this.rateLimiter.removeTokens(1);
    
    try {
      const response = await fetch(`${BREVO_CONFIG.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'api-key': BREVO_CONFIG.apiKey,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new BrevoAPIError(response.status, await response.json());
      }

      return await response.json();
    } catch (error) {
      console.error(`Brevo API Error: ${error.message}`);
      throw error;
    }
  }
}
```

## 📈 Success Metrics & Monitoring

### KPIs to Track
- Lead magnet conversion rate
- Email open rates by campaign
- Click-through rates  
- List growth rate
- Revenue per subscriber
- Automation performance

### Automated Reporting
```javascript
// Weekly performance summary
const weeklyReport = {
  newContacts: 147,
  emailsSent: 2340,
  avgOpenRate: '23.4%',
  avgClickRate: '4.2%', 
  topPerformingCampaign: 'Dr. Sebi Success Stories',
  listGrowthRate: '12%'
};
```

## 🎪 Claude Integration Examples

### Example Conversations
```
Ra: "Add the email john@example.com to our gut health list"
Claude: ✅ Added john@example.com to "Gut Health Leads" list. Triggered welcome email with PDF download.

Ra: "Create a 3-part email series about parasite cleanse benefits"  
Claude: ✅ Created "Parasite Cleanse Education Series":
- Email 1: "The Hidden Parasite Problem" (sends immediately)
- Email 2: "Dr. Sebi's Natural Solution" (sends in 3 days)  
- Email 3: "Success Stories & Next Steps" (sends in 7 days)

Ra: "Set up cart abandonment automation"
Claude: ✅ Created "ParaCleanse Cart Recovery" automation:
- Trigger: User adds product to cart but doesn't complete purchase
- Email 1: "Complete your order" (1 hour delay)
- Email 2: "Don't miss out + 10% discount" (24 hours)
- Email 3: "Final reminder + testimonials" (72 hours)

Ra: "Create segment of users who viewed product page but didn't buy"
Claude: ✅ Created "Product Interest - No Purchase" segment:
- Criteria: Visited /product pages + No purchase event in 7 days
- 147 contacts match this criteria
- Ready for targeted campaign

Ra: "How did last week's campaign perform?"
Claude: 📊 "Gut Health Transformation" Campaign Results:
- Sent: 1,247 emails
- Opens: 312 (25.0%) 
- Clicks: 67 (21.5% of opens)
- Conversions: 12 sales ($2,340 revenue)
- ROI: 680%
- Top behavior: 89% visited blog after email
```

## 🚦 Ready to Implement

**Files to Create:**
1. `/lib/brevo-client.js` - Core API wrapper
2. `/api/brevo/add-contact.js` - Lead magnet endpoint  
3. `/api/brevo/webhook.js` - Event handling
4. `/components/BrevoIntegration.tsx` - UI components

**Environment Variables Needed:**
```env
BREVO_API_KEY=your_brevo_api_key_here
BREVO_GUT_HEALTH_LIST_ID=1  # To be created
BREVO_PDF_TEMPLATE_ID=1     # To be created  
PDF_DOWNLOAD_URL=https://drsebiapproved.com/downloads/gut-health-guide.pdf
```

This wrapper will transform your email marketing from manual dashboard work to conversational automation. Ready to begin implementation with the lead magnet integration?