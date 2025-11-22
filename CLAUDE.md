# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

*note: sometime I talk to via voice to text, so sometimes text might not make sense, just feel what i am implying and keep it moving, if you absolutey are confused ask for clarity.

## Project Overview

This is a Next.js-based landing page for Dr. Sebi's Original Products & Systems. This is a premium wellness brand focused on authentic, natural healing products. **Sales and fulfillment handled via Square + Shippo integration**, while this site serves as the e-commerce frontend with **dual email infrastructure: Zoho for transactional/manual campaigns and Brevo for marketing automation**.

## Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

### Deployment
```bash
git add .
git commit -m "Your commit message"
git push origin main
# Render.com automatically deploys from GitHub
```

## Architecture & Tech Stack

### Core Technologies
- **Next.js 14.1.0** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Zoho Mail API** for email campaign management
- **Supabase** for campaign database (PostgreSQL)
- **Framer Motion** for animations
- **MDX** for blog content management

### Key Dependencies
- `@supabase/supabase-js` - Database client for campaign tracking
- `@radix-ui/*` - Accessible UI primitives (shadcn/ui)
- `next-mdx-remote` - Dynamic blog content
- `html2canvas` - Screenshot functionality
- `reading-time` - Blog reading time estimation
- `dotenv` - Environment variable management
- **Square SDK** - Payment processing and order management
- **Shippo API** - Automated shipping label creation and tracking

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── admin/campaign/           # Campaign admin dashboard
│   │   ├── page.tsx              # Main campaign dashboard
│   │   └── components/           # Dashboard components
│   ├── api/campaign/             # Campaign API routes
│   │   ├── status/               # Campaign stats endpoint
│   │   ├── send-batch/           # Batch email sender
│   │   ├── upload-list/          # CSV upload handler
│   │   ├── delete-email/         # Delete individual email
│   │   ├── clear-all/            # Clear all campaign data
│   │   └── track-click/          # Click tracking endpoint
│   ├── api/auth/zoho/            # Zoho OAuth flow
│   ├── blog/[slug]/              # Dynamic blog posts
│   ├── quiz/                     # Interactive health quiz
│   ├── links/                    # Link pages
│   └── page.tsx                  # Main landing page
├── components/
│   ├── ui/                       # Reusable UI components (shadcn/ui)
│   └── Header.tsx                # Main navigation
├── lib/
│   ├── blog.ts                   # Blog content management
│   ├── mdx-components.tsx        # MDX component mapping
│   ├── supabase.ts               # Supabase client config
│   ├── zoho.ts                   # Zoho Mail API client
│   └── utils.ts                  # Shared utilities
├── content/blog/                 # MDX blog posts with frontmatter
├── prisma/migrations/            # Database schema migrations
└── sessions/                     # Claude session logs
```

## Important Patterns

### E-commerce Integration
- **Payment Processing**: Square Payment API (embedded checkout)
- **Order Management**: Square Orders API with customer profiles
- **Shipping & Fulfillment**: Shippo API for automated label creation
- **Customer Journey**: Landing page → Multi-step checkout → Square payment → Automated shipping
- **Integration Flow**: Site checkout → Square order + customer → Shippo auto-label → Tracking update → Customer notification

### Content Management
- Blog posts are MDX files in `content/blog/` with frontmatter metadata
- Dynamic routing via `app/blog/[slug]/page.tsx`
- Reading time calculation and SEO optimization built-in
- MDX components mapped in `lib/mdx-components.tsx`

### Brand Guidelines (from .cursorrules)
- **Tone**: Authoritative but accessible, educational focus
- **Messaging**: Heritage & authenticity, holistic wellness approach
- **Visual**: Clean layouts, natural imagery, premium positioning
- **Compliance**: Include appropriate health disclaimers

### Design System
- Primary brand color: Green (#22c55e)
- Typography: Inter font family
- Mobile-first responsive design
- Custom Tailwind configuration with CSS variables
- Framer Motion for smooth interactions

## Environment Setup

Required environment variables:
```env
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://ohxtngzmyamixwfvisje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Zoho Mail API (for email campaigns)
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/auth/zoho/callback
ZOHO_FROM_EMAIL=info@drsebiapproved.com
ZOHO_FROM_NAME=Dr. Sebi Approved

