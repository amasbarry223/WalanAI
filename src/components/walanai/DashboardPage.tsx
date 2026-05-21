'use client'

import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  UsersRound,
  ClipboardCheck,
  Layers,
  Zap,
  Trophy,
  Timer,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'

const mockNotifications = [
  { id: 1, title: 'Rappel de révision', message: 'Il est temps de réviser vos flashcards sur le Droit Civil', time: 'Il y a 5 min', read: false, icon: '📚' },
  { id: 2, title: 'Série en cours !', message: 'Vous avez atteint 5 jours consécutifs. Continuez !', time: 'Il y a 1h', read: false, icon: '🔥' },
  { id: 3, title: 'Nouveau badge', message: 'Vous avez débloqué le badge "Premier Quiz"', time: 'Il y a 3h', read: true, icon: '🏆' },
  { id: 4, title: 'Examen approche', message: 'Votre examen de Droit Civil est dans 7 jours', time: 'Hier', read: true, icon: '⚠️' },
  { id: 5, title: 'Coach IA', message: 'De nouvelles recommandations sont disponibles', time: 'Il y a 2j', read: true, icon: '✨' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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

// Weekly activity data
const weeklyActivity = [
  { day: 'Lun', minutes: 45, sessions: 3 },
  { day: 'Mar', minutes: 60, sessions: 4 },
  { day: 'Mer', minutes: 30, sessions: 2 },
  { day: 'Jeu', minutes: 75, sessions: 5 },
  { day: 'Ven', minutes: 50, sessions: 3 },
  { day: 'Sam', minutes: 20, sessions: 1 },
  { day: 'Dim', minutes: 40, sessions: 2 },
]

// Streak data - last 28 days
const streakDays = [
  { day: 1, active: true, minutes: 30 },
  { day: 2, active: true, minutes: 45 },
  { day: 3, active: false, minutes: 0 },
  { day: 4, active: true, minutes: 60 },
  { day: 5, active: true, minutes: 25 },
  { day: 6, active: true, minutes: 50 },
  { day: 7, active: false, minutes: 0 },
  { day: 8, active: true, minutes: 35 },
  { day: 9, active: true, minutes: 55 },
  { day: 10, active: true, minutes: 40 },
  { day: 11, active: true, minutes: 70 },
  { day: 12, active: false, minutes: 0 },
  { day: 13, active: true, minutes: 45 },
  { day: 14, active: true, minutes: 30 },
  { day: 15, active: true, minutes: 60 },
  { day: 16, active: true, minutes: 50 },
  { day: 17, active: true, minutes: 35 },
  { day: 18, active: false, minutes: 0 },
  { day: 19, active: true, minutes: 45 },
  { day: 20, active: true, minutes: 65 },
  { day: 21, active: true, minutes: 40 },
  { day: 22, active: true, minutes: 55 },
  { day: 23, active: true, minutes: 30 },
  { day: 24, active: true, minutes: 75 },
  { day: 25, active: true, minutes: 45 },
  { day: 26, active: false, minutes: 0 },
  { day: 27, active: true, minutes: 60 },
  { day: 28, active: true, minutes: 50 },
]

// Upcoming exams
const upcomingExams = [
  { id: 1, subject: 'Droit Civil', date: '22 Juin', daysLeft: 12, color: 'bg-blue-500' },
  { id: 2, subject: 'Microéconomie', date: '28 Juin', daysLeft: 18, color: 'bg-amber-500' },
  { id: 3, subject: 'Algorithmes', date: '5 Juillet', daysLeft: 25, color: 'bg-emerald-500' },
]

// AI insights preview
const aiInsights = [
  { id: 1, type: 'revision', icon: <AlertCircle className="h-4 w-4" />, title: 'Révision urgente', desc: 'Droit Civil - Chapitre 3 besoin de révision', color: 'text-red-500 bg-red-50', action: 'Réviser' },
  { id: 2, type: 'progress', icon: <CheckCircle2 className="h-4 w-4" />, title: 'Bon progrès !', desc: 'Votre score en Informatique a augmenté de 12%', color: 'text-emerald-500 bg-emerald-50', action: 'Voir' },
  { id: 3, type: 'tip', icon: <Lightbulb className="h-4 w-4" />, title: 'Conseil', desc: 'Essayez la répétition espacée pour mieux mémoriser', color: 'text-amber-500 bg-amber-50', action: 'Essayer' },
]

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

  // Mark some days as active
  const activeDays = [3, 5, 8, 9, 10, 12, 14, 15, 17, 19, 20, 22, 24, 25, 27]

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
            className={`text-xs py-1 rounded relative ${
              day === null
                ? ''
                : day === today && isCurrentMonth
                  ? 'bg-emerald-500 text-white font-bold'
                  : activeDays.includes(day) && isCurrentMonth
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
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

function StreakHeatmap() {
  const getIntensity = (day: typeof streakDays[0]) => {
    if (!day.active) return 'bg-gray-100'
    if (day.minutes >= 60) return 'bg-emerald-500'
    if (day.minutes >= 40) return 'bg-emerald-400'
    if (day.minutes >= 20) return 'bg-emerald-300'
    return 'bg-emerald-200'
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">4 dernières semaines</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400">Moins</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-emerald-200" />
          <div className="w-3 h-3 rounded-sm bg-emerald-300" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-gray-400">Plus</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} className="text-[9px] text-gray-400 text-center font-medium">{d}</div>
        ))}
        {streakDays.map((day) => (
          <motion.div
            key={day.day}
            className={`w-full aspect-square rounded-sm ${getIntensity(day)} cursor-pointer relative group`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: day.day * 0.02, duration: 0.2 }}
            whileHover={{ scale: 1.2 }}
          >
            {day.active && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {day.minutes} min
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, setCurrentPage } = useAppStore()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(mockNotifications)

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonjour'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const totalMinutes = weeklyActivity.reduce((acc, d) => acc + d.minutes, 0)
  const totalSessions = weeklyActivity.reduce((acc, d) => acc + d.sessions, 0)

  const quickActions = [
    { label: 'Importer', icon: <Upload className="h-4 w-4" />, page: 'documents' as const, color: 'text-emerald-500' },
    { label: 'Assistant IA', icon: <Bot className="h-4 w-4" />, page: 'assistant' as const, color: 'text-violet-500' },
    { label: 'Coach IA', icon: <Sparkles className="h-4 w-4" />, page: 'study-coach' as const, color: 'text-pink-500' },
    { label: 'Révision', icon: <Brain className="h-4 w-4" />, page: 'revision' as const, color: 'text-amber-500' },
    { label: 'Flashcards', icon: <Layers className="h-4 w-4" />, page: 'flashcard-deck' as const, color: 'text-blue-500' },
    { label: 'Pomodoro', icon: <Timer className="h-4 w-4" />, page: 'pomodoro' as const, color: 'text-red-500' },
    { label: 'Examens', icon: <ClipboardCheck className="h-4 w-4" />, page: 'exam-tracker' as const, color: 'text-sky-500' },
    { label: 'Groupes', icon: <UsersRound className="h-4 w-4" />, page: 'study-groups' as const, color: 'text-orange-500' },
    { label: 'Classement', icon: <Trophy className="h-4 w-4" />, page: 'leaderboard' as const, color: 'text-yellow-500' },
    { label: 'Progression', icon: <TrendingUp className="h-4 w-4" />, page: 'progress' as const, color: 'text-rose-500' },
    { label: 'Quiz', icon: <Zap className="h-4 w-4" />, page: 'quiz-generator' as const, color: 'text-indigo-500' },
    { label: 'Carnets', icon: <BookOpen className="h-4 w-4" />, page: 'notes' as const, color: 'text-teal-500' },
  ]

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-1.5 sm:gap-2">
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
                <button className="text-xs text-emerald-500 hover:text-emerald-600 font-medium" onClick={() => { setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))); toast({ title: 'Toutes les notifications marquées comme lues' }) }}>Tout marquer lu</button>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="divide-y">
                  {notifications.map((notif) => (
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
                <button className="text-xs text-emerald-500 hover:text-emerald-600 font-medium w-full text-center" onClick={() => toast({ title: 'Centre de notifications bientôt disponible' })}>
                  Voir toutes les notifications
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('settings')}>
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={() => setCurrentPage('pricing')}>
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
                      <h2 className="text-lg sm:text-xl font-bold">{greeting}, {user?.name?.split(' ')[0] || 'Étudiant'}!</h2>
                      <p className="text-emerald-100 text-sm">Prêt à continuer votre apprentissage ?</p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start sm:self-auto">
                    <Button
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-2"
                      variant="outline"
                      onClick={() => setCurrentPage('study-coach')}
                    >
                      <Sparkles className="h-4 w-4" />
                      Coach IA
                    </Button>
                    <Button
                      className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold gap-2"
                      onClick={() => setCurrentPage('documents')}
                    >
                      <Upload className="h-4 w-4" />
                      Importer
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">{mockDocuments.length}</p>
                    <p className="text-[10px] sm:text-xs text-emerald-100 uppercase tracking-wide">Documents</p>
                  </div>
                  <Separator orientation="vertical" className="bg-white/20 h-auto hidden sm:block" />
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">72%</p>
                    <p className="text-[10px] sm:text-xs text-emerald-100 uppercase tracking-wide">Score</p>
                  </div>
                  <Separator orientation="vertical" className="bg-white/20 h-auto hidden sm:block" />
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">5j</p>
                    <p className="text-[10px] sm:text-xs text-emerald-100 uppercase tracking-wide">Série</p>
                  </div>
                  <Separator orientation="vertical" className="bg-white/20 h-auto hidden sm:block" />
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold">{totalSessions}</p>
                    <p className="text-[10px] sm:text-xs text-emerald-100 uppercase tracking-wide">Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentPage('documents')}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <FileText className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-xs text-gray-500">Documents</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentPage('flashcard-deck')}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Layers className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                  <p className="text-xs text-gray-500">Flashcards</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentPage('exam-tracker')}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <Target className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">12j</p>
                  <p className="text-xs text-gray-500">Prochain examen</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentPage('leaderboard')}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Flame className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">5j</p>
                  <p className="text-xs text-gray-500">Série active</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Activity Chart + Streak Heatmap */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Activité hebdomadaire
                  </CardTitle>
                  <Badge variant="secondary" className="text-[10px]">{totalMinutes} min</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivity} barSize={24}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                      />
                      <YAxis hide />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                          fontSize: '12px',
                        }}
                        formatter={(value: number) => [`${value} min`, 'Temps']}
                      />
                      <Bar
                        dataKey="minutes"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Flame className="h-5 w-5 text-emerald-500" />
                    Série d&apos;activité
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-bold text-gray-900">5 jours</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StreakHeatmap />
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insights + Upcoming Exams */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                    Recommandations IA
                  </CardTitle>
                  <button
                    onClick={() => setCurrentPage('study-coach')}
                    className="text-sm text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1"
                  >
                    Tout voir <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {aiInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:border-emerald-200 hover:bg-emerald-50/20 transition-colors cursor-pointer"
                    whileHover={{ x: 2 }}
                    onClick={() => setCurrentPage('study-coach')}
                  >
                    <div className={`p-1.5 rounded-lg ${insight.color}`}>
                      {insight.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{insight.desc}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-emerald-600 hover:text-emerald-700 shrink-0">
                      {insight.action}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Exams */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                    Examens à venir
                  </CardTitle>
                  <button
                    onClick={() => setCurrentPage('exam-tracker')}
                    className="text-sm text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1"
                  >
                    Voir tout <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingExams.map((exam) => (
                  <motion.div
                    key={exam.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:border-emerald-200 hover:bg-emerald-50/20 transition-colors cursor-pointer"
                    whileHover={{ x: 2 }}
                    onClick={() => setCurrentPage('exam-tracker')}
                  >
                    <div className={`w-1 h-10 rounded-full ${exam.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{exam.subject}</p>
                      <p className="text-xs text-gray-500">{exam.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${exam.daysLeft <= 14 ? 'text-red-500' : 'text-gray-700'}`}>
                        {exam.daysLeft}j
                      </p>
                      <p className="text-[10px] text-gray-400">restants</p>
                    </div>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-2 border-dashed text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 gap-2"
                  onClick={() => setCurrentPage('exam-tracker')}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Voir tous les examens
                </Button>
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
                      onClick={() => setCurrentPage('documents')}
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
                          <span className="text-[10px] text-gray-400">{doc.flashcards} fiches</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <Clock className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">{totalMinutes} min</p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Cette semaine</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <Target className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">{totalSessions}</p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Sessions</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <Flame className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">5j</p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Série</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">+12%</p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Progression</p>
                  </div>
                </div>
                <MiniCalendar />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Sidebar */}
        <motion.div variants={itemVariants} className="w-full lg:w-[260px] shrink-0 space-y-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => setCurrentPage(action.page)}
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <span className={action.color}>{action.icon}</span>
                    <span className="truncate">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Groups Mini Card */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentPage('study-groups')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <UsersRound className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Groupes d&apos;Étude</p>
                  <p className="text-xs text-gray-500">3 sessions en cours</p>
                </div>
              </div>
              <div className="flex -space-x-2 mb-2">
                {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-purple-400'].map((color, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${color} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold`}>
                    {['AB', 'CD', 'EF', 'GH'][i]}
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-500 font-bold">
                  +5
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-emerald-600 font-medium">En ligne maintenant</span>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goal Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-900">Objectif du jour</p>
                <span className="text-xs text-emerald-600 font-semibold">67%</span>
              </div>
              <Progress value={67} className="h-2 mb-3" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>40 / 60 min</span>
                <span className="text-emerald-600 font-medium">+20 min</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
