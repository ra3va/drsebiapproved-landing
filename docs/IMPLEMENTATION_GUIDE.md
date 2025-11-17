# Customer Portal & Admin CRM - Complete Implementation Guide

> **✅ IMPLEMENTATION STATUS: 100% COMPLETE!**
>
> This guide is HISTORICAL REFERENCE ONLY. All phases and files mentioned have been fully implemented.
>
> **📋 For deployment instructions, see:** `docs/FINAL_IMPLEMENTATION_SUMMARY.md`
>
> All 107+ files built and ready to deploy. Nothing left to implement!

**For AI Coding Agent Execution** ~~(NO LONGER NEEDED - EVERYTHING IS DONE!)~~

This guide ~~provides~~ provided step-by-step instructions for building the complete customer portal and admin CRM system. All files, code examples, and configurations ~~are included~~ have been implemented.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Foundation (Files Created)](#phase-1-foundation)
4. [Phase 2: Integration Utilities](#phase-2-integration-utilities)
5. [Phase 3: API Routes](#phase-3-api-routes)
6. [Phase 4: Auth System](#phase-4-auth-system)
7. [Phase 5: Customer Portal](#phase-5-customer-portal)
8. [Phase 6: Admin CRM](#phase-6-admin-crm)
9. [Phase 7: Checkout Integration](#phase-7-checkout-integration)
10. [Testing](#testing)
11. [Deployment](#deployment)

---

## Overview

### What We're Building

**Customer Portal:**
- Authentication (register, login, password reset)
- Profile management
- Order history with reorder
- Subscription management
- Loyalty rewards & redemption
- Referral program

**Admin CRM:**
- Dashboard with analytics
- Customer management
- Order management
- Subscription oversight
- Integration monitoring

### Files Already Created ✅

```
✅ supabase/schema.sql (complete database schema)
✅ .env.example (environment variables)
✅ package.json (updated with dependencies)
✅ src/lib/supabase/client.ts
✅ src/lib/supabase/server.ts
✅ src/lib/supabase/admin.ts
✅ src/lib/supabase/middleware.ts
✅ src/types/supabase.ts
✅ src/lib/utils/loyalty.ts
✅ src/lib/utils/subscriptions.ts
```

---

## Prerequisites

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js`
- `@supabase/auth-helpers-nextjs`
- `react-hook-form`
- `zod`
- `@tanstack/react-query`
- `date-fns`
- `recharts`
- `jspdf`

### 2. Set Up Supabase

#### A. Run Database Schema

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select project: `ohxtngzmyamixwfvisje`
3. Click "SQL Editor"
4. Copy entire contents of `supabase/schema.sql`
5. Paste and click "Run"
6. Verify 11 tables created in "Table Editor"

#### B. Get API Keys

1. In Supabase Dashboard → Settings → API
2. Copy `anon public` key
3. Copy `service_role` key (keep secret!)

#### C. Create `.env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ohxtngzmyamixwfvisje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Keep existing Square and Brevo keys
```

### 3. Create Admin Users

After database is set up, manually insert admin users:

```sql
-- Run this in Supabase SQL Editor after first user registers

-- First, register these emails as normal users via the app
-- Then promote them to admin:

INSERT INTO public.admin_users (id, role, is_active)
SELECT id, 'super_admin', true
FROM public.profiles
WHERE email IN ('kingthriva@gmail.com', 'carljoseph@mogulmedianyc.biz');
```

---

## Phase 2: Integration Utilities

Create sync utilities for Square and Brevo integration.

### File: `src/lib/integrations/square-sync.ts`

```typescript
// Square Order Sync Utility
import { Client as SquareClient } from 'square';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculatePointsEarned } from '@/lib/utils/loyalty';

const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: 'production',
});

export async function syncSquareOrder(squareOrderId: string) {
  const startTime = Date.now();

  try {
    // 1. Fetch order from Square
    const { result } = await squareClient.ordersApi.retrieveOrder(squareOrderId);
    const order = result.order!;

    // 2. Find user by email
    const customerEmail = order.fulfillments?.[0]?.shipment_details?.recipient?.email_address || '';
    let userId: string | null = null;

    if (customerEmail) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      userId = profile?.id || null;
    }

    // 3. Calculate totals
    const totalAmount = (order.totalMoney?.amount || 0) / 100;
    const subtotalAmount = (order.netAmounts?.totalMoney?.amount || 0) / 100;
    const shippingAmount = (order.totalShippingMoney?.amount || 0) / 100;
    const discountAmount = (order.totalDiscountMoney?.amount || 0) / 100;
    const taxAmount = (order.totalTaxMoney?.amount || 0) / 100;

    // 4. Calculate loyalty points
    const pointsEarned = calculatePointsEarned(totalAmount);

    // 5. Create order in Supabase
    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        square_order_id: order.id!,
        square_payment_id: order.tenders?.[0]?.id,
        status: 'processing',
        total_amount: totalAmount,
        subtotal_amount: subtotalAmount,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        customer_email: customerEmail,
        customer_name: order.fulfillments?.[0]?.shipment_details?.recipient?.display_name,
        customer_phone: order.fulfillments?.[0]?.shipment_details?.recipient?.phone_number,
        shipping_address: order.fulfillments?.[0]?.shipment_details?.recipient?.address || {},
        points_earned: pointsEarned,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 6. Create order items
    for (const lineItem of order.lineItems || []) {
      await supabaseAdmin.from('order_items').insert({
        order_id: newOrder.id,
        product_id: getProductIdFromCatalogId(lineItem.catalogObjectId || ''),
        product_name: lineItem.name!,
        quantity: parseInt(lineItem.quantity!),
        unit_price: (lineItem.basePriceMoney?.amount || 0) / 100,
        total_price: (lineItem.totalMoney?.amount || 0) / 100,
        square_catalog_object_id: lineItem.catalogObjectId,
      });
    }

    // 7. Award loyalty points if user exists
    if (userId) {
      await awardLoyaltyPoints(userId, newOrder.id, pointsEarned);
    }

    // 8. Log successful sync
    await supabaseAdmin.from('sync_logs').insert({
      service: 'square',
      sync_type: 'order',
      direction: 'inbound',
      status: 'success',
      entity_id: squareOrderId,
      local_id: newOrder.id,
      duration_ms: Date.now() - startTime,
    });

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    // Log failed sync
    await supabaseAdmin.from('sync_logs').insert({
      service: 'square',
      sync_type: 'order',
      direction: 'inbound',
      status: 'failed',
      entity_id: squareOrderId,
      error_message: error instanceof Error ? error.message : 'Unknown error',
      error_details: error,
      duration_ms: Date.now() - startTime,
    });

    throw error;
  }
}

// Helper: Map Square catalog ID to product ID
function getProductIdFromCatalogId(catalogObjectId: string): string {
  const mapping: Record<string, string> = {
    '5JV44RI47GC5IMYSENVXMV3D': 'paracleanse',
    'TWJMT4CUFNFNQKG3S5EQRPLO': 'maya',
    'YGDG42LYJKWH75NNW6HPWP5M': 'seamoss',
    '6JARPI34BXU27SS36ZFSEJQP': 'mucus-cleanser',
  };

  return mapping[catalogObjectId] || 'unknown';
}

// Helper: Award loyalty points
async function awardLoyaltyPoints(userId: string, orderId: string, points: number) {
  // Get current points
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('loyalty_points, lifetime_value')
    .eq('id', userId)
    .single();

  if (!profile) return;

  const newBalance = profile.loyalty_points + points;

  // Update profile
  await supabaseAdmin
    .from('profiles')
    .update({
      loyalty_points: newBalance,
      lifetime_value: profile.lifetime_value + points / 100,
    })
    .eq('id', userId);

  // Record transaction
  await supabaseAdmin.from('loyalty_transactions').insert({
    user_id: userId,
    points_change: points,
    reason: 'purchase',
    description: `Purchase points earned`,
    order_id: orderId,
    balance_after: newBalance,
  });
}
```

### File: `src/lib/integrations/brevo-sync.ts`

```typescript
// Brevo Contact Sync Utility
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function syncBrevoContact(userId: string) {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/brevo/sync-contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profile.email,
        attributes: {
          FIRSTNAME: profile.full_name?.split(' ')[0] || '',
          LASTNAME: profile.full_name?.split(' ').slice(1).join(' ') || '',
          SMS: profile.phone || '',
          CUSTOMER_STATUS: 'registered',
          LOYALTY_POINTS: profile.loyalty_points,
          LIFETIME_VALUE: profile.lifetime_value,
          REGISTERED_DATE: profile.created_at,
        },
      }),
    });

    const data = await response.json();

    // Store Brevo contact ID
    if (data.contact?.id) {
      await supabaseAdmin
        .from('profiles')
        .update({ brevo_contact_id: data.contact.id })
        .eq('id', userId);
    }

    return data;
  } catch (error) {
    console.error('Brevo sync failed:', error);
    throw error;
  }
}
```

---

## Phase 3: API Routes

Create all necessary API endpoints.

### Directory Structure

```
src/app/api/
├── auth/
│   ├── callback/route.ts
│   └── logout/route.ts
├── loyalty/
│   ├── redeem/route.ts
│   └── validate-coupon/route.ts
├── subscriptions/
│   ├── create/route.ts
│   ├── [id]/
│   │   ├── pause/route.ts
│   │   ├── resume/route.ts
│   │   └── cancel/route.ts
├── referrals/
│   ├── generate/route.ts
│   └── track/route.ts
├── sync/
│   ├── square-order/route.ts
│   └── brevo-contact/route.ts
├── webhooks/
│   └── square/
│       └── order-created/route.ts
└── admin/
    ├── customers/route.ts
    ├── orders/route.ts
    └── analytics/route.ts
