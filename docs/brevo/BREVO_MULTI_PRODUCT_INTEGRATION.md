# 🎯 Brevo Multi-Product Hub Integration - Complete Implementation

**Date**: 2025-11-17
**Status**: ✅ Complete - Ready for Testing
**Branch**: `claude/review-landing-page-018yn7MLagEZW8oWf1K2bYqf`

---

## 📋 OVERVIEW

This PR transforms DrSebiApproved.com from a single-product funnel into a **multi-product wellness hub** with comprehensive Brevo email marketing integration, behavioral tracking, and intelligent customer segmentation.

### **Core Strategy**
- **Problem-based navigation** (not product-first)
- **Quiz-driven recommendations** (symptom-based, not score-based)
- **Behavioral tracking** across the entire customer journey
- **Automated segmentation** by product interest, quiz results, and purchase behavior
- **IG bio link optimized** (one link, multiple conversion paths)

---

## 🆕 WHAT'S NEW

### **1. API Endpoints** (4 new routes)

#### `/api/brevo/quiz-submit` (POST)
Handles quiz completion and product recommendation.

**Request**:
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "quizAnswers": [2, 3, 1, 2, 0, 1, 3, 2, 1, 2],
  "totalScore": 17,
  "severityLevel": "moderate",
  "recommendedProduct": "paracleanse",
  "primaryProblem": "digestive"
}
```

**Response**:
```json
{
  "success": true,
  "recommendedProduct": "paracleanse",
  "severityLevel": "moderate",
  "message": "Quiz results saved and automation triggered"
}
```

**Brevo Actions**:
- Adds contact to product-specific list (e.g., "ParaCleanse Prospects")
- Sets attributes: `QUIZ_SCORE`, `SEVERITY_LEVEL`, `RECOMMENDED_PRODUCT`, `PRIMARY_PROBLEM`
- Triggers nurture sequence (configured by AI agent in Brevo)

---

#### `/api/brevo/track-problem` (POST)
Tracks which problem visitor clicked on homepage navigation.

**Request**:
```json
{
  "email": "user@example.com", // optional
  "problem": "digestive",
  "productClicked": "paracleanse",
  "source": "homepage"
}
```

**Usage**: Called when visitor clicks problem card on homepage. Used for behavioral segmentation.

---

#### `/api/brevo/purchase-complete` (POST)
Tracks successful purchases and adds customers to product-specific lists.

**Request**:
```json
{
  "email": "customer@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "productsPurchased": [
    { "name": "ParaCleanse Elite", "quantity": 1, "price": 59.99 },
    { "name": "Sea Moss Capsules", "quantity": 1, "price": 31.99 }
  ],
  "orderValue": 91.98,
  "orderId": "sq0idp-abc123",
  "shippingAddress": { ... }
}
```

**Brevo Actions**:
- Adds to customer lists: "ParaCleanse Customers", "Sea Moss Customers"
- If bundle: adds to "Bundle Buyers" list
- Sets attributes: `LAST_PURCHASE_PRODUCT`, `ORDER_ID`, `PRODUCTS_OWNED`, etc.
- Triggers product-specific welcome sequences

---

#### `/api/brevo/cart-abandoned` (POST)
Tracks cart abandonment for recovery campaigns.

**Request**:
```json
{
  "email": "user@example.com",
  "cartItems": [ ... ],
  "cartValue": 59.99,
  "checkoutUrl": "https://drsebiapproved.com/checkout"
}
```

**Brevo Actions**:
- Sets `CART_ABANDONED: true`, `CART_VALUE`, `CART_PRODUCTS`
- Triggers 3-email abandonment sequence (15min, 2hr, 24hr)

---

### **2. Homepage Updates**

#### **New: Problem-Based Navigation Section**
Component: `src/components/ProblemNavigation.tsx`

Displays 4 problem cards:
- 😴 Chronic Fatigue & Brain Fog → Maya
- 🦠 Digestive Issues & Parasites → ParaCleanse
- ⚡ Low Energy & Weak Immunity → Sea Moss
- 🫁 Respiratory & Mucus Issues → Mucus Cleanser

**Features**:
- Tracks clicks with Brevo behavioral events
- Self-segmentation (visitor chooses their problem)
- Quiz CTA for undecided visitors
- Mobile-responsive grid layout

**Location**: Inserted between hero section and product grid on homepage.

---

### **3. Quiz Overhaul**

File: `src/app/quiz/page.tsx` - **Completely rebuilt**

#### **New Flow**:
```
10 Questions
  ↓
