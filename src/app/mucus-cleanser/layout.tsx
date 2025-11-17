import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mucus Cleanser | Dr. Sebi's Powerful Respiratory & Cellular Cleansing Formula",
  description: "Eliminate excess mucus naturally with Dr. Sebi's authentic Mucus Cleanser. Made with cascara, mullein root, and African bird pepper for respiratory health and cellular cleansing. Part of our complete Dr. Sebi product line. $31.99 (47% off)",
  keywords: "Dr Sebi mucus cleanser, respiratory health, mucus removal, cascara, mullein root, cellular cleansing, natural breathing support, phlegm removal, Dr Sebi products, wildcrafted herbs",
  openGraph: {
    title: "Mucus Cleanser | Dr. Sebi's Powerful Respiratory & Cellular Cleansing Formula",
    description: "Eliminate excess mucus naturally with Dr. Sebi's authentic Mucus Cleanser. Made with cascara, mullein root, and African bird pepper.",
    images: ["/mucus.png"],
    type: "website",
    siteName: "Dr. Sebi Approved",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mucus Cleanser | Dr. Sebi's Respiratory Cleansing",
    description: "Eliminate excess mucus naturally. Made with cascara, mullein root, and African bird pepper for respiratory health.",
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