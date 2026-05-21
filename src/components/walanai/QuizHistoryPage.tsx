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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function QuizHistoryPage() {
  const { setCurrentPage, quizHistory } = useAppStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const history = quizHistory

  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, q) => sum + q.score, 0) / history.length)
      : 0
  const totalQuizzes = history.length
  const bestScore = history.length > 0 ? Math.max(...history.map((q) => q.score)) : 0

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="h-6 w-6 text-emerald-500" />
            Historique Quiz
          </h1>
          <p className="text-sm text-gray-500">Vos quiz terminés (sauvegardés localement)</p>
        </div>
      </motion.div>

      {history.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Aucun quiz enregistré pour l&apos;instant</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                Terminez un quiz dans le générateur pour le voir ici.
              </p>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => setCurrentPage('quiz-generator')}
              >
                Lancer un quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Quiz joués</p>
                  <p className="text-xl font-bold text-gray-900">{totalQuizzes}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Score moyen</p>
                  <p className="text-xl font-bold text-gray-900">{avgScore}%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Trophy className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Meilleur score</p>
                  <p className="text-xl font-bold text-gray-900">{bestScore}%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-3">
            {history.map((quiz, index) => (
              <motion.div key={quiz.id} variants={itemVariants}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader
                    className="pb-2 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === quiz.id ? null : quiz.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-base truncate">{quiz.title}</CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {quiz.date} · {quiz.duration} · {quiz.correctAnswers}/{quiz.totalQuestions} bonnes réponses
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          className={
                            quiz.score >= 80
                              ? 'bg-emerald-100 text-emerald-700 border-0'
                              : quiz.score >= 60
                                ? 'bg-amber-100 text-amber-700 border-0'
                                : 'bg-red-100 text-red-700 border-0'
                          }
                        >
                          {quiz.score}%
                        </Badge>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-400 transition-transform ${
                            expandedId === quiz.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  {expandedId === quiz.id && (
                    <CardContent className="pt-0 border-t">
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 py-3">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {quiz.correctAnswers} correctes
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-red-400" />
                          {quiz.totalQuestions - quiz.correctAnswers} incorrectes
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {quiz.duration}
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {quiz.type}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setCurrentPage('quiz-generator')}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Refaire un quiz
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
