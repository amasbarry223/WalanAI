'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  Flame,
  AlertTriangle,
  BookOpen,
  Brain,
  Target,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Scale,
  Monitor,
  Landmark,
  Globe,
  History,
  Zap,
  Star,
  GraduationCap,
  BarChart3,
  Timer,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const performanceMetrics = {
  globalScore: 72,
  globalScoreTrend: 'up' as const,
  globalScoreDiff: 5,
  studyTime: 12,
  studyTimeComparison: '+2h vs semaine dernière',
  regularity: 5,
  regularityTotal: 7,
  streak: 3,
  weakPoints: 3,
  weakPointsSeverity: 'medium' as const,
}

type InsightType = 'revision' | 'planification' | 'progression' | 'alerte' | 'conseil'
type Priority = 'haute' | 'moyenne' | 'basse'

interface AIInsight {
  id: string
  type: InsightType
  title: string
  description: string
  priority: Priority
  action: string
  subject?: string
}

const aiInsights: AIInsight[] = [
  {
    id: '1',
    type: 'revision',
    title: 'Révision urgente : Droit Constitutionnel',
    description: 'Votre score a chuté de 15% sur les 2 dernières sessions. Il est crucial de revoir les concepts de séparation des pouvoirs.',
    priority: 'haute',
    action: 'Commencer la révision',
    subject: 'Droit',
  },
  {
    id: '2',
    type: 'alerte',
    title: 'Baisse de performance en Économie',
    description: 'Vos résultats en microéconomie ont diminué de 8% cette semaine. Pensez à consolider les bases de l\'offre et la demande.',
    priority: 'haute',
    action: 'Voir les détails',
    subject: 'Économie',
  },
  {
    id: '3',
    type: 'planification',
    title: 'Optimisez votre emploi du temps',
    description: 'Vos sessions de 45min en Informatique sont plus efficaces que celles de 30min. Privilégiez des blocs plus longs.',
    priority: 'moyenne',
    action: 'Ajuster le plan',
  },
  {
    id: '4',
    type: 'progression',
    title: 'Milestone atteint : 100 flashcards',
    description: 'Félicitations ! Vous avez maîtrisé 100 flashcards en Histoire. Votre taux de rétention est de 87%.',
    priority: 'basse',
    action: 'Voir le bilan',
    subject: 'Histoire',
  },
  {
    id: '5',
    type: 'conseil',
    title: 'Technique de répétition espacée',
    description: 'Vos données montrent que vous révisez souvent le même jour. L\'espacement de 2-3 jours améliore la mémorisation de 40%.',
    priority: 'moyenne',
    action: 'En savoir plus',
  },
  {
    id: '6',
    type: 'revision',
    title: 'Révision recommandée : Algorithmes de tri',
    description: 'Vous n\'avez pas révisé ce sujet depuis 12 jours. Le rappel est recommandé pour maintenir votre niveau.',
    priority: 'moyenne',
    action: 'Réviser maintenant',
    subject: 'Informatique',
  },
  {
    id: '7',
    type: 'progression',
    title: 'Série de 5 jours consécutifs !',
    description: 'Vous étudiez régulièrement depuis 5 jours. Continuez sur cette lancée pour battre votre record de 8 jours.',
    priority: 'basse',
    action: 'Continuer',
  },
  {
    id: '8',
    type: 'conseil',
    title: 'Variez vos méthodes d\'apprentissage',
    description: 'Alterner entre flashcards, quiz et lecture améliore la rétention. Essayez d\'ajouter des quiz à votre routine Anglais.',
    priority: 'moyenne',
    action: 'Créer un quiz',
    subject: 'Anglais',
  },
]

interface SubjectAnalysis {
  name: string
  icon: React.ReactNode
  trend: number[]
  mastery: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'
  masteryPercent: number
  focusAreas: string[]
  nextSession: string
  nextSessionDuration: string
}

