'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import {
  Crown,
  Check,
  X,
  Sparkles,
  Shield,
  ArrowLeft,
  Star,
  Zap,
  FileText,
  Brain,
  MessageSquare,
  Download,
  Ban,
  Calendar,
  HeadphonesIcon,
  Award,
  HelpCircle,
  RefreshCw,
  Quote,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: 'easeOut' } },
}

const freeFeatures = [
  { label: '3 documents', icon: FileText, included: true },
  { label: '10 quiz par mois', icon: Brain, included: true },
  { label: 'Assistant IA basique', icon: MessageSquare, included: true },
  { label: '5 flashcards par document', icon: Sparkles, included: true },
  { label: "Pas d'export PDF", icon: Download, included: false },
  { label: 'Publicité', icon: Ban, included: false },
]

const proFeatures = [
  { label: 'Documents illimités', icon: FileText, included: true },
  { label: 'Quiz illimités', icon: Brain, included: true },
  { label: 'Assistant IA avancé (GPT-4)', icon: MessageSquare, included: true },
  { label: 'Flashcards illimitées', icon: Sparkles, included: true },
  { label: 'Export PDF', icon: Download, included: true },
  { label: 'Sans publicité', icon: Ban, included: true },
  { label: 'Planificateur avancé', icon: Calendar, included: true },
  { label: 'Priorité support', icon: HeadphonesIcon, included: true },
  { label: 'Badge "Pro" exclusif', icon: Award, included: true },
]

const comparisonFeatures = [
  { name: 'Documents', free: '3', pro: 'Illimités' },
  { name: 'Quiz par mois', free: '10', pro: 'Illimités' },
  { name: 'Assistant IA', free: 'Basique', pro: 'Avancé (GPT-4)' },
  { name: 'Flashcards par document', free: '5', pro: 'Illimitées' },
  { name: 'Export PDF', free: false, pro: true },
  { name: 'Sans publicité', free: false, pro: true },
  { name: 'Planificateur avancé', free: false, pro: true },
  { name: 'Priorité support', free: false, pro: true },
  { name: 'Badge "Pro" exclusif', free: false, pro: true },
  { name: 'Analyse de progression', free: false, pro: true },
  { name: 'Modes de révision', free: '1', pro: '5+' },
  { name: 'Stockage cloud', free: '100 Mo', pro: '10 Go' },
]

const faqItems = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer:
      'Oui, vous pouvez passer du plan Gratuit au plan Pro à tout moment. Si vous souhaitez revenir au plan Gratuit, vous pouvez le faire à la fin de votre période de facturation en cours. Vos données seront conservées, mais certaines fonctionnalités Pro seront désactivées.',
  },
  {
    question: 'Comment fonctionne la garantie satisfait ou remboursé ?',
    answer:
      'Nous offrons une garantie satisfait ou remboursé de 30 jours sur le plan Pro. Si vous n\'êtes pas satisfait dans les 30 premiers jours, contactez notre support et nous vous rembourserons intégralement, sans questions posées.',
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer:
      'Nous acceptons les cartes bancaires (Visa, Mastercard, Carte Bleue), PayPal et les virements SEPA pour les abonnements annuels. Tous les paiements sont sécurisés et chiffrés avec la norme PCI DSS.',
  },
  {
    question: 'Mes données sont-elles en sécurité avec WalanAI ?',
    answer:
      'Absolument. Nous utilisons un chiffrement de bout en bout pour protéger vos documents et données personnelles. Vos fichiers ne sont jamais partagés avec des tiers. Nous sommes conformes au RGPD et vous pouvez exporter ou supprimer vos données à tout moment.',
  },
]

const testimonials = [
  {
    name: 'Léa Martin',
    initials: 'LM',
    role: 'Étudiante en Droit',
    quote:
      "WalanAI Pro a complètement transformé ma façon de réviser. Les flashcards automatiques et l'assistant GPT-4 m'ont fait gagner des heures chaque semaine. Je ne pourrais plus m'en passer !",
    rating: 5,
  },
  {
    name: 'Thomas Dubois',
    initials: 'TD',
    role: 'Étudiant en Médecine',
    quote:
      "L'export PDF et les quiz illimités sont parfaits pour mes révisions de médecine. Le planificateur m'aide à organiser mes sessions de révision espacée. Résultat : mes notes ont augmenté de 15%.",
    rating: 5,
  },
  {
    name: 'Camille Rousseau',
    initials: 'CR',
    role: 'Étudiante en Économie',
    quote:
      "Le rapport qualité-prix est excellent. Pour moins de 8€ par mois avec l'annuel, j'ai un assistant IA qui comprend mes cours et me génère des quiz pertinents. La garantie 30 jours m'a convaincue d'essayer.",
    rating: 5,
  },
]

