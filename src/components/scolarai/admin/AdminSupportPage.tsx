'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Headphones,
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  ArrowUpRight,
  XCircle,
  Clock,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Priority = 'urgente' | 'haute' | 'normale' | 'basse'
type Status = 'ouvert' | 'en-cours' | 'resolu' | 'ferme'
type Category = 'technique' | 'facturation' | 'fonctionnalite' | 'autre'

interface SupportTicket {
  id: string
  user: { name: string; initials: string }
  subject: string
  priority: Priority
  status: Status
  category: Category
  assignedTo: string
  date: string
  message: string
  history: { date: string; action: string; by: string }[]
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockTickets: SupportTicket[] = [
  {
    id: 'TK-001',
    user: { name: 'Lucas Martin', initials: 'LM' },
    subject: 'Impossible de générer des flashcards',
    priority: 'urgente',
    status: 'ouvert',
    category: 'technique',
    assignedTo: 'Support A',
    date: '20 Mai 2026',
    message: "Bonjour, depuis ce matin je n'arrive plus à générer des flashcards à partir de mes documents. Le bouton reste grisé et rien ne se passe quand je clique dessus. J'ai essayé avec plusieurs fichiers PDF différents, le problème persiste. C'est très bloquant pour mes révisions du bac.",
    history: [
      { date: '20 Mai 2026 14:30', action: 'Ticket créé', by: 'Lucas Martin' },
    ],
  },
  {
    id: 'TK-002',
    user: { name: 'Emma Dubois', initials: 'ED' },
    subject: 'Prélèvement non autorisé sur mon compte',
    priority: 'urgente',
    status: 'en-cours',
    category: 'facturation',
    assignedTo: 'Support B',
    date: '19 Mai 2026',
    message: "Je viens de voir un prélèvement de 19,99€ sur mon compte bancaire alors que j'ai résilié mon abonnement Pro le mois dernier. Je n'ai jamais reçu de confirmation de résiliation et je suis toujours facturée. Je demande un remboursement immédiat.",
    history: [
      { date: '19 Mai 2026 09:15', action: 'Ticket créé', by: 'Emma Dubois' },
      { date: '19 Mai 2026 10:30', action: 'Assigné à Support B', by: 'Système' },
      { date: '19 Mai 2026 11:45', action: 'En cours de traitement', by: 'Support B' },
    ],
  },
  {
    id: 'TK-003',
    user: { name: 'Hugo Richard', initials: 'HR' },
    subject: 'Demander une fonctionnalité d\'export Anki',
    priority: 'normale',
    status: 'ouvert',
    category: 'fonctionnalite',
    assignedTo: 'Non assigné',
    date: '19 Mai 2026',
    message: "Serait-il possible d'ajouter une fonctionnalité pour exporter mes flashcards au format Anki ? J'utilise Anki en parallèle et ça serait très pratique de pouvoir transférer mes cartes facilement. Merci d'avance !",
    history: [
      { date: '19 Mai 2026 16:00', action: 'Ticket créé', by: 'Hugo Richard' },
    ],
  },
  {
    id: 'TK-004',
    user: { name: 'Léa Petit', initials: 'LP' },
    subject: 'Page blanche après connexion',
    priority: 'haute',
    status: 'en-cours',
    category: 'technique',
    assignedTo: 'Support A',
    date: '18 Mai 2026',
    message: "Quand je me connecte à mon compte, la page d'accueil s'affiche complètement blanche. J'ai essayé sur Chrome et Firefox, même problème. J'ai vidé le cache mais ça ne change rien. En revanche, ça fonctionne sur l'application mobile.",
    history: [
      { date: '18 Mai 2026 08:20', action: 'Ticket créé', by: 'Léa Petit' },
      { date: '18 Mai 2026 09:00', action: 'Assigné à Support A', by: 'Système' },
      { date: '18 Mai 2026 14:30', action: 'Investigation en cours', by: 'Support A' },
    ],
  },
  {
    id: 'TK-005',
    user: { name: 'Nathan Bernard', initials: 'NB' },
    subject: 'Quiz généré avec des réponses incorrectes',
    priority: 'haute',
    status: 'en-cours',
    category: 'technique',
    assignedTo: 'Support C',
    date: '18 Mai 2026',
    message: "L'IA a généré un quiz sur la Révolution française avec plusieurs réponses incorrectes. Par exemple, elle indique que la prise de la Bastille a eu lieu en 1790 au lieu de 1789. C'est problématique pour les étudiants qui se fient à ces réponses. Il faudrait un système de signalement des erreurs.",
    history: [
      { date: '18 Mai 2026 11:00', action: 'Ticket créé', by: 'Nathan Bernard' },
      { date: '18 Mai 2026 11:30', action: 'Priorité augmentée', by: 'Support C' },
      { date: '18 Mai 2026 15:00', action: 'Transféré à l\'équipe IA', by: 'Support C' },
    ],
  },
  {
    id: 'TK-006',
    user: { name: 'Chloé Moreau', initials: 'CM' },
    subject: 'Code promo non appliqué',
    priority: 'normale',
    status: 'resolu',
    category: 'facturation',
    assignedTo: 'Support B',
    date: '17 Mai 2026',
    message: "J'ai utilisé le code promo BACKTOSCHOOL20 lors de mon inscription Pro mais la réduction de 20% n'a pas été appliquée. J'ai quand même été facturé le tarif plein. Pouvez-vous m'aider ?",
    history: [
      { date: '17 Mai 2026 10:00', action: 'Ticket créé', by: 'Chloé Moreau' },
      { date: '17 Mai 2026 11:00', action: 'Assigné à Support B', by: 'Système' },
      { date: '17 Mai 2026 14:00', action: 'Crédit de 4€ appliqué', by: 'Support B' },
      { date: '17 Mai 2026 16:30', action: 'Résolu', by: 'Support B' },
    ],
  },
  {
    id: 'TK-007',
    user: { name: 'Thomas Blanc', initials: 'TB' },
    subject: 'Suggestion d\'amélioration du mode sombre',
    priority: 'basse',
    status: 'ouvert',
    category: 'fonctionnalite',
    assignedTo: 'Non assigné',
    date: '16 Mai 2026',
    message: "Le mode sombre est bien mais les couleurs des flashcards ne changent pas, ce qui est un peu agressif pour les yeux la nuit. Serait-il possible d'adapter les couleurs des cartes en mode sombre ?",
    history: [
      { date: '16 Mai 2026 20:15', action: 'Ticket créé', by: 'Thomas Blanc' },
    ],
  },
  {
    id: 'TK-008',
    user: { name: 'Julie Roux', initials: 'JR' },
    subject: 'Compte bloqué après trop de tentatives',
    priority: 'normale',
    status: 'resolu',
    category: 'technique',
    assignedTo: 'Support A',
    date: '15 Mai 2026',
    message: "Mon compte a été bloqué après plusieurs tentatives de connexion ratées. J'avais oublié mon mot de passe. J'ai besoin d'aide pour débloquer mon compte et réinitialiser mon mot de passe.",
    history: [
      { date: '15 Mai 2026 07:30', action: 'Ticket créé', by: 'Julie Roux' },
      { date: '15 Mai 2026 08:00', action: 'Assigné à Support A', by: 'Système' },
      { date: '15 Mai 2026 08:30', action: 'Compte débloqué et lien de réinitialisation envoyé', by: 'Support A' },
      { date: '15 Mai 2026 09:15', action: 'Résolu', by: 'Support A' },
    ],
  },
  {
    id: 'TK-009',
    user: { name: 'Sarah Klein', initials: 'SK' },
    subject: 'Question sur les limites du plan Gratuit',
    priority: 'basse',
    status: 'ferme',
    category: 'autre',
    assignedTo: 'Support B',
    date: '14 Mai 2026',
    message: "Bonjour, j'aimerais savoir quelles sont les limites exactes du plan Gratuit. Combien de documents, flashcards et quiz puis-je créer ? Y a-t-il une limite quotidienne ? Merci pour votre aide.",
    history: [
      { date: '14 Mai 2026 13:00', action: 'Ticket créé', by: 'Sarah Klein' },
      { date: '14 Mai 2026 13:30', action: 'Réponse envoyée avec documentation', by: 'Support B' },
      { date: '14 Mai 2026 14:00', action: 'Fermé', by: 'Support B' },
    ],
  },
  {
    id: 'TK-010',
    user: { name: 'Pierre Vidal', initials: 'PV' },
    subject: 'Document PDF corrompu après upload',
    priority: 'haute',
    status: 'ouvert',
    category: 'technique',
    assignedTo: 'Non assigné',
    date: '20 Mai 2026',
    message: "Quand j'upload mon cours de mathématiques en PDF, le texte affiché est illisible : des caractères spéciaux apparaissent à la place des formules mathématiques. Le PDF s'ouvre normalement sur mon ordinateur. J'ai besoin de ce document pour réviser mon partiel de demain.",
    history: [
      { date: '20 Mai 2026 12:00', action: 'Ticket créé', by: 'Pierre Vidal' },
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  urgente: { label: 'Urgente', className: 'bg-red-100 text-red-700 border-0' },
  haute: { label: 'Haute', className: 'bg-amber-100 text-amber-700 border-0' },
  normale: { label: 'Normale', className: 'bg-blue-100 text-blue-700 border-0' },
  basse: { label: 'Basse', className: 'bg-gray-100 text-gray-600 border-0' },
}

const statusConfig: Record<Status, { label: string; className: string; dotColor: string }> = {
  ouvert: { label: 'Ouvert', className: 'bg-blue-100 text-blue-700 border-0', dotColor: 'bg-blue-500' },
  'en-cours': { label: 'En cours', className: 'bg-amber-100 text-amber-700 border-0', dotColor: 'bg-amber-500' },
  resolu: { label: 'Résolu', className: 'bg-emerald-100 text-emerald-700 border-0', dotColor: 'bg-emerald-500' },
  ferme: { label: 'Fermé', className: 'bg-gray-100 text-gray-600 border-0', dotColor: 'bg-gray-400' },
}

const categoryLabels: Record<Category, string> = {
  technique: 'Technique',
  facturation: 'Facturation',
  fonctionnalite: 'Fonctionnalité',
  autre: 'Autre',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminSupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('tous')
  const [priorityFilter, setPriorityFilter] = useState<string>('toutes')
  const [categoryFilter, setCategoryFilter] = useState<string>('toutes')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [newStatus, setNewStatus] = useState<string>('')

  const itemsPerPage = 10

  // Filtering
  const filtered = mockTickets.filter((t) => {
    const matchSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'tous' || t.status === statusFilter
    const matchPriority = priorityFilter === 'toutes' || t.priority === priorityFilter
    const matchCategory = categoryFilter === 'toutes' || t.category === categoryFilter
    return matchSearch && matchStatus && matchPriority && matchCategory
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedTickets = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Stats
  const openCount = mockTickets.filter(t => t.status === 'ouvert').length
  const inProgressCount = mockTickets.filter(t => t.status === 'en-cours').length
  const resolvedToday = mockTickets.filter(t => t.status === 'resolu').length
  const avgResolutionTime = '2.4h'

  const openDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setNewStatus(ticket.status)
    setResponseText('')
    setDetailOpen(true)
  }

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-emerald-500/5 rounded-full translate-y-20" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Headphones className="h-6 w-6 text-emerald-400" />
                  Support
                </h1>
                <p className="text-slate-400 text-sm mt-1">Gérez les demandes de support utilisateur</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{openCount} tickets ouverts</Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tickets ouverts', value: openCount, icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'En cours', value: inProgressCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Résolus aujourd\'hui', value: resolvedToday, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Temps moyen résolution', value: avgResolutionTime, icon: AlertTriangle, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par sujet, utilisateur ou ID..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="ouvert">Ouvert</SelectItem>
                  <SelectItem value="en-cours">En cours</SelectItem>
                  <SelectItem value="resolu">Résolu</SelectItem>
                  <SelectItem value="ferme">Fermé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="basse">Basse</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes</SelectItem>
                  <SelectItem value="technique">Technique</SelectItem>
                  <SelectItem value="facturation">Facturation</SelectItem>
                  <SelectItem value="fonctionnalite">Fonctionnalité</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tickets Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilisateur</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sujet</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Priorité</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Statut</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Catégorie</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Assigné à</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Date</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket) => {
                    const pConfig = priorityConfig[ticket.priority]
                    const sConfig = statusConfig[ticket.status]
                    return (
                      <tr key={ticket.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono font-medium text-gray-700">#{ticket.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-[10px] font-bold text-white bg-gradient-to-br from-emerald-400 to-teal-500">
                                {ticket.user.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-900 truncate max-w-[120px]">{ticket.user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700 truncate block max-w-[200px]">{ticket.subject}</span>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <Badge className={cn('text-[10px]', pConfig.className)}>
                            {pConfig.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span className={cn('w-2 h-2 rounded-full', sConfig.dotColor)} />
                            <Badge className={cn('text-[10px]', sConfig.className)}>
                              {sConfig.label}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-xs text-gray-600">{categoryLabels[ticket.category]}</span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 hidden xl:table-cell">{ticket.assignedTo}</td>
                        <td className="py-3 px-4 text-xs text-gray-500 hidden xl:table-cell">{ticket.date}</td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openDetail(ticket)}>
                                <Eye className="h-4 w-4 mr-2" /> Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDetail(ticket)}>
                                <MessageSquare className="h-4 w-4 mr-2" /> Répondre
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowUpRight className="h-4 w-4 mr-2" /> Escalader
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" /> Fermer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })}
                  {paginatedTickets.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <p className="text-sm text-gray-400">Aucun ticket trouvé</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-gray-500">
                  {filtered.length} ticket(s) trouvé(s)
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="icon"
                      className={cn('h-8 w-8', page === currentPage && 'bg-emerald-500 hover:bg-emerald-600 text-white')}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Ticket Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-500" />
              Ticket #{selectedTicket?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-5">
              {/* Ticket Info */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarFallback className="text-sm font-bold text-white bg-gradient-to-br from-emerald-400 to-teal-500">
                    {selectedTicket.user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">{selectedTicket.subject}</h3>
                  <p className="text-sm text-gray-500">{selectedTicket.user.name} · {selectedTicket.date}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className={cn('text-[10px]', priorityConfig[selectedTicket.priority].className)}>
                      {priorityConfig[selectedTicket.priority].label}
                    </Badge>
                    <Badge className={cn('text-[10px]', statusConfig[selectedTicket.status].className)}>
                      {statusConfig[selectedTicket.status].label}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-600 text-[10px] border-0">
                      {categoryLabels[selectedTicket.category]}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                  {selectedTicket.message}
                </div>
              </div>

              <Separator />

              {/* History */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Historique</h4>
                <div className="space-y-3">
                  {selectedTicket.history.map((entry, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {index < selectedTicket.history.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-sm font-medium text-gray-800">{entry.action}</p>
                        <p className="text-xs text-gray-400">{entry.by} · {entry.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Response & Status Change */}
              <div className="space-y-4">
                <div>
                  <Label>Changer le statut</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ouvert">Ouvert</SelectItem>
                      <SelectItem value="en-cours">En cours</SelectItem>
                      <SelectItem value="resolu">Résolu</SelectItem>
                      <SelectItem value="ferme">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Réponse</Label>
                  <Textarea
                    className="mt-1.5 min-h-[100px]"
                    placeholder="Écrivez votre réponse..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
                  onClick={() => setDetailOpen(false)}
                >
                  <Send className="h-4 w-4" />
                  Envoyer la réponse
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
