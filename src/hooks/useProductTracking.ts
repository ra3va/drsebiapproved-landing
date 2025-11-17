import { useEffect } from 'react';

interface ProductTrackingProps {
  productName: string;
  productSlug: string;
  price: number;
}

/**
 * Custom hook to track product page views and interactions with Brevo
 * Usage: useProductTracking({ productName: 'ParaCleanse Elite', productSlug: 'paracleanse', price: 59.99 })
 */
export function useProductTracking({ productName, productSlug, price }: ProductTrackingProps) {
  useEffect(() => {
    // Track product page view with Brevo
    if (typeof window !== 'undefined' && (window as any).Brevo) {
      (window as any).Brevo.push(['track', 'page_view', {
        page: 'product',
        product: productSlug,
        product_name: productName,
        price: price,
        timestamp: Date.now()
      }]);

      console.log(`📊 Tracked product view: ${productName}`)
    }

    // Track time on page
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds

      // Track time spent if > 5 seconds (actual interest)
      if (timeSpent > 5 && typeof window !== 'undefined' && (window as any).Brevo) {
        (window as any).Brevo.push(['track', 'product_engagement', {
          product: productSlug,
          time_spent: timeSpent,
          engaged: timeSpent > 30 // Highly engaged if > 30 seconds
        }]);

        console.log(`📊 Tracked engagement: ${timeSpent}s on ${productName}`)
      }
    };
  }, [productName, productSlug, price]);

  // Return tracking functions that can be called from components
  const trackAddToCart = () => {
    if (typeof window !== 'undefined' && (window as any).Brevo) {
      (window as any).Brevo.push(['track', 'cart_updated', {
        product: productSlug,
        product_name: productName,
        value: price,
        action: 'add'
      }]);

      console.log(`🛒 Tracked add to cart: ${productName}`)
    }
  };

  const trackCTAClick = (ctaLocation: string) => {
    if (typeof window !== 'undefined' && (window as any).Brevo) {
      (window as any).Brevo.push(['track', 'cta_clicked', {
        product: productSlug,
        product_name: productName,
        cta_location: ctaLocation, // e.g., 'hero', 'benefits-section', 'final-cta'
        price: price
      }]);

      console.log(`👆 Tracked CTA click: ${productName} - ${ctaLocation}`)
    }
  };

  return {
    trackAddToCart,
    trackCTAClick
  };
}
