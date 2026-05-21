'use client'

import { useMemo } from 'react'
import { listAdminUsers } from '@/lib/admin-users'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  CreditCard,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  FileText,
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Crown,
  BarChart3,
  Eye,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { AdminPageName } from '@/lib/store'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts'

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

const monthlySignups = [
  { month: 'Jan', users: 85 },
  { month: 'Fév', users: 120 },
  { month: 'Mar', users: 98 },
  { month: 'Avr', users: 145 },
  { month: 'Mai', users: 168 },
  { month: 'Jun', users: 190 },
  { month: 'Jul', users: 156 },
  { month: 'Aoû', users: 132 },
  { month: 'Sep', users: 210 },
  { month: 'Oct', users: 245 },
  { month: 'Nov', users: 278 },
  { month: 'Déc', users: 310 },
]

const monthlyRevenue = [
  { month: 'Jan', revenue: 2400 },
  { month: 'Fév', revenue: 3200 },
  { month: 'Mar', revenue: 2800 },
  { month: 'Avr', revenue: 4100 },
  { month: 'Mai', revenue: 4800 },
  { month: 'Jun', revenue: 5200 },
  { month: 'Jul', revenue: 4500 },
  { month: 'Aoû', revenue: 3800 },
  { month: 'Sep', revenue: 5800 },
  { month: 'Oct', revenue: 6400 },
  { month: 'Nov', revenue: 7200 },
  { month: 'Déc', revenue: 8100 },
]

const PRO_PRICE_EUR = 9.99

export default function AdminDashboardPage() {
  const { setCurrentAdminPage } = useAppStore()
  const { toast } = useToast()

  const users = useMemo(() => listAdminUsers(), [])
  const total = users.length
  const activeCount = users.filter((u) => u.active).length
  const proCount = users.filter((u) => u.plan === 'pro').length
  const conversion =
    total > 0 ? ((proCount / total) * 100).toFixed(1) : '0'
  const mrr = Math.round(proCount * PRO_PRICE_EUR)

  const planDistribution = useMemo(
    () => [
      { name: 'Gratuit', value: users.filter((u) => u.plan === 'gratuit').length, color: '#94A3B8' },
      { name: 'Pro', value: proCount, color: '#10B981' },
    ].filter((p) => p.value > 0),
    [users, proCount]
  )

  const recentUsers = useMemo(
    () =>
      [...users]
        .filter((u) => !u.isSystemAccount)
        .slice(0, 5)
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          plan: u.plan,
          date: u.lastActive,
          active: u.active,
        })),
    [users]
  )

  const suspendedCount = users.filter((u) => !u.active && !u.isSystemAccount).length

  const alerts = [
    ...(suspendedCount > 0
      ? [
          {
            id: 1,
            type: 'warning' as const,
            title: 'Comptes suspendus',
            desc: `${suspendedCount} compte(s) inactif(s) — voir Utilisateurs`,
            icon: AlertTriangle,
            targetPage: 'admin-users' as AdminPageName,
          },
        ]
      : []),
    {
      id: 2,
      type: 'info' as const,
      title: 'Données locales',
      desc: `${total} compte(s) enregistré(s) sur cet appareil`,
      icon: Clock,
      targetPage: 'admin-users' as AdminPageName,
    },
    {
      id: 3,
      type: 'success' as const,
      title: 'Abonnés Pro',
      desc: `${proCount} utilisateur(s) Pro — MRR estimé ${mrr} €`,
      icon: CheckCircle2,
      targetPage: 'admin-subscriptions' as AdminPageName,
    },
  ]

  const kpis = [
    {
      title: 'Utilisateurs totaux',
      value: String(total),
      change: 'données réelles',
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-l-blue-500',
      targetPage: 'admin-users' as AdminPageName,
    },
    {
      title: 'Revenu mensuel (estim.)',
      value: `${mrr} €`,
      change: `${proCount} × Pro`,
      trend: 'up' as const,
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-l-emerald-500',
      targetPage: 'admin-subscriptions' as AdminPageName,
    },
    {
      title: 'Taux de conversion',
      value: `${conversion}%`,
      change: 'Pro / total',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-l-violet-500',
      targetPage: 'admin-analytics' as AdminPageName,
    },
    {
      title: 'Utilisateurs actifs',
      value: String(activeCount),
      change: `${total - activeCount} inactif(s)`,
      trend: activeCount >= total / 2 ? ('up' as const) : ('down' as const),
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-l-amber-500',
      targetPage: 'admin-users' as AdminPageName,
    },
  ]

  const totalDocs = users.reduce((s, u) => s + u.documents, 0)
  const totalQuizzes = users.reduce((s, u) => s + u.quizzes, 0)

  const realtimeStats = [
    { label: 'Comptes actifs', value: activeCount, icon: Eye, color: 'text-emerald-500' },
    { label: 'Quiz enregistrés', value: totalQuizzes, icon: Zap, color: 'text-amber-500' },
    { label: 'Documents (usage)', value: totalDocs, icon: FileText, color: 'text-blue-500' },
  ]

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Banner */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-emerald-500/5 rounded-full translate-y-20" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                  Tableau de bord Admin
                </h1>
                <p className="text-slate-400 text-sm mt-1">Vue d&apos;ensemble de la plateforme WalanAI</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                  <Activity className="h-3 w-3 mr-1" />
                  En ligne
                </Badge>
                <span className="text-slate-400">Mise à jour il y a 5 min</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className={`border-l-4 ${kpi.border} hover:shadow-lg transition-shadow cursor-pointer`} onClick={() => setCurrentAdminPage(kpi.targetPage)}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Real-time Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {realtimeStats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gray-50">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label} aujourd&apos;hui</p>
              </div>
              <span className="ml-auto flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Signups Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-5 w-5 text-emerald-500" />
                Inscriptions mensuelles
              </CardTitle>
              <Badge variant="secondary" className="text-xs">+21.6% vs année préc.</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySignups} barSize={28}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(value: number) => [`${value} utilisateurs`, 'Inscriptions']}
                  />
                  <Bar dataKey="users" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                Revenus mensuels
              </CardTitle>
              <Badge variant="secondary" className="text-xs">60 500 € total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(value: number) => [`${value.toLocaleString()} €`, 'Revenu']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Distribution + Recent Users + Alerts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Crown className="h-5 w-5 text-emerald-500" />
              Répartition des plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(value: number) => [`${value} utilisateurs`, 'Plan']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="text-gray-600">{plan.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{plan.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-emerald-500" />
                Derniers inscrits
              </CardTitle>
              <button
                onClick={() => setCurrentAdminPage('admin-users')}
                className="text-sm text-emerald-500 hover:text-emerald-600 font-medium"
              >
                Voir tout
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className={`text-[10px] ${user.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.plan === 'pro' ? 'Pro' : 'Gratuit'}
                  </Badge>
                  <p className="text-[10px] text-gray-400 mt-0.5">{user.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Alertes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => {
              const config = {
                warning: { bg: 'bg-amber-50 border-amber-200', icon: 'text-amber-500', dot: 'bg-amber-400' },
                info: { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-500', dot: 'bg-blue-400' },
                success: { bg: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-500', dot: 'bg-emerald-400' },
              }[alert.type]
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${config.bg} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => {
                    setCurrentAdminPage(alert.targetPage)
                    toast({ title: alert.title, description: alert.desc })
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <alert.icon className={`h-4 w-4 ${config.icon} mt-0.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{alert.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
