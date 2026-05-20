'use client'

import { useAppStore, type AdminPageName } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  CreditCard,
  BarChart3,
  Headphones,
  Settings,
  ArrowLeftRight,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Crown,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface AdminNavItem {
  label: string
  page: AdminPageName
  icon: React.ReactNode
  section?: string
}

const adminNavItems: AdminNavItem[] = [
  {
    label: 'Tableau de bord',
    page: 'admin-dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    section: 'PRINCIPAL',
  },
  {
    label: 'Utilisateurs',
    page: 'admin-users',
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: 'Contenu',
    page: 'admin-content',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: 'Examens',
    page: 'admin-exams',
    icon: <ClipboardCheck className="h-4 w-4" />,
  },
  {
    label: 'Abonnements',
    page: 'admin-subscriptions',
    icon: <CreditCard className="h-4 w-4" />,
    section: 'BUSINESS',
  },
  {
    label: 'Analytique',
    page: 'admin-analytics',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    label: 'Support',
    page: 'admin-support',
    icon: <Headphones className="h-4 w-4" />,
  },
  {
    label: 'Configuration',
    page: 'admin-settings',
    icon: <Settings className="h-4 w-4" />,
    section: 'SYSTÈME',
  },
]

function AdminSidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate?: () => void
}) {
  const { currentAdminPage, setCurrentAdminPage, user, exitAdminMode } = useAppStore()

  const handleExitAdmin = () => {
    exitAdminMode()
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  const handleNav = (page: AdminPageName) => {
    setCurrentAdminPage(page)
    onNavigate?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-700/50 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 shrink-0">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <span className="font-bold text-lg text-white whitespace-nowrap">WalanAI</span>
            <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase tracking-wide">Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3 px-3">
        <div className="space-y-0.5">
          {adminNavItems.map((item) => (
            <div key={item.page}>
              {item.section && !collapsed && (
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1.5 first:pt-0">
                  {item.section}
                </p>
              )}
              {item.section && collapsed && (
                <Separator className="my-2 bg-slate-700/50" />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNav(item.page)}
                    className={cn(
                      'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      currentAdminPage === item.page
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <span
                      className={cn(
                        'shrink-0',
                        currentAdminPage === item.page
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      )}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-slate-700/50 bg-slate-900">
        {/* Switch to Student Mode */}
        <div className="px-3 pt-3 pb-2">
          {!collapsed ? (
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white gap-2"
              onClick={handleExitAdmin}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Mode Étudiant
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center justify-center w-full py-2 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  onClick={handleExitAdmin}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Mode Étudiant</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Admin Profile */}
        <div className="px-3 pb-3">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[11px] text-amber-400 font-semibold capitalize flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {user?.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-slate-900 transition-all duration-300 ease-in-out h-full overflow-hidden relative border-r border-slate-700/50',
          sidebarCollapsed ? 'w-[70px]' : 'w-[260px]'
        )}
      >
        <AdminSidebarContent collapsed={sidebarCollapsed} />
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 z-10 flex items-center justify-center w-6 h-6 rounded-full border border-slate-600 bg-slate-800 shadow-sm text-slate-400 hover:text-slate-200 hover:shadow transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  )
}

export { AdminSidebarContent }
