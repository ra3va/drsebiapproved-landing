# Customer Portal & Admin CRM - Planning Document

> **✅ PROJECT STATUS: 100% COMPLETE!**
>
> This document is HISTORICAL PLANNING REFERENCE ONLY. Everything planned here has been fully implemented.
>
> **📋 For implementation details, see:** `docs/FINAL_IMPLEMENTATION_SUMMARY.md`
>
> All 107+ files built, tested, and deployed to branch `claude/customer-portal-dashboard-01S1j2VYjLD1Tt8tegC1t2pt`

**Session Date:** November 17, 2025
**Branch:** `claude/customer-portal-dashboard-01S1j2VYjLD1Tt8tegC1t2pt`
**Status:** ~~Planning & Research Phase~~ **✅ COMPLETED & DEPLOYED**

---

## Executive Summary

This document outlines the comprehensive plan for implementing a customer portal dashboard and admin CRM system for the Dr. Sebi Approved e-commerce platform. This is a **major architectural enhancement** that will transform the site from a simple e-commerce landing page into a full-featured customer management platform.

### Goals
1. **Customer Portal**: Enable customers to register, login, track orders, access digital content, manage subscriptions, and reorder products
2. **Admin CRM**: Provide centralized dashboard for managing customers, orders, analytics, and integrations
3. **Seamless Integration**: Connect Supabase auth/data with existing Square payments and Brevo email marketing
4. **Mobile-First UX**: Beautiful, intuitive interface optimized for mobile devices

---

## Current Architecture Analysis

### Existing Tech Stack
```
Frontend:
├── Next.js 14.1.0 (App Router)
├── React 18
├── TypeScript 5
├── Tailwind CSS 3.4.1
└── Radix UI components

Backend Services:
├── Square API (Payments, Orders, Catalog)
├── Brevo API (Email Marketing, Contacts, Tracking)
└── Next.js API routes (Server-side logic)

Deployment:
├── GitHub (Version control)
└── Render.com (Hosting with auto-deploy)
```

### Current Data Flow
```
Customer Journey:
Homepage → Quiz → Product Page → Checkout → Success

Data Capture Points:
1. Quiz: Email + quiz data → Brevo
2. Checkout: Contact info → Ephemeral (form state only)
3. Payment: Customer data → Square Orders API
4. Purchase: Order data → Square + Brevo

Current Limitations:
❌ No persistent customer accounts
❌ Customer data scattered across Square and Brevo
❌ No order history for customers
❌ No digital content delivery system
❌ No subscription management
❌ No admin dashboard for data access
❌ No customer loyalty/rewards tracking
```

### Existing Integrations

#### Square Integration (✅ Fully Working)
- **Orders API**: Creating orders with line items
- **Payments API**: Processing credit card payments
- **Catalog API**: Product management
- **Customer Data**: Name, email, phone, shipping address

**Square Entities:**
- Orders (with line items, fulfillment, customer data)
- Payments (linked to orders)
- Catalog (4 products with variations)

#### Brevo Integration (✅ Fully Working)
- **Contacts API**: Creating/updating contacts
- **Lists**: 10 lists (5 prospect, 5 customer)
- **Attributes**: 25 custom attributes
- **Behavioral Tracking**: Quiz, product views, cart, purchase

**Brevo Data Points:**
- Email addresses (primary identifier)
- Quiz scores and recommendations
- Cart abandonment tracking
- Purchase history (limited)
- Product interest tracking

---

## Proposed Architecture

### New Tech Stack Additions

#### Supabase (Primary Addition)
```
Free Tier Limits:
├── 500 MB database space
├── 1 GB bandwidth
├── 50,000 monthly active users
├── Unlimited API requests
├── Row Level Security (RLS)
└── Real-time subscriptions

Paid Tiers (When Needed):
├── Pro: $25/mo (8 GB database, 250 GB bandwidth)
└── Team: $599/mo (unlimited projects)
```

**Why Supabase?**
- ✅ PostgreSQL database (robust, scalable, relational)
- ✅ Built-in authentication (email/password, OAuth, magic links)
- ✅ Row-level security (secure by default)
- ✅ Real-time capabilities (for admin dashboard)
- ✅ Generous free tier (500 MB, 50K users)
- ✅ TypeScript SDK (matches our stack)
- ✅ Edge Functions (for complex server logic)
- ✅ Storage (for PDFs, course content)

