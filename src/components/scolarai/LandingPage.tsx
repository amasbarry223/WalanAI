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
import { useEffect, useRef, useState } from 'react'
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
  Globe,
  Mail,
  FileText,
  Layers,
  ClipboardList,
  Palette,
  PenTool,
  Lightbulb,
  ListChecks,
  BrainCircuit,
  NotebookPen,
  BookMarked,
  ScanSearch,
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
    <section ref={heroRef} className="px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-20 bg-white">
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
          <p className="gsap-hero mx-auto mb-10 max-w-2xl text-lg md:text-xl leading-relaxed text-zinc-600">
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
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showcaseRef.current) return
    gsap.fromTo(
      showcaseRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.3 }
    )
  }, [])

  useEffect(() => {
    if (!row1Ref.current) return
    const el = row1Ref.current
    const totalWidth = el.scrollWidth / 2
    gsap.to(el, {
      x: -totalWidth,
      duration: 50,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  useEffect(() => {
    if (!row2Ref.current) return
    const el = row2Ref.current
    const totalWidth = el.scrollWidth / 2
    gsap.to(el, {
      x: -totalWidth,
      duration: 60,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  const showcaseRow1 = [
    { src: '/images/showcase/dashboard-1.png', alt: 'Dashboard ScolarAI' },
    { src: '/images/showcase/quiz-1.png', alt: 'Quiz Generator' },
    { src: '/images/showcase/flashcards-1.png', alt: 'Flashcards' },
    { src: '/images/showcase/coach-1.png', alt: 'Coach IA' },
    { src: '/images/showcase/progress-1.png', alt: 'Progrès' },
    { src: '/images/showcase/groups-1.png', alt: 'Groupes' },
    { src: '/images/showcase/pomodoro-1.png', alt: 'Pomodoro' },
    { src: '/images/showcase/documents-1.png', alt: 'Documents' },
    { src: '/images/showcase/dashboard-1.png', alt: 'Dashboard ScolarAI' },
    { src: '/images/showcase/quiz-1.png', alt: 'Quiz Generator' },
    { src: '/images/showcase/flashcards-1.png', alt: 'Flashcards' },
    { src: '/images/showcase/coach-1.png', alt: 'Coach IA' },
    { src: '/images/showcase/progress-1.png', alt: 'Progrès' },
    { src: '/images/showcase/groups-1.png', alt: 'Groupes' },
    { src: '/images/showcase/pomodoro-1.png', alt: 'Pomodoro' },
    { src: '/images/showcase/documents-1.png', alt: 'Documents' },
    { src: '/images/showcase/dashboard-1.png', alt: 'Dashboard ScolarAI' },
    { src: '/images/showcase/quiz-1.png', alt: 'Quiz Generator' },
    { src: '/images/showcase/flashcards-1.png', alt: 'Flashcards' },
    { src: '/images/showcase/coach-1.png', alt: 'Coach IA' },
  ]

  const showcaseRow2 = [
    { src: '/images/showcase/progress-1.png', alt: 'Progrès' },
    { src: '/images/showcase/groups-1.png', alt: 'Groupes' },
    { src: '/images/showcase/pomodoro-1.png', alt: 'Pomodoro' },
    { src: '/images/showcase/documents-1.png', alt: 'Documents' },
    { src: '/images/showcase/dashboard-1.png', alt: 'Dashboard ScolarAI' },
    { src: '/images/showcase/quiz-1.png', alt: 'Quiz Generator' },
    { src: '/images/showcase/flashcards-1.png', alt: 'Flashcards' },
    { src: '/images/showcase/coach-1.png', alt: 'Coach IA' },
    { src: '/images/showcase/progress-1.png', alt: 'Progrès' },
    { src: '/images/showcase/groups-1.png', alt: 'Groupes' },
    { src: '/images/showcase/pomodoro-1.png', alt: 'Pomodoro' },
    { src: '/images/showcase/documents-1.png', alt: 'Documents' },
    { src: '/images/showcase/dashboard-1.png', alt: 'Dashboard ScolarAI' },
    { src: '/images/showcase/quiz-1.png', alt: 'Quiz Generator' },
    { src: '/images/showcase/flashcards-1.png', alt: 'Flashcards' },
    { src: '/images/showcase/coach-1.png', alt: 'Coach IA' },
    { src: '/images/showcase/progress-1.png', alt: 'Progrès' },
    { src: '/images/showcase/groups-1.png', alt: 'Groupes' },
    { src: '/images/showcase/pomodoro-1.png', alt: 'Pomodoro' },
    { src: '/images/showcase/documents-1.png', alt: 'Documents' },
  ]

  return (
    <section className="relative overflow-x-clip py-12">
      {/* Browser Mockup */}
      <div
        ref={showcaseRef}
        className="mx-auto mb-6 max-w-5xl px-4 lg:absolute lg:inset-0 lg:z-10 lg:mb-0 lg:flex lg:max-w-none lg:items-center lg:justify-center lg:px-6"
      >
        <div className="w-full lg:max-w-3xl xl:max-w-4xl">
          <div className="group/video overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-2 shadow-[0_20px_70px_-15px_rgba(16,185,129,0.3),0_10px_40px_-10px_rgba(0,0,0,0.2)]">
            {/* Browser Bar */}
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 transition-colors group-hover/video:bg-red-500" />
                <div className="hidden h-2.5 w-2.5 rounded-full bg-zinc-200 transition-colors group-hover/video:bg-yellow-500 lg:block" />
                <div className="hidden h-2.5 w-2.5 rounded-full bg-zinc-200 transition-colors group-hover/video:bg-green-500 lg:block" />
              </div>
              <div className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                app.scolarai.fr
              </div>
              <div className="w-10" />
            </div>

            {/* Dashboard Image */}
            <div className="relative">
              <img
                src="/images/showcase/dashboard-1.png"
                alt="ScolarAI Dashboard"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Showcase Rows */}
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="flex gap-6" ref={row1Ref}>
          <div className="flex gap-6">
            {showcaseRow1.map((item, i) => (
              <div key={`r1-${i}`} className="aspect-video w-56 shrink-0 overflow-hidden rounded-xl shadow-lg md:w-80">
                <img
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={item.src}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-6">
            {showcaseRow1.map((item, i) => (
              <div key={`r1d-${i}`} className="aspect-video w-56 shrink-0 overflow-hidden rounded-xl shadow-lg md:w-80">
                <img
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={item.src}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-6" ref={row2Ref}>
          <div className="flex gap-6">
            {showcaseRow2.map((item, i) => (
              <div key={`r2-${i}`} className="aspect-video w-56 shrink-0 overflow-hidden rounded-xl shadow-lg md:w-80">
                <img
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={item.src}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-6">
            {showcaseRow2.map((item, i) => (
              <div key={`r2d-${i}`} className="aspect-video w-56 shrink-0 overflow-hidden rounded-xl shadow-lg md:w-80">
                <img
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={item.src}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Features Section (youthumb.ai style - Inspiration → Result) ──

const featureCards = [
  {
    inspirationLabel: 'Cours PDF',
    inspirationIcon: <FileText className="h-8 w-8 text-zinc-400" />,
    inspirationBg: 'from-zinc-100 to-zinc-50',
    inspirationContent: (
      <div className="space-y-2 p-3">
        <div className="h-2 w-3/4 rounded bg-zinc-300" />
        <div className="h-2 w-full rounded bg-zinc-200" />
        <div className="h-2 w-5/6 rounded bg-zinc-200" />
        <div className="h-2 w-2/3 rounded bg-zinc-200" />
        <div className="mt-3 h-2 w-full rounded bg-zinc-300" />
        <div className="h-2 w-4/5 rounded bg-zinc-200" />
        <div className="h-2 w-3/4 rounded bg-zinc-200" />
      </div>
    ),
    resultLabel: 'Quiz Généré',
    resultIcon: <ClipboardList className="h-8 w-8 text-emerald-500" />,
    resultBg: 'from-emerald-50 to-teal-50',
    resultContent: (
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-emerald-400" />
          <div className="h-2 w-3/4 rounded bg-emerald-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-emerald-400 bg-emerald-400" />
          <div className="h-2 w-2/3 rounded bg-emerald-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-emerald-400" />
          <div className="h-2 w-4/5 rounded bg-emerald-200" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-teal-400" />
          <div className="h-2 w-1/2 rounded bg-teal-200" />
        </div>
      </div>
    ),
  },
  {
    inspirationLabel: 'Notes de cours',
    inspirationIcon: <BookOpen className="h-8 w-8 text-zinc-400" />,
    inspirationBg: 'from-zinc-100 to-zinc-50',
    inspirationContent: (
      <div className="space-y-2 p-3">
        <div className="h-2 w-2/3 rounded bg-zinc-300" />
        <div className="h-2 w-full rounded bg-zinc-200" />
        <div className="h-2 w-5/6 rounded bg-zinc-200" />
        <div className="mt-3 h-2 w-1/2 rounded bg-zinc-300" />
        <div className="h-2 w-3/4 rounded bg-zinc-200" />
        <div className="h-2 w-full rounded bg-zinc-200" />
      </div>
    ),
    resultLabel: 'Flashcards Créées',
    resultIcon: <Layers className="h-8 w-8 text-emerald-500" />,
    resultBg: 'from-emerald-50 to-teal-50',
    resultContent: (
      <div className="space-y-2 p-3">
        <div className="rounded-lg bg-white border border-emerald-200 p-2">
          <div className="h-2 w-3/4 rounded bg-emerald-200" />
          <div className="mt-1 h-2 w-1/2 rounded bg-emerald-100" />
        </div>
        <div className="rounded-lg bg-white border border-emerald-200 p-2">
          <div className="h-2 w-2/3 rounded bg-emerald-200" />
          <div className="mt-1 h-2 w-3/5 rounded bg-emerald-100" />
        </div>
        <div className="rounded-lg bg-white border border-teal-200 p-2">
          <div className="h-2 w-4/5 rounded bg-teal-200" />
          <div className="mt-1 h-2 w-1/3 rounded bg-teal-100" />
        </div>
      </div>
    ),
  },
  {
    inspirationLabel: 'Sujet d\'examen',
    inspirationIcon: <GraduationCap className="h-8 w-8 text-zinc-400" />,
    inspirationBg: 'from-zinc-100 to-zinc-50',
    inspirationContent: (
      <div className="space-y-2 p-3">
        <div className="h-2 w-1/2 rounded bg-zinc-300" />
        <div className="h-2 w-full rounded bg-zinc-200" />
        <div className="h-2 w-3/4 rounded bg-zinc-200" />
        <div className="mt-3 h-2 w-2/3 rounded bg-zinc-300" />
        <div className="h-2 w-5/6 rounded bg-zinc-200" />
      </div>
    ),
    resultLabel: 'Plan de Révision',
    resultIcon: <Target className="h-8 w-8 text-emerald-500" />,
    resultBg: 'from-emerald-50 to-teal-50',
    resultContent: (
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-emerald-400 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
          <div className="h-2 w-2/3 rounded bg-emerald-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-emerald-400 flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
          </div>
          <div className="h-2 w-1/2 rounded bg-emerald-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded border-2 border-emerald-300" />
          <div className="h-2 w-3/4 rounded bg-teal-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded border-2 border-teal-300" />
          <div className="h-2 w-2/3 rounded bg-teal-200" />
        </div>
      </div>
    ),
  },
]

function FeatureCard({ card }: { card: typeof featureCards[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        {/* Result image - positioned below, slides up on hover */}
        <div
          className="absolute inset-0 z-0 transition-transform duration-500 ease-out"
          style={{ transform: hovered ? 'translateY(0)' : 'translateY(calc(100% + 40px))' }}
        >
          <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-emerald-400 shadow-xl bg-gradient-to-br">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.resultBg}`} />
            <div className="relative z-10 flex h-full flex-col items-center justify-center">
              {card.resultIcon}
              <span className="mt-2 text-xs font-semibold text-emerald-600">{card.resultLabel}</span>
              <div className="w-full mt-1">{card.resultContent}</div>
            </div>
            {/* "Générée" badge */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-xs font-medium text-white md:right-3 md:bottom-3 md:px-3">
              <Check className="h-3 w-3" />
              Généré
            </div>
          </div>
        </div>

        {/* Inspiration image - always on top */}
        <div className="relative z-10 aspect-video overflow-hidden rounded-xl border-2 border-zinc-300 shadow-md bg-gradient-to-br">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.inspirationBg}`} />
          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            {card.inspirationIcon}
            <span className="mt-2 text-xs font-semibold text-zinc-500">{card.inspirationLabel}</span>
            <div className="w-full mt-1">{card.inspirationContent}</div>
          </div>
          {/* Style label */}
          <div className="absolute top-2 left-2 rounded-full bg-zinc-900/80 px-2 py-1 text-xs font-medium text-white md:top-3 md:left-3 md:px-3">
            {card.inspirationLabel}
          </div>
        </div>
      </div>

      {/* Arrow button between images */}
      <div className="flex justify-center py-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
          <ArrowRight className="h-3 w-3 rotate-90" />
        </div>
      </div>

      {/* Space for the result image */}
      <div className="relative aspect-video" />
    </div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1.5 text-xs font-semibold tracking-widest text-white uppercase shadow-lg">
            <Zap className="h-3.5 w-3.5" />
            Instantané
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
            Des quiz performants en quelques secondes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-xl text-zinc-500">
            Importez vos cours comme vous le feriez avec un document. Notre IA analyse le contenu et génère des outils de révision personnalisés.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featureCards.map((card, i) => (
            <FeatureCard key={i} card={card} />
          ))}
        </div>

        <p className="mt-10 text-center text-lg text-zinc-600">
          Vos cours. Votre quiz.{' '}
          <span className="font-semibold text-zinc-900">30 secondes.</span>
        </p>
      </div>
    </section>
  )
}

// ─── Parallel Generation Section (youthumb.ai style) ──────────

function ParallelGenerationSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [progressWidths, setProgressWidths] = useState({
    other1: 0,
    scolarai: [0, 0, 0, 0],
  })

  // Animate progress bars when section comes into view
  useEffect(() => {
    if (!isInView) return

    // "Others" - slow sequential animation
    const otherTimer1 = setTimeout(() => setProgressWidths(prev => ({ ...prev, other1: 19 })), 500)

    // ScolarAI - fast parallel animation, all at once
    const scolaraiTimer = setTimeout(() => {
      setProgressWidths(prev => ({ ...prev, scolarai: [100, 100, 100, 100] }))
    }, 800)

    return () => {
      clearTimeout(otherTimer1)
      clearTimeout(scolaraiTimer)
    }
  }, [isInView])

  const otherItems = [
    { label: 'Quiz', progress: progressWidths.other1, active: true },
    { label: 'Flashcards', progress: 0, active: false },
    { label: 'Plan de révision', progress: 0, active: false },
    { label: 'Fiches de synthèse', progress: 0, active: false },
  ]

  const scolaraiItems = [
    { label: 'Quiz', icon: <ClipboardList className="h-3.5 w-3.5 text-white" /> },
    { label: 'Flashcards', icon: <Layers className="h-3.5 w-3.5 text-white" /> },
    { label: 'Plan de révision', icon: <Target className="h-3.5 w-3.5 text-white" /> },
    { label: 'Fiches de synthèse', icon: <FileText className="h-3.5 w-3.5 text-white" /> },
  ]

  return (
    <section className="px-4 sm:px-6 py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 sm:mb-16 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-3 py-1.5 text-xs font-semibold tracking-widest text-white uppercase shadow-lg">
            <Zap className="h-3.5 w-3.5" />
            Génération parallèle
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            N&apos;attendez plus.{' '}
            <span className="text-emerald-500">Générez en parallèle.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-xl text-zinc-500">
            Les autres outils génèrent les contenus un par un. ScolarAI les lance tous simultanément — 4 ressources en le temps qu&apos;il faut aux autres pour en faire une.
          </p>
        </div>

        <div ref={sectionRef} className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-6">
          {/* Left Card - "Les autres" */}
          <div className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:p-8 lg:flex-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-zinc-400">Les autres</h3>
              <p className="mt-1 text-sm text-zinc-400">Un à la fois</p>
            </div>
            <div className="space-y-4">
              {otherItems.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 ${!item.active ? 'opacity-35' : ''}`}>
                  <div className="h-[42px] w-[74px] shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                    <div
                      className="h-full bg-zinc-300 transition-[width] duration-1000 ease-out"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-zinc-400 transition-[width] duration-1000 ease-out"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="mt-1 block text-xs font-medium text-zinc-400">
                      {item.active ? `${item.progress}%` : 'En attente...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">~40s par ressource = ~160s au total</span>
            </div>
          </div>

          {/* VS Badge */}
          <div className="z-10 flex items-center justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-sm font-black text-white shadow-xl">
              VS
            </div>
          </div>

          {/* Right Card - "ScolarAI" */}
          <div className="w-full rounded-2xl border border-emerald-300 bg-emerald-50/30 p-6 transition-all duration-500 shadow-lg shadow-emerald-100 md:p-8 lg:flex-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-emerald-500">ScolarAI</h3>
              <p className="mt-1 text-sm text-zinc-400">Tout en même temps</p>
            </div>
            <div className="space-y-4">
              {scolaraiItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative h-[42px] w-[74px] shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-50">
                      {item.icon}
                    </div>
                    <div className="absolute right-0.5 bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-1000 ease-out"
                        style={{ width: `${progressWidths.scolarai[i]}%` }}
                      />
                    </div>
                    <span className="mt-1 block text-xs font-medium text-emerald-600">
                      {progressWidths.scolarai[i] === 100 ? 'Terminé !' : 'Génération...'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">~30s au total pour les 4</span>
            </div>
          </div>
        </div>

        {/* "5x plus rapide" Badge */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 sm:px-6 sm:py-3 font-bold text-white shadow-lg shadow-emerald-500/25 text-sm sm:text-base">
            <Zap className="h-5 w-5" />
            5x plus rapide
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── All Styles Section (youthumb.ai style marquee) ──────────

const styleCardsRow1 = [
  { label: 'Quiz QCM', icon: <ClipboardList className="h-5 w-5" />, gradient: 'from-violet-500 to-purple-600', accent: 'bg-violet-400', light: 'bg-violet-300/40' },
  { label: 'Flashcards', icon: <Layers className="h-5 w-5" />, gradient: 'from-amber-400 to-orange-500', accent: 'bg-amber-300', light: 'bg-amber-200/40' },
  { label: 'Vrai / Faux', icon: <Check className="h-5 w-5" />, gradient: 'from-rose-400 to-pink-500', accent: 'bg-rose-300', light: 'bg-rose-200/40' },
  { label: 'Résumés', icon: <FileText className="h-5 w-5" />, gradient: 'from-sky-400 to-blue-500', accent: 'bg-sky-300', light: 'bg-sky-200/40' },
  { label: 'Plans de révision', icon: <Target className="h-5 w-5" />, gradient: 'from-emerald-400 to-teal-500', accent: 'bg-emerald-300', light: 'bg-emerald-200/40' },
  { label: 'Questions ouvertes', icon: <PenTool className="h-5 w-5" />, gradient: 'from-indigo-400 to-violet-500', accent: 'bg-indigo-300', light: 'bg-indigo-200/40' },
  { label: 'Cartes mentales', icon: <BrainCircuit className="h-5 w-5" />, gradient: 'from-fuchsia-400 to-purple-500', accent: 'bg-fuchsia-300', light: 'bg-fuchsia-200/40' },
  { label: 'Fiches de synthèse', icon: <NotebookPen className="h-5 w-5" />, gradient: 'from-teal-400 to-cyan-500', accent: 'bg-teal-300', light: 'bg-teal-200/40' },
  { label: 'Quiz QCM', icon: <ClipboardList className="h-5 w-5" />, gradient: 'from-violet-500 to-purple-600', accent: 'bg-violet-400', light: 'bg-violet-300/40' },
  { label: 'Flashcards', icon: <Layers className="h-5 w-5" />, gradient: 'from-amber-400 to-orange-500', accent: 'bg-amber-300', light: 'bg-amber-200/40' },
  { label: 'Vrai / Faux', icon: <Check className="h-5 w-5" />, gradient: 'from-rose-400 to-pink-500', accent: 'bg-rose-300', light: 'bg-rose-200/40' },
  { label: 'Résumés', icon: <FileText className="h-5 w-5" />, gradient: 'from-sky-400 to-blue-500', accent: 'bg-sky-300', light: 'bg-sky-200/40' },
]

const styleCardsRow2 = [
  { label: 'QRC', icon: <Lightbulb className="h-5 w-5" />, gradient: 'from-orange-400 to-red-500', accent: 'bg-orange-300', light: 'bg-orange-200/40' },
  { label: 'Exercices', icon: <ListChecks className="h-5 w-5" />, gradient: 'from-red-400 to-rose-500', accent: 'bg-red-300', light: 'bg-red-200/40' },
  { label: 'Mind Map', icon: <BrainCircuit className="h-5 w-5" />, gradient: 'from-purple-400 to-fuchsia-500', accent: 'bg-purple-300', light: 'bg-purple-200/40' },
  { label: 'Notes structurées', icon: <BookMarked className="h-5 w-5" />, gradient: 'from-blue-400 to-indigo-500', accent: 'bg-blue-300', light: 'bg-blue-200/40' },
  { label: 'Analyse de texte', icon: <ScanSearch className="h-5 w-5" />, gradient: 'from-zinc-500 to-zinc-700', accent: 'bg-zinc-400', light: 'bg-zinc-300/40' },
  { label: 'Quiz chronométré', icon: <Clock className="h-5 w-5" />, gradient: 'from-yellow-400 to-amber-500', accent: 'bg-yellow-300', light: 'bg-yellow-200/40' },
  { label: 'Formulaires', icon: <NotebookPen className="h-5 w-5" />, gradient: 'from-cyan-400 to-sky-500', accent: 'bg-cyan-300', light: 'bg-cyan-200/40' },
  { label: 'Bilan de connaissances', icon: <BarChart3 className="h-5 w-5" />, gradient: 'from-emerald-500 to-green-600', accent: 'bg-emerald-400', light: 'bg-emerald-300/40' },
  { label: 'QRC', icon: <Lightbulb className="h-5 w-5" />, gradient: 'from-orange-400 to-red-500', accent: 'bg-orange-300', light: 'bg-orange-200/40' },
  { label: 'Exercices', icon: <ListChecks className="h-5 w-5" />, gradient: 'from-red-400 to-rose-500', accent: 'bg-red-300', light: 'bg-red-200/40' },
  { label: 'Mind Map', icon: <BrainCircuit className="h-5 w-5" />, gradient: 'from-purple-400 to-fuchsia-500', accent: 'bg-purple-300', light: 'bg-purple-200/40' },
  { label: 'Notes structurées', icon: <BookMarked className="h-5 w-5" />, gradient: 'from-blue-400 to-indigo-500', accent: 'bg-blue-300', light: 'bg-blue-200/40' },
]

function StyleCard({ card }: { card: typeof styleCardsRow1[0] }) {
  return (
    <div className="aspect-video w-56 shrink-0 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.03] md:w-72">
      <div className={`relative h-full w-full bg-gradient-to-br ${card.gradient} flex flex-col p-4`}>
        {/* Top row: icon + label */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm text-white shrink-0">
            {card.icon}
          </div>
          <span className="text-sm font-bold text-white drop-shadow-sm leading-tight">{card.label}</span>
        </div>

        {/* Content preview area */}
        <div className="mt-auto space-y-1.5">
          {/* Simulated content lines */}
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${card.accent} shrink-0`} />
            <div className="h-1.5 w-3/4 rounded-full bg-white/30" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${card.accent} shrink-0`} />
            <div className="h-1.5 w-full rounded-full bg-white/25" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${card.light} shrink-0`} />
            <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

function AllStylesSection() {
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!row1Ref.current) return
    const el = row1Ref.current
    const totalWidth = el.scrollWidth / 2
    gsap.to(el, {
      x: -totalWidth,
      duration: 45,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  useEffect(() => {
    if (!row2Ref.current) return
    const el = row2Ref.current
    const totalWidth = el.scrollWidth / 2
    gsap.to(el, {
      x: -totalWidth,
      duration: 55,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  return (
    <section className="overflow-hidden py-12 bg-zinc-50/50">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500 px-3 py-1.5 text-xs font-semibold tracking-widest text-white uppercase shadow-lg">
          <Palette className="h-3.5 w-3.5" />
          Tous les Styles
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Choisis et génère{' '}
          <span className="bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            n&apos;importe quel style
          </span>{' '}
          de contenu éducatif
        </h2>
      </div>

      <div className="space-y-6">
        {/* Row 1 */}
        <div className="flex gap-6" ref={row1Ref}>
          <div className="flex gap-6">
            {styleCardsRow1.map((card, i) => (
              <StyleCard key={`s1-${i}`} card={card} />
            ))}
          </div>
          <div className="flex gap-6">
            {styleCardsRow1.map((card, i) => (
              <StyleCard key={`s1d-${i}`} card={card} />
            ))}
          </div>
          <div className="flex gap-6">
            {styleCardsRow1.map((card, i) => (
              <StyleCard key={`s1dd-${i}`} card={card} />
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-6" ref={row2Ref}>
          <div className="flex gap-6">
            {styleCardsRow2.map((card, i) => (
              <StyleCard key={`s2-${i}`} card={card} />
            ))}
          </div>
          <div className="flex gap-6">
            {styleCardsRow2.map((card, i) => (
              <StyleCard key={`s2d-${i}`} card={card} />
            ))}
          </div>
          <div className="flex gap-6">
            {styleCardsRow2.map((card, i) => (
              <StyleCard key={`s2dd-${i}`} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
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
      <ParallelGenerationSection />
      <AllStylesSection />
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
