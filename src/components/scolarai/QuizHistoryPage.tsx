'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  History,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Trophy,
  ChevronDown,
  RotateCcw,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'

interface QuizResult {
  id: number
  title: string
  subject: string
  score: number
  totalQuestions: number
  correctAnswers: number
  date: string
  duration: string
  type: 'qcm' | 'vrai-faux' | 'ouvert'
  details?: { question: string; isCorrect: boolean; yourAnswer: string; correctAnswer: string }[]
}

const mockQuizHistory: QuizResult[] = [
  {
    id: 1,
    title: 'Quiz - Droit Civil : Les Contrats',
    subject: 'Droit Civil',
    score: 85,
    totalQuestions: 20,
    correctAnswers: 17,
    date: '18 Mai 2026',
    duration: '12 min',
    type: 'qcm',
    details: [
      { question: 'Un contrat de vente nécessite-t-il un écrit ?', isCorrect: true, yourAnswer: 'Non, sauf exception', correctAnswer: 'Non, sauf exception' },
      { question: 'Le consentement est-il un élément essentiel du contrat ?', isCorrect: true, yourAnswer: 'Oui', correctAnswer: 'Oui' },
      { question: 'La capacité juridique est-elle requise pour contracter ?', isCorrect: false, yourAnswer: 'Non', correctAnswer: 'Oui' },
    ],
  },
  {
    id: 2,
    title: 'Quiz - Microéconomie : Offre et Demande',
    subject: 'Microéconomie',
    score: 70,
    totalQuestions: 15,
    correctAnswers: 10,
    date: '16 Mai 2026',
    duration: '10 min',
    type: 'qcm',
  },
  {
    id: 3,
    title: 'Vrai/Faux - Algorithmes : Tri et Recherche',
    subject: 'Algorithmes',
    score: 90,
    totalQuestions: 10,
    correctAnswers: 9,
    date: '14 Mai 2026',
    duration: '8 min',
    type: 'vrai-faux',
  },
  {
    id: 4,
    title: 'Questions ouvertes - Histoire : La Révolution',
    subject: 'Histoire',
    score: 65,
    totalQuestions: 5,
    correctAnswers: 3,
    date: '12 Mai 2026',
    duration: '20 min',
    type: 'ouvert',
  },
  {
    id: 5,
    title: 'Quiz - Mathématiques : Statistiques',
    subject: 'Mathématiques',
    score: 80,
    totalQuestions: 12,
    correctAnswers: 10,
    date: '10 Mai 2026',
    duration: '15 min',
    type: 'qcm',
  },
]

const typeColors = {
  qcm: 'bg-blue-100 text-blue-700',
  'vrai-faux': 'bg-amber-100 text-amber-700',
  ouvert: 'bg-violet-100 text-violet-700',
}

const typeLabels = {
  qcm: 'QCM',
  'vrai-faux': 'Vrai/Faux',
  ouvert: 'Ouvert',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function QuizHistoryPage() {
  const { setCurrentPage } = useAppStore()
  const [expandedQuiz, setExpandedQuiz] = useState<number | null>(null)

  const avgScore = Math.round(mockQuizHistory.reduce((sum, q) => sum + q.score, 0) / mockQuizHistory.length)
  const totalQuizzes = mockQuizHistory.length
  const bestScore = Math.max(...mockQuizHistory.map(q => q.score))

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
              <History className="h-6 w-6 text-emerald-500" />
              Historique Quiz
            </h1>
            <p className="text-sm text-gray-500">Consultez vos résultats passés</p>
          </div>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={() => setCurrentPage('revision')}>
          <RotateCcw className="h-4 w-4" />
          Nouveau Quiz
        </Button>
      </motion.div>

      {/* Stats overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Score moyen', value: `${avgScore}%`, icon: <Target className="h-5 w-5" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Quiz complétés', value: totalQuizzes, icon: <Trophy className="h-5 w-5" />, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Meilleur score', value: `${bestScore}%`, icon: <Star className="h-5 w-5" />, color: 'text-violet-500', bg: 'bg-violet-50' },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quiz list */}
      <motion.div variants={itemVariants} className="space-y-3">
        {mockQuizHistory.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                >
                  {/* Score circle */}
                  <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-3 ${
                    quiz.score >= 80 ? 'bg-emerald-50 border-emerald-500' :
                    quiz.score >= 60 ? 'bg-amber-50 border-amber-500' :
                    'bg-red-50 border-red-500'
                  }`}>
                    <span className={`text-lg font-bold ${
                      quiz.score >= 80 ? 'text-emerald-600' :
                      quiz.score >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}%
                    </span>
                  </div>

                  {/* Quiz info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{quiz.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-[10px] ${typeColors[quiz.type]}`}>
                        {typeLabels[quiz.type]}
                      </Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.duration}
                      </span>
                      <span className="text-xs text-gray-400">{quiz.date}</span>
                    </div>
                  </div>

                  {/* Results summary */}
                  <div className="hidden sm:flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">{quiz.correctAnswers}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Correct</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium text-gray-700">{quiz.totalQuestions - quiz.correctAnswers}</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Erreur</p>
                    </div>
                  </div>

                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform shrink-0 ${expandedQuiz === quiz.id ? 'rotate-180' : ''}`} />
                </div>

                {/* Expanded details */}
                {expandedQuiz === quiz.id && quiz.details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t bg-gray-50/50 p-4"
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Détail des réponses</p>
                    <div className="space-y-3">
                      {quiz.details.map((detail, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {detail.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">{detail.question}</p>
                            {!detail.isCorrect && (
                              <div className="mt-1 space-y-0.5">
                                <p className="text-xs text-red-500">
                                  <span className="font-medium">Votre réponse :</span> {detail.yourAnswer}
                                </p>
                                <p className="text-xs text-emerald-600">
                                  <span className="font-medium">Bonne réponse :</span> {detail.correctAnswer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
