import { clearAuthCookies, getAccessToken, getUserRole, setAuthCookies } from '@/utils/auth'
import { create } from 'zustand'

export interface AuthStore {
  accessToken: string | null
  userRole: string | null
  setAccessToken: (token: string | null) => void
  setUserRole: (role: string | null) => void
  clearAuth: () => void
}

export const initAuthStore: AuthStore = {
  accessToken: null,
  userRole: null,
  setAccessToken: () => {},
  setUserRole: () => {},
  clearAuth: () => {},
}

export const createAuthStore = (initData: AuthStore) => {
  return create<AuthStore>()((set) => ({
    // Initial state - will be overridden by cookie values if they exist
    ...initData,
    // Add getters that use cookies
    get accessToken() {
      return getAccessToken() || null
    },
    get userRole() {
      return getUserRole()
    },
    // Methods that update both store and cookies
    setAccessToken: (token) => {
      if (token) {
        const currentRole = getUserRole() || 'USER'
        setAuthCookies(token, currentRole)
      }
      set({ accessToken: token })
    },
    setUserRole: (role) => {
      if (role) {
        const currentToken = getAccessToken() || ''
        setAuthCookies(currentToken, role)
      }
      set({ userRole: role })
    },
    clearAuth: () => {
      clearAuthCookies()
      set({ accessToken: null, userRole: null })
    },
  }))
} 