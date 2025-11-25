# Brevo API Capabilities Reference

**Last Updated:** November 25, 2025  
**Account:** 26 Herb Maya LLC (info@drsebiapproved.com)  
**Plan:** Free (300 emails/day)

---

## Quick Reference Scripts

```bash
# Check campaign stats
node scripts/check-brevo-stats.js [campaign-id]

# Upload contacts from Supabase to Brevo list
node scripts/sync-contacts-to-brevo.js [--dry-run] [--limit=N]

# Create email campaign (draft mode)
node scripts/create-brevo-campaign.js [--preview]
```

---

## What Claude Can Do via API

### ✅ CONTACTS

| Action | Method | Notes |
|--------|--------|-------|
| Add contact | `POST /contacts` | With attributes, list assignment |
| Get contact | `GET /contacts/{email}` | Full profile data |
| Update contact | `PUT /contacts/{email}` | Update attributes, lists |
| Delete contact | `DELETE /contacts/{email}` | Permanent removal |
| Bulk upload | Loop `POST /contacts` | 10/sec rate limit |

**Example - Add contact:**
```javascript
await brevoClient.addContact({
  email: 'user@example.com',
  attributes: { FIRSTNAME: 'John', SOURCE: 'black-friday' },
  listIds: [19],
  updateEnabled: true
});
```

### ✅ LISTS

| Action | Method | Notes |
|--------|--------|-------|
| Get all lists | `GET /contacts/lists` | See subscriber counts |
| Create list | `POST /contacts/lists` | Requires folderId |
| Get list contacts | `GET /contacts/lists/{id}/contacts` | Paginated |
| Add to list | `POST /contacts/lists/{id}/contacts/add` | Batch emails |
| Remove from list | `POST /contacts/lists/{id}/contacts/remove` | Batch emails |

**Current Lists (as of Nov 25, 2025):**
| ID | Name | Subscribers |
|----|------|-------------|
| 19 | Black Friday 2025 | 1,139 |
| 18 | Win-Back - Mucus Cleanser | 1 |
| 17 | Re-engaged Customers | 2 |
| 16 | Checkout Started | 2 |
| 15 | Bundle Buyers | 2 |
| 14 | Mucus Cleanser Customers | 1 |
| 13 | Sea Moss Customers | 2 |
| 12 | Maya Customers | 1 |
| 11 | ParaCleanse Customers | 0 |
| 10 | Health Quiz Takers | 0 |
| 9 | Mucus Cleanser Prospects | 0 |
| 8 | Sea Moss Prospects | 0 |
| 7 | Maya Prospects | 1 |
| 6 | ParaCleanse Prospects | 0 |
| 5 | Gut Health Guide Downloads | 15 |

### ✅ CAMPAIGNS

| Action | Method | Notes |
|--------|--------|-------|
| Create campaign | `POST /emailCampaigns` | Creates in DRAFT |
| Get campaign | `GET /emailCampaigns/{id}` | Full details + stats |
| List campaigns | `GET /emailCampaigns?status=X` | draft/sent/suspended/queued |
| Update campaign | `PUT /emailCampaigns/{id}` | Before sending only |
| Send now | `POST /emailCampaigns/{id}/sendNow` | Triggers send |
| Schedule | `POST /emailCampaigns/{id}/schedule` | Future send |
| Get stats | `GET /emailCampaigns/{id}` | In statistics object |

**Campaign Stats Available:**
- `sent` - Total emails attempted
- `delivered` - Successfully delivered
- `uniqueOpens` / `uniqueViews` - Unique opens
- `uniqueClicks` - Unique link clicks
- `hardBounces` / `softBounces` - Bounce counts
- `unsubscriptions` - Unsub count
- `complaints` - Spam complaints
- `remaining` - Emails left to send (if suspended)
- `linksStats` - Clicks per URL

### ✅ TRANSACTIONAL EMAILS

| Action | Method | Notes |
|--------|--------|-------|
| Send email | `POST /smtp/email` | Immediate delivery |
| Send with template | `POST /smtp/email` | Use templateId |

**Example - Send transactional:**
```javascript
await brevoClient.sendTransactionalEmail({
  sender: { name: 'Dr. Sebi Approved', email: 'info@drsebiapproved.com' },
  to: [{ email: 'user@example.com', name: 'John' }],
  subject: 'Your Order Confirmation',
  htmlContent: '<html>...</html>'
});
```

