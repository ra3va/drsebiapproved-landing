# Complete Build Checklist - File by File

**For AI Agent Execution**

This checklist contains every file that needs to be created for the customer portal and admin CRM system. Check off each file as you build it.

---

## Status Legend
- ✅ = Completed
- ⏳ = In Progress
- ⏭️ = Not Started

---

## Foundation Files (Already Done)

- [✅] `supabase/schema.sql`
- [✅] `.env.example`
- [✅] `package.json` (updated with dependencies)
- [✅] `src/lib/supabase/client.ts`
- [✅] `src/lib/supabase/server.ts`
- [✅] `src/lib/supabase/admin.ts`
- [✅] `src/lib/supabase/middleware.ts`
- [✅] `src/types/supabase.ts`
- [✅] `src/lib/utils/loyalty.ts`
- [✅] `src/lib/utils/subscriptions.ts`

---

## Phase 1: Integration Utilities (2 files)

- [⏭️] `src/lib/integrations/square-sync.ts`
  - Functions: syncSquareOrder, awardLoyaltyPoints, getProductIdFromCatalogId
  - Purpose: Sync Square orders to Supabase, award points

- [⏭️] `src/lib/integrations/brevo-sync.ts`
  - Functions: syncBrevoContact
  - Purpose: Sync Supabase profiles to Brevo

---

## Phase 2: Utility Functions (3 files)

- [⏭️] `src/lib/utils/products.ts`
  - Product configurations (prices, names, IDs, Square catalog IDs)
  - Helper functions for product data

- [⏭️] `src/lib/utils/referrals.ts`
  - Generate unique referral codes
  - Track referral conversions
  - Award referral points

- [⏭️] `src/lib/utils/permissions.ts`
  - Check user permissions
  - Role-based access control helpers

---

## Phase 3: API Routes (25 files)

### Auth Routes (2 files)

- [⏭️] `src/app/api/auth/callback/route.ts`
  - Handle Supabase auth callback
  - Exchange code for session
  - Redirect to portal

- [⏭️] `src/app/api/auth/logout/route.ts`
  - Sign out user
  - Clear session
  - Redirect to login

### Loyalty Routes (2 files)

- [⏭️] `src/app/api/loyalty/redeem/route.ts`
  - Redeem points for coupon code
  - Create loyalty_coupon record
  - Deduct points from profile
  - Record transaction

- [⏭️] `src/app/api/loyalty/validate-coupon/route.ts`
  - Validate coupon code
  - Check expiration
  - Check if already used
  - Return discount value

### Subscription Routes (5 files)

- [⏭️] `src/app/api/subscriptions/create/route.ts`
  - Create new subscription
  - Calculate next shipment date
  - Calculate discounted price
  - Link to Square customer

- [⏭️] `src/app/api/subscriptions/[id]/route.ts`
  - GET: Fetch subscription details
  - PUT: Update subscription
  - DELETE: Delete subscription

- [⏭️] `src/app/api/subscriptions/[id]/pause/route.ts`
  - Pause active subscription
  - Set paused_at timestamp

- [⏭️] `src/app/api/subscriptions/[id]/resume/route.ts`
  - Resume paused subscription
  - Clear paused_at timestamp
  - Recalculate next shipment date

- [⏭️] `src/app/api/subscriptions/[id]/cancel/route.ts`
  - Cancel subscription
  - Set cancelled_at timestamp
  - Update status to 'cancelled'

### Referral Routes (2 files)

- [⏭️] `src/app/api/referrals/generate/route.ts`
  - Generate unique referral link
  - Return shareable URL

- [⏭️] `src/app/api/referrals/track/route.ts`
  - Track referral click
  - Store referee email
  - Create referral record

### Sync Routes (2 files)

- [⏭️] `src/app/api/sync/square-order/route.ts`
  - Manual trigger for order sync
  - Calls syncSquareOrder utility
  - Returns sync status

- [⏭️] `src/app/api/sync/brevo-contact/route.ts`
  - Manual trigger for contact sync
  - Calls syncBrevoContact utility
  - Returns sync status

### Webhook Routes (1 file)

- [⏭️] `src/app/api/webhooks/square/order-created/route.ts`
  - Receive Square order webhook
  - Verify webhook signature
  - Call syncSquareOrder utility
  - Return 200 OK

### Admin Routes (6 files)

