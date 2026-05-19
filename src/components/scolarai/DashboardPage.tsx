'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import {
  Bell,
  Settings,
  Crown,
  FileText,
  Upload,
  Calendar,
  Clock,
  Flame,
  Bot,
  Brain,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

const mockNotifications = [
  { id: 1, title: 'Rappel de révision', message: 'Il est temps de réviser vos flashcards sur le Droit Civil', time: 'Il y a 5 min', read: false, icon: '📚' },
  { id: 2, title: 'Série en cours !', message: 'Vous avez atteint 5 jours consécutifs. Continuez !', time: 'Il y a 1h', read: false, icon: '🔥' },
  { id: 3, title: 'Nouveau badge', message: 'Vous avez débloqué le badge "Premier Quiz"', time: 'Il y a 3h', read: true, icon: '🏆' },
  { id: 4, title: 'Examen approche', message: 'Votre examen de Droit Civil est dans 7 jours', time: 'Hier', read: true, icon: '⚠️' },
  { id: 5, title: 'Rapport hebdomadaire', message: 'Votre rapport de la semaine est prêt', time: 'Il y a 2j', read: true, icon: '📊' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const mockDocuments = [
  { id: 1, title: 'Introduction au Droit Civil', subject: 'Droit', date: '15 Mai 2026', progress: 75, flashcards: 24 },
  { id: 2, title: 'Microéconomie - Chapitre 3', subject: 'Économie', date: '12 Mai 2026', progress: 50, flashcards: 18 },
  { id: 3, title: 'Algorithmes et Structures de Données', subject: 'Informatique', date: '10 Mai 2026', progress: 30, flashcards: 32 },
  { id: 4, title: 'Histoire de la Révolution Française', subject: 'Histoire', date: '8 Mai 2026', progress: 90, flashcards: 15 },
]

const subjectColors: Record<string, string> = {
  Droit: 'bg-blue-100 text-blue-700',
  Économie: 'bg-amber-100 text-amber-700',
  Informatique: 'bg-emerald-100 text-emerald-700',
  Histoire: 'bg-purple-100 text-purple-700',
}

function MiniCalendar() {
  const [currentDate] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const today = currentDate.getDate()
  const isCurrentMonth = viewDate.getMonth() === currentDate.getMonth() && viewDate.getFullYear() === currentDate.getFullYear()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

  const days: (number | null)[] = []
  for (let i = 0; i < adjustedFirstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const monthName = viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium capitalize text-gray-700">{monthName}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} className="text-[10px] font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`text-xs py-1 rounded ${
              day === null
                ? ''
                : day === today && isCurrentMonth
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, setCurrentPage } = useAppStore()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonjour'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const quickActions = [
    { label: 'Importer', icon: <Upload className="h-4 w-4" />, page: 'documents' as const, color: 'text-emerald-500' },
    { label: 'Documents', icon: <FileText className="h-4 w-4" />, page: 'documents' as const, color: 'text-blue-500' },
    { label: 'Assistant IA', icon: <Bot className="h-4 w-4" />, page: 'assistant' as const, color: 'text-violet-500' },
    { label: 'Révision', icon: <Brain className="h-4 w-4" />, page: 'revision' as const, color: 'text-amber-500' },
    { label: 'Pomodoro', icon: <Clock className="h-4 w-4" />, page: 'pomodoro' as const, color: 'text-red-500' },
    { label: 'Planificateur', icon: <Calendar className="h-4 w-4" />, page: 'planner' as const, color: 'text-indigo-500' },
    { label: 'Carnets', icon: <BookOpen className="h-4 w-4" />, page: 'notes' as const, color: 'text-teal-500' },
    { label: 'Classement', icon: <Flame className="h-4 w-4" />, page: 'leaderboard' as const, color: 'text-orange-500' },
    { label: 'Ma Progression', icon: <TrendingUp className="h-4 w-4" />, page: 'progress' as const, color: 'text-rose-500' },
    { label: 'Paramètres', icon: <Settings className="h-4 w-4" />, page: 'settings' as const, color: 'text-gray-500' },
  ]

  return (
    <motion.div
      className="p-4 md:p-6 max-w-[1400px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h4 className="font-semibold text-sm">Notifications</h4>
                <button className="text-xs text-emerald-500 hover:text-emerald-600 font-medium">Tout marquer lu</button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="divide-y">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-emerald-50/50' : ''}`}
                    >
                      <span className="text-lg shrink-0">{notif.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t px-4 py-2.5">
                <button className="text-xs text-emerald-500 hover:text-emerald-600 font-medium w-full text-center">
                  Voir toutes les notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('settings')}>
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Passer à Pro</span>
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Welcome Banner */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
              <div className="absolute bottom-0 left-20 w-24 h-24 bg-white/5 rounded-full translate-y-8" />
              <CardContent className="p-6 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white/30">
                      <AvatarFallback className="bg-white text-emerald-600 text-lg font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{greeting}, {user?.name?.split(' ')[0] || 'Étudiant'}! ✨</h2>
                      <p className="text-emerald-100 text-sm">Prêt à continuer votre apprentissage ?</p>
                    </div>
                  </div>
                  <Button
                    className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold gap-2 self-start sm:self-auto"
                    onClick={() => setCurrentPage('documents')}
                  >
                    <Upload className="h-4 w-4" />
                    Importer
                  </Button>
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{mockDocuments.length}</p>
                    <p className="text-xs text-emerald-100 uppercase tracking-wide">Documents</p>
                  </div>
                  <Separator orientation="vertical" className="bg-white/20 h-auto" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">72%</p>
                    <p className="text-xs text-emerald-100 uppercase tracking-wide">Score</p>
                  </div>
                  <Separator orientation="vertical" className="bg-white/20 h-auto" />
                  <div className="text-center">
                    <p className="text-2xl font-bold">5j</p>
                    <p className="text-xs text-emerald-100 uppercase tracking-wide">Série</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents récents */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    Documents récents
                  </CardTitle>
                  <button
                    onClick={() => setCurrentPage('documents')}
                    className="text-sm text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1"
                  >
                    Voir tout <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockDocuments.map((doc) => (
                    <motion.div
                      key={doc.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="p-2 rounded-lg bg-gray-50 shrink-0">
                        <FileText className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${subjectColors[doc.subject] || 'bg-gray-100 text-gray-600'}`}>
                            {doc.subject}
                          </Badge>
                          <span className="text-[10px] text-gray-400">{doc.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={doc.progress} className="h-1.5 flex-1" />
                          <span className="text-[10px] text-gray-500 font-medium">{doc.progress}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendrier d'activité */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  Calendrier d&apos;activité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <Clock className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">45 min</p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Temps Total</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">30 min</p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Cette semaine</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <Flame className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">5j</p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Série</p>
                  </div>
                </div>
                <MiniCalendar />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Sidebar */}
        <motion.div variants={itemVariants} className="w-full lg:w-[260px] shrink-0">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => setCurrentPage(action.page)}
                  className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <span className={action.color}>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
