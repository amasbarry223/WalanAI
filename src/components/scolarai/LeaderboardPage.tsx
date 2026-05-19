'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Crown,
  Flame,
  Star,
  Target,
  Zap,
  ChevronUp,
  ChevronDown,
  Minus,
  Swords,
} from 'lucide-react'
import { useState, useMemo } from 'react'

// ─── Mock Data ───────────────────────────────────────────────

interface Student {
  id: number
  name: string
  score: number
  streak: number
  trend: 'up' | 'down' | 'same'
  subject: string
  achievements: string[]
}

const allStudents: Student[] = [
  { id: 1, name: 'Léa Dupont', score: 9850, streak: 32, trend: 'up', subject: 'Droit', achievements: ['Maître du Droit', 'Série dorée'] },
  { id: 2, name: 'Maxime Bernard', score: 9420, streak: 28, trend: 'up', subject: 'Informatique', achievements: ['Codeur exceptionnel'] },
  { id: 3, name: 'Chloé Martin', score: 9180, streak: 25, trend: 'same', subject: 'Économie', achievements: ['Économiste en herbe'] },
  { id: 4, name: 'Lucas Petit', score: 8740, streak: 21, trend: 'up', subject: 'Mathématiques', achievements: ['Esprit logique'] },
  { id: 5, name: 'Emma Leroy', score: 8520, streak: 19, trend: 'down', subject: 'Histoire', achievements: ['Historien passionné'] },
  { id: 6, name: 'Hugo Moreau', score: 8310, streak: 17, trend: 'up', subject: 'Droit', achievements: [] },
  { id: 7, name: 'Camille Roux', score: 8050, streak: 15, trend: 'up', subject: 'Informatique', achievements: ['Série dorée'] },
  { id: 8, name: 'Nathan Simon', score: 7830, streak: 14, trend: 'down', subject: 'Économie', achievements: [] },
  { id: 9, name: 'Inès Laurent', score: 7620, streak: 12, trend: 'up', subject: 'Histoire', achievements: [] },
  { id: 10, name: 'Théo Michel', score: 7410, streak: 11, trend: 'same', subject: 'Mathématiques', achievements: [] },
  { id: 11, name: 'Jade Garcia', score: 7190, streak: 10, trend: 'up', subject: 'Droit', achievements: [] },
  { id: 12, name: 'Louis Thomas', score: 6950, streak: 9, trend: 'down', subject: 'Informatique', achievements: [] },
  { id: 13, name: 'Manon Robert', score: 6720, streak: 8, trend: 'up', subject: 'Économie', achievements: [] },
  { id: 14, name: 'Raphaël Richard', score: 6510, streak: 7, trend: 'same', subject: 'Histoire', achievements: [] },
  { id: 15, name: 'Lina Durand', score: 6280, streak: 6, trend: 'up', subject: 'Mathématiques', achievements: [] },
  { id: 16, name: 'Arthur Mercier', score: 6040, streak: 5, trend: 'down', subject: 'Droit', achievements: [] },
  { id: 17, name: 'Chloé Lefevre', score: 5810, streak: 4, trend: 'up', subject: 'Informatique', achievements: [] },
  { id: 18, name: 'Adam Bonnet', score: 5570, streak: 3, trend: 'same', subject: 'Économie', achievements: [] },
  { id: 19, name: 'Sarah Dupuis', score: 5320, streak: 2, trend: 'up', subject: 'Histoire', achievements: [] },
  { id: 20, name: 'Olivier Lambert', score: 5080, streak: 1, trend: 'down', subject: 'Mathématiques', achievements: [] },
]

const CURRENT_USER_ID = 7

const weeklyChallenge = {
  title: 'Défi de la semaine',
  description: 'Complétez 10 quiz dans 3 matières différentes cette semaine pour débloquer le badge "Explorateur Polyvalent".',
  reward: 500,
  badge: 'Explorateur Polyvalent',
  progress: 4,
  total: 10,
}