- [⏭️] `src/app/api/admin/customers/route.ts`
  - GET: List all customers with filters
  - POST: Create customer manually

- [⏭️] `src/app/api/admin/customers/[id]/route.ts`
  - GET: Fetch customer details
  - PUT: Update customer
  - DELETE: Delete customer

- [⏭️] `src/app/api/admin/orders/route.ts`
  - GET: List all orders with filters
  - PUT: Update order status

- [⏭️] `src/app/api/admin/orders/[id]/route.ts`
  - GET: Fetch order details
  - PUT: Update order (status, tracking)

- [⏭️] `src/app/api/admin/analytics/route.ts`
  - GET: Fetch analytics data
  - Query params: timeframe, metric

- [⏭️] `src/app/api/admin/sync-logs/route.ts`
  - GET: Fetch sync logs
  - Query params: service, status, limit

### Profile Routes (2 files)

- [⏭️] `src/app/api/profile/route.ts`
  - GET: Fetch current user profile
  - PUT: Update profile

- [⏭️] `src/app/api/profile/password/route.ts`
  - PUT: Update user password

### Order Routes (1 file)

- [⏭️] `src/app/api/orders/[id]/reorder/route.ts`
  - Create checkout session from order
  - Pre-fill cart with order items
  - Return checkout URL

---

## Phase 4: Auth Pages (6 files)

- [⏭️] `src/app/portal/register/page.tsx`
  - Registration form
  - Email/password fields
  - Full name field
  - Marketing consent checkbox
  - Handle referral code from URL

- [⏭️] `src/app/portal/login/page.tsx`
  - Login form
  - Email/password fields
  - Magic link option
  - "Forgot password" link
  - Redirect to original destination

- [⏭️] `src/app/portal/reset-password/page.tsx`
  - Password reset request form
  - Email field
  - Send magic link

- [⏭️] `src/app/portal/reset-password/confirm/page.tsx`
  - New password form
  - Confirm password field
  - Update password

- [⏭️] `src/components/auth/RegisterForm.tsx`
  - Reusable registration form component
  - Form validation with zod
  - Error handling

- [⏭️] `src/components/auth/LoginForm.tsx`
  - Reusable login form component
  - Form validation
  - Loading states

---

## Phase 5: Customer Portal (20 files)

### Layout & Navigation (2 files)

- [⏭️] `src/app/portal/layout.tsx`
  - Check authentication
  - Redirect if not logged in
  - Include navigation

- [⏭️] `src/components/portal/PortalNav.tsx`
  - Navigation menu
  - Links: Dashboard, Orders, Subscriptions, Rewards, Referrals, Profile
  - Logout button
  - Mobile responsive

### Dashboard (1 file)

- [⏭️] `src/app/portal/page.tsx`
  - Overview dashboard
  - Quick stats (orders, points, subscriptions)
  - Recent orders
  - Quick actions

### Profile Pages (2 files)

- [⏭️] `src/app/portal/profile/page.tsx`
  - Profile form
  - Edit name, email, phone
  - Marketing preferences
  - Password change button

- [⏭️] `src/components/portal/ProfileForm.tsx`
  - Reusable profile form
  - Form validation
  - Save functionality

### Order Pages (4 files)

- [⏭️] `src/app/portal/orders/page.tsx`
  - Order list
  - Filter by status, date
  - Sort options
  - Pagination

- [⏭️] `src/app/portal/orders/[id]/page.tsx`
  - Order details
  - Line items
  - Shipping status
  - Tracking number
  - Reorder button
  - Download invoice

- [⏭️] `src/components/portal/OrderCard.tsx`
  - Order card component
  - Show: date, status, total, items
  - Click to view details

- [⏭️] `src/components/portal/OrderStatusBadge.tsx`
  - Status badge component
  - Color-coded by status

### Subscription Pages (4 files)

- [⏭️] `src/app/portal/subscriptions/page.tsx`
  - Active subscriptions list
  - Create new subscription button

- [⏭️] `src/app/portal/subscriptions/new/page.tsx`
  - Create subscription form
  - Product selector
  - Frequency selector
  - Payment method
  - Preview pricing

- [⏭️] `src/app/portal/subscriptions/[id]/page.tsx`
  - Subscription details
  - Next shipment date
  - Pause/resume buttons
  - Cancel button
  - Update frequency

