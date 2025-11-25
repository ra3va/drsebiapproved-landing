// Tracks PageView on client-side route changes (SPA navigation)
// Initial PageView is handled by the inline script in layout.tsx head
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import '@/lib/fpixel'; // Import for Window.fbq type declaration

export default function FacebookPixelRouteTracker() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render - the head script handles initial PageView
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Fire PageView on subsequent route changes
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
