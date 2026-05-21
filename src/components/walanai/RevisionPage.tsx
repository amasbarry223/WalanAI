'use client'

import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Brain,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Lightbulb,
  Star,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'

interface Flashcard {
  id: number
  question: string
  answer: string
  subject: string
  status: 'new' | 'learning' | 'review' | 'mastered'
}

const mockFlashcards: Flashcard[] = [
  { id: 1, question: 'Quelle est la différence entre un contrat de vente et un contrat de louage ?', answer: 'Le contrat de vente transfère la propriété d\'un bien moyennant un prix, tandis que le contrat de louage confère uniquement un droit d\'usage temporaire contre un loyer.', subject: 'Droit Civil', status: 'review' },
  { id: 2, question: 'Définissez l\'élasticité-prix de la demande', answer: 'L\'élasticité-prix mesure la variation relative de la quantité demandée en réponse à une variation relative du prix. Elle se calcule : e = (%ΔQd) / (%ΔP).', subject: 'Microéconomie', status: 'new' },
  { id: 3, question: 'Quelle est la complexité temporelle d\'un algorithme de recherche binaire ?', answer: 'O(log n) - La recherche binaire divise l\'espace de recherche par deux à chaque étape, ce qui donne une complexité logarithmique.', subject: 'Algorithmes', status: 'learning' },
  { id: 4, question: 'Quelles sont les causes principales de la Révolution française ?', answer: 'Les causes principales sont : la crise financière de l\'État, les inégalités sociales (privilèges de la noblesse), les idées des Lumières, et les mauvaises récoltes entraînant la hausse du prix du pain.', subject: 'Histoire', status: 'mastered' },
  { id: 5, question: 'Qu\'est-ce qu\'une liste chaînée et quel est son avantage sur un tableau ?', answer: 'Une liste chaînée est une structure de données où chaque élément (nœud) contient une valeur et un pointeur vers le nœud suivant. Son avantage : insertion/suppression en O(1) sans décaler les éléments.', subject: 'Algorithmes', status: 'review' },
  { id: 6, question: 'Expliquez le principe de l\'offre et de la demande', answer: 'Le principe stipule que le prix d\'un bien est déterminé par l\'intersection de la courbe d\'offre et de demande. Si l\'offre dépasse la demande, le prix baisse ; si la demande dépasse l\'offre, le prix augmente.', subject: 'Microéconomie', status: 'new' },
]

