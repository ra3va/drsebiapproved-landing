# Dr. Sebi Approved - Health & Wellness E-Commerce Platform

A Next.js-based e-commerce platform for Dr. Sebi's authentic health products, featuring an optimized mobile-first checkout experience, a custom "Win-Back" CRM for legacy customers, and intelligent marketing automation.

## 🌟 Products

- **ParaCleanse Elite** - Two-Phase Parasite Cleansing System ($59.99)
- **Maya Formula** - 26 Herb Iron-Rich Formula ($44.99)
- **Sea Moss Capsules** - Honduran Wildcrafted Sea Moss ($31.99)
- **Mucus Cleanser** - Respiratory & Cellular Cleansing ($31.99)

## 🛠 Tech Stack

- **Framework**: Next.js 14.1.0 with App Router
- **Runtime**: React 18 + TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Payment Processing**: Square Web Payments SDK & Catalog API
- **Marketing Automation**: Brevo API (Behavioral tracking, Flow automation)
- **Cold/Win-Back Campaigns**: Zoho Mail API (Rate-limited sending)
- **Campaign Database**: Supabase (PostgreSQL)
- **Deployment**: GitHub + Render.com (Automatic deployments)

## 📦 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Square Configuration (Payments)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-app-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-location-id
SQUARE_ACCESS_TOKEN=your-access-token

# Brevo Configuration (Marketing Automation)
BREVO_API_KEY=your-brevo-key

# Zoho Configuration (Win-Back Campaigns)
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-secret
ZOHO_REDIRECT_URI=https://drsebiapproved.com/api/auth/zoho/callback
ZOHO_EMAIL=info@drsebiapproved.com
ZOHO_ACCOUNTS_BASE_URL=https://accounts.zoho.com
ZOHO_API_BASE_URL=https://mail.zoho.com/api

# Supabase Configuration (Campaign Database)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🏗 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin Dashboards
│   │   └── campaign/             # Zoho Campaign GUI (Upload/Status)
│   ├── api/                      # API Routes
│   │   ├── auth/                 # OAuth Handlers (Zoho)
│   │   ├── brevo/                # Brevo Endpoints (Tracking/Flows)
│   │   ├── campaign/             # Zoho Campaign Endpoints (Send/Status)
│   │   └── square/               # Square Payment Endpoints
│   ├── blog/                     # Blog System
│   ├── checkout/                 # Checkout Flow
│   ├── mucus-winback/            # Specialized Funnel Landing Page
│   ├── paracleanse/              # Product Pages
│   ├── maya/
│   ├── seamoss/
│   └── mucus-cleanser/
├── components/                   # React Components
│   ├── ui/                       # UI Library
│   ├── CountdownTimer.tsx        # Funnel Timer
│   ├── WinBackOptIn.tsx          # Funnel Email Capture
│   └── SquareCheckout.tsx        # Core Checkout Component
├── lib/                          # Utilities
│   ├── supabase.ts               # Database Client (Admin/Client)
│   ├── zoho.ts                   # Zoho Mail Client
│   └── brevo-client.js           # Brevo Client

docs/
├── brevo/                        # Marketing Automation Docs
├── square/                       # Payment Integration Docs
└── archive/                      # Legacy Docs
```

## 📧 Email Infrastructure Strategy

The platform uses a dual-strategy for email to protect domain reputation:

### 1. Marketing Automation (Brevo)
- **Purpose:** Nurturing active leads, behavioral tracking, cart abandonment.
- **Triggers:** Quiz submissions, Checkout steps, Page visits.
- **Tracking:** Full funnel visibility (Page View -> Add to Cart -> Purchase).

### 2. Win-Back System (Zoho + Supabase)
- **Purpose:** Re-engaging 8,000+ legacy customers (cold list).
- **Mechanism:** Custom rate-limited sender (50-75 emails/day).
- **Dashboard:** `/admin/campaign` for managing batches and CSV uploads.
- **Features:**
  - **Bucket Logic:** Prioritizes follow-ups over new leads.
  - **Stop Switch:** Purchases automatically halt future campaign emails.
  - **Smart Links:** Clicks are tracked and synced to Brevo.

## 🎯 Specialized Funnels

### Mucus Cleanser Win-Back (`/mucus-winback`)
A high-conversion funnel targeting lapsed customers during flu season.
- **Offer:** $24.99 (37% OFF) via `STOPMUCUS` coupon.
- **Urgency:** 72-hour persistent countdown timer.
- **Frictionless:** Email entry on landing page **auto-fills** the checkout form.
- **Redirect:** Immediate redirect to checkout with coupon applied.

## 💳 Checkout Features

- **Mobile-First:** 3-step progressive flow (Contact -> Shipping -> Payment).
- **Smart Cart:** "Add 1 more for Free Shipping" logic ($5.95 vs Free).
- **Square Integration:** Full Customer Directory sync (deduplicated by email).
- **Trust:** Social proof, payment icons, and guarantee badges.

## 🚀 Deployment

**Platform:** Render.com (Web Service) linked to GitHub `main` branch.
**Build Command:** `npm install && npm run build`
**Start Command:** `npm run start`

**Note:** The Zoho/Supabase admin APIs require `force-dynamic` to prevent Next.js from caching admin data.

## ✅ Recent Major Updates

### Mucus Cleanser Win-Back Funnel (Nov 22, 2025)
- ✅ **Pre-Filled Checkout:** Contact info passes from landing page to checkout.
- ✅ **Auto-Coupons:** URL parameters trigger validation and discount application.
- ✅ **Mobile Optimization:** Responsive typography and layout adjustments.

### Zoho Win-Back System (Nov 19, 2025)
- ✅ **Universal GUI:** Admin dashboard for managing CSV uploads and batches.
- ✅ **Database Logic:** Supabase integration for tracking campaign state.
- ✅ **Deletion Features:** Granular control to remove emails or clear campaigns.

### Product Page Tracking (Nov 17, 2025)
- ✅ **Behavioral Hook:** `useProductTracking` monitors engagement time.
- ✅ **CTA Tracking:** Identifies which specific button triggered the click.

---

**Last Updated:** November 23, 2025
**Version:** 3.2.0 (Win-Back System + Specialized Funnels)
**Status:** Production Ready ✅