Email Capture Screen ← NEW!
  ↓
Submit to Brevo
  ↓
Show Results + Product Recommendation
```

#### **Key Improvements**:
- **Email required before results** (was showing results without capture)
- **Symptom-based recommendations** (analyzes dominant category: digestive, energy, mental, immunity)
- **Product-specific results screen** with direct CTA to recommended product
- **Personalized email** sent with results (AI agent configures template in Brevo)
- **Brevo identification** for behavioral tracking

#### **Recommendation Logic**:
```typescript
// Analyzes answers by category
Digestive symptoms (Q2, Q7, Q8) → ParaCleanse
Energy symptoms (Q1, Q5, Q10) → Maya
Mental symptoms (Q3, Q4, Q6) → Maya
Immunity symptoms (Q9) → Sea Moss

// Then layers in severity for upsells
Low severity: Single product
Moderate severity: Product + complementary suggestion
High severity: 2-product protocol or bundle
```

---

### **4. Checkout & Purchase Tracking**

#### **SquareCheckout.tsx Updates**:
1. **Email tracking** (Step 1 completion):
   - Identifies user in Brevo: `Brevo.push(['identify', { email, firstname }])`
   - Saves to localStorage for abandonment tracking

2. **Cart abandonment** (beforeunload event):
   - Triggers if email entered but no purchase
   - Calls `/api/brevo/cart-abandoned`
   - Uses `keepalive: true` to ensure request completes

3. **Purchase completion**:
   - Saves order data to localStorage
   - Success page reads data and calls `/api/brevo/purchase-complete`

#### **Success Page Updates** (`src/app/checkout/success/page.tsx`):
- Reads order data from localStorage
- Tracks with Brevo behavioral event
- Calls purchase API for list management
- Clears data after tracking

---

### **5. Behavioral Tracking**

#### **New Hook**: `src/hooks/useProductTracking.ts`
Reusable hook for product pages.

**Usage**:
```typescript
// In any product page (paracleanse, maya, seamoss, etc.)
import { useProductTracking } from '@/hooks/useProductTracking'

