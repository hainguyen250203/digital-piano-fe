'use client'

import { AuthStoreProvider } from '@/context/AuthStoreContext'
import { CartWishlistProvider } from '@/context/CartWishlistContext'
import QueryProvider from '@/context/QueryProvider'
import { ReactNode, useEffect, useState } from 'react'
import ToastProvider from './ToastProvider'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Combines all app providers in the correct order
 */
export default function AppProviders({ children }: AppProvidersProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <QueryProvider>
      <div style={{ display: 'contents' }} suppressHydrationWarning>
        {!isClient ? (
          children
        ) : (
          <AuthStoreProvider>
            <CartWishlistProvider>
              <ToastProvider>{children}</ToastProvider>
            </CartWishlistProvider>
          </AuthStoreProvider>
        )}
      </div>
    </QueryProvider>
  )
}
