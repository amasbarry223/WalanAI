'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  Brain,
  BookOpen,
  Flame,
  Award,
  Calendar,
  BarChart3,
  Zap,
} from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const weeklyData = [
  { day: 'Lun', minutes: 25, quiz: 3 },
  { day: 'Mar', minutes: 45, quiz: 5 },
  { day: 'Mer', minutes: 30, quiz: 2 },
  { day: 'Jeu', minutes: 60, quiz: 7 },
  { day: 'Ven', minutes: 40, quiz: 4 },
  { day: 'Sam', minutes: 15, quiz: 1 },
  { day: 'Dim', minutes: 50, quiz: 6 },
]

const monthlyData = [
  { week: 'S1', score: 65 },
  { week: 'S2', score: 72 },
  { week: 'S3', score: 68 },
  { week: 'S4', score: 78 },
]

const subjectProgress = [
  { subject: 'Droit Civil', progress: 85, color: 'bg-blue-500' },
  { subject: 'Microéconomie', progress: 62, color: 'bg-amber-500' },
  { subject: 'Algorithmes', progress: 45, color: 'bg-emerald-500' },
  { subject: 'Histoire', progress: 90, color: 'bg-purple-500' },
  { subject: 'Mathématiques', progress: 55, color: 'bg-rose-500' },
]

const chartConfig = {
  minutes: { label: 'Minutes', color: '#10b981' },
  quiz: { label: 'Quiz', color: '#8b5cf6' },
  score: { label: 'Score', color: '#10b981' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ProgressPage() {
  const { setCurrentPage } = useAppStore()

  return (
    <motion.div
      className="p-4 md:p-6 max-w-[1400px] mx-auto"
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
              <TrendingUp className="h-6 w-6 text-emerald-500" />
              Ma Progression
            </h1>
            <p className="text-sm text-gray-500">Suivez vos performances et votre évolution</p>
          </div>
        </div>
      </motion.div>

      {/* Stats overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Temps total', value: '4h 35min', icon: <Clock className="h-5 w-5" />, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Score moyen', value: '72%', icon: <Target className="h-5 w-5" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Fiches maîtrisées', value: '89', icon: <Brain className="h-5 w-5" />, color: 'text-violet-500', bg: 'bg-violet-50' },
          { label: 'Série actuelle', value: '5 jours', icon: <Flame className="h-5 w-5" />, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                Activité hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={weeklyData} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="minutes" fill="var(--color-minutes)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Evolution */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Évolution du score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={monthlyData} accessibilityLayer>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={3} dot={{ r: 5, fill: 'var(--color-score)' }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Subject Progress */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Progression par matière
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectProgress.map((item) => (
              <div key={item.subject}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{item.subject}</span>
                  <span className="text-sm font-bold text-gray-900">{item.progress}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute top-0 left-0 h-full rounded-full ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-emerald-500" />
              Badges & Accomplissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Premier Quiz', icon: <Zap className="h-6 w-6" />, earned: true, color: 'text-amber-500' },
                { name: 'Série de 5j', icon: <Flame className="h-6 w-6" />, earned: true, color: 'text-red-500' },
                { name: '100 Flashcards', icon: <Brain className="h-6 w-6" />, earned: false, color: 'text-gray-300' },
                { name: 'Score 90%+', icon: <Target className="h-6 w-6" />, earned: false, color: 'text-gray-300' },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 ${
                    badge.earned ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-gray-50/50 opacity-60'
                  }`}
                >
                  <span className={badge.earned ? badge.color : 'text-gray-300'}>{badge.icon}</span>
                  <p className={`text-xs font-medium mt-2 ${badge.earned ? 'text-gray-700' : 'text-gray-400'}`}>
                    {badge.name}
                  </p>
                  {badge.earned && <Badge className="mt-1 bg-emerald-100 text-emerald-600 text-[10px] border-0">Obtenu</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
