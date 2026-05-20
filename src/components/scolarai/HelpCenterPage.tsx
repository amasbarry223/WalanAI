'use client'

import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  HelpCircle,
  Search,
  MessageCircle,
  BookOpen,
  FileText,
  Brain,
  CreditCard,
  Shield,
  Settings,
  Bot,
  Mail,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

const faqItems = [
  {
    category: 'Documents',
    icon: <FileText className="h-4 w-4" />,
    questions: [
      { q: 'Quels formats de documents sont supportés ?', a: 'ScolarAI supporte les formats PDF, Word (.docx), PowerPoint (.pptx), et les images (JPG, PNG). Nous travaillons sur le support de fichiers Excel et Markdown.' },
      { q: 'Combien de documents puis-je importer ?', a: 'Le plan Gratuit permet jusqu\'à 3 documents. Le plan Pro offre un stockage illimité avec des fichiers jusqu\'à 100 Mo chacun.' },
      { q: 'Comment fonctionne l\'importation par glisser-déposer ?', a: 'Glissez simplement vos fichiers depuis votre explorateur de fichiers vers la zone d\'importation sur la page "Mes Documents". Vous pouvez aussi cliquer sur le bouton "+" pour ouvrir le sélecteur de fichiers.' },
    ],
  },
  {
    category: 'IA & Génération',
    icon: <Brain className="h-4 w-4" />,
    questions: [
      { q: 'Comment sont générées les flashcards ?', a: 'Notre IA analyse le contenu de vos documents et extrait automatiquement les concepts clés pour créer des paires question/réponse. L\'algorithme de répétition espacée (SRS) optimise votre mémorisation.' },
      { q: 'L\'assistant IA peut-il se tromper ?', a: 'L\'assistant utilise une architecture RAG (Retrieval-Augmented Generation) qui ancre ses réponses dans vos documents. Cependant, comme toute IA, il peut occasionnellement faire des erreurs. Nous recommandons de vérifier les informations importantes.' },
      { q: 'Combien de temps prend la génération d\'un résumé ?', a: 'En général, la génération d\'un résumé prend moins de 30 secondes pour un document de 20 pages. Les documents plus longs peuvent nécessiter un peu plus de temps.' },
    ],
  },
  {
    category: 'Abonnement',
    icon: <CreditCard className="h-4 w-4" />,
    questions: [
      { q: 'Quelle est la différence entre le plan Gratuit et Pro ?', a: 'Le plan Gratuit inclut 3 documents, 10 quiz par mois, et l\'assistant IA basique. Le plan Pro offre un stockage illimité, des quiz illimités, l\'export PDF, la répétition espacée avancée, et un support prioritaire.' },
      { q: 'Puis-je annuler mon abonnement à tout moment ?', a: 'Oui, vous pouvez annuler votre abonnement Pro à tout moment. Vous conserverez l\'accès aux fonctionnalités Pro jusqu\'à la fin de votre période de facturation.' },
    ],
  },
  {
    category: 'Sécurité',
    icon: <Shield className="h-4 w-4" />,
    questions: [
      { q: 'Mes documents sont-ils sécurisés ?', a: 'Absolument. Tous vos documents sont chiffrés en transit (TLS 1.3) et au repos (AES-256). Nous ne partageons jamais vos données avec des tiers.' },
      { q: 'Comment puis-je supprimer mes données ?', a: 'Vous pouvez supprimer vos documents à tout moment depuis la page "Mes Documents". Pour supprimer votre compte et toutes vos données, rendez-vous dans Paramètres > Zone de danger.' },
    ],
  },
]

const helpLinks = [
  { title: 'Guide de démarrage', description: 'Apprenez les bases de ScolarAI en 5 minutes', icon: <BookOpen className="h-5 w-5" />, color: 'text-blue-500 bg-blue-50' },
  { title: 'Importer des documents', description: 'Comment téléverser vos cours', icon: <FileText className="h-5 w-5" />, color: 'text-emerald-500 bg-emerald-50' },
  { title: 'Utiliser les flashcards', description: 'Optimisez votre révision avec le SRS', icon: <Brain className="h-5 w-5" />, color: 'text-violet-500 bg-violet-50' },
  { title: 'Assistant IA', description: 'Tirez le meilleur de votre assistant', icon: <Bot className="h-5 w-5" />, color: 'text-amber-500 bg-amber-50' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function HelpCenterPage() {
  const { setCurrentPage } = useAppStore()

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentPage('dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-emerald-500" />
            Centre d&apos;aide
          </h1>
          <p className="text-sm text-gray-500">Trouvez des réponses à vos questions</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher dans l'aide..."
            className="pl-12 h-12 text-base bg-white border-gray-200 rounded-xl"
          />
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {helpLinks.map((link) => (
          <Card key={link.title} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className={`inline-flex p-2.5 rounded-lg ${link.color} mb-2 group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <p className="text-sm font-medium text-gray-900">{link.title}</p>
              <p className="text-[11px] text-gray-400 mt-1">{link.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* FAQ */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Questions fréquentes</h2>
        <div className="space-y-4">
          {faqItems.map((category) => (
            <Card key={category.category} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  {category.icon}
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`${category.category}-${index}`} className="border-b-0">
                      <AccordionTrigger className="text-sm text-gray-700 hover:text-emerald-600 py-3 text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-500 pb-3">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Vous n&apos;avez pas trouvé votre réponse ?</h3>
            <p className="text-sm text-emerald-100 mb-4">
              Notre équipe est là pour vous aider
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 gap-2">
                <MessageCircle className="h-4 w-4" />
                Contacter le support
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <Mail className="h-4 w-4" />
                Envoyer un email
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
