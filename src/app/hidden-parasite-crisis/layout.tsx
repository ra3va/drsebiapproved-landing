import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Hidden Parasite Crisis - Free Guide | Dr. Sebi Approved',
  description: 'Dr. Sebi\'s educational guide on hidden gut imbalances and internal cleansing. Explore why many people experience unexplained fatigue, brain fog, and digestive issues — and a gentle two-phase herbal approach that may support gut health.',
  keywords: ['Dr. Sebi', 'gut health guide', 'hidden gut imbalances', 'digestive wellness', 'natural cleanse', 'biofilm education', 'internal cleansing'],
  openGraph: {
    title: 'The Hidden Parasite Crisis - Free Guide',
    description: 'Explore perspectives on the “hidden parasite crisis” and gut health. Get Dr. Sebi\'s two-phase internal cleansing framework FREE for educational purposes.',
    images: ['/3066a71b-75c7-4a5c-876a-3d7c080cde01.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Hidden Parasite Crisis - Free Guide',
    description: 'Dr. Sebi\'s free guide on hidden gut imbalances, biofilms, and his two-phase cleansing philosophy.',
    images: ['/3066a71b-75c7-4a5c-876a-3d7c080cde01.jpeg'],
  },
}

export default function HiddenParasiteCrisisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
