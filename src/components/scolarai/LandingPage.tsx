'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import {
  Brain,
  Sparkles,
  BookOpen,
  Target,
  Trophy,
  Clock,
  Users,
  Zap,
  ArrowRight,
  Star,
  ChevronRight,
  GraduationCap,
  BarChart3,
  MessageCircle,
  Rocket,
  Check,
  Menu,
  X,
  Flame,
  Crown,
  Layers,
  PenTool,
  Lightbulb,
  ChevronDown,
  Globe,
  Mail,
} from 'lucide-react'

// ─── Animation Configs ───────────────────────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Section Wrapper with Intersection Observer ──────────────

function AnimatedSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      {children}
    </motion.section>
  )
}

// ─── Infinite Scroll Marquee ──────────────────────────────────

function InfiniteMarquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollerRef.current) return
    const scroller = scrollerRef.current
    const scrollContent = Array.from(scroller.children)
    scrollContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true)
      scroller.appendChild(duplicatedItem)
    })
    gsap.to(scroller, {
      x: `-50%`,
      duration: speed,
      repeat: -1,
      ease: 'none',
    })
  }, [speed])

  return (
    <div className="overflow-hidden">
      <div ref={scrollerRef} className="flex gap-6 w-max">
        {children}
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────

function Navbar() {
  const { setCurrentPage } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Tarifs', href: '#pricing' },
  ]

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-sm border-b border-zinc-100 shadow-sm'
          : 'bg-white border-b border-zinc-100'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div
          className="flex shrink-0 items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-zinc-900 whitespace-nowrap">
            ScolarAI
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-zinc-600 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="hidden sm:flex text-zinc-600 hover:text-zinc-900 font-medium"
            onClick={() => setCurrentPage('login')}
          >
            Connexion
          </Button>
          <Button
            className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4"
            onClick={() => setCurrentPage('register')}
          >
            Commencer
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-zinc-100 bg-white px-6 pb-4 pt-2"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-zinc-100">
              <Button variant="outline" onClick={() => { setCurrentPage('login'); setMobileOpen(false) }}>
                Connexion
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => { setCurrentPage('register'); setMobileOpen(false) }}
              >
                Commencer
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────

