'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
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
  Shield,
  Rocket,
  Check,
  Play,
  Menu,
  X,
  Flame,
  Crown,
} from 'lucide-react'

// ─── Animation Configs ───────────────────────────────────────

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Floating Particles (GSAP) ───────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }[] = []
    const colors = ['#10B981', '#14B8A6', '#34D399', '#6EE7B7', '#A7F3D0']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      }

      // Draw connections
      ctx.globalAlpha = 0.06
      ctx.strokeStyle = '#10B981'
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.globalAlpha = 0.06 * (1 - dist / 120)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(draw)
    }

    draw()

    // GSAP floating animation on particles
    particles.forEach((p, i) => {
      gsap.to(p, {
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.05,
      })
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

// ─── Section Wrapper with Intersection Observer ──────────────

function AnimatedSection({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

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
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 })
    }
  }, [])

  const navLinks = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Comment ça marche', href: '#how-it-works' },
    { label: 'Témoignages', href: '#testimonials' },
    { label: 'Tarifs', href: '#pricing' },
  ]

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/40 border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              ScolarAI
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-emerald-600 font-medium"
              onClick={() => setCurrentPage('login')}
            >
              Se connecter
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200/50 px-6"
              onClick={() => setCurrentPage('register')}
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden pb-4 border-t border-gray-100 mt-2 pt-4 bg-white/90 backdrop-blur-xl rounded-b-2xl"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                <Button variant="outline" onClick={() => { setCurrentPage('login'); setMobileOpen(false) }}>
                  Se connecter
                </Button>
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  onClick={() => { setCurrentPage('register'); setMobileOpen(false) }}
                >
                  Commencer gratuitement
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────

