'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  Clock,
  Eye,
  TrendingDown,
  Activity,
  Cpu,
  Zap,
  ThumbsUp,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { cn } from '@/lib/utils'

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

// ─── Mock Data ───────────────────────────────────────────────────────────────

const retentionData = [
  { week: 'S1', retention: 100 },
  { week: 'S2', retention: 78 },
  { week: 'S3', retention: 65 },
  { week: 'S4', retention: 58 },
  { week: 'S5', retention: 52 },
  { week: 'S6', retention: 48 },
  { week: 'S7', retention: 45 },
]

const funnelData = [
  { stage: 'Inscription', value: 100, label: '100%' },
  { stage: 'Upload doc', value: 68, label: '68%' },
  { stage: 'Premier Quiz', value: 42, label: '42%' },
  { stage: 'Abonnement Pro', value: 24, label: '24%' },
]

const periods = [
  { key: '7j', label: '7j' },
  { key: '30j', label: '30j' },
  { key: '90j', label: '90j' },
  { key: '12m', label: '12 mois' },
] as const

type PeriodKey = typeof periods[number]['key']

// Heatmap data: day of week × time block
// Intensity values from 0 (inactive) to 5 (very active)
const heatmapData: { day: string; blocks: { label: string; intensity: number }[] }[] = [
  { day: 'Lun', blocks: [
    { label: '6h-9h', intensity: 1 },
    { label: '9h-12h', intensity: 4 },
    { label: '12h-15h', intensity: 3 },
    { label: '15h-18h', intensity: 5 },
    { label: '18h-21h', intensity: 4 },
    { label: '21h-0h', intensity: 2 },
  ]},
  { day: 'Mar', blocks: [
    { label: '6h-9h', intensity: 1 },
    { label: '9h-12h', intensity: 5 },
    { label: '12h-15h', intensity: 4 },
    { label: '15h-18h', intensity: 4 },
    { label: '18h-21h', intensity: 3 },
    { label: '21h-0h', intensity: 1 },
  ]},
  { day: 'Mer', blocks: [
    { label: '6h-9h', intensity: 0 },
    { label: '9h-12h', intensity: 3 },
    { label: '12h-15h', intensity: 5 },
    { label: '15h-18h', intensity: 4 },
    { label: '18h-21h', intensity: 5 },
    { label: '21h-0h', intensity: 3 },
  ]},
  { day: 'Jeu', blocks: [
    { label: '6h-9h', intensity: 1 },
    { label: '9h-12h', intensity: 4 },
    { label: '12h-15h', intensity: 3 },
    { label: '15h-18h', intensity: 5 },
    { label: '18h-21h', intensity: 4 },
    { label: '21h-0h', intensity: 2 },
  ]},
  { day: 'Ven', blocks: [
    { label: '6h-9h', intensity: 0 },
    { label: '9h-12h', intensity: 3 },
    { label: '12h-15h', intensity: 2 },
    { label: '15h-18h', intensity: 3 },
    { label: '18h-21h', intensity: 2 },
    { label: '21h-0h', intensity: 1 },
  ]},
  { day: 'Sam', blocks: [
    { label: '6h-9h', intensity: 0 },
    { label: '9h-12h', intensity: 2 },
    { label: '12h-15h', intensity: 3 },
    { label: '15h-18h', intensity: 2 },
    { label: '18h-21h', intensity: 3 },
    { label: '21h-0h', intensity: 2 },
  ]},
  { day: 'Dim', blocks: [
    { label: '6h-9h', intensity: 0 },
    { label: '9h-12h', intensity: 1 },
    { label: '12h-15h', intensity: 2 },
    { label: '15h-18h', intensity: 1 },
    { label: '18h-21h', intensity: 2 },
    { label: '21h-0h', intensity: 1 },
  ]},
]

function getHeatmapColor(intensity: number): string {
  const colors: Record<number, string> = {
    0: 'bg-gray-100',
    1: 'bg-emerald-100',
    2: 'bg-emerald-200',
    3: 'bg-emerald-300',
    4: 'bg-emerald-500',
    5: 'bg-emerald-700',
  }
  return colors[intensity] || 'bg-gray-100'
}

