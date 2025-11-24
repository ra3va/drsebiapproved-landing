import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maya Formula | Dr. Sebi's 26 Herb Iron-Rich Blood & Brain Support",
  description: "Dr. Sebi's greatest creation - Maya 26 herb formula supports blood, brain & nervous system. Enhanced iron-rich nourishment made fresh in Honduras. Part of our authentic Dr. Sebi product line. $44.99 (25% off)",
  keywords: "Dr Sebi Maya, 26 herb formula, iron rich supplement, blood support, brain health, nervous system, sarsaparilla, sea moss, Honduras, natural healing, Dr Sebi products, wildcrafted herbs",
  openGraph: {
    title: "Maya Formula | Dr. Sebi's 26 Herb Iron-Rich Blood & Brain Support",
    description: "Dr. Sebi's greatest creation - Maya 26 herb formula for blood, brain & nervous system support. Made fresh in Honduras with wildcrafted herbs.",
    images: ["/maya.png"],
    type: "website",
    siteName: "Dr. Sebi Approved",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maya Formula | Dr. Sebi's 26 Herb Iron-Rich Formula",
    description: "Dr. Sebi's greatest creation - 26 herb formula for blood, brain & nervous system support. Made fresh in Honduras.",
    images: ["/maya.png"],
  }
};

export default function MayaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}