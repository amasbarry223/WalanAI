'use client'

import { motion } from 'framer-motion'
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Pencil,
  Mail,
  RefreshCw,
  XCircle,
  Clock,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart,
  Bar,
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

const planDistribution = [
  { name: 'Gratuit', value: 1248, color: '#94A3B8' },
  { name: 'Pro', value: 342, color: '#10B981' },
  { name: 'Enterprise', value: 28, color: '#F59E0B' },
]

interface Subscription {
  id: string
  name: string
  email: string
  plan: 'gratuit' | 'pro' | 'enterprise'
  amount: string
  status: 'actif' | 'expiré' | 'annulé'
  startDate: string
  endDate: string
}

const activeSubscriptions: Subscription[] = [
  { id: '1', name: 'Lucas Martin', email: 'lucas.martin@univ.fr', plan: 'pro', amount: '9,99 €/mois', status: 'actif', startDate: '15 Jan 2026', endDate: '15 Mar 2026' },
  { id: '2', name: 'Emma Dubois', email: 'emma.dubois@univ.fr', plan: 'pro', amount: '9,99 €/mois', status: 'actif', startDate: '22 Jan 2026', endDate: '22 Mar 2026' },
  { id: '3', name: 'Hugo Richard', email: 'hugo.richard@univ.fr', plan: 'gratuit', amount: '0 €', status: 'actif', startDate: '3 Fév 2026', endDate: '—' },
  { id: '4', name: 'Léa Petit', email: 'lea.petit@univ.fr', plan: 'pro', amount: '9,99 €/mois', status: 'expiré', startDate: '10 Fév 2026', endDate: '10 Avr 2026' },
  { id: '5', name: 'Nathan Bernard', email: 'nathan.bernard@univ.fr', plan: 'enterprise', amount: '49,99 €/mois', status: 'actif', startDate: '18 Fév 2026', endDate: '18 Avr 2026' },
  { id: '6', name: 'Chloé Moreau', email: 'chloe.moreau@univ.fr', plan: 'gratuit', amount: '0 €', status: 'actif', startDate: '25 Fév 2026', endDate: '—' },
  { id: '7', name: 'Marie Laurent', email: 'marie.laurent@univ.fr', plan: 'pro', amount: '9,99 €/mois', status: 'annulé', startDate: '5 Mar 2026', endDate: '5 Mai 2026' },
  { id: '8', name: 'Thomas Blanc', email: 'thomas.blanc@univ.fr', plan: 'gratuit', amount: '0 €', status: 'actif', startDate: '12 Mar 2026', endDate: '—' },
  { id: '9', name: 'Julie Roux', email: 'julie.roux@univ.fr', plan: 'pro', amount: '9,99 €/mois', status: 'actif', startDate: '20 Mar 2026', endDate: '20 Mai 2026' },
  { id: '10', name: 'Sarah Klein', email: 'sarah.klein@univ.fr', plan: 'enterprise', amount: '49,99 €/mois', status: 'actif', startDate: '8 Avr 2026', endDate: '8 Juin 2026' },
  { id: '11', name: 'Pierre Vidal', email: 'pierre.vidal@univ.fr', plan: 'gratuit', amount: '0 €', status: 'annulé', startDate: '1 Avr 2026', endDate: '1 Avr 2026' },
  { id: '12', name: 'Alice Garcia', email: 'alice.garcia@univ.fr', plan: 'pro', amount: '9,99 €/mois', status: 'actif', startDate: '22 Avr 2026', endDate: '22 Juin 2026' },
]

const expiringSubscriptions = [
  { id: '1', name: 'Lucas Martin', email: 'lucas.martin@univ.fr', plan: 'pro', endDate: '5 Mar 2026', daysLeft: 3 },
  { id: '2', name: 'Julie Roux', email: 'julie.roux@univ.fr', plan: 'pro', endDate: '7 Mar 2026', daysLeft: 5 },
  { id: '3', name: 'Sarah Klein', email: 'sarah.klein@univ.fr', plan: 'enterprise', endDate: '8 Mar 2026', daysLeft: 6 },
  { id: '4', name: 'Maxime Leroy', email: 'maxime.leroy@univ.fr', plan: 'pro', endDate: '4 Mar 2026', daysLeft: 2 },
]

