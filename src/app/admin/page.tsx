'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { useHydrated } from '@/hooks/use-hydrated'
import AdminLayout from '@/components/walanai/admin/AdminLayout'
import AdminLoginPage from '@/components/walanai/admin/AdminLoginPage'

export default function AdminPage() {
  const { isAuthenticated, isAdminMode, enterAdminMode, user } = useAppStore()
  const mounted = useHydrated()

  // Auto-enter admin mode when visiting /admin
  useEffect(() => {
    if (mounted && !isAdminMode) {
      enterAdminMode()
    }
  }, [mounted, isAdminMode, enterAdminMode])

  // Redirect to home when exiting admin mode
  useEffect(() => {
    if (mounted && !isAdminMode && isAuthenticated) {
      window.location.href = '/'
    }
  }, [mounted, isAdminMode, isAuthenticated])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Chargement du back-office...</p>
        </div>
      </div>
    )
  }

  // If not authenticated or not an admin user, show login page
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'super-admin')) {
    return <AdminLoginPage />
  }

  // If authenticated admin, show admin layout
  return <AdminLayout />
}
