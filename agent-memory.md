# Project Memory: Dr. Sebi Approved (Parasite Cleanse Landing)

**Last Updated:** December 1, 2025 10:35 CST
**Status:** Production Ready / Active Marketing Phase (Black Friday Sale) - FTC Compliance Audit in Progress
**URL:** https://drsebiapproved.com
**Tech Stack:** Next.js 14, Tailwind, Square (Payments), Brevo (Marketing Campaigns & Transactional), Zoho Mail (Deprecated/Fallback for Cold), Supabase (Campaign Database), Render (Hosting).

---

## 🧠 Project Context & Architecture

This project has transitioned from a simple landing page with external Shopify checkout to a fully custom, integrated e-commerce platform. It is currently running a **Black Friday Campaign** (Nov 25-30) with a full site-wide theme takeover.

### Core Pillars
1.  **Commerce (Square):** Custom multi-step checkout, product catalog, coupon management (`BLACKFRIDAY30`), and customer profiles.
2.  **Marketing Hub (Brevo):** 
    - **Behavioral:** Progressive profile building and automated email flows.
    - **Campaigns:** Primary engine for bulk email sends (migrated from Zoho due to spam blocks).
    - **Transactional:** Receipt emails and system notifications.
3.  **Outreach Engine (Zoho):** *Legacy/Fallback*. Infrastructure exists but was blocked by spam filters during Black Friday launch. Now using Brevo Marketing Campaigns.
4.  **Content Funnel:** E-commerce PDPs (Black Friday mode) and SEO-optimized blog driving traffic.

---

## � Project Structure

```
.
├── content/                # MDX Content
│   └── blog/               # Blog posts (MDX)
├── docs/                   # Project Documentation
│   ├── brevo/              # Email Marketing
│   ├── square/             # Commerce & Payments
│   └── zoho/               # Legacy Email System
├── scripts/                # Automation Scripts
│   ├── meta/               # Meta Ads Management
│   └── tests/              # Verification Scripts
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── admin/          # Internal Tools (Campaign Manager)
│   │   ├── api/            # Backend Endpoints
│   │   ├── checkout/       # Square Checkout Flow
│   │   ├── paracleanse/    # Product Page (Example)
│   │   └── ...
│   ├── components/         # UI Components
│   │   ├── analytics/      # Pixels & Trackers
│   │   └── ui/             # Design System (shadcn)
│   ├── lib/                # Core Logic
│   │   ├── supabase.ts     # Database Client
│   │   ├── square.ts       # Payment SDK
│   │   └── brevo-client.js # Email API
│   └── hooks/              # React Hooks
└── ...
```

---

## �🛠 System Implementation Status

### 1. Payment & Commerce (Square)
**Status:** ✅ **LIVE (Black Friday Mode)**
- **Theme:** Full Black/Gold site takeover with sticky countdown banner.
- **Pages:** Converted educational landers to **E-commerce Product Detail Pages (PDPs)** with social proof, quantity selectors, and urgency elements.
- **Catalog:** 4 Core Products updated with Black Friday pricing (30% off).
    - ParaCleanse Elite ($62.99), Maya ($41.99), Sea Moss ($27.99), Mucus Cleanser ($27.99).
- **Checkout:** Custom "SquareCheckout" with premium gold accents, savings banner, and countdown timer.
    - *Features:* Pre-fills quantity and coupon from URL (`?quantity=2&coupon=BLACKFRIDAY30`).
    - *Fixes:* Resolved discount application logic to match order totals.
- **Receipts:** Transactional receipt emails now sent via **Brevo** immediately after purchase.
- **Reference Docs:**
    - `docs/square/SQUARE_SETUP.md`
    - `BLACK_FRIDAY_REVERT_PLAN.md`
    - `FTC_COMPLIANCE_AUDIT.md` (Local)

### 2. Marketing Automation & Campaigns (Brevo)
**Status:** ✅ **LIVE (Primary Engine)**
- **Architecture:** "Multi-Product Hub" + Campaign Manager.
- **Campaigns:** Migrated from Zoho.
    - *Black Friday 2025:* List of 1,139 contacts synced from Supabase.
    - *Capacity:* ~300 emails/day (Free Tier limit).
    - *Tools:* Custom scripts for syncing contacts and creating campaigns (`scripts/sync-contacts-to-brevo.js`, etc.).
- **Tracking:** Full funnel visibility.
    - *Homepage:* Problem navigation tracking.
    - *Quiz:* Score and recommendation tracking.
    - *Product Pages:* Time-on-page (>30s engagement), CTA location clicks.
    - *Checkout:* Progressive capture (Step 1 email capture -> Step 2 shipping -> Purchase).
- **Reference Docs:**
    - `docs/brevo/BREVO_MULTI_PRODUCT_INTEGRATION.md`
    - `docs/brevo/BREVO_API_CAPABILITIES.md`

