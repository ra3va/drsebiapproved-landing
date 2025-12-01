# Dr. Sebi Approved Backend Expert Guide

**Your Complete Backend Command Center - Built for Ra's $10K MRR Goal**

*Last Updated: December 1, 2025 10:35 CST*
*Production Platform: https://drsebiapproved.com*

---

## 🏗️ System Architecture Overview

Your Dr. Sebi Approved platform is a **fully integrated e-commerce powerhouse** with 6 core systems working together:

1. **🏪 Commerce Engine (Square)** - Payments, catalog, checkout
2. **📧 Marketing Automation (Brevo)** - Email campaigns, transactional, list management
3. **📊 Analytics Intelligence (GA4)** - E-commerce tracking, revenue analysis
4. **🎯 Ad Network (Meta Ads)** - Programmatic campaign management
5. **🗄️ Campaign Database (Supabase)** - Contact management, campaign tracking
6. **📱 Admin Dashboard** - Campaign management, real-time monitoring

---

## 🔧 Core Backend Systems

### 1. Square Commerce Engine (`/api/square/`)

**Function:** Full e-commerce payment processing and product catalog management

**Key Endpoints:**
- `process-payment` - Custom checkout flow with coupon application
- `verify-coupon` - Validates discount codes (BLACKFRIDAY30, STOPMUCUS)
- `setup-catalog` - Product management and pricing updates

**Current Products (Black Friday Mode):**
- ParaCleanse Elite: $62.99 (30% off)
- Maya: $41.99 (30% off)
- Sea Moss: $27.99 (30% off)
- Mucus Cleanser: $27.99 (30% off)

**Active Coupons:**
- `BLACKFRIDAY30` - 30% off sitewide
- `STOPMUCUS` - 37% off Mucus Cleanser

**🔍 **Ra's Backend Query Examples:****
```
"What are the current active coupons?"
"Are there any payment processing errors today?"
"What's the status of the product catalog?"
"Show me recent payment transactions"
```

### 2. Brevo Marketing Automation (`/api/brevo/`)

**Function:** Complete email marketing system (replaced Zoho for bulk sends)

**Email Types:**
- **Transactional:** Purchase receipts, shipping confirmations
- **Marketing:** Black Friday campaigns, promotional sequences
- **Behavioral:** Quiz responses, cart abandonment, win-back flows

**Current Campaigns:**
- "Black Friday 2025" - 1,139 contacts (Free tier: 300/day)
- Multi-stage win-back sequences

**🔍 **Ra's Backend Query Examples:****
```
"How many emails were sent yesterday?"
"What are the current Brevo campaign stats?"
"Are we hitting rate limits on the free tier?"
"Show me email engagement metrics"
"What contacts are waiting for Brevo sync?"
```

### 3. Campaign Management System (`/api/campaign/`)

**Function:** Central command for email campaign operations

**Key Capabilities:**
- Batch email sending (50/day for rate limiting)
- Campaign progress tracking
- Contact list management
- Click tracking and conversion attribution

**🔍 **Ra's Backend Query Examples:****
```
"What's the current campaign status breakdown?"
"How many follow-ups are due today?"
"Show me the next batch of emails to send"
"What are our conversion rates by campaign stage?"
"Which contacts converted in the last 7 days?"
```

### 4. Analytics Intelligence (GA4)

**Function:** Complete e-commerce funnel tracking and revenue analysis

**Key Metrics Tracked:**
- View Item → Begin Checkout → Add Shipping → Add Payment → Purchase
- Revenue attribution (discounts included)
- Cross-device user journey
- Campaign performance ROI

**Access Method:** `docs/AGENT_GA4_ACCESS.md`

**🔍 **Ra's Backend Query Examples:****
```
"What's our daily revenue for the last 7 days?"
"Show me the conversion funnel by traffic source"
"Which products have the highest conversion rates?"
"What's the average cart value?"
"Are we tracking all checkout events correctly?"
```

### 5. Meta Ads Integration

**Function:** Programmatic ad campaign management and performance monitoring

**Account:** "26 HM" (ID: act_789466743256239)
**Capabilities:** Campaign creation, spend tracking, ROAS optimization

**🔍 **Ra's Backend Query Examples:****
```
"What's the current ad spend vs revenue?"
"Show me campaign performance by ad set"
"Are we hitting target ROAS?"
"What creative is performing best?"
```

---

## 🗄️ Database Schema (Supabase)

### Core Tables:

**`reengagement_campaign`**
- 1,139 contacts with campaign tracking
- Fields: status, campaign_stage, sent_at, converted_at, clicked_at
- Batch queue management (50/day rate limit)

**`batch_send_log`**
- Daily batch send tracking
- Rate limiting compliance
- Campaign audit trail

**`campaign_click`**
- Click tracking with UTM parameters
- Campaign attribution
- User journey mapping

**`discount_click`**
- Coupon click tracking
- Revenue attribution
- Campaign ROI analysis

---

## 🎛️ Admin Dashboard (`/admin/campaign`)

**Real-time Campaign Management Interface:**

**Features:**
- Live campaign feed
- Batch upload interface
- Manual email entry
- Campaign statistics
- Conversion tracking

**Key Components:**
- `StatsHeader.tsx` - Real-time metrics display
- `LiveFeed.tsx` - Active send monitoring
- `CsvUpload.tsx` - Contact list management
- `BatchPreviewModal.tsx` - Email preview before send

