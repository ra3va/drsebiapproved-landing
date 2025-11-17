🎯 The Product Page Tracking Hook
The tracking hook is useProductTracking - a custom React hook I created that automatically tracks visitor behavior on product pages using Brevo's behavioral tracking.

📍 Location
src/hooks/useProductTracking.ts

🔧 What It Does
Automatic Tracking (happens when visitor lands on page):
Product page view - Tracks which product they're viewing
Time on page - Measures engagement (how long they stay)
Engagement level - Marks as "highly engaged" if they stay 30+ seconds
Manual Tracking (you call these functions):
trackAddToCart() - Call when user clicks "Buy Now" or "Add to Cart"
trackCTAClick(location) - Call when user clicks any CTA (with location identifier)
📖 How to Use It
Example: Adding to ParaCleanse Page
// src/app/paracleanse/page.tsx

'use client';

import { useProductTracking } from "@/hooks/useProductTracking"  // Import the hook
import { Button } from "@/components/ui/button"

export default function ParaCleansePage() {
  // Initialize the hook with product details
  const { trackCTAClick, trackAddToCart } = useProductTracking({
    productName: 'ParaCleanse Elite',
    productSlug: 'paracleanse',
    price: 59.99
  });

  return (
    <div>
      {/* Hero Section Buy Button */}
      <Button onClick={() => {
        trackCTAClick('hero-section');  // Track where they clicked
        window.location.href = '/checkout?product=paracleanse';
      }}>
        Buy Now - $59.99
      </Button>

      {/* Mid-page CTA */}
      <Button onClick={() => {
        trackCTAClick('benefits-section');  // Different location
        window.location.href = '/checkout?product=paracleanse';
      }}>
        Start Your Cleanse
      </Button>

      {/* Final CTA */}
      <Button onClick={() => {
        trackCTAClick('final-cta');
        window.location.href = '/checkout?product=paracleanse';
      }}>
        Order ParaCleanse Now
      </Button>
    </div>
  );
}
🎯 What Gets Tracked in Brevo
When someone visits /paracleanse:

Automatically (on page load):
Brevo.push(['track', 'page_view', {
  page: 'product',
  product: 'paracleanse',
  product_name: 'ParaCleanse Elite',
  price: 59.99,
  timestamp: 1700000000
}]);
Automatically (when they leave, if stayed >5 seconds):
Brevo.push(['track', 'product_engagement', {
  product: 'paracleanse',
  time_spent: 45,  // seconds
  engaged: true    // true if >30 seconds
}]);
When you call trackCTAClick('hero-section'):
Brevo.push(['track', 'cta_clicked', {
  product: 'paracleanse',
  product_name: 'ParaCleanse Elite',
  cta_location: 'hero-section',
  price: 59.99
}]);
When you call trackAddToCart():
Brevo.push(['track', 'cart_updated', {
  product: 'paracleanse',
  product_name: 'ParaCleanse Elite',
  value: 59.99,
  action: 'add'
}]);
⚠️ Current Status
The hook is created but NOT yet added to your product pages.

You need to:

Import the hook in each product page (paracleanse, maya, seamoss, mucus-cleanser)
Call it with the product details
Wrap your CTA buttons with the tracking functions
🚀 Quick Implementation
Want me to add this hook to all 4 product pages right now?

I can:

✅ Add the hook to /paracleanse
✅ Add the hook to /maya
✅ Add the hook to /seamoss
✅ Add the hook to /mucus-cleanser (if page exists)
✅ Wrap all "Buy Now" buttons with trackCTAClick()
This will give you complete behavioral tracking across all product pages for your AI agent to use in segmentation and automation.