const subjectAnalyses: SubjectAnalysis[] = [
  {
    name: 'Droit',
    icon: <Scale className="h-5 w-5" />,
    trend: [65, 70, 68, 72, 75, 71, 72],
    mastery: 'Intermédiaire',
    masteryPercent: 62,
    focusAreas: ['Droit constitutionnel', 'Droits fondamentaux'],
    nextSession: 'Révision active',
    nextSessionDuration: '45 min',
  },
  {
    name: 'Économie',
    icon: <Landmark className="h-5 w-5" />,
    trend: [58, 55, 60, 57, 54, 52, 50],
    mastery: 'Débutant',
    masteryPercent: 38,
    focusAreas: ['Microéconomie', 'Offre et demande'],
    nextSession: 'Quiz de diagnostic',
    nextSessionDuration: '30 min',
  },
  {
    name: 'Informatique',
    icon: <Monitor className="h-5 w-5" />,
    trend: [40, 45, 50, 55, 60, 65, 68],
    mastery: 'Avancé',
    masteryPercent: 78,
    focusAreas: ['Algorithmes de tri', 'Structures de données'],
    nextSession: 'Flashcards',
    nextSessionDuration: '25 min',
  },
  {
    name: 'Histoire',
    icon: <History className="h-5 w-5" />,
    trend: [80, 82, 85, 83, 87, 88, 90],
    mastery: 'Expert',
    masteryPercent: 92,
    focusAreas: ['XXe siècle', 'Guerres mondiales'],
    nextSession: 'Approfondissement',
    nextSessionDuration: '20 min',
  },
  {
    name: 'Anglais',
    icon: <Globe className="h-5 w-5" />,
    trend: [50, 52, 48, 55, 53, 56, 58],
    mastery: 'Intermédiaire',
    masteryPercent: 55,
    focusAreas: ['Vocabulaire académique', 'Compréhension écrite'],
    nextSession: 'Exercices pratiques',
    nextSessionDuration: '35 min',
  },
]

interface StudyBlock {
  subject: string
  duration: string
  type: string
  priority: Priority
}

interface DayPlan {
  dayName: string
  date: string
  isToday: boolean
  blocks: StudyBlock[]
}

const weeklyPlan: DayPlan[] = [
  {
    dayName: 'Lundi',
    date: '24 fév',
    isToday: true,
    blocks: [
      { subject: 'Droit', duration: '45 min', type: 'Révision active', priority: 'haute' },
      { subject: 'Informatique', duration: '30 min', type: 'Flashcards', priority: 'moyenne' },
    ],
  },
  {
    dayName: 'Mardi',
    date: '25 fév',
    isToday: false,
    blocks: [
      { subject: 'Économie', duration: '45 min', type: 'Quiz diagnostic', priority: 'haute' },
      { subject: 'Anglais', duration: '30 min', type: 'Vocabulaire', priority: 'moyenne' },
    ],
  },
  {
    dayName: 'Mercredi',
    date: '26 fév',
    isToday: false,
    blocks: [
      { subject: 'Histoire', duration: '20 min', type: 'Approfondissement', priority: 'basse' },
      { subject: 'Droit', duration: '35 min', type: 'Exercices', priority: 'haute' },
    ],
  },
  {
    dayName: 'Jeudi',
    date: '27 fév',
    isToday: false,
    blocks: [
      { subject: 'Informatique', duration: '40 min', type: 'Pratique', priority: 'moyenne' },
      { subject: 'Économie', duration: '30 min', type: 'Révision', priority: 'haute' },
    ],
  },
  {
    dayName: 'Vendredi',
    date: '28 fév',
    isToday: false,
    blocks: [
      { subject: 'Anglais', duration: '35 min', type: 'Compréhension', priority: 'moyenne' },
      { subject: 'Droit', duration: '25 min', type: 'Révision espacée', priority: 'haute' },
    ],
  },
  {
    dayName: 'Samedi',
    date: '1 mar',
    isToday: false,
    blocks: [
      { subject: 'Histoire', duration: '25 min', type: 'Quiz', priority: 'basse' },
      { subject: 'Informatique', duration: '30 min', type: 'Flashcards', priority: 'moyenne' },
    ],
  },
  {
    dayName: 'Dimanche',
    date: '2 mar',
    isToday: false,
    blocks: [
      { subject: 'Révision libre', duration: '30 min', type: 'Au choix', priority: 'basse' },
    ],
  },
]

