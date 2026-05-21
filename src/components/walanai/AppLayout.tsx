'use client'

import { getAdminSettings, isMaintenanceMode } from '@/lib/admin-store'
import { useAppStore } from '@/lib/store'
import { useState, useEffect } from 'react'
import { useHydrated } from '@/hooks/use-hydrated'
import Sidebar, { MobileSidebar, MobileHeader } from './Sidebar'
import LandingPage from './LandingPage'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import OnboardingPage from './OnboardingPage'
import DashboardPage from './DashboardPage'
import DocumentsPage from './DocumentsPage'
import AIAssistantPage from './AIAssistantPage'
import RevisionPage from './RevisionPage'
import ProgressPage from './ProgressPage'
import QuizHistoryPage from './QuizHistoryPage'
import SettingsPage from './SettingsPage'
import HelpCenterPage from './HelpCenterPage'
import PlannerPage from './PlannerPage'
import PomodoroPage from './PomodoroPage'
import LeaderboardPage from './LeaderboardPage'
import NotesPage from './NotesPage'
import QuizGeneratorPage from './QuizGeneratorPage'
import ResourcesPage from './ResourcesPage'
import PricingPage from './PricingPage'
import StudyGroupsPage from './StudyGroupsPage'
import StudyCoachPage from './StudyCoachPage'
import ExamTrackerPage from './ExamTrackerPage'
import FlashcardDeckPage from './FlashcardDeckPage'

export default function AppLayout() {
  const { currentPage, isAuthenticated, isAdminMode, exitAdminMode } = useAppStore()
  const mounted = useHydrated()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // When the main page (/) is rendered, exit admin mode if still active
  useEffect(() => {
    if (mounted && isAdminMode) {
      exitAdminMode()
    }
  }, [mounted, isAdminMode, exitAdminMode])

  // Prevent hydration mismatch by not rendering until client-side mounted
  if (!mounted) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  if (isMaintenanceMode()) {
    const settings = getAdminSettings()
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
        <div className="max-w-md text-center text-white space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold">
            !
          </div>
          <h1 className="text-xl font-bold">Maintenance en cours</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {settings.maintenanceMessage}
          </p>
          <p className="text-xs text-slate-500">
            Le back-office reste accessible sur /admin
          </p>
        </div>
      </div>
    )
  }

  // Landing page (no sidebar, no auth required)
  if (currentPage === 'landing') {
    return <LandingPage />
  }

  // Auth pages (no sidebar) — avant la garde login générique
  if (currentPage === 'register') {
    return <RegisterPage />
  }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage />
  }

  if (!isAuthenticated || currentPage === 'login') {
    return <LoginPage />
  }

  if (currentPage === 'onboarding') {
    return <OnboardingPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'documents':
        return <DocumentsPage />
      case 'assistant':
        return <AIAssistantPage />
      case 'revision':
        return <RevisionPage />
      case 'progress':
        return <ProgressPage />
      case 'quiz-history':
        return <QuizHistoryPage />
      case 'quiz-generator':
        return <QuizGeneratorPage />
      case 'settings':
        return <SettingsPage />
      case 'help':
        return <HelpCenterPage />
      case 'planner':
        return <PlannerPage />
      case 'pomodoro':
        return <PomodoroPage />
      case 'leaderboard':
        return <LeaderboardPage />
      case 'notes':
        return <NotesPage />
      case 'resources':
        return <ResourcesPage />
      case 'pricing':
        return <PricingPage />
      case 'study-groups':
        return <StudyGroupsPage />
      case 'flashcard-deck':
        return <FlashcardDeckPage />
      case 'exam-tracker':
        return <ExamTrackerPage />
      case 'study-coach':
        return <StudyCoachPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-full bg-gray-50/50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar (Sheet Drawer) */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main area with mobile header */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header - only shows on small screens */}
        <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
