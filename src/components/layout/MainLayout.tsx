'use client'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header/Header'
import { Box, Container } from '@mui/material'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

/**
 * Client component that renders the main content layout
 * Handles conditional rendering based on route (admin vs regular)
 */
function ClientLayoutContent({ children }: LayoutProps) {
  const pathname = usePathname()
  const [isAdminRoute, setIsAdminRoute] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsAdminRoute(pathname?.startsWith('/admin') || false)
    setIsClient(true)
  }, [pathname])
  
  // Use a simple loader to avoid hydration errors
  if (!isClient) {
    return <div suppressHydrationWarning>{children}</div>
  }
  
  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <Container maxWidth='xl' sx={{ margin: '0 auto' }}>
        <Box sx={{ paddingTop: { xs: 2, sm: 3, md: 4 }, paddingBottom: { xs: 2, sm: 3, md: 4 } }}>{children}</Box>
      </Container>
      <Footer />
    </>
  )
}

/**
 * Main layout wrapper with common styling
 */
export default function MainLayout({ children }: LayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
      suppressHydrationWarning
    >
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </div>
  )
}