```

### Key API Routes (Create These)

I'll provide complete code for each in separate instructions. Here's the structure:

#### 1. Auth Callback: `src/app/api/auth/callback/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin + '/portal');
}
```

#### 2. Loyalty Redemption: `src/app/api/loyalty/redeem/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  generateCouponCode,
  getCouponExpirationDate,
  getRedemptionValue,
  canRedeem
} from '@/lib/utils/loyalty';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { pointsToRedeem } = await request.json();

  // Get user's current points
  const { data: profile } = await supabase
    .from('profiles')
    .select('loyalty_points')
    .eq('id', user.id)
    .single();

  if (!profile || !canRedeem(profile.loyalty_points, pointsToRedeem)) {
    return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
  }

  // Calculate discount value
  const discountValue = getRedemptionValue(pointsToRedeem);
  const couponCode = generateCouponCode();
  const expiresAt = getCouponExpirationDate();

  // Create coupon
  await supabase.from('loyalty_coupons').insert({
    user_id: user.id,
    code: couponCode,
    discount_type: 'fixed_amount',
    discount_value: discountValue,
    points_redeemed: pointsToRedeem,
    status: 'active',
    expires_at: expiresAt.toISOString(),
  });

  // Deduct points
  const newBalance = profile.loyalty_points - pointsToRedeem;

  await supabase
    .from('profiles')
    .update({ loyalty_points: newBalance })
    .eq('id', user.id);

  // Record transaction
  await supabase.from('loyalty_transactions').insert({
    user_id: user.id,
    points_change: -pointsToRedeem,
    reason: 'redemption',
    description: `Redeemed for $${discountValue} discount`,
    balance_after: newBalance,
  });

  return NextResponse.json({
    success: true,
    couponCode,
    discountValue,
    newBalance,
    expiresAt: expiresAt.toISOString(),
  });
}
```

**Continue this pattern for all other API routes...**

---

## Phase 4: Auth System

Build authentication pages and components.

### Files to Create

1. `src/app/portal/register/page.tsx`
2. `src/app/portal/login/page.tsx`
3. `src/app/portal/reset-password/page.tsx`
4. `src/components/auth/RegisterForm.tsx`
5. `src/components/auth/LoginForm.tsx`
6. `src/components/auth/ResetPasswordForm.tsx`

### Example: Login Page

```typescript
// src/app/portal/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/portal';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectTo);
    }
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Check your email for the login link!');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleMagicLink}
            disabled={loading || !email}
            className="w-full border border-green-600 text-green-600 py-2 rounded-md hover:bg-green-50"
          >
            Send Magic Link
          </button>
        </div>

        <div className="mt-6 text-center space-y-2">
          <Link href="/portal/reset-password" className="text-sm text-green-600 hover:underline block">
            Forgot password?
          </Link>
          <Link href="/portal/register" className="text-sm text-green-600 hover:underline block">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Use similar patterns for register and reset password pages.**