### 3. Win-Back Campaign System (Zoho + Supabase)
**Status:** ⚠️ **BLOCKED / DEPRECATED**
- **History:** Built for rate-limited sending (50-75/day). Hit spam detection (550 5.4.6) after 42 emails during Black Friday launch.
- **Current State:** Infrastructure remains (API routes, Supabase tables), but active sending has moved to Brevo.
- **Dashboard:** `/admin/campaign` still functional for list management but sending is paused.
- **Reference Docs:**
    - `docs/zoho/ZOHO_INTEGRATION_SUMMARY.md`
    - `docs/zoho/ZOHO_SETUP_INSTRUCTIONS.md`

### 4. Analytics & Intelligence (GA4)
**Status:** ✅ **LIVE (E-commerce Enhanced)**
- **Tracking:** Full funnel visibility (View Item -> Begin Checkout -> Add Shipping -> Add Payment -> Purchase).
- **Features:** 
    - Accurate revenue tracking (discounts & coupons included).
    - Bundle/Upsell tracking in checkout.
    - Agent access enabled via `docs/AGENT_GA4_ACCESS.md`.
    - **Facebook Pixel:** Fixed double-firing issue (moved to `<head>`, removed `<noscript>`).
- **Reference Docs:**
    - `docs/AGENT_GA4_ACCESS.md`
    - `docs/GA4_TRACKING_AUDIT.md`

### 6. Ad Network Integration (Meta)
**Status:** ✅ **LIVE (API Connected)**
- **Integration:** Direct API connection to "26 HM" Ad Account (`act_789466743256239`).
- **Capabilities:** Programmatic campaign creation, performance monitoring (Spend, ROAS, CTR), and management.
- **Tools:** Custom scripts in `scripts/meta/` for account checks and token management.
- **Agent Skill:** `.factory/skills/meta-ads/SKILL.md` enables natural language ad management.
- **Reference Docs:**
    - `sessions/2025-11-25_10-54-08_meta-ads-integration.md`

---

## 📜 Chronological Development History

### Phase 1: Foundation (Aug 2025)
- Migrated from Docker/DigitalOcean to **GitHub/Render** for CI/CD.
- Implemented **Brevo** for Lead Magnet (Gut Health Guide) delivery.
- Overhauled **Blog Content** for SEO and internal linking.
- Added "Hidden Parasite Crisis" homepage section.

### Phase 2: The E-Commerce Rewrite (Nov 16-17, 2025)
- **Square Integration:** Built the entire catalog and payment flow from scratch.
- **Shopify Excision:** Removed all legacy Shopify dependencies and tracking.
- **Tracking Layer:** Implemented `useProductTracking` and progressive checkout capture.
- **Zoho Port:** Ported the "Amber Unbound" CRM email logic to this project for the 8k customer list.

### Phase 3: Refinement & Tooling (Nov 18-19, 2025)
- **Dashboard Polish:** Fixed critical bugs in the Admin Dashboard (1000 row limit, database write consistency).
- **UX Improvements:** Added manual email entry, "Clear All" danger zones, and mobile responsiveness fixes.
- **Caching Fixes:** Resolved Next.js App Router aggressive caching on Admin APIs.

### Phase 4: Specific Funnels (Nov 21-22, 2025)
- **Mucus Cleanser Win-Back:**
    - Created `/mucus-winback` landing page.
    - Implemented 72h countdown timer (localStorage).
    - **Pre-fill Flow:** Email entered on landing page auto-fills at checkout.
    - **Discount:** `STOPMUCUS` (37% off) auto-applies via URL param.
- **Square Customer Data Fix:** Resolved issue where customer data was stuck in metadata; now creates proper Customer profiles.

### Phase 5: Organization & Maintenance (Nov 23, 2025)
- **Root Directory Cleanup:**
    - Moved scripts to `scripts/` and `scripts/tests/`.
    - Consolidated documentation into `docs/brevo/`, `docs/zoho/`, `docs/shippo/`, and `docs/archive/`.
    - Archived legacy/duplicate configuration files to `_deprecated/`.
    - Updated path references in utility scripts.

### Phase 6: Black Friday Campaign (Nov 23-24, 2025)
- **Full Site Takeover:** Implemented Black/Gold theme across Header, Footer, and CTAs. Added sticky countdown banner.
- **PDP Transformation:** Converted educational landers to high-conversion E-commerce Product Detail Pages (PDPs) with dynamic social proof ("2.5K in carts") and quantity selectors.
- **Checkout Optimization:** Added "Premium Urgency Accents", savings banners, and fixed quantity/coupon pre-fill logic.
- **Pricing & Coupons:** Integrated `BLACKFRIDAY30` (30% off). Updated catalog pricing across the board.
- **Compliance:** Added `/terms`, `/refund-policy`, and `/disclaimer` pages for ad compliance.
- **Technical Fixes:** Resolved critical CSS compilation failure and mobile responsive issues.
- **Artifacts:** Created `BLACK_FRIDAY_REVERT_PLAN.md` and backed up original landers to `src/app/*-lander/`.

