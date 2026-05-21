'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { syncUserUsageFromApp, touchUserActivity } from '@/lib/admin-store'
import { markOnboardingCompleted, updateAccountProfile } from '@/lib/local-auth'

export type AdminPageName =
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-content'
  | 'admin-exams'
  | 'admin-subscriptions'
  | 'admin-analytics'
  | 'admin-support'
  | 'admin-settings'

export type PageName =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'onboarding'
  | 'dashboard'
  | 'documents'
  | 'assistant'
  | 'revision'
  | 'progress'
  | 'quiz-history'
  | 'quiz-generator'
  | 'settings'
  | 'help'
  | 'pomodoro'
  | 'planner'
  | 'leaderboard'
  | 'notes'
  | 'pricing'
  | 'resources'
  | 'exam-tracker'
  | 'flashcard-deck'
  | 'study-coach'
  | 'study-groups'

export interface User {
  name: string
  email: string
  plan: 'gratuit' | 'pro'
  role: 'etudiant' | 'admin' | 'super-admin'
  avatar?: string
}

export interface StoredDocument {
  id: string
  title: string
  subject: string
  date: string
  flashcards: number
  type: string
  favorite: boolean
  archived: boolean
  color: string
  fileName?: string
  sizeLabel?: string
}

export interface QuizHistoryEntry {
  id: string
  title: string
  subject: string
  score: number
  totalQuestions: number
  correctAnswers: number
  date: string
  duration: string
  type: 'qcm' | 'vrai-faux' | 'ouvert'
}

export interface UserSettings {
  notifications: boolean
  emailNotif: boolean
  darkMode: boolean
  language: string
}

const DEFAULT_DOCUMENTS: StoredDocument[] = [
  { id: '1', title: 'Introduction au Droit Civil', subject: 'Droit', date: '15 Mai 2026', flashcards: 24, type: 'PDF', favorite: true, archived: false, color: 'bg-red-500' },
  { id: '2', title: 'Microéconomie - Chapitre 3', subject: 'Économie', date: '12 Mai 2026', flashcards: 18, type: 'DOC', favorite: false, archived: false, color: 'bg-blue-500' },
  { id: '3', title: 'Algorithmes et Structures de Données', subject: 'Informatique', date: '10 Mai 2026', flashcards: 32, type: 'PDF', favorite: true, archived: false, color: 'bg-red-500' },
  { id: '4', title: 'Histoire de la Révolution Française', subject: 'Histoire', date: '8 Mai 2026', flashcards: 15, type: 'PPT', favorite: false, archived: false, color: 'bg-orange-500' },
  { id: '5', title: 'Statistiques Descriptives', subject: 'Mathématiques', date: '5 Mai 2026', flashcards: 20, type: 'PDF', favorite: false, archived: true, color: 'bg-red-500' },
  { id: '6', title: 'Comptabilité Générale', subject: 'Gestion', date: '1 Mai 2026', flashcards: 12, type: 'XLS', favorite: true, archived: false, color: 'bg-green-600' },
]

interface AppState {
  currentPage: PageName
  isAuthenticated: boolean
  user: User | null
  onboardingCompleted: boolean
  sidebarCollapsed: boolean
  isAdminMode: boolean
  currentAdminPage: AdminPageName
  documents: StoredDocument[]
  quizHistory: QuizHistoryEntry[]
  userSettings: UserSettings

