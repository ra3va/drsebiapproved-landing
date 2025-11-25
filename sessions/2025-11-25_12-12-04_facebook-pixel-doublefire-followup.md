# Facebook Pixel Double-Firing Followup Session
**Date**: Tue Nov 25 12:12:04 CST 2025  
**Duration**: ~30 minutes  
**Focus**: Facebook Pixel double PageView warning on home page; lint cleanup  
**Logged by**: Claude

## Session Summary
### Primary Objectives Completed ✅
- Hardened pixel bootstrap to prevent multiple init/PageView calls and made it TypeScript-safe.
- Relocated pixel mount to body and kept route-change tracking isolated in a Strict Mode-safe tracker.
- Cleared all ESLint warnings (react-hooks/exhaustive-deps) in admin dashboard and Square checkout.

## Key Issues Resolved
- TypeScript compile error in pixel bootstrap caused by unsafe fbq assignment.
- React hook dependency warnings in `admin/campaign` and `SquareCheckout`.

## Technical Implementation
- `src/components/analytics/FacebookPixel.tsx`: Client-side guarded bootstrap with window flags (`__fbPixelInit`, `__fbInitialPageview`) to ensure a single init and single initial PageView, plus noscript fallback.
- `src/components/analytics/FacebookPixelTracker.tsx`: Retains Strict Mode-safe route-change PageView tracking, skipping the first render.
- `src/app/layout.tsx`: Pixel component mounted in body (outside head) to avoid head replays.
- `src/lib/fpixel.ts`: Window typings updated to optional fbq/_fbq and guard flags.
- `src/app/admin/campaign/page.tsx`: `fetchStatus` wrapped in `useCallback`, deps updated.
- `src/components/SquareCheckout.tsx`: Added missing deps; added one-shot guard for `add_payment_info`.

## Files Modified/Created
### Local Development Only
- `src/components/analytics/FacebookPixel.tsx`
- `src/components/analytics/FacebookPixelTracker.tsx`
- `src/app/layout.tsx`
- `src/lib/fpixel.ts`
- `src/app/admin/campaign/page.tsx`
- `src/components/SquareCheckout.tsx`

## Testing Results
- `npm run lint` ✅ (clean)
- Production build still shows double PageView warning on home page in Meta Pixel Helper (per user report).

## Business Impact
- Pixel double-fire warning persists on home page in production build; other routes appear single-fire. Tracking accuracy for Meta ads remains uncertain until resolved.

## Technical Capabilities Unlocked
- Pixel bootstrap is now deduped and TypeScript-safe; lint baseline is clean for touched files.

## Next Steps & Recommendations
1. Instrument PageView calls: temporarily log or add unique `eventID` per PageView to confirm how many fire and from where; verify network tab for duplicate `https://www.facebook.com/tr` requests on home.
2. Remove bootstrap PageView and send the first PageView via the tracker instead (single source of truth) to eliminate any hidden initial emit.
3. Move the pixel bootstrap to a server component head (e.g., `app/head.tsx`) with a guard and keep the client tracker for route changes; re-test in production build.
4. Confirm no other scripts inject fbq (extensions, tag managers) by testing in a fresh browser profile/incognito and on a clean prod build (`npm run build && npm run start`).
5. If Meta helper still flags double activation, add `eventID` dedupe and verify in Meta Test Events which IDs are duplicating.

## Session Outcome
- Incomplete: double PageView warning persists on home page; further instrumentation and possibly moving/removing the initial PageView emission needed next session.

---
*End of Session: Tue Nov 25 12:12:04 CST 2025*
