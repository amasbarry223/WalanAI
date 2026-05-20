'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  XCircle,
  Crown,
  Shield,
  GraduationCap,
  Mail,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface AdminUser {
  id: string
  name: string
  email: string
  plan: 'gratuit' | 'pro'
  role: 'etudiant' | 'admin' | 'super-admin'
  active: boolean
  documents: number
  flashcards: number
  quizzes: number
  joinedAt: string
  lastActive: string
  streak: number
  score: number
}

const mockUsers: AdminUser[] = [
  { id: '1', name: 'Lucas Martin', email: 'lucas.martin@univ.fr', plan: 'pro', role: 'etudiant', active: true, documents: 12, flashcards: 89, quizzes: 24, joinedAt: '15 Jan 2026', lastActive: 'Il y a 5 min', streak: 12, score: 78 },
  { id: '2', name: 'Emma Dubois', email: 'emma.dubois@univ.fr', plan: 'pro', role: 'etudiant', active: true, documents: 8, flashcards: 156, quizzes: 32, joinedAt: '22 Jan 2026', lastActive: 'Il y a 1h', streak: 8, score: 85 },
  { id: '3', name: 'Hugo Richard', email: 'hugo.richard@univ.fr', plan: 'gratuit', role: 'etudiant', active: true, documents: 3, flashcards: 24, quizzes: 8, joinedAt: '3 Fév 2026', lastActive: 'Il y a 3h', streak: 3, score: 62 },
  { id: '4', name: 'Léa Petit', email: 'lea.petit@univ.fr', plan: 'pro', role: 'etudiant', active: false, documents: 6, flashcards: 45, quizzes: 15, joinedAt: '10 Fév 2026', lastActive: 'Il y a 2j', streak: 0, score: 71 },
  { id: '5', name: 'Nathan Bernard', email: 'nathan.bernard@univ.fr', plan: 'pro', role: 'etudiant', active: true, documents: 15, flashcards: 210, quizzes: 48, joinedAt: '18 Fév 2026', lastActive: 'Il y a 30 min', streak: 21, score: 92 },
  { id: '6', name: 'Chloé Moreau', email: 'chloe.moreau@univ.fr', plan: 'gratuit', role: 'etudiant', active: true, documents: 2, flashcards: 18, quizzes: 5, joinedAt: '25 Fév 2026', lastActive: 'Il y a 6h', streak: 1, score: 55 },
  { id: '7', name: 'Admin Principal', email: 'admin@scolarai.fr', plan: 'pro', role: 'super-admin', active: true, documents: 0, flashcards: 0, quizzes: 0, joinedAt: '1 Jan 2026', lastActive: 'Il y a 2 min', streak: 0, score: 0 },
  { id: '8', name: 'Marie Laurent', email: 'marie.laurent@univ.fr', plan: 'pro', role: 'admin', active: true, documents: 4, flashcards: 32, quizzes: 10, joinedAt: '5 Mar 2026', lastActive: 'Il y a 1h', streak: 7, score: 80 },
  { id: '9', name: 'Thomas Blanc', email: 'thomas.blanc@univ.fr', plan: 'gratuit', role: 'etudiant', active: true, documents: 1, flashcards: 12, quizzes: 3, joinedAt: '12 Mar 2026', lastActive: 'Il y a 4h', streak: 2, score: 48 },
  { id: '10', name: 'Julie Roux', email: 'julie.roux@univ.fr', plan: 'pro', role: 'etudiant', active: true, documents: 7, flashcards: 95, quizzes: 20, joinedAt: '20 Mar 2026', lastActive: 'Il y a 45 min', streak: 15, score: 88 },
  { id: '11', name: 'Pierre Vidal', email: 'pierre.vidal@univ.fr', plan: 'gratuit', role: 'etudiant', active: false, documents: 2, flashcards: 8, quizzes: 2, joinedAt: '1 Avr 2026', lastActive: 'Il y a 5j', streak: 0, score: 35 },
  { id: '12', name: 'Sarah Klein', email: 'sarah.klein@univ.fr', plan: 'pro', role: 'etudiant', active: true, documents: 10, flashcards: 134, quizzes: 28, joinedAt: '8 Avr 2026', lastActive: 'Il y a 15 min', streak: 18, score: 91 },
  { id: '13', name: 'Maxime Leroy', email: 'maxime.leroy@univ.fr', plan: 'gratuit', role: 'etudiant', active: true, documents: 3, flashcards: 22, quizzes: 6, joinedAt: '15 Avr 2026', lastActive: 'Il y a 2h', streak: 4, score: 67 },
  { id: '14', name: 'Alice Garcia', email: 'alice.garcia@univ.fr', plan: 'pro', role: 'etudiant', active: true, documents: 9, flashcards: 78, quizzes: 18, joinedAt: '22 Avr 2026', lastActive: 'Il y a 1h', streak: 10, score: 76 },
  { id: '15', name: 'Claire Dupont', email: 'claire.dupont@univ.fr', plan: 'gratuit', role: 'etudiant', active: true, documents: 1, flashcards: 15, quizzes: 4, joinedAt: '30 Avr 2026', lastActive: 'Il y a 8h', streak: 1, score: 52 },
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [sortField, setSortField] = useState<string>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const itemsPerPage = 10

  // Filtering
  let filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPlan = planFilter === 'all' || u.plan === planFilter
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? u.active : !u.active)
    return matchSearch && matchPlan && matchRole && matchStatus
  })

  // Sorting
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
  const paginatedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super-admin': return <Shield className="h-4 w-4 text-red-500" />
      case 'admin': return <Crown className="h-4 w-4 text-amber-500" />
      default: return <GraduationCap className="h-4 w-4 text-blue-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super-admin': return <Badge className="bg-red-100 text-red-700 text-[10px] border-0">Super Admin</Badge>
      case 'admin': return <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Admin</Badge>
      default: return <Badge className="bg-blue-100 text-blue-700 text-[10px] border-0">Étudiant</Badge>
    }
  }

  // Stats
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter(u => u.active).length
  const proUsers = mockUsers.filter(u => u.plan === 'pro').length
  const conversionRate = Math.round((proUsers / totalUsers) * 100)

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-500" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-sm text-gray-500 mt-1">Gérez les comptes, rôles et permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2" onClick={() => setAddOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total utilisateurs', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Utilisateurs actifs', value: activeUsers, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Abonnés Pro', value: proUsers, icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Taux conversion', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
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
                  placeholder="Rechercher par nom ou email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                />
              </div>
              <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les plans</SelectItem>
                  <SelectItem value="gratuit">Gratuit</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-gray-700">
                        Utilisateur <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Plan</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Rôle</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Statut</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">
                      <button onClick={() => toggleSort('score')} className="flex items-center gap-1 hover:text-gray-700">
                        Score <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Inscrit le</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className={cn(
                              'text-xs font-bold text-white',
                              user.role === 'super-admin' ? 'bg-red-500' : user.role === 'admin' ? 'bg-amber-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                            )}>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <Badge className={user.plan === 'pro' ? 'bg-emerald-100 text-emerald-700 text-[10px] border-0' : 'bg-gray-100 text-gray-600 text-[10px] border-0'}>
                          {user.plan === 'pro' ? 'Pro' : 'Gratuit'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('w-2 h-2 rounded-full', user.active ? 'bg-emerald-500' : 'bg-gray-300')} />
                          <span className="text-xs text-gray-600">{user.active ? 'Actif' : 'Inactif'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <span className={cn('text-sm font-semibold', user.score >= 80 ? 'text-emerald-600' : user.score >= 60 ? 'text-amber-600' : 'text-red-500')}>
                          {user.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 hidden xl:table-cell">{user.joinedAt}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setDetailOpen(true) }}>
                              <Eye className="h-4 w-4 mr-2" /> Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setEditOpen(true) }}>
                              <Pencil className="h-4 w-4 mr-2" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" /> Envoyer un email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-amber-600">
                              <Ban className="h-4 w-4 mr-2" /> {user.active ? 'Suspendre' : 'Réactiver'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-gray-500">
                  {filtered.length} utilisateur(s) trouvé(s)
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

      {/* User Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-500" />
              Profil utilisateur
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className={cn(
                    'text-lg font-bold text-white',
                    selectedUser.role === 'super-admin' ? 'bg-red-500' : selectedUser.role === 'admin' ? 'bg-amber-500' : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                  )}>
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(selectedUser.role)}
                    <Badge className={selectedUser.plan === 'pro' ? 'bg-emerald-100 text-emerald-700 text-[10px] border-0' : 'bg-gray-100 text-gray-600 text-[10px] border-0'}>
                      Plan {selectedUser.plan}
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{selectedUser.documents}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Documents</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{selectedUser.flashcards}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Flashcards</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{selectedUser.quizzes}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Quiz</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <p className="text-lg font-bold text-gray-900">{selectedUser.streak}j</p>
                  <p className="text-[10px] text-gray-500 uppercase">Série</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Score moyen</span><span className="font-semibold">{selectedUser.score}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Statut</span><span className={selectedUser.active ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>{selectedUser.active ? 'Actif' : 'Inactif'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Inscrit le</span><span className="font-medium">{selectedUser.joinedAt}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Dernière activité</span><span className="font-medium">{selectedUser.lastActive}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-emerald-500" />
              Modifier l&apos;utilisateur
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom complet</Label>
                  <Input defaultValue={selectedUser.name} className="mt-1.5" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue={selectedUser.email} className="mt-1.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan</Label>
                  <Select defaultValue={selectedUser.plan}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gratuit">Gratuit</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etudiant">Étudiant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Compte actif</p>
                  <p className="text-xs text-gray-400">Désactiver pour suspendre le compte</p>
                </div>
                <Switch defaultChecked={selectedUser.active} />
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setEditOpen(false)}>
                Enregistrer les modifications
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-500" />
              Ajouter un utilisateur
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nom complet</Label><Input placeholder="Nom Prénom" className="mt-1.5" /></div>
              <div><Label>Email</Label><Input placeholder="email@univ.fr" className="mt-1.5" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Mot de passe</Label><Input type="password" placeholder="••••••••" className="mt-1.5" /></div>
              <div>
                <Label>Plan</Label>
                <Select defaultValue="gratuit">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuit">Gratuit</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Rôle</Label>
              <Select defaultValue="etudiant">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setAddOpen(false)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Créer l&apos;utilisateur
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
