# Facebook Pixel Double Firing Issue - Session Log
**Date**: Tue Nov 25 11:42:30 CST 2025
**Duration**: ~1 hour
**Focus**: Replace old Facebook pixel and fix double-firing issue
**Status**: INCOMPLETE - Pixel fires twice, needs resolution

---

## Work Completed ✅

### 1. Successfully Replaced Old Facebook Pixel
- **Removed**: Old pixel ID `1757625231633648` from [src/app/layout.tsx](src/app/layout.tsx)
- **Added**: New pixel ID `1098386598872178` (26 HM - Pixel)
- **Created**:
  - [src/lib/fpixel.ts](src/lib/fpixel.ts) - Utility functions for tracking
  - [src/components/analytics/FacebookPixel.tsx](src/components/analytics/FacebookPixel.tsx) - Pixel component
- **Environment Variable**: Added `NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1098386598872178` to `.env.local`

### 2. Integrated Pixel Events Across Site

**Product Pages** (ViewContent + AddToCart):
- ✅ [src/app/paracleanse/page.tsx](src/app/paracleanse/page.tsx)
- ✅ [src/app/maya/page.tsx](src/app/maya/page.tsx)
- ✅ [src/app/mucus-cleanser/page.tsx](src/app/mucus-cleanser/page.tsx)
- ✅ [src/app/seamoss/page.tsx](src/app/seamoss/page.tsx)

