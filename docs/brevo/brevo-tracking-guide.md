# 🎯 Brevo Tracking Guide - What We Can Track & How to Use It

## 📊 What We Can Track Now

### **1. Visitor Journey Tracking**

**Every visitor interaction is tracked automatically:**

```
Anonymous Visitor
    ↓
Visits Homepage → Track: page_view
    ↓
Clicks "Digestive Issues" problem card → Track: problem_selected (problem=digestive)
    ↓
Views ParaCleanse product page → Track: page_view (product=paracleanse, price=59.99)
    ↓
Clicks "Buy Now" → Track: cta_clicked (cta_location=hero-section)
    ↓
Enters email at checkout → IDENTIFIED! (Now we know who they are)
    ↓
Abandons cart → Track: cart_abandoned (cart_value=59.99)
    ↓
Receives recovery email sequence
    ↓
Returns and completes purchase → Track: order_completed (revenue=59.99)
    ↓
Added to "ParaCleanse Customers" list
```

---

## 🔍 Real-Time Data You Can Access

### **Contact-Level Data**

For any email address, you can see:

```javascript
{
  // Identity
  email: "customer@example.com",
  firstName: "John",

  // Quiz Data
  QUIZ_SCORE: 17,
  SEVERITY_LEVEL: "moderate",
  RECOMMENDED_PRODUCT: "paracleanse",
  PRIMARY_PROBLEM: "digestive",
  QUIZ_DATE: "2025-11-17",

  // Interest Tracking
  INTERESTED_PRODUCT: "paracleanse,seamoss", // Products they viewed
  NAVIGATION_SOURCE: "homepage",
  LAST_INTERACTION: "2025-11-17T15:30:00Z",

  // Purchase History
  LAST_PURCHASE_PRODUCT: "paracleanse",
  LAST_PURCHASE_VALUE: 59.99,
  LAST_PURCHASE_DATE: "2025-11-17",
  ORDER_ID: "sq0idp-abc123",
  PRODUCTS_OWNED: "paracleanse",
  CUSTOMER_STATUS: "active",

  // Cart Abandonment
  CART_ABANDONED: "true",
  CART_VALUE: 59.99,
  CART_PRODUCTS: "ParaCleanse Elite",
  CART_ABANDONED_DATE: "2025-11-17T14:20:00Z",

  // Behavioral Data (tracked by Brevo JS)
  email_opens: 5,
  email_clicks: 3,
  page_views: 12,
  time_on_site: "8m 32s"
}
```

---

## 💬 How to Interact with Claude to Access Data

### **Example Conversations**

#### **Scenario 1: Check High-Intent Leads**

**You:** "Show me everyone who took the quiz today but hasn't purchased yet"

**Claude:** *Queries Brevo API and returns:*

```
📊 Quiz Takers - No Purchase (Today: 2025-11-17)

Total: 23 contacts

High Priority (Severity: High) - 8 contacts:
1. sarah@example.com
   - Recommended: ParaCleanse
   - Problem: Digestive
   - Score: 24 (high severity)
   - Quiz taken: 2h ago
   - Product page visited: Yes
   - Cart abandoned: No
   → ACTION: Send follow-up with urgency message

2. mike@example.com
   - Recommended: Maya
   - Problem: Fatigue
   - Score: 21 (high severity)
   - Quiz taken: 5h ago
   - Product page visited: Yes
   - Cart abandoned: Yes ($44.99)
   → ACTION: Send cart recovery email NOW
```

---

#### **Scenario 2: Analyze Cart Abandonment**

**You:** "Who abandoned their cart in the last 24 hours?"

**Claude:** *Queries and returns:*

```
🛒 Cart Abandonment Report (Last 24h)

Total abandoned carts: 12
Total value: $647.88

High Value Abandoners:
1. john@example.com - $91.98 (ParaCleanse + Sea Moss bundle)
   - Abandoned: 3 hours ago
   - Email sequence: Step 1 sent

2. lisa@example.com - $59.99 (ParaCleanse)
   - Abandoned: 18 hours ago
   - Email sequence: Step 3 sent (final discount)
   - Product page revisited: Yes (15 min ago)
   → ACTION: Follow up personally - she's hot!
```

---

#### **Scenario 3: Customer Purchase Behavior**

**You:** "Show me customers who bought ParaCleanse in the last week"

**Claude:** *Returns:*

```
💰 ParaCleanse Customers (Last 7 Days)

Total customers: 15
Total revenue: $899.85
Average order value: $59.99

Ready for Upsell (Day 7-14 post-purchase):
1. emily@example.com
   - Purchased: 8 days ago
   - Order: ParaCleanse ($59.99)
   - Emails opened: 4/4 (100% open rate)
   - Last email: "Halfway There!" (Day 7)
   → ACTION: Send Sea Moss upsell (maintenance phase)

2. david@example.com
   - Purchased: 12 days ago
   - Order: ParaCleanse ($59.99)
   - Emails opened: 3/4 (75% open rate)
   - Product pages visited: Maya (viewed 2x yesterday)
   → ACTION: Send Maya upsell email TODAY
```