export default function ProductPage() {
  const { trackCTAClick } = useProductTracking({
    productName: 'ParaCleanse Elite',
    productSlug: 'paracleanse',
    price: 59.99
  });

  return (
    <Button onClick={() => {
      trackCTAClick('hero-section');
      // ... handle click
    }}>
      Buy Now
    </Button>
  );
}
```

**Automatically tracks**:
- Product page views
- Time spent on page (engagement metric)
- CTA clicks (when you call `trackCTAClick()`)
- Add to cart events

---

## 🎨 BREVO BEHAVIORAL EVENTS

All events automatically tracked via Brevo JS SDK:

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `problem_selected` | Homepage problem card click | problem, product, source |
| `quiz_started` | Quiz page load | timestamp |
| `quiz_completed` | All 10 questions answered | total_score, question_count |
| `page_view` | Product page visit | page, product, product_name, price |
| `product_engagement` | Leave product page (>5 sec) | product, time_spent, engaged |
| `cta_clicked` | CTA button click on product | product, cta_location, price |
| `cart_updated` | Add to cart | product, value, action |
| `cart_abandoned` | Leave checkout with email | cart_value, products |
| `order_completed` | Purchase success | order_id, revenue, products |

---

## 📊 BREVO LIST STRUCTURE

Your AI agent will create these lists programmatically:

### **Lead Lists** (Prospects)
- `Gut Health Guide Downloads` ← Already exists
- `ParaCleanse Prospects` ← Quiz recommendation = paracleanse
- `Maya Prospects` ← Quiz recommendation = maya
- `Sea Moss Prospects` ← Quiz recommendation = seamoss
- `Mucus Cleanser Prospects` ← Quiz recommendation = mucus-cleanser
- `Health Quiz Takers` ← Fallback list

### **Customer Lists**
- `ParaCleanse Customers` ← Purchased ParaCleanse
- `Maya Customers` ← Purchased Maya
- `Sea Moss Customers` ← Purchased Sea Moss
- `Mucus Cleanser Customers` ← Purchased Mucus Cleanser
- `Bundle Buyers` ← Purchased 2+ products in one order

---

## 🏷️ BREVO CONTACT ATTRIBUTES

All contact attributes (case-sensitive, UPPERCASE):

### **Core Attributes**
- `FIRSTNAME`, `LASTNAME` - Name fields
- `SOURCE` - Where they came from: `health-quiz`, `gut-health-guide`, `homepage`, `ig-bio-link`, `checkout`

### **Quiz Attributes**
- `QUIZ_SCORE` - Total score (0-30)
- `SEVERITY_LEVEL` - `low`, `moderate`, `high`
- `RECOMMENDED_PRODUCT` - `paracleanse`, `maya`, `seamoss`, `mucus-cleanser`
- `PRIMARY_PROBLEM` - `digestive`, `fatigue`, `immunity`, `respiratory`
- `QUIZ_DATE` - YYYY-MM-DD format
- `QUIZ_COMPLETED` - `true`/`false`

### **Interest Tracking**
- `PRIMARY_PROBLEM` - Problem they clicked on homepage
- `INTERESTED_PRODUCT` - Product page they visited
- `NAVIGATION_SOURCE` - Where they navigated from
- `LAST_INTERACTION` - ISO timestamp

### **Purchase Attributes**
- `LAST_PURCHASE_PRODUCT` - Most recent product slug
- `LAST_PURCHASE_VALUE` - Dollar amount
- `LAST_PURCHASE_DATE` - YYYY-MM-DD
- `ORDER_ID` - Square order ID
- `IS_BUNDLE_BUYER` - `true`/`false`
- `CUSTOMER_STATUS` - `active`, `inactive`
- `PRODUCTS_OWNED` - Comma-separated: `paracleanse,seamoss,maya`

### **Cart Abandonment**
- `CART_ABANDONED` - `true`/`false`
- `CART_VALUE` - Dollar amount
- `CART_PRODUCTS` - Comma-separated product names
- `CART_ABANDONED_DATE` - ISO timestamp
- `CHECKOUT_URL` - Full URL to resume

### **Shipping Info**
- `SHIPPING_CITY`, `SHIPPING_STATE`, `SHIPPING_ZIP`

---

## 🤖 AI AGENT TODO LIST

Your AI agent should create these automations in Brevo:

### **1. Quiz Nurture Sequences** (4 sequences, one per product)

**ParaCleanse Prospects Sequence**:
```
Trigger: Added to "ParaCleanse Prospects" list
Email 1 (Day 0): "Your Personalized Parasite Cleanse Protocol"
  - Quiz results summary
  - Why ParaCleanse is recommended
  - Education about biofilm disruption
  - CTA: View ParaCleanse →

Email 2 (Day 3): "The Hidden Parasite Problem"
  - Symptom education
  - Why standard cleanses fail
  - ParaCleanse difference (biofilm breakthrough)
  - CTA: Start Your Protocol →

Email 3 (Day 7): "Real Results from ParaCleanse Users"
  - Customer testimonials
  - Before/after stories
  - Limited-time discount: 10% off
  - CTA: Get ParaCleanse (10% off) →

