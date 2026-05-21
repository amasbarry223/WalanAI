'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  Crown,
  Shield,
  GraduationCap,
  Mail,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import { useToast } from '@/hooks/use-toast'
import { downloadCsv } from '@/lib/download'
import {
  adminCreateAccount,
  adminDeleteAccount,
  adminSetAccountActive,
  adminUpdateAccount,
  listAdminUsers,
  type AdminUserRow,
} from '@/lib/admin-users'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function AdminUsersPage() {
  const actor = useAppStore((s) => s.user)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    description: string
    onConfirm: () => void
  } | null>(null)

  const [editForm, setEditForm] = useState({
    name: '',
    plan: 'gratuit' as 'gratuit' | 'pro',
    role: 'etudiant' as 'etudiant' | 'admin',
    active: true,
    password: '',
  })
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'gratuit' as 'gratuit' | 'pro',
    role: 'etudiant' as 'etudiant' | 'admin',
  })

  const { toast } = useToast()
  const itemsPerPage = 10
  const actorEmail = actor?.email ?? 'admin@walanai.local'

  const reload = useCallback(() => {
    setUsers(listAdminUsers())
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  let filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchPlan = planFilter === 'all' || u.plan === planFilter
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? u.active : !u.active)
    return matchSearch && matchPlan && matchRole && matchStatus
  })

  filtered = [...filtered].sort((a, b) => {
    const aVal = (a as Record<string, string | number>)[sortField]
    const bVal = (b as Record<string, string | number>)[sortField]
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortDir === 'asc'
      ? Number(aVal) - Number(bVal)
      : Number(bVal) - Number(aVal)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleExportCsv = () => {
    downloadCsv(
      'walanai-utilisateurs.csv',
      ['Nom', 'Email', 'Plan', 'Rôle', 'Actif', 'Documents', 'Flashcards', 'Quiz'],
      filtered.map((u) => [
        u.name,
        u.email,
        u.plan,
        u.role,
        u.active ? 'oui' : 'non',
        String(u.documents),
        String(u.flashcards),
        String(u.quizzes),
      ])
    )
    toast({ title: 'Export CSV téléchargé' })
  }

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const openEdit = (user: AdminUserRow) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      plan: user.plan,
      role: user.role === 'super-admin' ? 'admin' : (user.role as 'etudiant' | 'admin'),
      active: user.active,
      password: '',
    })
    setEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!selectedUser || selectedUser.isSystemAccount) return
    const result = adminUpdateAccount(selectedUser.email, {
      name: editForm.name.trim(),
      plan: editForm.plan,
      role: editForm.role,
      active: editForm.active,
      ...(editForm.password ? { password: editForm.password } : {}),
      actorEmail,
    })
    if (!result.ok) {
      toast({ title: 'Erreur', description: result.error, variant: 'destructive' })
      return
    }
    toast({
      title: 'Modifications enregistrées',
      description: `Le profil de ${editForm.name} a été mis à jour.`,
    })
    setEditOpen(false)
    reload()
  }

  const handleCreate = () => {
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.password) {
      toast({
        title: 'Champs requis',
        description: 'Nom, email et mot de passe sont obligatoires.',
        variant: 'destructive',
      })
      return
    }
    const result = adminCreateAccount({
      ...addForm,
      name: addForm.name.trim(),
      actorEmail,
    })
    if (!result.ok) {
      toast({ title: 'Erreur', description: result.error, variant: 'destructive' })
      return
    }
    toast({ title: 'Utilisateur créé', description: 'Le compte a été enregistré localement.' })
    setAddForm({ name: '', email: '', password: '', plan: 'gratuit', role: 'etudiant' })
    setAddOpen(false)
    reload()
  }

  const handleToggleActive = (user: AdminUserRow) => {
    if (user.isSystemAccount) return
    setConfirmAction({
      title: user.active ? 'Suspendre le compte' : 'Réactiver le compte',
      description: user.active
        ? `Suspendre ${user.name} ? L'utilisateur ne pourra plus se connecter.`
        : `Réactiver le compte de ${user.name} ?`,
      onConfirm: () => {
        const result = adminSetAccountActive(user.email, !user.active, actorEmail)
        if (!result.ok) {
          toast({ title: 'Erreur', description: result.error, variant: 'destructive' })
        } else {
          toast({
            title: user.active ? 'Compte suspendu' : 'Compte réactivé',
            description: `Le compte de ${user.name} a été mis à jour.`,
          })
          reload()
        }
        setConfirmOpen(false)
      },
    })
    setConfirmOpen(true)
  }

  const handleDelete = (user: AdminUserRow) => {
    if (user.isSystemAccount) return
    setConfirmAction({
      title: 'Supprimer le compte',
      description: `Supprimer définitivement ${user.name} ? Action irréversible.`,
      onConfirm: () => {
        const result = adminDeleteAccount(user.email, actorEmail)
        if (!result.ok) {
          toast({ title: 'Erreur', description: result.error, variant: 'destructive' })
        } else {
          toast({
            title: 'Compte supprimé',
            description: `Le compte de ${user.name} a été retiré.`,
            variant: 'destructive',
          })
          reload()
        }
        setConfirmOpen(false)
      },
    })
    setConfirmOpen(true)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super-admin':
        return (
          <Badge className="bg-red-100 text-red-700 text-[10px] border-0">Super Admin</Badge>
        )
      case 'admin':
        return (
          <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Admin</Badge>
        )
      default:
        return (
          <Badge className="bg-blue-100 text-blue-700 text-[10px] border-0">Étudiant</Badge>
        )
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.active).length
  const proUsers = users.filter((u) => u.plan === 'pro').length
  const conversionRate =
    totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6 text-emerald-400" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Comptes réels (localStorage) — inscriptions via /register incluses
              </p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 w-fit">
              {totalUsers} compte{totalUsers > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="gap-2" onClick={handleExportCsv}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </motion.div>

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
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les plans</SelectItem>
                  <SelectItem value="gratuit">Gratuit</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Rôle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
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

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/80">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                      <button type="button" onClick={() => toggleSort('name')} className="flex items-center gap-1">
                        Utilisateur <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Plan</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Rôle</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Statut</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden xl:table-cell">
                      <button type="button" onClick={() => toggleSort('score')} className="flex items-center gap-1">
                        Score <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden xl:table-cell">Inscrit le</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                        Aucun utilisateur. Créez un compte via &quot;Ajouter&quot; ou /register.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback
                                className={cn(
                                  'text-xs font-bold text-white',
                                  user.role === 'super-admin'
                                    ? 'bg-red-500'
                                    : user.role === 'admin'
                                      ? 'bg-amber-500'
                                      : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                                )}
                              >
                                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{user.name}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <Badge className={user.plan === 'pro' ? 'bg-emerald-100 text-emerald-700 text-[10px] border-0' : 'bg-gray-100 text-gray-600 text-[10px] border-0'}>
                            {user.plan === 'pro' ? 'Pro' : 'Gratuit'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">{getRoleBadge(user.role)}</td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className={cn('w-2 h-2 rounded-full inline-block mr-1.5', user.active ? 'bg-emerald-500' : 'bg-gray-300')} />
                          <span className="text-xs">{user.active ? 'Actif' : 'Inactif'}</span>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell text-sm font-semibold">{user.score}%</td>
                        <td className="py-3 px-4 hidden xl:table-cell text-xs text-gray-500">{user.joinedAt}</td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setDetailOpen(true) }}>
                                <Eye className="h-4 w-4 mr-2" /> Voir le profil
                              </DropdownMenuItem>
                              {!user.isSystemAccount && (
                                <DropdownMenuItem onClick={() => openEdit(user)}>
                                  <Pencil className="h-4 w-4 mr-2" /> Modifier
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  toast({
                                    title: 'Mode démo',
                                    description: `Email simulé vers ${user.email} (pas d'envoi réel).`,
                                  })
                                }
                              >
                                <Mail className="h-4 w-4 mr-2" /> Envoyer un email
                              </DropdownMenuItem>
                              {!user.isSystemAccount && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-amber-600" onClick={() => handleToggleActive(user)}>
                                    <Ban className="h-4 w-4 mr-2" />
                                    {user.active ? 'Suspendre' : 'Réactiver'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(user)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-gray-500">{filtered.length} utilisateur(s)</p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs px-2">{currentPage} / {totalPages}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Profil utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 text-sm">
              <p className="font-semibold text-lg">{selectedUser.name}</p>
              <p className="text-gray-500">{selectedUser.email}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="font-bold">{selectedUser.documents}</p>
                  <p className="text-[10px] text-gray-500">Documents</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="font-bold">{selectedUser.quizzes}</p>
                  <p className="text-[10px] text-gray-500">Quiz</p>
                </div>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">Statut</span><span>{selectedUser.active ? 'Actif' : 'Suspendu'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Inscrit</span><span>{selectedUser.joinedAt}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Dernière activité</span><span>{selectedUser.lastActive}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input className="mt-1.5" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plan</Label>
                <Select value={editForm.plan} onValueChange={(v: 'gratuit' | 'pro') => setEditForm((f) => ({ ...f, plan: v }))}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuit">Gratuit</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rôle</Label>
                <Select value={editForm.role} onValueChange={(v: 'etudiant' | 'admin') => setEditForm((f) => ({ ...f, role: v }))}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="etudiant">Étudiant</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Nouveau mot de passe (optionnel)</Label>
              <Input type="password" className="mt-1.5" value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <span className="text-sm font-medium">Compte actif</span>
              <Switch checked={editForm.active} onCheckedChange={(v) => setEditForm((f) => ({ ...f, active: v }))} />
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSaveEdit}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom</Label>
                <Input className="mt-1.5" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1.5" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mot de passe</Label>
                <Input type="password" className="mt-1.5" value={addForm.password} onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))} />
              </div>
              <div>
                <Label>Plan</Label>
                <Select value={addForm.plan} onValueChange={(v: 'gratuit' | 'pro') => setAddForm((f) => ({ ...f, plan: v }))}>
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
              <Select value={addForm.role} onValueChange={(v: 'etudiant' | 'admin') => setAddForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleCreate}>
              <UserPlus className="h-4 w-4 mr-2" />
              Créer le compte
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmAction?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction?.onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
