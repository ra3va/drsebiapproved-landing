# Facebook Pixel Double-Fire Fix Session
**Date**: Tue Nov 25 13:04:53 CST 2025
**Duration**: ~40 minutes
**Focus**: Fix Facebook Pixel firing PageView twice on every page load
**Logged by**: Droid

## Session Summary
### Primary Objectives Completed ✅
- Identified root cause of double-firing issue
- Implemented clean fix that separates concerns
- Verified with TypeScript check and lint

## Root Cause Identified
The double-firing was caused by **two issues**:

1. **The `<noscript><img>` tag was being detected as a second PageView** - Meta Pixel Helper counts both the JS `fbq('track', 'PageView')` AND the noscript image `/tr?ev=PageView&noscript=1` as separate activations.

2. **Client component in body caused hydration re-render** - The `FacebookPixel` component with `'use client'` was placed in `layout.tsx` body, causing potential double-execution during Next.js hydration.

## Technical Implementation

### Solution Architecture
- **Pixel script moved to `<head>`** in layout.tsx (server-rendered, no hydration issues)
- **Route tracker as separate component** - Only handles SPA navigation PageViews
- **No noscript tag** - Removed as it was causing double-fire detection

### Files Modified
- `src/app/layout.tsx` - Added inline pixel script to head, replaced component import
- `src/components/analytics/FacebookPixelRouteTracker.tsx` - New minimal component (returns null)
- `src/components/analytics/FacebookPixel.tsx` - Deleted (replaced by above)

### Key Code Changes

**layout.tsx head:**
```tsx
{/* Facebook Pixel - in head to prevent hydration double-fire */}
<Script id="fb-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','1098386598872178');
    fbq('track','PageView');
  `}
</Script>
```

**FacebookPixelRouteTracker.tsx:**
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import '@/lib/fpixel'; // Import for Window.fbq type declaration

export default function FacebookPixelRouteTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
```

## Why Previous Fixes Failed

| Attempt | Why It Failed |
|---------|---------------|
| Global `pixelInitialized` flag | React client component re-renders don't respect module-level flags reliably |
| `useRef` to skip first render | Didn't prevent the noscript image from firing |
| `__fbPixelInit` window flags | Checked AFTER hydration, script already executed |
| Combining two scripts | Didn't address the noscript double-fire |

## Testing Results
- ✅ `npm run lint` - Clean
- ✅ `npx tsc --noEmit` - No type errors
- ✅ User confirmed: Meta Pixel Helper now shows 1 PageView (was 2)

## Business Impact
- **Fixed**: Meta Ads tracking accuracy restored
- **Fixed**: Duplicate event attribution eliminated
- **Enabled**: Proper conversion tracking for Black Friday campaign

## Session Outcome
**SUCCESS** - Facebook Pixel double-firing issue resolved.

---
*End of Session: Tue Nov 25 13:04:53 CST 2025*