function HeroSection() {
  const { setCurrentPage } = useAppStore()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    if (!heroRef.current) return
    const els = heroRef.current.querySelectorAll('.gsap-hero')
    gsap.fromTo(
      els,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-emerald-100/30 to-transparent rounded-full blur-3xl" />

      <ParticleField />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        {/* Badge */}
        <motion.div
          className="gsap-hero inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-700">Propulsé par l&apos;Intelligence Artificielle</span>
        </motion.div>

        {/* Main Title */}
        <h1 className="gsap-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
          Révolutionnez votre{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
            apprentissage
          </span>{' '}
          avec l&apos;IA
        </h1>

        {/* Subtitle */}
        <p className="gsap-hero text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          ScolarAI adapte votre parcours éducatif en temps réel. Quiz personnalisés, révisions espacées, suivi intelligent — tout ce dont vous avez besoin pour exceller.
        </p>

        {/* CTA Buttons */}
        <div className="gsap-hero flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl shadow-emerald-200/50 px-8 h-14 text-base font-semibold group"
            onClick={() => setCurrentPage('register')}
          >
            Démarrer gratuitement
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 h-14 px-8 text-base font-semibold group"
          >
            <Play className="h-5 w-5 mr-2 text-emerald-500 group-hover:scale-110 transition-transform" />
            Voir la démo
          </Button>
        </div>

        {/* Social Proof */}
        <div className="gsap-hero flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {['bg-emerald-400', 'bg-teal-400', 'bg-amber-400', 'bg-rose-400', 'bg-violet-400'].map((bg, i) => (
              <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}>
                {['LP', 'EB', 'MR', 'CR', 'AT'][i]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 font-semibold text-gray-700">4.9/5</span>
            <span className="text-gray-400">·</span>
            <span>2 500+ étudiants</span>
          </div>
        </div>

        {/* Hero Visual - Dashboard Preview */}
        <motion.div
          className="gsap-hero mt-16 relative"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-2xl blur-2xl opacity-40" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-200/60 overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-white rounded-lg px-3 py-1.5 text-xs text-gray-400 border border-gray-200 max-w-xs mx-auto text-center">
                    app.scolarai.fr/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard content preview */}
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Score', value: '8 050', icon: '🟢', bg: 'bg-emerald-50' },
                      { label: 'Série', value: '15j', icon: '🔥', bg: 'bg-orange-50' },
                      { label: 'Quiz', value: '47', icon: '📊', bg: 'bg-violet-50' },
                    ].map((card) => (
                      <div key={card.label} className={`${card.bg} rounded-xl p-4 text-center`}>
                        <div className="text-lg mb-1">{card.icon}</div>
                        <div className="text-lg font-bold text-gray-900">{card.value}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{card.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 flex items-end justify-around p-4">
                    {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-8 bg-gradient-to-t from-emerald-400 to-teal-300 rounded-t-md"
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 1.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                        {['LD', 'MB', 'CM', 'LP'][i - 1]}
                      </div>
                      <div className="flex-1">
                        <div className="h-2.5 bg-gray-200 rounded-full w-16" />
                        <div className="h-2 bg-gray-100 rounded-full w-10 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-emerald-300 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-emerald-400" />
        </div>
      </motion.div>
    </section>
  )
}

// ─── Features Section ─────────────────────────────────────────

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'IA Adaptative',
    description: "Notre algorithme s'adapte à votre niveau et votre rythme d'apprentissage pour vous proposer du contenu sur mesure.",
    color: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-200/50',
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Quiz Personnalisés',
    description: 'Générez des quiz en un clic sur n\'importe quel sujet, avec des difficultés progressives qui évoluent avec vous.',
    color: 'from-violet-400 to-purple-500',
    shadow: 'shadow-violet-200/50',
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Révision Espacée',
    description: 'Notre système de répétition espacée optimise votre mémorisation à long terme en vous rappelant au bon moment.',
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-200/50',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Suivi en Temps Réel',
    description: "Visualisez vos progrès avec des tableaux de bord détaillés et des statistiques sur votre évolution.",
    color: 'from-rose-400 to-pink-500',
    shadow: 'shadow-rose-200/50',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Groupes d\'Étude',
    description: 'Collaborez avec vos pairs, partagez des ressources et progressez ensemble dans des groupes thématiques.',
    color: 'from-blue-400 to-indigo-500',
    shadow: 'shadow-blue-200/50',
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: 'Coach IA',
    description: 'Un assistant intelligent disponible 24/7 pour répondre à vos questions et vous guider dans vos révisions.',
    color: 'from-teal-400 to-cyan-500',
    shadow: 'shadow-teal-200/50',
  },
]

function FeaturesSection() {
  return (
    <AnimatedSection id="features" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4 px-4 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Fonctionnalités
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Tout pour{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">réussir</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des outils puissants conçus par des pédagogues et des ingénieurs IA pour maximiser votre potentiel académique.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className="group h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 lg:p-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg ${feature.shadow} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
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
    icon: <BookOpen className="h-7 w-7" />,
    title: 'Importez vos cours',
    description: 'Téléchargez vos PDF, notes ou liens. Notre IA analyse et structure automatiquement le contenu.',
    color: 'bg-emerald-500',
  },
  {
    step: '02',
    icon: <Brain className="h-7 w-7" />,
    title: "L'IA génère votre plan",
    description: "Des quiz, flashcards et sessions de révision sont créés sur mesure en fonction de votre profil d'apprentissage.",
    color: 'bg-teal-500',
  },
  {
    step: '03',
    icon: <Trophy className="h-7 w-7" />,
    title: 'Progressez et excellez',
    description: 'Suivez vos progrès en temps réel, ajustez votre stratégie et atteignez vos objectifs académiques.',
    color: 'bg-amber-500',
  },
]

function HowItWorksSection() {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lineRef.current) return
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 1.5, ease: 'power2.inOut', scrollTrigger: { trigger: lineRef.current, start: 'top 80%' } }
    )
  }, [])

  return (
    <AnimatedSection id="how-it-works" className="py-24 sm:py-32 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200 mb-4 px-4 py-1">
            <Rocket className="h-3.5 w-3.5 mr-1.5" />
            Comment ça marche
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Simple comme{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">1, 2, 3</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            En trois étapes, transformez vos cours en un parcours d&apos;apprentissage optimisé.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div ref={lineRef} className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-teal-300 to-amber-300 -translate-x-1/2 origin-top" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 !== 0 ? 'lg:text-left' : 'lg:text-right'}`}>
                  <span className={`inline-block text-6xl font-black ${step.color} bg-clip-text text-transparent opacity-20 mb-2`}>
                    {step.step}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Center Circle */}
                <div className="relative shrink-0">
                  <motion.div
                    className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center text-white shadow-xl`}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {step.icon}
                  </motion.div>
                  <div className={`absolute inset-0 w-20 h-20 rounded-full ${step.color} opacity-20 animate-ping`} style={{ animationDuration: '3s' }} />
                </div>

                {/* Spacer for alignment */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
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
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!counterRef.current) return
    const counters = counterRef.current.querySelectorAll('.stat-value')
    counters.forEach((el) => {
      gsap.fromTo(el, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' })
    })
  }, [])

  return (
    <AnimatedSection className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptMC00VjI0SDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <div ref={counterRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-emerald-200 mb-4">
                {stat.icon}
              </div>
              <div className="stat-value text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-emerald-100">{stat.label}</div>
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
    color: 'bg-emerald-400',
    rating: 5,
  },
  {
    name: 'Thomas Bernard',
    role: 'Étudiant en Médecine',
    text: "Le système de révision espacée est incroyable. Je retiens 3x plus qu'avant en étudiant moins longtemps. Un vrai game-changer.",
    avatar: 'TB',
    color: 'bg-teal-400',
    rating: 5,
  },
  {
    name: 'Léa Martin',
    role: 'Étudiante en Économie',
    text: "Le coach IA est disponible 24/7 et répond à toutes mes questions. C'est comme avoir un tuteur personnel à domicile !",
    avatar: 'LM',
    color: 'bg-amber-400',
    rating: 5,
  },
]

