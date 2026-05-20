'use client'

import { motion } from 'framer-motion'
import {
  ClipboardCheck,
  CalendarClock,
  FileCheck2,
  TrendingUp,
  Percent,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  Plus,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  LineChart,
  Line,
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

const gradeDistribution = [
  { range: '0-4', etudiants: 8 },
  { range: '4-8', etudiants: 22 },
  { range: '8-12', etudiants: 45 },
  { range: '12-16', etudiants: 58 },
  { range: '16-20', etudiants: 23 },
]

const monthlyAverages = [
  { month: 'Jan', moyenne: 11.2 },
  { month: 'Fév', moyenne: 11.8 },
  { month: 'Mar', moyenne: 12.4 },
  { month: 'Avr', moyenne: 12.1 },
  { month: 'Mai', moyenne: 13.0 },
  { month: 'Jun', moyenne: 13.5 },
  { month: 'Jul', moyenne: 12.8 },
  { month: 'Aoû', moyenne: 13.2 },
  { month: 'Sep', moyenne: 13.6 },
  { month: 'Oct', moyenne: 14.1 },
  { month: 'Nov', moyenne: 13.8 },
  { month: 'Déc', moyenne: 14.3 },
]

interface Exam {
  id: string
  matiere: string
  date: string
  inscrits: number
  noteMoyenne: number
  tauxReussite: number
  badgeColor: string
  badgeBg: string
}

const mockExams: Exam[] = [
  { id: '1', matiere: 'Droit Civil', date: '15 Jan 2026', inscrits: 87, noteMoyenne: 12.4, tauxReussite: 68, badgeColor: 'text-rose-700', badgeBg: 'bg-rose-100' },
  { id: '2', matiere: 'Microéconomie', date: '22 Jan 2026', inscrits: 64, noteMoyenne: 11.8, tauxReussite: 62, badgeColor: 'text-amber-700', badgeBg: 'bg-amber-100' },
  { id: '3', matiere: 'Algorithmes', date: '5 Fév 2026', inscrits: 112, noteMoyenne: 14.2, tauxReussite: 81, badgeColor: 'text-sky-700', badgeBg: 'bg-sky-100' },
  { id: '4', matiere: 'Histoire', date: '12 Fév 2026', inscrits: 53, noteMoyenne: 13.6, tauxReussite: 76, badgeColor: 'text-orange-700', badgeBg: 'bg-orange-100' },
  { id: '5', matiere: 'Comptabilité', date: '3 Mar 2026', inscrits: 91, noteMoyenne: 10.9, tauxReussite: 55, badgeColor: 'text-emerald-700', badgeBg: 'bg-emerald-100' },
  { id: '6', matiere: 'Anglais', date: '18 Mar 2026', inscrits: 78, noteMoyenne: 14.8, tauxReussite: 85, badgeColor: 'text-violet-700', badgeBg: 'bg-violet-100' },
  { id: '7', matiere: 'Philosophie', date: '7 Avr 2026', inscrits: 45, noteMoyenne: 12.1, tauxReussite: 64, badgeColor: 'text-pink-700', badgeBg: 'bg-pink-100' },
  { id: '8', matiere: 'Mathématiques', date: '21 Avr 2026', inscrits: 134, noteMoyenne: 11.3, tauxReussite: 58, badgeColor: 'text-teal-700', badgeBg: 'bg-teal-100' },
  { id: '9', matiere: 'Droit Commercial', date: '5 Mai 2026', inscrits: 62, noteMoyenne: 13.1, tauxReussite: 72, badgeColor: 'text-indigo-700', badgeBg: 'bg-indigo-100' },
  { id: '10', matiere: 'Statistiques', date: '19 Mai 2026', inscrits: 98, noteMoyenne: 10.5, tauxReussite: 51, badgeColor: 'text-red-700', badgeBg: 'bg-red-100' },
]

export default function AdminExamsPage() {
  const stats = [
    {
      title: 'Examens à venir',
      value: '24',
      icon: CalendarClock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-l-blue-500',
    },
    {
      title: 'Résultats enregistrés',
      value: '156',
      icon: FileCheck2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-l-emerald-500',
    },
    {
      title: 'Note moyenne',
      value: '13.8/20',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-l-amber-500',
    },
    {
      title: 'Taux de réussite',
      value: '72%',
      icon: Percent,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-l-violet-500',
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-emerald-500" />
              Gestion des Examens
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Suivez les examens planifiés et les résultats des étudiants
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
              <Plus className="h-4 w-4" />
              Planifier
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className={`border-l-4 ${stat.border} hover:shadow-md transition-shadow`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Grade Distribution BarChart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                Distribution des notes
              </CardTitle>
              <Badge variant="secondary" className="text-xs">156 résultats</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} barSize={40}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="range"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                  />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value} étudiants`, 'Effectif']}
                  />
                  <Bar
                    dataKey="etudiants"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Averages LineChart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Évolution des moyennes
              </CardTitle>
              <Badge variant="secondary" className="text-xs">+2.1 pts / an</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAverages}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                  />
                  <YAxis
                    domain={[10, 16]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value}/20`, 'Moyenne']}
                  />
                  <Line
                    type="monotone"
                    dataKey="moyenne"
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

      {/* Exams Table */}
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                Liste des examens
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {mockExams.length} examens
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
                        Matière <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        Date <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Inscrits</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Note moyenne</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Taux réussite</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockExams.map((exam) => (
                    <tr key={exam.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <Badge className={`${exam.badgeBg} ${exam.badgeColor} text-xs border-0 font-medium`}>
                          {exam.matiere}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          <CalendarClock className="h-3.5 w-3.5 text-gray-400" />
                          {exam.date}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 hidden md:table-cell">
                        {exam.inscrits}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className={`text-sm font-semibold ${
                          exam.noteMoyenne >= 14 ? 'text-emerald-600' :
                          exam.noteMoyenne >= 12 ? 'text-amber-600' :
                          'text-red-500'
                        }`}>
                          {exam.noteMoyenne.toFixed(1)}/20
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                exam.tauxReussite >= 75 ? 'bg-emerald-500' :
                                exam.tauxReussite >= 60 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${exam.tauxReussite}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${
                            exam.tauxReussite >= 75 ? 'text-emerald-600' :
                            exam.tauxReussite >= 60 ? 'text-amber-600' :
                            'text-red-500'
                          }`}>
                            {exam.tauxReussite}%
                          </span>
                        </div>
                      </td>
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
                              <Pencil className="h-4 w-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Supprimer
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
    </motion.div>
  )
}