**Alternatives Considered:**
- Firebase (❌ More expensive, vendor lock-in)
- Auth0 (❌ $35/mo minimum, auth-only)
- MongoDB Atlas (❌ NoSQL, less suitable for relational data)
- Prisma + PostgreSQL (❌ Need to manage auth separately)

---

## Database Schema Design

### Supabase Tables

#### 1. **users** (Extends Supabase auth.users)
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Preferences
  marketing_consent BOOLEAN DEFAULT true,
  sms_consent BOOLEAN DEFAULT false,

  -- Rewards
  loyalty_points INTEGER DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,

  -- External IDs (for syncing)
  square_customer_id TEXT UNIQUE,
  brevo_contact_id INTEGER UNIQUE,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 2. **orders** (Synced from Square)
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Square data
  square_order_id TEXT UNIQUE NOT NULL,
  square_payment_id TEXT,

  -- Order details
  status TEXT NOT NULL, -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal_amount DECIMAL(10,2) NOT NULL,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,

  -- Customer info (snapshot at time of order)
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,

  -- Shipping
  shipping_address JSONB NOT NULL,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_square_order_id ON public.orders(square_order_id);
CREATE INDEX idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );
```

#### 3. **order_items** (Line items for each order)
```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,

  -- Product details
  product_id TEXT NOT NULL, -- 'paracleanse', 'maya', 'seamoss', 'mucus-cleanser'
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  -- Square data
  square_catalog_object_id TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view items from their own orders
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
```

#### 4. **subscriptions**
```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Subscription details
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'active', 'paused', 'cancelled'
  frequency TEXT NOT NULL, -- 'monthly', 'bimonthly', 'quarterly'

  -- Pricing
  price_per_shipment DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER DEFAULT 0,

  -- Schedule
  next_shipment_date DATE,
  last_shipment_date DATE,

  -- Payment
  square_customer_id TEXT,
  payment_method_id TEXT, -- For auto-billing

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_next_shipment ON public.subscriptions(next_shipment_date);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view/manage their own subscriptions
CREATE POLICY "Users can manage own subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.uid() = user_id);
```

#### 5. **digital_products** (PDFs, courses, content)
```sql
CREATE TABLE public.digital_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Product details
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'pdf', 'video', 'course', 'guide'

  -- File storage
  file_url TEXT, -- Supabase Storage URL
  file_size INTEGER, -- bytes

  -- Access control
  requires_purchase BOOLEAN DEFAULT false,
  linked_product_id TEXT, -- Which physical product unlocks this?

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view product listings
CREATE POLICY "Anyone can view digital products"
  ON public.digital_products FOR SELECT
  USING (true);
```

#### 6. **user_digital_access** (Track who has access to what)
```sql
CREATE TABLE public.user_digital_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  digital_product_id UUID REFERENCES public.digital_products(id) ON DELETE CASCADE,

  -- Access details
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by TEXT, -- 'purchase', 'admin', 'promotion'
  order_id UUID REFERENCES public.orders(id), -- If granted by purchase

  -- Usage tracking
  first_accessed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,

  -- Constraints
  UNIQUE(user_id, digital_product_id)
);

-- Indexes
CREATE INDEX idx_user_digital_access_user_id ON public.user_digital_access(user_id);
CREATE INDEX idx_user_digital_access_product_id ON public.user_digital_access(digital_product_id);

-- Enable RLS
ALTER TABLE public.user_digital_access ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own access
CREATE POLICY "Users can view own digital access"
  ON public.user_digital_access FOR SELECT
  USING (auth.uid() = user_id);
```

#### 7. **loyalty_transactions** (Points history)
```sql
CREATE TABLE public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Transaction details
  points_change INTEGER NOT NULL, -- Can be positive or negative
  reason TEXT NOT NULL, -- 'purchase', 'referral', 'birthday', 'redemption'
  description TEXT,

  -- Related entities
  order_id UUID REFERENCES public.orders(id),

  -- Balance
  balance_after INTEGER NOT NULL,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_loyalty_transactions_user_id ON public.loyalty_transactions(user_id);
CREATE INDEX idx_loyalty_transactions_created_at ON public.loyalty_transactions(created_at);

