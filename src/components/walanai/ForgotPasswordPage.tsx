'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
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
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type Step = 'email' | 'code' | 'password' | 'success'

// ─── Simulated verification code ──────────────────────────────
const SIMULATED_CODE = '847291'

export default function ForgotPasswordPage() {
  const { setCurrentPage } = useAppStore()
  const { toast } = useToast()

  // Step management
  const [step, setStep] = useState<Step>('email')

  // Email step
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  // Code step
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [codeError, setCodeError] = useState('')
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const codeInputs = useRef<(HTMLInputElement | null)[]>([])

  // Password step
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isResetting, setIsResetting] = useState(false)

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // ─── Email Validation ────────────────────────────────────────

  const validateEmail = useCallback((): boolean => {
    if (!email.trim()) {
      setEmailError("L'email est requis.")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Veuillez entrer un email valide.')
      return false
    }
    setEmailError('')
    return true
  }, [email])

  const handleSendEmail = async () => {
    if (!validateEmail()) return

    setIsSendingEmail(true)
    await new Promise((r) => setTimeout(r, 1200))

    setStep('code')
    setIsSendingEmail(false)
    setResendCooldown(30)

    toast({
      title: 'Code envoyé',
      description: `Un code de vérification a été envoyé à ${email}`,
    })
  }

  // ─── Code Verification ───────────────────────────────────────

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste: fill all inputs from the pasted value
      const pasted = value.replace(/\D/g, '').slice(0, 6)
      const newCode = [...code]
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || ''
      }
      setCode(newCode)
      // Focus last filled or the next empty
      const nextIndex = Math.min(pasted.length, 5)
      codeInputs.current[nextIndex]?.focus()
      return
    }

    const digit = value.replace(/\D/g, '')
    const newCode = [...code]
    newCode[index] = digit
    setCode(newCode)
    setCodeError('')

    // Auto-advance to next input
    if (digit && index < 5) {
      codeInputs.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus()
    }
  }

  const handleVerifyCode = async () => {
    const fullCode = code.join('')
    if (fullCode.length < 6) {
      setCodeError('Veuillez entrer le code complet à 6 chiffres.')
      return
    }

    setIsVerifyingCode(true)
    await new Promise((r) => setTimeout(r, 1000))

    if (fullCode !== SIMULATED_CODE) {
      setCodeError('Code incorrect. Veuillez réessayer.')
      setIsVerifyingCode(false)
      return
    }

    setStep('password')
    setIsVerifyingCode(false)
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return
    setResendCooldown(30)
    setCode(['', '', '', '', '', ''])
    setCodeError('')

    toast({
      title: 'Code renvoyé',
      description: 'Un nouveau code de vérification a été envoyé.',
    })
  }

  // ─── Password Reset ──────────────────────────────────────────

  const validatePassword = useCallback((): boolean => {
    const errors: Record<string, string> = {}

    if (!newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis.'
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères.'
    } else if (!/[A-Z]/.test(newPassword)) {
      errors.newPassword = 'Le mot de passe doit contenir au moins une majuscule.'
    } else if (!/[0-9]/.test(newPassword)) {
      errors.newPassword = 'Le mot de passe doit contenir au moins un chiffre.'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'La confirmation est requise.'
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas.'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }, [newPassword, confirmPassword])

  const handleResetPassword = async () => {
    if (!validatePassword()) return

    setIsResetting(true)
    await new Promise((r) => setTimeout(r, 1200))

    setStep('success')
    setIsResetting(false)

    toast({
      title: 'Mot de passe modifié',
      description: 'Votre mot de passe a été réinitialisé avec succès.',
    })
  }

  // ─── Password Strength ───────────────────────────────────────

  const getPasswordStrength = (): { level: number; label: string; color: string } => {
    if (!newPassword) return { level: 0, label: '', color: '' }
    let score = 0
    if (newPassword.length >= 8) score++
    if (newPassword.length >= 12) score++
    if (/[A-Z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^A-Za-z0-9]/.test(newPassword)) score++

    if (score <= 1) return { level: 1, label: 'Faible', color: 'bg-red-500' }
    if (score <= 2) return { level: 2, label: 'Moyen', color: 'bg-amber-500' }
    if (score <= 3) return { level: 3, label: 'Bon', color: 'bg-emerald-400' }
    return { level: 4, label: 'Excellent', color: 'bg-emerald-600' }
  }

  const strength = getPasswordStrength()

  // ─── Step indicator ──────────────────────────────────────────

  const steps = [
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'code', label: 'Vérification', icon: ShieldCheck },
    { key: 'password', label: 'Nouveau mot de passe', icon: Lock },
  ] as const

  const currentStepIndex = steps.findIndex((s) => s.key === step)

  // ─── Render ──────────────────────────────────────────────────

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
              {/* ─── STEP: SUCCESS ──────────────────────────────── */}
              {step === 'success' ? (
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

                  <div className="text-center space-y-1.5">
                    <h1 className="text-2xl font-bold text-gray-900">Mot de passe modifié !</h1>
                    <p className="text-sm text-gray-500">
                      Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                    </p>
                  </div>

                  <Button
                    onClick={() => setCurrentPage('login')}
                    className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200/50 cursor-pointer"
                  >
                    Se connecter
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-steps"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Step indicator */}
                  <div className="flex items-center justify-center gap-2">
                    {steps.map((s, i) => {
                      const isCompleted = currentStepIndex > i
                      const isCurrent = currentStepIndex === i
                      return (
                        <div key={s.key} className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                              isCompleted
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                  ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500'
                                  : 'bg-gray-100 text-gray-400'
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              i + 1
                            )}
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={cn(
                                'w-8 h-0.5 rounded-full transition-colors',
                                isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                              )}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    {/* ─── STEP: EMAIL ─────────────────────────── */}
                    {step === 'email' && (
                      <motion.div
                        key="step-email"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Icon */}
                        <div className="flex justify-center">
                          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                            <KeyRound className="h-7 w-7 text-emerald-500" />
                          </div>
                        </div>

                        <div className="text-center space-y-1.5">
                          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
                          <p className="text-sm text-gray-500">
                            Entrez votre adresse email et nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.
                          </p>
                        </div>

                        {/* Email input */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Adresse email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="vous@email.com"
                              value={email}
                              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                              className={`pl-10 h-11 bg-gray-50/50 ${
                                emailError ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                              }`}
                              disabled={isSendingEmail}
                              autoFocus
                            />
                          </div>
                          {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                        </div>

                        {/* Submit */}
                        <Button
                          onClick={handleSendEmail}
                          disabled={isSendingEmail}
                          className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSendingEmail ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              Envoyer le code
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </Button>

                        {/* Info box */}
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                          <p className="text-xs text-blue-700 leading-relaxed">
                            <strong>Démo :</strong> Le code de vérification est <code className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-800 font-bold">{SIMULATED_CODE}</code>
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── STEP: CODE VERIFICATION ────────────── */}
                    {step === 'code' && (
                      <motion.div
                        key="step-code"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Icon */}
                        <div className="flex justify-center">
                          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                            <ShieldCheck className="h-7 w-7 text-emerald-500" />
                          </div>
                        </div>

                        <div className="text-center space-y-1.5">
                          <h1 className="text-2xl font-bold text-gray-900">Vérification</h1>
                          <p className="text-sm text-gray-500">
                            Entrez le code à 6 chiffres envoyé à <span className="font-semibold text-gray-700">{email}</span>
                          </p>
                        </div>

                        {/* Code inputs */}
                        <div className="flex justify-center gap-2">
                          {code.map((digit, i) => (
                            <Input
                              key={i}
                              ref={(el) => { codeInputs.current[i] = el }}
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={digit}
                              onChange={(e) => handleCodeChange(i, e.target.value)}
                              onKeyDown={(e) => handleCodeKeyDown(i, e)}
                              className={`w-11 h-12 text-center text-lg font-bold bg-gray-50/50 ${
                                codeError
                                  ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                                  : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                              }`}
                              disabled={isVerifyingCode}
                              autoFocus={i === 0}
                            />
                          ))}
                        </div>

                        {codeError && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{codeError}</p>
                          </div>
                        )}

                        {/* Verify */}
                        <Button
                          onClick={handleVerifyCode}
                          disabled={isVerifyingCode || code.some((d) => !d)}
                          className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isVerifyingCode ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Vérification...
                            </>
                          ) : (
                            <>
                              Vérifier le code
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </Button>

                        {/* Resend */}
                        <div className="text-center">
                          {resendCooldown > 0 ? (
                            <p className="text-sm text-gray-400">
                              Renvoyer le code dans <span className="font-semibold text-gray-600">{resendCooldown}s</span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendCode}
                              className="text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
                            >
                              Renvoyer le code
                            </button>
                          )}
                        </div>

                        {/* Back */}
                        <button
                          type="button"
                          onClick={() => { setStep('email'); setCode(['', '', '', '', '', '']); setCodeError('') }}
                          className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          Changer d&apos;adresse email
                        </button>
                      </motion.div>
                    )}

                    {/* ─── STEP: NEW PASSWORD ─────────────────── */}
                    {step === 'password' && (
                      <motion.div
                        key="step-password"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Icon */}
                        <div className="flex justify-center">
                          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                            <Lock className="h-7 w-7 text-emerald-500" />
                          </div>
                        </div>

                        <div className="text-center space-y-1.5">
                          <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
                          <p className="text-sm text-gray-500">
                            Choisissez un mot de passe sécurisé pour votre compte.
                          </p>
                        </div>

                        {/* New password */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder="Au moins 8 caractères"
                              value={newPassword}
                              onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors((p) => ({ ...p, newPassword: '' })) }}
                              className={`pl-10 pr-10 h-11 bg-gray-50/50 ${
                                passwordErrors.newPassword ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                              }`}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {passwordErrors.newPassword && <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>}

                          {/* Strength indicator */}
                          {newPassword && (
                            <div className="space-y-1.5">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                  <div
                                    key={level}
                                    className={cn(
                                      'h-1.5 flex-1 rounded-full transition-colors',
                                      strength.level >= level ? strength.color : 'bg-gray-200'
                                    )}
                                  />
                                ))}
                              </div>
                              <p className={cn(
                                'text-xs font-medium',
                                strength.level <= 1 ? 'text-red-500' : strength.level <= 2 ? 'text-amber-500' : 'text-emerald-500'
                              )}>
                                Force : {strength.label}
                              </p>
                            </div>
                          )}

                          {/* Requirements */}
                          <div className="grid grid-cols-1 gap-1">
                            {[
                              { label: 'Au moins 8 caractères', met: newPassword.length >= 8 },
                              { label: 'Une majuscule', met: /[A-Z]/.test(newPassword) },
                              { label: 'Un chiffre', met: /[0-9]/.test(newPassword) },
                              { label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(newPassword) },
                            ].map((req) => (
                              <div key={req.label} className="flex items-center gap-1.5">
                                <div className={cn(
                                  'w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors',
                                  req.met ? 'bg-emerald-500' : 'bg-gray-200'
                                )}>
                                  {req.met && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                                </div>
                                <span className={cn('text-[11px]', req.met ? 'text-emerald-600 font-medium' : 'text-gray-400')}>
                                  {req.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirmez votre mot de passe"
                              value={confirmPassword}
                              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors((p) => ({ ...p, confirmPassword: '' })) }}
                              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                              className={`pl-10 pr-10 h-11 bg-gray-50/50 ${
                                passwordErrors.confirmPassword ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20' : confirmPassword && newPassword === confirmPassword ? 'border-emerald-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20' : 'border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && <p className="text-xs text-red-500">{passwordErrors.confirmPassword}</p>}
                          {confirmPassword && newPassword === confirmPassword && !passwordErrors.confirmPassword && (
                            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Les mots de passe correspondent
                            </p>
                          )}
                        </div>

                        {/* Submit */}
                        <Button
                          onClick={handleResetPassword}
                          disabled={isResetting}
                          className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200/50 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isResetting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Réinitialisation...
                            </>
                          ) : (
                            <>
                              Réinitialiser le mot de passe
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
        © 2025 WalanAI. Tous droits réservés.
      </motion.p>
    </div>
  )
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ')
}