function TestimonialsSection() {
  return (
    <AnimatedSection id="testimonials" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 mb-4 px-4 py-1">
            <Star className="h-3.5 w-3.5 mr-1.5" />
            Témoignages
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Ils nous{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">font confiance</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment ScolarAI aide des milliers d&apos;étudiants à atteindre leurs objectifs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white">
                <CardContent className="p-6 lg:p-8">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
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
    features: ['Quiz illimités', 'Révision espacée avancée', 'Coach IA 24/7', 'Groupes d\'étude', 'Flashcards IA', 'Analyses détaillées', 'Support prioritaire'],
    cta: 'Essai gratuit 14 jours',
    highlighted: true,
    icon: <Crown className="h-5 w-5" />,
  },
]

function PricingSection() {
  const { setCurrentPage } = useAppStore()

  return (
    <AnimatedSection id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-emerald-50/30 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-4 px-4 py-1">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
            Tarifs
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Un plan pour chaque{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">ambition</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Commencez gratuitement et évoluez quand vous êtes prêt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div key={i} variants={scaleIn}>
              <Card className={`relative h-full transition-all duration-500 hover:-translate-y-2 ${
                plan.highlighted
                  ? 'border-2 border-emerald-300 shadow-xl shadow-emerald-100/50 bg-gradient-to-br from-white to-emerald-50/30'
                  : 'border border-gray-200 shadow-lg bg-white'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-4 py-1 shadow-lg shadow-emerald-200/50">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 lg:p-8">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    plan.highlighted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.highlighted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-gray-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full h-12 font-semibold ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200/50'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
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
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ctaRef.current) return
    gsap.fromTo(
      ctaRef.current,
      { backgroundPosition: '0% 50%' },
      { backgroundPosition: '100% 50%', duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' }
    )
  }, [])

  return (
    <AnimatedSection className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ctaRef}
          variants={scaleIn}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-10 sm:p-16 text-center"
          style={{ backgroundSize: '200% 200%' }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptMC00VjI0SDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Prêt à transformer votre apprentissage ?
              </h2>
              <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
                Rejoignez plus de 2 500 étudiants qui ont déjà boosté leurs résultats avec ScolarAI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl h-14 px-8 text-base font-bold group"
                  onClick={() => setCurrentPage('register')}
                >
                  Commencer gratuitement
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base font-semibold"
                >
                  En savoir plus
                </Button>
              </div>
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
        { label: 'Comment ça marche', href: '#how-it-works' },
        { label: 'Témoignages', href: '#testimonials' },
      ],
    },
    {
      title: 'Ressources',
      links: [
        { label: 'Blog', href: '#' },
        { label: 'Centre d\'aide', href: '#' },
        { label: 'Tutoriels', href: '#' },
        { label: 'API', href: '#' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '#' },
        { label: 'Carrières', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Presse', href: '#' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'Confidentialité', href: '#' },
        { label: 'CGU', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'Mentions légales', href: '#' },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">ScolarAI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              L&apos;intelligence artificielle au service de votre réussite académique.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-9 px-3"
                onClick={() => setCurrentPage('login')}
              >
                Se connecter
              </Button>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 px-3"
                onClick={() => setCurrentPage('register')}
              >
                S&apos;inscrire
              </Button>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2025 ScolarAI. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Données protégées &amp; conformes RGPD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Component ───────────────────────────────────────────

export default function LandingPage() {
  useEffect(() => {
    // GSAP initial page animation
    gsap.fromTo('body', { opacity: 0 }, { opacity: 1, duration: 0.5 })
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
