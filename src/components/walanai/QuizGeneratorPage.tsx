'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
  BookOpen,
  Play,
  AlertTriangle,
  History,
  ListChecks,
  Timer,
  BarChart3,
  Loader2,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────

type QuizPhase = 'config' | 'playing' | 'results'

interface QuizConfig {
  subject: string
  difficulty: string
  numQuestions: number
  quizType: string
}

interface QuizQuestion {
  id: number
  subject: string
  difficulty: string
  type: 'qcm' | 'vrai-faux'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

// ─── Mock Data ───────────────────────────────────────────────────────

const mockQuestions: QuizQuestion[] = [
  {
    id: 1,
    subject: 'Droit',
    difficulty: 'Moyen',
    type: 'qcm',
    question: 'Quelle est la source principale du droit civil français ?',
    options: [
      'Le Code civil de 1804',
      'La Constitution de 1958',
      'Le Code pénal',
      'La Déclaration des droits de l\'homme',
    ],
    correctIndex: 0,
    explanation: 'Le Code civil, promulgué en 1804 sous Napoléon, est la source principale du droit civil français.',
  },
  {
    id: 2,
    subject: 'Droit',
    difficulty: 'Difficile',
    type: 'qcm',
    question: 'En droit des obligations, la force majeure requiert la réunion de trois conditions. Laquelle ne fait pas partie de ces conditions ?',
    options: [
      'L\'extériorité',
      'L\'imprévisibilité',
      'L\'irrésistibilité',
      'La réciprocité',
    ],
    correctIndex: 3,
    explanation: 'Les trois conditions de la force majeure sont : l\'extériorité, l\'imprévisibilité et l\'irrésistibilité. La réciprocité n\'en fait pas partie.',
  },
  {
    id: 3,
    subject: 'Microéconomie',
    difficulty: 'Facile',
    type: 'qcm',
    question: 'Que représente la courbe de demande sur un marché ?',
    options: [
      'La relation entre le prix et la quantité offerte',
      'La relation entre le prix et la quantité demandée',
      'La relation entre le revenu et la consommation',
      'La relation entre le coût et la production',
    ],
    correctIndex: 1,
    explanation: 'La courbe de demande représente la relation inverse entre le prix d\'un bien et la quantité demandée par les consommateurs.',
  },
  {
    id: 4,
    subject: 'Microéconomie',
    difficulty: 'Moyen',
    type: 'vrai-faux',
    question: 'L\'élasticité-prix de la demande est toujours positive.',
    options: [
      'Vrai',
      'Faux',
    ],
    correctIndex: 1,
    explanation: 'L\'élasticité-prix de la demande est généralement négative car la demande diminue quand le prix augmente (loi de la demande).',
  },
  {
    id: 5,
    subject: 'Algorithmes',
    difficulty: 'Facile',
    type: 'qcm',
    question: 'Quelle est la complexité temporelle de la recherche binaire dans un tableau trié ?',
    options: [
      'O(n)',
      'O(n²)',
      'O(log n)',
      'O(1)',
    ],
    correctIndex: 2,
    explanation: 'La recherche binaire divise l\'espace de recherche par 2 à chaque étape, d\'où une complexité en O(log n).',
  },
  {
    id: 6,
    subject: 'Algorithmes',
    difficulty: 'Moyen',
    type: 'qcm',
    question: 'Quel algorithme de tri a une complexité moyenne de O(n log n) et utilise la stratégie "diviser pour régner" ?',
    options: [
      'Tri à bulles',
      'Tri par insertion',
      'Tri fusion (Merge Sort)',
      'Tri par sélection',
    ],
    correctIndex: 2,
    explanation: 'Le tri fusion utilise la stratégie "diviser pour régner" avec une complexité de O(n log n) dans tous les cas.',
  },
  {
    id: 7,
    subject: 'Histoire',
    difficulty: 'Facile',
    type: 'qcm',
    question: 'En quelle année la Révolution française a-t-elle commencé ?',
    options: [
      '1776',
      '1789',
      '1804',
      '1815',
    ],
    correctIndex: 1,
    explanation: 'La Révolution française a commencé en 1789 avec la prise de la Bastille le 14 juillet.',
  },
  {
    id: 8,
    subject: 'Histoire',
    difficulty: 'Moyen',
    type: 'vrai-faux',
    question: 'Le Congrès de Vienne s\'est tenu après la défaite de Napoléon à Waterloo en 1815.',
    options: [
      'Vrai',
      'Faux',
    ],
    correctIndex: 1,
    explanation: 'Le Congrès de Vienne s\'est tenu de 1814 à 1815, avant la défaite de Waterloo. Il a commencé après l\'abdication de Napoléon en 1814.',
  },
  {
    id: 9,
    subject: 'Mathématiques',
    difficulty: 'Moyen',
    type: 'qcm',
    question: 'Quelle est la dérivée de la fonction f(x) = x³ ?',
    options: [
      'f\'(x) = x²',
      'f\'(x) = 3x²',
      'f\'(x) = 3x³',
      'f\'(x) = 2x³',
    ],
    correctIndex: 1,
    explanation: 'En utilisant la règle de dérivation (nxⁿ⁻¹), la dérivée de x³ est 3x².',
  },
  {
    id: 10,
    subject: 'Mathématiques',
    difficulty: 'Difficile',
    type: 'qcm',
    question: 'Soit une matrice A 2×2. Le déterminant de A est égal à 0. Que peut-on conclure ?',
    options: [
      'La matrice A est inversible',
      'La matrice A n\'est pas inversible',
      'La matrice A est symétrique',
      'La matrice A est unitaire',
    ],
    correctIndex: 1,
    explanation: 'Une matrice dont le déterminant est nul est dite singulière et n\'est pas inversible.',
  },
]

// ─── Constants ───────────────────────────────────────────────────────

const SUBJECTS = ['Droit', 'Microéconomie', 'Algorithmes', 'Histoire', 'Mathématiques']
const DIFFICULTIES = ['Facile', 'Moyen', 'Difficile']
const NUM_QUESTIONS = [5, 10, 15, 20]
const QUIZ_TYPES = [
  { value: 'qcm', label: 'QCM' },
  { value: 'vrai-faux', label: 'Vrai/Faux' },
  { value: 'mixte', label: 'Mixte' },
]

const subjectColors: Record<string, string> = {
  Droit: 'bg-blue-100 text-blue-700 border-blue-200',
  Microéconomie: 'bg-amber-100 text-amber-700 border-amber-200',
  Algorithmes: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Histoire: 'bg-purple-100 text-purple-700 border-purple-200',
  Mathématiques: 'bg-rose-100 text-rose-700 border-rose-200',
}

const subjectIcons: Record<string, string> = {
  Droit: '⚖️',
  Microéconomie: '📈',
  Algorithmes: '💻',
  Histoire: '🏛️',
  Mathématiques: '📐',
}

const difficultyColors: Record<string, string> = {
  Facile: 'bg-green-100 text-green-700',
  Moyen: 'bg-amber-100 text-amber-700',
  Difficile: 'bg-red-100 text-red-700',
}

// ─── Animation Variants ──────────────────────────────────────────────

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

// ─── Circular Progress Component ─────────────────────────────────────

function CircularProgress({
  value,
  size = 180,
  strokeWidth = 12,
  color = '#10B981',
}: {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedValue / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {Math.round(animatedValue)}%
        </motion.span>
        <span className="text-sm text-gray-500 mt-1">Score</span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export default function QuizGeneratorPage() {
  const { setCurrentPage, addQuizResult } = useAppStore()

  // Quiz state
  const [phase, setPhase] = useState<QuizPhase>('config')
  const [config, setConfig] = useState<QuizConfig>({
    subject: 'Droit',
    difficulty: 'Moyen',
    numQuestions: 10,
    quizType: 'qcm',
  })
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [direction, setDirection] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showExplanation, setShowExplanation] = useState<number | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── Timer Logic ──────────────────────────────────────────────

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // ─── Quiz Logic ───────────────────────────────────────────────

  const startQuiz = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      // Filter questions based on config
      let filtered = mockQuestions.filter((q) => {
        const subjectMatch = q.subject === config.subject
        const difficultyMatch = q.difficulty === config.difficulty
        const typeMatch =
          config.quizType === 'mixte' ||
          q.type === config.quizType

        return subjectMatch && difficultyMatch && typeMatch
      })

      // For vrai-faux type, convert QCM questions to vrai-faux format
      if (config.quizType === 'vrai-faux') {
        filtered = filtered.map((q) => {
          // Determine correct answer for vrai-faux based on the actual correct option
          const correctOption = q.options[q.correctIndex]
          const isVrai = correctOption === 'Vrai'
          return {
            ...q,
            type: 'vrai-faux' as const,
            options: ['Vrai', 'Faux'],
            correctIndex: isVrai ? 0 : 1,
          }
        })
      }

      // Take the requested number of questions
      const selected = filtered.slice(0, Math.min(config.numQuestions, filtered.length))

      // If not enough, fill with all available
      if (selected.length < config.numQuestions) {
        const remaining = mockQuestions.filter((q) => !selected.includes(q))
        while (selected.length < config.numQuestions && remaining.length > 0) {
          selected.push(remaining.shift()!)
        }
      }

      setQuestions(selected)
      setAnswers(new Array(selected.length).fill(null))
      setCurrentQuestionIndex(0)
      setTimeElapsed(0)
      setIsTimerRunning(true)
      setIsGenerating(false)
      setPhase('playing')
    }, 1500)
  }, [config])

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const goToQuestion = (index: number) => {
    setDirection(index > currentQuestionIndex ? 1 : -1)
    setCurrentQuestionIndex(index)
    setShowExplanation(null)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1)
      setCurrentQuestionIndex((prev) => prev + 1)
      setShowExplanation(null)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1)
      setCurrentQuestionIndex((prev) => prev - 1)
      setShowExplanation(null)
    }
  }

  const finishQuiz = () => {
    setIsTimerRunning(false)
    const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    const mins = Math.floor(timeElapsed / 60)
    const secs = timeElapsed % 60

    addQuizResult({
      title: `Quiz - ${config.subject}`,
      subject: config.subject,
      score,
      totalQuestions: questions.length,
      correctAnswers: correct,
      duration: `${mins} min ${secs}s`,
      type: config.quizType === 'vrai-faux' ? 'vrai-faux' : config.quizType === 'ouvert' ? 'ouvert' : 'qcm',
    })

    setPhase('results')
  }

  const restartQuiz = () => {
    setPhase('config')
    setCurrentQuestionIndex(0)
    setAnswers([])
    setQuestions([])
    setTimeElapsed(0)
    setShowExplanation(null)
  }

  // ─── Computed Values ──────────────────────────────────────────

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = answers.filter((a) => a !== null).length
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  const correctCount = questions.filter((q, i) => answers[i] === q.correctIndex).length
  const incorrectCount = questions.filter((q, i) => answers[i] !== null && answers[i] !== q.correctIndex).length
  const unansweredCount = answers.filter((a) => a === null).length
  const scorePercentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return '#10B981'
    if (pct >= 60) return '#F59E0B'
    if (pct >= 40) return '#F97316'
    return '#EF4444'
  }

  const getScoreLabel = (pct: number) => {
    if (pct >= 90) return 'Excellent !'
    if (pct >= 80) return 'Très bien !'
    if (pct >= 70) return 'Bien !'
    if (pct >= 60) return 'Satisfaisant'
    if (pct >= 50) return 'Peut mieux faire'
    return 'À améliorer'
  }

  // ─── Render: Config Phase ─────────────────────────────────────

  const renderConfigPhase = () => (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-100">
            <Brain className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Générateur de Quiz</h1>
            <p className="text-sm text-gray-500">Testez vos connaissances avec des quiz personnalisés</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-emerald-100 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-emerald-500" />
                Configurer votre quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Matière</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUBJECTS.map((subject) => (
                    <motion.button
                      key={subject}
                      onClick={() => setConfig((prev) => ({ ...prev, subject }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        config.subject === subject
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{subjectIcons[subject]}</span>
                      <span>{subject}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Difficulty & Type Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Difficulty */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Difficulté</Label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map((diff) => (
                      <motion.button
                        key={diff}
                        onClick={() => setConfig((prev) => ({ ...prev, difficulty: diff }))}
                        className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          config.difficulty === diff
                            ? `${difficultyColors[diff]} border-current shadow-sm`
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {diff}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quiz Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Type de quiz</Label>
                  <div className="flex gap-2">
                    {QUIZ_TYPES.map((type) => (
                      <motion.button
                        key={type.value}
                        onClick={() => setConfig((prev) => ({ ...prev, quizType: type.value }))}
                        className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          config.quizType === type.value
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Number of Questions */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Nombre de questions</Label>
                <div className="flex gap-2">
                  {NUM_QUESTIONS.map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => setConfig((prev) => ({ ...prev, numQuestions: num }))}
                      className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        config.numQuestions === num
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Start Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={startQuiz}
                    disabled={isGenerating}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-base font-semibold gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        Commencer le quiz
                      </>
                    )}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    onClick={startQuiz}
                    disabled={isGenerating}
                    variant="outline"
                    className="h-12 text-base font-semibold gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Sparkles className="h-5 w-5" />
                    Générer avec l&apos;IA
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Info */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* AI Generation Card */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
            <CardContent className="p-5 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Génération IA</span>
              </div>
              <p className="text-sm text-emerald-100 leading-relaxed">
                L&apos;IA analyse vos documents et génère des questions adaptées à votre niveau pour maximiser votre apprentissage.
              </p>
              <div className="flex items-center gap-2 mt-4 text-xs text-emerald-200">
                <Zap className="h-3.5 w-3.5" />
                <span>Basé sur vos documents importés</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
                Statistiques rapides
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Quiz complétés</span>
                  <span className="text-sm font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Score moyen</span>
                  <span className="text-sm font-semibold text-emerald-600">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Meilleure matière</span>
                  <span className="text-sm font-semibold text-gray-900">Algorithmes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Questions répondues</span>
                  <span className="text-sm font-semibold text-gray-900">156</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-emerald-500" />
                Conseils
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Lisez attentivement chaque question avant de répondre</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Le temps est compté, mais la précision prime</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Revoyez les explications pour mieux comprendre</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )

  // ─── Render: Playing Phase ────────────────────────────────────

  const renderPlayingPhase = () => {
    if (!currentQuestion) return null

    return (
      <div className="p-4 md:p-6 lg:p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge className={`${subjectColors[currentQuestion.subject] || 'bg-gray-100 text-gray-700'} text-xs font-medium`}>
              {subjectIcons[currentQuestion.subject]} {currentQuestion.subject}
            </Badge>
            <Badge variant="outline" className={`${difficultyColors[currentQuestion.difficulty]} text-xs`}>
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm font-mono">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span className={`font-semibold ${timeElapsed > 300 ? 'text-red-500' : 'text-gray-700'}`}>
              {formatTime(timeElapsed)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {answeredCount}/{questions.length} répondues
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question Navigation Dots */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => goToQuestion(i)}
              className={`w-8 h-8 min-h-[44px] min-w-[44px] rounded-lg text-xs font-semibold transition-all flex items-center justify-center ${
                i === currentQuestionIndex
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : answers[i] !== null
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Card className="mb-6 border-emerald-100">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg leading-relaxed text-gray-900">
                    {currentQuestion.question}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {currentQuestion.type === 'qcm' ? 'QCM' : 'V/F'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Answer Options */}
                {currentQuestion.options.map((option, optIndex) => {
                  const isSelected = answers[currentQuestionIndex] === optIndex
                  const optionLetter = String.fromCharCode(65 + optIndex)

                  return (
                    <motion.button
                      key={optIndex}
                      onClick={() => selectAnswer(optIndex)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0 ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {optionLetter}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? 'text-emerald-700' : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}

                {/* Explanation Toggle (only show after answering) */}
                {answers[currentQuestionIndex] !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    <button
                      onClick={() =>
                        setShowExplanation(
                          showExplanation === currentQuestionIndex ? null : currentQuestionIndex
                        )
                      }
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                      <BookOpen className="h-4 w-4" />
                      {showExplanation === currentQuestionIndex
                        ? 'Masquer l\'explication'
                        : 'Voir l\'explication'}
                    </button>
                    <AnimatePresence>
                      {showExplanation === currentQuestionIndex && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                        >
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {currentQuestion.explanation}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Précédente
          </Button>

          <div className="flex items-center gap-2">
            {unansweredCount > 0 && currentQuestionIndex === questions.length - 1 && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                {unansweredCount} sans réponse
              </span>
            )}
          </div>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={nextQuestion}
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            >
              Suivante
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={finishQuiz}
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Terminer le quiz
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ─── Render: Results Phase ────────────────────────────────────

  const renderResultsPhase = () => (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Résultats du quiz</h1>
        <p className="text-sm text-gray-500 mt-1">
          {config.subject} • {config.difficulty} • {questions.length} questions
        </p>
      </motion.div>

      {/* Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-emerald-100 mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Progress */}
              <div className="flex flex-col items-center">
                <CircularProgress
                  value={scorePercentage}
                  size={180}
                  strokeWidth={12}
                  color={getScoreColor(scorePercentage)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3"
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(scorePercentage) }}
                  >
                    {getScoreLabel(scorePercentage)}
                  </span>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.div
                  className="bg-emerald-50 rounded-xl p-4 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600">{correctCount}</p>
                  <p className="text-xs text-emerald-600/70 uppercase tracking-wide font-medium">
                    Correctes
                  </p>
                </motion.div>

                <motion.div
                  className="bg-red-50 rounded-xl p-4 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
                  <p className="text-xs text-red-600/70 uppercase tracking-wide font-medium">
                    Incorrectes
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gray-50 rounded-xl p-4 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <AlertTriangle className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-600">{unansweredCount}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    Sans réponse
                  </p>
                </motion.div>

                <motion.div
                  className="bg-amber-50 rounded-xl p-4 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                >
                  <Timer className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-600">{formatTime(timeElapsed)}</p>
                  <p className="text-xs text-amber-600/70 uppercase tracking-wide font-medium">
                    Temps
                  </p>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={restartQuiz}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-11 font-semibold gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Recommencer
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentPage('quiz-history')}
          className="flex-1 h-11 font-semibold gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
        >
          <History className="h-4 w-4" />
          Voir l&apos;historique
        </Button>
      </motion.div>

      {/* Review Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Revoir les réponses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, qIndex) => {
              const userAnswer = answers[qIndex]
              const isCorrect = userAnswer === q.correctIndex
              const isUnanswered = userAnswer === null

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: qIndex * 0.05 }}
                  className={`p-4 rounded-xl border-2 ${
                    isUnanswered
                      ? 'border-gray-200 bg-gray-50/50'
                      : isCorrect
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 ${
                        isUnanswered
                          ? 'bg-gray-200 text-gray-600'
                          : isCorrect
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-500 text-white'
                      }`}
                    >
                      {qIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`${subjectColors[q.subject] || 'bg-gray-100 text-gray-700'} text-[10px] px-1.5 py-0`}
                        >
                          {q.subject}
                        </Badge>
                        {isUnanswered ? (
                          <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Sans réponse
                          </span>
                        ) : isCorrect ? (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Correct
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Options Review */}
                  <div className="space-y-1.5 ml-10">
                    {q.options.map((option, optIndex) => {
                      const isThisCorrect = optIndex === q.correctIndex
                      const isThisUserAnswer = optIndex === userAnswer

                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                            isThisCorrect
                              ? 'bg-emerald-100 text-emerald-800 font-medium'
                              : isThisUserAnswer && !isThisCorrect
                                ? 'bg-red-100 text-red-800 line-through'
                                : 'text-gray-500'
                          }`}
                        >
                          <span className="w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {isThisCorrect && <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                          {isThisUserAnswer && !isThisCorrect && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                        </div>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="ml-10 mt-2 p-2.5 bg-white rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-emerald-600">💡 Explication :</span>{' '}
                      {q.explanation}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mt-6 mb-4">
        <Button
          onClick={restartQuiz}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-11 font-semibold gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Recommencer
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentPage('dashboard')}
          className="flex-1 h-11 font-semibold gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </motion.div>
    </motion.div>
  )

  // ─── Main Render ──────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      {phase === 'config' && (
        <motion.div
          key="config"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderConfigPhase()}
        </motion.div>
      )}
      {phase === 'playing' && (
        <motion.div
          key="playing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPlayingPhase()}
        </motion.div>
      )}
      {phase === 'results' && (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderResultsPhase()}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