# Square Payment & Orders API
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-square-app-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-square-location-id
SQUARE_ACCESS_TOKEN=your-square-access-token
SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-signing-key

# Shippo Shipping API (for automated fulfillment)
SHIPPO_API_TOKEN=your-shippo-live-token
SHIPPO_TEST_TOKEN=your-shippo-test-token

# Warehouse/Fulfillment Address
WAREHOUSE_NAME=Dr. Sebi Approved
WAREHOUSE_STREET=your-warehouse-address
WAREHOUSE_CITY=your-city
WAREHOUSE_STATE=TX
WAREHOUSE_ZIP=your-zip
WAREHOUSE_PHONE=your-phone

# Notifications
LABEL_NOTIFICATION_EMAIL=your-email@example.com

# Brevo (optional, for lead magnets)
BREVO_API_KEY=your-brevo-api-key
```

## Email Infrastructure - Dual Strategy

### Why Two Email Systems?
**Zoho Mail API** and **Brevo** serve different, complementary purposes:

**Zoho (Transactional & Manual Campaigns):**
- One-off emails to specific customers
- Re-engagement campaigns for old customer CSVs
- Foundational email infrastructure
- Manual campaign control
- Click tracking for conversions
- Links customers back to Brevo automation

**Brevo (Marketing Automation & Analytics):**
- Full marketing automation workflows
- Advanced open/click rate analytics
- Behavioral tracking and segmentation
- Cart abandonment sequences
- Purchase follow-up automation
- Lead magnet delivery and nurture
- True multi-touch attribution

### Brevo Integration Details
- **Verified Sender**: info@drsebiapproved.com ✅
- **Domain Auth**: drsebiapproved.com (DKIM + DMARC) ✅
- **Capacity**: 100K contacts, 300 emails/day
- **Behavioral Tracking**: Installed via JS tracker (client_key: fe6w1ww57kreu47ho3uax9h2)
- **API Endpoints**:
  - `/api/brevo/checkout-started` - Capture checkout abandonment
  - `/api/brevo/checkout-shipping` - Track shipping info entry
  - `/api/brevo/cart-abandoned` - Trigger recovery sequence
  - `/api/brevo/purchase-complete` - Post-purchase automation (removes from abandonment lists)
  - `/api/brevo/winback-optin` - Win-back campaign opt-in
  - `/api/brevo/quiz-submit` - Quiz funnel tracking
  - `/api/brevo/track-problem` - Problem awareness tracking

### Brevo List Management Architecture

**List Structure Philosophy:**
- **Campaign Source Lists** (permanent) - Track where customers came from
- **Behavioral Lists** (dynamic) - Track current customer journey stage
- **Customer Lists** (permanent) - Product ownership and purchase history

#### Campaign Source Lists (Never Remove Contacts)
- **"Win-Back - Mucus Cleanser"** - Opted in from flu season win-back landing page
- **"Win-Back - Maya Formula"** - Future campaign tracking
- **"Win-Back - Sea Moss"** - Future campaign tracking
- **Purpose**: Attribution tracking, campaign performance analysis, future targeting

#### Behavioral Lists (Dynamic Movement)
- **"Checkout Started"** - Anyone who enters email at checkout Step 1
  - **Added**: When user completes contact info and clicks "Continue to Shipping"
  - **Removed**: When purchase completes (moved to customer lists)

- **"Abandoned Cart - Low Intent"** - Left at Step 1 (contact info only, no shipping address)
  - **Added**: User exits after entering email but before shipping
  - **Recovery Sequence**: 4hr → 2 day → 5 day (educational, soft touch)
  - **Removed**: When purchase completes

- **"Abandoned Cart - High Intent"** - Left at Step 2+ (had shipping/payment info)
  - **Added**: User exits after entering shipping address
  - **Recovery Sequence**: 5min → 30min → 2hr (aggressive, urgent)
  - **Removed**: When purchase completes

#### Customer Lists (Permanent Product Ownership)
- **"ParaCleanse Customers"** - Purchased ParaCleanse Elite
- **"Maya Customers"** - Purchased Maya Formula
- **"Sea Moss Customers"** - Purchased Sea Moss Capsules
- **"Mucus Cleanser Customers"** - Purchased Mucus Cleanser
- **"Bundle Buyers"** - Purchased 2+ products in single order
- **Purpose**: Product-specific automations, cross-sell sequences, restock reminders

#### List Movement Rules

| Event | Action |
|-------|--------|
| **Win-back landing page opt-in** | Add to "Win-Back - [Product]" (permanent) |
| **Checkout Step 1 complete** | Add to "Checkout Started" + Set `source: 'winback-checkout'` if from win-back |
| **User exits at Step 1** | Move to "Abandoned Cart - Low Intent" + Remove from "Checkout Started" |
| **User exits at Step 2+** | Move to "Abandoned Cart - High Intent" + Remove from "Checkout Started" |
| **Purchase completes** | Add to product customer lists + Remove from ALL abandonment lists |

#### Key Brevo Contact Attributes

**Win-Back Campaign Attributes:**
- `WINBACK_SOURCE` - Campaign identifier (e.g., 'mucus-cleanser-winback')
- `DISCOUNT_CODE` - Coupon code provided (e.g., 'STOPMUCUS')
- `COUNTDOWN_EXPIRES` - When discount expires (72 hours from opt-in)
- `CUSTOMER_STATUS` - 'win-back-lead', 'active', etc.

**Checkout Flow Attributes:**
- `CHECKOUT_IN_PROGRESS` - 'true' when in checkout, 'false' on complete/abandon
- `CHECKOUT_STEP` - 'contact_info', 'shipping_address', 'payment'
- `CHECKOUT_ABANDONED_STAGE` - 'step_1', 'step_2', 'step_3'
- `ABANDONMENT_INTENT_LEVEL` - 'low', 'medium', 'high'
- `SOURCE` - 'checkout', 'winback-checkout', 'quiz', etc.

**Purchase Attributes:**
- `LAST_PURCHASE_PRODUCT` - Primary product slug
- `LAST_PURCHASE_VALUE` - Order total
- `LAST_PURCHASE_DATE` - ISO date
- `PRODUCTS_OWNED` - Comma-separated product slugs
- `IS_BUNDLE_BUYER` - 'true' or 'false'
- `CART_ABANDONED` - 'false' after purchase

#### Win-Back Campaign Pre-Fill Flow

**Purpose**: Reduce friction by pre-filling checkout with data from landing page opt-in.

**Flow:**
1. User opts in on `/mucus-winback` → Email + First Name captured
2. API call to `/api/brevo/winback-optin` → Contact added to "Win-Back - Mucus Cleanser"
3. Redirect to: `/checkout?product=mucus-cleanser&coupon=STOPMUCUS&email=user@example.com&firstName=John`
4. Checkout page extracts URL params and passes to SquareCheckout component
5. SquareCheckout **pre-fills** email and fullName fields on mount
6. User only needs to add: Phone → Shipping Address → Payment
7. Step 1 tracking sets `source: 'winback-checkout'` (detected via `initialEmail` prop or `STOPMUCUS` coupon)

**Benefits:**
- Reduces data entry friction (email + name already captured)
- Higher conversion rate (fewer form fields)
- Clean attribution (`SOURCE` attribute tracks campaign origin)
- User feels "remembered" by the system

**Implementation Files:**
- [/src/components/WinBackOptIn.tsx:56-64](/src/components/WinBackOptIn.tsx#L56-L64) - Passes email/firstName in redirect URL
- [/src/app/checkout/page.tsx:78-89](/src/app/checkout/page.tsx#L78-L89) - Extracts URL params and passes to SquareCheckout
- [/src/components/SquareCheckout.tsx:156-164](/src/components/SquareCheckout.tsx#L156-L164) - Pre-fills email/fullName fields on mount
- [/src/components/SquareCheckout.tsx:374-390](/src/components/SquareCheckout.tsx#L374-L390) - Detects win-back source and tracks properly
- [/src/app/api/brevo/purchase-complete/route.ts:127-149](/src/app/api/brevo/purchase-complete/route.ts#L127-L149) - Removes from abandonment lists

## Development Notes

### Component Development
- UI components follow shadcn/ui patterns with Radix UI primitives
- Use `cn()` utility for conditional class merging
- Implement proper TypeScript interfaces for all props
- Follow mobile-first responsive design patterns

### Content Creation
- Blog posts use MDX format with frontmatter (title, description, date, tags)
- Images stored in `public/images/` with Next.js Image optimization
- Use structured content for SEO optimization

### Zoho Email Campaign Features
- **Admin Dashboard**: `/admin/campaign` - Manage email campaigns
- **Campaign Management**:
  - CSV upload for customer lists
  - Batch sending (rate-limited to avoid spam flags)
  - Multi-stage campaigns (Intro → Follow-up → Urgency)
  - Priority queue system (follow-ups first, then new leads)
- **Tracking Capabilities**:
  - ✅ Click tracking (wrapped URLs)
  - ✅ Conversion tracking (purchase events)
  - ✅ Bounce detection
  - ❌ Email opens (not available on Zoho free tier)
- **Database**: Supabase PostgreSQL with 3 tables:
  - `reengagement_campaign` - Customer records and campaign status
  - `campaign_clicks` - Click tracking data
  - `zoho_oauth_tokens` - OAuth credentials
- **API Routes**: All campaign routes use `export const dynamic = 'force-dynamic'` to prevent caching issues

### Deployment
- GitHub integration with Render.com for automatic deployments
- Hosted on Render.com with custom domain (drsebiapproved.com)
- Static assets optimized through Next.js build process
- Environment variables managed through Render.com dashboard

## Session Memory and Context Awareness

**Claude can access previous session context to maintain continuity across conversations.**

### Session History Access
- **Sessions Directory**: `/sessions/` contains detailed logs of all previous work
- **Timestamp Command**: Use `date` terminal command to get current timestamp for context
- **Session Files**: Named with format `YYYY-MM-DD_HH-MM-SS_topic-description.md`

### Context Retrieval Process
1. **Check Current Time**: Run `date` command to understand temporal context
2. **List Recent Sessions**: Use `LS /Users/rathriva/Documents/parasite-cleanse-landing/sessions` to see available logs
3. **Read Relevant Sessions**: Focus on sessions from the last 7-14 days or topic-specific sessions
4. **Extract Key Context**: Previous decisions, ongoing projects, technical implementations, business context

### When to Check Sessions
- **"Start new session" command**: AUTOMATICALLY check 2-3 most recent sessions when user says "start new session"
- **New conversation start**: Always check recent sessions for continuity
- **Project context needed**: When user references previous work or decisions
- **Technical continuity**: When building on previous implementations
- **Business strategy**: When making strategic decisions that need historical context
- **Problem solving**: When troubleshooting issues that may have been addressed before

### Session Startup Protocol
**When user says "start new session":**
1. **Get Current Timestamp**: Run `date` command
2. **List Recent Sessions**: Use `LS` to show available session files  
3. **Read 2-3 Most Recent**: Focus on sessions from last 48-72 hours
4. **Extract Key Context**: Ongoing projects, recent decisions, technical state
5. **Provide Context Summary**: Brief overview of recent work and current status

## Session Logging Protocol

**When user says "end this session" or similar, Claude must immediately log the session.**

### Session Logging Steps
1. **Get Timestamp**: Run `date` command to get current timestamp
2. **Create Sessions Directory**: Ensure `/Users/rathriva/Documents/parasite-cleanse-landing/sessions` exists
3. **Create Session Log**: Write comprehensive session summary to new file

### Session File Naming Convention
```
/Users/rathriva/Documents/parasite-cleanse-landing/sessions/YYYY-MM-DD_HH-MM-SS_topic-description.md
```

### Session Log Structure
```markdown
# [Session Topic] Session
**Date**: [Full timestamp from date command]
**Duration**: [Estimated session length]
**Focus**: [Primary objective/topic]
**Logged by**: Claude