interface StrengthWeakness {
  label: string
  confidence: number
  detail: string
}

const strengths: StrengthWeakness[] = [
  { label: 'Mémorisation à long terme', confidence: 88, detail: 'Excellente rétention après 3+ révisions' },
  { label: 'Régularité hebdomadaire', confidence: 75, detail: '5 jours sur 7 en moyenne' },
  { label: 'Compréhension conceptuelle', confidence: 82, detail: 'Bonne capacité d\'abstraction' },
  { label: 'Histoire', confidence: 92, detail: 'Meilleure matière avec 90% de maîtrise' },
  { label: 'Informatique', confidence: 78, detail: 'Progression constante de +28 pts' },
]

const weaknesses: StrengthWeakness[] = [
  { label: 'Économie - Micro', confidence: 85, detail: 'Score en baisse, concepts fragiles' },
  { label: 'Rétention à court terme', confidence: 72, detail: 'Oubli rapide sans révision J+1' },
  { label: 'Droit Constitutionnel', confidence: 68, detail: 'Confusion entre concepts similaires' },
  { label: 'Vocabulaire anglais', confidence: 65, detail: 'Manque de pratique régulière' },
  { label: 'Sessions trop courtes', confidence: 70, detail: 'Sessions < 30min moins efficaces' },
]

interface StudyTip {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const studyTips: StudyTip[] = [
  {
    title: 'Technique Pomodoro',
    description: 'Travaillez par blocs de 25 minutes avec 5 minutes de pause. Après 4 cycles, prenez une pause de 15-20 minutes. Cette méthode booste la concentration.',
    icon: <Timer className="h-8 w-8" />,
    color: 'text-rose-500',
  },
  {
    title: 'Rappel actif',
    description: 'Testez-vous plutôt que de relire passivement. Fermez votre livre et essayez de restituer l\'information de mémoire. C\'est la méthode la plus efficace pour la rétention.',
    icon: <Brain className="h-8 w-8" />,
    color: 'text-violet-500',
  },
  {
    title: 'Répétition espacée',
    description: 'Révisez à intervalles croissants : J+1, J+3, J+7, J+14, J+30. Cette méthode exploite la courbe d\'oubli d\'Ebbinghaus pour une mémorisation durable.',
    icon: <Calendar className="h-8 w-8" />,
    color: 'text-emerald-500',
  },
  {
    title: 'Méthode Feynman',
    description: 'Expliquez un concept comme si vous l\'enseigniez à un enfant. Si vous ne pouvez pas le simplifier, vous ne l\'avez pas vraiment compris.',
    icon: <GraduationCap className="h-8 w-8" />,
    color: 'text-amber-500',
  },
  {
    title: 'Interleaving',
    description: 'Alternez entre différentes matières ou types de problèmes dans une même session. Cette variété améliore l\'apprentissage et la flexibilité cognitive.',
    icon: <BarChart3 className="h-8 w-8" />,
    color: 'text-blue-500',
  },
]

// ─── Animation variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const insightCardVariants = {
  hidden: (type: InsightType) => ({
    opacity: 0,
    x: type === 'alerte' || type === 'revision' ? -20 : type === 'progression' ? 20 : 0,
    y: 10,
  }),
  visible: (type: InsightType) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  }),
}

const planSlideVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' },
  }),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const insightConfig: Record<InsightType, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  revision: { icon: <RotateCcw className="h-5 w-5" />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500' },
  planification: { icon: <Calendar className="h-5 w-5" />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
  progression: { icon: <TrendingUp className="h-5 w-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-l-emerald-500' },
  alerte: { icon: <AlertTriangle className="h-5 w-5" />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-500' },
  conseil: { icon: <Lightbulb className="h-5 w-5" />, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-l-violet-500' },
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  haute: { label: 'Haute', className: 'bg-red-100 text-red-700 border-0' },
  moyenne: { label: 'Moyenne', className: 'bg-amber-100 text-amber-700 border-0' },
  basse: { label: 'Basse', className: 'bg-gray-100 text-gray-600 border-0' },
}

const masteryConfig: Record<string, { color: string; bg: string }> = {
  'Débutant': { color: 'text-red-600', bg: 'bg-red-50' },
  'Intermédiaire': { color: 'text-amber-600', bg: 'bg-amber-50' },
  'Avancé': { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Expert': { color: 'text-blue-600', bg: 'bg-blue-50' },
}

function MiniSparkline({ data, color = '#10B981' }: { data: number[]; color?: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const height = 32
  const width = 80
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return { x, y }
  })

  return (
    <svg width={width} height={height} className="overflow-visible">
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        />
      ))}
      <motion.polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </svg>
  )
}

function AnimatedCounter({ target, suffix = '', duration = 1.2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = target / (duration * 60)
    const animate = () => {
      start += step
      if (start >= target) {
        setCount(target)
        return
      }
      setCount(Math.floor(start))
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return <span>{count}{suffix}</span>
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudyCoachPage() {
  const { setCurrentPage } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set())
  const [currentTip, setCurrentTip] = useState(0)
  const [expandedStrength, setExpandedStrength] = useState<string | null>(null)
  const [expandedWeakness, setExpandedWeakness] = useState<string | null>(null)
  const [insightOrder, setInsightOrder] = useState<string[]>(aiInsights.map(i => i.id))

  const handleNewAnalysis = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setInsightOrder(prev => [...prev].sort(() => Math.random() - 0.5))
    }, 2000)
  }

  const dismissInsight = (id: string) => {
    setDismissedInsights((prev) => new Set([...prev, id]))
  }

  // Auto-rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % studyTips.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextTip = useCallback(() => setCurrentTip((p) => (p + 1) % studyTips.length), [])
  const prevTip = useCallback(() => setCurrentTip((p) => (p - 1 + studyTips.length) % studyTips.length), [])

  const visibleInsights = insightOrder
    .map(id => aiInsights.find(i => i.id === id))
    .filter((i): i is AIInsight => !!i && !dismissedInsights.has(i.id))

  const handleInsightAction = (insight: AIInsight) => {
    switch (insight.action) {
      case 'Commencer la révision':
        setCurrentPage('revision')
        break
      case 'Voir les détails':
        toast({ title: 'Détails disponibles prochainement' })
        break
      case 'Ajuster le plan':
        toast({ title: 'Personnalisation du plan bientôt disponible' })
        break
      case 'Voir le bilan':
        setCurrentPage('progress')
        break
      case 'En savoir plus':
        toast({ title: 'Plus d\'informations bientôt disponibles' })
        break
      case 'Réviser maintenant':
        setCurrentPage('revision')
        break
      case 'Continuer':
        setCurrentPage('flashcard-deck')
        break
      case 'Créer un quiz':
        setCurrentPage('quiz-generator')
        break
      default:
        toast({ title: insight.action })
    }
  }

  return (
    <ScrollArea className="h-full">
      <motion.div
        className="p-4 md:p-6 lg:p-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ─── Header ─────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')} className="mt-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-7 w-7 text-emerald-500" />
                </motion.span>
                Coach IA
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Votre assistant d&apos;étude personnalisé</p>
              <p className="text-xs text-gray-400 mt-1">
                Dernière analyse : aujourd&apos;hui à 14:32
              </p>
            </div>
          </div>
          <Button
            onClick={handleNewAnalysis}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Nouvelle analyse
              </>
            )}
          </Button>
        </motion.div>

        {/* ─── Performance Overview ───────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Score global',
              value: <AnimatedCounter target={performanceMetrics.globalScore} suffix="%" />,
              icon: <Target className="h-5 w-5" />,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
              trend: performanceMetrics.globalScoreTrend === 'up' ? (
                <span className="flex items-center text-xs text-emerald-600 font-medium">
                  <TrendingUp className="h-3.5 w-3.5 mr-0.5" />+{performanceMetrics.globalScoreDiff}%
                </span>
              ) : (
                <span className="flex items-center text-xs text-red-500 font-medium">
                  <TrendingDown className="h-3.5 w-3.5 mr-0.5" />-{performanceMetrics.globalScoreDiff}%
                </span>
              ),
            },
            {
              label: 'Temps d\'étude',
              value: <><AnimatedCounter target={performanceMetrics.studyTime} suffix="h" /> <span className="text-sm font-normal text-gray-500">cette semaine</span></>,
              icon: <Clock className="h-5 w-5" />,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
              trend: <span className="text-xs text-blue-600 font-medium">{performanceMetrics.studyTimeComparison}</span>,
            },
            {
              label: 'Régularité',
              value: <><AnimatedCounter target={performanceMetrics.regularity} />/{performanceMetrics.regularityTotal} jours</>,
              icon: <Flame className="h-5 w-5" />,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              trend: <span className="flex items-center text-xs text-amber-600 font-medium"><Flame className="h-3.5 w-3.5 mr-0.5" />Série de {performanceMetrics.streak} jours</span>,
            },
            {
              label: 'Points faibles',
              value: <><AnimatedCounter target={performanceMetrics.weakPoints} /> <span className="text-sm font-normal text-gray-500">identifiés</span></>,
              icon: <AlertCircle className="h-5 w-5" />,
              color: performanceMetrics.weakPointsSeverity === 'high' ? 'text-red-600' : 'text-amber-600',
              bg: performanceMetrics.weakPointsSeverity === 'high' ? 'bg-red-50' : 'bg-amber-50',
              trend: (
                <span className={`flex items-center text-xs font-medium ${performanceMetrics.weakPointsSeverity === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                  <AlertTriangle className="h-3.5 w-3.5 mr-0.5" />
                  Sévérité {performanceMetrics.weakPointsSeverity === 'high' ? 'haute' : 'moyenne'}
                </span>
              ),
            },
          ].map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} mb-3`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                <div className="mt-2">{stat.trend}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* ─── Main Content: Insights + Weekly Plan ──────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* AI Insights Section */}
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-5 w-5 text-emerald-500" />
                  Recommandations IA
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs ml-1">
                    {visibleInsights.length} insights
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {visibleInsights.map((insight, idx) => {
                      const config = insightConfig[insight.type]
                      const prio = priorityConfig[insight.priority]
                      return (
                        <motion.div
                          key={insight.id}
                          custom={insight.type}
                          variants={insightCardVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                          layout
                          className={`flex gap-4 p-4 rounded-xl border-l-4 ${config.border} ${config.bg} hover:shadow-sm transition-shadow group`}
                        >
                          <div className={`shrink-0 p-2.5 rounded-xl bg-white/80 ${config.color}`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                {insight.title}
                              </h4>
                              <Badge className={`${prio.className} text-[10px] shrink-0`}>
                                {prio.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-3">
                              {insight.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white gap-1"
                                onClick={() => handleInsightAction(insight)}
                              >
                                {insight.action}
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-gray-400 hover:text-gray-600 gap-1"
                                onClick={() => dismissInsight(insight.id)}
                              >
                                <X className="h-3 w-3" />
                                Ignorer
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  {visibleInsights.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-300" />
                      <p className="font-medium">Toutes les recommandations ont été traitées</p>
                      <p className="text-sm mt-1">Lancez une nouvelle analyse pour plus d&apos;insights</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Study Plan Sidebar */}
          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  Plan de la semaine
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] ml-1">IA</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[430px] overflow-y-auto pr-1 custom-scrollbar">
                  {weeklyPlan.map((day, idx) => (
                    <motion.div
                      key={day.dayName}
                      custom={idx}
                      variants={planSlideVariants}
                      initial="hidden"
                      animate="visible"
                      className={`rounded-xl p-3 ${day.isToday ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50/70'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-semibold ${day.isToday ? 'text-emerald-700' : 'text-gray-700'}`}>
                          {day.dayName}
                        </span>
                        <span className="text-xs text-gray-400">{day.date}</span>
                        {day.isToday && (
                          <Badge className="bg-emerald-500 text-white border-0 text-[9px] ml-1 px-1.5">Aujourd&apos;hui</Badge>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {day.blocks.map((block, bIdx) => (
                          <div
                            key={bIdx}
                            className="flex items-center gap-2 text-xs bg-white rounded-lg p-2"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              block.priority === 'haute' ? 'bg-red-500' : block.priority === 'moyenne' ? 'bg-amber-500' : 'bg-gray-300'
                            }`} />
                            <span className="font-medium text-gray-700 flex-1">{block.subject}</span>
                            <span className="text-gray-400">{block.duration}</span>
                            <span className="text-gray-400 hidden sm:inline">· {block.type}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1" onClick={() => toast({ title: 'Personnalisation bientôt disponible' })}>
                    <Zap className="h-3 w-3" />
                    Personnaliser
                  </Button>
                  <Button size="sm" className="flex-1 h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-white gap-1" onClick={() => toast({ title: 'Plan appliqué au planificateur !' })}>
                    <CheckCircle2 className="h-3 w-3" />
                    Appliquer au planificateur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── Subject Analysis Grid ──────────────────────────── */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Analyse par matière
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {subjectAnalyses.map((subject, idx) => {
                  const mConfig = masteryConfig[subject.mastery]
                  const trendLast = subject.trend[subject.trend.length - 1]
                  const trendPrev = subject.trend[subject.trend.length - 2]
                  const trendUp = trendLast >= trendPrev
                  return (
                    <motion.div
                      key={subject.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="rounded-xl border p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500">{subject.icon}</span>
                          <span className="font-semibold text-gray-900 text-sm">{subject.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {trendUp ? (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center mb-3">
                        <MiniSparkline
                          data={subject.trend}
                          color={trendUp ? '#10B981' : '#EF4444'}
                        />
                      </div>

                      <Badge className={`${mConfig.bg} ${mConfig.color} border-0 text-xs mb-3`}>
                        {subject.mastery}
                      </Badge>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Maîtrise</span>
                          <span className="font-medium text-gray-700">{subject.masteryPercent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${subject.masteryPercent}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1 mb-3">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">Focus</p>
                        {subject.focusAreas.map((area) => (
                          <p key={area} className="text-xs text-gray-600 flex items-center gap-1">
                            <Target className="h-2.5 w-2.5 text-emerald-400" />
                            {area}
                          </p>
                        ))}
                      </div>

                      <div className="pt-3 border-t">
                        <p className="text-[10px] text-gray-400 mb-1">Prochaine session</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">{subject.nextSession}</span>
                          <span className="text-xs text-gray-400">{subject.nextSessionDuration}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Strengths & Weaknesses ─────────────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Forces */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Forces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strengths.map((s, idx) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.35 }}
                    className="cursor-pointer group"
                    onClick={() => setExpandedStrength(expandedStrength === s.label ? null : s.label)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                        {s.label}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600">{s.confidence}%</span>
                    </div>
                    <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.confidence}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.08 + 0.2 }}
                      />
                    </div>
                    <AnimatePresence>
                      {expandedStrength === s.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-gray-500 mt-2 pl-1 border-l-2 border-emerald-300 py-1">
                            {s.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Axes d'amélioration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Axes d&apos;amélioration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weaknesses.map((w, idx) => (
                  <motion.div
                    key={w.label}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.35 }}
                    className="cursor-pointer group"
                    onClick={() => setExpandedWeakness(expandedWeakness === w.label ? null : w.label)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                        {w.label}
                      </span>
                      <span className="text-xs font-semibold text-amber-600">{w.confidence}%</span>
                    </div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${w.confidence}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.08 + 0.2 }}
                      />
                    </div>
                    <AnimatePresence>
                      {expandedWeakness === w.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs text-gray-500 mt-2 pl-1 border-l-2 border-amber-300 py-1">
                            {w.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Study Tips Carousel ────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-5 w-5 text-emerald-500" />
                Conseils méthodologiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTip}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-100"
                  >
                    <div className={`shrink-0 p-4 rounded-2xl bg-white shadow-sm ${studyTips[currentTip].color}`}>
                      {studyTips[currentTip].icon}
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">
                        {studyTips[currentTip].title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                        {studyTips[currentTip].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={prevTip}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    {studyTips.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentTip(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentTip
                            ? 'bg-emerald-500 w-6'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextTip}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </ScrollArea>
  )
}