const statusConfig = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700' },
  learning: { label: 'En cours', color: 'bg-amber-100 text-amber-700' },
  review: { label: 'À réviser', color: 'bg-violet-100 text-violet-700' },
  mastered: { label: 'Maîtrisé', color: 'bg-emerald-100 text-emerald-700' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function RevisionPage() {
  const { setCurrentPage } = useAppStore()
  const { toast } = useToast()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [activeTab, setActiveTab] = useState('flashcards')
  const [cardStatuses, setCardStatuses] = useState<Record<number, string>>({})

  const currentCard = mockFlashcards[currentCardIndex]
  const masteredCount = Object.values(cardStatuses).filter((s) => s === 'maitrise').length
  const progress = Math.round((masteredCount / mockFlashcards.length) * 100)

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev + 1) % mockFlashcards.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev - 1 + mockFlashcards.length) % mockFlashcards.length)
  }

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-5 w-6 text-emerald-500" />
              Révision
            </h1>
            <p className="text-sm text-gray-500">Flashcards & Quiz personnalisés</p>
          </div>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={() => toast({ title: 'Génération de fiches IA bientôt disponible' })}>
          <Sparkles className="h-4 w-4" />
          Générer des fiches
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total fiches', value: mockFlashcards.length, icon: <BookOpen className="h-4 w-4" />, color: 'text-blue-500' },
          { label: 'Maîtrisées', value: masteredCount, icon: <Check className="h-4 w-4" />, color: 'text-emerald-500' },
          { label: 'À réviser', value: Object.values(cardStatuses).filter((s) => s === 'arevoir').length, icon: <RefreshCw className="h-4 w-4" />, color: 'text-violet-500' },
          { label: 'Nouvelles', value: mockFlashcards.filter((c) => !cardStatuses[c.id]).length, icon: <Star className="h-4 w-4" />, color: 'text-amber-500' },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Progress */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression globale</span>
              <span className="text-sm font-bold text-emerald-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="flashcards" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Liste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flashcards" className="mt-4">
            {/* Flashcard Player */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-2xl">
                {/* Card counter */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    Fiche {currentCardIndex + 1} / {mockFlashcards.length}
                  </span>
                  <Badge className={cardStatuses[currentCard.id] === 'difficile' ? 'bg-red-100 text-red-700' : cardStatuses[currentCard.id] === 'arevoir' ? 'bg-violet-100 text-violet-700' : cardStatuses[currentCard.id] === 'maitrise' ? 'bg-emerald-100 text-emerald-700' : statusConfig[currentCard.status].color}>
                    {cardStatuses[currentCard.id] === 'difficile' ? 'Difficile' : cardStatuses[currentCard.id] === 'arevoir' ? 'À revoir' : cardStatuses[currentCard.id] === 'maitrise' ? 'Maîtrisé' : statusConfig[currentCard.status].label}
                  </Badge>
                </div>

                {/* Flashcard */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCardIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="relative w-full cursor-pointer"
                      onClick={() => setIsFlipped(!isFlipped)}
                      style={{ perspective: '1000px' }}
                    >
                      <motion.div
                        className="w-full min-h-[280px]"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Front */}
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white rounded-xl border-2 border-emerald-100 shadow-lg"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <Badge variant="outline" className="mb-4 text-emerald-600 border-emerald-200">
                            {currentCard.subject}
                          </Badge>
                          <p className="text-lg font-medium text-gray-900 text-center">
                            {currentCard.question}
                          </p>
                          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
                            <Eye className="h-4 w-4" />
                            Cliquez pour voir la réponse
                          </div>
                        </div>

                        {/* Back */}
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-emerald-500 rounded-xl shadow-lg text-white"
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                          <Badge className="mb-4 bg-white/20 text-white border-0">
                            {currentCard.subject}
                          </Badge>
                          <p className="text-lg font-medium text-center">
                            {currentCard.answer}
                          </p>
                          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-100">
                            <EyeOff className="h-4 w-4" />
                            Cliquez pour voir la question
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
                  <Button variant="outline" onClick={handlePrev} className="gap-2 w-full sm:w-auto">
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200" onClick={() => { setCardStatuses((prev) => ({ ...prev, [currentCard.id]: 'difficile' })); toast({ title: 'Carte marquée comme difficile' }); handleNext() }}>
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">Difficile</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 border-amber-200" onClick={() => { setCardStatuses((prev) => ({ ...prev, [currentCard.id]: 'arevoir' })); toast({ title: 'Carte marquée à revoir' }); handleNext() }}>
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">À revoir</span>
                    </Button>
                    <Button size="sm" className="gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => { setCardStatuses((prev) => ({ ...prev, [currentCard.id]: 'maitrise' })); toast({ title: 'Carte marquée comme maîtrisée ✓' }); handleNext() }}>
                      <Check className="h-4 w-4" />
                      Maîtrisé
                    </Button>
                  </div>
                  <Button variant="outline" onClick={handleNext} className="gap-2 w-full sm:w-auto">
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="space-y-3">
              {mockFlashcards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setCurrentCardIndex(index); setActiveTab('flashcards'); setIsFlipped(false); }}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded bg-gray-50 shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{card.question}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{card.answer}</p>
                        </div>
                        <Badge className={`shrink-0 ${cardStatuses[card.id] === 'difficile' ? 'bg-red-100 text-red-700' : cardStatuses[card.id] === 'arevoir' ? 'bg-violet-100 text-violet-700' : cardStatuses[card.id] === 'maitrise' ? 'bg-emerald-100 text-emerald-700' : statusConfig[card.status].color}`}>
                          {cardStatuses[card.id] === 'difficile' ? 'Difficile' : cardStatuses[card.id] === 'arevoir' ? 'À revoir' : cardStatuses[card.id] === 'maitrise' ? 'Maîtrisé' : statusConfig[card.status].label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
