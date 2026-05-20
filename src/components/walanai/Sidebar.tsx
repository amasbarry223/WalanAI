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
  Layers,
  ClipboardCheck,
  Sparkles,
  UsersRound,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

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
    label: 'Carnets de notes',
    page: 'notes',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: 'Assistant IA',
    page: 'assistant',
    icon: <Bot className="h-4 w-4" />,
    section: 'INTELLIGENCE IA',
  },
  {
    label: 'Coach IA',
    page: 'study-coach',
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    label: 'Révision',
    page: 'revision',
    icon: <Brain className="h-4 w-4" />,
    section: 'APPRENTISSAGE',
  },
  {
    label: 'Flashcards',
    page: 'flashcard-deck',
    icon: <Layers className="h-4 w-4" />,
  },
  {
    label: 'Générateur de Quiz',
    page: 'quiz-generator',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    label: 'Ressources',
    page: 'resources',
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    label: 'Pomodoro',
    page: 'pomodoro',
    icon: <Timer className="h-4 w-4" />,
    section: 'ORGANISATION',
  },
  {
    label: 'Planificateur',
    page: 'planner',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    label: 'Suivi des Examens',
    page: 'exam-tracker',
    icon: <ClipboardCheck className="h-4 w-4" />,
  },
  {
    label: "Groupes d\u2019Étude",
    page: 'study-groups',
    icon: <UsersRound className="h-4 w-4" />,
  },
  {
    label: 'Ma Progression',
    page: 'progress',
    icon: <TrendingUp className="h-4 w-4" />,
    section: 'PERFORMANCE',
  },
  {
    label: 'Historique Quiz',
    page: 'quiz-history',
    icon: <History className="h-4 w-4" />,
  },
  {
    label: 'Classement',
    page: 'leaderboard',
    icon: <Trophy className="h-4 w-4" />,
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

// ─── Shared navigation content (used in both desktop sidebar and mobile sheet) ──

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate?: () => void
}) {
  const { currentPage, setCurrentPage, user, logout } = useAppStore()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  const handleNav = (page: PageName) => {
    setCurrentPage(page)
    onNavigate?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 shrink-0">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-gray-900 whitespace-nowrap">
            WalanAI
          </span>
        )}
      </div>

      {/* Navigation - scrollable */}
      <ScrollArea className="flex-1 py-3 px-3">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <div key={item.page}>
              {item.section && !collapsed && (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1.5 first:pt-0">
                  {item.section}
                </p>
              )}
              {item.section && collapsed && (
                <Separator className="my-2" />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNav(item.page)}
                    className={cn(
                      'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      currentPage === item.page
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      collapsed && 'justify-center px-2'
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

      {/* Bottom section - fixed */}
      <div className="shrink-0 border-t bg-white">
        {/* Pro Upgrade */}
        <div className="px-3 pt-3 pb-2">
          {!collapsed ? (
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
                onClick={() => handleNav('pricing')}
              >
                Upgrade
              </Button>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center w-full py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors" onClick={() => handleNav('pricing')}>
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
              collapsed && 'justify-center'
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Utilisateur'}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold capitalize">
                  Plan {user?.plan || 'gratuit'}
                </p>
              </div>
            )}
            {!collapsed && (
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
    </div>
  )
}

// ─── Desktop Sidebar ─────────────────────────────────────────

function DesktopSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r bg-white transition-all duration-300 ease-in-out h-full overflow-hidden relative',
        sidebarCollapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      <SidebarContent collapsed={sidebarCollapsed} />
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
  )
}

// ─── Mobile Sidebar (Sheet/Drawer) ───────────────────────────

function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Menu de navigation WalanAI</SheetDescription>
        </SheetHeader>
        <SidebarContent collapsed={false} onNavigate={onClose} />
      </SheetContent>
    </Sheet>
  )
}

// ─── Mobile Top Header ───────────────────────────────────────

function MobileHeader({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const { currentPage, user } = useAppStore()

  const pageTitle: Record<PageName, string> = {
    'landing': 'WalanAI',
    'login': 'Connexion',
    'register': 'Créer un compte',
    'forgot-password': 'Mot de passe oublié',
    'onboarding': 'Bienvenue',
    'dashboard': 'Tableau de bord',
    'documents': 'Mes Documents',
    'assistant': 'Assistant IA',
    'revision': 'Révision',
    'progress': 'Ma Progression',
    'quiz-history': 'Historique Quiz',
    'quiz-generator': 'Générateur de Quiz',
    'settings': 'Paramètres',
    'help': "Centre d'aide",
    'pomodoro': 'Pomodoro',
    'planner': 'Planificateur',
    'leaderboard': 'Classement',
    'notes': 'Carnets de notes',
    'pricing': 'Tarifs',
    'resources': 'Ressources',
    'exam-tracker': 'Suivi des Examens',
    'flashcard-deck': 'Flashcards',
    'study-coach': 'Coach IA',
    'study-groups': "Groupes d'Étude",
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b">
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <h1 className="text-sm font-semibold text-gray-900">
        {pageTitle[currentPage] || 'WalanAI'}
      </h1>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}

// ─── Exported Sidebar Component ───────────────────────────────

export default function Sidebar() {
  // This component now only renders the desktop sidebar
  // The mobile sidebar is handled by AppLayout
  return (
    <TooltipProvider delayDuration={0}>
      <DesktopSidebar />
    </TooltipProvider>
  )
}

export { MobileSidebar, MobileHeader }