const recentAchievements = [
  { student: 'Léa Dupont', badge: 'Maître du Droit', icon: <Crown className="h-5 w-5" />, color: 'text-amber-500', time: 'Il y a 2h' },
  { student: 'Maxime Bernard', badge: 'Codeur exceptionnel', icon: <Zap className="h-5 w-5" />, color: 'text-blue-500', time: 'Il y a 5h' },
  { student: 'Camille Roux', badge: 'Série dorée', icon: <Flame className="h-5 w-5" />, color: 'text-orange-500', time: 'Il y a 8h' },
  { student: 'Chloé Martin', badge: 'Économiste en herbe', icon: <TrendingUp className="h-5 w-5" />, color: 'text-emerald-500', time: 'Il y a 12h' },
  { student: 'Emma Leroy', badge: 'Historien passionné', icon: <Star className="h-5 w-5" />, color: 'text-purple-500', time: 'Il y a 1j' },
  { student: 'Lucas Petit', badge: 'Esprit logique', icon: <Target className="h-5 w-5" />, color: 'text-rose-500', time: 'Il y a 1j' },
]

const subjectColors: Record<string, string> = {
  Droit: 'bg-blue-100 text-blue-700',
  Économie: 'bg-amber-100 text-amber-700',
  Informatique: 'bg-emerald-100 text-emerald-700',
  Histoire: 'bg-purple-100 text-purple-700',
  Mathématiques: 'bg-rose-100 text-rose-700',
}

const categoryFilters = ['Tous', 'Droit', 'Économie', 'Informatique', 'Histoire', 'Mathématiques']

// ─── Animation Variants ──────────────────────────────────────

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

const podiumVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.8 },
  visible: (rank: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: (3 - rank) * 0.2,
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  }),
}

const listVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
}

// ─── Helpers ─────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function formatScore(score: number): string {
  return score.toLocaleString('fr-FR')
}

function getPodiumStyle(rank: number) {
  switch (rank) {
    case 1:
      return {
        bg: 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500',
        border: 'border-amber-300',
        shadow: 'shadow-lg shadow-amber-200/50',
        text: 'text-amber-700',
        badgeBg: 'bg-amber-100 text-amber-700',
        height: 'h-32',
        avatarRing: 'ring-4 ring-amber-400',
        crownColor: 'text-amber-500',
        glow: '0 0 40px rgba(245, 158, 11, 0.3)',
      }
    case 2:
      return {
        bg: 'bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400',
        border: 'border-gray-300',
        shadow: 'shadow-lg shadow-gray-200/50',
        text: 'text-gray-600',
        badgeBg: 'bg-gray-100 text-gray-600',
        height: 'h-24',
        avatarRing: 'ring-4 ring-gray-300',
        crownColor: 'text-gray-400',
        glow: '0 0 30px rgba(156, 163, 175, 0.25)',
      }
    case 3:
      return {
        bg: 'bg-gradient-to-b from-orange-200 via-orange-300 to-orange-400',
        border: 'border-orange-300',
        shadow: 'shadow-lg shadow-orange-200/50',
        text: 'text-orange-700',
        badgeBg: 'bg-orange-100 text-orange-700',
        height: 'h-20',
        avatarRing: 'ring-4 ring-orange-300',
        crownColor: 'text-orange-400',
        glow: '0 0 30px rgba(251, 146, 60, 0.25)',
      }
    default:
      return {}
  }
}

// ─── Component ───────────────────────────────────────────────

