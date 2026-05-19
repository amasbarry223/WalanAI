'use client'

import { useAppStore } from '@/lib/store'
import Sidebar from './Sidebar'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
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

export default function AppLayout() {
  const { currentPage, isAuthenticated } = useAppStore()

  // Auth pages (no sidebar)
  if (!isAuthenticated || currentPage === 'login') {
    return <LoginPage />
  }

  if (currentPage === 'register') {
    return <RegisterPage />
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
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}
