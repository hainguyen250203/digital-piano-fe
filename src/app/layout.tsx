'use client'

import MainLayout from '@/components/layout/MainLayout'
import AppProviders from '@/components/providers/AppProviders'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ReactNode } from 'react'
import './globals.css'

// Load Inter font with Vietnamese subset
const inter = Inter({ subsets: ['vietnamese'] })

// Comment out metadata export to avoid conflict in client component
// export const metadata: Metadata = {
//   title: 'Digital Piano Store',
//   description: 'Your one-stop shop for digital pianos'
// }

interface LayoutProps {
  children: ReactNode
}

/**
 * Root layout component that wraps the entire application
 * Provides the font and all app providers
 */
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='vi' suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AppProviders>
          <MainLayout>{children}</MainLayout>
        </AppProviders>
        <Script src='https://cdn.fchat.vn/assets/embed/webchat.js?id=682e9b63967c00bb1a0f8746' strategy='afterInteractive' />
        <Analytics />
      </body>
    </html>
  )
}
