# Agent GA4 Access Guide
## Natural Language Analytics for Gemini, Claude & Kiro

**All AI agents can now query and manage Google Analytics 4 using simple natural language commands.**

---

## 🎯 Quick Start

### Ask Me Anything About Your Analytics

```bash
# Real-time data
"show real-time users right now"
"how many people are on the site"

# Traffic sources
"get traffic sources last 30 days"
"which source converts best this week"

# Conversions
"show purchase conversions last 7 days"
"newsletter signups this month"

# Product performance
"show ParaCleanse sales today"
"which product sells most"
```

**Just ask in plain English - I'll query GA4 and give you insights!**

---

## 📊 What You Can Query

### Traffic & Audience
- Real-time active users
- Traffic sources (organic, direct, referral)
- User demographics
- Device breakdown (mobile, desktop)
- Geographic data

### Conversions & Goals
- Purchase events (with product details)
- Newsletter signups
- Quiz completions
- Email link clicks
- Custom conversion events

### E-Commerce
- Revenue (total and per-product)
- Transaction count
- Average order value
- Product performance
- Coupon usage

### Black Friday Specific
- Funnel drop-off rates:
  - Product view → Add to cart
  - Add to cart → Begin checkout
  - Checkout steps → Purchase
- Bundle/upsell effectiveness
- Discount impact on conversion

---

## 🛠️ What You Can Create/Update

### Create Conversion Events
```bash
"create conversion for video_completion"
"add conversion event for pdf_download with $35 value"
```

### Create Custom Dimensions
```bash
"create user dimension for customer_tier"
"create event dimension for campaign_source"
```

### View Configuration
```bash
"show all conversion goals"
"list custom dimensions"
"show account summary"
```

---

## 💬 Example Commands for Each Agent

### Gemini (Campaign Manager)
```bash
# Check email campaign performance
"show email_link_click conversions from Zoho campaign last 7 days"

# Monitor real-time during send
"real-time users right now"

# Compare campaign effectiveness
"traffic from email vs organic this week"

# ROI tracking
"calculate conversion rate from newsletter signups to purchases"
```

### Claude (Content Strategist)
```bash
# Blog performance
"show blog_read_complete events by page last 30 days"

# Quiz funnel
"quiz completions to newsletter signups conversion rate"

# Content ROI
"which traffic source has highest time on site"

# Engagement metrics
"show audience demographics for blog readers"
```

### Kiro (Growth Optimizer)
```bash
# Black Friday monitoring
"show purchase conversions today compared to yesterday"

# Product performance
"which product has highest add-to-cart rate"

# Funnel optimization
"show drop-off rate from product view to purchase"

# Upsell effectiveness
"how many checkouts added bundle items this week"
```

---

## 🔥 Black Friday Dashboard Queries

### Morning Check (9am Daily)
```bash
"show yesterday's performance: purchases, revenue, top products"
```

### Hourly Monitoring
```bash
"real-time users + purchase conversions last hour"
```

### End of Day Report
```bash
"today vs yesterday: revenue, conversions, average order value"
```

### Campaign Attribution
```bash
"show conversions by traffic source today"
"which campaign drove most revenue"
```

---

## 🎯 Advanced Queries

### Funnel Analysis
```bash
"show full funnel: view_item → add_to_cart → purchase with conversion rates"
```

### Cohort Comparison
```bash
"compare first-time buyers vs returning customers this week"
```

### Time-Based Trends
```bash
"show purchase trend by hour today"
"compare weekday vs weekend performance"
```

### Product Deep Dive
```bash
"ParaCleanse performance: views, carts, purchases, revenue last 7 days"
```

---

## 📈 Automated Reporting

### Daily Digest (Set Up Cron)
Create a script that runs every morning:

```javascript
// Auto-run at 9am daily
const queries = [
  "show purchase conversions last 24 hours",
  "get traffic sources yesterday", 
  "real-time users right now",
  "top 3 products by revenue yesterday"
];

for (const query of queries) {
  const result = await fetch('/api/analytics/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: query })
  });
  console.log(await result.json());
}
```

---

## 🧠 How It Works (Behind the Scenes)

