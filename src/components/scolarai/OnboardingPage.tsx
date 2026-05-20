'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  Brain,
  Target,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sun,
  Moon,
  Eye,
  Ear,
  PenTool,
  Zap,
  Rocket,
  PartyPopper,
  Scale,
  TrendingUp,
  Monitor,
  History,
  Calculator,
  Briefcase,
  Atom,
  Languages,
  Sunset,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// ── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

interface Subject {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  bgSelected: string
}

interface StudyStyle {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

interface StudyGoal {
  id: string
  label: string
  icon: React.ReactNode
}

interface StudyTime {
  id: string
  label: string
  icon: React.ReactNode
}

// ── Data ─────────────────────────────────────────────────────────────────────

const SUBJECTS: Subject[] = [
  {
    id: 'droit',
    label: 'Droit',
    icon: <Scale className="h-6 w-6" />,
    color: 'text-amber-600',
    bgSelected: 'bg-amber-50 border-amber-400',
  },
  {
    id: 'economie',
    label: 'Économie',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'text-emerald-600',
    bgSelected: 'bg-emerald-50 border-emerald-400',
  },
  {
    id: 'informatique',
    label: 'Informatique',
    icon: <Monitor className="h-6 w-6" />,
    color: 'text-blue-600',
    bgSelected: 'bg-blue-50 border-blue-400',
  },
  {
    id: 'histoire',
    label: 'Histoire',
    icon: <History className="h-6 w-6" />,
    color: 'text-orange-600',
    bgSelected: 'bg-orange-50 border-orange-400',
  },
  {
    id: 'mathematiques',
    label: 'Mathématiques',
    icon: <Calculator className="h-6 w-6" />,
    color: 'text-purple-600',
    bgSelected: 'bg-purple-50 border-purple-400',
  },
  {
    id: 'gestion',
    label: 'Gestion',
    icon: <Briefcase className="h-6 w-6" />,
    color: 'text-teal-600',
    bgSelected: 'bg-teal-50 border-teal-400',
  },
  {
    id: 'physique',
    label: 'Physique',
    icon: <Atom className="h-6 w-6" />,
    color: 'text-red-600',
    bgSelected: 'bg-red-50 border-red-400',
  },
  {
    id: 'langues',
    label: 'Langues',
    icon: <Languages className="h-6 w-6" />,
    color: 'text-pink-600',
    bgSelected: 'bg-pink-50 border-pink-400',
  },
]

const STUDY_STYLES: StudyStyle[] = [
  {
    id: 'visuel',
    label: 'Visuel',
    description: 'Diagrammes, cartes mentales, vidéos',
    icon: <Eye className="h-7 w-7" />,
  },
  {
    id: 'auditif',
    label: 'Auditif',
    description: 'Podcasts, discussions, explications orales',
    icon: <Ear className="h-7 w-7" />,
  },
  {
    id: 'lecture',
    label: 'Lecture / Écriture',
    description: 'Notes, résumés, fiches de révision',
    icon: <PenTool className="h-7 w-7" />,
  },
]

const STUDY_GOALS: StudyGoal[] = [
  { id: '30min', label: '30 min', icon: <Clock className="h-4 w-4" /> },
  { id: '1h', label: '1 h', icon: <Clock className="h-5 w-5" /> },
  { id: '2h', label: '2 h', icon: <Clock className="h-6 w-6" /> },
  { id: '3h+', label: '3 h+', icon: <Zap className="h-6 w-6" /> },
]

const STUDY_TIMES: StudyTime[] = [
  { id: 'matin', label: 'Matin', icon: <Sun className="h-5 w-5" /> },
  { id: 'apres-midi', label: 'Après-midi', icon: <Sunset className="h-5 w-5" /> },
  { id: 'soir', label: 'Soir', icon: <Moon className="h-5 w-5" /> },
]

const STEP_META: Record<Step, { title: string; icon: React.ReactNode }> = {
  1: { title: 'Bienvenue', icon: <Sparkles className="h-4 w-4" /> },
  2: { title: 'Matières', icon: <BookOpen className="h-4 w-4" /> },
  3: { title: 'Préférences', icon: <Brain className="h-4 w-4" /> },
  4: { title: 'C\'est parti !', icon: <Rocket className="h-4 w-4" /> },
}

// ── Confetti Particle ────────────────────────────────────────────────────────

function ConfettiParticle({ delay }: { delay: number }) {
  const hue = Math.floor(Math.random() * 360)
  const left = Math.random() * 100
  const duration = 2 + Math.random() * 2
  const size = 6 + Math.random() * 6
  const drift = (Math.random() - 0.5) * 80

  return (
    <motion.div
      className="absolute top-0 rounded-sm pointer-events-none"
      style={{
        left: `${left}%`,
        width: size,
        height: size * 0.6,
        backgroundColor: `hsl(${hue}, 80%, 60%)`,
      }}
      initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
      animate={{
        y: '100vh',
        x: drift,
        rotate: 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeIn',
      }}
    />
  )
}

function ConfettiBurst() {
  const particles = Array.from({ length: 50 }, (_, i) => i)
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((i) => (
        <ConfettiParticle key={i} delay={i * 0.04} />
      ))}
    </div>
  )
}