- [⏭️] `src/components/portal/SubscriptionCard.tsx`
  - Subscription card component
  - Show: product, frequency, next date, status

### Rewards Pages (3 files)

- [⏭️] `src/app/portal/rewards/page.tsx`
  - Points balance (hero)
  - Redemption options
  - Transaction history
  - Tier status

- [⏭️] `src/components/portal/RedemptionOptions.tsx`
  - Grid of redemption tiers
  - Click to redeem
  - Show bonus percentages

- [⏭️] `src/components/portal/LoyaltyTransactionHistory.tsx`
  - Transaction list
  - Show: date, reason, points change, balance
  - Pagination

### Referral Pages (2 files)

- [⏭️] `src/app/portal/referrals/page.tsx`
  - Referral link display
  - Copy button
  - Social share buttons
  - Referral history
  - Pending referrals

- [⏭️] `src/components/portal/ReferralLink.tsx`
  - Referral link component
  - Copy to clipboard
  - QR code option

---

## Phase 6: Admin CRM (25 files)

### Layout & Navigation (2 files)

- [⏭️] `src/app/admin/layout.tsx`
  - Check authentication
  - Check admin status
  - Redirect if not admin
  - Include admin navigation

- [⏭️] `src/components/admin/AdminNav.tsx`
  - Admin navigation menu
  - Links: Dashboard, Customers, Orders, Subscriptions, Analytics, Integrations
  - User menu

### Dashboard (3 files)

- [⏭️] `src/app/admin/dashboard/page.tsx`
  - Key metrics cards
  - Revenue chart
  - Recent orders
  - Customer growth chart
  - Quick actions

- [⏭️] `src/components/admin/MetricCard.tsx`
  - Metric card component
  - Show: title, value, change percentage

- [⏭️] `src/components/admin/RevenueChart.tsx`
  - Line chart for revenue
  - Using recharts
  - Time period selector

### Customer Management (5 files)

- [⏭️] `src/app/admin/customers/page.tsx`
  - Customer table
  - Search bar
  - Filters (tier, status)
  - Sort options
  - Pagination

- [⏭️] `src/app/admin/customers/[id]/page.tsx`
  - Customer details
  - Profile info
  - Order history
  - Loyalty points
  - Subscriptions
  - Edit buttons
  - Manual points adjustment

- [⏭️] `src/components/admin/CustomerTable.tsx`
  - Reusable customer table
  - Sortable columns
  - Row actions

- [⏭️] `src/components/admin/CustomerDetails.tsx`
  - Customer detail view
  - Tabbed interface
  - Profile, orders, subscriptions, loyalty

- [⏭️] `src/components/admin/PointsAdjustmentModal.tsx`
  - Modal for manual points adjustment
  - Reason field
  - Amount field (+ or -)

### Order Management (4 files)

- [⏭️] `src/app/admin/orders/page.tsx`
  - Order table
  - Filters (status, date, product)
  - Search by order ID, customer
  - Export to CSV button

- [⏭️] `src/app/admin/orders/[id]/page.tsx`
  - Order details
  - Update status dropdown
  - Add tracking number form
  - Refund button
  - Customer link

- [⏭️] `src/components/admin/OrderTable.tsx`
  - Reusable order table
  - Sortable columns
  - Status badges
  - Quick actions

- [⏭️] `src/components/admin/UpdateOrderModal.tsx`
  - Modal for updating order
  - Status dropdown
  - Tracking number input
  - Carrier input

### Subscription Management (2 files)

- [⏭️] `src/app/admin/subscriptions/page.tsx`
  - Subscription table
  - Filters (status, product, frequency)
  - Upcoming shipments view
  - Quick actions

- [⏭️] `src/components/admin/SubscriptionTable.tsx`
  - Reusable subscription table
  - Customer link
  - Product info
  - Next shipment date
  - Actions

### Analytics (5 files)

- [⏭️] `src/app/admin/analytics/page.tsx`
  - Analytics dashboard
  - Multiple chart sections
  - Date range selector
  - Export options

- [⏭️] `src/components/admin/SalesChart.tsx`
  - Sales over time chart
  - Using recharts
  - Compare periods

- [⏭️] `src/components/admin/ProductPerformanceChart.tsx`
  - Bar chart of product sales
  - Compare products

- [⏭️] `src/components/admin/LoyaltyStatsCard.tsx`
  - Loyalty program statistics
  - Points issued, redeemed
  - Redemption rate

