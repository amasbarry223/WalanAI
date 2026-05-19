'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  FileText,
  Video,
  ExternalLink,
  Star,
  Download,
  Search,
  Filter,
  Calculator,
  Quote,
  GitBranch,
  ArrowUpDown,
  ArrowLeft,
  Clock,
  GraduationCap,
  Lightbulb,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bookmark,
  Eye,
  Play,
  FileSpreadsheet,
  BookMarked,
  CircleDot,
} from 'lucide-react'
import { useState, useRef, useMemo } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type ResourceType = 'cours' | 'fiche' | 'video' | 'article' | 'outil'
type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé'
type Subject = 'Droit' | 'Économie' | 'Informatique' | 'Histoire' | 'Mathématiques' | 'Philosophie' | 'Langues'

interface Resource {
  id: number
  title: string
  description: string
  type: ResourceType
  subject: Subject
  difficulty: Difficulty
  rating: number
  downloads: number
  featured: boolean
  author: string
  duration: string
  chapters?: string[]
  fullDescription?: string
  relatedIds?: number[]
  imageGradient?: string
}

interface StudyTool {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

interface RecentlyViewed {
  id: number
  title: string
  type: ResourceType
  viewedAt: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const subjectColors: Record<Subject, string> = {
  Droit: 'bg-blue-100 text-blue-700 border-blue-200',
  Économie: 'bg-amber-100 text-amber-700 border-amber-200',
  Informatique: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Histoire: 'bg-purple-100 text-purple-700 border-purple-200',
  Mathématiques: 'bg-rose-100 text-rose-700 border-rose-200',
  Philosophie: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Langues: 'bg-teal-100 text-teal-700 border-teal-200',
}

const difficultyColors: Record<Difficulty, string> = {
  Débutant: 'bg-green-50 text-green-600 border-green-200',
  Intermédiaire: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  Avancé: 'bg-red-50 text-red-600 border-red-200',
}

const typeIcons: Record<ResourceType, React.ReactNode> = {
  cours: <BookOpen className="h-5 w-5" />,
  fiche: <FileText className="h-5 w-5" />,
  video: <Video className="h-5 w-5" />,
  article: <BookMarked className="h-5 w-5" />,
  outil: <Wrench className="h-5 w-5" />,
}

const typeLabels: Record<ResourceType, string> = {
  cours: 'Cours',
  fiche: 'Fiche',
  video: 'Vidéo',
  article: 'Article',
  outil: 'Outil',
}

const typeColors: Record<ResourceType, string> = {
  cours: 'text-emerald-600 bg-emerald-50',
  fiche: 'text-sky-600 bg-sky-50',
  video: 'text-rose-600 bg-rose-50',
  article: 'text-violet-600 bg-violet-50',
  outil: 'text-amber-600 bg-amber-50',
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockResources: Resource[] = [
  {
    id: 1,
    title: 'Introduction au Droit Civil Français',
    description: 'Un cours complet sur les fondamentaux du droit civil, couvrant les personnes, la famille et les obligations.',
    type: 'cours',
    subject: 'Droit',
    difficulty: 'Débutant',
    rating: 4.8,
    downloads: 2340,
    featured: true,
    author: 'Prof. Marie Dupont',
    duration: '12h',
    imageGradient: 'from-blue-400 to-cyan-400',
    chapters: [
      'Introduction générale au droit',
      'Les personnes physiques et morales',
      'La famille et le mariage',
      'Les obligations contractuelles',
      'La responsabilité civile délictuelle',
      'Les sûretés et garanties',
    ],
    fullDescription: 'Ce cours exhaustif vous guidera à travers les fondements du droit civil français. De la théorie générale du droit à l\'étude approfondie des obligations, chaque chapitre est conçu pour une compréhension progressive et structurée. Idéal pour les étudiants en première année de licence de droit.',
    relatedIds: [2, 5, 8],
  },
  {
    id: 2,
    title: 'Fiche de Révision - Droit des Obligations',
    description: 'Fiche synthétique couvrant les points essentiels du droit des obligations pour vos révisions d\'examen.',
    type: 'fiche',
    subject: 'Droit',
    difficulty: 'Intermédiaire',
    rating: 4.6,
    downloads: 1870,
    featured: true,
    author: 'Dr. Laurent Martin',
    duration: '2h',
    chapters: [
      'Formation du contrat',
      'Conditions de validité',
      'Exécution et inexécution',
      'Responsabilité délictuelle',
    ],
    fullDescription: 'Cette fiche de révision condense l\'essentiel du droit des obligations en un format clair et mnémotechnique. Parfaite pour une révision de dernière minute avant les partiels.',
    relatedIds: [1, 8],
  },
  {
    id: 3,
    title: 'Microéconomie - Théorie du Consommateur',
    description: 'Vidéo explicative détaillée sur la théorie du consommateur et les choix optimaux.',
    type: 'video',
    subject: 'Économie',
    difficulty: 'Intermédiaire',
    rating: 4.5,
    downloads: 1520,
    featured: true,
    author: 'Prof. Sophie Bernard',
    duration: '1h30',
    imageGradient: 'from-amber-400 to-orange-400',
    chapters: [
      'Préférences et utilité',
      'Contrainte budgétaire',
      'Optimum du consommateur',
      'Effets de substitution et de revenu',
    ],
    fullDescription: 'Cette vidéo pédagogique vous accompagne dans la compréhension de la théorie du consommateur. Des graphiques animés et des exemples concrets rendent les concepts abstraits accessibles.',
    relatedIds: [4, 7],
  },
  {
    id: 4,
    title: 'Analyse Mathématique - Séries et Intégrales',
    description: 'Cours approfondi sur les séries numériques et les intégrales impropres avec exercices corrigés.',
    type: 'cours',
    subject: 'Mathématiques',
    difficulty: 'Avancé',
    rating: 4.9,
    downloads: 980,
    featured: false,
    author: 'Prof. Ahmed Khelifi',
    duration: '15h',
    chapters: [
      'Séries numériques',
      'Critères de convergence',
      'Séries de fonctions',
      'Intégrales impropres',
      'Théorèmes de convergence',
      'Exercices corrigés',
    ],
    fullDescription: 'Un cours rigoureux couvrant les aspects théoriques et pratiques des séries et intégrales. Chaque chapitre inclut des démonstrations détaillées et des exercices d\'application.',
    relatedIds: [11],
  },
  {
    id: 5,
    title: 'La Révolution Française - Causes et Conséquences',
    description: 'Article analytique explorant les causes profondes et les conséquences durables de la Révolution de 1789.',
    type: 'article',
    subject: 'Histoire',
    difficulty: 'Débutant',
    rating: 4.3,
    downloads: 2100,
    featured: false,
    author: 'Dr. Claire Fontaine',
    duration: '45min',
    chapters: [
      'Le contexte pré-révolutionnaire',
      'Les causes immédiates',
      'Les phases de la Révolution',
      'L\'héritage révolutionnaire',
    ],
    fullDescription: 'Cet article propose une analyse nuancée de la Révolution Française, allant au-delà des simplifications habituelles pour explorer les dynamiques sociales, économiques et politiques.',
    relatedIds: [6],
  },
  {
    id: 6,
    title: 'Histoire de la Pensée Philosophique',
    description: 'Des Présocratiques aux Lumières, un parcours à travers l\'histoire de la philosophie occidentale.',
    type: 'cours',
    subject: 'Philosophie',
    difficulty: 'Intermédiaire',
    rating: 4.7,
    downloads: 1340,
    featured: true,
    author: 'Prof. Jean-Pierre Rousseau',
    duration: '10h',
    imageGradient: 'from-indigo-400 to-purple-400',
    chapters: [
      'Les Présocratiques',
      'Socrate, Platon, Aristote',
      'La philosophie médiévale',
      'Descartes et le rationalisme',
      'Les empiristes britanniques',
      'Kant et les Lumières',
    ],
    fullDescription: 'Ce cours propose un voyage intellectuel à travers les grandes époques de la philosophie occidentale, en mettant l\'accent sur la continuité des débats et l\'évolution des concepts.',
    relatedIds: [5, 9],
  },
  {
    id: 7,
    title: 'Fiche Révision - Macroéconomie',
    description: 'Synthèse des modèles macroéconomiques clés : IS-LM, Mundell-Fleming, et politique monétaire.',
    type: 'fiche',
    subject: 'Économie',
    difficulty: 'Avancé',
    rating: 4.4,
    downloads: 890,
    featured: false,
    author: 'Prof. Nadia El Amrani',
    duration: '1h30',
    chapters: [
      'Le modèle IS-LM',
      'Le modèle de Mundell-Fleming',
      'Politique monétaire et budgétaire',
      'Inflation et chômage',
    ],
    fullDescription: 'Une fiche de révision conçue pour les étudiants avancés en économie, avec des schémas IS-LM et des exemples chiffrés pour chaque modèle.',
    relatedIds: [3],
  },
  {
    id: 8,
    title: 'Algorithmique et Structures de Données',
    description: 'Cours pratique avec implémentation en Python des structures de données fondamentales et algorithmes classiques.',
    type: 'cours',
    subject: 'Informatique',
    difficulty: 'Intermédiaire',
    rating: 4.8,
    downloads: 3100,
    featured: true,
    author: 'Prof. Léa Moreau',
    duration: '20h',
    imageGradient: 'from-emerald-400 to-teal-400',
    chapters: [
      'Complexité algorithmique',
      'Listes chaînées et piles',
      'Arbres et graphes',
      'Algorithmes de tri',
      'Programmation dynamique',
      'Projets pratiques',
    ],
    fullDescription: 'Le cours de référence en algorithmique avec une approche hands-on. Chaque concept est illustré par du code Python commenté et des exercices progressifs.',
    relatedIds: [9, 12],
  },
  {
    id: 9,
    title: 'Vidéo - Introduction à Python',
    description: 'Tutoriel vidéo pour débutants : apprenez les bases de Python en 2 heures.',
    type: 'video',
    subject: 'Informatique',
    difficulty: 'Débutant',
    rating: 4.6,
    downloads: 4500,
    featured: true,
    author: 'Dr. Karim Benali',
    duration: '2h',
    imageGradient: 'from-teal-400 to-emerald-400',
    chapters: [
      'Installation et premier programme',
      'Variables et types de données',
      'Structures de contrôle',
      'Fonctions et modules',
    ],
    fullDescription: 'La vidéo idéale pour démarrer avec Python. Aucune expérience préalable requise. Chaque notion est expliquée pas à pas avec des exemples à l\'écran.',
    relatedIds: [8, 12],
  },
  {
    id: 10,
    title: 'Anglais Juridique - Vocabulaire Essentiel',
    description: 'Outil interactif pour maîtriser le vocabulaire juridique anglais-français avec flashcards et quiz.',
    type: 'outil',
    subject: 'Langues',
    difficulty: 'Intermédiaire',
    rating: 4.2,
    downloads: 760,
    featured: false,
    author: 'Mme. Emma Thompson',
    duration: 'Auto-rythme',
    chapters: [
      'Terminologie contractuelle',
      'Vocabulaire du procès',
      'Droit des sociétés',
      'Droit international',
    ],
    fullDescription: 'Un outil d\'apprentissage interactif conçu spécifiquement pour les étudiants en droit souhaitant perfectionner leur anglais juridique. Inclut des flashcards, des quiz et des exercices de traduction.',
    relatedIds: [1],
  },
  {
    id: 11,
    title: 'Probabilités et Statistiques Appliquées',
    description: 'Cours avec cas pratiques pour les sciences sociales et l\'économie.',
    type: 'cours',
    subject: 'Mathématiques',
    difficulty: 'Intermédiaire',
    rating: 4.5,
    downloads: 1230,
    featured: false,
    author: 'Prof. Isabelle Petit',
    duration: '14h',
    chapters: [
      'Probabilités de base',
      'Variables aléatoires',
      'Lois de probabilité',
      'Estimation et intervalles de confiance',
      'Tests d\'hypothèses',
    ],
    fullDescription: 'Ce cours applique les concepts probabilistes et statistiques aux sciences sociales. Chaque chapitre est illustré par des cas concrets tirés de l\'économie et de la sociologie.',
    relatedIds: [4, 7],
  },
  {
    id: 12,
    title: 'Base de Données SQL - Cours Pratique',
    description: 'Apprenez SQL de zéro avec des exercices pratiques sur une base de données réelle.',
    type: 'outil',
    subject: 'Informatique',
    difficulty: 'Débutant',
    rating: 4.7,
    downloads: 2800,
    featured: false,
    author: 'Prof. Marc Dubois',
    duration: '8h',
    chapters: [
      'Introduction aux bases de données',
      'Requêtes SELECT',
      'Jointures et sous-requêtes',
      'Création et modification de tables',
      'Optimisation de requêtes',
    ],
    fullDescription: 'Un outil d\'apprentissage interactif pour maîtriser SQL. Travaillez sur une vraie base de données et progressez à votre rythme avec des exercices corrigés.',
    relatedIds: [8, 9],
  },
]

const studyTools: StudyTool[] = [
  {
    id: 1,
    title: 'Calculatrice GPA',
    description: 'Calculez votre moyenne pondérée et simulez vos résultats',
    icon: <Calculator className="h-6 w-6" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
  },
  {
    id: 2,
    title: 'Générateur de citations',
    description: 'Générez des citations aux normes APA, MLA et Chicago',
    icon: <Quote className="h-6 w-6" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50 border-violet-200',
  },
  {
    id: 3,
    title: 'Outil de mind mapping',
    description: 'Créez des cartes mentales pour organiser vos idées',
    icon: <GitBranch className="h-6 w-6" />,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50 border-sky-200',
  },
  {
    id: 4,
    title: 'Convertisseur de notes',
    description: 'Convertissez vos notes entre différents systèmes de notation',
    icon: <ArrowUpDown className="h-6 w-6" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
  },
]

const mockRecentlyViewed: RecentlyViewed[] = [
  { id: 1, title: 'Introduction au Droit Civil Français', type: 'cours', viewedAt: 'Il y a 2h' },
  { id: 8, title: 'Algorithmique et Structures de Données', type: 'cours', viewedAt: 'Il y a 5h' },
  { id: 9, title: 'Vidéo - Introduction à Python', type: 'video', viewedAt: 'Hier' },
  { id: 3, title: 'Microéconomie - Théorie du Consommateur', type: 'video', viewedAt: 'Il y a 2j' },
]

// ─── Animation Variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
}

const carouselItemVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
}

// ─── Helper Components ───────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1 font-medium">{rating}</span>
    </div>
  )
}