Email 4 (Day 14): "Last Chance: Your Custom Protocol Expires"
  - Final reminder
  - 60-day money-back guarantee
  - FAQ addressing objections
  - CTA: Claim Your Discount →
```

Repeat similar sequences for:
- Maya Prospects
- Sea Moss Prospects
- Mucus Cleanser Prospects

---

### **2. Post-Purchase Welcome Sequences** (4 sequences)

**ParaCleanse Customers Sequence**:
```
Trigger: Added to "ParaCleanse Customers" list
Email 1 (Day 0): "Your ParaCleanse is On Its Way!"
  - Order confirmation
  - What to expect during cleanse
  - Preparation tips
  - Usage guide PDF attachment

Email 2 (Day 3): "Preparing for Your Cleanse"
  - Dietary recommendations
  - What to avoid during cleanse
  - Hydration tips
  - Support email for questions

Email 3 (Day 7): "You're Halfway There!"
  - Check-in on progress
  - Common experiences (detox symptoms normal)
  - Encouragement to continue
  - CTA: Need more? Reorder link

Email 4 (Day 14): "Congratulations! What's Next?"
  - Celebration of completion
  - Maintenance protocol: Sea Moss recommendation
  - Bundle offer: ParaCleanse + Sea Moss (save 20%)
  - CTA: Build Your Maintenance Stack →

Email 5 (Day 21): "Keep the Results Going"
  - Maya Formula upsell (blood purification)
  - How Maya complements ParaCleanse
  - Complete wellness bundle offer
  - CTA: Upgrade to Complete Protocol →
```

Repeat for other customer lists with product-specific content.

---

### **3. Cart Abandonment Sequence**

```
Trigger: Contact attribute CART_ABANDONED = true
Email 1 (15 minutes): "Forgot Something?"
  - Simple reminder
  - Cart contents with images
  - CTA: Complete Your Order → [CHECKOUT_URL]

Email 2 (2 hours): "Questions About Your Order?"
  - Address common objections
  - Testimonials & social proof
  - FAQ section
  - CTA: Complete Your Purchase →

Email 3 (24 hours): "Special Discount Just for You"
  - 10% discount code: COMPLETE10
  - 60-day guarantee reminder
  - Testimonials
  - CTA: Claim Your Discount → [CHECKOUT_URL + coupon]

Email 4 (48 hours): "Last Chance: Your Cart Expires Soon"
  - Final urgency
  - Full guarantee details
  - Customer support email
  - CTA: Complete Order Now →
```

---

### **4. Product Page Visitor Sequence** (Behavioral)

```
Trigger: Visited product page 2+ times (Brevo event tracking) + No purchase
Email 1 (Day 2): "Still Thinking About [Product]?"
  - Address hesitation
  - Key benefits reminder
  - CTA: Learn More →

Email 2 (Day 5): "How [Product] Works"
  - Detailed education
  - Ingredient breakdown
  - Science behind it
  - CTA: Try Risk-Free →

Email 3 (Day 10): "Success Stories"
  - Customer testimonials
  - Specific results
  - Social proof
  - CTA: Join Them →

Email 4 (Day 15): "Limited-Time Offer"
  - Special pricing
  - Bundle suggestion
  - Expiration urgency
  - CTA: Claim Offer →
```

---

### **5. Multi-Product Browser Sequence** (Behavioral)

```
Trigger: Visited 3+ different product pages + No purchase
Email 1 (Immediate): "Not Sure Which Product?"
  - CTA to quiz
  - "Take our 60-second quiz for personalized recommendations"

Email 2 (Day 1): "Build Your Custom Protocol"
  - Product comparison chart
  - Bundle options
  - Save money message
  - CTA: Explore Bundles →

