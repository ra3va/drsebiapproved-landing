### **1. Which one should you use?**

You should use **`26 HM - Pixel` (ID: 1098386598872178)**.

  * **Why?** It shares the same name as your Ad Account (`26 HM`), which means they are already linked in Meta's backend. This makes it much easier to create "Retargeting Audiences" (e.g., *people who viewed ParaCleanse but didn't buy*) directly inside your ad campaigns.
  * **Do NOT use both:** Using both will double-count every visitor, destroying your data accuracy and confusing Meta's ad algorithm.
  * **Note:** Meta now calls these "Datasets," but it is exactly the same technology as the "Pixel".

-----

### **2. Implementation for Next.js 14 (App Router)**

Since you are using Next.js 14 with the App Router, you cannot just paste the code into a `head` tag. You need a specialized component.

Here is the exact code for your Factory AI Droid to implement.

#### **Step A: Add to Environment Variables**

Update your `.env.local` file with the ID from your screenshot:

```bash
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=1098386598872178
```

#### **Step B: Create the Utility Library**

Create a file at `src/lib/fpixel.ts`. This allows you to trigger events (like "Purchase" or "AddToCart") from anywhere in your app.

```typescript
// src/lib/fpixel.ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
  if (typeof window !== 'undefined') {
    window.fbq('track', 'PageView');
  }
};

// Use this for specific actions (Add to Cart, Purchase, etc.)
export const event = (name: string, options = {}) => {
  if (typeof window !== 'undefined') {
    window.fbq('track', name, options);
  }
};
```

#### **Step C: Create the Pixel Component**

Create `src/components/analytics/FacebookPixel.tsx`. This handles the initialization safely.

```tsx
// src/components/analytics/FacebookPixel.tsx
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import * as fpixel from '@/lib/fpixel';

export default function FacebookPixel() {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Track PageView on route change
    if (loaded) {
      fpixel.pageview();
    }
  }, [pathname, loaded]);

  return (
    <div>
      <Script
        id="fb-pixel"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
        onLoad={() => {
          setLoaded(true);
          // Standard initialization
          window.fbq('init', fpixel.FB_PIXEL_ID);
          window.fbq('track', 'PageView');
        }}
      />
      <Script id="fb-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        `}
      </Script>
    </div>
  );
}
```

#### **Step D: Add to Root Layout**

Import it in `src/app/layout.tsx` so it runs on every page.

```tsx
// src/app/layout.tsx
import FacebookPixel from '@/components/analytics/FacebookPixel';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FacebookPixel /> 
        {children}
      </body>
    </html>
  );
}
```

-----

### **3. The Next Step (Crucial for E-Commerce)**

Since you are running a Black Friday sale, just tracking "Page Views" isn't enough. You need to tell Meta when someone **buys** so it can find more buyers.

Ask your Droid (or update your code) to trigger the `Purchase` event on your "Thank You" page:

```typescript
// On your specific Thank You / Success page
import * as fpixel from '@/lib/fpixel';

// Call this when the order is confirmed
fpixel.event('Purchase', {
  currency: 'USD',
  value: orderTotal, // e.g. 62.99
});
```

**Would you like the Droid instruction block for tracking "Add To Cart" events on your new Black Friday buttons?**