  setCurrentPage: (page: PageName) => void
  login: (user: User, options?: { onboardingCompleted?: boolean }) => void
  logout: () => void
  toggleSidebar: () => void
  enterAdminMode: () => void
  exitAdminMode: () => void
  setCurrentAdminPage: (page: AdminPageName) => void
  updateUserPlan: (plan: 'gratuit' | 'pro') => void
  completeOnboarding: () => void
  updateProfile: (name: string) => void
  updateUserSettings: (settings: Partial<UserSettings>) => void
  addDocument: (doc: Omit<StoredDocument, 'id'>) => void
  toggleDocumentFavorite: (id: string) => void
  addQuizResult: (entry: Omit<QuizHistoryEntry, 'id' | 'date'>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'landing',
      isAuthenticated: false,
      user: null,
      onboardingCompleted: false,
      sidebarCollapsed: false,
      isAdminMode: false,
      currentAdminPage: 'admin-dashboard',
      documents: DEFAULT_DOCUMENTS,
      quizHistory: [],
      userSettings: {
        notifications: true,
        emailNotif: true,
        darkMode: false,
        language: 'fr',
      },

      setCurrentPage: (page) => set({ currentPage: page }),

      login: (user, options) => {
        const onboardingCompleted = options?.onboardingCompleted ?? false
        touchUserActivity(user.email)
        set({
          isAuthenticated: true,
          user,
          onboardingCompleted,
          currentPage: onboardingCompleted ? 'dashboard' : 'onboarding',
        })
      },

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          currentPage: 'landing',
          isAdminMode: false,
          onboardingCompleted: false,
        }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      enterAdminMode: () =>
        set({ isAdminMode: true, currentAdminPage: 'admin-dashboard' }),

      exitAdminMode: () =>
        set({ isAdminMode: false }),

      setCurrentAdminPage: (page) =>
        set({ currentAdminPage: page }),

      updateUserPlan: (plan) => {
        const user = get().user
        if (!user) return
        updateAccountProfile(user.email, { plan })
        set({ user: { ...user, plan } })
      },

      completeOnboarding: () => {
        const user = get().user
        if (user) markOnboardingCompleted(user.email)
        set({ onboardingCompleted: true, currentPage: 'dashboard' })
      },

      updateProfile: (name) => {
        const user = get().user
        if (!user) return
        updateAccountProfile(user.email, { name })
        set({ user: { ...user, name } })
      },

      updateUserSettings: (settings) =>
        set((state) => ({
          userSettings: { ...state.userSettings, ...settings },
        })),

      addDocument: (doc) =>
        set((state) => {
          const documents = [
            { ...doc, id: `doc-${Date.now()}` },
            ...state.documents,
          ]
          if (state.user) {
            const flashcards = documents.reduce((s, d) => s + d.flashcards, 0)
            syncUserUsageFromApp(state.user.email, {
              documents: documents.length,
              quizzes: state.quizHistory.length,
              flashcards,
            })
          }
          return { documents }
        }),

      toggleDocumentFavorite: (id) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, favorite: !d.favorite } : d
          ),
        })),

      addQuizResult: (entry) => {
        const date = new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        set((state) => {
          const quizHistory = [
            { ...entry, id: `quiz-${Date.now()}`, date },
            ...state.quizHistory,
          ]
          if (state.user) {
            const flashcards = state.documents.reduce((s, d) => s + d.flashcards, 0)
            const avg =
              quizHistory.length > 0
                ? Math.round(
                    quizHistory.reduce((s, q) => s + q.score, 0) / quizHistory.length
                  )
                : 0
            syncUserUsageFromApp(state.user.email, {
              documents: state.documents.length,
              quizzes: quizHistory.length,
              flashcards,
            })
            touchUserActivity(state.user.email, { score: avg })
          }
          return { quizHistory }
        })
      },
    }),
    {
      name: 'walanai-app',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted,
        documents: state.documents,
        quizHistory: state.quizHistory,
        userSettings: state.userSettings,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (state.isAuthenticated && state.user) {
          state.currentPage = state.onboardingCompleted ? 'dashboard' : 'onboarding'
          const flashcards = (state.documents ?? []).reduce(
            (s, d) => s + d.flashcards,
            0
          )
          syncUserUsageFromApp(state.user.email, {
            documents: state.documents?.length ?? 0,
            quizzes: state.quizHistory?.length ?? 0,
            flashcards,
          })
        } else {
          state.currentPage = 'landing'
        }
        if (!state.documents?.length) {
          state.documents = DEFAULT_DOCUMENTS
        }
      },
    }
  )
)
