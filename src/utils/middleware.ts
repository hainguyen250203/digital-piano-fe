import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value
  const isValidRole = userRole === 'ADMIN' || userRole === 'STAFF'

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Special case for login page
    if (pathname === '/admin/login') {
      // If already logged in with valid role, redirect to admin dashboard
      if (accessToken && isValidRole) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      
      // Otherwise allow access to login page
      return NextResponse.next()
    }

    // For all other admin routes, require authentication and correct role
    if (!accessToken || !isValidRole) {
      // Clear all auth cookies when redirecting to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('accessToken')
      response.cookies.delete('refreshToken')
      response.cookies.delete('userRole')
      return response
    }
  }

  return NextResponse.next()
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*'
  ]
} 