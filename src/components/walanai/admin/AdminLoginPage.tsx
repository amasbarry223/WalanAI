'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Shield,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { authenticateUser } from '@/lib/local-auth'
import { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminLoginPage() {
  const { login, enterAdminMode, setCurrentPage } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = "L'email est requis."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Veuillez entrer un email valide.'
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis.'
    } else if (password.length < 4) {
      errors.password = 'Le mot de passe doit contenir au moins 4 caractères.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [email, password])

  const handleSubmit = async () => {
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800))

    const result = authenticateUser(email, password)
    if (!result.ok) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    if (result.user.role !== 'admin' && result.user.role !== 'super-admin') {
      setError(`Accès réservé aux administrateurs. Utilisez ${SUPER_ADMIN_EMAIL}.`)
      setIsLoading(false)
      return
    }

    login(result.user, { onboardingCompleted: true })

    // Auto-enter admin mode after login
    setTimeout(() => {
      enterAdminMode()
    }, 100)

    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-900 px-4 py-8 overflow-y-auto relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -translate-y-48 translate-x-48" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full translate-y-36 -translate-x-36" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/3 rounded-full" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-2 relative z-10"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
          <GraduationCap className="h-7 w-7 text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">WalanAI</span>
      </motion.div>

      {/* Admin badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-1.5 mb-6 relative z-10"
      >
        <Shield className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Back-Office Admin</span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-slate-700/50 bg-slate-800/80 backdrop-blur-sm shadow-2xl shadow-black/30">
          <CardContent className="space-y-5 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold text-white">Administration</h1>
              <p className="text-sm text-slate-400">Connectez-vous pour gérer la plateforme</p>
            </div>

            {/* Global Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Email administrateur</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="barry@walanai.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                    onKeyDown={handleKeyDown}
                    className={`pl-10 h-11 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 ${
                      fieldErrors.email ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
                    onKeyDown={handleKeyDown}
                    className={`pl-10 pr-10 h-11 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 ${
                      fieldErrors.password ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20' : ''
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Accéder au back-office
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>

            {/* Hint */}
            <div className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/30 space-y-1">
              <p className="text-xs text-slate-400 text-center">
                <Shield className="h-3 w-3 inline mr-1 text-amber-400" />
                Accès réservé aux administrateurs de la plateforme
              </p>
              <p className="text-[11px] text-slate-500 text-center font-mono">
                {SUPER_ADMIN_EMAIL} · mot de passe : {SUPER_ADMIN_PASSWORD}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Back link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => { setCurrentPage('landing'); window.location.href = '/' }}
        className="mt-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer relative z-10"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour à WalanAI
      </motion.button>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-4 text-xs text-slate-600 relative z-10"
      >
        &copy; 2025 WalanAI. Tous droits réservés.
      </motion.p>
    </div>
  )
}
