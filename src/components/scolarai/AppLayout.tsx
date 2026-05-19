'use client'

import { useAppStore } from '@/lib/store'
import { useState, useSyncExternalStore } from 'react'
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
import StudyGroupsPage from './StudyGroupsPage'
import StudyCoachPage from './StudyCoachPage'
import ExamTrackerPage from './ExamTrackerPage'
import FlashcardDeckPage from './FlashcardDeckPage'

const emptySubscribe = () => () => {}

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export default function AppLayout() {
  const { currentPage, isAuthenticated } = useAppStore()
  const mounted = useHydrated()

  // Prevent hydration mismatch by not rendering until client-side mounted
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

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
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}
