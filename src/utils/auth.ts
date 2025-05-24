import { deleteCookie, getCookie, setCookie } from 'cookies-next/client'

/**
 * Auth cookie names
 */
export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'accessToken',
  USER_ROLE: 'userRole',
}

/**
 * Possible user roles in the system
 */
export type UserRole = 'ADMIN' | 'STAFF' | 'USER' | null

/**
 * Set authentication cookies
 */
export const setAuthCookies = (accessToken: string, role: string): void => {
  setCookie(AUTH_COOKIES.ACCESS_TOKEN, accessToken)
  setCookie(AUTH_COOKIES.USER_ROLE, role)
}

/**
 * Get access token from cookie
 */
export const getAccessToken = (): string | undefined => {
  return getCookie(AUTH_COOKIES.ACCESS_TOKEN) as string | undefined
}

/**
 * Get user role from cookie
 */
export const getUserRole = (): UserRole => {
  return getCookie(AUTH_COOKIES.USER_ROLE) as UserRole | undefined || null
}

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = (): void => {
  deleteCookie(AUTH_COOKIES.ACCESS_TOKEN)
  deleteCookie(AUTH_COOKIES.USER_ROLE)
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

/**
 * Check if user has admin access
 */
export const hasAdminAccess = (): boolean => {
  const role = getUserRole()
  return isAuthenticated() && (role === 'ADMIN' || role === 'STAFF')
} 