function ResourceTypeIcon({ type, size = 'sm' }: { type: ResourceType; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' }
  const iconMap: Record<ResourceType, React.ReactNode> = {
    cours: <BookOpen className={sizeClasses[size]} />,
    fiche: <FileText className={sizeClasses[size]} />,
    video: <Video className={sizeClasses[size]} />,
    article: <BookMarked className={sizeClasses[size]} />,
    outil: <Wrench className={sizeClasses[size]} />,
  }
  return (
    <div className={`inline-flex items-center justify-center rounded-lg p-1.5 ${typeColors[type]}`}>
      {iconMap[type]}
    </div>
  )
}

// ─── Featured Carousel ───────────────────────────────────────────────────────

function FeaturedCarousel({ resources, onSelect }: { resources: Resource[]; onSelect: (r: Resource) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 340
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    setTimeout(checkScroll, 400)
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors -mr-1"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            variants={carouselItemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="shrink-0 w-[300px] sm:w-[320px]"
          >
            <Card
              className="cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
              onClick={() => onSelect(resource)}
            >
              <div className={`h-32 bg-gradient-to-r ${resource.imageGradient || 'from-emerald-400 to-teal-400'} relative`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-gray-700 border-0 gap-1 font-medium">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    En vedette
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 text-white">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-1.5">
                      {typeIcons[resource.type]}
                    </div>
                    <span className="text-xs font-medium text-white/80">{typeLabels[resource.type]}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${subjectColors[resource.subject]}`}>
                      {resource.subject}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${difficultyColors[resource.difficulty]}`}>
                      {resource.difficulty}
                    </Badge>
                  </div>
                  <StarRating rating={resource.rating} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Resource Card ───────────────────────────────────────────────────────────

function ResourceCard({ resource, onSelect }: { resource: Resource; onSelect: (r: Resource) => void }) {
  return (
    <motion.div variants={cardHover} initial="rest" whileHover="hover">
      <Card
        className="cursor-pointer border hover:border-emerald-200 transition-colors h-full flex flex-col"
        onClick={() => onSelect(resource)}
      >
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start justify-between gap-2">
            <ResourceTypeIcon type={resource.type} />
            <div className="flex items-center gap-1 text-gray-400">
              <Download className="h-3.5 w-3.5" />
              <span className="text-[11px]">{resource.downloads >= 1000 ? `${(resource.downloads / 1000).toFixed(1)}k` : resource.downloads}</span>
            </div>
          </div>
          <CardTitle className="text-sm font-semibold leading-snug mt-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {resource.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4 flex-1 flex flex-col">
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{resource.description}</p>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${subjectColors[resource.subject]}`}>
              {resource.subject}
            </Badge>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${difficultyColors[resource.difficulty]}`}>
              {resource.difficulty}
            </Badge>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <StarRating rating={resource.rating} />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1 px-2"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(resource)
              }}
            >
              Ouvrir
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Resource Detail Modal ───────────────────────────────────────────────────

function ResourceDetailModal({
  resource,
  open,
  onClose,
  allResources,
  onSelectResource,
}: {
  resource: Resource | null
  open: boolean
  onClose: () => void
  allResources: Resource[]
  onSelectResource: (r: Resource) => void
}) {
  if (!resource) return null

  const relatedResources = allResources.filter((r) =>
    resource.relatedIds?.includes(r.id)
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{resource.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[85vh]">
          <div>
            {/* Hero */}
            <div className={`h-36 bg-gradient-to-r ${resource.imageGradient || 'from-emerald-400 to-teal-400'} relative`}>
              <div className="absolute inset-0 bg-black/10" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <ResourceTypeIcon type={resource.type} size="md" />
                  <Badge className="bg-white/90 text-gray-700 border-0 text-[11px]">
                    {typeLabels[resource.type]}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 bg-white/90 ${subjectColors[resource.subject]}`}>
                    {resource.subject}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Title & Author */}
              <h2 className="text-xl font-bold text-gray-900 mb-1">{resource.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {resource.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {resource.duration}
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="flex items-center gap-1">
                  <StarRating rating={resource.rating} />
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Download className="h-4 w-4" />
                  {resource.downloads.toLocaleString('fr-FR')} téléchargements
                </div>
                <Badge variant="outline" className={`text-xs ${difficultyColors[resource.difficulty]}`}>
                  {resource.difficulty}
                </Badge>
              </div>

              {/* Full Description */}
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-emerald-500" />
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {resource.fullDescription || resource.description}
                </p>
              </div>

              {/* Table of Contents */}
              {resource.chapters && resource.chapters.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Table des matières
                  </h3>
                  <div className="space-y-1">
                    {resource.chapters.map((chapter, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-emerald-50/50 transition-colors"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{chapter}</span>
                        {resource.type === 'video' && (
                          <Play className="h-3.5 w-3.5 text-emerald-500 ml-auto shrink-0" />
                        )}
                        {resource.type === 'cours' && (
                          <FileText className="h-3.5 w-3.5 text-gray-400 ml-auto shrink-0" />
                        )}
                        {resource.type === 'fiche' && (
                          <Bookmark className="h-3.5 w-3.5 text-gray-400 ml-auto shrink-0" />
                        )}
                        {(resource.type === 'article' || resource.type === 'outil') && (
                          <CircleDot className="h-3.5 w-3.5 text-gray-400 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Resources */}
              {relatedResources.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                    Ressources associées
                  </h3>
                  <div className="space-y-2">
                    {relatedResources.map((related) => (
                      <button
                        key={related.id}
                        onClick={() => {
                          onSelectResource(related)
                        }}
                        className="flex items-center gap-3 w-full p-2.5 rounded-lg border hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors text-left"
                      >
                        <ResourceTypeIcon type={related.type} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{related.title}</p>
                          <p className="text-[11px] text-gray-500">{related.subject} · {related.difficulty}</p>
                        </div>
                        <StarRating rating={related.rating} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Accéder
                </Button>
                <Button variant="outline" className="flex-1 gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                  <Download className="h-4 w-4" />
                  Télécharger
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function ResourcesPage() {
  const { setCurrentPage } = useAppStore()

  const [activeTab, setActiveTab] = useState('tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const featuredResources = useMemo(
    () => mockResources.filter((r) => r.featured),
    []
  )

  const categoryTabs = useMemo(() => {
    const counts: Record<string, number> = { tous: mockResources.length }
    mockResources.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1
    })
    return [
      { key: 'tous', label: 'Tous', count: counts.tous },
      { key: 'cours', label: 'Cours', count: counts.cours || 0 },
      { key: 'fiche', label: 'Fiches', count: counts.fiche || 0 },
      { key: 'video', label: 'Vidéos', count: counts.video || 0 },
      { key: 'article', label: 'Articles', count: counts.article || 0 },
      { key: 'outil', label: 'Outils', count: counts.outil || 0 },
    ]
  }, [])

  const filteredResources = useMemo(() => {
    let result = mockResources
    if (activeTab !== 'tous') {
      result = result.filter((r) => r.type === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeTab, searchQuery])

  const handleSelectResource = (resource: Resource) => {
    setSelectedResource(resource)
    setModalOpen(true)
  }

  return (
    <motion.div
      className="p-4 md:p-6 max-w-[1400px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-500" />
              Bibliothèque de ressources
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Explorez des cours, fiches, vidéos et outils pour booster votre apprentissage
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une ressource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
            />
          </div>
          <Button variant="outline" className="h-10 gap-2 border-gray-200 hover:border-emerald-200 hover:text-emerald-600">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtrer</span>
          </Button>
          <Button variant="outline" className="h-10 gap-2 border-gray-200 hover:border-emerald-200 hover:text-emerald-600">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">Trier</span>
          </Button>
        </div>
      </motion.div>

      {/* ── Featured Resources Carousel ─────────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900">Ressources en vedette</h2>
        </div>
        <FeaturedCarousel resources={featuredResources} onSelect={handleSelectResource} />
      </motion.div>

      {/* ── Category Tabs & Resource Grid ───────────────────────────────── */}
      <motion.div variants={itemVariants} className="mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-gray-100/80 p-1 h-auto flex-wrap gap-1">
            {categoryTabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm text-sm px-4 py-1.5"
              >
                {tab.label}
                <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5 py-0 h-4 min-w-[18px] flex items-center justify-center">
                  {tab.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filteredResources.map((resource) => (
                  <motion.div key={resource.id} variants={itemVariants}>
                    <ResourceCard resource={resource} onSelect={handleSelectResource} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredResources.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Aucune ressource trouvée</p>
                <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos critères de recherche</p>
                <Button
                  variant="ghost"
                  className="mt-3 text-emerald-600 hover:text-emerald-700"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveTab('tous')
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── Study Tools & Recently Viewed ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Tools */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-5 w-5 text-emerald-500" />
                Outils d&apos;étude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studyTools.map((tool) => (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors hover:shadow-sm ${tool.bgColor}`}
                  >
                    <div className={`p-2 rounded-lg bg-white shadow-sm ${tool.color}`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{tool.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{tool.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recently Viewed */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-5 w-5 text-emerald-500" />
                Récemment consultés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockRecentlyViewed.map((item) => {
                  const resource = mockResources.find((r) => r.id === item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => resource && handleSelectResource(resource)}
                      className="flex items-center gap-3 w-full p-2.5 rounded-lg border hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors text-left"
                    >
                      <ResourceTypeIcon type={item.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.viewedAt}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Resource Detail Modal ───────────────────────────────────────── */}
      <ResourceDetailModal
        resource={selectedResource}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        allResources={mockResources}
        onSelectResource={handleSelectResource}
      />
    </motion.div>
  )
}
