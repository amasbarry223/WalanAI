'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  BookOpen,
  CloudRain,
  Trees,
  Coffee as CafeIcon,
  Radio,
  Target,
  Clock,
  Flame,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type TimerMode = 'work' | 'short-break' | 'long-break'

interface ModeConfig {
  label: string
  duration: number // in seconds
  color: string
  bgColor: string
  ringColor: string
}

interface AmbientSound {
  id: string
  label: string
  icon: React.ReactNode
}

interface Subject {
  id: string
  label: string
  emoji: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const MODES: Record<TimerMode, ModeConfig> = {
  work: {
    label: 'Travail',
    duration: 25 * 60,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    ringColor: '#10B981',
  },
  'short-break': {
    label: 'Pause courte',
    duration: 5 * 60,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    ringColor: '#14B8A6',
  },
  'long-break': {
    label: 'Pause longue',
    duration: 15 * 60,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    ringColor: '#06B6D4',
  },
}

const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', label: 'Pluie', icon: <CloudRain className="h-4 w-4" /> },
  { id: 'forest', label: 'Forêt', icon: <Trees className="h-4 w-4" /> },
  { id: 'cafe', label: 'Café', icon: <CafeIcon className="h-4 w-4" /> },
  { id: 'whitenoise', label: 'Bruit blanc', icon: <Radio className="h-4 w-4" /> },
]

const SUBJECTS: Subject[] = [
  { id: 'maths', label: 'Mathématiques', emoji: '📐' },
  { id: 'francais', label: 'Français', emoji: '📝' },
  { id: 'histoire', label: 'Histoire', emoji: '📜' },
  { id: 'physique', label: 'Physique', emoji: '⚛️' },
  { id: 'informatique', label: 'Informatique', emoji: '💻' },
  { id: 'droit', label: 'Droit', emoji: '⚖️' },
  { id: 'economie', label: 'Économie', emoji: '📊' },
  { id: 'langues', label: 'Langues', emoji: '🌍' },
]

const DAILY_GOAL_MINUTES = 240 // 4 hours
const SVG_CIRCLE_RADIUS = 120
const SVG_CIRCLE_CIRCUMFERENCE = 2 * Math.PI * SVG_CIRCLE_RADIUS

// ── Animation Variants ─────────────────────────────────────────────────────

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