-- Enable RLS
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own transactions
CREATE POLICY "Users can view own loyalty transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (auth.uid() = user_id);
```

#### 8. **admin_users** (CRM access control)
```sql
CREATE TABLE public.admin_users (
  id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  role TEXT NOT NULL, -- 'super_admin', 'admin', 'support'
  permissions JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin users
CREATE POLICY "Admins can view admin users"
  ON public.admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );
```

---

## Integration Strategy

### 1. Supabase ↔ Square Integration

#### Customer Sync
```typescript
// When user registers/logs in
// 1. Create Supabase user
// 2. Create or retrieve Square customer
// 3. Store square_customer_id in profiles table

async function syncSquareCustomer(userId: string, email: string, name: string) {
  // Check if Square customer exists
  const { result: customers } = await squareClient.customersApi.searchCustomers({
    query: {
      filter: {
        emailAddress: {
          exact: email
        }
      }
    }
  });

  let squareCustomerId: string;

  if (customers?.customers?.length > 0) {
    // Customer exists, use existing ID
    squareCustomerId = customers.customers[0].id;
  } else {
    // Create new Square customer
    const { result: newCustomer } = await squareClient.customersApi.createCustomer({
      emailAddress: email,
      givenName: name.split(' ')[0],
      familyName: name.split(' ').slice(1).join(' '),
      referenceId: userId, // Link back to Supabase
    });
    squareCustomerId = newCustomer.customer.id;
  }

  // Update Supabase profile
  await supabase
    .from('profiles')
    .update({ square_customer_id: squareCustomerId })
    .eq('id', userId);

  return squareCustomerId;
}
```

#### Order Sync (Webhook-based)
```typescript
// After Square payment successful
// POST /api/webhooks/square/order-created

async function handleSquareOrderWebhook(orderData: any) {
  const { order } = orderData;

  // Find or create user by email
  let userId: string | null = null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', order.customer_email)
    .single();

  if (profile) {
    userId = profile.id;
  }

  // Create order in Supabase
  const { data: newOrder } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      square_order_id: order.id,
      square_payment_id: order.tenders?.[0]?.id,
      status: 'processing',
      total_amount: order.total_money.amount / 100,
      subtotal_amount: order.net_amounts?.subtotal_money?.amount / 100,
      shipping_amount: order.net_amounts?.shipping_money?.amount / 100,
      customer_email: order.customer_email,
      customer_name: order.fulfillments?.[0]?.shipment_details?.recipient?.display_name,
      shipping_address: order.fulfillments?.[0]?.shipment_details?.recipient?.address,
    })
    .select()
    .single();

  // Create order items
  for (const lineItem of order.line_items) {
    await supabase
      .from('order_items')
      .insert({
        order_id: newOrder.id,
        product_id: getProductIdFromCatalogId(lineItem.catalog_object_id),
        product_name: lineItem.name,
        quantity: parseInt(lineItem.quantity),
        unit_price: lineItem.base_price_money.amount / 100,
        total_price: lineItem.total_money.amount / 100,
        square_catalog_object_id: lineItem.catalog_object_id,
      });
  }

  // Grant digital product access if applicable
  await grantDigitalProductAccess(newOrder.id, userId);

  // Update loyalty points
  if (userId) {
    await addLoyaltyPoints(userId, newOrder.id, newOrder.total_amount);
  }
}
```

### 2. Supabase ↔ Brevo Integration

#### Contact Sync
```typescript
// Bidirectional sync: Supabase ↔ Brevo