export default function PricingPage() {
  const { user, setCurrentPage, updateUserPlan } = useAppStore()
  const { toast } = useToast()
  const [isAnnual, setIsAnnual] = useState(false)

  const proPrice = isAnnual ? '7.99' : '9.99'
  const currentPlan = user?.plan || 'gratuit'

  return (
    <motion.div
      className="bg-gradient-to-b from-gray-50 to-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <motion.div variants={itemVariants} className="mb-6">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 gap-2 -ml-2"
            onClick={() => setCurrentPage('dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Tarification
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Choisissez votre plan
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Débloquez tout le potentiel de WalanAI
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-10">
          <span
            className={`text-sm font-medium transition-colors ${
              !isAnnual ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            Mensuel
          </span>
          <div className="relative">
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300 h-6 w-11 [&>span]:size-5"
            />
          </div>
          <span
            className={`text-sm font-medium transition-colors ${
              isAnnual ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            Annuel
          </span>
          {isAnnual && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-semibold">
                Économisez 20%
              </Badge>
            </motion.div>
          )}
          {!isAnnual && (
            <Badge variant="outline" className="text-gray-400 border-gray-200 text-xs font-semibold">
              Économisez 20%
            </Badge>
          )}
        </motion.div>

        {/* Plan Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {/* Free Plan Card */}
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card className="h-full border-gray-200 relative overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">Gratuit</CardTitle>
                </div>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">0€</span>
                  <span className="text-gray-400 text-sm ml-1">/mois</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Parfait pour découvrir WalanAI
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                <Separator className="mb-4" />
                <ul className="space-y-3">
                  {freeFeatures.map((feature) => (
                    <li key={feature.label} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                          <X className="h-3 w-3 text-red-400" />
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                        }`}
                      >
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                    disabled={currentPlan === 'gratuit'}
                  >
                    {currentPlan === 'gratuit' ? 'Plan actuel' : 'Plan Gratuit'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Plan Card */}
          <motion.div variants={cardHover} initial="rest" whileHover="hover">
            <Card className="h-full relative overflow-hidden md:scale-[1.03] md:-my-2 border-0 shadow-xl ring-2 ring-emerald-400/50">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-500 p-[2px]">
                <div className="h-full w-full rounded-[10px] bg-white" />
              </div>
              {/* Popular badge */}
              <div className="absolute top-0 right-0 z-10">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-[10px] flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5" />
                  Populaire
                </div>
              </div>
              <div className="relative z-[1] h-full flex flex-col">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-md bg-emerald-100">
                      <Crown className="h-5 w-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Pro</CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                      RECOMMANDÉ
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">{proPrice}€</span>
                      <span className="text-gray-400 text-sm">/mois</span>
                    </div>
                    {isAnnual && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-emerald-600 mt-1 font-medium"
                      >
                        95,88€ facturés annuellement
                      </motion.p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Pour les étudiants sérieux
                  </p>
                </CardHeader>
                <CardContent className="pt-2 flex-1 flex flex-col">
                  <Separator className="mb-4" />
                  <ul className="space-y-3 flex-1">
                    {proFeatures.map((feature) => (
                      <li key={feature.label} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-emerald-200 gap-2"
                      disabled={currentPlan === 'pro'}
                      onClick={() => {
                        if (currentPlan !== 'pro') {
                          toast({
                            title: 'Plan Pro activé (démo locale)',
                            description: 'Sans backend : votre abonnement est enregistré dans le navigateur.',
                          })
                          updateUserPlan('pro')
                        }
                      }}
                    >
                      <Zap className="h-4 w-4" />
                      {currentPlan === 'pro' ? 'Plan actuel' : 'Passer à Pro'}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Comparaison détaillée
          </h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Fonctionnalité
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-500 w-[140px]">
                      Gratuit
                    </th>
                    <th className="text-center py-4 px-6 text-sm w-[140px]">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <Crown className="h-3.5 w-3.5" />
                        Pro
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={feature.name}
                      className={`border-b last:border-b-0 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="py-3.5 px-6 text-sm text-gray-700 font-medium">
                        {feature.name}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-500">{feature.free}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-emerald-700 font-semibold">
                            {feature.pro}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div variants={itemVariants} className="mb-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-emerald-600 mb-2">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Questions fréquentes
            </h2>
          </div>
          <Card>
            <CardContent className="pt-2">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-sm font-medium text-gray-800 hover:text-emerald-600 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-500 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Money-back Guarantee */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-10 w-20 h-20 bg-teal-100/40 rounded-full translate-y-8" />
            <CardContent className="py-8 relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <Shield className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 justify-center sm:justify-start">
                    Garantie satisfait ou remboursé 30 jours
                    <RefreshCw className="h-4 w-4 text-emerald-500" />
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 max-w-lg">
                    Essayez WalanAI Pro sans risque. Si vous n&apos;êtes pas satisfait dans les
                    30 premiers jours, nous vous rembourserons intégralement — sans questions posées.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-emerald-600 mb-2">
              <Quote className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Ce que nos étudiants disent
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <Separator className="mb-4" />
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-emerald-100">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
