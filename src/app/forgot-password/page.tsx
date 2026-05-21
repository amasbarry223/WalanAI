'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import ForgotPasswordPage from '@/components/walanai/ForgotPasswordPage'

export default function ForgotPasswordRoutePage() {
  const router = useRouter()
  const { setCurrentPage, isAuthenticated, onboardingCompleted } = useAppStore()

  useEffect(() => {
    setCurrentPage('forgot-password')
  }, [setCurrentPage])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
      setCurrentPage(onboardingCompleted ? 'dashboard' : 'onboarding')
    }
  }, [isAuthenticated, onboardingCompleted, router, setCurrentPage])

  return (
    <div className="min-h-screen h-full">
      <ForgotPasswordPage />
    </div>
  )
}
