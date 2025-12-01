import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mucus Cleanser | Dr. Sebi's Powerful Respiratory & Cellular Cleansing Formula",
  description: "Support healthy mucus balance naturally with Dr. Sebi's authentic Mucus Cleanser. Made with cascara, mullein root, and African bird pepper for respiratory wellness and cellular cleansing support. Part of our complete Dr. Sebi product line. $31.99 (47% off)",
  keywords: "Dr Sebi mucus cleanser, respiratory health, mucus support, cascara, mullein root, cellular cleansing support, natural breathing support, Dr Sebi products, wildcrafted herbs",
  openGraph: {
    title: "Mucus Cleanser | Dr. Sebi's Powerful Respiratory & Cellular Cleansing Formula",
    description: "Support healthy mucus balance with Dr. Sebi's authentic Mucus Cleanser. Made with cascara, mullein root, and African bird pepper.",
    images: ["/mucus.png"],
    type: "website",
    siteName: "Dr. Sebi Approved",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mucus Cleanser | Dr. Sebi's Respiratory Cleansing",
    description: "Support healthy mucus levels. Made with cascara, mullein root, and African bird pepper for respiratory wellness.",
    images: ["/mucus.png"],
  }
};

export default function MucusCleanserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