## Session Summary
### Primary Objectives Completed ✅
[List major accomplishments]

## Key Issues Resolved
[Technical problems solved]

## Technical Implementation
[Code changes, architecture decisions]

## Files Modified/Created
### Committed to Production
[Files pushed to GitHub/production]

### Local Development Only
[Local-only files for security]

## Testing Results
[Verification of functionality]

## Business Impact
[Effect on project goals]

## Technical Capabilities Unlocked
[New features/capabilities enabled]

## Next Steps & Recommendations
[Future actions and suggestions]

## Session Outcome
[Final status and results]

---
*End of Session: [timestamp]*
```

### Session Logging Triggers
- User explicitly says: "end this session", "end session", "log this session"
- User asks to "wrap up", "finish up", or "close out"
- User says "goodbye", "done for now", or similar session-ending phrases

### Critical Session Logging Requirements
- **ALWAYS get fresh timestamp** with `date` command
- **Create sessions directory** if it doesn't exist
- **Document all major changes** especially code modifications
- **Note security implications** (what's committed vs local)
- **Include business context** and impact
- **List next steps** for continuity
- **Use descriptive filename** that captures session essence

### Example Session Topics for Filenames
- `zoho-campaign-implementation` - Email campaign system work
- `blog-content-creation` - Adding new MDX blog posts
- `ui-component-development` - Building new interface components
- `deployment-configuration` - GitHub and Render.com setup
- `analytics-implementation` - Tracking and conversion optimization
- `api-caching-and-delete-debugging` - Debugging Next.js caching issues

---

## Critical Technical Notes

### Square Customer & Order Management (Updated 2025-11-21)
**Customer Creation Flow:**
- Before creating an order, the system searches for existing customers by email
- If customer exists, updates their info and uses existing customer_id
- If new customer, creates profile in Square Customer Directory
- Customer profile includes: name, email, phone, shipping address
- Order is linked to customer via `order.customer_id` field
- Location: `src/app/api/square/process-payment/route.ts:11-110`

**Order Fulfillment Structure:**
- Orders include fulfillment details with type: 'SHIPMENT'
- Shipment details include recipient address and contact info
- Tracking number added via UpdateOrder API after label creation
- Tracking updates trigger Square customer notifications

### Shippo Automated Shipping (Planned Implementation)
**Integration Architecture:**
- Square webhook triggers label creation on order.created event
- Shippo API creates shipment and purchases cheapest rate
- Label PDF URL returned and emailed to fulfillment team
- Tracking number automatically updated in Square order
- Customer receives tracking notification from Square
- Implementation guide: `/SHIPPO_AUTOMATION_IMPLEMENTATION.md`

### Next.js 14 Caching Behavior
**IMPORTANT**: Next.js 14 App Router caches API routes aggressively by default, even in development mode.

**Symptoms of caching issues:**
- API returns stale data
- Database changes don't reflect in API responses
- DELETE operations appear to fail but actually succeed

**Solution:**
```typescript
// Add to ALL admin/dashboard API routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

