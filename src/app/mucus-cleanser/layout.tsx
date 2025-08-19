import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mucus Cleanser | Dr. Sebi's Powerful Respiratory & Cellular Cleansing Formula",
  description: "Eliminate excess mucus naturally with Dr. Sebi's authentic Mucus Cleanser. Made with cascara, mullein root, and African bird pepper for respiratory health and cellular cleansing. $59.99 (20% off)",
  keywords: "Dr Sebi mucus cleanser, respiratory health, mucus removal, cascara, mullein root, cellular cleansing, natural breathing support, phlegm removal",
  openGraph: {
    title: "Mucus Cleanser | Dr. Sebi's Powerful Respiratory & Cellular Cleansing Formula",
    description: "Eliminate excess mucus naturally with Dr. Sebi's authentic Mucus Cleanser. Made with cascara, mullein root, and African bird pepper for respiratory health.",
    images: ["/mucus.png"],
  },
};

export default function MucusCleanserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}