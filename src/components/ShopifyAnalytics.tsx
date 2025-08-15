'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// Declare the Shopify types
declare global {
  interface Window {
    ShopifyAnalytics?: {
      record: (event: string, data: any) => void;
    };
  }
}

// Helper function to normalize the domain
const normalizeDomain = (domain: string | undefined): string => {
  if (!domain) return '';
  // Remove any protocol
  const cleanDomain = domain.replace(/^https?:\/\//, '');
  // Remove any trailing slashes
  return cleanDomain.replace(/\/+$/, '');
};

function ShopifyAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    if (window.ShopifyAnalytics) {
      window.ShopifyAnalytics.record('Viewed Page', {
        pageType: 'landing',
        path: pathname,
        search: searchParams?.toString() || '',
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function ShopifyAnalytics() {
  const normalizedDomain = normalizeDomain(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN);
  
  return (
    <>
      <Script
        id="shopify-pixel"
        strategy="afterInteractive"
        src={`https://${normalizedDomain}/cdn/shopify-pixel.js`}
      />
      <Suspense fallback={null}>
        <ShopifyAnalyticsInner />
      </Suspense>
    </>
  );
} 
