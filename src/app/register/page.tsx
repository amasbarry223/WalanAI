'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import RegisterPage from '@/components/walanai/RegisterPage'

export default function RegisterRoutePage() {
  const router = useRouter()
  const { setCurrentPage, isAuthenticated, onboardingCompleted } = useAppStore()

  useEffect(() => {
    setCurrentPage('register')
  }, [setCurrentPage])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(onboardingCompleted ? '/' : '/')
      setCurrentPage(onboardingCompleted ? 'dashboard' : 'onboarding')
    }
  }, [isAuthenticated, onboardingCompleted, router, setCurrentPage])

  return (
    <div className="min-h-screen h-full">
      <RegisterPage />
    </div>
  )
}
