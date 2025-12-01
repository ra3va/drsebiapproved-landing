# FTC Compliance & Facebook Pixel Fix Session
**Date**: Tue Nov 25 19:06:37 CST 2025
**Duration**: ~2 hours
**Focus**: Facebook Pixel double-fire fix + FTC compliance updates for ParaCleanse page
**Logged by**: Droid

---

## Session Summary

### Part 1: Facebook Pixel Double-Fire Fix ✅ DEPLOYED

**Root Cause Identified:**
1. The `<noscript><img>` tag was being detected by Meta Pixel Helper as a second PageView activation
2. Client component in body caused hydration re-render issues

**Solution Implemented:**
- Moved pixel script from client component to `layout.tsx` head (server-rendered)
- Created `FacebookPixelRouteTracker.tsx` - minimal component for SPA navigation only (returns null)
- Deleted old `FacebookPixel.tsx` component
- Removed noscript image tag

**Files Changed:**
- `src/app/layout.tsx` - Added inline pixel script to head
- `src/components/analytics/FacebookPixelRouteTracker.tsx` - New file
- `src/components/analytics/FacebookPixel.tsx` - Deleted

**Status:** Committed and pushed (`f343b4a`)

---

### Part 2: FTC Compliance - ParaCleanse Page ⚠️ LOCAL ONLY (NOT PUSHED)

**Issue:** Square flagged `/paracleanse` page for unsubstantiated health claims per FTC guidelines.

**FTC Guidance Key Points:**
- Claims about treating/eliminating parasites = disease claims requiring clinical proof
- Testimonials don't count as scientific evidence
- DSHEA disclaimer ("not intended to diagnose...") does NOT protect from FTC action
- Fake social proof (random cart counts) = deceptive advertising

**Changes Made (LOCAL - NOT YET DEPLOYED):**

| Before | After |
|--------|-------|
| "Two-Phase Parasite Cleansing System" | "Two-Phase Internal Cleansing System" |
| "#1 Best-Selling Parasite Cleanse" | "#1 Best-Selling Cleanse" |
| "Phase 1: Biofilm disruption formula" | "Phase 1: Gentle preparation & digestive support" |
| "Phase 2: Deep parasite elimination" | "Phase 2: Deep cleansing & intestinal wellness" |
| "Dr. Sebi's proven methodology" | "Dr. Sebi's traditional herbal methodology" |
| Biofilm/parasite elimination description | "supports your body's natural detoxification processes" |
| "My brain fog is completely gone" testimonial | Product quality testimonials only |
| Fake "2.3K in carts" counter | Removed |
| Fake "180 purchased in 24 hours" | Removed |
| "3,247 reviews" / "10K+ Reviews" | "5-Star Rated" / "Trusted Brand" |

**Product Name "ParaCleanse Elite"** - Kept (product names are fine)

**File Modified:**
- `src/app/paracleanse/page.tsx`

**Status:** Lint + TypeScript PASSED, but NOT committed/pushed yet

---

### Part 3: Other Commits Pushed ✅

**Commit `d34924f`:**
- Meta Ads API integration scripts
- Claude/Factory skills for Meta Ads
- ESLint fix in admin dashboard (useCallback)
- Batch size update 75→200 for campaign status
- Updated project-memory.md

---

## What You Need to Do

### For Square Compliance:
1. Click **YES** on Square's prompt to confirm you'll discontinue unsubstantiated claims
2. Restart dev server: `npm run dev`
3. Hard refresh (Cmd+Shift+R) to see local changes
4. Review the updated page
5. If satisfied, commit and push the FTC compliance changes

### FTC Compliance - Safe Language Guide:

**CAN Say (Structure/Function):**
- "Supports digestive wellness"
- "Traditional herbs used for cleansing"
- "Supports your body's natural detox processes"
- "Promotes intestinal health"

**CAN'T Say (Disease Claims):**
- "Eliminates parasites"
- "Kills parasites at every lifecycle stage"
- "Biofilm disruption"
- "Get rid of parasites"

**Educational Content IS Allowed:**
- "Many people experience digestive issues..." (general education)
- "Black walnut hull has been traditionally used for centuries..." (historical use)

---

## Files With Uncommitted Changes

```
modified:   src/app/paracleanse/page.tsx  (FTC compliance updates)
```

---

## Next Session Tasks

1. Review ParaCleanse page changes in dev
2. Decide if more compliance changes needed
3. Commit and push FTC compliance updates
4. Consider applying similar compliance updates to other product pages (Maya, Sea Moss, Mucus Cleanser)
5. Monitor Square response after clicking YES

---

## Technical Notes

- Changes passed lint and TypeScript checks
- Fake social proof code completely removed (useState, useEffect, formatNumber function)
- GA4/Facebook Pixel tracking categories updated from "Parasite Cleanse" to "Internal Cleanse"

---

*End of Session: Tue Nov 25 19:06:37 CST 2025*