const pulseVariants = {
  running: {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  paused: { scale: 1 },
}

// ── Helper ─────────────────────────────────────────────────────────────────

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (hours === 0) return `${mins} min`
  return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PomodoroPage() {
  const { setCurrentPage } = useAppStore()

  // Timer state
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(3) // mock: already 3 sessions done today

  // Focus subject
  const [selectedSubject, setSelectedSubject] = useState<string>('maths')

  // Ambient sounds
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set())

  // Mock stats
  const totalFocusMinutesToday = completedSessions * 25
  const avgSessionLength = completedSessions > 0 ? Math.round(totalFocusMinutesToday / completedSessions) : 0
  const dailyGoalProgress = Math.min((totalFocusMinutesToday / DAILY_GOAL_MINUTES) * 100, 100)

  const modeConfig = MODES[mode]

  // ── Timer Logic ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          // Auto-complete a work session
          if (mode === 'work') {
            setCompletedSessions((s) => s + 1)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, mode])

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true)
  }, [timeLeft])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(MODES[mode].duration)
  }, [mode])

  const handleModeChange = useCallback((newMode: string) => {
    const typedMode = newMode as TimerMode
    setIsRunning(false)
    setMode(typedMode)
    setTimeLeft(MODES[typedMode].duration)
  }, [])

  const toggleSound = useCallback((soundId: string) => {
    setActiveSounds((prev) => {
      const next = new Set(prev)
      if (next.has(soundId)) {
        next.delete(soundId)
      } else {
        next.add(soundId)
      }
      return next
    })
  }, [])

  // ── Derived values ────────────────────────────────────────────────────

  const totalDuration = MODES[mode].duration
  const progressFraction = totalDuration > 0 ? timeLeft / totalDuration : 0
  const strokeDashoffset = SVG_CIRCLE_CIRCUMFERENCE * (1 - progressFraction)

  const currentSubject = useMemo(
    () => SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0],
    [selectedSubject]
  )

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentPage('dashboard')}
          className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Timer className="h-6 w-6 text-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900">Pomodoro Timer</h1>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left Column: Timer ──────────────────────────────────────── */}
        <div className="flex-1 space-y-6">
          {/* Mode Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-11">
                <TabsTrigger
                  value="work"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-sm font-medium"
                >
                  <Brain className="h-4 w-4 mr-1.5" />
                  Travail
                </TabsTrigger>
                <TabsTrigger
                  value="short-break"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-sm font-medium"
                >
                  <Coffee className="h-4 w-4 mr-1.5" />
                  Pause courte
                </TabsTrigger>
                <TabsTrigger
                  value="long-break"
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-sm font-medium"
                >
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Pause longue
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Circular Timer */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 md:p-8 flex flex-col items-center">
                <motion.div
                  className="relative w-full max-w-[280px]"
                  variants={pulseVariants}
                  animate={isRunning ? 'running' : 'paused'}
                >
                  <svg
                    width="100%"
                    viewBox="0 0 280 280"
                    className="transform -rotate-90"
                  >
                    {/* Background circle */}
                    <circle
                      cx="140"
                      cy="140"
                      r={SVG_CIRCLE_RADIUS}
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="140"
                      cy="140"
                      r={SVG_CIRCLE_RADIUS}
                      fill="none"
                      stroke={modeConfig.ringColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={SVG_CIRCLE_CIRCUMFERENCE}
                      strokeDashoffset={strokeDashoffset}
                      initial={false}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </svg>
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={timeLeft}
                        initial={{ opacity: 0.6, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-gray-900 tracking-tight">
                          {formatTime(timeLeft)}
                        </span>
                        <Badge
                          className={`mt-2 ${modeConfig.bgColor} ${modeConfig.color} border-0 font-medium`}
                        >
                          {modeConfig.label}
                        </Badge>
                      </motion.div>
                    </AnimatePresence>
                    {/* Subject indicator */}
                    <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-400">
                      <span>{currentSubject.emoji}</span>
                      <span>{currentSubject.label}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Controls */}
                <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 min-h-[44px] min-w-[44px]"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-5 w-5 text-gray-500" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 min-h-[44px] min-w-[44px]"
                      onClick={isRunning ? handlePause : handleStart}
                      disabled={timeLeft === 0 && !isRunning}
                    >
                      {isRunning ? (
                        <Pause className="h-7 w-7" />
                      ) : (
                        <Play className="h-7 w-7 ml-0.5" />
                      )}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 min-h-[44px] min-w-[44px]"
                      onClick={() => {
                        // Skip to end of session
                        setIsRunning(false)
                        setTimeLeft(0)
                        if (mode === 'work') {
                          setCompletedSessions((s) => s + 1)
                        }
                      }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-gray-500" />
                    </Button>
                  </motion.div>
                </div>

                {/* Session Counter */}
                <div className="mt-6 flex flex-col items-center gap-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    Sessions complétées
                  </p>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.max(completedSessions, 8) }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                      >
                        {i < completedSessions ? (
                          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-200" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">
                    {completedSessions} / 8 sessions
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Right Column: Settings & Stats ──────────────────────────── */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-6">
          {/* Focus Subject */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-emerald-500" />
                  Matière étudiée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {SUBJECTS.map((subject) => (
                    <motion.button
                      key={subject.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        selectedSubject === subject.id
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                          : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{subject.emoji}</span>
                      <span className="truncate">{subject.label}</span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Card */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  Statistiques du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <Clock className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-600">
                      {formatMinutes(totalFocusMinutesToday)}
                    </p>
                    <p className="text-[10px] text-emerald-600/70 uppercase tracking-wide">
                      Temps focus
                    </p>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-3 text-center">
                    <Flame className="h-5 w-5 text-teal-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-teal-600">{completedSessions}</p>
                    <p className="text-[10px] text-teal-600/70 uppercase tracking-wide">
                      Sessions
                    </p>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-3 text-center">
                    <BarChart3 className="h-5 w-5 text-cyan-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-cyan-600">{avgSessionLength} min</p>
                    <p className="text-[10px] text-cyan-600/70 uppercase tracking-wide">
                      Moyenne
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Goal */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5 text-emerald-500" />
                  Objectif du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {formatMinutes(totalFocusMinutesToday)} sur {formatMinutes(DAILY_GOAL_MINUTES)}
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {Math.round(dailyGoalProgress)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={dailyGoalProgress}
                      className="h-3 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-teal-500"
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    {dailyGoalProgress >= 100
                      ? '🎉 Objectif atteint ! Bravo !'
                      : `Encore ${formatMinutes(DAILY_GOAL_MINUTES - totalFocusMinutesToday)} pour atteindre votre objectif`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambient Sounds */}
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Radio className="h-5 w-5 text-emerald-500" />
                  Sons ambiants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {AMBIENT_SOUNDS.map((sound) => {
                    const isActive = activeSounds.has(sound.id)
                    return (
                      <motion.button
                        key={sound.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleSound(sound.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                          isActive
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className={isActive ? 'text-emerald-500' : 'text-gray-400'}>
                          {sound.icon}
                        </span>
                        <span>{sound.label}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            <div className="flex gap-0.5 items-end">
                              <motion.div
                                className="w-0.5 bg-emerald-500 rounded-full"
                                animate={{ height: ['4px', '10px', '6px', '12px', '4px'] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                              />
                              <motion.div
                                className="w-0.5 bg-emerald-500 rounded-full"
                                animate={{ height: ['8px', '4px', '12px', '6px', '8px'] }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                              />
                              <motion.div
                                className="w-0.5 bg-emerald-500 rounded-full"
                                animate={{ height: ['6px', '12px', '4px', '10px', '6px'] }}
                                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                              />
                            </div>
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
                {activeSounds.size > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-500 text-center mt-3 font-medium"
                  >
                    🎵 {activeSounds.size} son{activeSounds.size > 1 ? 's' : ''} actif{activeSounds.size > 1 ? 's' : ''}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