- [⏭️] `src/components/admin/SubscriptionMetrics.tsx`
  - Subscription KPIs
  - Active count, churn rate
  - Revenue from subscriptions

### Integration Monitoring (4 files)

- [⏭️] `src/app/admin/integrations/page.tsx`
  - Integration status cards
  - Square sync status
  - Brevo sync status
  - Sync logs table
  - Manual sync buttons

- [⏭️] `src/components/admin/SyncStatusCard.tsx`
  - Integration status card
  - Show: service, last sync, status
  - Manual sync button

- [⏭️] `src/components/admin/SyncLogsTable.tsx`
  - Sync logs table
  - Filter by service, status
  - View error details

- [⏭️] `src/components/admin/ManualSyncButton.tsx`
  - Button to trigger manual sync
  - Loading state
  - Success/error feedback

---

## Phase 7: Checkout Integration (1 file modified)

- [⏭️] Modify `src/components/SquareCheckout.tsx`
  - Add: Check if user is logged in
  - Add: Pre-fill form from profile
  - Add: "Login" link if not logged in
  - Add: After payment, sync to Supabase
  - Add: Award loyalty points
  - Add: Update lifetime value

---

## Phase 8: Middleware (1 file)

- [⏭️] `middleware.ts` (root level)
  - Import supabaseMiddleware
  - Protect `/portal/*` routes
  - Protect `/admin/*` routes
  - Check admin status for admin routes

---

## Phase 9: UI Components (10 files)

### General Components

- [⏭️] `src/components/ui/badge.tsx`
  - Badge component (if not exists)
  - Used for status indicators

- [⏭️] `src/components/ui/table.tsx`
  - Table component (if not exists)
  - Used in admin tables

- [⏭️] `src/components/ui/dialog.tsx`
  - Dialog/Modal component (if not exists)
  - Used for confirmations

- [⏭️] `src/components/ui/select.tsx`
  - Select dropdown (already exists - verify)

- [⏭️] `src/components/ui/tabs.tsx`
  - Tabs component
  - Used in customer details

### Shared Components

- [⏭️] `src/components/LoadingSpinner.tsx`
  - Loading spinner component
  - Used throughout app

- [⏭️] `src/components/ErrorMessage.tsx`
  - Error display component
  - Consistent error styling

- [⏭️] `src/components/EmptyState.tsx`
  - Empty state component
  - Used when no data

- [⏭️] `src/components/ConfirmDialog.tsx`
  - Confirmation dialog
  - Used for destructive actions

- [⏭️] `src/components/CopyButton.tsx`
  - Copy to clipboard button
  - Used for referral links, coupon codes

---

## Phase 10: Documentation (Already Done)

- [✅] `docs/IMPLEMENTATION_GUIDE.md`
- [✅] `docs/PR_DESCRIPTION.md`
- [✅] `docs/BUILD_CHECKLIST.md` (this file)

---

## Total File Count

### Created ✅: 10 files
### To Create ⏭️: ~110 files
### Total: ~120 files

---

## Build Order Recommendation

1. **Phase 1-2:** Utilities (foundation)
2. **Phase 3:** API routes (backend logic)
3. **Phase 4:** Auth pages (users can log in)
4. **Phase 5:** Customer portal (customer features)
5. **Phase 6:** Admin CRM (admin features)
6. **Phase 7:** Checkout integration (tie everything together)
7. **Phase 8-9:** Middleware & UI components (polish)

---

## Testing After Each Phase

After each phase, test the features:

**Phase 3 (APIs):** Use Postman or curl to test endpoints
**Phase 4 (Auth):** Test registration and login flows
**Phase 5 (Portal):** Test all customer-facing features
**Phase 6 (Admin):** Test all admin features
**Phase 7 (Checkout):** Test integrated checkout flow

---

## Estimated Build Time

**For AI Coding Agent:**
- Phase 1-2: 30 minutes
- Phase 3: 2 hours
- Phase 4: 1 hour
- Phase 5: 3 hours
- Phase 6: 3 hours
- Phase 7: 30 minutes
- Phase 8-9: 1 hour
- Testing: 2 hours

**Total: ~12-14 hours of AI agent work**

---

## Next Steps

1. Review this checklist
2. Start building files in order
3. Test after each phase
4. Commit frequently
5. Update this checklist as you go

---

**Let's build! 🚀**
