# Project Memory: Dr. Sebi Approved (Parasite Cleanse Landing)

**Last Updated:** November 24, 2025
**Status:** Production Ready / Active Marketing Phase (Black Friday Sale)
**URL:** https://drsebiapproved.com
**Tech Stack:** Next.js 14, Tailwind, Square (Payments), Brevo (CRM/Marketing), Zoho Mail (Cold/Win-back), Supabase (Campaign Database), Render (Hosting).

---

## 🧠 Project Context & Architecture

This project has transitioned from a simple landing page with external Shopify checkout to a fully custom, integrated e-commerce platform. It is currently running a **Black Friday Campaign** (Nov 25-30) with a full site-wide theme takeover.

### Core Pillars
1.  **Commerce (Square):** Custom multi-step checkout, product catalog, coupon management (`BLACKFRIDAY30`), and customer profiles.
2.  **Marketing Hub (Brevo):** Behavioral tracking, progressive profile building, and automated email flows.
3.  **Outreach Engine (Zoho):** A custom-built "Win-Back" system for rate-limited sending to legacy customer lists (8k contacts).
4.  **Content Funnel:** E-commerce PDPs (Black Friday mode) and SEO-optimized blog driving traffic.

---

## 🛠 System Implementation Status

### 1. Payment & Commerce (Square)
**Status:** ✅ **LIVE (Black Friday Mode)**
- **Theme:** Full Black/Gold site takeover with sticky countdown banner.
- **Pages:** Converted educational landers to **E-commerce Product Detail Pages (PDPs)** with social proof, quantity selectors, and urgency elements.
- **Catalog:** 4 Core Products updated with Black Friday pricing (30% off).
    - ParaCleanse Elite ($62.99), Maya ($41.99), Sea Moss ($27.99), Mucus Cleanser ($27.99).
- **Checkout:** Custom "SquareCheckout" with premium gold accents, savings banner, and countdown timer.
    - *Features:* Pre-fills quantity and coupon from URL (`?quantity=2&coupon=BLACKFRIDAY30`).
- **Reference Docs:**
    - `docs/square/SQUARE_SETUP.md`
    - `BLACK_FRIDAY_REVERT_PLAN.md`

### 2. Marketing Automation (Brevo)
**Status:** ✅ **LIVE**
- **Architecture:** "Multi-Product Hub".
- **Tracking:** Full funnel visibility.
    - *Homepage:* Problem navigation tracking.
    - *Quiz:* Score and recommendation tracking.
    - *Product Pages:* Time-on-page (>30s engagement), CTA location clicks.
    - *Checkout:* Progressive capture (Step 1 email capture -> Step 2 shipping -> Purchase).
- **Data Structure:** 10 Lists (Prospects/Customers per product) + 25 Custom Attributes.
- **Capabilities:** Pre-fill checkout links from landing pages.
- **Reference Docs:**
    - `docs/brevo/BREVO_MULTI_PRODUCT_INTEGRATION.md`
    - `docs/brevo/brevo-tracking-guide.md`

### 3. Win-Back Campaign System (Zoho + Supabase)
**Status:** ✅ **LIVE**
- **Purpose:** Re-engage 8,000 legacy customers without triggering spam filters.
- **Tech:** Next.js API routes + Supabase (DB) + Zoho Mail API (OAuth).
- **Dashboard:** `/admin/campaign` (Universal GUI).
    - *Features:* CSV Upload (Excel compatible), Batch Preview, Bucket Priority Logic (Follow-ups > New Leads).
    - *Rate Limiting:* Configurable (default 50-75/day).
    - *Tracking:* Link click tracking (auto-wraps URLs) -> Syncs to Brevo.
    - *Stop Switch:* Purchases auto-remove users from campaign.
- **Infrastructure:**
    - Supabase Service Role key used for Admin API to bypass RLS.
    - `force-dynamic` used on API routes to prevent Next.js caching issues.
- **Reference Docs:**
    - `docs/zoho/ZOHO_INTEGRATION_SUMMARY.md`
    - `docs/zoho/ZOHO_SETUP_INSTRUCTIONS.md`
    - Agent Skill: `.claude/skills/zoho-email-campaign/`

### 4. Analytics & Intelligence (GA4)
**Status:** ✅ **LIVE (E-commerce Enhanced)**
- **Tracking:** Full funnel visibility (View Item -> Begin Checkout -> Add Shipping -> Add Payment -> Purchase).
- **Features:** 
    - Accurate revenue tracking (discounts & coupons included).
    - Bundle/Upsell tracking in checkout.
    - Agent access enabled via `docs/AGENT_GA4_ACCESS.md`.
- **Reference Docs:**
    - `docs/AGENT_GA4_ACCESS.md`
    - `docs/GA4_TRACKING_AUDIT.md`

### 5. Shipping & Fulfillment
**Status:** 🚧 **Planning / In Progress**
- **Current:** Manual fulfillment via Square Dashboard.
- **Planned:** Shippo Automation.
    - *Strategy:* Webhooks trigger label creation -> PDF emailed to Ra.
    - *Cost:* Self-fulfillment cheaper until ~100 orders/mo.
- **Reference Docs:**
    - `docs/shippo/SHIPPO_AUTOMATION_IMPLEMENTATION.md`

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

### Phase 7: Analytics & Intelligence (Nov 24, 2025)
- **GA4 E-Commerce:** Implemented complete event tracking (view_item, begin_checkout, add_shipping_info, add_payment_info, purchase).
- **Agent Integration:** Created `docs/AGENT_GA4_ACCESS.md` enabling agents to query analytics via natural language.
- **Revenue Accuracy:** Fixed tracking to include item-level discounts and correct transaction totals.

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

4.  **Brevo vs. Zoho Strategy:**
    - **Zoho:** Transactional/Cold/Win-back. Manual CSV uploads. API: `/api/campaign/*`.
    - **Brevo:** Marketing Automation/Behavioral. Triggered by API calls. API: `/api/brevo/*`.
    - *Do not confuse the two.* Zoho drives traffic; Brevo nurtures it.

5.  **Mobile First:**
    - All UI components (Checkout, Landing Pages) use progressive styling (`text-3xl sm:text-4xl`) to ensure no horizontal scrolling on mobile.

6.  **Agent Skills & GA4:**
    - Use `.claude/skills/zoho-email-campaign/` for email operations.
    - Use `docs/AGENT_GA4_ACCESS.md` for instructions on querying Google Analytics data.

---

## 🔮 Next Steps (Roadmap)

1.  **Shippo Automation:** Implement the planned webhook system (`docs/shippo/SHIPPO_AUTOMATION_IMPLEMENTATION.md`).
2.  **Email Sequences:** Manually build the Brevo automation workflows (Logic is ready, content needed).
3.  **Analytics:** Monitor the "Stop Switch" and conversion rates on the new Mucus funnel.