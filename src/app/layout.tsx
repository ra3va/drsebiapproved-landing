import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import ShopifyAnalytics from '@/components/ShopifyAnalytics'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://drsebiapproved.com' : 'http://localhost:3000'),
  title: "ParaCleanse Elite | Dr. Sebi's Original Two-Phase Total Parasite Cleansing System",
  description: "Experience Dr. Sebi's authentic two-phase parasite cleanse. Break down biofilms and eliminate parasites with our powerful, natural formula.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-82X1CCWKZN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-82X1CCWKZN');
          `}
        </Script>
        
        <Script
          id="shopify-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Shopify = Shopify || {};
              Shopify.shop = "${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}";
            `
          }}
        />
        <Script
          id="shopify-api"
          src="https://cdn.shopify.com/shopifycloud/shopify/assets/storefront-api.js"
          strategy="afterInteractive"
        />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1757625231633648');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1757625231633648&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Brevo Behavioral Tracking */}
        <Script src="https://cdn.brevo.com/js/sdk-loader.js" async />
        <Script id="brevo-tracker" strategy="afterInteractive">
          {`
            // Version: 2.0
            window.Brevo = window.Brevo || [];
            Brevo.push([
                "init",
                {
                client_key: "fe6w1ww57kreu47ho3uax9h2",
                // Optional: Add other initialization options, see documentation
                }
            ]);
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ShopifyAnalytics />
        {children}
      </body>
    </html>
  );
}