export default function LeaderboardPage() {
  const { setCurrentPage, user } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [timePeriod, setTimePeriod] = useState('week')

  const filteredStudents = useMemo(() => {
    if (selectedCategory === 'Tous') return allStudents
    return allStudents.filter(s => s.subject === selectedCategory)
  }, [selectedCategory])

  const currentUser = filteredStudents.find(s => s.id === CURRENT_USER_ID)
  const currentUserRank = currentUser ? filteredStudents.findIndex(s => s.id === CURRENT_USER_ID) + 1 : null

  const top3 = filteredStudents.slice(0, 3)
  const rest = filteredStudents.slice(3)

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-emerald-500" />
              Classement
            </h1>
            <p className="text-sm text-gray-600">Comparez-vous aux meilleurs étudiants</p>
          </div>
        </div>
      </motion.div>

      {/* Time Period & Category Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-6">
        <Tabs value={timePeriod} onValueChange={setTimePeriod} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="week" className="text-xs sm:text-sm">Cette semaine</TabsTrigger>
            <TabsTrigger value="month" className="text-xs sm:text-sm">Ce mois</TabsTrigger>
            <TabsTrigger value="all" className="text-xs sm:text-sm">Tout le temps</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              className={
                selectedCategory === cat
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white text-xs'
                  : 'text-xs'
              }
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* ─── Top 3 Podium ─── */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-md">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-6 pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-amber-300" />
                    <h2 className="text-white font-bold text-lg">Top 3</h2>
                  </div>
                  <p className="text-emerald-100 text-sm mb-6">Les champions de la semaine</p>
                </div>

                <div className="px-4 sm:px-8 pb-8 -mt-2">
                  <div className="flex items-end justify-center gap-3 sm:gap-6 pt-6">
                    {/* 2nd Place */}
                    {top3[1] && (
                      <motion.div
                        className="flex flex-col items-center"
                        custom={2}
                        variants={podiumVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="relative mb-2">
                          <Avatar className={`h-14 w-14 sm:h-16 sm:w-16 ${getPodiumStyle(2).avatarRing}`}>
                            <AvatarFallback className="bg-gray-200 text-gray-700 font-bold text-lg">
                              {getInitials(top3[1].name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold shadow">
                            2
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 text-center max-w-[80px] truncate">{top3[1].name.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{formatScore(top3[1].score)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="text-xs font-medium text-orange-600">{top3[1].streak}j</span>
                        </div>
                        <motion.div
                          className={`w-20 sm:w-28 ${getPodiumStyle(2).height} ${getPodiumStyle(2).bg} rounded-t-xl mt-3 relative overflow-hidden`}
                          style={{ boxShadow: getPodiumStyle(2).glow }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                          <Medal className={`h-8 w-8 absolute bottom-2 left-1/2 -translate-x-1/2 ${getPodiumStyle(2).crownColor} opacity-60`} />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* 1st Place */}
                    {top3[0] && (
                      <motion.div
                        className="flex flex-col items-center -mt-4"
                        custom={1}
                        variants={podiumVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Crown className="h-7 w-7 text-amber-500 mb-1 drop-shadow-lg" />
                        <div className="relative mb-2">
                          <Avatar className={`h-16 w-16 sm:h-20 sm:w-20 ${getPodiumStyle(1).avatarRing}`}>
                            <AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-xl">
                              {getInitials(top3[0].name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            1
                          </div>
                        </div>
                        <p className="text-base font-bold text-gray-900 text-center max-w-[100px] truncate">{top3[0].name.split(' ')[0]}</p>
                        <p className="text-sm font-semibold text-amber-600">{formatScore(top3[0].score)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                          <span className="text-xs font-semibold text-orange-600">{top3[0].streak}j</span>
                        </div>
                        <motion.div
                          className={`w-24 sm:w-32 ${getPodiumStyle(1).height} ${getPodiumStyle(1).bg} rounded-t-xl mt-3 relative overflow-hidden`}
                          style={{ boxShadow: getPodiumStyle(1).glow }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                          <Trophy className="h-10 w-10 absolute bottom-2 left-1/2 -translate-x-1/2 text-amber-200/70" />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* 3rd Place */}
                    {top3[2] && (
                      <motion.div
                        className="flex flex-col items-center"
                        custom={3}
                        variants={podiumVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="relative mb-2">
                          <Avatar className={`h-14 w-14 sm:h-16 sm:w-16 ${getPodiumStyle(3).avatarRing}`}>
                            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">
                              {getInitials(top3[2].name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold shadow">
                            3
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 text-center max-w-[80px] truncate">{top3[2].name.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{formatScore(top3[2].score)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="text-xs font-medium text-orange-600">{top3[2].streak}j</span>
                        </div>
                        <motion.div
                          className={`w-20 sm:w-28 ${getPodiumStyle(3).height} ${getPodiumStyle(3).bg} rounded-t-xl mt-3 relative overflow-hidden`}
                          style={{ boxShadow: getPodiumStyle(3).glow }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                          <Medal className={`h-8 w-8 absolute bottom-2 left-1/2 -translate-x-1/2 ${getPodiumStyle(3).crownColor} opacity-60`} />
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Full Rankings Table ─── */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trophy className="h-5 w-5 text-emerald-500" />
                    Classement complet
                  </CardTitle>
                  <span className="text-xs text-gray-400">{filteredStudents.length} participants</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="flex items-center gap-3 px-4 sm:px-6 py-2 border-b bg-gray-50/80 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <span className="w-8 text-center">#</span>
                  <span className="w-9" />
                  <span className="flex-1">Étudiant</span>
                  <span className="hidden sm:block w-16 text-center">Série</span>
                  <span className="w-8 text-center">Trend</span>
                  <span className="w-16 text-right">Score</span>
                </div>
                <ScrollArea className="max-h-[480px]">
                  <div className="px-2 sm:px-3 pb-2">
                    {rest.map((student, index) => {
                      const rank = index + 4
                      const isCurrentUser = student.id === CURRENT_USER_ID
                      return (
                        <motion.div
                          key={student.id}
                          custom={index}
                          variants={listVariants}
                          initial="hidden"
                          animate="visible"
                          className={`flex items-center gap-3 py-2.5 px-2 sm:px-3 rounded-lg transition-colors ${
                            isCurrentUser
                              ? 'bg-emerald-50 border border-emerald-200 my-1'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {/* Rank */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                            isCurrentUser
                              ? 'bg-emerald-500 text-white'
                              : rank <= 5
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-500'
                          }`}>
                            {rank}
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className={`text-xs font-semibold ${
                              isCurrentUser ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Name & Subject */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className={`text-sm font-medium truncate ${
                                isCurrentUser ? 'text-emerald-800' : 'text-gray-900'
                              }`}>
                                {student.name}
                              </p>
                              {isCurrentUser && (
                                <Badge className="bg-emerald-500 text-white text-[9px] px-1.5 py-0 h-4 shrink-0">Vous</Badge>
                              )}
                            </div>
                            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 mt-0.5 ${subjectColors[student.subject] || 'bg-gray-100 text-gray-600'}`}>
                              {student.subject}
                            </Badge>
                          </div>

                          {/* Streak */}
                          <div className="hidden sm:flex items-center gap-1 shrink-0 w-16 justify-center">
                            <Flame className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                            <span className="text-xs font-semibold text-gray-700">{student.streak}j</span>
                          </div>

                          {/* Trend */}
                          <div className="shrink-0 w-8 flex justify-center">
                            {student.trend === 'up' && (
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50">
                                <ChevronUp className="h-3.5 w-3.5 text-emerald-500" />
                              </div>
                            )}
                            {student.trend === 'down' && (
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-50">
                                <ChevronDown className="h-3.5 w-3.5 text-red-400" />
                              </div>
                            )}
                            {student.trend === 'same' && (
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
                                <Minus className="h-3 w-3 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Score */}
                          <div className="text-right shrink-0 w-16">
                            <p className={`text-sm font-bold tabular-nums ${isCurrentUser ? 'text-emerald-700' : 'text-gray-900'}`}>
                              {formatScore(student.score)}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">

          {/* ─── Your Rank Card ─── */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/30 rounded-full -translate-y-8 translate-x-8" />
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="flex items-center gap-2 text-base text-emerald-800">
                  <Star className="h-5 w-5 text-emerald-500" />
                  Votre classement
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-4 ring-emerald-300">
                          <AvatarFallback className="bg-emerald-200 text-emerald-800 text-lg font-bold">
                            {getInitials(user?.name || currentUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white">
                          {currentUserRank}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.name || currentUser.name}</p>
                        <p className="text-sm text-emerald-600 font-medium">{formatScore(currentUser.score)} pts</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/70 rounded-lg p-2.5 text-center backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">#{currentUserRank}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Rang</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2.5 text-center backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">{currentUser.streak}j</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Série</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-2.5 text-center backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">{currentUser.score > 8000 ? 'Top 10' : 'Top 20'}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">Groupe</p>
                      </div>
                    </div>

                    {/* Progress to next rank */}
                    {currentUserRank && currentUserRank > 1 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-500">Progression vers le rang #{currentUserRank - 1}</span>
                          <span className="text-xs font-semibold text-emerald-600">
                            {Math.round(((filteredStudents[currentUserRank - 2]?.score - currentUser.score) > 0
                              ? 1 - (filteredStudents[currentUserRank - 2]?.score - currentUser.score) / currentUser.score
                              : 1) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.max(10, Math.round(((filteredStudents[currentUserRank - 2]?.score - currentUser.score) > 0
                                ? 1 - (filteredStudents[currentUserRank - 2]?.score - currentUser.score) / currentUser.score
                                : 1) * 100))}%`
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          +{formatScore(filteredStudents[currentUserRank - 2]?.score - currentUser.score || 0)} pts pour monter
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Non classé dans cette catégorie</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Challenge Card ─── */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-5 text-white relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Swords className="h-5 w-5 text-violet-200" />
                  <h3 className="font-bold">{weeklyChallenge.title}</h3>
                </div>
                <p className="text-sm text-violet-100 leading-relaxed relative z-10">
                  {weeklyChallenge.description}
                </p>
                <div className="flex items-center gap-2 mt-3 relative z-10">
                  <Badge className="bg-white/20 text-white border-0 hover:bg-white/20">
                    <Star className="h-3 w-3 mr-1" />
                    {weeklyChallenge.badge}
                  </Badge>
                  <Badge className="bg-amber-400/90 text-amber-900 border-0 hover:bg-amber-400/90">
                    +{weeklyChallenge.reward} pts
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression</span>
                  <span className="text-sm font-bold text-purple-600">{weeklyChallenge.progress}/{weeklyChallenge.total}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(weeklyChallenge.progress / weeklyChallenge.total) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white gap-2">
                  <Target className="h-4 w-4" />
                  Relever le défi
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Achievements Section ─── */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Medal className="h-5 w-5 text-emerald-500" />
                  Accomplissements récents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-[280px]">
                  <div className="px-4 sm:px-6 pb-4 space-y-0">
                    {recentAchievements.map((ach, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                      >
                        <div className={`p-2 rounded-lg bg-gray-50 shrink-0 ${ach.color}`}>
                          {ach.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{ach.badge}</p>
                          <p className="text-xs text-gray-500 truncate">{ach.student}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{ach.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* ─── Quick Stats ─── */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Participants actifs</span>
                    <span className="text-sm font-bold text-gray-900">{filteredStudents.length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score moyen</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {formatScore(Math.round(filteredStudents.reduce((a, s) => a + s.score, 0) / filteredStudents.length))}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plus longue série</span>
                    <div className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      <span className="text-sm font-bold text-gray-900">{Math.max(...filteredStudents.map(s => s.streak))}j</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score le plus élevé</span>
                    <span className="text-sm font-bold text-amber-600">
                      {formatScore(Math.max(...filteredStudents.map(s => s.score)))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
