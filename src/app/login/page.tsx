'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import LoginPage from '@/components/walanai/LoginPage'

export default function LoginRoutePage() {
  const router = useRouter()
  const { setCurrentPage, isAuthenticated, onboardingCompleted } = useAppStore()

  useEffect(() => {
    setCurrentPage('login')
  }, [setCurrentPage])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
      setCurrentPage(onboardingCompleted ? 'dashboard' : 'onboarding')
    }
  }, [isAuthenticated, onboardingCompleted, router, setCurrentPage])

  return (
    <div className="min-h-screen h-full">
      <LoginPage />
    </div>
  )
}
