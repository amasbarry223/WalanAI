'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Check,
  X,
  Eye,
  EyeOff,
  Clock,
  Brain,
  Zap,
  Bookmark,
  BookmarkCheck,
  Flag,
  Square,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Calendar,
  TrendingUp,
  Hash,
  Timer,
  Keyboard,
  BarChart3,
  Sparkles,
  Layers,
  AlertCircle,
  Lightbulb,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type StudyMode = 'classic' | 'spaced' | 'quick'
type DifficultyRating = 'easy' | 'medium' | 'hard' | 'revisit'

interface SpacedRepetitionData {
  interval: number // days
  easinessFactor: number
  repetitionCount: number
  nextReviewDate: string // ISO date
  lastReviewDate: string
}

interface Flashcard {
  id: number
  question: string
  answer: string
  subject: string
  status: 'new' | 'learning' | 'mastered'
  difficulty?: DifficultyRating
  bookmarked: boolean
  spacedRepetition: SpacedRepetitionData
}

interface SessionStats {
  cardsReviewed: number
  totalCards: number
  correctCount: number
  incorrectCount: number
  startTime: number
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockFlashcards: Flashcard[] = [
  {
    id: 1,
    question: 'Quelle est la définition du droit civil ?',
    answer: 'Le droit civil est l\'ensemble des règles qui régissent les rapports entre les particuliers, qu\'il s\'agisse de personnes physiques ou morales. Il couvre le droit des personnes, le droit de la famille, le droit des biens et le droit des obligations.',
    subject: 'Droit Civil',
    status: 'learning',
    bookmarked: false,
    spacedRepetition: { interval: 3, easinessFactor: 2.5, repetitionCount: 2, nextReviewDate: '2025-03-05', lastReviewDate: '2025-03-02' },
  },
  {
    id: 2,
    question: 'Quelles sont les sources du droit civil français ?',
    answer: 'Les sources du droit civil français sont : la Constitution, les traités internationaux, la loi (dont le Code civil), les décrets et arrêtés, la jurisprudence, la doctrine et la coutume. Le Code civil de 1804 (Code Napoléon) reste la source principale.',
    subject: 'Droit Civil',
    status: 'learning',
    bookmarked: true,
    spacedRepetition: { interval: 5, easinessFactor: 2.65, repetitionCount: 3, nextReviewDate: '2025-03-07', lastReviewDate: '2025-03-02' },
  },
  {
    id: 3,
    question: 'Quelle est la différence entre capacité juridique et capacité de jouissance ?',
    answer: 'La capacité de jouissance est l\'aptitude à être titulaire de droits subjectifs (tout être humain la possède de naissance). La capacité d\'exercice est l\'aptitude à exercer soi-même ses droits. Un mineur a la capacité de jouissance mais pas toujours la capacité d\'exercice.',
    subject: 'Droit Civil',
    status: 'new',
    bookmarked: false,
    spacedRepetition: { interval: 1, easinessFactor: 2.5, repetitionCount: 0, nextReviewDate: '2025-03-03', lastReviewDate: '2025-03-02' },
  },
  {
    id: 4,
    question: 'Qu\'est-ce que la responsabilité délictuelle (article 1240 du Code civil) ?',
    answer: 'La responsabilité délictuelle oblige celui qui cause un dommage à autrui à le réparer. Trois conditions : un fait générateur (faute), un dommage, et un lien de causalité entre les deux. L\'article 1240 (ex-1382) dispose : "Tout fait quelconque de l\'homme, qui cause à autrui un dommage, oblige celui par la faute duquel il est arrivé à le réparer."',
    subject: 'Droit Civil',
    status: 'mastered',
    bookmarked: false,
    spacedRepetition: { interval: 14, easinessFactor: 2.8, repetitionCount: 5, nextReviewDate: '2025-03-16', lastReviewDate: '2025-03-02' },
  },
  {
    id: 5,
    question: 'Quelles sont les conditions de validité d\'un contrat (article 1128) ?',
    answer: 'L\'article 1128 du Code civil prévoit 4 conditions de validité : le consentement des parties, la capacité de contracter, un contenu déterminé ou déterminable, et un contenu licite et certain. L\'absence d\'une condition entraîne la nullité du contrat.',
    subject: 'Droit Civil',
    status: 'learning',
    bookmarked: true,
    spacedRepetition: { interval: 4, easinessFactor: 2.55, repetitionCount: 2, nextReviewDate: '2025-03-06', lastReviewDate: '2025-03-02' },
  },
  {
    id: 6,
    question: 'Qu\'est-ce que la force majeure en droit civil ?',
    answer: 'La force majeure est un événement imprévisible, irrésistible et extérieur qui libère le débiteur de son obligation. L\'article 1218 du Code civil la définit et distingue la force majeure temporaire (qui suspend l\'exécution) de la force majeure définitive (qui résout le contrat).',
    subject: 'Droit Civil',
    status: 'new',
    bookmarked: false,
    spacedRepetition: { interval: 1, easinessFactor: 2.5, repetitionCount: 0, nextReviewDate: '2025-03-03', lastReviewDate: '2025-03-02' },
  },
  {
    id: 7,
    question: 'Expliquez la distinction entre droit réel et droit personnel.',
    answer: 'Le droit réel est un pouvoir direct et immédiat sur une chose (ex: propriété, usufruit). Le droit personnel (ou droit de créance) est le droit d\'exiger d\'une personne une prestation (donner, faire ou ne pas faire). Le droit réel est absolu et opposable à tous (erga omnes), le droit personnel n\'est opposable qu\'au débiteur.',
    subject: 'Droit Civil',
    status: 'new',
    bookmarked: false,
    spacedRepetition: { interval: 1, easinessFactor: 2.5, repetitionCount: 0, nextReviewDate: '2025-03-03', lastReviewDate: '2025-03-02' },
  },
  {
    id: 8,
    question: 'Qu\'est-ce que l\'abus de droit (article 1240 et 1241) ?',
    answer: 'L\'abus de droit est l\'exercice anormal d\'un droit, causant un dommage à autrui. Il y a abus quand le titulaire d\'un droit l\'exerce dans un but autre que celui pour lequel ce droit lui a été conféré, ou de manière excessive. La jurisprudence retient deux critères : la faute intentionnelle (but de nuire) ou le déséquilibre entre l\'avantage et le dommage.',
    subject: 'Droit Civil',
    status: 'mastered',
    bookmarked: false,
    spacedRepetition: { interval: 10, easinessFactor: 2.75, repetitionCount: 4, nextReviewDate: '2025-03-12', lastReviewDate: '2025-03-02' },
  },
  {
    id: 9,
    question: 'Quelle est la différence entre obligation de moyens et obligation de résultat ?',
    answer: 'L\'obligation de résultat impose au débiteur d\'atteindre un résultat précis (ex: transporteur amener le passager à destination). En cas de non-exécution, la faute est présumée. L\'obligation de moyens impose de déployer toutes les diligences possibles sans garantie de résultat (ex: médecin). Le créancier doit prouver la faute du débiteur.',
    subject: 'Droit Civil',
    status: 'new',
    bookmarked: true,
    spacedRepetition: { interval: 1, easinessFactor: 2.5, repetitionCount: 0, nextReviewDate: '2025-03-03', lastReviewDate: '2025-03-02' },
  },
  {
    id: 10,
    question: 'Qu\'est-ce que la prescription extinctive en droit civil ?',
    answer: 'La prescription extinctive est l\'extinction d\'un droit par le non-usage pendant un certain délai. Le délai de droit commun est de 5 ans (art. 2224). Il existe des délais spéciaux : 10 ans entre professionnels, 2 ans pour les actions en responsabilité délictuelle. Le point de départ est le jour où le titulaire a connu ou aurait dû connaître ses droits.',
    subject: 'Droit Civil',
    status: 'learning',
    bookmarked: false,
    spacedRepetition: { interval: 3, easinessFactor: 2.5, repetitionCount: 1, nextReviewDate: '2025-03-05', lastReviewDate: '2025-03-02' },
  },
]

const reviewFrequencyData = [
  { day: 'Lun', reviews: 8 },
  { day: 'Mar', reviews: 12 },
  { day: 'Mer', reviews: 6 },
  { day: 'Jeu', reviews: 15 },
  { day: 'Ven', reviews: 10 },
  { day: 'Sam', reviews: 4 },
  { day: 'Dim', reviews: 2 },
]

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const cardSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    rotateY: direction > 0 ? -15 : 15,
    transition: { duration: 0.2 },
  }),
}

