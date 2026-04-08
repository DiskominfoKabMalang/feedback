import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Echo - Collect Feedback That Matters',
    template: '%s | Echo',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  description:
    'A simple, powerful way to collect and manage customer feedback. Build forms, gather insights, and improve your product.',
  keywords: [
    'Feedback',
    'Customer Feedback',
    'NPS',
    'Survey',
    'Form Builder',
    'Product Feedback',
  ],
  authors: [{ name: 'Echo' }],
  creator: 'Echo',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://echofeedback.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://echofeedback.com',
    title: 'Echo - Collect Feedback That Matters',
    description:
      'A simple, powerful way to collect and manage customer feedback. Build forms, gather insights, and improve your product.',
    siteName: 'Echo',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Echo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Echo - Collect Feedback That Matters',
    description:
      'A simple, powerful way to collect and manage customer feedback. Build forms, gather insights, and improve your product.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
