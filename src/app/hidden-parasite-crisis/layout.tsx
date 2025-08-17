import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Hidden Parasite Crisis - Free Guide | Dr. Sebi Approved',
  description: 'Dr. Sebi\'s Complete Guide to Eliminate Silent Invaders and Reclaim Your Health. Discover why millions suffer from unexplained fatigue, brain fog, and digestive issues - and the natural 2-phase solution that actually works.',
  keywords: ['parasite cleanse', 'Dr. Sebi', 'hidden parasites', 'parasite symptoms', 'biofilm', 'natural cleanse', 'gut health', 'parasite elimination'],
  openGraph: {
    title: 'The Hidden Parasite Crisis - Free Guide',
    description: 'Discover the truth about hidden parasites affecting millions. Get Dr. Sebi\'s proven 2-phase elimination protocol FREE.',
    images: ['/3066a71b-75c7-4a5c-876a-3d7c080cde01.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Hidden Parasite Crisis - Free Guide',
    description: 'Dr. Sebi\'s Complete Guide to Eliminate Silent Invaders and Reclaim Your Health',
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