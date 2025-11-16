import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sea Moss Capsules | Dr. Sebi's 92 Minerals for Thyroid & Immune Support",
  description: "Honduran wildcrafted Sea Moss capsules with 92 essential minerals. Supports thyroid function, immune health & digestion. 40 capsules $49.99 (17% off)",
  keywords: "Dr Sebi sea moss, 92 minerals, thyroid support, immune system, digestive health, Honduran sea moss, wildcrafted, natural supplements",
  openGraph: {
    title: "Sea Moss Capsules | Dr. Sebi's 92 Minerals for Thyroid & Immune Support", 
    description: "Honduran wildcrafted Sea Moss capsules with 92 essential minerals. Supports thyroid function, immune health & digestion.",
    images: ["/seamoss.png"],
  },
};

export default function SeaMossLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}