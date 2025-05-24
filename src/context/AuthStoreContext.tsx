'use client'

import { type ReactNode, createContext, useContext, useEffect, useRef } from 'react'
import { useStore } from 'zustand'

import { type AuthStore, createAuthStore, initAuthStore } from '@/stores/AuthStore'

export type AuthStoreApi = ReturnType<typeof createAuthStore>

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(undefined)

export interface AuthStoreProviderProps {
  children: ReactNode
}

/**
 * Provider component for authentication state
 * Uses both Zustand store and cookies
 */
export const AuthStoreProvider = ({ children }: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi | null>(null)

  // Initialize store if it doesn't exist
  if (!storeRef.current) {
    storeRef.current = createAuthStore(initAuthStore)
  }

  // Update store from cookies on client side
  useEffect(() => {
    // This effect ensures the store is initialized on the client side
    // No action needed as the store reads directly from cookies
  }, [])

  return <AuthStoreContext.Provider value={storeRef.current}>{children}</AuthStoreContext.Provider>
}

/**
 * Hook to access the auth store state and actions
 */
export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext)

  if (!authStoreContext) {
    throw new Error(`useAuthStore must be used within AuthStoreProvider`)
  }

  return useStore(authStoreContext, selector)
}
