'use client'

import { create } from 'zustand'

export type PageName =
  | 'login'
  | 'register'
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
  avatar?: string
}

interface AppState {
  currentPage: PageName
  isAuthenticated: boolean
  user: User | null
  sidebarCollapsed: boolean
  darkMode: boolean

  setCurrentPage: (page: PageName) => void
  login: (user: User) => void
  logout: () => void
  toggleSidebar: () => void
  setDarkMode: (dark: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'login',
  isAuthenticated: false,
  user: null,
  sidebarCollapsed: false,
  darkMode: false,

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
      currentPage: 'login',
    }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setDarkMode: (dark) => set({ darkMode: dark }),
}))