// ─── Helper Functions ────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function simulateSM2(currentData: SpacedRepetitionData, rating: DifficultyRating): SpacedRepetitionData {
  const quality = { easy: 5, medium: 3, hard: 1, revisit: 0 }[rating]
  let { easinessFactor, interval, repetitionCount } = currentData

  // Update easiness factor
  easinessFactor = Math.max(1.3, easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

  if (quality >= 3) {
    if (repetitionCount === 0) interval = 1
    else if (repetitionCount === 1) interval = 6
    else interval = Math.round(interval * easinessFactor)
    repetitionCount++
  } else {
    repetitionCount = 0
    interval = 1
  }

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + interval)

  return {
    interval,
    easinessFactor: Math.round(easinessFactor * 100) / 100,
    repetitionCount,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    lastReviewDate: new Date().toISOString().split('T')[0],
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FlashcardDeckPage() {
  const { setCurrentPage } = useAppStore()

  // Card state
  const [cards, setCards] = useState<Flashcard[]>(mockFlashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState(1)
  const [hasRated, setHasRated] = useState(false)

  // Study mode
  const [studyMode, setStudyMode] = useState<StudyMode>('classic')

  // Sorted/ordered cards based on study mode
  const displayCards = useMemo(() => {
    if (studyMode === 'spaced') {
      // Sort by rating: lower ratings (need review) come first
      const ratingOrder: Record<DifficultyRating | undefined, number> = { revisit: 0, hard: 1, medium: 2, easy: 3, undefined: 4 }
      return [...cards].sort((a, b) => (ratingOrder[a.difficulty] ?? 4) - (ratingOrder[b.difficulty] ?? 4))
    } else if (studyMode === 'quick') {
      // Random shuffle
      const shuffled = [...cards]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }
    // Sequential (original order)
    return cards
  }, [cards, studyMode])

  // Session stats
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    cardsReviewed: 0,
    totalCards: cards.length,
    correctCount: 0,
    incorrectCount: 0,
    startTime: Date.now(),
  })
  const [elapsedTime, setElapsedTime] = useState(0)

  // Quick mode timer
  const [quickModeTimer, setQuickModeTimer] = useState(30)
  const [quickModeActive, setQuickModeActive] = useState(false)

  // Session ended
  const [sessionEnded, setSessionEnded] = useState(false)

  const currentCard = displayCards[currentIndex]
  const masteredCount = cards.filter((c) => c.status === 'mastered').length
  const learningCount = cards.filter((c) => c.status === 'learning').length
  const newCount = cards.filter((c) => c.status === 'new').length
  const masteryPercent = Math.round((masteredCount / cards.length) * 100)

  // Elapsed time ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStats.startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStats.startTime])

  // Quick mode timer
  useEffect(() => {
    if (studyMode === 'quick' && quickModeActive && !isFlipped && !sessionEnded) {
      const timer = setInterval(() => {
        setQuickModeTimer((prev) => {
          if (prev <= 1) {
            setIsFlipped(true)
            setQuickModeActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [studyMode, quickModeActive, isFlipped, sessionEnded])

  // Start quick mode timer when card changes
  useEffect(() => {
    if (studyMode === 'quick' && !sessionEnded) {
      setQuickModeTimer(30)
      setQuickModeActive(true)
    }
  }, [currentIndex, studyMode, sessionEnded])

  const goToCard = useCallback(
    (newIndex: number, dir: number) => {
      setDirection(dir)
      setIsFlipped(false)
      setHasRated(false)
      if (studyMode === 'quick') {
        setQuickModeTimer(30)
        setQuickModeActive(true)
      }
      setCurrentIndex(newIndex)
    },
    [studyMode]
  )

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % displayCards.length
    goToCard(nextIndex, 1)
  }, [currentIndex, displayCards.length, goToCard])

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + displayCards.length) % displayCards.length
    goToCard(prevIndex, -1)
  }, [currentIndex, displayCards.length, goToCard])

  const handleRate = useCallback((rating: DifficultyRating) => {
    if (hasRated) return
    setHasRated(true)

    const isCorrect = rating === 'easy' || rating === 'medium'
    setSessionStats((prev) => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1,
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: prev.incorrectCount + (isCorrect ? 0 : 1),
    }))

    setCards((prev) =>
      prev.map((card, i) => {
        if (i !== currentIndex) return card
        const newSR = simulateSM2(card.spacedRepetition, rating)
        const newStatus: Flashcard['status'] =
          rating === 'easy' ? 'mastered' : rating === 'medium' ? 'learning' : 'new'
        return {
          ...card,
          difficulty: rating,
          status: newStatus,
          spacedRepetition: newSR,
        }
      })
    )
  }, [hasRated, currentIndex])

  const toggleBookmark = useCallback(() => {
    setCards((prev) =>
      prev.map((card, i) => (i === currentIndex ? { ...card, bookmarked: !card.bookmarked } : card))
    )
  }, [currentIndex])

  const handleEndSession = () => {
    setSessionEnded(true)
    setQuickModeActive(false)
  }

  const handleRestartSession = () => {
    setSessionEnded(false)
    setCurrentIndex(0)
    setIsFlipped(false)
    setHasRated(false)
    setSessionStats({
      cardsReviewed: 0,
      totalCards: cards.length,
      correctCount: 0,
      incorrectCount: 0,
      startTime: Date.now(),
    })
    if (studyMode === 'quick') {
      setQuickModeTimer(30)
      setQuickModeActive(true)
    }
  }

  const handleFlip = () => {
    if (studyMode === 'quick') {
      setQuickModeActive(false)
    }
    setIsFlipped(!isFlipped)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionEnded) return
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          handleFlip()
          break
        case 'ArrowRight':
          handleNext()
          break
        case 'ArrowLeft':
          handlePrev()
          break
        case '1':
          if (isFlipped && !hasRated) handleRate('easy')
          break
        case '2':
          if (isFlipped && !hasRated) handleRate('medium')
          break
        case '3':
          if (isFlipped && !hasRated) handleRate('hard')
          break
        case '4':
          if (isFlipped && !hasRated) handleRate('revisit')
          break
        case 'b':
          toggleBookmark()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, handleRate, toggleBookmark, isFlipped, hasRated, sessionEnded])

  // Estimated time remaining
  const avgTimePerCard = sessionStats.cardsReviewed > 0 ? elapsedTime / sessionStats.cardsReviewed : 30
  const remainingCards = cards.length - sessionStats.cardsReviewed
  const estimatedRemaining = Math.round(avgTimePerCard * remainingCards)

  const maxReviews = Math.max(...reviewFrequencyData.map((d) => d.reviews))

  // ─── Session End Screen ────────────────────────────────────────────────────

  if (sessionEnded) {
    const accuracy = sessionStats.cardsReviewed > 0
      ? Math.round((sessionStats.correctCount / sessionStats.cardsReviewed) * 100)
      : 0

    return (
      <motion.div
        className="p-4 md:p-6 max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-emerald-200">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-90" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Session terminée !</h1>
            <p className="text-emerald-100">Voici votre résumé de révision</p>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{sessionStats.cardsReviewed}</p>
                <p className="text-xs text-gray-500">Cartes révisées</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{accuracy}%</p>
                <p className="text-xs text-gray-500">Précision</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{sessionStats.correctCount}</p>
                <p className="text-xs text-gray-500">Correctes</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-500">{sessionStats.incorrectCount}</p>
                <p className="text-xs text-gray-500">Incorrectes</p>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg mb-6">
              <p className="text-sm text-gray-500 mb-1">Temps total</p>
              <p className="text-xl font-bold text-gray-900">{formatTime(elapsedTime)}</p>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleRestartSession}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Recommencer
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setCurrentPage('revision')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // ─── Main Page ─────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-5">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-gray-500 hover:text-emerald-600 text-xs"
                onClick={() => setCurrentPage('documents')}
              >
                Mes Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer text-gray-500 hover:text-emerald-600 text-xs"
                onClick={() => setCurrentPage('revision')}
              >
                Droit Civil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-gray-900">
                Chapitre 1
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setCurrentPage('revision')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                Introduction au Droit Civil
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                  Droit Civil
                </Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Chapitre 1 — Les fondamentaux</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Total', value: cards.length, icon: <Layers className="h-4 w-4" />, color: 'text-gray-500', bg: 'bg-gray-50' },
            { label: 'Maîtrisées', value: masteredCount, icon: <Check className="h-4 w-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'En cours', value: learningCount, icon: <Minus className="h-4 w-4" />, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Nouvelles', value: newCount, icon: <Zap className="h-4 w-4" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-lg p-3 flex items-center gap-2.5`}>
              <span className={stat.color}>{stat.icon}</span>
              <div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mastery Progress Bar */}
        <div className="bg-white rounded-lg border p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-600">Maîtrise du paquet</span>
            <span className="text-xs font-bold text-emerald-600">{masteryPercent}%</span>
          </div>
          <Progress value={masteryPercent} className="h-2" />
        </div>
      </motion.div>

      {/* ── Study Mode Selector ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-5">
        <Tabs
          value={studyMode}
          onValueChange={(v) => {
            setStudyMode(v as StudyMode)
            setIsFlipped(false)
            setHasRated(false)
            setCurrentIndex(0)
            if (v === 'quick') {
              setQuickModeTimer(30)
              setQuickModeActive(true)
            } else {
              setQuickModeActive(false)
            }
          }}
        >
          <TabsList className="bg-gray-100 w-full sm:w-auto">
            <TabsTrigger value="classic" className="gap-1.5 text-xs sm:text-sm">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Révision</span> classique
            </TabsTrigger>
            <TabsTrigger value="spaced" className="gap-1.5 text-xs sm:text-sm">
              <Brain className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Répétition</span> espacée
            </TabsTrigger>
            <TabsTrigger value="quick" className="gap-1.5 text-xs sm:text-sm">
              <Timer className="h-3.5 w-3.5" />
              Test rapide
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* ── Main Content: Card + Stats ──────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col lg:flex-row gap-5">
          {/* ── Flashcard Area ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Quick mode timer bar */}
            {studyMode === 'quick' && (
              <div className="mb-3 flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${quickModeTimer <= 5 ? 'bg-red-500' : quickModeTimer <= 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    animate={{ width: `${(quickModeTimer / 30) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span
                  className={`text-sm font-mono font-bold ${
                    quickModeTimer <= 5 ? 'text-red-500' : quickModeTimer <= 10 ? 'text-amber-500' : 'text-emerald-600'
                  }`}
                >
                  {quickModeTimer}s
                </span>
              </div>
            )}

            {/* Card Number Indicator */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">
                Carte {currentIndex + 1}/{displayCards.length}
              </span>
              <div className="flex items-center gap-2">
                {currentCard.bookmarked && (
                  <Badge variant="outline" className="text-amber-600 border-amber-200 text-xs gap-1">
                    <BookmarkCheck className="h-3 w-3" />
                    Favori
                  </Badge>
                )}
                <Badge
                  className={`text-xs ${
                    currentCard.status === 'mastered'
                      ? 'bg-emerald-100 text-emerald-700'
                      : currentCard.status === 'learning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {currentCard.status === 'mastered'
                    ? 'Maîtrisée'
                    : currentCard.status === 'learning'
                      ? 'En cours'
                      : 'Nouvelle'}
                </Badge>
              </div>
            </div>

            {/* 3D Flip Card */}
            <div
              className="relative w-full cursor-pointer select-none"
              onClick={handleFlip}
              style={{ perspective: '1200px' }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={cardSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    className="w-full min-h-[300px] md:min-h-[340px]"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front (Question) */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-2xl border-2 border-emerald-100 shadow-lg shadow-emerald-500/5"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-emerald-500" />
                        </div>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                          Question
                        </Badge>
                      </div>
                      <p className="text-base md:text-lg font-medium text-gray-900 text-center leading-relaxed max-w-lg">
                        {currentCard.question}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
                        <Eye className="h-4 w-4" />
                        <span>Cliquez pour révéler la réponse</span>
                      </div>
                    </div>

                    {/* Back (Answer) */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg text-white"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Lightbulb className="h-4 w-4 text-white" />
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Réponse</Badge>
                      </div>
                      <p className="text-base md:text-lg font-medium text-center leading-relaxed max-w-lg">
                        {currentCard.answer}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-emerald-100">
                        <EyeOff className="h-4 w-4" />
                        <span>Cliquez pour revoir la question</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Difficulty Rating (after flip) */}
            <AnimatePresence>
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-4"
                >
                  <p className="text-xs text-gray-500 text-center mb-2">Comment évaluez-vous cette carte ?</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      className={`gap-1.5 ${
                        hasRated && currentCard.difficulty === 'easy'
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      disabled={hasRated}
                      onClick={() => handleRate('easy')}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Facile
                      <kbd className="hidden sm:inline ml-1 text-[10px] opacity-60">1</kbd>
                    </Button>
                    <Button
                      size="sm"
                      className={`gap-1.5 ${
                        hasRated && currentCard.difficulty === 'medium'
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                      disabled={hasRated}
                      onClick={() => handleRate('medium')}
                    >
                      <Minus className="h-3.5 w-3.5" />
                      Moyen
                      <kbd className="hidden sm:inline ml-1 text-[10px] opacity-60">2</kbd>
                    </Button>
                    <Button
                      size="sm"
                      className={`gap-1.5 ${
                        hasRated && currentCard.difficulty === 'hard'
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                      }`}
                      disabled={hasRated}
                      onClick={() => handleRate('hard')}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      Difficile
                      <kbd className="hidden sm:inline ml-1 text-[10px] opacity-60">3</kbd>
                    </Button>
                    <Button
                      size="sm"
                      className={`gap-1.5 ${
                        hasRated && currentCard.difficulty === 'revisit'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                      disabled={hasRated}
                      onClick={() => handleRate('revisit')}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      À revoir
                      <kbd className="hidden sm:inline ml-1 text-[10px] opacity-60">4</kbd>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyboard Shortcuts Hint */}
            <div className="hidden md:flex items-center justify-center gap-4 mt-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Espace</kbd>
                Retourner
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">→</kbd>
                Navigation
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">1-4</kbd>
                Évaluer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-mono">B</kbd>
                Favori
              </span>
            </div>
          </div>

          {/* ── Spaced Repetition Stats Panel ───────────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                  Statistiques de répétition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Interval */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Intervalle actuel
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {currentCard.spacedRepetition.interval} jour{currentCard.spacedRepetition.interval > 1 ? 's' : ''}
                  </span>
                </div>

                <Separator />

                {/* Next Review Date */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Prochaine révision
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    {new Date(currentCard.spacedRepetition.nextReviewDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                <Separator />

                {/* Easiness Factor */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Facteur de facilité
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {currentCard.spacedRepetition.easinessFactor.toFixed(2)}
                  </span>
                </div>

                <Separator />

                {/* Repetition Count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" />
                    Répétitions
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {currentCard.spacedRepetition.repetitionCount}
                  </span>
                </div>

                <Separator />

                {/* Mini Chart - Review Frequency */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Fréquence de révision</p>
                  <div className="flex items-end gap-1 h-16">
                    {reviewFrequencyData.map((d, i) => (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                        <motion.div
                          className="w-full rounded-t bg-emerald-400"
                          initial={{ height: 0 }}
                          animate={{ height: `${(d.reviews / maxReviews) * 100}%` }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                        />
                        <span className="text-[9px] text-gray-400">{d.day.charAt(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* ── Session Progress Bar ────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mt-5">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Progression de la session</span>
              <span className="text-xs font-bold text-emerald-600">
                {sessionStats.cardsReviewed}/{sessionStats.totalCards}
              </span>
            </div>
            <Progress
              value={(sessionStats.cardsReviewed / sessionStats.totalCards) * 100}
              className="h-1.5 mb-3"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>Temps : <strong className="text-gray-700">{formatTime(elapsedTime)}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Correctes : <strong className="text-emerald-600">{sessionStats.correctCount}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <X className="h-3.5 w-3.5 text-red-400" />
                <span>Incorrectes : <strong className="text-red-500">{sessionStats.incorrectCount}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Timer className="h-3.5 w-3.5 text-gray-400" />
                <span>Restant : <strong className="text-gray-700">~{formatTime(estimatedRemaining)}</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Bottom Action Bar ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mt-4">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-2">
              {/* Left: Navigation */}
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handlePrev} className="gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Précédent</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Carte précédente (←)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleNext} className="gap-1">
                        <span className="hidden sm:inline">Suivant</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Carte suivante (→)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Center: Actions */}
              <div className="flex items-center gap-1.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`gap-1.5 ${
                          currentCard.status === 'mastered'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'text-gray-600'
                        }`}
                        onClick={() => {
                          setCards((prev) =>
                            prev.map((card, i) =>
                              i === currentIndex ? { ...card, status: 'mastered' as const } : card
                            )
                          )
                        }}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Maîtrisée</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Marquer comme maîtrisée</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`gap-1.5 ${
                          currentCard.bookmarked
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'text-gray-600'
                        }`}
                        onClick={toggleBookmark}
                      >
                        {currentCard.bookmarked ? (
                          <BookmarkCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Bookmark className="h-3.5 w-3.5" />
                        )}
                        <span className="hidden md:inline">
                          {currentCard.bookmarked ? 'Favori' : 'Favori'}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{currentCard.bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1.5 text-gray-600">
                        <Flag className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Signaler</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Signaler une erreur</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Right: End Session */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                      onClick={handleEndSession}
                    >
                      <Square className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Terminer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mettre fin à la session</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