const getPlanBadge = (plan: string) => {
  switch (plan) {
    case 'enterprise':
      return <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Enterprise</Badge>
    case 'pro':
      return <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0">Pro</Badge>
    default:
      return <Badge className="bg-slate-100 text-slate-600 text-[10px] border-0">Gratuit</Badge>
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'actif':
      return (
        <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Actif
        </Badge>
      )
    case 'expiré':
      return (
        <Badge className="bg-orange-100 text-orange-700 text-[10px] border-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Expiré
        </Badge>
      )
    case 'annulé':
      return (
        <Badge className="bg-red-100 text-red-700 text-[10px] border-0 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Annulé
        </Badge>
      )
    default:
      return null
  }
}

export default function AdminSubscriptionsPage() {
  const kpis = [
    {
      title: 'MRR',
      subtitle: 'Monthly Recurring Revenue',
      value: '8 100 €',
      change: '+18.2%',
      trend: 'up' as const,
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-l-emerald-500',
    },
    {
      title: 'ARR',
      subtitle: 'Annual Recurring Revenue',
      value: '97 200 €',
      change: '+22.4%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-l-teal-500',
    },
    {
      title: 'ARPU',
      subtitle: 'Avg. Revenue Per User',
      value: '5,01 €',
      change: '+4.8%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-l-amber-500',
    },
    {
      title: 'Taux de churn',
      subtitle: 'Désabonnement mensuel',
      value: '3,2%',
      change: '-0.8%',
      trend: 'down' as const,
      icon: TrendingDown,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-l-rose-500',
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
                  <CreditCard className="h-6 w-6 text-emerald-400" />
                  Abonnements &amp; Revenus
                </h1>
                <p className="text-slate-400 text-sm mt-1">Suivez les revenus et gérez les abonnements</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                  <CreditCard className="h-3 w-3 mr-1" />
                  370 abonnés payants
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
          <Card key={kpi.title} className={`border-l-4 ${kpi.border} hover:shadow-md transition-shadow`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${
                  kpi.title === 'Taux de churn'
                    ? kpi.trend === 'down' ? 'text-emerald-600' : 'text-red-500'
                    : kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {kpi.title === 'Taux de churn'
                    ? kpi.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />
                    : kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                  }
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{kpi.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue BarChart */}
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
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} barSize={28}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(value: number) => [`${value.toLocaleString('fr-FR')} €`, 'Revenu']}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution PieChart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-emerald-500" />
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
                    formatter={(value: number) => [`${value.toLocaleString('fr-FR')} utilisateurs`, 'Plan']}
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
                  <span className="font-semibold text-gray-900">{plan.value.toLocaleString('fr-FR')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Subscriptions Table */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                Abonnements actifs
              </CardTitle>
              <Badge variant="secondary" className="text-xs w-fit">
                {activeSubscriptions.filter(s => s.status === 'actif').length} actifs
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        Utilisateur <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Plan</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Montant</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Statut</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Date début</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Date fin</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white">
                              {sub.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{sub.name}</p>
                            <p className="text-xs text-gray-400 truncate">{sub.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {getPlanBadge(sub.plan)}
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="text-sm font-medium text-gray-900">{sub.amount}</span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 hidden xl:table-cell">{sub.startDate}</td>
                      <td className="py-3 px-4 text-xs text-gray-500 hidden xl:table-cell">{sub.endDate}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" /> Modifier l&apos;abonnement
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" /> Envoyer un rappel
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" /> Renouveler
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="h-4 w-4 mr-2" /> Annuler l&apos;abonnement
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expiring Subscriptions */}
      <motion.div variants={itemVariants}>
        <Card className="border-amber-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Abonnements expirants
              </CardTitle>
              <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
                <Clock className="h-3 w-3 mr-1" />
                Sous 7 jours
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white">
                    {sub.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{sub.name}</p>
                    {getPlanBadge(sub.plan)}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{sub.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-amber-700">{sub.endDate}</p>
                  <p className="text-[10px] text-amber-500 flex items-center justify-end gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {sub.daysLeft === 1 ? 'Expire demain' : `Expire dans ${sub.daysLeft} jours`}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 text-xs gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-100">
                  <Mail className="h-3 w-3" />
                  <span className="hidden sm:inline">Rappeler</span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
