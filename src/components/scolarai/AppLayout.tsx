'use client'

import { useAppStore } from '@/lib/store'
import Sidebar from './Sidebar'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import DashboardPage from './DashboardPage'
import DocumentsPage from './DocumentsPage'
import AIAssistantPage from './AIAssistantPage'
import RevisionPage from './RevisionPage'
import ProgressPage from './ProgressPage'
import QuizHistoryPage from './QuizHistoryPage'
import SettingsPage from './SettingsPage'
import HelpCenterPage from './HelpCenterPage'

export default function AppLayout() {
  const { currentPage, isAuthenticated } = useAppStore()

  // Auth pages (no sidebar)
  if (!isAuthenticated || currentPage === 'login') {
    return <LoginPage />
  }

  if (currentPage === 'register') {
    return <RegisterPage />
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
      case 'settings':
        return <SettingsPage />
      case 'help':
        return <HelpCenterPage />
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