### Phase 7: Analytics & Checkout Finalization (Nov 24, 2025)
- **GA4 E-Commerce:** Implemented complete event tracking (view_item, begin_checkout, add_shipping_info, add_payment_info, purchase).
- **Agent Integration:** Created `docs/AGENT_GA4_ACCESS.md`.
- **Revenue Accuracy:** Fixed tracking to include item-level discounts and correct transaction totals.
- **Receipts:** Implemented transactional receipt emails via Brevo (`/api/brevo/send-receipt`).
- **Square Fix:** Fixed "Payment total does not match order total" error by applying proper discount objects to Square orders.

### Phase 8: Black Friday Launch & Pivot (Nov 25, 2025)
- **Launch Attempt:** Initiated Zoho email campaign to 1,180 customers.
- **Blocker:** Zoho blocked sending after 42 emails (Spam Detection 550 5.4.6).
- **Pivot to Brevo:**
    - Migrated contact list from Supabase to Brevo ("Black Friday 2025" list).
    - Created new scripts: `sync-contacts-to-brevo.js`, `create-brevo-campaign.js`, `check-brevo-stats.js`.
    - Launched Brevo Marketing Campaign.
    - **Result:** 298 emails sent on Day 1 (hitting 300/day limit). Remaining ~840 scheduled for subsequent days.
    - **Strategy:** Uses Brevo's superior reputation management and throttling.

### Phase 9: Ad Network Integration (Nov 25, 2025)
- **Meta Ads API:** Established connection to "26 HM" ad account.
- **Capabilities:** Enabled programmatic campaign creation and performance monitoring.
- **Tooling:** Added scripts for token exchange and account status checks.

### Phase 10: Compliance & Tracking Fixes (Nov 25, 2025)
- **Facebook Pixel Fix:** Resolved double-firing issue by moving initialization to `layout.tsx` head and creating a dedicated `FacebookPixelRouteTracker` for SPA navigation. Removed `<noscript>` tag to prevent duplicate counting.
- **FTC Compliance Audit:**
    - **Trigger:** Square flagged `/paracleanse` for unsubstantiated health claims.
    - **Action:** Audited and updated content to remove disease claims (e.g., "Eliminates parasites" → "Internal Cleansing").
    - **Social Proof:** Removed unverified "live cart" counters and "purchased in last 24h" widgets to comply with deceptive advertising regulations.
    - **Status:** Changes applied locally to `src/app/paracleanse/page.tsx` (and others), pending push.

---

## 🔑 Critical Technical Notes for Agents

1.  **Black Friday Revert:**
    - Original educational landers are backed up in `src/app/*-lander/`.
    - Use `BLACK_FRIDAY_REVERT_PLAN.md` to rollback theme and pages after Nov 30.

2.  **Supabase Clients:**
    - `src/lib/supabase.ts` exports two clients: `supabase` (Anon/Client) and `supabaseAdmin` (Service Role). **ALWAYS** use `supabaseAdmin` for API routes performing writes or administrative reads to avoid RLS issues.
    - API Routes using Supabase MUST export `export const dynamic = 'force-dynamic'` to avoid serving stale cached data.

3.  **Square SDK (v37+):**
    - Use `client.catalog.batchUpsert()` (not upsertCatalogObject).
    - Prices require `BigInt` serialization (handle with care in JSON responses).
    - Product Images: SDK has a bug. Use direct `fetch` with `FormData` (see `scripts/upload-product-images.js`).

4.  **Brevo vs. Zoho Strategy (UPDATED):**
    - **Zoho:** **DEPRECATED/FALLBACK**. Do not use for bulk sends.
    - **Brevo:** **PRIMARY** for both Marketing Campaigns and Transactional emails.
    - *Note:* Brevo Free Tier is limited to 300 emails/day.

5.  **Mobile First:**
    - All UI components (Checkout, Landing Pages) use progressive styling (`text-3xl sm:text-4xl`) to ensure no horizontal scrolling on mobile.

6.  **Agent Skills & GA4:**
    - Use `.claude/skills/zoho-email-campaign/` for email operations.
    - Use `docs/AGENT_GA4_ACCESS.md` for instructions on querying Google Analytics data.
    - Use `.factory/skills/meta-ads/SKILL.md` for Meta Ads management.

7.  **FTC Compliance Guidelines:**
    - **CAN Say:** "Supports digestive wellness", "Traditional herbs", "Promotes intestinal health".
    - **CAN'T Say:** "Eliminates parasites", "Cures disease", "Biofilm disruption".
    - **NO:** Fake social proof counters or unverified testimonials.

---

## 🔮 Next Steps (Roadmap)

1.  **Monitor Black Friday Campaign:** Ensure Brevo daily limits reset and remaining emails are sent.
2.  **Meta Ads Scaling:** Create Dr. Sebi Approved traffic campaigns and set up pixel tracking.
3.  **Shippo Automation:** Implement the planned webhook system (`docs/shippo/SHIPPO_AUTOMATION_IMPLEMENTATION.md`).