---

#### **Scenario 4: Segment Analysis**

**You:** "How many people are interested in digestive health but haven't bought yet?"

**Claude:** *Creates segment and returns:*

```
🎯 Segment: Digestive Health Interest - No Purchase

Total contacts: 147

Breakdown by source:
- Quiz takers (PRIMARY_PROBLEM=digestive): 56
- Homepage navigation (clicked digestive card): 41
- Product page visitors (paracleanse): 50

Engagement levels:
- High engagement (3+ page views, 2+ emails opened): 32 contacts
  → ACTION: Send limited-time discount offer

- Medium engagement (1-2 page views, 1+ email): 68 contacts
  → ACTION: Continue nurture sequence

- Low engagement (1 page view, 0 emails): 47 contacts
  → ACTION: Re-engagement campaign with new angle
```

---

#### **Scenario 5: ROI Analysis**

**You:** "Show me the performance of the quiz funnel this month"

**Claude:** *Analyzes and returns:*

```
📈 Quiz Funnel Performance (November 2025)

Quiz Stats:
- Quiz starts: 412
- Quiz completions: 289 (70.1% completion rate)
- Emails captured: 289 (100% - required before results)

Conversion Path:
289 quiz takers
  ↓ 156 visited recommended product page (54%)
  ↓ 89 added to cart (31% of takers, 57% of visitors)
  ↓ 34 completed purchase (11.8% quiz-to-sale conversion)

Revenue Attribution:
- Direct quiz sales: $2,039.66 (34 orders)
- Average order value: $59.99
- Quiz attribution value: $7.05 per quiz taker

Top Performing Recommendation:
1. ParaCleanse: 18 purchases (53% of quiz sales)
2. Maya: 9 purchases (26%)
3. Sea Moss: 5 purchases (15%)
4. Mucus Cleanser: 2 purchases (6%)

Email Performance (Quiz Nurture Sequences):
- Average open rate: 28.4%
- Average click rate: 6.2%
- Sequence-to-sale conversion: 15.3%
```

---

## 🚀 Benefits of What We Just Built

### **1. Zero Manual Work Required**

**Before:**
- Manually track leads in spreadsheet
- Guess what products people are interested in
- Send batch emails to everyone the same way
- No idea who's hot vs cold

**Now:**
- Automatic tracking of every interaction
- AI knows exactly what each person needs
- Personalized email sequences per product interest
- Real-time alerts on high-intent leads

---

### **2. Revenue Optimization**

**Cart Abandonment Recovery:**
- Industry average recovery: 8-12%
- Your potential: 12 abandoned carts/day × $60 avg = $720/day
- 10% recovery = $72/day = **$2,160/month recovered revenue**

**Upsell Automation:**
- 15 ParaCleanse customers/week
- 20% upsell rate to Sea Moss or Maya
- 3 upsells/week × $35 avg = $105/week = **$420/month upsell revenue**

**Quiz-to-Sale Funnel:**
- 100 quiz takers/week
- 12% conversion rate
- 12 sales/week × $60 avg = $720/week = **$2,880/month quiz revenue**

**Total New Revenue Potential: $5,460/month**

---

### **3. Customer Intelligence**

You now know:
- **Who's ready to buy** (high quiz score + product page visits + cart abandonment)
- **What they need** (quiz recommendations, problem navigation clicks)
- **When to reach out** (cart abandoned 2 hours ago = perfect time)
- **How engaged they are** (email opens, page views, time on site)
- **What to say** (personalized based on their symptoms and behavior)

---

### **4. Claude Can Be Your Marketing Manager**

**Daily Marketing Tasks Claude Can Do:**

```
Morning Briefing (9 AM):
"Show me overnight activity and hot leads"

Midday Check (12 PM):
"Who's visiting product pages right now but hasn't bought?"

Afternoon Analysis (3 PM):
"Analyze today's cart abandonment and send recovery emails"

Evening Review (6 PM):
"What were today's wins and who needs follow-up tomorrow?"

Weekly Strategy (Monday 9 AM):
"Show me last week's performance and recommend this week's campaigns"
```

---

### **5. Automated Segmentation**

**No more manual list management:**

When someone completes quiz → Automatically added to product-specific list
When someone buys → Automatically moved to customer list
When someone abandons cart → Automatically tagged for recovery sequence
When someone buys 2+ products → Automatically tagged as bundle buyer

**You can create segments on the fly:**

"Show me everyone who:
- Took the quiz
- Scored high severity
- Viewed ParaCleanse 2+ times
- Hasn't purchased
- Opened at least 1 email

→ Send them a personalized discount code"

---

## 🎯 Real-World Usage Scenarios

### **Scenario: Texas Networking Event**

**Before event:**
**You:** "Create a welcome sequence for networking event signups"

