'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Target,
  ChevronLeft,
  ChevronRight,
  Timer,
  BarChart3,
  Zap,
  Trash2,
} from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudySession {
  id: number
  subject: string
  day: number // 0 = Monday, 6 = Sunday
  startHour: number // 8–19
  duration: number // in hours
  notes: string
  color: string
}

interface Deadline {
  id: number
  title: string
  date: Date
  type: 'exam' | 'tp' | 'dissertation'
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const FULL_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8–20

const SUBJECT_COLORS: Record<string, string> = {
  'Droit Civil': 'bg-emerald-500',
  'Microéconomie': 'bg-amber-500',
  'Algorithmes': 'bg-violet-500',
  'Histoire': 'bg-rose-500',
  'Mathématiques': 'bg-cyan-500',
}

const SUBJECT_TEXT_COLORS: Record<string, string> = {
  'Droit Civil': 'text-emerald-700',
  'Microéconomie': 'text-amber-700',
  'Algorithmes': 'text-violet-700',
  'Histoire': 'text-rose-700',
  'Mathématiques': 'text-cyan-700',
}

const SUBJECT_BG_COLORS: Record<string, string> = {
  'Droit Civil': 'bg-emerald-50 border-emerald-200',
  'Microéconomie': 'bg-amber-50 border-amber-200',
  'Algorithmes': 'bg-violet-50 border-violet-200',
  'Histoire': 'bg-rose-50 border-rose-200',
  'Mathématiques': 'bg-cyan-50 border-cyan-200',
}

const SUBJECT_LIGHT_COLORS: Record<string, string> = {
  'Droit Civil': 'bg-emerald-100 text-emerald-700',
  'Microéconomie': 'bg-amber-100 text-amber-700',
  'Algorithmes': 'bg-violet-100 text-violet-700',
  'Histoire': 'bg-rose-100 text-rose-700',
  'Mathématiques': 'bg-cyan-100 text-cyan-700',
}

const SUBJECTS = Object.keys(SUBJECT_COLORS)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWeekDates(referenceDate: Date): Date[] {
  const d = new Date(referenceDate)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day // Monday = 1
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatCountdown(target: Date): string {
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  if (diffMs <= 0) return "Aujourd'hui"
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'Demain'
  return `Dans ${diffDays} jours`
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const initialSessions: StudySession[] = [
  { id: 1, subject: 'Droit Civil', day: 0, startHour: 9, duration: 2, notes: 'Contrats - Chapitre 4', color: SUBJECT_COLORS['Droit Civil'] },
  { id: 2, subject: 'Microéconomie', day: 0, startHour: 14, duration: 1.5, notes: 'Élasticité & équilibre', color: SUBJECT_COLORS['Microéconomie'] },
  { id: 3, subject: 'Algorithmes', day: 1, startHour: 10, duration: 2, notes: 'Arbres binaires de recherche', color: SUBJECT_COLORS['Algorithmes'] },
  { id: 4, subject: 'Histoire', day: 1, startHour: 15, duration: 1, notes: 'Révolution industrielle', color: SUBJECT_COLORS['Histoire'] },
  { id: 5, subject: 'Mathématiques', day: 2, startHour: 9, duration: 2, notes: 'Algèbre linéaire', color: SUBJECT_COLORS['Mathématiques'] },
  { id: 6, subject: 'Droit Civil', day: 2, startHour: 14, duration: 1.5, notes: 'Responsabilité délictuelle', color: SUBJECT_COLORS['Droit Civil'] },
  { id: 7, subject: 'Algorithmes', day: 3, startHour: 11, duration: 2, notes: 'Graphes & parcours', color: SUBJECT_COLORS['Algorithmes'] },
  { id: 8, subject: 'Microéconomie', day: 3, startHour: 16, duration: 1, notes: 'Théorie du producteur', color: SUBJECT_COLORS['Microéconomie'] },
  { id: 9, subject: 'Histoire', day: 4, startHour: 9, duration: 1.5, notes: 'Troisième République', color: SUBJECT_COLORS['Histoire'] },
  { id: 10, subject: 'Mathématiques', day: 4, startHour: 14, duration: 2, notes: 'Probabilités', color: SUBJECT_COLORS['Mathématiques'] },
  { id: 11, subject: 'Droit Civil', day: 5, startHour: 10, duration: 1.5, notes: 'Révision générale', color: SUBJECT_COLORS['Droit Civil'] },
  { id: 12, subject: 'Algorithmes', day: 6, startHour: 10, duration: 2, notes: 'TP - Implémentation', color: SUBJECT_COLORS['Algorithmes'] },
]

const mockDeadlines: Deadline[] = [
  { id: 1, title: 'Examen Droit Civil', date: new Date(2026, 4, 25), type: 'exam' },
  { id: 2, title: 'TP Algorithmes', date: new Date(2026, 4, 28), type: 'tp' },
  { id: 3, title: 'Dissertation Histoire', date: new Date(2026, 5, 2), type: 'dissertation' },
]

// ─── Animation Variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SessionBlock({ session }: { session: StudySession }) {
  const topPercent = ((session.startHour - 8) / 12) * 100
  const heightPercent = (session.duration / 12) * 100

  return (
    <motion.div
      className={`absolute left-1 right-1 rounded-md px-1.5 py-1 text-white text-[10px] leading-tight cursor-pointer overflow-hidden shadow-sm ${session.color}`}
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      title={`${session.subject} — ${session.startHour}h-${session.startHour + session.duration}h\n${session.notes}`}
    >
      <p className="font-semibold truncate">{session.subject}</p>
      <p className="opacity-80 truncate">
        {session.startHour}h-{session.startHour + session.duration}h
      </p>
    </motion.div>
  )
}

function WeekCalendar({
  sessions,
  weekDates,
  onWeekChange,
}: {
  sessions: StudySession[]
  weekDates: Date[]
  onWeekChange: (dir: 'prev' | 'next') => void
}) {
  const today = new Date()
  const weekLabel = useMemo(() => {
    if (!weekDates.length) return ''
    const start = weekDates[0]
    const end = weekDates[6]
    const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startStr} – ${endStr}`
  }, [weekDates])

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Semaine
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onWeekChange('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-600 min-w-[180px] text-center">{weekLabel}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onWeekChange('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            {/* Header row */}
            <div className="flex border-b">
              <div className="w-14 shrink-0" />
              {weekDates.map((date, i) => {
                const isToday = isSameDay(date, today)
                return (
                  <div key={i} className="flex-1 text-center py-2 border-l">
                    <p className={`text-xs font-medium ${isToday ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {DAYS[i]}
                    </p>
                    <p
                      className={`text-sm font-bold mt-0.5 ${
                        isToday
                          ? 'bg-emerald-500 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto'
                          : 'text-gray-800'
                      }`}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Time grid */}
            <div className="flex relative">
              {/* Time labels */}
              <div className="w-14 shrink-0">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-12 border-b border-r flex items-start justify-end pr-2 pt-0.5"
                  >
                    <span className="text-[10px] text-gray-400 font-medium">{hour}h</span>
                  </div>
                ))}
              </div>

