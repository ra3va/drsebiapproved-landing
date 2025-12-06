# Black Friday Revert Pricing Session
**Date**: Sat Dec  6 00:04:53 CST 2025  
**Duration**: ~1 hour  
**Focus**: Revert Black Friday sale mode to evergreen pricing and clean up homepage/PDP/checkout flows  
**Logged by**: Claude

## Session Summary
### Primary Objectives Completed ✅
- Removed Black Friday hero, banner, and sale-specific copy from the homepage and global layout.
- Restored regular, evergreen pricing across homepage product cards, PDPs, and checkout configuration.
- Removed automatic `BLACKFRIDAY30` coupon exposure from storefront flows while keeping backend coupon support intact.
- Fixed dev/build environment issues by clearing stale `.next` artifacts and verifying a clean Next.js build.

## Key Issues Resolved
- Homepage still showed Black Friday hero, badges, and discount messaging after the sale ended.
- PDPs for ParaCleanse, Maya, Sea Moss, and Mucus Cleanser were locked into Black Friday pricing/copy and auto-applying coupons.
- Checkout header and timer were still wired to a Black Friday countdown, and ParaCleanse checkout price no longer matched the new evergreen PDP/homepage price.
- Initial dev server error: `Cannot find module './1638.js'` caused by stale `.next` build output, not by source changes.

## Technical Implementation
- Swapped the homepage hero from `BlackFridayHero` back to `OriginalHero`, and removed all Black Friday-specific badges and copy on the main landing page (`src/app/page.tsx`).
- Reverted `Header` from black/gold sale theme to the original teal/primary design and removed the global Black Friday countdown banner from the layout so site chrome is evergreen again (`src/components/Header.tsx`, `src/app/layout.tsx`).
- Converted all four product PDPs from Black Friday variants into evergreen pages:
  - ParaCleanse: normalized GA4/FB tracking item IDs, removed coupon-specific events, simplified pricing to a single `price` constant, and removed sticky sale banner and BF badge (`src/app/paracleanse/page.tsx`).
  - Maya: same pattern—normalized tracking identifiers, removed BF banner/badge/discount UI, wired checkout redirects without coupons, and aligned text with evergreen positioning (`src/app/maya/page.tsx`).
  - Sea Moss: restored standard pricing, removed BF sale UI, updated tracking to evergreen IDs, and ensured checkout redirects only pass `product` and `quantity` (`src/app/seamoss/page.tsx`).
  - Mucus Cleanser: restored regular price semantics, removed BF copy/UI, updated tracking IDs, and aligned CTA/description with compliance-friendly language (`src/app/mucus-cleanser/page.tsx`).
- Updated checkout configuration to align with evergreen pricing and removed Black Friday countdown logic:
  - Set ParaCleanse checkout price to `5999` cents (`$59.99`) so checkout, PDP, and homepage are consistent.
  - Removed the Black Friday-specific countdown timer and “Sale ends in” copy, and made the checkout header a simple secure sticky bar at the top (`src/app/checkout/page.tsx`).
- Generalized the “Black Friday savings” banner in the checkout summary into a generic “Discount Applied” banner that reflects any coupon code the user enters, without hard-coding `BLACKFRIDAY30` (`src/components/SquareCheckout.tsx`).
- Removed automatic `BLACKFRIDAY30` coupon injection from email/product redirect links by changing the `/go/[product]` route to only add neutral UTM parameters and no coupon querystring (`src/app/go/[product]/route.ts`).
- Cleaned up unused imports (e.g., `Zap`, `TrendingUp`) introduced during Black Friday work so PDP files remain lint-clean and aligned with the design system.
- Cleared stale `.next` build output and reran `npm run build` to regenerate all server bundles and static pages against the updated source.