async function syncBrevoContact(userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Get or create Brevo contact
  const contact = await brevoClient.createOrUpdateContact({
    email: profile.email,
    attributes: {
      FIRSTNAME: profile.full_name?.split(' ')[0],
      LASTNAME: profile.full_name?.split(' ').slice(1).join(' '),
      SMS: profile.phone,
      CUSTOMER_STATUS: 'registered',
      LOYALTY_POINTS: profile.loyalty_points,
      LIFETIME_VALUE: profile.lifetime_value,
      REGISTERED_DATE: profile.created_at,
    },
  });

  // Store Brevo contact ID
  await supabase
    .from('profiles')
    .update({ brevo_contact_id: contact.id })
    .eq('id', userId);
}
```

#### Purchase Event Sync
```typescript
// When order synced, update Brevo
async function syncOrderToBrevo(orderId: string) {
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles(*)')
    .eq('id', orderId)
    .single();

  // Update Brevo contact with purchase data
  await brevoClient.createOrUpdateContact({
    email: order.customer_email,
    attributes: {
      LAST_PURCHASE_PRODUCT: order.order_items[0].product_name,
      LAST_PURCHASE_VALUE: order.total_amount,
      LAST_PURCHASE_DATE: order.created_at,
      ORDER_ID: order.square_order_id,
    },
  });

  // Add to customer list
  await brevoClient.addContactToList(
    order.customer_email,
    getBrevoCustomerListId(order.order_items[0].product_id)
  );
}
```

---

## Customer Portal Features

### Phase 1: Core Authentication & Profile (Week 1)

#### Features
- [x] User registration (email + password)
- [x] User login (email + password)
- [x] Magic link login (passwordless)
- [x] Password reset flow
- [x] Email verification
- [x] Profile management (name, email, phone, password)
- [x] Marketing preferences (email/SMS consent)

#### Pages/Routes
```
/portal/register
/portal/login
/portal/forgot-password
/portal/profile
```

#### UI Components
- Registration form (mobile-optimized)
- Login form with "Remember me"
- Profile editor
- Password change modal
- Email preference toggles

### Phase 2: Order History & Tracking (Week 2)

#### Features
- [x] View all past orders
- [x] Order details (items, total, date)
- [x] Shipping status tracking
- [x] Order filtering (date range, status)
- [x] Downloadable invoices/receipts
- [x] Reorder with one click

#### Pages/Routes
```
/portal/orders
/portal/orders/[orderId]
```

#### UI Components
- Order list (card-based, mobile-first)
- Order status timeline
- Tracking number display
- "Reorder" button
- PDF invoice generator

### Phase 3: Digital Content Access (Week 3)

#### Features
- [x] Library of purchased digital products
- [x] PDF viewer/download
- [x] Course/video access (future)
- [x] Content recommendations
- [x] Usage tracking

#### Pages/Routes
```
/portal/library
/portal/library/[productId]
```

#### UI Components
- Content grid (thumbnails)
- PDF viewer modal
- Download button
- "New content" badges

### Phase 4: Subscriptions (Week 4)

#### Features
- [x] Create new subscription
- [x] View active subscriptions
- [x] Pause/resume subscription
- [x] Cancel subscription
- [x] Update delivery frequency
- [x] Update payment method
- [x] Next shipment date display

#### Pages/Routes
```
/portal/subscriptions
/portal/subscriptions/new
/portal/subscriptions/[subscriptionId]
```

#### UI Components
- Subscription card (status, next date, product)
- Frequency selector
- Pause/resume toggle
- Cancel confirmation modal

### Phase 5: Rewards & Loyalty (Week 5)

#### Features
- [x] View loyalty points balance
- [x] Points history/transactions
- [x] Redeem points for discounts
- [x] Referral program
- [x] Birthday rewards
- [x] Tier status (Bronze, Silver, Gold)

#### Pages/Routes
```
/portal/rewards
/portal/rewards/redeem
/portal/rewards/refer
```

#### UI Components
- Points balance hero
- Transaction history list
- Redemption options grid
- Referral link generator
- Tier progress bar

### Phase 6: Special Deals & Offers (Week 6)

#### Features
- [x] Personalized deals based on purchase history
- [x] Early access to new products
- [x] Member-only discounts
- [x] Flash sales notifications
- [x] Bundle offers

#### Pages/Routes
```
/portal/deals
/portal/deals/[dealId]
```

#### UI Components
- Deal cards with countdown timers
- "Claim offer" CTA
- Savings calculator
- Limited quantity indicators

---

## Admin CRM Features

### Phase 1: Dashboard Overview (Week 7)

#### Features
- [x] Key metrics (revenue, orders, customers)
- [x] Recent orders
- [x] Today's stats
- [x] Quick actions

#### Pages/Routes
```
/admin/dashboard
```

#### Metrics to Display
- Revenue (today, week, month)
- Orders count (pending, processing, shipped)
- New customers (today, week, month)
- Conversion rate
- Average order value
- Top products

### Phase 2: Customer Management (Week 8)

#### Features
- [x] Customer list (search, filter, sort)
- [x] Customer details view
- [x] Purchase history
- [x] Lifetime value
- [x] Contact information
- [x] Brevo sync status
- [x] Square customer link
- [x] Add notes
- [x] Manual loyalty points adjustment

#### Pages/Routes
```
/admin/customers
/admin/customers/[customerId]
```

#### UI Components
- Customer table with filters
- Customer detail sidebar
- Order timeline
- Quick actions menu
- Notes textarea

### Phase 3: Order Management (Week 9)

#### Features
- [x] Order list (all orders)
- [x] Order details
- [x] Update order status
- [x] Add tracking number
- [x] Refund processing
- [x] Cancel order
- [x] Export orders (CSV)

#### Pages/Routes
```
/admin/orders
/admin/orders/[orderId]
```

#### UI Components
- Order table with status badges
- Status update dropdown
- Tracking number input
- Refund modal
- Export button

### Phase 4: Analytics & Reports (Week 10)

#### Features
- [x] Sales reports (daily, weekly, monthly)
- [x] Product performance
- [x] Customer acquisition sources
- [x] Brevo campaign performance
- [x] Quiz funnel analytics
- [x] Subscription metrics
- [x] Loyalty program stats

#### Pages/Routes
```
/admin/analytics
/admin/analytics/sales
/admin/analytics/products
/admin/analytics/customers
```

#### UI Components
- Date range picker
- Line charts (revenue over time)
- Bar charts (product comparison)
- Pie charts (traffic sources)
- Data tables (exportable)

### Phase 5: Integrations Panel (Week 11)

#### Features
- [x] Square sync status
- [x] Brevo sync status
- [x] Webhook logs
- [x] Manual sync triggers
- [x] API health checks
- [x] Error logs

#### Pages/Routes
```
/admin/integrations
/admin/integrations/square
/admin/integrations/brevo
/admin/integrations/webhooks
```

#### UI Components
- Integration status cards
- Sync history log
- Manual sync buttons
- Webhook event viewer
- Error alert banners

---

## Technical Implementation Plan

### Dependencies to Add

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@tanstack/react-query": "^5.14.2",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.3",
    "jspdf": "^2.5.1"
  }
}
```

