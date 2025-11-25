# Facebook Pixel Duplicate Fix Attempt Session
**Date**: Tue Nov 25 12:21:27 CST 2025
**Duration**: ~10 minutes
**Focus**: Attempting to fix Facebook Pixel double-firing PageView events
**Logged by**: Droid

## Session Summary
### Primary Objectives Completed ✅
- Refactored `FacebookPixel.tsx` to use `next/script` instead of manual DOM injection.
- Merged route change tracking logic into the main component.
- Removed the separate `FacebookPixelTracker.tsx` component.
- Attempted to use `useRef` to skip the initial render effect to prevent double-firing.

## Key Issues Resolved
- Cleaned up the pixel implementation architecture (single component vs two).

## Technical Implementation
- **Refactoring**: Moved pixel initialization into a `next/script` tag with `strategy="afterInteractive"`.
- **Deduplication Logic**: Implemented a `useRef` guard (`isFirstRender`) to skip the `useEffect` trigger on the initial mount, relying on the script tag's inline code for the first PageView.
- **Cleanup**: Deleted `src/components/analytics/FacebookPixelTracker.tsx`.

## Files Modified/Created
### Local Development Only
- `src/components/analytics/FacebookPixel.tsx` (Modified)
- `src/components/analytics/FacebookPixelTracker.tsx` (Deleted)

## Testing Results
- `npm run lint` passed.
- **User Report**: The fix was unsuccessful; double-firing likely persists.

## Business Impact
- Tracking accuracy for Meta ads remains compromised by duplicate events.

## Next Steps & Recommendations
- **Revert**: Since this approach failed, the next session might need to revert to the previous state or try a different strategy.
- **Alternative Strategy**: 
    - Move the pixel script to `layout.tsx` entirely (no client component wrapper for the script itself).
    - Use a dedicated library like `react-facebook-pixel` which handles these edge cases.
    - Investigate if the double-firing is strictly a Dev mode artifact (Strict Mode) that doesn't affect Production, though user reports suggest it might be an issue.
    - Check if GTM or another tool is also injecting the pixel.

## Session Outcome
- **Failed**: The attempted fix did not resolve the duplicate page view issue.

---
*End of Session: Tue Nov 25 12:21:27 CST 2025*