## Files Modified/Created
### Committed to Production
- `src/app/layout.tsx` - Removed `BlackFridayBanner` import and usage so the layout no longer displays the global Black Friday bar.
- `src/components/Header.tsx` - Reverted header styling and structure to the original teal/primary theme with fixed positioning and evergreen announcement bar.
- `src/app/page.tsx` - Switched to `OriginalHero`, removed Black Friday badges and sale copy, restored regular product pricing and evergreen CTA/guide messaging.
- `src/app/paracleanse/page.tsx` - Converted from Black Friday PDP to evergreen ParaCleanse page with regular pricing, updated tracking, and coupon-free checkout redirects.
- `src/app/maya/page.tsx` - Converted from Black Friday PDP to evergreen Maya page with regular pricing and non-sale CTA/copy, and removed BF-specific tracking fields.
- `src/app/seamoss/page.tsx` - Converted from Black Friday PDP to evergreen Sea Moss page, restored standard pricing, and removed BF-specific UI and coupon logic.
- `src/app/mucus-cleanser/page.tsx` - Converted from Black Friday PDP to evergreen Mucus Cleanser page with regular price and compliance-safe respiratory support positioning.
- `src/app/checkout/page.tsx` - Updated product price map (ParaCleanse to `5999` cents), removed Black Friday countdown, and simplified header to a generic secure checkout bar.
- `src/components/SquareCheckout.tsx` - Generalized the savings banner copy to a generic discount banner that uses the entered coupon code instead of Black Friday wording.
- `src/app/go/[product]/route.ts` - Removed automatic `BLACKFRIDAY30` coupon parameter from redirects, leaving only evergreen email UTM tracking.

### Local Development Only
- `.next/` - Removed and regenerated via `npm run build` to clear stale modules and webpack runtime artifacts.
- `.agent/` - Local agent metadata directory (not part of the app runtime; safe to ignore for production).

## Testing Results
- `npm run build` (Next.js 14)  
  - ✅ Compiled successfully with no TypeScript or ESLint errors.  
  - ✅ All app routes, including `/`, `/paracleanse`, `/maya`, `/seamoss`, `/mucus-cleanser`, and `/checkout`, were statically generated or bundled without errors.  
  - ✅ The previous `Cannot find module './1638.js'` runtime error did not recur after clearing `.next` and rebuilding.

## Business Impact
- Turns off the Black Friday 30% off promotion across all public-facing surfaces while keeping the storefront live and coherent.
- Restores evergreen pricing and messaging so customers see consistent, non-expired offers on the homepage, PDPs, and checkout.
- Prevents confusion or distrust from seeing outdated Black Friday timers or coupon prompts after the campaign window.
- Keeps the `BLACKFRIDAY30` coupon logic available at the backend for historical data and any future controlled reuse, without surfacing it in the main funnel.

## Technical Capabilities Unlocked
- Demonstrated a clean pattern for switching between campaign-specific and evergreen themes (hero, header, pricing, PDPs) with minimal code churn.
- Standardized PDP tracking to use evergreen item IDs and names, simplifying GA4/FB reporting outside of limited-time campaigns.
- Established a safer redirect pattern for email/product links (`/go/[product]`) that decouples coupons from campaign routing while preserving UTM tracking.

## Next Steps & Recommendations
- Manually spot-check in the browser:
  - `/` → Confirm `OriginalHero`, regular pricing, and no Black Friday badges/banners.
  - `/paracleanse`, `/maya`, `/seamoss`, `/mucus-cleanser` → Confirm updated pricing, no sale timers, and correct checkout redirects.
  - `/checkout?product=paracleanse&quantity=2` → Confirm subtotal and total reflect regular pricing and no auto-applied coupon.
- When ready for a future promotion, reuse the Black Friday components (`BlackFridayHero`, `BlackFridayBanner`) behind a feature flag rather than wiring them directly into `layout.tsx` and `page.tsx`.
- Monitor GA4 funnels for a day or two to ensure view_item, add_to_cart, and begin_checkout events still flow correctly with the updated item IDs and no default `coupon` field.

## Session Outcome
- ✅ Black Friday sale mode successfully reverted to evergreen pricing and UI.  
- ✅ Storefront, PDPs, and checkout now present consistent, non-expired offers.  
- ✅ Build pipeline verified clean; dev/runtime errors resolved by removing stale `.next` artifacts.

---
*End of Session: Sat Dec  6 00:04:53 CST 2025*

