import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'iPhone 17 Pro Max — Cosmic Orange | Sankofa',
  description:
    'Discover the iPhone 17 Pro Max in Cosmic Orange. Titanium design, 48MP Fusion Camera, A19 Pro Chip, and all-day battery. From $1,199.',
  keywords: [
    'iPhone 17 Pro Max',
    'Cosmic Orange',
    'Apple',
    'iPhone',
    'Titanium',
    'A19 Pro',
  ],
  openGraph: {
    title: 'iPhone 17 Pro Max — Cosmic Orange',
    description:
      'Titanium. Redefined. The iPhone 17 Pro Max in Cosmic Orange — from $1,199.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Sankofa',
    images: [
      {
        url: 'https://v3b.fal.media/files/b/0a9100d1/MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png',
        width: 1200,
        height: 630,
        alt: 'iPhone 17 Pro Max Cosmic Orange landing page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iPhone 17 Pro Max — Cosmic Orange',
    description:
      'Titanium. Redefined. The iPhone 17 Pro Max in Cosmic Orange — from $1,199.',
    images: [
      'https://v3b.fal.media/files/b/0a9100d1/MnGOHaGHyy4NoaNJpcvsy_XogwTTki.png',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6B35',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
