'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { authenticateUser } from '@/lib/local-auth'
import { useAuthNavigation } from '@/hooks/use-auth-navigation'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// ─── Google Icon ──────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

// ─── Main Component ───────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppStore()
  const { goTo } = useAuthNavigation()
  const { toast } = useToast()
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
      errors.email = "Veuillez entrer un email valide."
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [email, password])

  const handleSubmit = async () => {
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    const result = authenticateUser(email, password)
    if (!result.ok) {
      setError(
        result.error.includes('Aucun compte')
          ? `${result.error} Utilisez « Créer un compte » ci-dessous.`
          : result.error
      )
      setIsLoading(false)
      return
    }

    login(result.user, { onboardingCompleted: result.onboardingCompleted })
    router.replace('/')
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-8 overflow-y-auto">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-200/50">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">WalanAI</span>
      </motion.div>

      {/* Back to landing */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => goTo('landing')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour à l&apos;accueil
      </motion.button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="border-gray-200/80 shadow-lg shadow-gray-200/50">
          <CardContent className="space-y-5 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold text-gray-900">Bon retour !</h1>
              <p className="text-sm text-gray-500">Connectez-vous pour continuer vos révisions</p>
            </div>

            {/* Global Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="vous@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })) }}
                    onKeyDown={handleKeyDown}
                    className={`pl-10 h-11 bg-gray-50/50 ${
                      fieldErrors.email ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
                    onKeyDown={handleKeyDown}
                    className={`pl-10 pr-10 h-11 bg-gray-50/50 ${
                      fieldErrors.password ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => goTo('forgot-password')}
                  className="text-sm font-medium text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 font-medium">OU</span>
              </div>
            </div>

            {/* Google button */}
            <Button
              variant="outline"
              className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm cursor-pointer"
              disabled={isLoading}
              onClick={() => toast({ title: 'La connexion avec Google sera bientôt disponible' })}
            >
              <GoogleIcon />
              Continuer avec Google
            </Button>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => goTo('register')}
                className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                Créer un compte
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-xs text-gray-400"
      >
        © 2025 WalanAI. Tous droits réservés.
      </motion.p>
    </div>
  )
}
