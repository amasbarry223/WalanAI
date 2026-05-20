'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  GraduationCap,
  Check,
  X,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

// ─── Password Strength Meter ─────────────────────────────────

function getPasswordStrength(password: string) {
  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  Object.values(checks).forEach((v) => { if (v) score++ })

  let label = 'Très faible'
  let color = 'bg-red-500'
  let textColor = 'text-red-500'

  if (score >= 5) { label = 'Excellent'; color = 'bg-emerald-500'; textColor = 'text-emerald-500' }
  else if (score >= 4) { label = 'Fort'; color = 'bg-emerald-400'; textColor = 'text-emerald-400' }
  else if (score >= 3) { label = 'Moyen'; color = 'bg-amber-400'; textColor = 'text-amber-400' }
  else if (score >= 2) { label = 'Faible'; color = 'bg-orange-400'; textColor = 'text-orange-400' }

  return { score, label, color, textColor, checks }
}

// ─── Google Icon ──────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

// ─── Validation Check Item ────────────────────────────────────

function ValidationCheck({ valid, label }: { valid: boolean; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      {valid ? (
        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 text-gray-300 shrink-0" />
      )}
      <span className={`text-xs ${valid ? 'text-emerald-600' : 'text-gray-400'}`}>{label}</span>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────

export default function RegisterPage() {
  const { login, setCurrentPage } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const strength = getPasswordStrength(password)

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}

    if (!name.trim()) {
      errors.name = 'Le nom est requis.'
    } else if (name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères.'
    }

    if (!email.trim()) {
      errors.email = "L'email est requis."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Veuillez entrer un email valide."
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis.'
    } else if (password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas.'
    }

    if (!acceptTerms) {
      errors.terms = "Vous devez accepter les conditions d'utilisation."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [name, email, password, confirmPassword, acceptTerms])

  const handleSubmit = async () => {
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 1000))

    // Frontend-only: simulate registration with form data
    login({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      plan: 'gratuit',
    })

    setIsLoading(false)
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
        <span className="text-2xl font-bold text-gray-900 tracking-tight">ScolarAI</span>
      </motion.div>

      {/* Back to landing */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setCurrentPage('landing')}
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
              <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
              <p className="text-sm text-gray-500">Commencez gratuitement, sans carte bancaire</p>
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
              {/* Full name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: '' })) }}
                    className={`pl-10 h-11 bg-gray-50/50 ${
                      fieldErrors.name ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
              </div>

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
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })) }}
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

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${strength.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(strength.score / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${strength.textColor}`}>{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <ValidationCheck valid={strength.checks.length} label="8 caractères minimum" />
                      <ValidationCheck valid={strength.checks.uppercase} label="1 majuscule" />
                      <ValidationCheck valid={strength.checks.lowercase} label="1 minuscule" />
                      <ValidationCheck valid={strength.checks.number} label="1 chiffre" />
                      <ValidationCheck valid={strength.checks.special} label="1 caractère spécial" />
                    </div>
                  </motion.div>
                )}

                {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Retapez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: '' })) }}
                    className={`pl-10 pr-10 h-11 bg-gray-50/50 ${
                      fieldErrors.confirmPassword ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs text-emerald-600">Les mots de passe correspondent</span>
                  </motion.div>
                )}
                {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
              </div>

              {/* Terms checkbox */}
              <div className="space-y-1">
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => { setAcceptTerms(checked === true); setFieldErrors((p) => ({ ...p, terms: '' })) }}
                    className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-500 leading-snug cursor-pointer">
                    J&apos;accepte les{' '}
                    <button type="button" className="text-emerald-500 font-medium hover:text-emerald-600 transition-colors">CGU</button>{' '}
                    et la{' '}
                    <button type="button" className="text-emerald-500 font-medium hover:text-emerald-600 transition-colors">Politique de confidentialité</button>
                  </label>
                </div>
                {fieldErrors.terms && <p className="text-xs text-red-500 ml-7">{fieldErrors.terms}</p>}
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
                    Création en cours...
                  </>
                ) : (
                  <>
                    Créer mon compte
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
            >
              <GoogleIcon />
              Continuer avec Google
            </Button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => setCurrentPage('login')}
                className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                Se connecter
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
        © 2025 ScolarAI. Tous droits réservés.
      </motion.p>
    </div>
  )
}
