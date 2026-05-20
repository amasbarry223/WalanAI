'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
  Clock,
  Users,
  Calendar,
  Download,
} from 'lucide-react'
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
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
type EntityType = 'Utilisateur' | 'Document' | 'Abonnement' | 'Configuration'

interface AuditEntry {
  id: string
  timestamp: string
  userName: string
  userInitials: string
  action: ActionType
  entity: EntityType
  entityId: string
  details: string
  ip: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockAuditLog: AuditEntry[] = [
  { id: '1', timestamp: '04 Mar 2026 14:32', userName: 'Admin Principal', userInitials: 'AP', action: 'LOGIN', entity: 'Configuration', entityId: 'CFG-001', details: 'Connexion administrateur', ip: '192.168.1.10' },
  { id: '2', timestamp: '04 Mar 2026 14:35', userName: 'Admin Principal', userInitials: 'AP', action: 'CREATE', entity: 'Utilisateur', entityId: 'USR-247', details: "Création d'un nouveau compte utilisateur", ip: '192.168.1.10' },
  { id: '3', timestamp: '04 Mar 2026 13:18', userName: 'Marie Laurent', userInitials: 'ML', action: 'UPDATE', entity: 'Abonnement', entityId: 'SUB-089', details: "Modification du plan de l'utilisateur Lucas Martin vers Pro", ip: '192.168.1.42' },
  { id: '4', timestamp: '04 Mar 2026 12:55', userName: 'Admin Principal', userInitials: 'AP', action: 'DELETE', entity: 'Document', entityId: 'DOC-512', details: "Suppression d'un document", ip: '192.168.1.10' },
  { id: '5', timestamp: '04 Mar 2026 11:40', userName: 'Marie Laurent', userInitials: 'ML', action: 'UPDATE', entity: 'Configuration', entityId: 'CFG-003', details: 'Modification de la configuration plateforme', ip: '192.168.1.42' },
  { id: '6', timestamp: '04 Mar 2026 10:22', userName: 'Admin Principal', userInitials: 'AP', action: 'UPDATE', entity: 'Abonnement', entityId: 'SUB-001', details: 'Mise à jour des limites du plan Gratuit', ip: '192.168.1.10' },
  { id: '7', timestamp: '04 Mar 2026 09:15', userName: 'Marie Laurent', userInitials: 'ML', action: 'LOGIN', entity: 'Configuration', entityId: 'CFG-001', details: 'Connexion administrateur', ip: '192.168.1.42' },
  { id: '8', timestamp: '03 Mar 2026 18:45', userName: 'Admin Principal', userInitials: 'AP', action: 'LOGOUT', entity: 'Configuration', entityId: 'CFG-001', details: 'Déconnexion administrateur', ip: '192.168.1.10' },
  { id: '9', timestamp: '03 Mar 2026 17:30', userName: 'Marie Laurent', userInitials: 'ML', action: 'CREATE', entity: 'Document', entityId: 'DOC-534', details: "Création d'un document de modèle de quiz", ip: '192.168.1.42' },
  { id: '10', timestamp: '03 Mar 2026 16:12', userName: 'Admin Principal', userInitials: 'AP', action: 'UPDATE', entity: 'Utilisateur', entityId: 'USR-198', details: "Modification du rôle de l'utilisateur Sarah Klein", ip: '192.168.1.10' },
  { id: '11', timestamp: '03 Mar 2026 15:08', userName: 'Marie Laurent', userInitials: 'ML', action: 'DELETE', entity: 'Document', entityId: 'DOC-498', details: "Suppression d'un document obsolète", ip: '192.168.1.42' },
  { id: '12', timestamp: '03 Mar 2026 14:33', userName: 'Admin Principal', userInitials: 'AP', action: 'CREATE', entity: 'Utilisateur', entityId: 'USR-248', details: "Création d'un nouveau compte administrateur", ip: '192.168.1.10' },
  { id: '13', timestamp: '03 Mar 2026 13:20', userName: 'Marie Laurent', userInitials: 'ML', action: 'UPDATE', entity: 'Abonnement', entityId: 'SUB-045', details: 'Mise à jour du tarif du plan Pro', ip: '192.168.1.42' },
  { id: '14', timestamp: '03 Mar 2026 11:55', userName: 'Admin Principal', userInitials: 'AP', action: 'LOGIN', entity: 'Configuration', entityId: 'CFG-001', details: 'Connexion administrateur', ip: '192.168.1.10' },
  { id: '15', timestamp: '02 Mar 2026 17:40', userName: 'Admin Principal', userInitials: 'AP', action: 'DELETE', entity: 'Utilisateur', entityId: 'USR-112', details: "Suppression du compte utilisateur inactif Pierre Vidal", ip: '192.168.1.10' },
  { id: '16', timestamp: '02 Mar 2026 16:22', userName: 'Marie Laurent', userInitials: 'ML', action: 'UPDATE', entity: 'Configuration', entityId: 'CFG-007', details: 'Modification des paramètres de notification par email', ip: '192.168.1.42' },
  { id: '17', timestamp: '02 Mar 2026 14:10', userName: 'Admin Principal', userInitials: 'AP', action: 'CREATE', entity: 'Abonnement', entityId: 'SUB-090', details: "Création d'un code promotionnel pour le plan Pro", ip: '192.168.1.10' },
  { id: '18', timestamp: '02 Mar 2026 10:05', userName: 'Marie Laurent', userInitials: 'ML', action: 'LOGOUT', entity: 'Configuration', entityId: 'CFG-001', details: 'Déconnexion administrateur', ip: '192.168.1.42' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const actionBadgeMap: Record<ActionType, { label: string; className: string }> = {
  CREATE: { label: 'CREATE', className: 'bg-emerald-100 text-emerald-700 border-0' },
  UPDATE: { label: 'UPDATE', className: 'bg-blue-100 text-blue-700 border-0' },
  DELETE: { label: 'DELETE', className: 'bg-red-100 text-red-700 border-0' },
  LOGIN:  { label: 'LOGIN',  className: 'bg-violet-100 text-violet-700 border-0' },
  LOGOUT: { label: 'LOGOUT', className: 'bg-gray-100 text-gray-600 border-0' },
}

const entityBadgeMap: Record<EntityType, string> = {
  Utilisateur: 'bg-sky-100 text-sky-700 border-0',
  Document: 'bg-amber-100 text-amber-700 border-0',
  Abonnement: 'bg-fuchsia-100 text-fuchsia-700 border-0',
  Configuration: 'bg-slate-100 text-slate-600 border-0',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminAuditPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('7d')
  const [currentPage, setCurrentPage] = useState(1)
  const [exportConfirmOpen, setExportConfirmOpen] = useState(false)
  const { toast } = useToast()

  const itemsPerPage = 8

  // Filtering
  let filtered = mockAuditLog.filter((entry) => {
    const matchSearch =
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.ip.includes(searchQuery)
    const matchAction = actionFilter === 'all' || entry.action === actionFilter
    const matchEntity = entityFilter === 'all' || entry.entity === entityFilter
    return matchSearch && matchAction && matchEntity
  })

  // Apply date range filter
  // Mock data is sorted newest-first; first 7 entries are "today", first 14 are "last 7 days"
  if (dateRange === 'today') {
    filtered = filtered.filter((_, index) => index < 7)
  } else if (dateRange === '7d') {
    filtered = filtered.filter((_, index) => index < 14)
  }
  // '30d' shows all entries

  const handleExport = () => {
    setExportConfirmOpen(false)
    toast({
      title: 'Export réussi',
      description: `Le journal d'audit a été exporté (${filtered.length} entrée(s)).`,
    })
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedEntries = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page on filter change
  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v)
    setCurrentPage(1)
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
                  <Shield className="h-6 w-6 text-emerald-400" />
                  Journal d&apos;audit
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Traçabilité de toutes les actions sur la plateforme
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">47 actions aujourd&apos;hui</Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Actions aujourd\'hui', value: 47, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Actions cette semaine', value: 312, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Admins actifs', value: 3, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
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

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par utilisateur, action, ID..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <Select value={actionFilter} onValueChange={handleFilterChange(setActionFilter)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="CREATE">CREATE</SelectItem>
                  <SelectItem value="UPDATE">UPDATE</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="LOGIN">LOGIN</SelectItem>
                  <SelectItem value="LOGOUT">LOGOUT</SelectItem>
                </SelectContent>
              </Select>
              <Select value={entityFilter} onValueChange={handleFilterChange(setEntityFilter)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Entité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="Utilisateur">Utilisateur</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Abonnement">Abonnement</SelectItem>
                  <SelectItem value="Configuration">Configuration</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={handleFilterChange(setDateRange)}>
                <SelectTrigger className="w-full sm:w-[170px]">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                  <SelectItem value="7d">7 derniers jours</SelectItem>
                  <SelectItem value="30d">30 derniers jours</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setExportConfirmOpen(true)}
              >
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Audit Log Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Horodatage
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Utilisateur
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                      Entité
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                      ID Entité
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                      Détails
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">
                      Adresse IP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEntries.map((entry) => {
                    const actionBadge = actionBadgeMap[entry.action]
                    const entityBadgeClass = entityBadgeMap[entry.entity]
                    return (
                      <tr
                        key={entry.id}
                        className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Horodatage */}
                        <td className="py-3 px-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {entry.timestamp.split(' ').slice(0, 3).join(' ')}
                            </p>
                            <p className="text-xs text-gray-400">
                              {entry.timestamp.split(' ')[3]}
                            </p>
                          </div>
                        </td>

                        {/* Utilisateur */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-[10px] font-bold text-white bg-gradient-to-br from-emerald-400 to-teal-500">
                                {entry.userInitials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-900 truncate max-w-[120px]">
                              {entry.userName}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4">
                          <Badge className={cn('text-[10px] font-semibold', actionBadge.className)}>
                            {actionBadge.label}
                          </Badge>
                        </td>

                        {/* Entité */}
                        <td className="py-3 px-4 hidden md:table-cell">
                          <Badge className={cn('text-[10px]', entityBadgeClass)}>
                            {entry.entity}
                          </Badge>
                        </td>

                        {/* ID Entité */}
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {entry.entityId}
                          </span>
                        </td>

                        {/* Détails */}
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <p className="text-xs text-gray-600 truncate max-w-[220px]">
                            {entry.details}
                          </p>
                        </td>

                        {/* Adresse IP */}
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <span className="text-xs font-mono text-gray-400">
                            {entry.ip}
                          </span>
                        </td>
                      </tr>
                    )
                  })}

                  {paginatedEntries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <Shield className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Aucune entrée trouvée</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Modifiez les filtres pour voir plus de résultats
                        </p>
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
                  {filtered.length} entrée(s) trouvée(s)
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
                      className={cn(
                        'h-8 w-8',
                        page === currentPage && 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      )}
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
      {/* Export Confirmation Dialog */}
      <AlertDialog open={exportConfirmOpen} onOpenChange={setExportConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exporter le journal d&apos;audit</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous exporter les {filtered.length} entrée(s) filtrée(s) du journal d&apos;audit au format CSV ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleExport}
            >
              Exporter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