Email 3 (Day 3): "Complete Wellness System"
  - All 4 products bundle
  - Save 25% offer
  - Comprehensive protocol guide
  - CTA: Get Complete System →
```

---

## 🔧 TESTING INSTRUCTIONS

### **1. Quiz Flow Test**
```
1. Go to /quiz
2. Answer all 10 questions (vary answers for different outcomes)
3. VERIFY: Email capture screen appears
4. Enter test email: kingthriva@gmail.com
5. VERIFY: Email received with quiz results
6. VERIFY: Results page shows correct product recommendation
7. VERIFY: Contact added to correct Brevo list (check Brevo dashboard)
8. VERIFY: Contact attributes set correctly
```

### **2. Homepage Navigation Test**
```
1. Go to homepage
2. Click on a problem card (e.g., "Digestive Issues")
3. VERIFY: Navigates to correct product page
4. CHECK: Browser console for tracking event
5. CHECK: Brevo behavioral tracking dashboard for "problem_selected" event
```

### **3. Purchase Flow Test**
```
1. Add product to cart
2. Go to checkout
3. Enter email + name (Step 1)
4. VERIFY: Brevo identification event in console
5. Complete address (Step 2)
6. Complete payment with test card (Step 3)
7. VERIFY: Success page loads
8. VERIFY: Purchase tracked in Brevo
9. VERIFY: Contact added to customer list
10. VERIFY: Purchase attributes set
11. CHECK: localStorage.getItem('lastOrder') is cleared
```

### **4. Cart Abandonment Test**
```
1. Add product to cart
2. Go to checkout
3. Enter email (Step 1), proceed to Step 2
4. Close browser tab
5. VERIFY: `/api/brevo/cart-abandoned` called (check Network tab before closing)
6. VERIFY: Contact has CART_ABANDONED = true in Brevo
7. VERIFY: Cart abandonment email received within 15 minutes
```

### **5. Product Page Tracking Test**
```
1. Visit /paracleanse (or any product page)
2. Stay on page for 30+ seconds
3. VERIFY: Console logs show tracking events
4. CHECK: Brevo dashboard for "page_view" event
5. Leave page
6. VERIFY: "product_engagement" event tracked
```

---

## 📁 FILES CREATED/MODIFIED

### **New Files** ✨
```
src/app/api/brevo/quiz-submit/route.ts
src/app/api/brevo/track-problem/route.ts
src/app/api/brevo/purchase-complete/route.ts
src/app/api/brevo/cart-abandoned/route.ts
src/components/ProblemNavigation.tsx
src/hooks/useProductTracking.ts
BREVO_MULTI_PRODUCT_INTEGRATION.md (this file)
```

### **Modified Files** 📝
```
src/app/page.tsx
  - Added ProblemNavigation component

src/app/quiz/page.tsx
  - Complete rebuild with email capture
  - Symptom-based recommendations
  - Brevo integration

src/app/checkout/success/page.tsx
  - Added Brevo purchase tracking
  - localStorage order data handling

src/components/SquareCheckout.tsx
  - Email identification tracking
  - Cart abandonment tracking
  - Order data persistence
