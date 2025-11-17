# Remaining Files To Build

**Status: 65+ files created so far / ~55 files remaining**

Your local AI agent needs to create these remaining files. All complex logic is done - these are mostly UI pages and components that follow established patterns.

---

## ✅ What's Already Built (65 files)

1. **Foundation** (10 files)
   - Database schema
   - Environment config
   - Supabase clients
   - Type definitions
   - Utility functions

2. **API Routes** (24 files)
   - Auth, Loyalty, Subscriptions, Referrals
   - Sync, Webhooks, Admin APIs
   - Profile, Orders, Brevo integration

3. **Auth Pages** (4 files)
   - Login, Register, Reset Password pages

4. **Integration Utilities** (5 files)
   - Square sync, Brevo sync
   - Products, Referrals, Permissions utils

5. **Portal Layout** (2 files)
   - Portal layout, Navigation

---

## Files Remaining (~55 files)

### CUSTOMER PORTAL PAGES (12 files)

#### Dashboard
**File:** `src/app/portal/page.tsx`
```typescript
// Quick stats, recent orders, points balance
// Use: supabase.from('orders').select(), from('profiles').select()
```

#### Profile Pages (2 files)
- `src/app/portal/profile/page.tsx` - Edit profile form
- `src/components/portal/ProfileForm.tsx` - Reusable form component

#### Order Pages (4 files)
- `src/app/portal/orders/page.tsx` - Order list
- `src/app/portal/orders/[id]/page.tsx` - Order details
- `src/components/portal/OrderCard.tsx` - Order card component
- `src/components/portal/OrderStatusBadge.tsx` - Status badges

#### Subscription Pages (3 files)
- `src/app/portal/subscriptions/page.tsx` - Subscription list
- `src/app/portal/subscriptions/new/page.tsx` - Create subscription
- `src/components/portal/SubscriptionCard.tsx` - Subscription card

#### Rewards Pages (2 files)
- `src/app/portal/rewards/page.tsx` - Rewards dashboard
- `src/components/portal/RewardsDisplay.tsx` - Points display component

#### Referrals Page (1 file)
- `src/app/portal/referrals/page.tsx` - Referral dashboard

---

### ADMIN CRM PAGES (18 files)

#### Admin Layout (2 files)
- `src/app/admin/layout.tsx` - Admin wrapper with auth check
- `src/components/admin/AdminNav.tsx` - Admin navigation

#### Dashboard (3 files)
- `src/app/admin/dashboard/page.tsx` - Metrics dashboard
- `src/components/admin/MetricCard.tsx` - Stat cards
- `src/components/admin/RevenueChart.tsx` - Revenue line chart

#### Customer Management (3 files)
- `src/app/admin/customers/page.tsx` - Customer table
- `src/app/admin/customers/[id]/page.tsx` - Customer details
- `src/components/admin/CustomerTable.tsx` - Reusable table

#### Order Management (3 files)
- `src/app/admin/orders/page.tsx` - Order table
- `src/app/admin/orders/[id]/page.tsx` - Order details
- `src/components/admin/OrderTable.tsx` - Reusable table

#### Subscriptions (2 files)
- `src/app/admin/subscriptions/page.tsx` - Subscription table
- `src/components/admin/SubscriptionTable.tsx` - Reusable table

#### Analytics (3 files)
- `src/app/admin/analytics/page.tsx` - Analytics dashboard
- `src/components/admin/SalesChart.tsx` - Sales charts
- `src/components/admin/ProductChart.tsx` - Product performance

#### Integrations (2 files)
- `src/app/admin/integrations/page.tsx` - Integration monitoring
- `src/components/admin/SyncLogsTable.tsx` - Sync logs display

---

### SHARED COMPONENTS (15 files)

#### UI Components (shadcn/ui style)
- `src/components/ui/badge.tsx` - Status badges
- `src/components/ui/table.tsx` - Table component
- `src/components/ui/dialog.tsx` - Modal dialogs
- `src/components/ui/tabs.tsx` - Tab navigation
- `src/components/ui/select.tsx` - Dropdown select

#### Utility Components
- `src/components/LoadingSpinner.tsx` - Loading states
- `src/components/ErrorMessage.tsx` - Error displays
- `src/components/EmptyState.tsx` - No data states
- `src/components/ConfirmDialog.tsx` - Confirmation modals
- `src/components/CopyButton.tsx` - Copy to clipboard

#### Portal Specific
- `src/components/portal/LoyaltyTierBadge.tsx` - Tier status badge
- `src/components/portal/RedemptionOption.tsx` - Redemption cards
- `src/components/portal/ReferralLink.tsx` - Shareable link

#### Admin Specific
- `src/components/admin/SyncStatusCard.tsx` - Integration status
- `src/components/admin/PointsAdjustModal.tsx` - Manual points adjustment

---

### MIDDLEWARE & INTEGRATIONS (2 files)

#### Middleware
**File:** `middleware.ts` (root level)
```typescript
import { supabaseMiddleware } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await supabaseMiddleware(request);
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};
```

#### Checkout Integration
**File:** Modify `src/components/SquareCheckout.tsx`
- Add auth check at component mount
- Pre-fill form if logged in
- After payment success, sync to Supabase
- Award loyalty points

---

## Quick Implementation Guide

### Pattern: Data Fetching
```typescript
'use client';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('table_name')
        .select('*');
      setData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <EmptyState />;

  return <div>{/* Render data */}</div>;
}
```

### Pattern: Server Component (Admin)
```typescript
import { createServerClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isAdmin(user.id))) {
    redirect('/portal/login');
  }

  const { data } = await supabase.from('table').select('*');

  return <div>{/* Render */}</div>;
}
```

### Pattern: Form Submission
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (data.success) {
    // Success handling
  } else {
    // Error handling
  }

  setLoading(false);
};
```

---

## Styling Guidelines

**Use existing Tailwind classes:**
- Primary color: `bg-green-600`, `text-green-600`, `border-green-600`
- Secondary: `bg-gray-100`, `text-gray-700`
- Success: `bg-green-50`, `text-green-600`
- Error: `bg-red-50`, `text-red-600`
- Cards: `bg-white rounded-lg shadow-md p-6`
- Buttons: `bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700`

**Mobile-first responsive:**
- Use: `text-sm md:text-base`, `px-4 md:px-6`, `grid-cols-1 md:grid-cols-2`
- Min tap target: 44px (`py-2 px-4` minimum)

---

## Priority Order

1. **Portal Pages** (users need these first)
   - Dashboard, Profile, Orders, Rewards

2. **Portal Components** (make pages work)
   - Order cards, badges, forms

3. **Admin Pages** (for management)
   - Dashboard, Customers, Orders

4. **Admin Components** (make admin work)
   - Tables, charts, modals

5. **Middleware** (route protection)

6. **Checkout Integration** (tie it together)

---

## Testing After Build

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Test flows
- Register new account → check Supabase profiles table
- Login → redirects to /portal
- View orders → check data loads
- Admin login → check /admin access
- Create subscription → check subscriptions table
```

---

## Estimated Time for Local AI

- **Portal pages + components:** 2-3 hours
- **Admin pages + components:** 2-3 hours
- **Middleware + checkout:** 30 minutes
- **Testing + fixes:** 1 hour

**Total:** ~6-7 hours for local AI to complete

---

**Everything is set up - just need the UI pages and components!** 🚀