### Environment Variables

```env
# Existing
NEXT_PUBLIC_SQUARE_APPLICATION_ID=
NEXT_PUBLIC_SQUARE_LOCATION_ID=
SQUARE_ACCESS_TOKEN=
BREVO_API_KEY=

# New - Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# New - Feature flags
ENABLE_SUBSCRIPTIONS=true
ENABLE_LOYALTY_PROGRAM=true
ENABLE_DIGITAL_CONTENT=true
```

### File Structure

```
src/
├── app/
│   ├── portal/                    # Customer portal
│   │   ├── layout.tsx            # Portal wrapper (requires auth)
│   │   ├── register/page.tsx
│   │   ├── login/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── orders/[id]/page.tsx
│   │   ├── library/page.tsx
│   │   ├── subscriptions/page.tsx
│   │   ├── rewards/page.tsx
│   │   └── deals/page.tsx
│   │
│   ├── admin/                     # Admin CRM
│   │   ├── layout.tsx            # Admin wrapper (requires admin auth)
│   │   ├── dashboard/page.tsx
│   │   ├── customers/page.tsx
│   │   ├── customers/[id]/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── orders/[id]/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── integrations/page.tsx
│   │
│   └── api/
│       ├── auth/                  # Supabase auth helpers
│       │   ├── callback/route.ts
│       │   └── logout/route.ts
│       │
│       ├── webhooks/              # External webhooks
│       │   └── square/
│       │       └── order-created/route.ts
│       │
│       ├── sync/                  # Integration sync endpoints
│       │   ├── square-customer/route.ts
│       │   ├── square-orders/route.ts
│       │   └── brevo-contact/route.ts
│       │
│       └── admin/                 # Admin-only endpoints
│           ├── customers/route.ts
│           ├── orders/route.ts
│           └── analytics/route.ts
│
├── components/
│   ├── portal/                    # Customer portal components
│   │   ├── PortalLayout.tsx
│   │   ├── OrderCard.tsx
│   │   ├── SubscriptionCard.tsx
│   │   └── RewardsDisplay.tsx
│   │
│   ├── admin/                     # Admin CRM components
│   │   ├── AdminLayout.tsx
│   │   ├── CustomerTable.tsx
│   │   ├── OrderTable.tsx
│   │   └── Analytics/
│   │       ├── SalesChart.tsx
│   │       └── ProductChart.tsx
│   │
│   └── auth/                      # Auth forms
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       └── PasswordResetForm.tsx
│
├── lib/
│   ├── supabase/                  # Supabase utilities
│   │   ├── client.ts             # Client-side client
│   │   ├── server.ts             # Server-side client
│   │   ├── admin.ts              # Admin client (service role)
│   │   └── middleware.ts         # Auth middleware
│   │
│   ├── integrations/              # External API clients
│   │   ├── square-sync.ts
│   │   └── brevo-sync.ts
│   │
│   └── utils/
│       ├── auth.ts               # Auth helpers
│       ├── permissions.ts        # Role-based access control
│       └── loyalty.ts            # Loyalty points calculation
│
└── types/
    ├── supabase.ts               # Generated from Supabase schema
    └── portal.ts                 # Portal-specific types
```

