'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  LayoutGrid,
  AlignLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Trash2,
  ChevronDown,
  BookOpen,
  Target,
  Timer,
  TrendingUp,
  Award,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = 'urgent' | 'important' | 'normal'
type ViewMode = 'cards' | 'timeline' | 'calendar'

interface ExamTopic {
  id: string
  name: string
  completed: boolean
}

interface Exam {
  id: string
  subject: string
  date: Date
  time: string
  room: string
  topics: ExamTopic[]
  progress: number
  priority: Priority
  color: string
  isPast?: boolean
  score?: number
}

interface StudyDay {
  day: string
  date: string
  sessions: { subject: string; duration: number; topic: string; priority: boolean }[]
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const subjectColors: Record<string, string> = {
  'Droit Civil': '#10B981',
  Microéconomie: '#F59E0B',
  Algorithmes: '#8B5CF6',
  Histoire: '#EF4444',
  Comptabilité: '#3B82F6',
  Anglais: '#EC4899',
}

const now = new Date()

const mockExams: Exam[] = [
  {
    id: '1',
    subject: 'Droit Civil',
    date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
    time: '09:00',
    room: 'Amphi A - Bâtiment Droit',
    topics: [
      { id: 't1', name: 'Contrats et obligations', completed: true },
      { id: 't2', name: 'Responsabilité délictuelle', completed: true },
      { id: 't3', name: 'Droit de propriété', completed: false },
      { id: 't4', name: 'Personnes et famille', completed: false },
    ],
    progress: 55,
    priority: 'urgent',
    color: '#10B981',
  },
  {
    id: '2',
    subject: 'Microéconomie',
    date: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
    time: '14:00',
    room: 'Salle 204 - Bâtiment Éco',
    topics: [
      { id: 't5', name: 'Offre et demande', completed: true },
      { id: 't6', name: 'Élasticité', completed: true },
      { id: 't7', name: 'Concurrence pure et parfaite', completed: true },
      { id: 't8', name: 'Monopole', completed: false },
      { id: 't9', name: 'Externalités', completed: false },
    ],
    progress: 60,
    priority: 'important',
    color: '#F59E0B',
  },
  {
    id: '3',
    subject: 'Algorithmes',
    date: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
    time: '10:30',
    room: 'Labo Info - Bâtiment Sciences',
    topics: [
      { id: 't10', name: 'Tri et recherche', completed: true },
      { id: 't11', name: 'Graphes', completed: false },
      { id: 't12', name: 'Programmation dynamique', completed: false },
      { id: 't13', name: 'Complexité', completed: false },
    ],
    progress: 25,
    priority: 'urgent',
    color: '#8B5CF6',
  },
  {
    id: '4',
    subject: 'Histoire',
    date: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
    time: '08:00',
    room: 'Amphi C - Bâtiment Lettres',
    topics: [
      { id: 't14', name: 'Révolution française', completed: true },
      { id: 't15', name: 'Première Guerre mondiale', completed: true },
      { id: 't16', name: 'Seconde Guerre mondiale', completed: true },
      { id: 't17', name: 'Guerre froide', completed: false },
    ],
    progress: 75,
    priority: 'normal',
    color: '#EF4444',
  },
  {
    id: '5',
    subject: 'Comptabilité',
    date: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
    time: '16:00',
    room: 'Salle 112 - Bâtiment Gestion',
    topics: [
      { id: 't18', name: 'Bilan comptable', completed: true },
      { id: 't19', name: 'Compte de résultat', completed: false },
      { id: 't20', name: 'Amortissements', completed: false },
      { id: 't21', name: 'TVA', completed: false },
      { id: 't22', name: 'Provisions', completed: false },
    ],
    progress: 20,
    priority: 'important',
    color: '#3B82F6',
  },
  {
    id: '6',
    subject: 'Anglais',
    date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
    time: '11:00',
    room: 'Salle 305 - Bâtiment Langues',
    topics: [
      { id: 't23', name: 'Grammar tenses', completed: true },
      { id: 't24', name: 'Essay writing', completed: true },
      { id: 't25', name: 'Reading comprehension', completed: true },
      { id: 't26', name: 'Oral expression', completed: false },
    ],
    progress: 75,
    priority: 'normal',
    color: '#EC4899',
  },
]

const mockPastExams: Exam[] = [
  {
    id: 'p1',
    subject: 'Philosophie',
    date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    time: '09:00',
    room: 'Amphi B',
    topics: [],
    progress: 100,
    priority: 'normal',
    color: '#6B7280',
    isPast: true,
    score: 15.5,
  },
  {
    id: 'p2',
    subject: 'Mathématiques',
    date: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
    time: '14:00',
    room: 'Salle 101',
    topics: [],
    progress: 100,
    priority: 'normal',
    color: '#6B7280',
    isPast: true,
    score: 12,
  },
  {
    id: 'p3',
    subject: 'Sociologie',
    date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    time: '10:00',
    room: 'Amphi D',
    topics: [],
    progress: 100,
    priority: 'normal',
    color: '#6B7280',
    isPast: true,
    score: 16,
  },
]

const mockStudyPlan: StudyDay[] = [
  {
    day: "Aujourd'hui",
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    sessions: [
      { subject: 'Droit Civil', duration: 2, topic: 'Droit de propriété', priority: true },
      { subject: 'Algorithmes', duration: 1.5, topic: 'Graphes', priority: true },
      { subject: 'Anglais', duration: 1, topic: 'Oral expression', priority: false },
    ],
  },
  {
    day: 'Demain',
    date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    sessions: [
      { subject: 'Droit Civil', duration: 2, topic: 'Personnes et famille', priority: true },
      { subject: 'Microéconomie', duration: 1.5, topic: 'Monopole', priority: false },
    ],
  },
  {
    day: 'J+2',
    date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    sessions: [
      { subject: 'Algorithmes', duration: 2, topic: 'Programmation dynamique', priority: true },
      { subject: 'Comptabilité', duration: 1, topic: 'Compte de résultat', priority: false },
    ],
  },
  {
    day: 'J+3',
    date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    sessions: [
      { subject: 'Microéconomie', duration: 2, topic: 'Externalités', priority: true },
      { subject: 'Histoire', duration: 1, topic: 'Guerre froide', priority: false },
    ],
  },
  {
    day: 'J+4',
    date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    sessions: [
      { subject: 'Droit Civil', duration: 1.5, topic: 'Révision générale', priority: true },
      { subject: 'Comptabilité', duration: 2, topic: 'Amortissements', priority: true },
    ],
  },
  {
    day: 'J+5',
    date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    sessions: [
      { subject: 'Algorithmes', duration: 2, topic: 'Complexité', priority: true },
      { subject: 'Anglais', duration: 1, topic: 'Révision générale', priority: false },
    ],
  },
  {
    day: 'J+6',
    date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    sessions: [
      { subject: 'Histoire', duration: 1.5, topic: 'Révision générale', priority: false },
      { subject: 'Comptabilité', duration: 2, topic: 'TVA et Provisions', priority: true },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCountdown(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function getPriorityConfig(priority: Priority) {
  switch (priority) {
    case 'urgent':
      return { label: 'Urgent', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 border-red-200' }
    case 'important':
      return { label: 'Important', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' }
    case 'normal':
      return { label: 'Normal', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' }
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CircularProgress({ value, size = 64, strokeWidth = 5, color = '#10B981' }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-sm font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  )
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [countdown, setCountdown] = useState(getCountdown(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(targetDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-col items-center">
        <motion.span
          key={`d-${countdown.days}`}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-gray-900 tabular-nums"
        >
          {countdown.days}
        </motion.span>
        <span className="text-[10px] text-gray-400 uppercase">jours</span>
      </div>
      <span className="text-gray-300 font-light text-lg">:</span>
      <div className="flex flex-col items-center">
        <motion.span
          key={`h-${countdown.hours}`}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-gray-900 tabular-nums"
        >
          {String(countdown.hours).padStart(2, '0')}
        </motion.span>
        <span className="text-[10px] text-gray-400 uppercase">heures</span>
      </div>
      <span className="text-gray-300 font-light text-lg">:</span>
      <div className="flex flex-col items-center">
        <motion.span
          key={`m-${countdown.minutes}`}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-gray-900 tabular-nums"
        >
          {String(countdown.minutes).padStart(2, '0')}
        </motion.span>
        <span className="text-[10px] text-gray-400 uppercase">min</span>
      </div>
      <span className="text-gray-300 font-light text-lg">:</span>
      <div className="flex flex-col items-center">
        <motion.span
          key={`s-${countdown.seconds}`}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-emerald-600 tabular-nums"
        >
          {String(countdown.seconds).padStart(2, '0')}
        </motion.span>
        <span className="text-[10px] text-gray-400 uppercase">sec</span>
      </div>
    </div>
  )
}

// ─── Exam Card ───────────────────────────────────────────────────────────────

function ExamCard({ exam, index }: { exam: Exam; index: number }) {
  const priorityConfig = getPriorityConfig(exam.priority)
  const PriorityIcon = priorityConfig.icon
  const completedTopics = exam.topics.filter((t) => t.completed).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.12)' }}
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
        <div className="h-1.5" style={{ backgroundColor: exam.color }} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className="text-white border-0 font-semibold text-xs px-2"
                  style={{ backgroundColor: exam.color }}
                >
                  {exam.subject}
                </Badge>
                <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border', priorityConfig.bg, priorityConfig.color)}>
                  <PriorityIcon className="h-3 w-3" />
                  {priorityConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="capitalize">{formatDate(exam.date)}</span>
              </div>
            </div>
            <CircularProgress value={exam.progress} color={exam.color} />
          </div>

          {/* Countdown */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <CountdownTimer targetDate={exam.date} />
          </div>

          {/* Info row */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{exam.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{exam.room}</span>
            </div>
          </div>

          {/* Topics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Sujets à réviser</span>
              <span className="text-xs text-gray-400">{completedTopics}/{exam.topics.length} terminés</span>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
              {exam.topics.map((topic) => (
                <div key={topic.id} className="flex items-center gap-2 text-sm">
                  {topic.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300 shrink-0" />
                  )}
                  <span className={cn(topic.completed ? 'text-gray-400 line-through' : 'text-gray-700')}>
                    {topic.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Timeline View ───────────────────────────────────────────────────────────

function TimelineView({ exams, pastExams }: { exams: Exam[]; pastExams: Exam[] }) {
  const allExams = [...pastExams, ...exams].sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-8">
        {allExams.map((exam, i) => {
          const isPast = exam.isPast
          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  'absolute -left-5 top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm',
                  isPast ? 'bg-gray-400' : 'bg-emerald-500'
                )}
                style={!isPast ? { backgroundColor: exam.color } : undefined}
              />

              <Card className={cn('border-0 shadow-sm', isPast && 'opacity-60')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn('text-white border-0 text-xs', isPast && 'bg-gray-400')}
                        style={!isPast ? { backgroundColor: exam.color } : undefined}
                      >
                        {exam.subject}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {formatDate(exam.date)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {exam.time} · {exam.room}
                        </p>
                      </div>
                    </div>

                    {isPast ? (
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-600">{exam.score}/20</p>
                        <p className="text-xs text-gray-400">Note obtenue</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {getCountdown(exam.date).days}j restants
                          </p>
                          <Progress value={exam.progress} className="w-20 h-1.5 mt-1" />
                        </div>
                        <span className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border',
                          getPriorityConfig(exam.priority).bg,
                          getPriorityConfig(exam.priority).color
                        )}>
                          {getPriorityConfig(exam.priority).label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Study milestones between exams */}
                  {!isPast && exam.topics.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1.5">
                        {exam.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic.id}
                            className={cn(
                              'text-[11px] px-2 py-0.5 rounded-full',
                              topic.completed
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-500'
                            )}
                          >
                            {topic.completed ? '✓ ' : ''}{topic.name}
                          </span>
                        ))}
                        {exam.topics.length > 3 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400">
                            +{exam.topics.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Calendar View ───────────────────────────────────────────────────────────

function CalendarView({ exams }: { exams: Exam[] }) {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Monday-based

  const days: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const examDates: Record<number, Exam[]> = {}
  exams.forEach((exam) => {
    if (exam.date.getMonth() === currentMonth && exam.date.getFullYear() === currentYear) {
      const day = exam.date.getDate()
      if (!examDates[day]) examDates[day] = []
      examDates[day].push(exam)
    }
  })

  const monthName = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-lg font-bold text-gray-900 capitalize mb-4">{monthName}</h3>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
          ))}
          {days.map((day, i) => {
            const isToday = day === today.getDate()
            const dayExams = day ? examDates[day] || [] : []
            return (
              <div
                key={i}
                className={cn(
                  'min-h-[72px] p-1.5 rounded-lg border text-sm transition-colors',
                  day ? 'border-gray-100 bg-white hover:bg-gray-50' : 'border-transparent',
                  isToday && 'border-emerald-300 bg-emerald-50/50'
                )}
              >
                {day && (
                  <>
                    <span className={cn(
                      'text-xs font-medium',
                      isToday ? 'text-emerald-600 font-bold' : 'text-gray-500'
                    )}>
                      {day}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayExams.map((exam) => (
                        <div
                          key={exam.id}
                          className="text-[10px] px-1 py-0.5 rounded text-white font-medium truncate"
                          style={{ backgroundColor: exam.color }}
                        >
                          {exam.subject}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Study Plan Sidebar ──────────────────────────────────────────────────────

function StudyPlanSidebar() {
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2500)
  }

  const totalHours = mockStudyPlan.reduce(
    (acc, day) => acc + day.sessions.reduce((s, sess) => s + sess.duration, 0),
    0
  )

  return (
    <div className="space-y-5">
      {/* AI Study Plan */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-bold text-base">Plan d'étude IA</h3>
          </div>
          <p className="text-emerald-100 text-xs">
            Recommandations personnalisées basées sur vos examens
          </p>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">7 prochains jours</span>
            <Badge variant="outline" className="text-xs">{totalHours.toFixed(1)}h planifiées</Badge>
          </div>

          <ScrollArea className="max-h-80">
            <div className="space-y-3 pr-2">
              {mockStudyPlan.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-gray-900">{day.day}</span>
                    <span className="text-[10px] text-gray-400">{day.date}</span>
                  </div>
                  <div className="space-y-1.5 ml-2">
                    {day.sessions.map((session, j) => (
                      <div
                        key={j}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-lg text-xs',
                          session.priority ? 'bg-red-50 border border-red-100' : 'bg-gray-50'
                        )}
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: subjectColors[session.subject] || '#6B7280' }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-700 truncate">{session.subject}</span>
                            {session.priority && (
                              <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                            )}
                          </div>
                          <span className="text-gray-400 truncate block">{session.topic}</span>
                        </div>
                        <span className="text-gray-400 shrink-0">{session.duration}h</span>
                      </div>
                    ))}
                  </div>
                  {i < mockStudyPlan.length - 1 && <Separator className="my-2" />}
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <Button
            onClick={handleGenerate}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            disabled={generating}
          >
            <motion.div
              animate={generating ? { rotate: 360 } : {}}
              transition={generating ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Sparkles className="h-4 w-4 mr-2" />
            </motion.div>
            {generating ? 'Génération en cours...' : 'Générer un plan IA'}
          </Button>
        </CardContent>
      </Card>

      {/* Priority Topics */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-red-500" />
            Sujets prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-2.5">
            {[
              { subject: 'Droit Civil', topic: 'Droit de propriété', urgency: 95 },
              { subject: 'Algorithmes', topic: 'Graphes', urgency: 88 },
              { subject: 'Algorithmes', topic: 'Programmation dynamique', urgency: 82 },
              { subject: 'Comptabilité', topic: 'Amortissements', urgency: 70 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: subjectColors[item.subject] || '#6B7280' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.topic}</p>
                  <p className="text-xs text-gray-400">{item.subject}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.urgency > 85 ? '#EF4444' : item.urgency > 70 ? '#F59E0B' : '#10B981' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.urgency}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">{item.urgency}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Add Exam Dialog ─────────────────────────────────────────────────────────

function AddExamDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [subject, setSubject] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [room, setRoom] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [color, setColor] = useState('#10B981')
  const [topics, setTopics] = useState<string[]>([])
  const [newTopic, setNewTopic] = useState('')

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()])
      setNewTopic('')
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic))
  }

  const handleSave = () => {
    onOpenChange(false)
    // Reset
    setSubject('')
    setDate('')
    setTime('')
    setRoom('')
    setPriority('normal')
    setColor('#10B981')
    setTopics([])
    setNewTopic('')
  }

  const colorOptions = ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#3B82F6', '#EC4899', '#14B8A6', '#F97316']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-emerald-50">
              <Calendar className="h-5 w-5 text-emerald-600" />
            </div>
            Ajouter un examen
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Subject */}
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Matière</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(subjectColors).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Heure</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Room */}
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Salle / Lieu</Label>
            <Input
              placeholder="ex: Amphi A - Bâtiment Droit"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Priorité</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">🔴 Urgent</SelectItem>
                <SelectItem value="important">🟡 Important</SelectItem>
                <SelectItem value="normal">🟢 Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Couleur</Label>
            <div className="flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all border-2',
                    color === c ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Sujets à réviser</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Ajouter un sujet..."
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddTopic}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {topics.map((topic) => (
                  <Badge key={topic} variant="secondary" className="flex items-center gap-1 text-xs">
                    {topic}
                    <button onClick={() => handleRemoveTopic(topic)} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter l&apos;examen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ExamTrackerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [dialogOpen, setDialogOpen] = useState(false)

  const upcomingExams = mockExams
  const allExams = [...mockPastExams, ...mockExams]

  // Stats
  const nextExamDays = getCountdown(upcomingExams[0]?.date || new Date()).days
  const totalPlannedHours = mockStudyPlan.reduce(
    (acc, day) => acc + day.sessions.reduce((s, sess) => s + sess.duration, 0), 0
  )
  const avgProgress = Math.round(
    upcomingExams.reduce((acc, e) => acc + e.progress, 0) / upcomingExams.length
  )

  const stats = [
    {
      label: 'Prochains examens',
      value: upcomingExams.length,
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Jours jusqu\'au prochain',
      value: `${nextExamDays}j`,
      icon: Timer,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Heures de révision planifiées',
      value: `${totalPlannedHours.toFixed(0)}h`,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Taux de préparation',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ]

  const viewModes: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
    { key: 'cards', label: 'Cartes', icon: <LayoutGrid className="h-4 w-4" /> },
    { key: 'timeline', label: 'Timeline', icon: <AlignLeft className="h-4 w-4" /> },
    { key: 'calendar', label: 'Calendrier', icon: <CalendarDays className="h-4 w-4" /> },
  ]

  return (
    <div className="h-full bg-gray-50/50">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                Suivi des Examens
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Planifiez vos révisions et suivez votre progression vers les examens
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-0.5">
                {viewModes.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                      viewMode === mode.key
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {mode.icon}
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Add exam button */}
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Ajouter un examen</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg', stat.bg)}>
                          <Icon className={cn('h-5 w-5', stat.color)} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-xs text-gray-500 leading-tight">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left / Main area */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {viewMode === 'cards' && (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Examens à venir</h2>
                      <Badge variant="outline" className="text-xs">{upcomingExams.length} examens</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {upcomingExams.map((exam, i) => (
                        <ExamCard key={exam.id} exam={exam} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {viewMode === 'timeline' && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Chronologie des examens</h2>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> À venir
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-gray-400" /> Passé
                        </span>
                      </div>
                    </div>
                    <TimelineView exams={upcomingExams} pastExams={mockPastExams} />
                  </motion.div>
                )}

                {viewMode === 'calendar' && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900">Vue calendrier</h2>
                    </div>
                    <CalendarView exams={upcomingExams} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Sidebar - Study Plan */}
            <div className="space-y-5">
              <StudyPlanSidebar />
            </div>
          </div>

          {/* Past Exams Section (only in cards view) */}
          {viewMode === 'cards' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Examens passés</h2>
                <Badge variant="outline" className="text-xs">{mockPastExams.length} examens</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockPastExams.map((exam, i) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm opacity-75 hover:opacity-100 transition-opacity">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge className="bg-gray-400 text-white border-0 text-xs">{exam.subject}</Badge>
                            <p className="text-sm text-gray-500 mt-1.5 capitalize">
                              {formatDate(exam.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-700">{exam.score}</p>
                            <p className="text-xs text-gray-400">/20</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Progress value={(exam.score || 0) / 20 * 100} className="h-1.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Add Exam Dialog */}
      <AddExamDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
