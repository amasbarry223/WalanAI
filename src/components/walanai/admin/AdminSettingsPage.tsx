'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Globe,
  Target,
  Brain,
  Zap,
  Save,
  Trash2,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
  Clock,
  Users,
  Calendar,
  Download,
  Lock,
  Smartphone,
  Monitor,
  Wifi,
  Bell,
  Mail,
  Server,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

// ─── Audit Types & Data ─────────────────────────────────────────────────────

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

// ─── Security Session Mock ───────────────────────────────────────────────────

interface Session {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

const mockSessions: Session[] = [
  { id: '1', device: 'Chrome · macOS', location: 'Paris, France', ip: '192.168.1.10', lastActive: 'Actif maintenant', current: true },
  { id: '2', device: 'Firefox · Windows', location: 'Lyon, France', ip: '192.168.1.42', lastActive: 'Il y a 2h', current: false },
  { id: '3', device: 'Safari · iOS', location: 'Marseille, France', ip: '10.0.0.15', lastActive: 'Il y a 1 jour', current: false },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const { toast } = useToast()

  // ── Général ──
  const [platformName, setPlatformName] = useState('WalanAI')
  const [platformUrl, setPlatformUrl] = useState('https://walanai.fr')
  const [platformDescription, setPlatformDescription] = useState('')
  const [contactEmail, setContactEmail] = useState('contact@walanai.fr')

  // ── Limites ──
  const [freeMaxDocs, setFreeMaxDocs] = useState(3)
  const [freeMaxQuiz, setFreeMaxQuiz] = useState(10)
  const [freeMaxStorage, setFreeMaxStorage] = useState(50)

  // ── IA ──
  const [defaultModel, setDefaultModel] = useState('gpt-4o')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)

  // ── Fonctionnalités ──
  const [flashcardsIA, setFlashcardsIA] = useState(true)
  const [coachIA, setCoachIA] = useState(true)
  const [groupesEtude, setGroupesEtude] = useState(true)
  const [pomodoro, setPomodoro] = useState(true)
  const [modeSombre, setModeSombre] = useState(false)

