import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maya Formula | Dr. Sebi's 26 Herb Iron-Rich Blood & Brain Support",
  description: "Dr. Sebi's greatest creation - Maya 26 herb formula supports blood, brain & nervous system. Enhanced iron-rich nourishment made fresh in Honduras. $59.99 (40% off)",
  keywords: "Dr Sebi Maya, 26 herb formula, iron rich supplement, blood support, brain health, nervous system, sarsaparilla, sea moss, Honduras, natural healing",
  openGraph: {
    title: "Maya Formula | Dr. Sebi's 26 Herb Iron-Rich Blood & Brain Support",
    description: "Dr. Sebi's greatest creation - Maya 26 herb formula supports blood, brain & nervous system. Enhanced iron-rich nourishment made fresh in Honduras.",
    images: ["/maya.png"],
  },
};

export default function MayaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}