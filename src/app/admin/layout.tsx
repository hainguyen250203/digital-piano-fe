'use client'

import AdminProtectedRoute from '@/components/layout/AdminProtectedRoute'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Just render login page directly without protection
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <AdminProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </AdminProtectedRoute>
  )
}
