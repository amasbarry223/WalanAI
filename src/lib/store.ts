'use client'

import { create } from 'zustand'

export type AdminPageName =
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-content'
  | 'admin-exams'
  | 'admin-subscriptions'
  | 'admin-analytics'
  | 'admin-support'
  | 'admin-settings'
  | 'admin-audit'

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

interface User {
  name: string
  email: string
  plan: 'gratuit' | 'pro'
  role: 'etudiant' | 'admin' | 'super-admin'
  avatar?: string
}

interface AppState {
  currentPage: PageName
  isAuthenticated: boolean
  user: User | null
  sidebarCollapsed: boolean
  darkMode: boolean
  isAdminMode: boolean
  currentAdminPage: AdminPageName

  setCurrentPage: (page: PageName) => void
  login: (user: User) => void
  logout: () => void
  toggleSidebar: () => void
  setDarkMode: (dark: boolean) => void
  enterAdminMode: () => void
  exitAdminMode: () => void
  setCurrentAdminPage: (page: AdminPageName) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'landing',
  isAuthenticated: false,
  user: null,
  sidebarCollapsed: false,
  darkMode: false,
  isAdminMode: false,
  currentAdminPage: 'admin-dashboard',

  setCurrentPage: (page) => set({ currentPage: page }),

  login: (user) =>
    set({
      isAuthenticated: true,
      user,
      currentPage: 'onboarding',
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      currentPage: 'landing',
      isAdminMode: false,
    }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setDarkMode: (dark) => set({ darkMode: dark }),

  enterAdminMode: () =>
    set({ isAdminMode: true, currentAdminPage: 'admin-dashboard' }),

  exitAdminMode: () =>
    set({ isAdminMode: false }),

  setCurrentAdminPage: (page) =>
    set({ currentAdminPage: page }),
}))