              {/* Day columns with sessions */}
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const daySessions = sessions.filter((s) => s.day === dayIndex)
                return (
                  <div key={dayIndex} className="flex-1 relative border-l">
                    {HOURS.map((hour) => (
                      <div key={hour} className="h-12 border-b border-gray-100" />
                    ))}
                    {/* Sessions overlaid */}
                    <div className="absolute inset-0">
                      {daySessions.map((session) => (
                        <SessionBlock key={session.id} session={session} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function TodaysSchedule({ sessions, weekDates }: { sessions: StudySession[]; weekDates: Date[] }) {
  const today = new Date()
  const todayDayIndex = useMemo(() => {
    const d = today.getDay()
    return d === 0 ? 6 : d - 1 // 0=Mon ... 6=Sun
  }, [today])

  const todaySessions = useMemo(
    () =>
      sessions
        .filter((s) => s.day === todayDayIndex)
        .sort((a, b) => a.startHour - b.startHour),
    [sessions, todayDayIndex]
  )

  const upcomingSessions = useMemo(
    () => {
      const currentHour = today.getHours()
      return todaySessions.filter((s) => s.startHour + s.duration > currentHour)
    },
    [todaySessions, today]
  )

  const displaySessions = upcomingSessions.length > 0 ? upcomingSessions : todaySessions

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5 text-emerald-500" />
          Programme du jour
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displaySessions.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Aucune session prévue</p>
            <p className="text-xs text-gray-300 mt-1">Profitez de votre journée !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displaySessions.map((session) => (
              <motion.div
                key={session.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${SUBJECT_BG_COLORS[session.subject] || 'bg-gray-50 border-gray-200'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className={`w-1 h-full min-h-[40px] rounded-full ${SUBJECT_COLORS[session.subject]} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge className={`text-[10px] px-1.5 py-0 ${SUBJECT_LIGHT_COLORS[session.subject] || 'bg-gray-100 text-gray-600'}`}>
                      {session.subject}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    {session.startHour}h – {session.startHour + session.duration}h
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{session.notes}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function UpcomingDeadlines({ deadlines }: { deadlines: Deadline[] }) {
  const sorted = useMemo(
    () => [...deadlines].sort((a, b) => a.date.getTime() - b.date.getTime()),
    [deadlines]
  )

  const typeConfig = {
    exam: { label: 'Examen', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    tp: { label: 'TP', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: <Target className="h-3.5 w-3.5" /> },
    dissertation: { label: 'Dissertation', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <BookOpen className="h-3.5 w-3.5" /> },
  }

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5 text-emerald-500" />
          Échéances à venir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map((deadline) => {
            const config = typeConfig[deadline.type]
            return (
              <motion.div
                key={deadline.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className={`p-1.5 rounded-md border ${config.color} shrink-0 mt-0.5`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {deadline.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <Badge variant="outline" className={`mt-1.5 text-[10px] ${config.color}`}>
                    {formatCountdown(deadline.date)}
                  </Badge>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function StudyStatistics({ sessions }: { sessions: StudySession[] }) {
  const stats = useMemo(() => {
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0)
    const subjectSet = new Set(sessions.map((s) => s.subject))
    const subjectDistribution: Record<string, number> = {}
    sessions.forEach((s) => {
      subjectDistribution[s.subject] = (subjectDistribution[s.subject] || 0) + s.duration
    })
    return {
      totalHours,
      subjectCount: subjectSet.size,
      consistency: 85,
      subjectDistribution,
    }
  }, [sessions])

  const maxHours = Math.max(...Object.values(stats.subjectDistribution), 1)

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-emerald-500" />
          Statistiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <Clock className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-700">{stats.totalHours}h</p>
            <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">Cette semaine</p>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 text-center">
            <BookOpen className="h-4 w-4 text-violet-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-violet-700">{stats.subjectCount}</p>
            <p className="text-[10px] text-violet-600/70 uppercase tracking-wide">Matières</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <Target className="h-4 w-4 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-700">{stats.consistency}%</p>
            <p className="text-[10px] text-amber-600/70 uppercase tracking-wide">Régularité</p>
          </div>
        </div>

        {/* Subject distribution bars */}
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Répartition par matière</p>
          {Object.entries(stats.subjectDistribution).map(([subject, hours]) => (
            <div key={subject} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-28 shrink-0 truncate">{subject}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${SUBJECT_COLORS[subject] || 'bg-gray-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(hours / maxHours) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className={`text-xs font-semibold ${SUBJECT_TEXT_COLORS[subject] || 'text-gray-600'} w-8 text-right`}>
                {hours}h
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-emerald-500" />
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white gap-2 justify-start">
          <Sparkles className="h-4 w-4" />
          Planifier avec l&apos;IA
        </Button>
        <Button variant="outline" className="w-full gap-2 justify-start border-emerald-200 text-emerald-600 hover:bg-emerald-50">
          <Timer className="h-4 w-4" />
          Révision espacée
        </Button>
      </CardContent>
    </Card>
  )
}

function AddSessionDialog({
  onAdd,
}: {
  onAdd: (session: StudySession) => void
}) {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [day, setDay] = useState('0')
  const [startHour, setStartHour] = useState('9')
  const [duration, setDuration] = useState('1')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (!subject) return
    const newSession: StudySession = {
      id: Date.now(),
      subject,
      day: parseInt(day),
      startHour: parseInt(startHour),
      duration: parseFloat(duration),
      notes,
      color: SUBJECT_COLORS[subject] || 'bg-gray-500',
    }
    onAdd(newSession)
    setSubject('')
    setDay('0')
    setStartHour('9')
    setDuration('1')
    setNotes('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-500" />
            Nouvelle session d&apos;étude
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="subject">Matière</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une matière" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${SUBJECT_COLORS[s]}`} />
                      {s}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="day">Jour</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FULL_DAYS.map((d, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startHour">Heure de début</Label>
              <Select value={startHour} onValueChange={setStartHour}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.filter((h) => h < 20).map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h}h00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durée (heures)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['0.5', '1', '1.5', '2', '2.5', '3'].map((d) => (
                  <SelectItem key={d} value={d}>
                    {d === '0.5' ? '30 min' : `${d}h`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Ex: Chapitre 3 – Exercices"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleSubmit}
              disabled={!subject}
            >
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PlannerPage() {
  const { setCurrentPage } = useAppStore()
  const [sessions, setSessions] = useState<StudySession[]>(initialSessions)
  const [weekOffset, setWeekOffset] = useState(0)

  const weekDates = useMemo(() => {
    const ref = new Date()
    ref.setDate(ref.getDate() + weekOffset * 7)
    return getWeekDates(ref)
  }, [weekOffset])

  const handleWeekChange = useCallback((dir: 'prev' | 'next') => {
    setWeekOffset((prev) => (dir === 'prev' ? prev - 1 : prev + 1))
  }, [])

  const handleAddSession = useCallback((session: StudySession) => {
    setSessions((prev) => [...prev, session])
  }, [])

  const handleDeleteSession = useCallback((id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }, [])

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
              <Calendar className="h-6 w-6 text-emerald-500" />
              Planificateur d&apos;étude
            </h1>
            <p className="text-sm text-gray-500">Organisez vos sessions et respectez vos échéances</p>
          </div>
        </div>
        <AddSessionDialog onAdd={handleAddSession} />
      </motion.div>

      {/* Main layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left column — Calendar */}
        <div className="flex-1 min-w-0">
          <motion.div variants={itemVariants}>
            <WeekCalendar sessions={sessions} weekDates={weekDates} onWeekChange={handleWeekChange} />
          </motion.div>

          {/* Session list below calendar (mobile-friendly) */}
          <motion.div variants={itemVariants} className="mt-6 xl:hidden">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                  Sessions de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessions
                    .sort((a, b) => a.day !== b.day ? a.day - b.day : a.startHour - b.startHour)
                    .map((session) => (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border ${SUBJECT_BG_COLORS[session.subject] || 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${SUBJECT_COLORS[session.subject]}`} />
                          <span className="text-xs font-medium text-gray-900 truncate">{session.subject}</span>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {FULL_DAYS[session.day]} {session.startHour}h-{session.startHour + session.duration}h
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-500 shrink-0"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column — Sidebar */}
        <div className="w-full xl:w-[340px] shrink-0 space-y-6">
          <motion.div variants={itemVariants}>
            <TodaysSchedule sessions={sessions} weekDates={weekDates} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <UpcomingDeadlines deadlines={mockDeadlines} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StudyStatistics sessions={sessions} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuickActions />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
