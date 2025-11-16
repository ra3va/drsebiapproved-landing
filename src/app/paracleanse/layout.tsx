import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ParaCleanse Elite | Dr. Sebi's Original Two-Phase Parasite Cleansing System",
  description: "Experience Dr. Sebi's authentic two-phase parasite cleanse. Break down biofilms and eliminate parasites with our powerful, natural formula. Complete 14-day system for $89.99 (55% off)",
  keywords: "Dr Sebi parasite cleanse, biofilm disruptor, two phase cleanse, ParaWash, intracellular cleanse, natural parasite removal, digestive health",
  openGraph: {
    title: "ParaCleanse Elite | Dr. Sebi's Original Two-Phase Parasite Cleansing System",
    description: "Experience Dr. Sebi's authentic two-phase parasite cleanse. Break down biofilms and eliminate parasites with our powerful, natural formula.",
    images: ["/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"],
  },
};

export default function ParaCleanseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}