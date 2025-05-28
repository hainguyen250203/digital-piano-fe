'use client'

import { AuthStoreProvider } from '@/context/AuthStoreContext'
import { CartWishlistProvider } from '@/context/CartWishlistContext'
import QueryProvider from '@/context/QueryProvider'
import { Box } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import ToastProvider from './ToastProvider'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Combines all app providers in the correct order
 */
export default function AppProviders({ children }: AppProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <QueryProvider>
      <Box sx={{ display: 'contents' }} suppressHydrationWarning>
        {!mounted ? (
          children
        ) : (
          <AuthStoreProvider>
            <CartWishlistProvider>
              <ToastProvider>{children}</ToastProvider>
            </CartWishlistProvider>
          </AuthStoreProvider>
        )}
      </Box>
    </QueryProvider>
  )
}