```

---

## 🎯 PRODUCT SLUG REFERENCE

Use these exact slugs everywhere (URLs, Brevo attributes, tracking events):

| Product | Slug | Price |
|---------|------|-------|
| ParaCleanse Elite | `paracleanse` | $59.99 |
| Maya Formula | `maya` | $44.99 |
| Sea Moss Capsules | `seamoss` | $31.99 |
| Mucus Cleanser | `mucus-cleanser` | TBD |

---

## 🚀 DEPLOYMENT CHECKLIST

### **Before Deploying**:
- [ ] Run `npm run build` - verify no errors
- [ ] Test quiz flow locally
- [ ] Test homepage navigation
- [ ] Verify Brevo API key in `.env.local`
- [ ] Check all tracking events fire in console

### **After Deploying**:
- [ ] Test quiz on production
- [ ] Submit test purchase
- [ ] Verify Brevo lists populate
- [ ] Check email delivery (kingthriva@gmail.com)
- [ ] Monitor Brevo rate limits (100 req/hour general)

### **AI Agent Tasks** (Do in Brevo Dashboard):
- [ ] Create all prospect lists
- [ ] Create all customer lists
- [ ] Build quiz nurture sequences (4 sequences)
- [ ] Build post-purchase sequences (4 sequences)
- [ ] Build cart abandonment sequence
- [ ] Build behavioral sequences (product visitors, browsers)
- [ ] Create email templates
- [ ] Test automation triggers
- [ ] Set up segments for highly engaged users

---

## 💡 FUTURE ENHANCEMENTS

### **Phase 2** (Next Sprint):
1. **Exit-Intent Popup** - Lead magnet modal on exit
2. **Blog Tracking** - Track article engagement
3. **Scroll Depth Tracking** - Measure content consumption
4. **A/B Testing** - Test headlines, CTAs via Brevo
5. **SMS Integration** - Cart abandonment via SMS (Brevo SMS)
6. **Product Recommendations** - "Customers who bought X also bought Y"
7. **Loyalty Program** - Reward repeat purchases
8. **Referral Tracking** - Track customer referrals

### **Phase 3** (Future):
1. **Predictive Analytics** - AI-powered product recommendations
2. **Dynamic Pricing** - Personalized discounts based on behavior
3. **Multi-variate Testing** - Test full page variations
4. **Customer Health Scores** - Engagement scoring
5. **Win-back Campaigns** - Re-engage inactive customers

---

## 📞 SUPPORT & TROUBLESHOOTING

### **Common Issues**:

**Quiz email not sending**:
- Check Brevo API key is set
- Verify daily sending limit (300/day on free plan)
- Check Brevo logs in dashboard

**Tracking events not firing**:
- Verify Brevo JS installed: Check `layout.tsx` for `<script>` tag
- Check browser console for `(window as any).Brevo` availability
- Ad blockers may block Brevo tracker

**Purchase not tracked**:
- Verify localStorage has order data
- Check Network tab for `/api/brevo/purchase-complete` call
- Ensure success page loaded (not redirected away)

**Rate limit errors**:
- Free plan: 100 requests/hour (general), 36k/hour (contacts)
- If exceeded, requests queue or fail
- Monitor Brevo usage in dashboard

---

## ✅ SUCCESS METRICS

Track these KPIs post-launch:

| Metric | Goal | How to Track |
|--------|------|--------------|
| Quiz completion rate | >60% | (Quiz completes / Quiz starts) |
| Email capture rate | >70% | (Emails captured / Quiz completes) |
| Homepage → Product | >15% CTR | Problem card clicks / Homepage visits |
| Cart abandonment recovery | >8% conversion | Abandoned cart emails → Purchases |
| Post-purchase upsell | >12% conversion | Customer list → 2nd purchase |
| Average order value | $80+ | Track bundle purchases |
| Customer LTV (90 days) | $150+ | Repeat purchases within 90 days |

---

## 🎉 CONCLUSION

This integration transforms DrSebiApproved.com into an intelligent, self-segmenting multi-product hub that:

✅ Captures more leads (quiz, problem navigation)
✅ Segments automatically (by symptoms, product interest, behavior)
✅ Nurtures intelligently (personalized sequences)
✅ Recovers abandoned carts (automated sequences)
✅ Maximizes LTV (cross-sells, upsells, bundles)
✅ Tracks everything (Brevo behavioral + custom events)

**Next Steps**:
1. Test everything locally
2. Deploy to production
3. Use AI agent to build automations in Brevo
4. Monitor analytics and iterate

---

**Questions?** Contact Ra at kingthriva@gmail.com
**Brevo Dashboard**: https://app.brevo.com
**API Docs**: See `docs/brevo-api-wrapper.md`