**Claude:** Creates list, sets up automation, generates QR code for signup

**After event:**
**You:** "Show me who signed up at the event yesterday"

**Claude:** Returns 23 contacts with source=networking-event

**You:** "Send them the welcome email with event follow-up"

**Claude:** Triggers personalized sequence

**Next day:**
**You:** "Who opened the email and clicked?"

**Claude:** Shows 12 hot leads who engaged

**You:** "Add them to high-priority list and send quiz invitation"

**Claude:** Segments and sends

---

### **Scenario: Instagram Story Campaign**

**You run IG story with quiz link**

**You:** "How many people took the quiz from Instagram today?"

**Claude:** *Checks SOURCE=ig-story:*
"47 quiz takers from Instagram
- 28 completed quiz (59% completion)
- 18 visited product pages (38% from IG)
- 5 purchased (10.6% conversion)
- Revenue from IG today: $299.95"

**You:** "Show me the non-buyers who scored high"

**Claude:** Returns 12 high-severity leads

**You:** "Send them a DM-style email with 10% discount code IGFAM10"

**Claude:** Sends personalized emails with tracking

---

### **Scenario: Launch New Product (Mucus Cleanser)**

**You:** "Who should I target for the new Mucus Cleanser launch?"

**Claude:** *Analyzes behavioral data:*
```
🎯 Mucus Cleanser Launch Targets

Primary Audience (347 contacts):
- Quiz takers with respiratory symptoms: 89
- Blog readers of mucus-related articles: 124
- Customers who bought ParaCleanse (complementary): 134

Segmented by readiness:
HOT (ready now): 67 contacts
  → Send launch announcement with early-bird discount

WARM (need nurture): 198 contacts
  → Send education sequence about mucus health

COLD (need awareness): 82 contacts
  → Send symptom quiz specific to respiratory issues
```

**You:** "Launch it. Send the campaigns."

**Claude:** Executes all three campaigns with tracking

**Next day:**
**You:** "How's the launch performing?"

**Claude:** *Real-time metrics:*
"Mucus Cleanser Launch - 24 Hour Report
- Emails sent: 347
- Opens: 112 (32.3%)
- Clicks: 41 (36.6% of opens)
- Product page visits: 29
- Add to cart: 12
- Purchases: 4 ($127.96 revenue)
- ROI: 320% (compared to email cost)"

---

## 🔮 Advanced Use Cases

### **Predictive Analysis**

**You:** "Based on behavior patterns, who's most likely to buy this week?"

**Claude:** Uses ML scoring:
```
🎯 High Purchase Probability This Week

Top 10 Leads (80%+ probability):
1. jessica@example.com (94% probability)
   - Signals: Quiz high score, 5 product page visits, 2 cart additions (abandoned), opens every email, clicked 3x
   → ACTION: Personal outreach with urgency offer

2. marcus@example.com (87% probability)
   - Signals: Quiz moderate score, 3 product page visits, read 2 blog articles, 100% email engagement
   → ACTION: Send testimonial email + limited stock alert
```

---

### **Cohort Analysis**

**You:** "Compare performance of quiz takers vs homepage visitors"

**Claude:**
```
📊 Cohort Comparison: Quiz Takers vs Homepage Visitors

Quiz Takers (SOURCE=health-quiz):
- Count: 289
- Conversion rate: 11.8%
- Average order value: $59.99
- Email engagement: 28.4% opens
- Time to purchase: 4.2 days avg

Homepage Visitors (SOURCE=homepage):
- Count: 412
- Conversion rate: 3.2%
- Average order value: $52.14
- Email engagement: 18.7% opens
- Time to purchase: 8.7 days avg

📈 INSIGHT: Quiz takers convert 3.7x better and buy faster
→ RECOMMENDATION: Invest more in quiz traffic (IG ads, blog CTAs)
```

---

## 💡 Summary: Why This Is Powerful

**You now have:**

1. ✅ **Complete visibility** into every customer touchpoint
2. ✅ **Automated segmentation** based on behavior and intent
3. ✅ **AI-powered insights** from Claude analyzing data in real-time
4. ✅ **Personalized automation** that feels human but scales infinitely
5. ✅ **Revenue recovery systems** (cart abandonment, re-engagement)
6. ✅ **Predictive intelligence** to focus on highest-value opportunities

**How to use it:**

Just talk to Claude like a marketing manager:
- "Show me [what you want to know]"
- "Send [campaign type] to [segment]"
- "Analyze [metric or timeframe]"
- "Who should I focus on today?"

Claude handles the API calls, data analysis, segmentation, and execution.

**Your new workflow:**

1. Ask Claude for daily insights
2. Review hot leads and opportunities
3. Make strategic decisions
4. Claude executes campaigns automatically
5. Track results in real-time
6. Optimize based on data

**Bottom line:** You went from flying blind to having a 24/7 AI marketing analyst and executor. That's the power of what we just built. 🚀