---

## 🔍 Backend Monitoring Tools

### SQL Monitoring Queries (`check-campaign-status.sql`)

**Status Breakdown Query:**
```sql
SELECT status, COUNT(*) as count, 
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reengagement_campaign), 2) as percentage
FROM reengagement_campaign
GROUP BY status ORDER BY count DESC;
```

**Daily Batch Capacity:**
```sql
SELECT COUNT(*) as remaining, 50 as daily_batch_size,
       CEIL(COUNT(*) FILTER (WHERE status = 'pending')::NUMERIC / 50) as days_to_complete
FROM reengagement_campaign;
```

### Script-Based Monitoring

**Brevo Campaign Stats:**
```bash
node scripts/check-brevo-stats.js
```

**Contact Sync Status:**
```bash
node scripts/sync-contacts-to-brevo.js
```

**GA4 Analytics Test:**
```bash
node scripts/test-ga4-analytics.js
```

---

## 🚨 System Status Monitoring

### Quick Health Checks

**1. Payment System Health:**
```bash
curl -X POST https://drsebiapproved.com/api/square/verify-coupon \
  -H "Content-Type: application/json" \
  -d '{"coupon": "BLACKFRIDAY30"}'
```

**2. Brevo API Status:**
```bash
node -e "
const client = require('./src/lib/brevo-client.js');
client.testConnection().then(console.log);
"
```

**3. Database Connection:**
```bash
node query-db-direct.js
```

### Error Tracking

**Common Issues:**
- **Zoho Rate Limits:** Brevo migrated due to 550 5.4.6 spam blocks
- **Square Discount Mismatch:** Fixed with proper discount object application
- **Supabase RLS:** Always use `supabaseAdmin` for API routes

---

## 📈 Revenue & Performance Metrics

### Daily Revenue Tracking (GA4)
- E-commerce transactions with discount validation
- Average order value by product
- Conversion rate by traffic source
- Cart abandonment tracking

### Campaign ROI
- Email → Purchase attribution
- Cost per acquisition by channel
- Lifetime customer value analysis
- Break-even analysis

### Product Performance
- Sales by product line
- Inventory velocity
- Price elasticity analysis
- Cross-sell/upsell performance

---

## 🔧 Maintenance & Operations

### Daily Operations Checklist

**Morning (9 AM CST):**
1. Check Brevo daily send limit reset
2. Review campaign progress from previous day
3. Monitor GA4 revenue for 24hr trends
4. Review Meta Ads performance

**Midday (12 PM CST):**
1. Process any failed payments
2. Send receipt emails for morning transactions
3. Update campaign queues

**Evening (6 PM CST):**
1. Final daily batch send (if capacity remaining)
2. Update campaign status dashboard
3. Monitor overnight email delivery rates

### Weekly Operations

**Monday:**
- Review weekly revenue trends
- Analyze campaign performance from previous week
- Update Meta Ads budgets based on performance

**Wednesday:**
- Mid-week campaign optimization
- Review and update email templates
- Analyze conversion funnel metrics

**Friday:**
- Weekly performance summary
- Plan next week's campaign strategy
- Review inventory levels for Square catalog

---

## 🎯 Command Reference for Ra

### Revenue Monitoring
```
"Show me today's revenue vs yesterday"
"Give me the weekly revenue breakdown by product"
"Are we tracking all e-commerce events correctly?"
"What's our current conversion rate trend?"
```

### Campaign Operations
```
"Check our current email campaign status"
"How many emails are left to send today?"
"Show me campaign conversion rates"
"What email engagement rates do we have?"
```

### System Health
```
"Are there any payment processing errors?"
"Check if Brevo is within rate limits"
"Monitor our Square integration status"
"Is our GA4 tracking working correctly?"
```

### Ad Performance
```
"What's our current ad spend vs revenue?"
"Show Meta Ads performance by campaign"
"Are we hitting ROAS targets?"
"What ad creatives are performing best?"
```

---

## 🚀 Scaling for $10K MRR Goal

### Immediate Opportunities (Current Week)
1. **Email Volume Optimization:** Maximize Brevo 300/day limit
2. **Conversion Rate Optimization:** A/B test checkout flow
3. **Average Order Value:** Implement strategic upsells
4. **Meta Ads Scaling:** Increase budget on winning campaigns

### Medium-term Growth (Next 30 Days)
1. **Product Line Expansion:** Add complementary products
2. **Subscription Model:** Convert one-time purchases to recurring
3. **Influencer Partnerships:** Leverage existing Dr. Sebi brand
4. **SEO Content Marketing:** Drive organic traffic

### Long-term Strategy (Next 90 Days)
1. **International Expansion:** Multiple currency support
2. **Affiliate Program:** Scale marketing reach
3. **Mobile App:** Improve customer experience
4. **Wholesale Platform:** B2B revenue streams

---

## 📞 Emergency Contacts & Escalation

### System Dependencies
- **Square:** Production payments critical
- **Brevo:** Email marketing automation
- **Supabase:** Campaign database
- **Meta Ads:** Traffic acquisition
- **GA4:** Revenue tracking

### Critical Alerts
- Payment processing failures
- Email delivery drops >10%
- Revenue tracking breaks
- Campaign send failures

---

**🎯 Your Backend Command Center is Ready**
**Ask me anything about your Dr. Sebi Approved system - I'm now your complete backend expert!**