  // ── Sécurité ──
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordMinLength, setPasswordMinLength] = useState('8')
  const [requireSpecialChar, setRequireSpecialChar] = useState(true)
  const [requireNumber, setRequireNumber] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [ipWhitelist, setIpWhitelist] = useState('')
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false)
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null)

  // ── Notifications ──
  const [emailNewUser, setEmailNewUser] = useState(true)
  const [emailNewSubscription, setEmailNewSubscription] = useState(true)
  const [emailSupportTicket, setEmailSupportTicket] = useState(true)
  const [emailWeeklyReport, setEmailWeeklyReport] = useState(true)
  const [emailSecurityAlert, setEmailSecurityAlert] = useState(true)
  const [smtpHost, setSmtpHost] = useState('smtp.walanai.fr')
  const [smtpPort, setSmtpPort] = useState('587')
  const [smtpUser, setSmtpUser] = useState('noreply@walanai.fr')

  // ── Maintenance ──
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [maintenanceConfirmOpen, setMaintenanceConfirmOpen] = useState(false)
  const [pendingMaintenance, setPendingMaintenance] = useState(false)

  // ── Audit ──
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('7d')
  const [currentPage, setCurrentPage] = useState(1)
  const [exportConfirmOpen, setExportConfirmOpen] = useState(false)
  const itemsPerPage = 8

  // ── Handlers ──

  const handleClearCache = () => {
    toast({ title: 'Cache vidé', description: 'Le cache des données temporaires a été supprimé.' })
  }

  const handleSave = () => {
    toast({ title: 'Configuration enregistrée', description: 'Les paramètres de la plateforme ont été mis à jour avec succès.' })
  }

  const handleMaintenanceToggle = (checked: boolean) => {
    if (checked) {
      setPendingMaintenance(true)
      setMaintenanceConfirmOpen(true)
    } else {
      setMaintenanceMode(false)
    }
  }

  const confirmMaintenance = () => {
    setMaintenanceMode(true)
    setMaintenanceConfirmOpen(false)
    setPendingMaintenance(false)
    toast({ title: 'Mode maintenance activé', description: 'La plateforme est désormais inaccessible pour les utilisateurs.' })
  }

  const cancelMaintenance = () => {
    setMaintenanceConfirmOpen(false)
    setPendingMaintenance(false)
  }

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    setRevokeConfirmOpen(false)
    setSessionToRevoke(null)
    toast({ title: 'Session révoquée', description: 'La session a été déconnectée avec succès.' })
  }

  // ── Audit filtering ──
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

  if (dateRange === 'today') {
    filtered = filtered.filter((_, index) => index < 7)
  } else if (dateRange === '7d') {
    filtered = filtered.filter((_, index) => index < 14)
  }

  const handleExport = () => {
    setExportConfirmOpen(false)
    toast({
      title: 'Export réussi',
      description: `Le journal d'audit a été exporté (${filtered.length} entrée(s)).`,
    })
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedEntries = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
                  <Settings className="h-6 w-6 text-emerald-400" />
                  Configuration
                </h1>
                <p className="text-slate-400 text-sm mt-1">Paramètres globaux de la plateforme</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">v1.0</Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="general" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="w-full sm:w-auto h-auto p-1 bg-gray-100/80 rounded-xl">
              <TabsTrigger value="general" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Général</span>
                <span className="sm:hidden">Général</span>
              </TabsTrigger>
              <TabsTrigger value="limits" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Target className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Limites & IA</span>
                <span className="sm:hidden">Limites</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Zap className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Fonctionnalités</span>
                <span className="sm:hidden">Fonct.</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sécurité</span>
                <span className="sm:hidden">Sécu.</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Bell className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Notif.</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Activity className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Journal d&apos;audit</span>
                <span className="sm:hidden">Audit</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-2">
                <Server className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Maintenance</span>
                <span className="sm:hidden">Maint.</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── TAB: Général ──────────────────────────────────────────────────── */}
          <TabsContent value="general">
            <div className="space-y-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-5 w-5 text-emerald-500" />
                    Informations de la plateforme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform-name">Nom de la plateforme</Label>
                      <Input
                        id="platform-name"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform-url">URL</Label>
                      <Input
                        id="platform-url"
                        value={platformUrl}
                        onChange={(e) => setPlatformUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-desc">Description</Label>
                    <Textarea
                      id="platform-desc"
                      placeholder="Décrivez votre plateforme..."
                      value={platformDescription}
                      onChange={(e) => setPlatformDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email de contact</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save */}
              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB: Limites & IA ──────────────────────────────────────────────── */}
          <TabsContent value="limits">
            <div className="space-y-6">
              {/* Limites */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="h-5 w-5 text-emerald-500" />
                    Limites des plans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Plan Gratuit</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="free-max-docs">Documents max</Label>
                        <Input id="free-max-docs" type="number" min={0} value={freeMaxDocs} onChange={(e) => setFreeMaxDocs(Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="free-max-quiz">Quiz max/mois</Label>
                        <Input id="free-max-quiz" type="number" min={0} value={freeMaxQuiz} onChange={(e) => setFreeMaxQuiz(Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="free-max-storage">Stockage max (MB)</Label>
                        <Input id="free-max-storage" type="number" min={0} value={freeMaxStorage} onChange={(e) => setFreeMaxStorage(Number(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Plan Pro</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Documents max</Label>
                        <div className="flex items-center h-9 px-3 rounded-md border bg-gray-50">
                          <span className="text-sm text-gray-600">Illimité</span>
                          <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] border-0">Pro</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Quiz max/mois</Label>
                        <div className="flex items-center h-9 px-3 rounded-md border bg-gray-50">
                          <span className="text-sm text-gray-600">Illimité</span>
                          <Badge className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] border-0">Pro</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* IA */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="h-5 w-5 text-emerald-500" />
                    Intelligence Artificielle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-model">Modèle par défaut</Label>
                      <Select value={defaultModel} onValueChange={setDefaultModel}>
                        <SelectTrigger id="default-model">
                          <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                          <SelectItem value="claude-3.5">Claude 3.5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Température</Label>
                      <Input id="temperature" type="number" min={0} max={2} step={0.1} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} />
                      <p className="text-[11px] text-gray-400">Entre 0 et 2</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max tokens</Label>
                      <Input id="max-tokens" type="number" min={1} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB: Fonctionnalités ────────────────────────────────────────────── */}
          <TabsContent value="features">
            <div className="space-y-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Zap className="h-5 w-5 text-emerald-500" />
                    Fonctionnalités de la plateforme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: 'flashcards-ia', label: 'Flashcards IA', description: "Génération automatique de flashcards par l'IA", checked: flashcardsIA, onChange: setFlashcardsIA },
                    { id: 'coach-ia', label: 'Coach IA', description: "Assistant personnel d'apprentissage intelligent", checked: coachIA, onChange: setCoachIA },
                    { id: 'groupes-etude', label: "Groupes d'étude", description: 'Collaboration et groupes de révision', checked: groupesEtude, onChange: setGroupesEtude },
                    { id: 'pomodoro', label: 'Pomodoro', description: "Minuteur et gestion du temps d'étude", checked: pomodoro, onChange: setPomodoro },
                    { id: 'mode-sombre', label: 'Mode sombre', description: "Thème sombre pour l'interface", checked: modeSombre, onChange: setModeSombre, comingSoon: true },
                  ].map((feature, index) => (
                    <div key={feature.id}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={feature.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                              {feature.label}
                            </Label>
                            {feature.comingSoon && (
                              <Badge className="bg-amber-100 text-amber-700 text-[10px] border-0">Bientôt</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                        </div>
                        <Switch
                          id={feature.id}
                          checked={feature.checked}
                          onCheckedChange={feature.onChange}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB: Sécurité ──────────────────────────────────────────────────── */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Authentification à deux facteurs */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Smartphone className="h-5 w-5 text-emerald-500" />
                    Authentification à deux facteurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <Label htmlFor="2fa-toggle" className="text-sm font-medium text-gray-900 cursor-pointer">
                        2FA obligatoire pour les admins
                      </Label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Exiger une vérification en deux étapes pour tous les comptes administrateurs
                      </p>
                    </div>
                    <Switch
                      id="2fa-toggle"
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                  {twoFactorEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200"
                    >
                      <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                      <p className="text-xs text-emerald-700">
                        La 2FA est maintenant requise pour tous les administrateurs lors de la prochaine connexion.
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Politique de mots de passe */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lock className="h-5 w-5 text-emerald-500" />
                    Politique de mots de passe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-length">Longueur minimale</Label>
                      <Select value={passwordMinLength} onValueChange={setPasswordMinLength}>
                        <SelectTrigger id="min-length">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 caractères</SelectItem>
                          <SelectItem value="8">8 caractères</SelectItem>
                          <SelectItem value="10">10 caractères</SelectItem>
                          <SelectItem value="12">12 caractères</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Expiration de session</Label>
                      <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                        <SelectTrigger id="session-timeout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 heure</SelectItem>
                          <SelectItem value="120">2 heures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Caractère spécial requis</Label>
                        <p className="text-xs text-gray-500 mt-0.5">Au moins un caractère spécial (!@#$...)</p>
                      </div>
                      <Switch checked={requireSpecialChar} onCheckedChange={setRequireSpecialChar} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Chiffre requis</Label>
                        <p className="text-xs text-gray-500 mt-0.5">Au moins un chiffre (0-9)</p>
                      </div>
                      <Switch checked={requireNumber} onCheckedChange={setRequireNumber} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liste blanche IP */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wifi className="h-5 w-5 text-emerald-500" />
                    Liste blanche IP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip-whitelist">Adresses IP autorisées (accès admin)</Label>
                    <Textarea
                      id="ip-whitelist"
                      placeholder="192.168.1.0/24&#10;10.0.0.1&#10;Une IP par ligne"
                      value={ipWhitelist}
                      onChange={(e) => setIpWhitelist(e.target.value)}
                      rows={3}
                      className="font-mono text-sm"
                    />
                    <p className="text-[11px] text-gray-400">
                      Laissez vide pour autoriser toutes les adresses IP. Une adresse par ligne.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sessions actives */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Monitor className="h-5 w-5 text-emerald-500" />
                    Sessions actives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-gray-50/50">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-white border shrink-0">
                          <Monitor className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">{session.device}</p>
                            {session.current && (
                              <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-0 shrink-0">Session actuelle</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {session.location} · {session.ip} · {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shrink-0"
                          onClick={() => {
                            setSessionToRevoke(session.id)
                            setRevokeConfirmOpen(true)
                          }}
                        >
                          Révoquer
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB: Notifications ─────────────────────────────────────────────── */}
          <TabsContent value="notifications">
            <div className="space-y-6">
              {/* Alertes email */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mail className="h-5 w-5 text-emerald-500" />
                    Alertes email
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: 'email-new-user', label: 'Nouvel utilisateur', description: 'Notification lors de chaque nouvelle inscription', checked: emailNewUser, onChange: setEmailNewUser },
                    { id: 'email-new-sub', label: 'Nouvel abonnement', description: 'Notification lors de chaque nouvel abonnement Pro', checked: emailNewSubscription, onChange: setEmailNewSubscription },
                    { id: 'email-support', label: 'Ticket de support', description: 'Notification pour chaque nouveau ticket de support', checked: emailSupportTicket, onChange: setEmailSupportTicket },
                    { id: 'email-weekly', label: 'Rapport hebdomadaire', description: 'Résumé hebdomadaire des statistiques de la plateforme', checked: emailWeeklyReport, onChange: setEmailWeeklyReport },
                    { id: 'email-security', label: 'Alerte de sécurité', description: 'Connexion suspecte, tentative de brute-force, etc.', checked: emailSecurityAlert, onChange: setEmailSecurityAlert },
                  ].map((alert, index) => (
                    <div key={alert.id}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={alert.id} className="text-sm font-medium text-gray-900 cursor-pointer">{alert.label}</Label>
                          <p className="text-xs text-gray-500 mt-0.5">{alert.description}</p>
                        </div>
                        <Switch id={alert.id} checked={alert.checked} onCheckedChange={alert.onChange} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Configuration SMTP */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Server className="h-5 w-5 text-emerald-500" />
                    Serveur SMTP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">Hôte</Label>
                      <Input id="smtp-host" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Port</Label>
                      <Input id="smtp-port" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">Utilisateur</Label>
                    <Input id="smtp-user" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-pass">Mot de passe</Label>
                    <Input id="smtp-pass" type="password" placeholder="••••••••" />
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => toast({ title: 'Email de test envoyé', description: 'Vérifiez votre boîte de réception.' })}
                  >
                    <Mail className="h-4 w-4" />
                    Envoyer un email de test
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-6" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ─── TAB: Journal d'audit ────────────────────────────────────────────── */}
          <TabsContent value="audit">
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Actions aujourd'hui", value: 47, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
              </div>

              {/* Filter Bar */}
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
                    <Button variant="outline" className="gap-2" onClick={() => setExportConfirmOpen(true)}>
                      <Download className="h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Log Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50/80">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Horodatage</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilisateur</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Entité</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">ID Entité</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Détails</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Adresse IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedEntries.map((entry) => {
                          const actionBadge = actionBadgeMap[entry.action]
                          const entityBadgeClass = entityBadgeMap[entry.entity]
                          return (
                            <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900">{entry.timestamp.split(' ').slice(0, 3).join(' ')}</p>
                                  <p className="text-xs text-gray-400">{entry.timestamp.split(' ')[3]}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarFallback className="text-[10px] font-bold text-white bg-gradient-to-br from-emerald-400 to-teal-500">
                                      {entry.userInitials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-gray-900 truncate max-w-[120px]">{entry.userName}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={cn('text-[10px] font-semibold', actionBadge.className)}>{actionBadge.label}</Badge>
                              </td>
                              <td className="py-3 px-4 hidden md:table-cell">
                                <Badge className={cn('text-[10px]', entityBadgeClass)}>{entry.entity}</Badge>
                              </td>
                              <td className="py-3 px-4 hidden lg:table-cell">
                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{entry.entityId}</span>
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell">
                                <p className="text-xs text-gray-600 truncate max-w-[220px]">{entry.details}</p>
                              </td>
                              <td className="py-3 px-4 hidden xl:table-cell">
                                <span className="text-xs font-mono text-gray-400">{entry.ip}</span>
                              </td>
                            </tr>
                          )
                        })}
                        {paginatedEntries.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-12 text-center">
                              <Shield className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                              <p className="text-sm text-gray-500">Aucune entrée trouvée</p>
                              <p className="text-xs text-gray-400 mt-1">Modifiez les filtres pour voir plus de résultats</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                      <p className="text-xs text-gray-500">{filtered.length} entrée(s) trouvée(s)</p>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
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
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ─── TAB: Maintenance ────────────────────────────────────────────────── */}
          <TabsContent value="maintenance">
            <div className="space-y-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings className="h-5 w-5 text-emerald-500" />
                    Mode maintenance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <Label htmlFor="maintenance-mode" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Mode maintenance
                      </Label>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Désactive l&apos;accès à la plateforme pour les utilisateurs
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={maintenanceMode}
                      onCheckedChange={handleMaintenanceToggle}
                    />
                  </div>

                  {maintenanceMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="maintenance-msg">Message personnalisé</Label>
                      <Textarea
                        id="maintenance-msg"
                        placeholder="Nous effectuons une maintenance programmée. Merci de réessayer dans quelques minutes."
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        rows={3}
                      />
                    </motion.div>
                  )}

                  {maintenanceMode && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <p className="text-xs text-amber-700 font-medium">La plateforme est actuellement en mode maintenance</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Trash2 className="h-5 w-5 text-emerald-500" />
                    Gestion du cache
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vider le cache</p>
                      <p className="text-xs text-gray-500 mt-0.5">Supprime le cache des données temporaires</p>
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Vider le cache
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Info */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Server className="h-5 w-5 text-emerald-500" />
                    Informations système
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-500">Version</span>
                      <span className="font-medium text-gray-900">1.0.0</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-500">Environnement</span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">Production</Badge>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-500">Dernier déploiement</span>
                      <span className="font-medium text-gray-900">04 Mar 2026</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-500">Base de données</span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">Connectée</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ─── Dialogs ────────────────────────────────────────────────────────────── */}

      {/* Clear Cache Confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vider le cache</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vider le cache des données temporaires ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleClearCache}>
              Vider le cache
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Maintenance Mode Confirmation */}
      <AlertDialog open={maintenanceConfirmOpen} onOpenChange={(open) => { if (!open) cancelMaintenance() }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activer le mode maintenance</AlertDialogTitle>
            <AlertDialogDescription>
              La plateforme sera inaccessible pour tous les utilisateurs. Seuls les administrateurs pourront y accéder. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelMaintenance}>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-amber-600 hover:bg-amber-700 text-white" onClick={confirmMaintenance}>
              Activer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Confirmation */}
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
            <AlertDialogAction className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleExport}>
              Exporter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke Session Confirmation */}
      <AlertDialog open={revokeConfirmOpen} onOpenChange={setRevokeConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Révoquer la session</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir déconnecter cette session ? L&apos;utilisateur devra se reconnecter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSessionToRevoke(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => sessionToRevoke && handleRevokeSession(sessionToRevoke)}
            >
              Révoquer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