**Affected routes:**
- `/api/campaign/status` ✅ Fixed
- `/api/campaign/delete-email` ✅ Fixed
- `/api/campaign/clear-all` ✅ Fixed
- `/api/campaign/send-batch` ✅ Fixed
- `/api/campaign/upload-list` ✅ Fixed

### Supabase Configuration
The admin client must be configured to bypass RLS and prevent session caching:

```typescript
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public'
    }
  }
);
```

### Database Delete Patterns
**Best Practice for "delete all" operations:**

```typescript
// ✅ GOOD - Works with any field type
await supabase
  .from('table_name')
  .delete()
  .not('email_field', 'eq', 'impossible-value@never-exists.com');

// ❌ BAD - Type-dependent, can fail with UUID vs INTEGER
await supabase
  .from('table_name')
  .delete()
  .neq('id', someValue);
```

### Known Issues & Solutions

1. **Test Data in Migration**
   - File: `prisma/migrations/01_create_zoho_campaign_tables.sql`
   - Lines 142-153 contain sample INSERT statements
   - Should be commented out for production deployments

2. **Email Campaign Rate Limits**
   - Zoho free tier: 300 emails/day
   - Recommended batch size: 75 emails/day
   - Delay between sends: 120 seconds (2 minutes)

3. **Shopify Integration**
   - Sales handled externally via Shopify
   - No payment processing in this codebase
   - Customer journey: This site → External Shopify checkout