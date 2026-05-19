'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Trash2,
  LogOut,
  Camera,
  Crown,
  Mail,
  Lock,
  Moon,
  Sun,
} from 'lucide-react'
import { useState } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function SettingsPage() {
  const { user, setCurrentPage, logout } = useAppStore()
  const [notifications, setNotifications] = useState(true)
  const [emailNotif, setEmailNotif] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('fr')

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <motion.div
      className="p-4 md:p-6 max-w-[900px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-500" />
            Paramètres
          </h1>
          <p className="text-sm text-gray-500">Gérez votre compte et vos préférences</p>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-emerald-500" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-emerald-500 text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'Utilisateur'}</h3>
                <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                <Badge className={`mt-1 ${user?.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  <Crown className="h-3 w-3 mr-1" />
                  Plan {user?.plan || 'gratuit'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm text-gray-600">Nom complet</Label>
                <Input id="name" defaultValue={user?.name || ''} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-gray-600">Email</Label>
                <Input id="email" defaultValue={user?.email || ''} className="mt-1.5" />
              </div>
            </div>

            <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">
              Enregistrer les modifications
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              Abonnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <div>
                <h4 className="font-semibold">Plan {user?.plan === 'pro' ? 'Pro' : 'Gratuit'}</h4>
                <p className="text-sm text-emerald-100 mt-1">
                  {user?.plan === 'pro'
                    ? 'Accès illimité à toutes les fonctionnalités'
                    : '3 documents, 10 quiz par mois'}
                </p>
              </div>
              {user?.plan !== 'pro' && (
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold">
                  <Crown className="h-4 w-4 mr-2" />
                  Passer à Pro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5 text-emerald-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Notifications push</p>
                <p className="text-xs text-gray-400">Recevez des rappels de révision</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Notifications email</p>
                <p className="text-xs text-gray-400">Rapports hebdomadaires par email</p>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-5 w-5 text-emerald-500" />
              Préférences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-4 w-4 text-gray-500" /> : <Sun className="h-4 w-4 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-700">Mode sombre</p>
                  <p className="text-xs text-gray-400">Adapter l&apos;interface à votre préférence</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Langue</p>
                  <p className="text-xs text-gray-400">Choisir la langue de l&apos;interface</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5 bg-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-emerald-500" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 h-12">
              <Lock className="h-4 w-4 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium">Changer le mot de passe</p>
                <p className="text-xs text-gray-400">Dernière modification il y a 30 jours</p>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 h-12">
              <Shield className="h-4 w-4 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium">Authentification à deux facteurs</p>
                <p className="text-xs text-gray-400">Non activée</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants}>
        <Card className="border-red-200 hover:shadow-md transition-shadow mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-red-600">
              <Trash2 className="h-5 w-5" />
              Zone de danger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
              <Trash2 className="h-4 w-4" />
              Supprimer mon compte
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
