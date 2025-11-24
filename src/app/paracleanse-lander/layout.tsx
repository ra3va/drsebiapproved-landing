import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ParaCleanse Elite | Dr. Sebi's Original Two-Phase Parasite Cleansing System",
  description: "Experience Dr. Sebi's authentic two-phase parasite cleanse. Break down biofilms and eliminate parasites with our powerful, natural formula. Part of our complete line of Dr. Sebi products. Complete 14-day system for $59.99",
  keywords: "Dr Sebi parasite cleanse, biofilm disruptor, two phase cleanse, ParaWash, intracellular cleanse, natural parasite removal, digestive health, Dr Sebi products, wildcrafted herbs",
  openGraph: {
    title: "ParaCleanse Elite | Dr. Sebi's Original Two-Phase Parasite Cleansing System",
    description: "Experience Dr. Sebi's authentic two-phase parasite cleanse. Break down biofilms and eliminate parasites. Part of our complete line of Dr. Sebi natural healing products.",
    images: ["/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"],
    type: "website",
    siteName: "Dr. Sebi Approved",
  },
  twitter: {
    card: "summary_large_image",
    title: "ParaCleanse Elite | Dr. Sebi's Two-Phase Parasite Cleanse",
    description: "Dr. Sebi's authentic two-phase parasite cleanse system. Break down biofilms and eliminate parasites naturally.",
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