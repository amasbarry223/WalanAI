'use client'

import { useAppStore, type AdminPageName } from '@/lib/store'
import { useState, useSyncExternalStore } from 'react'
import AdminSidebar, { AdminSidebarContent } from './AdminSidebar'
import AdminDashboardPage from './AdminDashboardPage'
import AdminUsersPage from './AdminUsersPage'
import AdminContentPage from './AdminContentPage'
import AdminExamsPage from './AdminExamsPage'
import AdminSubscriptionsPage from './AdminSubscriptionsPage'
import AdminAnalyticsPage from './AdminAnalyticsPage'
import AdminSupportPage from './AdminSupportPage'
import AdminSettingsPage from './AdminSettingsPage'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

const emptySubscribe = () => () => {}

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

const adminPageTitles: Record<AdminPageName, string> = {
  'admin-dashboard': 'Tableau de bord',
  'admin-users': 'Gestion des Utilisateurs',
  'admin-content': 'Gestion du Contenu',
  'admin-exams': 'Gestion des Examens',
  'admin-subscriptions': 'Abonnements & Revenus',
  'admin-analytics': 'Analytique',
  'admin-support': 'Support',
  'admin-settings': 'Configuration',
}

function MobileAdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentAdminPage, user } = useAppStore()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-slate-900 border-b border-slate-700/50">
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-800 transition-colors text-slate-300"
        aria-label="Ouvrir le menu admin"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-white">
          {adminPageTitles[currentAdminPage] || 'Admin'}
        </h1>
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase tracking-wide">Admin</span>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}

function MobileAdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] p-0 bg-slate-900 border-slate-700/50">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Admin</SheetTitle>
          <SheetDescription>Menu de navigation administration</SheetDescription>
        </SheetHeader>
        <AdminSidebarContent collapsed={false} onNavigate={onClose} />
      </SheetContent>
    </Sheet>
  )
}

export default function AdminLayout() {
  const { currentAdminPage } = useAppStore()
  const mounted = useHydrated()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Chargement...</p>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentAdminPage) {
      case 'admin-dashboard':
        return <AdminDashboardPage />
      case 'admin-users':
        return <AdminUsersPage />
      case 'admin-content':
        return <AdminContentPage />
      case 'admin-exams':
        return <AdminExamsPage />
      case 'admin-subscriptions':
        return <AdminSubscriptionsPage />
      case 'admin-analytics':
        return <AdminAnalyticsPage />
      case 'admin-support':
        return <AdminSupportPage />
      case 'admin-settings':
        return <AdminSettingsPage />
      default:
        return <AdminDashboardPage />
    }
  }

  return (
    <div className="flex h-full bg-slate-50">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Sidebar */}
      <MobileAdminSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <MobileAdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