### ✅ ATTRIBUTES (Contact Fields)

| Action | Method | Notes |
|--------|--------|-------|
| Get all | `GET /contacts/attributes` | See available fields |
| Create | `POST /contacts/attributes/{category}/{name}` | Add new field |

**Current Attributes:**
- `FIRSTNAME`, `LASTNAME` - Contact name
- `SOURCE` - How they found us
- `QUIZ_SCORE`, `SEVERITY_LEVEL`, `RECOMMENDED_PRODUCT` - Quiz data
- `LAST_PURCHASE_PRODUCT`, `LAST_PURCHASE_VALUE`, `LAST_PURCHASE_DATE` - Purchase history
- `PRODUCTS_OWNED`, `IS_BUNDLE_BUYER`, `CUSTOMER_STATUS` - Customer profile
- `CART_ABANDONED`, `CART_VALUE`, `CART_PRODUCTS` - Abandonment data
- `SHIPPING_CITY`, `SHIPPING_STATE`, `SHIPPING_ZIP` - Address

### ✅ SENDERS

| Action | Method | Notes |
|--------|--------|-------|
| List senders | `GET /senders` | See verified senders |
| Create sender | `POST /senders` | Requires verification |

**Verified Senders:**
- `info@drsebiapproved.com` (Dr. Sebi Approved) - **PRIMARY**
- `26herbmaya@gmail.com` (26 Herb Maya LLC)

### ✅ ACCOUNT

| Action | Method | Notes |
|--------|--------|-------|
| Get account | `GET /account` | Plan info, limits |

---

## What Claude CANNOT Do

### ❌ AUTOMATION WORKFLOWS
- Cannot create automation sequences via API
- Cannot set up triggers, delays, or conditional logic
- **Workaround:** Create automations in Brevo UI, trigger via list membership

### ❌ TEMPLATES
- Limited template management
- **Workaround:** Use inline HTML in campaigns

### ❌ REAL-TIME WEBHOOKS
- Cannot configure webhooks via API
- Must set up in Brevo dashboard

---

## Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| General API | 100 requests/hour |
| Contacts | 10 requests/second |
| Transactional | 1,000 requests/second |
| **Daily Send** | **300 emails/day (free tier)** |

---

## Common Workflows

### 1. Upload Customer List & Send Campaign
```bash
# Step 1: Upload contacts
node scripts/sync-contacts-to-brevo.js

# Step 2: Create campaign
node scripts/create-brevo-campaign.js

# Step 3: Check stats
node scripts/check-brevo-stats.js [campaign-id]
```

### 2. Check Campaign Performance
```bash
node scripts/check-brevo-stats.js 6
```

### 3. Get Contact Details
```javascript
const contact = await brevoClient.getContact('user@example.com');
```

### 4. Add Contact to List After Action
```javascript
await brevoClient.addContact({
  email: 'user@example.com',
  listIds: [15], // Bundle Buyers
  updateEnabled: true
});
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/brevo-client.js` | Core API wrapper class |
| `scripts/sync-contacts-to-brevo.js` | Supabase → Brevo list sync |
| `scripts/create-brevo-campaign.js` | Create marketing campaigns |
| `scripts/check-brevo-stats.js` | Check campaign statistics |

---

## API Authentication

All requests use header:
```
api-key: [BREVO_API_KEY from .env.local]
```

Base URL: `https://api.brevo.com/v3`

---

## Campaign Status Values

| Status | Meaning |
|--------|---------|
| `draft` | Not sent, editable |
| `queued` | Scheduled, waiting |
| `in_process` | Currently sending |
| `sent` | Completed |
| `suspended` | Paused (hit daily limit) |

---

## Personalization in Emails

Use Brevo template syntax:
```html
{{ contact.FIRSTNAME | default: "Friend" }}
{{ contact.LAST_PURCHASE_PRODUCT }}
{{ contact.CART_VALUE }}
```

---

## Integration with Supabase

The `reengagement_campaign` table tracks:
- `status: 'sent'` = Synced to Brevo
- `brevo_synced_at` = Timestamp of sync

Contacts are synced, then campaigns are sent via Brevo (not direct API sends).
