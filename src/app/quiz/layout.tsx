import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Quiz | Find Your Perfect Dr. Sebi Product",
  description: "Take our free health assessment quiz to discover which Dr. Sebi products are right for you. Get personalized recommendations from our complete line: Maya Formula, Sea Moss, ParaCleanse Elite, and Mucus Cleanser.",
  keywords: "health quiz, Dr Sebi products, health assessment, natural healing, wellness quiz, product recommendation, parasites quiz, holistic health",
  openGraph: {
    title: "Health Quiz | Find Your Perfect Dr. Sebi Product",
    description: "Take our free health assessment to discover which Dr. Sebi products are right for you. Get personalized recommendations.",
    images: ["/maya.png"],
    type: "website",
    siteName: "Dr. Sebi Approved",
  },
  twitter: {
    card: "summary_large_image",
    title: "Health Quiz | Find Your Perfect Dr. Sebi Product",
    description: "Take our free health assessment to discover which Dr. Sebi products are right for you.",
    images: ["/maya.png"],
  }
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