**Checkout Flow**:
- ✅ InitiateCheckout - [src/components/SquareCheckout.tsx:431-439](src/components/SquareCheckout.tsx#L431-L439)
- ✅ AddPaymentInfo - [src/components/SquareCheckout.tsx:485-491](src/components/SquareCheckout.tsx#L485-L491)
- ✅ Purchase - [src/app/checkout/success/page.tsx:70-78](src/app/checkout/success/page.tsx#L70-L78)

**Lead Generation**:
- ✅ Lead event - [src/app/quiz/page.tsx:230-236](src/app/quiz/page.tsx#L230-L236)
- ✅ Lead event - [src/components/WinBackOptIn.tsx:40-46](src/components/WinBackOptIn.tsx#L40-L46)

---

## ❌ CRITICAL ISSUE: Pixel Fires Twice on Every Page

### Problem Description
Meta Pixel Helper shows warning: **"The Facebook pixel activated 2 times on this web page, which can cause errors in your event tracking."**

**Evidence from Pixel Helper:**
- Two PageView events fire on every page load
- Both use correct pixel ID `1098386598872178`
- One has massive URL with all metadata encoded
- Both show "Setup Method: Manual"

### Root Cause Analysis

The pixel is firing twice because of **React's rendering behavior** in development mode and/or how Next.js Script components work.

**What We Tried (All Failed):**

1. ❌ **Removed duplicate Script tags** - Combined two separate scripts into one
2. ❌ **Used `useRef` to track initial load** - Still fired twice
3. ❌ **Added global `pixelInitialized` flag** - Component still renders twice
4. ❌ **Used `dangerouslySetInnerHTML`** - No change

**Current Implementation:**
```typescript
// src/components/analytics/FacebookPixel.tsx
let pixelInitialized = false; // Global flag

export default function FacebookPixel() {
  if (pixelInitialized) return null;
  pixelInitialized = true;

  return (
    <Script id="fb-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{
      __html: `...fbq('init', '${pixelId}'); fbq('track', 'PageView');`
    }} />
  );
}
```

**Why It Still Fails:**
- React Strict Mode in dev causes double rendering
- Next.js App Router may hydrate components multiple times
- Global flag doesn't prevent Script tag from executing twice
- The `fbq('track', 'PageView')` inside the script fires both times

---

## Potential Fixes for Next Session

### Option 1: Move Pixel to Root Layout Script (Recommended)
**Remove the component entirely** and add pixel directly to [src/app/layout.tsx](src/app/layout.tsx):

```tsx
// In layout.tsx head section
<Script id="fb-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s){...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1098386598872178');
    fbq('track', 'PageView');
  `}
</Script>
```

**Delete**: [src/components/analytics/FacebookPixel.tsx](src/components/analytics/FacebookPixel.tsx)

**Pros**:
- Server component, no hydration issues
- No React lifecycle interference
- Standard Meta implementation

**Cons**:
- No automatic route-change tracking (need to add manually)

### Option 2: Check for Existing `fbq` Before Init
Add a guard in the script to prevent double initialization:

```javascript
if (!window.fbq || !window._fbq) {
  !function(f,b,e,v,n,t,s){...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1098386598872178');
  fbq('track', 'PageView');
}
```

### Option 3: Use Production Build to Test
Development mode with React Strict Mode causes intentional double-rendering. Test in production:

```bash
npm run build
npm run start
```

The double-firing may **only happen in dev mode** and work correctly in production.

### Option 4: Use Next.js `_app.js` Pattern (If Available)
If there's a custom `_app.js` or `_document.js`, add pixel there instead of layout.

### Option 5: Disable React Strict Mode (Not Recommended)
Check if `next.config.js` has `reactStrictMode: true` and temporarily disable to test.

---

## Files Modified This Session

### New Files Created
- [src/lib/fpixel.ts](src/lib/fpixel.ts)
- [src/components/analytics/FacebookPixel.tsx](src/components/analytics/FacebookPixel.tsx)

### Files Modified
- [src/app/layout.tsx](src/app/layout.tsx) - Removed old pixel, imported FacebookPixel component
- [src/components/SquareCheckout.tsx](src/components/SquareCheckout.tsx) - Added InitiateCheckout, AddPaymentInfo events
- [src/app/checkout/success/page.tsx](src/app/checkout/success/page.tsx) - Added Purchase event
- [src/app/paracleanse/page.tsx](src/app/paracleanse/page.tsx) - Added ViewContent, AddToCart
- [src/app/maya/page.tsx](src/app/maya/page.tsx) - Added ViewContent, AddToCart
- [src/app/mucus-cleanser/page.tsx](src/app/mucus-cleanser/page.tsx) - Added ViewContent, AddToCart
- [src/app/seamoss/page.tsx](src/app/seamoss/page.tsx) - Added ViewContent, AddToCart
- [src/app/quiz/page.tsx](src/app/quiz/page.tsx) - Added Lead event
- [src/components/WinBackOptIn.tsx](src/components/WinBackOptIn.tsx) - Added Lead event
- `.env.local` - Added `NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1098386598872178`

---

## Testing Needed Next Session

1. **Test in Production Build**
   ```bash
   npm run build && npm run start
   ```
   Check if double-firing only happens in dev mode.

2. **Verify All Event Tracking**
   - ViewContent on product pages
   - AddToCart on "Add to Cart" buttons
   - InitiateCheckout when Step 1 completes
   - AddPaymentInfo when Step 2 completes
   - Purchase on success page
   - Lead on quiz and win-back opt-in

3. **Check Meta Events Manager**
   - Go to Meta Events Manager for pixel `1098386598872178`
   - Test events using "Test Events" feature
   - Verify events are deduplicating properly

---

## Recommended Next Steps

1. **FIRST**: Test production build to see if issue is dev-only
2. **IF STILL BROKEN**: Implement Option 1 (move to layout Script)
3. **THEN**: Test all event tracking end-to-end
4. **FINALLY**: Deploy to production and verify in Meta Events Manager

---

## Meta Ads Context

**Current Ads Status (from session):**
- Only 1 campaign actually spending: `[08/04/2025] Promoting Amazon link` ($10/day, $68.46 spent last 7 days)
- 7 campaigns show "ACTIVE" but not delivering (no budget or paused ad sets)
- Total account spend: $3,291.17 USD

**New Pixel Info:**
- **Name**: 26 HM - Pixel
- **ID**: 1098386598872178
- **Ad Account**: act_789466743256239 (26 HM)
- **Purpose**: Track conversions for Meta ads, build retargeting audiences

---

**Session Status**: INCOMPLETE - Pixel implementation done but double-firing bug needs resolution
**Next Session Priority**: Fix double-firing issue (try production build first, then Option 1)

---

*End of Session: Tue Nov 25 11:42:30 CST 2025*
