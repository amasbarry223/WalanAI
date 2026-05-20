'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Shield,
  BookOpen,
  Layers,
  HardDrive,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  File,
  Brain,
  HelpCircle,
  BookMarked,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentTab = 'documents' | 'flashcards' | 'quiz' | 'ressources'
type ContentType = 'document' | 'flashcard' | 'quiz' | 'ressource'
type ContentStatus = 'publié' | 'en_revue' | 'brouillon' | 'signalé'

interface ContentItem {
  id: string
  titre: string
  type: ContentType
  propriétaire: string
  matière: string
  taillePages: string
  date: string
  statut: ContentStatus
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockContent: ContentItem[] = [
  { id: '1', titre: 'Introduction au Droit Civil', type: 'document', propriétaire: 'Lucas Martin', matière: 'Droit', taillePages: '45 pages', date: '12 Mar 2026', statut: 'publié' },
  { id: '2', titre: 'Les institutions de la Ve République', type: 'document', propriétaire: 'Emma Dubois', matière: 'Histoire', taillePages: '32 pages', date: '10 Mar 2026', statut: 'publié' },
  { id: '3', titre: 'Microéconomie – Offre et demande', type: 'flashcard', propriétaire: 'Hugo Richard', matière: 'Économie', taillePages: '120 cartes', date: '9 Mar 2026', statut: 'publié' },
  { id: '4', titre: 'Algorithmique et structures de données', type: 'quiz', propriétaire: 'Nathan Bernard', matière: 'Informatique', taillePages: '25 questions', date: '8 Mar 2026', statut: 'en_revue' },
  { id: '5', titre: 'Constitutionnalisme comparé', type: 'document', propriétaire: 'Léa Petit', matière: 'Droit', taillePages: '58 pages', date: '7 Mar 2026', statut: 'brouillon' },
  { id: '6', titre: 'Macroéconomie – La croissance', type: 'flashcard', propriétaire: 'Chloé Moreau', matière: 'Économie', taillePages: '85 cartes', date: '6 Mar 2026', statut: 'publié' },
  { id: '7', titre: 'Histoire de la Révolution française', type: 'document', propriétaire: 'Marie Laurent', matière: 'Histoire', taillePages: '72 pages', date: '5 Mar 2026', statut: 'signalé' },
  { id: '8', titre: 'Programmation orientée objet', type: 'quiz', propriétaire: 'Thomas Blanc', matière: 'Informatique', taillePages: '30 questions', date: '4 Mar 2026', statut: 'publié' },
  { id: '9', titre: 'Droit du travail – Contrats', type: 'ressource', propriétaire: 'Julie Roux', matière: 'Droit', taillePages: '18 pages', date: '3 Mar 2026', statut: 'publié' },
  { id: '10', titre: 'Statistiques descriptives', type: 'flashcard', propriétaire: 'Sarah Klein', matière: 'Économie', taillePages: '65 cartes', date: '2 Mar 2026', statut: 'en_revue' },
  { id: '11', titre: 'Bases de données relationnelles', type: 'quiz', propriétaire: 'Pierre Vidal', matière: 'Informatique', taillePages: '20 questions', date: '1 Mar 2026', statut: 'publié' },
  { id: '12', titre: 'La Guerre froide – Synthèse', type: 'ressource', propriétaire: 'Alice Garcia', matière: 'Histoire', taillePages: '24 pages', date: '28 Fév 2026', statut: 'brouillon' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getTypeBadge = (type: ContentType) => {
  switch (type) {
    case 'document':
      return <Badge className="bg-blue-100 text-blue-700 text-[10px] border-0 gap-1"><File className="h-3 w-3" />Document</Badge>
    case 'flashcard':
      return <Badge className="bg-violet-100 text-violet-700 text-[10px] border-0 gap-1"><Brain className="h-3 w-3" />Flashcard</Badge>
    case 'quiz':
      return <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0 gap-1"><HelpCircle className="h-3 w-3" />Quiz</Badge>
    case 'ressource':
      return <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0 gap-1"><BookMarked className="h-3 w-3" />Ressource</Badge>
  }
}

const getStatusBadge = (statut: ContentStatus) => {
  switch (statut) {
    case 'publié':
      return <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0">Publié</Badge>
    case 'en_revue':
      return <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">En revue</Badge>
    case 'brouillon':
      return <Badge className="bg-gray-100 text-gray-600 text-[10px] border-0">Brouillon</Badge>
    case 'signalé':
      return <Badge className="bg-red-100 text-red-700 text-[10px] border-0">Signalé</Badge>
  }
}

const getMatiereColor = (matière: string) => {
  switch (matière) {
    case 'Droit': return 'bg-blue-50 text-blue-700'
    case 'Économie': return 'bg-amber-50 text-amber-700'
    case 'Informatique': return 'bg-violet-50 text-violet-700'
    case 'Histoire': return 'bg-rose-50 text-rose-700'
    default: return 'bg-gray-50 text-gray-700'
  }
}

const tabItems: { key: ContentTab; label: string; icon: React.ElementType }[] = [
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'flashcards', label: 'Flashcards', icon: Brain },
  { key: 'quiz', label: 'Quiz', icon: HelpCircle },
  { key: 'ressources', label: 'Ressources', icon: BookMarked },
]

const matières = ['Toutes', 'Droit', 'Économie', 'Informatique', 'Histoire']
const statuts = ['Tous', 'Publié', 'En revue', 'Brouillon', 'Signalé']

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<ContentTab>('documents')
  const [searchQuery, setSearchQuery] = useState('')
  const [matiereFilter, setMatiereFilter] = useState<string>('Toutes')
  const [statusFilter, setStatusFilter] = useState<string>('Tous')
  const [sortField, setSortField] = useState<string>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const { toast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ title: string; description: string; onConfirm: () => void } | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)

