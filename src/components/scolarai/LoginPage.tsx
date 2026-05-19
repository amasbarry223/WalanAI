'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export default function LoginPage() {
  const { login, setCurrentPage } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = () => {
    const name = email.split('@')[0] || 'Barry'
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
    login({ name: capitalizedName, email: email || 'barry@email.com', plan: 'gratuit' })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-8"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          ScolarAI
        </span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <Card className="border-gray-200/80 shadow-lg shadow-gray-200/50 py-8">
          <CardContent className="space-y-6 px-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Bon retour !
              </h1>
              <p className="text-sm text-gray-500">
                Connectez-vous pour continuer vos révisions
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="vous@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 border-gray-200 bg-gray-50/50 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 bg-gray-50/50 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm cursor-pointer"
              >
                Se connecter
                <ArrowRight className="h-4 w-4 ml-1" />
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
            >
              <GoogleIcon />
              Continuer avec Google
            </Button>

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
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-xs text-gray-400"
      >
        © 2026 ScolarAI. Tous droits réservés.
      </motion.p>
    </div>
  )
}
