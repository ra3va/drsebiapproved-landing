// src/lib/fpixel.ts
// Facebook Pixel utility for tracking events

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

// Declare fbq on window object
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
    __fbPixelInit?: boolean;
    __fbInitialPageview?: boolean;
  }
}

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Use this for specific actions (Add to Cart, Purchase, etc.)
export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};