  const itemsPerPage = 10

  // Filter by tab
  let filtered = mockContent.filter((item) => {
    const tabMatch =
      activeTab === 'documents' ? item.type === 'document' :
      activeTab === 'flashcards' ? item.type === 'flashcard' :
      activeTab === 'quiz' ? item.type === 'quiz' :
      item.type === 'ressource'

    const searchMatch =
      item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.propriétaire.toLowerCase().includes(searchQuery.toLowerCase())

    const matiereMatch = matiereFilter === 'Toutes' || item.matière === matiereFilter

    const statusMap: Record<string, ContentStatus | null> = {
      'Tous': null,
      'Publié': 'publié',
      'En revue': 'en_revue',
      'Brouillon': 'brouillon',
      'Signalé': 'signalé',
    }
    const statusMatch = !statusMap[statusFilter] || item.statut === statusMap[statusFilter]

    return tabMatch && searchMatch && matiereMatch && statusMatch
  })

  // Sort
  filtered = [...filtered].sort((a, b) => {
    const aVal = (a as any)[sortField]
    const bVal = (b as any)[sortField]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedContent = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
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
                  <FileText className="h-6 w-6 text-emerald-400" />
                  Gestion du Contenu
                </h1>
                <p className="text-slate-400 text-sm mt-1">Supervisez les documents, flashcards et quiz de la plateforme</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{mockContent.length} contenus</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Export en cours", description: "Le fichier CSV sera téléchargé sous peu." })}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total documents', value: '847', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Flashcards créées', value: '12 450', icon: Brain, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Quiz générés', value: '3 280', icon: HelpCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Stockage utilisé', value: '24.5 GB', icon: HardDrive, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      {/* Tab Filter */}
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCurrentPage(1) }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par titre ou propriétaire..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                />
              </div>
              <Select value={matiereFilter} onValueChange={(v) => { setMatiereFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Matière" />
                </SelectTrigger>
                <SelectContent>
                  {matières.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  {statuts.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <button onClick={() => toggleSort('titre')} className="flex items-center gap-1 hover:text-gray-700">
                        Titre <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Propriétaire</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Matière</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Taille/Pages</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">
                      <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-gray-700">
                        Date <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedContent.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Layers className="h-8 w-8 text-gray-300" />
                          <p className="text-sm text-gray-400">Aucun contenu trouvé</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedContent.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                        {/* Titre + Matière badge (mobile) */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-none">{item.titre}</p>
                            <div className="flex items-center gap-1.5 sm:hidden">
                              {getTypeBadge(item.type)}
                              <Badge className={cn('text-[10px] border-0', getMatiereColor(item.matière))}>{item.matière}</Badge>
                            </div>
                          </div>
                        </td>
                        {/* Type */}
                        <td className="py-3 px-4 hidden sm:table-cell">
                          {getTypeBadge(item.type)}
                        </td>
                        {/* Propriétaire */}
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-sm text-gray-600">{item.propriétaire}</span>
                        </td>
                        {/* Matière */}
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <Badge className={cn('text-[10px] border-0', getMatiereColor(item.matière))}>{item.matière}</Badge>
                        </td>
                        {/* Taille/Pages */}
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-sm text-gray-500">{item.taillePages}</span>
                        </td>
                        {/* Date + Status (desktop) */}
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">{item.date}</span>
                            {getStatusBadge(item.statut)}
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedContent(item)
                                setPreviewOpen(true)
                              }}>
                                <Eye className="h-4 w-4 mr-2" /> Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast({ title: "Contenu modéré", description: "Le contenu a été signalé pour révision." })}>
                                <Shield className="h-4 w-4 mr-2" /> Modérer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => {
                                setConfirmAction({
                                  title: 'Supprimer le contenu',
                                  description: 'Voulez-vous vraiment supprimer ce contenu ? Cette action est irréversible.',
                                  onConfirm: () => {
                                    toast({ title: 'Contenu supprimé', description: 'Le contenu a été supprimé avec succès.', variant: 'destructive' })
                                    setConfirmOpen(false)
                                  }
                                })
                                setConfirmOpen(true)
                              }}>
                                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-gray-500">
                  {filtered.length} contenu(s) trouvé(s)
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-500" />
              Aperçu du contenu
            </DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <Label>Titre</Label>
                <p className="text-sm text-gray-900 mt-1 font-medium">{selectedContent.titre}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Type</Label><div className="mt-1">{getTypeBadge(selectedContent.type)}</div></div>
                <div><Label>Statut</Label><div className="mt-1">{getStatusBadge(selectedContent.statut)}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Propriétaire</Label><p className="text-sm text-gray-700 mt-1">{selectedContent.propriétaire}</p></div>
                <div><Label>Matière</Label><Badge className={cn('text-[10px] border-0 mt-1', getMatiereColor(selectedContent.matière))}>{selectedContent.matière}</Badge></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Taille/Pages</Label><p className="text-sm text-gray-700 mt-1">{selectedContent.taillePages}</p></div>
                <div><Label>Date</Label><p className="text-sm text-gray-700 mt-1">{selectedContent.date}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation AlertDialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmAction?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction?.onConfirm} className="bg-red-600 hover:bg-red-700 text-white">Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