// ── Animated Emoji ───────────────────────────────────────────────────────────

function FloatingEmoji({ emoji, className }: { emoji: string; className?: string }) {
  return (
    <motion.span
      className={`text-5xl sm:text-6xl select-none ${className ?? ''}`}
      animate={{
        y: [0, -12, 0],
        rotate: [0, 8, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.span>
  )
}

// ── Step Indicators ──────────────────────────────────────────────────────────

function StepIndicators({ currentStep }: { currentStep: Step }) {
  const progress = ((currentStep - 1) / 3) * 100

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Progress bar */}
      <Progress
        value={progress}
        className="h-1.5 mb-4 bg-gray-200 [&>[data-slot=progress-indicator]]:bg-emerald-500"
      />

      {/* Step dots and labels */}
      <div className="flex items-center justify-between">
        {([1, 2, 3, 4] as Step[]).map((step) => {
          const isActive = step === currentStep
          const isCompleted = step < currentStep
          const meta = STEP_META[step]

          return (
            <div key={step} className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`
                  flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300
                  ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                  ${isActive ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-500 ring-offset-2' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                `}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : meta.icon}
              </motion.div>
              <span
                className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-emerald-600' : isCompleted ? 'text-emerald-500' : 'text-gray-400'
                }`}
              >
                {meta.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 1 – Welcome ────────────────────────────────────────────────────────

function WelcomeStep({ userName }: { userName: string }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="flex flex-col items-center text-center space-y-6"
    >
      {/* Animated illustration */}
      <div className="relative">
        <motion.div
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-50 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap className="h-14 w-14 sm:h-16 sm:w-16 text-emerald-500" />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ y: [0, -6, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="h-7 w-7 text-amber-400" />
        </motion.div>
      </div>

      {/* Floating emojis around the illustration */}
      <div className="flex items-center gap-4">
        <FloatingEmoji emoji="📚" className="opacity-60" />
        <FloatingEmoji emoji="🧠" className="opacity-60" />
        <FloatingEmoji emoji="🎯" className="opacity-60" />
      </div>

      {/* Text */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Bienvenue sur ScolarAI{userName ? `, ${userName}` : ''} !
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Votre compagnon intelligent pour réviser efficacement. Grâce à l&apos;IA,
          créez des fiches, générez des quiz et suivez vos progrès en toute simplicité.
        </p>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1 px-3">
          <Brain className="h-3.5 w-3.5" /> IA adaptative
        </Badge>
        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 py-1 px-3">
          <Target className="h-3.5 w-3.5" /> Objectifs personnalisés
        </Badge>
        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 gap-1.5 py-1 px-3">
          <BookOpen className="h-3.5 w-3.5" /> Fiches & Quiz
        </Badge>
      </div>
    </motion.div>
  )
}

// ── Step 2 – Choose Subjects ────────────────────────────────────────────────

function SubjectsStep({
  selected,
  onToggle,
}: {
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <motion.div
      key="subjects"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="flex flex-col items-center text-center space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Quelles matières étudiez-vous ?
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Sélectionnez au moins une matière pour personnaliser votre expérience
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg">
        {SUBJECTS.map((subject, index) => {
          const isSelected = selected.has(subject.id)

          return (
            <motion.button
              key={subject.id}
              type="button"
              onClick={() => onToggle(subject.id)}
              className={`
                relative flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? `${subject.bgSelected} shadow-md`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* Check badge */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm"
                  >
                    <Check className="h-3.5 w-3.5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              <span className={isSelected ? subject.color : 'text-gray-400'}>
                {subject.icon}
              </span>
              <span
                className={`text-sm font-medium ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}
              >
                {subject.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {selected.size > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-emerald-600 font-medium"
        >
          {selected.size} matière{selected.size > 1 ? 's' : ''} sélectionnée{selected.size > 1 ? 's' : ''}
        </motion.p>
      )}
    </motion.div>
  )
}

// ── Step 3 – Study Preferences ──────────────────────────────────────────────

function PreferencesStep({
  studyStyle,
  setStudyStyle,
  studyGoal,
  setStudyGoal,
  studyTime,
  setStudyTime,
}: {
  studyStyle: string | null
  setStudyStyle: (v: string) => void
  studyGoal: string | null
  setStudyGoal: (v: string) => void
  studyTime: string | null
  setStudyTime: (v: string) => void
}) {
  return (
    <motion.div
      key="preferences"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="flex flex-col items-center text-center space-y-8 w-full max-w-lg"
    >
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Vos préférences d&apos;étude
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Aidez-nous à adapter votre expérience d&apos;apprentissage
        </p>
      </div>

      {/* Study style */}
      <div className="w-full space-y-3">
        <label className="text-sm font-semibold text-gray-700 text-left block">
          Style d&apos;apprentissage
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STUDY_STYLES.map((style) => {
            const isActive = studyStyle === style.id
            return (
              <motion.button
                key={style.id}
                type="button"
                onClick={() => setStudyStyle(style.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-emerald-50 border-emerald-400 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={isActive ? 'text-emerald-600' : 'text-gray-400'}>
                  {style.icon}
                </span>
                <span className={`text-sm font-semibold ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                  {style.label}
                </span>
                <span className="text-xs text-gray-400 leading-snug">
                  {style.description}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Daily study goal */}
      <div className="w-full space-y-3">
        <label className="text-sm font-semibold text-gray-700 text-left block">
          Objectif quotidien
        </label>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {STUDY_GOALS.map((goal) => {
            const isActive = studyGoal === goal.id
            return (
              <motion.button
                key={goal.id}
                type="button"
                onClick={() => setStudyGoal(goal.id)}
                className={`
                  flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-emerald-50 border-emerald-400 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={isActive ? 'text-emerald-600' : 'text-gray-400'}>
                  {goal.icon}
                </span>
                <span className={`text-sm font-semibold ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                  {goal.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Preferred study time */}
      <div className="w-full space-y-3">
        <label className="text-sm font-semibold text-gray-700 text-left block">
          Moment préféré
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {STUDY_TIMES.map((time) => {
            const isActive = studyTime === time.id
            return (
              <motion.button
                key={time.id}
                type="button"
                onClick={() => setStudyTime(time.id)}
                className={`
                  flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-emerald-50 border-emerald-400 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={isActive ? 'text-emerald-600' : 'text-gray-400'}>
                  {time.icon}
                </span>
                <span className={`text-sm font-semibold ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                  {time.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ── Step 4 – Ready! ─────────────────────────────────────────────────────────

function ReadyStep({
  userName,
  selectedSubjects,
  studyStyle,
  studyGoal,
  studyTime,
}: {
  userName: string
  selectedSubjects: Set<string>
  studyStyle: string | null
  studyGoal: string | null
  studyTime: string | null
}) {
  const selectedLabels = SUBJECTS.filter((s) => selectedSubjects.has(s.id)).map((s) => s.label)
  const styleLabel = STUDY_STYLES.find((s) => s.id === studyStyle)?.label ?? '—'
  const goalLabel = STUDY_GOALS.find((g) => g.id === studyGoal)?.label ?? '—'
  const timeLabel = STUDY_TIMES.find((t) => t.id === studyTime)?.label ?? '—'

  return (
    <motion.div
      key="ready"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="flex flex-col items-center text-center space-y-6"
    >
      {/* Celebration illustration */}
      <motion.div
        className="relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
      >
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PartyPopper className="h-14 w-14 sm:h-16 sm:w-16 text-emerald-500" />
          </motion.div>
        </div>
        {/* Sparkle accents */}
        <motion.div
          className="absolute -top-2 -left-2"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="h-5 w-5 text-amber-400" />
        </motion.div>
        <motion.div
          className="absolute -bottom-1 -right-3"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Vous êtes prêt{userName ? `, ${userName}` : ''} !
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Voici un résumé de vos choix. Vous pourrez les modifier à tout moment.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white shadow-lg py-6">
          <CardContent className="space-y-4 text-left">
            {/* Subjects */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Matières
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLabels.map((label) => (
                  <Badge
                    key={label}
                    className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs py-0.5"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Style d&apos;apprentissage
              </span>
              <p className="text-sm text-gray-700 font-medium">{styleLabel}</p>
            </div>

            {/* Goal */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Objectif quotidien
              </span>
              <p className="text-sm text-gray-700 font-medium">{goalLabel}</p>
            </div>

            {/* Time */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Moment préféré
              </span>
              <p className="text-sm text-gray-700 font-medium">{timeLabel}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { setCurrentPage, user } = useAppStore()

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set())
  const [studyStyle, setStudyStyle] = useState<string | null>(null)
  const [studyGoal, setStudyGoal] = useState<string | null>(null)
  const [studyTime, setStudyTime] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const userName = user?.name ?? ''

  // ── Toggle subject selection ──
  const toggleSubject = useCallback((id: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // ── Validation ──
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return selectedSubjects.size > 0
      case 3:
        return studyStyle !== null && studyGoal !== null && studyTime !== null
      case 4:
        return true
      default:
        return false
    }
  }

  // ── Navigation ──
  const goNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep((prev) => (prev + 1) as Step)
      if (currentStep === 3) {
        setShowConfetti(true)
      }
    }
  }

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSkip = () => {
    setCurrentPage('dashboard')
  }

  const handleFinish = () => {
    setCurrentPage('dashboard')
  }

  // ── Confetti cleanup ──
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  // ── Render ──
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-amber-100/30 blur-2xl" />
      </div>

      {/* Confetti */}
      {showConfetti && <ConfettiBurst />}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6 relative z-10"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          ScolarAI
        </span>
      </motion.div>

      {/* Skip button */}
      {currentStep < 4 && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleSkip}
          className="absolute top-5 right-5 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium cursor-pointer z-10"
        >
          Passer
        </motion.button>
      )}

      {/* Step indicators */}
      <div className="w-full max-w-md relative z-10">
        <StepIndicators currentStep={currentStep} />
      </div>

      {/* Step content */}
      <div className="w-full max-w-2xl flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {currentStep === 1 && <WelcomeStep userName={userName} />}
          {currentStep === 2 && (
            <SubjectsStep
              selected={selectedSubjects}
              onToggle={toggleSubject}
            />
          )}
          {currentStep === 3 && (
            <PreferencesStep
              studyStyle={studyStyle}
              setStudyStyle={setStudyStyle}
              studyGoal={studyGoal}
              setStudyGoal={setStudyGoal}
              studyTime={studyTime}
              setStudyTime={setStudyTime}
            />
          )}
          {currentStep === 4 && (
            <ReadyStep
              userName={userName}
              selectedSubjects={selectedSubjects}
              studyStyle={studyStyle}
              studyGoal={studyGoal}
              studyTime={studyTime}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center gap-3 mt-8 relative z-10"
      >
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={goPrev}
            className="h-11 px-6 border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Précédent
          </Button>
        )}

        {currentStep < 4 ? (
          <Button
            onClick={goNext}
            disabled={!canProceed()}
            className="h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            className="h-11 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold cursor-pointer text-base"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Commencer !
          </Button>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 text-xs text-gray-400 relative z-10"
      >
        © 2026 ScolarAI. Tous droits réservés.
      </motion.p>
    </div>
  )
}