```
Your Question
    ↓
Natural Language Parser
    ↓
GA4 API Client
    ↓
Data + AI Insights
    ↓
Structured JSON Response
```

**API Endpoint:** `POST /api/analytics/claude`

**Request Format:**
```json
{
  "command": "show newsletter conversions last 7 days"
}
```

**Response Format:**
```json
{
  "success": true,
  "intent": "newsletter_conversions_query",
  "data": { /* raw GA4 data */ },
  "insights": ["47 signups this week", "↑ 23% vs last week"],
  "message": "Newsletter conversions retrieved",
  "timestamp": "2025-11-25T03:05:23.407Z"
}
```

---

## 🔐 Access & Permissions

### What's Configured
- ✅ Property ID: `499835727` (DrSebiApproved)
- ✅ Service Account: Shared from FortunatusPurse
- ✅ Permissions: Analytics Editor (read + write)
- ✅ APIs Enabled: Data API + Admin API

### Security
- Service account credentials in `./keys/` (git-ignored)
- Server-side only (not exposed to frontend)
- Shared property with FortunatusPurse (filter by domain for DrSebi data)

---

## 🎨 Custom Dimensions Created

| Dimension | Scope | Purpose |
|-----------|-------|---------|
| `content_category` | Event | Blog/quiz category |
| `product_name` | Event | Product tracking |
| `campaign_stage` | User | Email funnel stage |
| `user_wellness_tier` | User | Customer journey |

*Note: Run `npm run setup:ga4` to create these if not already configured.*

---

## 🚨 Limitations & Best Practices

### API Rate Limits
- **Data API**: 200 requests/day (free tier)
- **Admin API**: 60 requests/minute
- **Solution**: Cache frequent queries, batch requests

### Data Freshness
- Real-time data: ~30 seconds delay
- Standard reports: 24-48 hour processing
- For immediate data: Use real-time reports

### Query Tips
- ✅ Be specific: "last 7 days" not "recently"
- ✅ Use GA4 event names: "purchase" not "sales"
- ✅ Request insights: "compare" or "analyze" for AI analysis
- ❌ Avoid vague: "show me everything"

---

## 📚 Full Command Reference

### Data Queries
```bash
"show [event_name] conversions [timeframe]"
"get traffic sources [timeframe]"
"audience demographics [timeframe]"
"real-time users right now"
"show all conversions [timeframe]"
```

### Configuration
```bash
"list all conversion goals"
"create conversion for [event_name]"
"create [user/event] dimension for [parameter_name]"
"show account summary"
```

### Analysis
```bash
"which traffic source converts best"
"analyze conversion trends [timeframe]"
"compare this month vs last month"
"calculate [metric] conversion rate"
```

---

## 🎯 Black Friday Success Metrics

Track these KPIs daily:

1. **Revenue**: Total and per-product
2. **Conversion Rate**: view_item → purchase
3. **Average Order Value**: With/without bundles
4. **Traffic Quality**: Bounce rate by source
5. **Funnel Drop-offs**: Each checkout step
6. **Upsell Rate**: % adding bundles
7. **Coupon Usage**: BLACKFRIDAY30 redemption

---

## 💡 Pro Tips

### Quick Performance Check
```bash
"show account summary" 
# Gets: total conversions, active dimensions, property health
```

### Find Drop-Offs
```bash
"show begin_checkout vs purchase conversions last 7 days"
# Calculate: (purchases / checkouts) = checkout completion rate
```

### Product Winners
```bash
"show all purchases with product breakdown yesterday"
# See: which products drive revenue
```

### Campaign ROI
```bash
"show conversions by traffic source + revenue this week"
# Calculate: revenue per source
```

---

## 🚀 Next Steps

1. **Test it**: Ask me "show real-time users right now"
2. **Create report**: Schedule daily digest at 9am
3. **Monitor Black Friday**: Set up hourly checks Nov 25-29
4. **Optimize**: Use funnel data to fix drop-offs

---

**Questions? Just ask me in plain English - I'll query GA4 and give you insights!**

Example: *"Hey Gemini, how's Black Friday going? Show me today's revenue vs yesterday."*