---

## Mobile-First UI/UX Design

### Design Principles
1. **Touch-first**: Large tap targets (minimum 44px)
2. **Thumb-friendly**: Primary actions within thumb reach
3. **Minimal scrolling**: Key info above fold
4. **Progressive disclosure**: Show more on demand
5. **Fast loading**: Optimize for mobile networks
6. **Offline support**: Cache critical data

### Color Scheme (Brand Consistency)
```css
Primary: #22c55e (Green - Dr. Sebi brand)
Secondary: #059669 (Darker green)
Accent: #3b82f6 (Blue for links/info)
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Error: #ef4444 (Red)
Neutral: #6b7280 (Gray)
```

### Component Library
- Reuse existing Radix UI components
- Add new portal-specific components
- Maintain Tailwind CSS consistency
- Use shadcn/ui patterns

---

## Security Considerations

### Row-Level Security (RLS)
- ✅ Users can only access their own data
- ✅ Admins have elevated permissions
- ✅ Public tables properly restricted
- ✅ Service role key only on server

### Authentication
- ✅ Email verification required
- ✅ Password strength requirements (min 8 chars, complexity)
- ✅ Rate limiting on auth endpoints
- ✅ Magic link expiration (1 hour)
- ✅ Session management (14-day expiry)

### Data Protection
- ✅ Sensitive data encrypted at rest (Supabase default)
- ✅ HTTPS enforced (Render.com + Supabase)
- ✅ PII handling compliance (GDPR/CCPA ready)
- ✅ Audit logs for admin actions

### API Security
- ✅ Webhook signature verification (Square)
- ✅ API key rotation support
- ✅ Rate limiting on public endpoints
- ✅ CORS properly configured

---

## Migration Strategy

### Phase 1: Setup (Week 1)
1. Create Supabase project
2. Set up database schema
3. Configure authentication
4. Add environment variables
5. Install dependencies

### Phase 2: Parallel Operation (Weeks 2-6)
1. Build customer portal (no disruption to existing checkout)
2. Existing customers continue using Square-only flow
3. New registrations get both Square and Supabase accounts
4. Gradually migrate existing customers (email invitations)

### Phase 3: Integration (Weeks 7-8)
1. Add "Login" option to checkout
2. Pre-populate forms for logged-in users
3. Automatically create portal accounts for purchases
4. Send welcome emails with portal access

### Phase 4: Full Activation (Week 9+)
1. All purchases create portal accounts
2. Digital content delivery active
3. Loyalty program live
4. Subscriptions available
5. Admin CRM fully functional

---

## Testing Strategy

### Unit Tests
- Supabase database functions
- Integration sync functions
- Loyalty points calculation
- Permission checks

### Integration Tests
- Square webhook handling
- Brevo contact sync
- Order creation flow
- Digital content access

### E2E Tests (Playwright)
- User registration → login → order view
- Admin login → customer management
- Subscription creation → cancellation
- Loyalty points earning → redemption

### Manual Testing
- Mobile responsiveness (iOS/Android)
- Cross-browser compatibility
- Accessibility (WCAG 2.1 AA)
- Performance (Lighthouse score >90)

---

## Performance Optimization

### Database
- ✅ Proper indexing (user_id, email, order_id)
- ✅ Query optimization (select specific columns)
- ✅ Connection pooling (Supabase default)
- ✅ Read replicas (if needed on paid tier)

### Frontend
- ✅ React Query for data fetching/caching
- ✅ Optimistic updates (instant UI feedback)
- ✅ Lazy loading (portal pages code-split)
- ✅ Image optimization (Next.js Image component)

