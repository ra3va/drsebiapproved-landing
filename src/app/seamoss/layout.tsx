import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sea Moss Capsules | Dr. Sebi's 92 Minerals for Thyroid & Immune Support",
  description: "Honduran wildcrafted Sea Moss capsules with 92 essential minerals. Supports thyroid function, immune health & digestion. Part of our authentic Dr. Sebi product line. $31.99 (36% off)",
  keywords: "Dr Sebi sea moss, 92 minerals, thyroid support, immune system, digestive health, Honduran sea moss, wildcrafted, natural supplements, Dr Sebi products",
  openGraph: {
    title: "Sea Moss Capsules | Dr. Sebi's 92 Minerals for Thyroid & Immune Support",
    description: "Honduran wildcrafted Sea Moss with 92 essential minerals. Nature's multi-vitamin for thyroid function, immune health & digestion.",
    images: ["/seamoss.png"],
    type: "website",
    siteName: "Dr. Sebi Approved",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sea Moss Capsules | Dr. Sebi's 92 Minerals",
    description: "Honduran wildcrafted Sea Moss with 92 essential minerals. Thyroid support, immune health & digestive wellness.",
    images: ["/seamoss.png"],
  }
};

export default function SeaMossLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}