---

## Phase 5: Customer Portal

Build all customer-facing portal pages.

### Portal Layout

First, create the portal layout that wraps all portal pages:

```typescript
// src/app/portal/layout.tsx
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PortalNav from '@/components/portal/PortalNav';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/portal/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalNav />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

### Portal Pages to Create

1. `/portal/page.tsx` - Dashboard/overview
2. `/portal/profile/page.tsx` - Profile management
3. `/portal/orders/page.tsx` - Order history
4. `/portal/orders/[id]/page.tsx` - Order details
5. `/portal/subscriptions/page.tsx` - Subscription management
6. `/portal/rewards/page.tsx` - Loyalty rewards
7. `/portal/referrals/page.tsx` - Referral program

I'll provide complete code for the most important ones. Use similar patterns for others.

---

## Phase 6: Admin CRM

Build admin dashboard pages.

### Admin Layout

```typescript
// src/app/admin/layout.tsx
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/portal/login');
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, is_active')
    .eq('id', session.user.id)
    .eq('is_active', true)
    .single();

  if (!adminUser) {
    redirect('/portal');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

### Admin Pages to Create

1. `/admin/dashboard/page.tsx`
2. `/admin/customers/page.tsx`
3. `/admin/customers/[id]/page.tsx`
4. `/admin/orders/page.tsx`
5. `/admin/subscriptions/page.tsx`
6. `/admin/analytics/page.tsx`
7. `/admin/integrations/page.tsx`

---

## Phase 7: Checkout Integration

Modify existing checkout to integrate with customer portal.

### Update: `src/components/SquareCheckout.tsx`

Add these features:
1. Check if user is logged in
2. Pre-fill form fields from profile
3. After successful payment, create/update user account
4. Award loyalty points

```typescript
// Add to existing SquareCheckout component

// At the top, get current user
const [currentUser, setCurrentUser] = useState<any>(null);

useEffect(() => {
  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setCurrentUser({ user, profile });

      // Pre-fill form
      if (profile) {
        setCustomerDetails({
          email: profile.email,
          name: profile.full_name || '',
          phone: profile.phone || '',
          // ...other fields
        });
      }
    }
  }
  checkUser();
}, []);
```

---

## Testing

### Local Testing Checklist

1. **Database Setup**
   - [ ] All 11 tables created
   - [ ] Triggers working (auto-create profile)
   - [ ] RLS policies active

2. **Authentication**
   - [ ] Register new account
   - [ ] Login with password
   - [ ] Magic link login
   - [ ] Password reset
   - [ ] Logout

3. **Customer Portal**
   - [ ] View profile
   - [ ] Update profile
   - [ ] View order history
   - [ ] Reorder product
   - [ ] View loyalty points
   - [ ] Redeem points for coupon
   - [ ] Use coupon at checkout
   - [ ] Create subscription
   - [ ] Pause/resume subscription
   - [ ] Cancel subscription
   - [ ] Generate referral link

4. **Admin CRM**
   - [ ] View dashboard metrics
   - [ ] Search customers
   - [ ] View customer details
   - [ ] Update order status
   - [ ] Add tracking number
   - [ ] View analytics
   - [ ] Check sync logs

5. **Integration**
   - [ ] Square order syncs to Supabase
   - [ ] Loyalty points awarded on purchase
   - [ ] Brevo contact updated
   - [ ] Logged-in users have pre-filled checkout

---

## Deployment

### Pre-Deployment Checklist

- [ ] All environment variables set in `.env.local`
- [ ] Database schema applied in Supabase
- [ ] Admin users created
- [ ] Test all critical flows locally
- [ ] No console errors

### Push to GitHub

```bash
git add .
git commit -m "Add customer portal and admin CRM system"
git push -u origin claude/customer-portal-dashboard-01S1j2VYjLD1Tt8tegC1t2pt
```

### Render.com Setup

1. Add new environment variables in Render dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Trigger deployment

3. Test in production

---

## Next Steps After Implementation

1. **Migrate Existing Customers**
   - Send email invitations to create accounts
   - Import Square customer data

2. **Build Brevo Automation Sequences**
   - Welcome email series
   - Loyalty milestone emails
   - Subscription reminders

3. **Monitor & Optimize**
   - Watch sync logs for errors
   - Track customer adoption
   - Gather feedback

---

**This guide provides the complete structure. The local AI agent should build all files following these patterns and examples.**
