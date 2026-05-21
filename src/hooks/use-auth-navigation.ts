'use client'

import { useRouter } from 'next/navigation'
import { useAppStore, type PageName } from '@/lib/store'

type AuthPage = 'login' | 'register' | 'forgot-password' | 'landing'

const PAGE_TO_PATH: Record<AuthPage, string> = {
  login: '/login',
  register: '/register',
  'forgot-password': '/forgot-password',
  landing: '/',
}

export function useAuthNavigation() {
  const router = useRouter()
  const setCurrentPage = useAppStore((s) => s.setCurrentPage)

  const goTo = (page: AuthPage) => {
    setCurrentPage(page as PageName)
    router.push(PAGE_TO_PATH[page])
  }

  return { goTo }
}
