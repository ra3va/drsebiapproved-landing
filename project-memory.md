# Project Memory: Dr. Sebi Approved Landing Page & Campaign Manager

This document provides a comprehensive summary of the project's architecture, key systems, and development history, synthesized from all recorded session logs.

## 1. Project Overview

Dr. Sebi Approved is a Next.js-based e-commerce and marketing platform for a premium wellness brand. Its primary functions are content delivery (blog), lead generation (quiz, lead magnets), and direct-to-consumer sales. The project has evolved significantly from a simple landing page to a sophisticated system with dual email marketing platforms, a custom payment and checkout flow, and a full-fledged campaign management dashboard.

---

## 2. Current System Architecture & Status

### a. E-commerce & Payments
- **Platform:** **Square** (Fully migrated from Shopify).
- **Functionality:**
    - Programmatically managed product catalog (4 core products).
    - Mobile-first, multi-step checkout flow optimized for conversion, featuring a cart system, quantity selection, and pre-checkout upsells.
    - Shipping strategy: $5.95 flat rate, free for 2+ items.
    - **Orders API:** Properly integrated for line-item tracking.
    - **Customer Directory:** Customer data is now correctly creating full profiles in Square's Customer Directory, fixing an earlier bug where data was only stored in order notes.
- **Status:** ✅ **Live and Operational.**

### b. Shipping & Fulfillment
- **Platform:** **Shippo** (Planned Integration).
- **Functionality:**
    - The current process is manual.
    - A complete implementation guide for webhook-based automation with Shippo has been created (`SHIPPO_AUTOMATION_IMPLEMENTATION.md`). This will automate label creation, rate shopping, and tracking updates.
- **Status:** 🟡 **Planned.** Ready for implementation.

### c. Marketing Automation (Behavioral)
- **Platform:** **Brevo**.
- **Functionality:**
    - Serves as the primary system for automated, behavior-driven marketing.
    - **Deeply Integrated Tracking:** Captures the full user journey, including:
        - Quiz submissions and results.
        - Product page views, engagement time, and CTA clicks.
        - Progressive, stage-aware checkout abandonment.
        - Purchase completions.
    - **Segmentation:** A rich set of contact attributes (25+) and lists (10+) have been programmatically created to enable highly targeted campaigns.
- **Status:** ✅ **Live and Operational.** Infrastructure is in place for building automation workflows in the Brevo dashboard.

### d. Re-engagement Campaigns (Manual & Batch)
- **Platform:** **Zoho Mail API** + **Supabase** database.
- **Functionality:**
    - A complete, standalone system for managing large, one-off email campaigns (e.g., the 8,000-customer win-back).
    - **Admin Dashboard:** A comprehensive GUI at `/admin/campaign` for:
        - Uploading multiple CSVs with campaign metadata.
        - Manual email entry.
        - Viewing campaign stats and progress.
        - Granular deletion (single email, by campaign, or clear all).
    - **Bucket System:** Intelligently prioritizes sending follow-up emails over new leads to ensure sequence integrity.
    - **Stop Switch:** Automatically stops sending emails to a customer upon a successful Square purchase.
- **Status:** ✅ **Live and Operational.** Critical bugs related to OAuth, database writes (RLS), and API caching have been resolved.

### e. Core Technology
- **Framework:** Next.js 14 with App Router.
- **Database:** Supabase (PostgreSQL), primarily for the Zoho campaign system.
- **Styling:** Tailwind CSS.
- **Deployment:** Hosted on Render, with CI/CD from the `main` GitHub branch.

---

## 3. Key Milestones & Project Evolution

1.  **Initial Setup (Aug 2025):** Migrated from a slow Docker-based deployment to a streamlined **GitHub + Render** workflow.
2.  **Shopify to Square Migration (Nov 2025):** Decisively moved away from Shopify, implementing a custom, highly-optimized checkout experience with Square. This involved programmatic product creation, a complex checkout component build, and full removal of legacy Shopify code.
3.  **Dual Email Strategy Formation:**
    - **Brevo Implementation (Aug 2025):** Initially integrated as the primary email tool, replacing a limited Mailchimp setup. It was later repurposed for fully automated, behavior-driven marketing.
    - **Zoho Port (Nov 2025):** A complete Zoho Mail integration was ported from another project to handle a large-scale, manual win-back campaign, keeping it separate from the automated Brevo funnels.
4.  **Admin Dashboard Creation & Hardening (Nov 2025):**
    - Built a UI for the Zoho/Supabase campaign system.
    - Initially built for a specific campaign, it was rebuilt to be a universal, campaign-agnostic tool.
    - **Critical Bug Fixes:** Underwent significant debugging to resolve major issues with database writes (Supabase RLS), API read caching (Next.js 14), and production OAuth redirects (Render internal ports).
5.  **Shipping Automation Planning (Nov 2025):** After fixing the Square customer data flow, a full research and planning phase was conducted, resulting in a decision to use **Shippo** for shipping automation.

---

## 4. Current Status & Immediate Next Steps

The project is largely functional and robust, with two distinct and powerful email systems and a custom e-commerce checkout.

### Immediate Priorities:
1.  **Fix Zoho Email Link Redirect Bug:** Links in sent emails are incorrectly redirecting to `localhost:10000`. This is a critical bug blocking the use of the Zoho campaign.
2.  **Implement Shippo Automation:** Execute the plan in `SHIPPO_AUTOMATION_IMPLEMENTATION.md` to automate the shipping and fulfillment process. This is the next major step for operational efficiency.
3.  **Apply Database Migration:** The `02_add_campaign_management.sql` migration, which creates an efficient `campaign_summary` view, has not been run. The API currently uses a slower, paginated query as a workaround. Applying this migration will improve dashboard performance.
