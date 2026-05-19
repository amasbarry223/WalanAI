'use client'

import { useAppStore, type PageName } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Bot,
  Brain,
  TrendingUp,
  History,
  Settings,
  HelpCircle,
  Crown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  BookOpen,
  Timer,
  Calendar,
  Trophy,
  Lightbulb,
  CreditCard,
  Zap,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NavItem {
  label: string
  page: PageName
  icon: React.ReactNode
  section?: string
}

const navItems: NavItem[] = [
  {
    label: 'Tableau de bord',
    page: 'dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    section: 'NAVIGATION',
  },
  {
    label: 'Mes Documents',
    page: 'documents',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: 'Assistant IA',
    page: 'assistant',
    icon: <Bot className="h-4 w-4" />,
  },
  {
    label: 'Carnets de notes',
    page: 'notes',
    icon: <BookOpen className="h-4 w-4" />,
    section: 'APPRENTISSAGE',
  },
  {
    label: 'Ressources',
    page: 'resources',
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    label: 'Révision',
    page: 'revision',
    icon: <Brain className="h-4 w-4" />,
  },
  {
    label: 'Pomodoro',
    page: 'pomodoro',
    icon: <Timer className="h-4 w-4" />,
  },
  {
    label: 'Planificateur',
    page: 'planner',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    label: 'Classement',
    page: 'leaderboard',
    icon: <Trophy className="h-4 w-4" />,
  },
  {
    label: 'Ma Progression',
    page: 'progress',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    label: 'Générateur de Quiz',
    page: 'quiz-generator',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    label: 'Historique Quiz',
    page: 'quiz-history',
    icon: <History className="h-4 w-4" />,
  },
  {
    label: 'Tarifs',
    page: 'pricing',
    icon: <CreditCard className="h-4 w-4" />,
    section: 'AUTRE',
  },
  {
    label: 'Paramètres',
    page: 'settings',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    label: "Centre d'aide",
    page: 'help',
    icon: <HelpCircle className="h-4 w-4" />,
  },
]

export default function Sidebar() {
  const { currentPage, setCurrentPage, user, sidebarCollapsed, toggleSidebar, logout } =
    useAppStore()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex flex-col border-r bg-white transition-all duration-300 ease-in-out h-screen sticky top-0 overflow-hidden',
          sidebarCollapsed ? 'w-[70px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 shrink-0">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-lg text-gray-900 whitespace-nowrap">
              ScolarAI
            </span>
          )}
        </div>

        {/* Navigation - scrollable */}
        <ScrollArea className="flex-1 py-3 px-3">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <div key={item.page}>
                {item.section && !sidebarCollapsed && (
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1.5 first:pt-0">
                    {item.section}
                  </p>
                )}
                {item.section && sidebarCollapsed && (
                  <Separator className="my-2" />
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCurrentPage(item.page)}
                      className={cn(
                        'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        currentPage === item.page
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        sidebarCollapsed && 'justify-center px-2'
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0',
                          currentPage === item.page
                            ? 'text-emerald-500'
                            : 'text-gray-400'
                        )}
                      >
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom section - fixed */}
        <div className="shrink-0 border-t bg-white">
          {/* Pro Upgrade - compact */}
          <div className="px-3 pt-3 pb-2">
            {!sidebarCollapsed ? (
              <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 text-white">
                <div className="flex items-center gap-2 mb-0.5">
                  <Crown className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">Passer à Pro</span>
                </div>
                <p className="text-[10px] text-emerald-100 mb-1.5 leading-tight">
                  Débloquez tout
                </p>
                <Button
                  size="sm"
                  className="w-full bg-white text-emerald-600 hover:bg-emerald-50 h-7 text-[11px] font-semibold"
                  onClick={() => setCurrentPage('pricing')}
                >
                  Upgrade
                </Button>
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center justify-center w-full py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors" onClick={() => setCurrentPage('pricing')}>
                    <Crown className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Passer à Pro</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* User Profile */}
          <div className="px-3 pb-3">
            <div
              className={cn(
                'flex items-center gap-3',
                sidebarCollapsed && 'justify-center'
              )}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Utilisateur'}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold capitalize">
                    Plan {user?.plan || 'gratuit'}
                  </p>
                </div>
              )}
              {!sidebarCollapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={logout}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Déconnexion</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 z-10 flex items-center justify-center w-6 h-6 rounded-full border bg-white shadow-sm text-gray-400 hover:text-gray-600 hover:shadow transition-colors"
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
