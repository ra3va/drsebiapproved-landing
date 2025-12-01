import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ParaCleanse Elite | Dr. Sebi's Two-Phase Internal Cleansing System",
  description: "Experience Dr. Sebi's authentic two-phase internal cleanse. Support your body's natural detoxification and digestive wellness with this powerful herbal system. Part of our complete line of Dr. Sebi products. Complete 14-day system for $59.99",
  keywords: "Dr Sebi cleanse, internal cleanse, two phase cleanse, ParaWash, intracellular cleanse, natural detox support, digestive health, Dr Sebi products, wildcrafted herbs",
  openGraph: {
    title: "ParaCleanse Elite | Dr. Sebi's Two-Phase Internal Cleansing System",
    description: "Experience Dr. Sebi's authentic two-phase internal cleanse. Support gentle detoxification and digestive wellness with traditional wildcrafted herbs.",
    images: ["/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"],
    type: "website",
    siteName: "Dr. Sebi Approved",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParaCleanse Elite | Dr. Sebi's Internal Cleanse",
    description: "Dr. Sebi's authentic two-phase internal cleanse system to support your body's natural detoxification processes.",
    images: ["/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"],
  }
};

export default function ParaCleanseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
