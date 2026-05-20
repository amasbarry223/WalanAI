'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  Loader2,
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const { setCurrentPage } = useAppStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [emailSent, setEmailSent] = useState(false)

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = "L'email est requis."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Veuillez entrer un email valide.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [email])

  const handleSubmit = async () => {
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 1000))

    // Frontend-only: simulate email sent
    setEmailSent(true)
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
        <span className="text-2xl font-bold text-gray-900 tracking-tight">ScolarAI</span>
      </motion.div>

      {/* Back to login */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setCurrentPage('login')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour à la connexion
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
            <AnimatePresence mode="wait">
              {emailSent ? (
                /* ── Success State ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Success Icon */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </motion.div>
                  </div>

                  {/* Header */}
                  <div className="text-center space-y-1.5">
                    <h1 className="text-2xl font-bold text-gray-900">Email envoyé !</h1>
                    <p className="text-sm text-gray-500">
                      Si un compte existe avec l&apos;adresse <span className="font-semibold text-gray-700">{email}</span>, vous recevrez un lien pour réinitialiser votre mot de passe.
                    </p>
                  </div>

                  {/* Info box */}
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs text-amber-700 leading-relaxed">
                      <strong>Attention :</strong> Vérifiez également votre dossier de spam ou courrier indésirable. Le lien expirera dans 15 minutes.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => setCurrentPage('login')}
                      className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200/50 cursor-pointer"
                    >
                      Retour à la connexion
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>

                    <button
                      type="button"
                      onClick={() => { setEmailSent(false); setEmail('') }}
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      Je n&apos;ai pas reçu l&apos;email, renvoyer
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── Form State ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                      <KeyRound className="h-7 w-7 text-emerald-500" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="text-center space-y-1.5">
                    <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
                    <p className="text-sm text-gray-500">
                      Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
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
                      <label className="text-sm font-medium text-gray-700">Adresse email</label>
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
                          autoFocus
                        />
                      </div>
                      {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
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
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer le lien
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Register link */}
                  <p className="text-center text-sm text-gray-500">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setCurrentPage('register')}
                      className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      Créer un compte
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