function HeroSection() {
  const { setCurrentPage } = useAppStore()
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return
    const els = heroRef.current.querySelectorAll('.gsap-hero')
    gsap.fromTo(
      els,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )
  }, [])

  return (
    <section ref={heroRef} className="px-6 pt-32 pb-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="gsap-hero mb-6 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1.5 text-xs font-semibold tracking-widest text-white uppercase shadow-lg">
            <Sparkles className="h-3.5 w-3.5" />
            <span>50 000+</span>+ Quiz IA Générés
          </div>

          {/* Main Title */}
          <h1 className="gsap-hero mb-6 text-4xl leading-tight font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl">
            Vos cours prennent des jours.{' '}
            <span className="text-emerald-500 font-serif italic" style={{ letterSpacing: '-0.04em' }}>
              Réviser
            </span>{' '}
            <span className="text-emerald-500">prend des secondes.</span>
          </h1>

          {/* Subtitle */}
          <p className="gsap-hero mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-zinc-600">
            Générez des quiz, flashcards et plans de révision personnalisés en quelques secondes. Sans manuels supplémentaires. Sans perte de temps. Sans stress.
          </p>

          {/* CTA Buttons */}
          <div className="gsap-hero flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-6 py-3 font-medium text-white transition-colors sm:w-auto"
              onClick={() => setCurrentPage('register')}
            >
              Essayer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="#features"
              className="w-full rounded-lg border border-zinc-200 px-6 py-3 text-center font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto"
            >
              Voir des exemples
            </a>
          </div>

          <p className="gsap-hero mt-4 text-sm text-zinc-400">
            Sans carte bancaire &bull; 5 quiz gratuits
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Product Showcase Section ─────────────────────────────────

function ProductShowcase() {
  const showcaseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showcaseRef.current) return
    gsap.fromTo(
      showcaseRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
    )
  }, [])

  return (
    <section className="relative overflow-x-clip bg-white pb-12">
      <div ref={showcaseRef} className="mx-auto mb-6 max-w-5xl px-4">
        {/* Browser Mockup */}
        <div className="group overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-2 shadow-[0_20px_70px_-15px_rgba(16,185,129,0.25),0_10px_40px_-10px_rgba(0,0,0,0.15)]">
          {/* Browser Bar */}
          <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 transition-colors group-hover:bg-red-400" />
              <div className="hidden h-2.5 w-2.5 rounded-full bg-zinc-200 transition-colors group-hover:bg-yellow-400 sm:block" />
              <div className="hidden h-2.5 w-2.5 rounded-full bg-zinc-200 transition-colors group-hover:bg-green-400 sm:block" />
            </div>
            <div className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
              app.scolarai.fr
            </div>
            <div className="w-10" />
          </div>

          {/* App Content */}
          <div className="bg-white p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Sidebar Preview */}
              <div className="space-y-3 order-2 sm:order-1">
                <div className="h-3 bg-zinc-100 rounded-full w-2/3" />
                {[
                  { label: 'Quiz', icon: '📝', active: true },
                  { label: 'Flashcards', icon: '🃏', active: false },
                  { label: 'Révision', icon: '🔄', active: false },
                  { label: 'Progrès', icon: '📊', active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 rounded-lg p-2.5 text-sm ${
                      item.active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-zinc-500'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main Content Preview */}
              <div className="sm:col-span-2 space-y-4 order-1 sm:order-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-zinc-100 rounded-full w-32 mb-1" />
                    <div className="h-2.5 bg-zinc-50 rounded-full w-48" />
                  </div>
                  <div className="h-8 bg-emerald-500 rounded-lg w-24 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-white">Générer</span>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Score', value: '8 050', icon: '🟢', bg: 'bg-emerald-50' },
                    { label: 'Série', value: '15j', icon: '🔥', bg: 'bg-orange-50' },
                    { label: 'Quiz', value: '47', icon: '📊', bg: 'bg-violet-50' },
                  ].map((card) => (
                    <div key={card.label} className={`${card.bg} rounded-xl p-3 text-center`}>
                      <div className="text-base mb-0.5">{card.icon}</div>
                      <div className="text-sm font-bold text-zinc-900">{card.value}</div>
                      <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{card.label}</div>
                    </div>
                  ))}
                </div>

                {/* Chart Preview */}
                <div className="h-28 bg-gradient-to-br from-emerald-50/60 to-teal-50/60 rounded-xl border border-emerald-100/60 flex items-end justify-around p-3">
                  {[40, 65, 50, 80, 60, 90, 75, 55, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-5 sm:w-7 bg-gradient-to-t from-emerald-400 to-teal-300 rounded-t-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: 1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Feature Cards */}
      <div className="space-y-4">
        <InfiniteMarquee speed={40}>
          {[
            { title: 'Quiz IA', desc: 'Générés en 10 secondes', icon: <Target className="h-4 w-4" />, color: 'from-emerald-50 to-teal-50 border-emerald-200/60' },
            { title: 'Flashcards', desc: 'Répétition espacée', icon: <Layers className="h-4 w-4" />, color: 'from-violet-50 to-purple-50 border-violet-200/60' },
            { title: 'Coach IA', desc: 'Disponible 24/7', icon: <MessageCircle className="h-4 w-4" />, color: 'from-amber-50 to-orange-50 border-amber-200/60' },
            { title: 'Progrès', desc: 'Suivi en temps réel', icon: <BarChart3 className="h-4 w-4" />, color: 'from-rose-50 to-pink-50 border-rose-200/60' },
            { title: 'Révision', desc: 'Algorithme adaptatif', icon: <Clock className="h-4 w-4" />, color: 'from-cyan-50 to-sky-50 border-cyan-200/60' },
            { title: 'Groupes', desc: 'Collaboration entre pairs', icon: <Users className="h-4 w-4" />, color: 'from-lime-50 to-green-50 border-lime-200/60' },
          ].map((item, i) => (
            <div
              key={i}
              className={`shrink-0 w-56 rounded-xl border bg-gradient-to-br ${item.color} p-4 shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2 text-zinc-700">
                {item.icon}
                <span className="font-semibold text-sm">{item.title}</span>
              </div>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </InfiniteMarquee>

        <InfiniteMarquee speed={50}>
          {[
            { title: 'Planificateur', desc: 'Organisation intelligente', icon: <Rocket className="h-4 w-4" />, color: 'from-teal-50 to-emerald-50 border-teal-200/60' },
            { title: 'Pomodoro', desc: 'Gestion du temps', icon: <Clock className="h-4 w-4" />, color: 'from-red-50 to-rose-50 border-red-200/60' },
            { title: 'Documents', desc: 'Importez vos PDF', icon: <BookOpen className="h-4 w-4" />, color: 'from-blue-50 to-indigo-50 border-blue-200/60' },
            { title: 'Notes', desc: 'Prise de notes IA', icon: <PenTool className="h-4 w-4" />, color: 'from-yellow-50 to-amber-50 border-yellow-200/60' },
            { title: 'Classement', desc: 'Competez sainement', icon: <Trophy className="h-4 w-4" />, color: 'from-orange-50 to-red-50 border-orange-200/60' },
            { title: 'Ressources', desc: 'Bibliothèque partagée', icon: <Lightbulb className="h-4 w-4" />, color: 'from-fuchsia-50 to-pink-50 border-fuchsia-200/60' },
          ].map((item, i) => (
            <div
              key={i}
              className={`shrink-0 w-56 rounded-xl border bg-gradient-to-br ${item.color} p-4 shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2 text-zinc-700">
                {item.icon}
                <span className="font-semibold text-sm">{item.title}</span>
              </div>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </InfiniteMarquee>
      </div>
    </section>
  )
}

// ─── Features Section ─────────────────────────────────────────

const features = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: 'IA Adaptative',
    description: "Notre algorithme s'adapte à votre niveau et votre rythme d'apprentissage pour vous proposer du contenu sur mesure.",
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: 'Quiz Personnalisés',
    description: "Générez des quiz en un clic sur n'importe quel sujet, avec des difficultés progressives qui évoluent avec vous.",
    color: 'bg-violet-50 text-violet-600 border-violet-200/60',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Révision Espacée',
    description: 'Notre système de répétition espacée optimise votre mémorisation à long terme en vous rappelant au bon moment.',
    color: 'bg-amber-50 text-amber-600 border-amber-200/60',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Suivi en Temps Réel',
    description: "Visualisez vos progrès avec des tableaux de bord détaillés et des statistiques sur votre évolution.",
    color: 'bg-rose-50 text-rose-600 border-rose-200/60',
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Groupes d'Étude",
    description: 'Collaborez avec vos pairs, partagez des ressources et progressez ensemble dans des groupes thématiques.',
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200/60',
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: 'Coach IA',
    description: 'Un assistant intelligent disponible 24/7 pour répondre à vos questions et vous guider dans vos révisions.',
    color: 'bg-teal-50 text-teal-600 border-teal-200/60',
  },
]

function FeaturesSection() {
  return (
    <AnimatedSection id="features" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            Tout ce qu&apos;il faut pour{' '}
            <span className="text-emerald-500 font-serif italic" style={{ letterSpacing: '-0.04em' }}>
              réussir
            </span>
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Des outils puissants conçus par des pédagogues et des ingénieurs IA pour maximiser votre potentiel académique.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <div className="group h-full rounded-xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── How It Works Section ─────────────────────────────────────

const steps = [
  {
    step: '01',
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Importez vos cours',
    description: 'Téléchargez vos PDF, notes ou liens. Notre IA analyse et structure automatiquement le contenu.',
    color: 'bg-emerald-500',
  },
  {
    step: '02',
    icon: <Brain className="h-6 w-6" />,
    title: "L'IA génère votre plan",
    description: "Des quiz, flashcards et sessions de révision sont créés sur mesure en fonction de votre profil d'apprentissage.",
    color: 'bg-teal-500',
  },
  {
    step: '03',
    icon: <Trophy className="h-6 w-6" />,
    title: 'Progressez et excellez',
    description: 'Suivez vos progrès en temps réel, ajustez votre stratégie et atteignez vos objectifs académiques.',
    color: 'bg-amber-500',
  },
]

function HowItWorksSection() {
  return (
    <AnimatedSection id="how-it-works" className="py-24 sm:py-32 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            Simple comme{' '}
            <span className="text-emerald-500 font-serif italic" style={{ letterSpacing: '-0.04em' }}>
              1, 2, 3
            </span>
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            En trois étapes, transformez vos cours en un parcours d&apos;apprentissage optimisé.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeInUp} className="relative">
              <div className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-white shadow-lg`}>
                    {step.icon}
                  </div>
                </div>
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                  Étape {step.step}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{step.description}</p>
              </div>
              {/* Connector Arrow */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 -right-4 w-8">
                  <ArrowRight className="h-4 w-4 text-zinc-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── Stats Section ────────────────────────────────────────────

const stats = [
  { value: '2 500+', label: 'Étudiants actifs', icon: <Users className="h-5 w-5" /> },
  { value: '50 000+', label: 'Quiz générés', icon: <Zap className="h-5 w-5" /> },
  { value: '95%', label: 'Taux de satisfaction', icon: <Star className="h-5 w-5" /> },
  { value: '3x', label: "Plus efficace qu'une révision classique", icon: <Flame className="h-5 w-5" /> },
]

function StatsSection() {
  return (
    <AnimatedSection className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 text-zinc-600 mb-3">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900 mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── Testimonials Section ─────────────────────────────────────

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'Étudiante en Droit',
    text: "ScolarAI a complètement transformé ma façon de réviser. Les quiz personnalisés m'ont permis de doubler mes notes en 2 mois !",
    avatar: 'MD',
    color: 'bg-emerald-500',
    rating: 5,
  },
  {
    name: 'Thomas Bernard',
    role: 'Étudiant en Médecine',
    text: "Le système de révision espacée est incroyable. Je retiens 3x plus qu'avant en étudiant moins longtemps. Un vrai game-changer.",
    avatar: 'TB',
    color: 'bg-teal-500',
    rating: 5,
  },
  {
    name: 'Léa Martin',
    role: 'Étudiante en Économie',
    text: "Le coach IA est disponible 24/7 et répond à toutes mes questions. C'est comme avoir un tuteur personnel à domicile !",
    avatar: 'LM',
    color: 'bg-amber-500',
    rating: 5,
  },
]

function TestimonialsSection() {
  return (
    <AnimatedSection id="testimonials" className="py-24 sm:py-32 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            Ils nous{' '}
            <span className="text-emerald-500 font-serif italic" style={{ letterSpacing: '-0.04em' }}>
              font confiance
            </span>
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Découvrez comment ScolarAI aide des milliers d&apos;étudiants à atteindre leurs objectifs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="h-full border border-zinc-200 bg-white transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-700 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── FAQ Section ──────────────────────────────────────────────

const faqItems = [
  {
    question: 'Comment ScolarAI génère-t-il des quiz personnalisés ?',
    answer: "Notre IA analyse vos documents de cours, identifie les concepts clés et génère automatiquement des quiz adaptés à votre niveau. L'algorithme s'ajuste en temps réel en fonction de vos réponses pour optimiser votre apprentissage.",
  },
  {
    question: 'Qu\'est-ce que la révision espacée ?',
    answer: "La révision espacée est une technique d'apprentissage basée sur la répétition à intervalles croissants. ScolarAI calcule le moment optimal pour réviser chaque notion, maximisant ainsi la rétention à long terme tout en réduisant le temps d'étude.",
  },
  {
    question: 'Puis-je utiliser ScolarAI gratuitement ?',
    answer: "Oui ! Le plan gratuit vous permet de créer jusqu'à 5 quiz par mois, d'utiliser la révision espacée basique et de suivre vos progrès. Pour débloquer toutes les fonctionnalités, vous pouvez passer au plan Pro avec un essai gratuit de 14 jours.",
  },
  {
    question: 'Le Coach IA est-il vraiment disponible 24/7 ?',
    answer: "Absolument ! Notre Coach IA est alimenté par des modèles de langage avancés et est disponible à tout moment. Il peut répondre à vos questions, expliquer des concepts complexes et vous guider dans vos révisions, jour et nuit.",
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: "La sécurité de vos données est notre priorité. Tous vos documents et données sont chiffrés de bout en bout. Nous ne partageons jamais vos informations avec des tiers et vous pouvez supprimer vos données à tout moment.",
  },
  {
    question: 'Quelles matières sont supportées ?',
    answer: "ScolarAI fonctionne avec toutes les matières ! Que vous étudiez le droit, la médecine, l'économie, les sciences ou les langues, notre IA s'adapte à n'importe quel contenu pour créer des outils de révision pertinents.",
  },
]

function FAQSection() {
  return (
    <AnimatedSection id="faq" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            Questions{' '}
            <span className="text-emerald-500 font-serif italic" style={{ letterSpacing: '-0.04em' }}>
              fréquentes
            </span>
          </h2>
          <p className="text-lg text-zinc-600">
            Tout ce que vous devez savoir pour bien démarrer avec ScolarAI.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-zinc-200 rounded-xl px-6 data-[state=open]:shadow-md transition-shadow bg-white"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-zinc-900 hover:no-underline py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-600 leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

// ─── Pricing Section ──────────────────────────────────────────

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    description: 'Parfait pour découvrir ScolarAI',
    features: ['5 quiz par mois', 'Révision espacée basique', 'Suivi de progrès', 'Accès communauté'],
    cta: 'Commencer gratuitement',
    highlighted: false,
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    name: 'Pro',
    price: '9,99€',
    period: '/mois',
    description: 'Pour les étudiants sérieux',
    features: [
      'Quiz illimités',
      'Révision espacée avancée',
      'Coach IA 24/7',
      "Groupes d'étude",
      'Flashcards IA',
      'Analyses détaillées',
      'Support prioritaire',
    ],
    cta: 'Essai gratuit 14 jours',
    highlighted: true,
    icon: <Crown className="h-5 w-5" />,
  },
]

function PricingSection() {
  const { setCurrentPage } = useAppStore()

  return (
    <AnimatedSection id="pricing" className="py-24 sm:py-32 bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            Un plan pour chaque{' '}
            <span className="text-emerald-500 font-serif italic" style={{ letterSpacing: '-0.04em' }}>
              ambition
            </span>
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Commencez gratuitement et évoluez quand vous êtes prêt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card
                className={`relative h-full transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'border-2 border-emerald-300 shadow-lg shadow-emerald-100/50'
                    : 'border border-zinc-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white border-0 px-3 py-0.5 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${
                      plan.highlighted ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-zinc-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-zinc-900">{plan.price}</span>
                    <span className="text-zinc-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            plan.highlighted ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-zinc-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full h-11 font-medium ${
                      plan.highlighted
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                    onClick={() => setCurrentPage('register')}
                  >
                    {plan.cta}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// ─── CTA Section ──────────────────────────────────────────────

function CTASection() {
  const { setCurrentPage } = useAppStore()

  return (
    <AnimatedSection className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={scaleIn}
          className="relative overflow-hidden rounded-2xl bg-zinc-900 p-10 sm:p-16 text-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-4">
                Prêt à transformer votre{' '}
                <span className="text-emerald-400 font-serif italic" style={{ letterSpacing: '-0.04em' }}>
                  apprentissage
                </span>
                ?
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
                Rejoignez plus de 2 500 étudiants qui ont déjà boosté leurs résultats avec ScolarAI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl h-12 px-8 text-base font-semibold group"
                  onClick={() => setCurrentPage('register')}
                >
                  Commencer gratuitement
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Sans carte bancaire &bull; 5 quiz gratuits
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

// ─── Footer ───────────────────────────────────────────────────

function Footer() {
  const { setCurrentPage } = useAppStore()

  const footerLinks = [
    {
      title: 'Produit',
      links: [
        { label: 'Fonctionnalités', href: '#features' },
        { label: 'Tarifs', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Commencer', onClick: () => setCurrentPage('register') },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Carrières', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'Confidentialité', href: '#' },
        { label: 'CGU', href: '#' },
        { label: 'Cookies', href: '#' },
      ],
    },
  ]

  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-zinc-900">ScolarAI</span>
            </div>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
              La plateforme IA qui transforme vos cours en outils de révision personnalisés.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-zinc-900 mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} ScolarAI. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1 text-sm text-zinc-400">
            Fait avec <span className="text-emerald-500">♥</span> en France
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Landing Page ────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      <Navbar />
      <HeroSection />
      <ProductShowcase />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