function getHeatmapTextColor(intensity: number): string {
  return intensity >= 4 ? 'text-white' : 'text-gray-700'
}

export default function AdminAnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState<PeriodKey>('30j')

  const statsCards = [
    {
      title: 'Utilisateurs actifs/jour',
      value: '342',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-l-blue-500',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Temps moyen/session',
      value: '24 min',
      icon: Clock,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-l-emerald-500',
      trend: '+2.1 min',
      trendUp: true,
    },
    {
      title: 'Pages vues',
      value: '12 450',
      icon: Eye,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-l-violet-500',
      trend: '+15.3%',
      trendUp: true,
    },
    {
      title: 'Taux de rebond',
      value: '32%',
      icon: TrendingDown,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-l-amber-500',
      trend: '-4.1%',
      trendUp: true, // decrease in bounce rate is positive
    },
  ]

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-emerald-500/5 rounded-full translate-y-20" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                  Analytique
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Dashboards analytiques détaillés de la plateforme
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                {periods.map((p) => (
                  <Button
                    key={p.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActivePeriod(p.key)}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-md transition-all',
                      activePeriod === p.key
                        ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 hover:text-white'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className={`border-l-4 ${stat.border} hover:shadow-md transition-shadow`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    stat.trendUp ? 'text-emerald-600' : 'text-red-500'
                  )}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Retention Chart - AreaChart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-emerald-500" />
                Rétention utilisateur
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                45% à S7
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Rétention']}
                  />
                  <Area
                    type="monotone"
                    dataKey="retention"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#retentionGradient)"
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel - Horizontal BarChart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                Funnel de conversion
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                24% final
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelData}
                  layout="vertical"
                  margin={{ top: 5, right: 40, left: 20, bottom: 5 }}
                  barSize={28}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="stage"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#374151' }}
                    width={110}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Conversion']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
                    {funnelData.map((entry, index) => {
                      const colors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
                      return (
                        <rect key={`cell-${index}`} fill={colors[index]} />
                      )
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-emerald-500" />
                Carte de chaleur d&apos;activité
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Moins</span>
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn('w-3 h-3 rounded-sm', getHeatmapColor(level))}
                    />
                  ))}
                </div>
                <span>Plus</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Column headers */}
            <div className="overflow-x-auto">
              <div className="min-w-[420px]">
                <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-1.5 mb-1.5">
                  <div />
                  {heatmapData[0].blocks.map((block) => (
                    <div key={block.label} className="text-center text-[10px] text-gray-400 font-medium truncate">
                      {block.label}
                    </div>
                  ))}
                </div>
                {/* Rows */}
                {heatmapData.map((row) => (
                  <div key={row.day} className="grid grid-cols-[60px_repeat(6,1fr)] gap-1.5 mb-1.5">
                    <div className="flex items-center text-xs font-medium text-gray-600">
                      {row.day}
                    </div>
                    {row.blocks.map((block, i) => (
                      <div
                        key={`${row.day}-${i}`}
                        className={cn(
                          'rounded-md h-10 flex items-center justify-center text-[10px] font-medium transition-all hover:scale-105 cursor-default',
                          getHeatmapColor(block.intensity),
                          getHeatmapTextColor(block.intensity)
                        )}
                        title={`${row.day} ${block.label}: ${block.intensity * 20}% d'activité`}
                      >
                        {block.intensity > 0 ? `${block.intensity * 20}` : ''}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Performance Card */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Performance IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="p-2.5 rounded-xl bg-blue-50 inline-flex mb-3">
                  <Cpu className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">4 280</p>
                <p className="text-xs text-gray-500 mt-0.5">Utilisations IA</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="p-2.5 rounded-xl bg-amber-50 inline-flex mb-3">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">1.2s</p>
                <p className="text-xs text-gray-500 mt-0.5">Temps réponse moyen</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-50 inline-flex mb-3">
                  <ThumbsUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-xs text-gray-500 mt-0.5">Satisfaction</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="p-2.5 rounded-xl bg-violet-50 inline-flex mb-3">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">GPT-4o</p>
                <p className="text-xs text-gray-500 mt-0.5">Modèle</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