### API
- ✅ Edge functions for low latency
- ✅ Webhook retry logic
- ✅ Background jobs for sync (not blocking)
- ✅ Rate limiting to prevent abuse

---

## Cost Analysis

### Supabase Free Tier
- 500 MB database ✅ (Plenty for 1000s of customers)
- 1 GB bandwidth ✅ (Should suffice for months)
- 50K monthly active users ✅ (Way more than needed)
- Unlimited API requests ✅

### When to Upgrade to Pro ($25/mo)
- Database exceeds 400 MB (~5,000+ customers with full history)
- Bandwidth exceeds 800 MB/month (~10,000+ logins)
- Need for daily backups
- Want real-time subscriptions for admin dashboard

### Square Costs (No Change)
- Already using Square, no additional costs
- Payment processing fees remain same

### Brevo Costs (No Change)
- Already using free tier (300 emails/day)
- May need to upgrade if email volume increases significantly

### Total Additional Monthly Cost
- **Months 1-6**: $0 (Supabase free tier)
- **After scale**: $25/mo (Supabase Pro)

---

## Success Metrics

### Customer Engagement
- **Portal registration rate**: Target 60% of purchasers
- **Login frequency**: Target 2x per month
- **Reorder rate**: Target 25% increase
- **Subscription adoption**: Target 15% of customers

### Business Impact
- **Customer lifetime value**: Target +30%
- **Repeat purchase rate**: Target +40%
- **Support ticket reduction**: Target -20% (self-service)
- **Loyalty program revenue**: Target $500+/month

### Technical Performance
- **Page load time**: <2 seconds on 3G
- **API response time**: <300ms (p95)
- **Uptime**: 99.9%
- **Error rate**: <0.1%

---

## Risks & Mitigation

### Risk 1: Data Sync Failures
**Mitigation:**
- Implement retry logic with exponential backoff
- Queue failed syncs for manual review
- Alert admin if sync fails repeatedly
- Maintain audit logs

### Risk 2: Supabase Free Tier Limits
**Mitigation:**
- Monitor usage via Supabase dashboard
- Set up alerts at 80% capacity
- Plan upgrade to Pro tier in advance
- Optimize queries to reduce bandwidth

### Risk 3: User Adoption
**Mitigation:**
- Make portal registration frictionless (magic links)
- Offer incentives (100 loyalty points for signing up)
- Send personalized invitation emails to existing customers
- Make portal value proposition clear

### Risk 4: Complexity Overhead
**Mitigation:**
- Phased rollout (core features first)
- Comprehensive documentation
- Admin training
- Monitoring and alerting

---

## Timeline Summary

### Weeks 1-6: Customer Portal
- Week 1: Auth & Profile
- Week 2: Order History
- Week 3: Digital Content
- Week 4: Subscriptions
- Week 5: Loyalty Program
- Week 6: Special Deals

### Weeks 7-11: Admin CRM
- Week 7: Dashboard
- Week 8: Customer Management
- Week 9: Order Management
- Week 10: Analytics
- Week 11: Integrations Panel

### Week 12: Testing & Polish
- Full E2E testing
- Performance optimization
- Security audit
- Documentation

### Week 13: Soft Launch
- Beta test with 50 customers
- Gather feedback
- Fix issues
- Iterate

### Week 14: Full Launch
- Announce to all customers
- Marketing campaign
- Monitor closely
- Support readiness

---

## Next Steps

### Immediate Actions (This Session)
1. ✅ Review and validate this plan
2. ✅ Get user approval on scope and timeline
3. ✅ Clarify any ambiguities
4. ⏭️ Create Supabase project
5. ⏭️ Set up database schema
6. ⏭️ Begin Phase 1 implementation

### Questions for User
1. **Subscriptions**: What products should be subscription-eligible? All 4?
2. **Loyalty Program**: What's the points-to-dollar conversion rate? (e.g., 100 pts = $1?)
3. **Digital Content**: What PDFs/guides do you currently have or plan to create?
4. **Admin Access**: Who needs admin CRM access besides you?
5. **Referral Program**: What's the referral incentive? (e.g., $10 off for referrer + referee?)
6. **Timeline**: Is 14 weeks realistic, or should we prioritize certain features?
7. **Budget**: Comfortable with $25/mo Supabase Pro when needed?

---

**Ready to proceed with implementation once approved!** 🚀
