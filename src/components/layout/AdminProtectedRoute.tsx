'use client'

import { hasAdminAccess, isAuthenticated } from '@/utils/auth'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Protects admin routes and enforces authentication
 * Handles loading states and redirects unauthenticated users
 */
export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication status once mounted
  useEffect(() => {
    // Skip during SSR
    if (!mounted) return

    // Define check function to avoid state updates after unmount
    const checkAuth = () => {
      // Only run on client-side
      if (typeof window === 'undefined') return
      
      // Check if user is authenticated at all
      if (!isAuthenticated()) {
        router.push('/admin/login')
        return
      }

      // Check if user has admin access
      if (!hasAdminAccess()) {
        router.push('/admin/login')
        return
      }

      // User is authorized
      setIsAuthorized(true)
      setIsChecking(false)
    }

    // Run the check
    checkAuth()
  }, [router, mounted])

  // For hydration consistency, render nothing during SSR or initial client render
  if (!mounted) {
    return <>{children}</>
  }

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 2,
          flex: 1
        }}
      >
        <CircularProgress color='primary' />
        <Typography variant='body1' color='text.secondary'>
          Xác thực quyền truy cập...
        </Typography>
      </Box>
    )
  }

  // Only render children if user is authorized
  return isAuthorized ? <>{children}</> : null
}
