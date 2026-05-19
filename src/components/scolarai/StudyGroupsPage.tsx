'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Users,
  Clock,
  MessageCircle,
  BookOpen,
  ChevronRight,
  Globe,
  Lock,
  Mail,
  Zap,
  Brain,
  Lightbulb,
  Sparkles,
  Video,
  FileText,
  Calendar,
  X,
  Check,
  Activity,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudyGroup {
  id: string
  name: string
  description: string
  initials: string
  color: string
  gradient: string
  members: number
  onlineCount: number
  subjectTags: string[]
  activityLevel: 'Actif' | 'Modéré' | 'Calme'
  lastActivity: string
  isMember: boolean
  isActive: boolean
  privacy: 'Public' | 'Privé' | 'Sur invitation'
  maxMembers: number
  sharedResources: SharedResource[]
  upcomingSessions: UpcomingSession[]
  chatMessages: ChatMessage[]
  memberList: GroupMember[]
}

interface SharedResource {
  id: string
  name: string
  type: 'document' | 'note' | 'quiz'
  sharedBy: string
  date: string
}

interface UpcomingSession {
  id: string
  title: string
  date: string
  time: string
  participants: number
  type: 'Révision' | 'Quiz collaboratif' | 'Brainstorming'
}

interface ChatMessage {
  id: string
  sender: string
  senderInitials: string
  senderColor: string
  message: string
  time: string
}

interface GroupMember {
  id: string
  name: string
  initials: string
  color: string
  isOnline: boolean
  role: 'Admin' | 'Modérateur' | 'Membre'
}

interface ActiveSession {
  id: string
  groupName: string
  groupInitials: string
  groupColor: string
  subject: string
  participants: number
  maxParticipants: number
  duration: string
  type: 'Révision' | 'Quiz collaboratif' | 'Brainstorming'
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const myGroups: StudyGroup[] = [
  {
    id: 'g1',
    name: 'Maths Supérieure',
    description: 'Groupe de révision pour les maths avancées - préparation aux examens',
    initials: 'MS',
    color: '#10B981',
    gradient: 'from-emerald-500 to-teal-600',
    members: 12,
    onlineCount: 4,
    subjectTags: ['Mathématiques', 'Algèbre', 'Analyse'],
    activityLevel: 'Actif',
    lastActivity: 'Il y a 5 min',
    isMember: true,
    isActive: true,
    privacy: 'Public',
    maxMembers: 20,
    sharedResources: [
      { id: 'r1', name: 'Formules Intégrales.pdf', type: 'document', sharedBy: 'Lucas M.', date: 'Aujourd\'hui' },
      { id: 'r2', name: 'Notes - Séries de Taylor', type: 'note', sharedBy: 'Emma D.', date: 'Hier' },
      { id: 'r3', name: 'Quiz Algèbre Linéaire', type: 'quiz', sharedBy: 'Hugo R.', date: 'Hier' },
    ],
    upcomingSessions: [
      { id: 's1', title: 'Révision Intégrales', date: 'Demain', time: '14:00', participants: 6, type: 'Révision' },
      { id: 's2', title: 'Quiz Développements Limités', date: 'Jeu 20 Mar', time: '16:00', participants: 4, type: 'Quiz collaboratif' },
    ],
    chatMessages: [
      { id: 'c1', sender: 'Lucas M.', senderInitials: 'LM', senderColor: '#10B981', message: 'Quelqu\'un a compris le théorème de convergence dominée ?', time: '14:32' },
      { id: 'c2', sender: 'Emma D.', senderInitials: 'ED', senderColor: '#8B5CF6', message: 'Oui ! Je partage mes notes dans 5 min', time: '14:33' },
      { id: 'c3', sender: 'Hugo R.', senderInitials: 'HR', senderColor: '#F59E0B', message: 'Super, j\'ai aussi trouvé une vidéo explicative', time: '14:34' },
      { id: 'c4', sender: 'Emma D.', senderInitials: 'ED', senderColor: '#8B5CF6', message: 'Voilà, c\'est partagé dans les ressources 👍', time: '14:35' },
      { id: 'c5', sender: 'Lucas M.', senderInitials: 'LM', senderColor: '#10B981', message: 'Merci Emma ! On se voit demain à 14h ?', time: '14:36' },
    ],
    memberList: [
      { id: 'm1', name: 'Lucas Martin', initials: 'LM', color: '#10B981', isOnline: true, role: 'Admin' },
      { id: 'm2', name: 'Emma Dubois', initials: 'ED', color: '#8B5CF6', isOnline: true, role: 'Modérateur' },
      { id: 'm3', name: 'Hugo Richard', initials: 'HR', color: '#F59E0B', isOnline: true, role: 'Membre' },
      { id: 'm4', name: 'Léa Petit', initials: 'LP', color: '#EF4444', isOnline: true, role: 'Membre' },
      { id: 'm5', name: 'Nathan Bernard', initials: 'NB', color: '#3B82F6', isOnline: false, role: 'Membre' },
      { id: 'm6', name: 'Chloé Moreau', initials: 'CM', color: '#EC4899', isOnline: false, role: 'Membre' },
    ],
  },
  {
    id: 'g2',
    name: 'Physique-Chimie L2',
    description: 'Étude collaborative des cours de physique et chimie de niveau L2',
    initials: 'PC',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-purple-600',
    members: 8,
    onlineCount: 2,
    subjectTags: ['Physique', 'Chimie', 'Thermodynamique'],
    activityLevel: 'Modéré',
    lastActivity: 'Il y a 30 min',
    isMember: true,
    isActive: false,
    privacy: 'Public',
    maxMembers: 15,
    sharedResources: [
      { id: 'r4', name: 'TD Thermodynamique.pdf', type: 'document', sharedBy: 'Marie L.', date: 'Hier' },
      { id: 'r5', name: 'Réactions Chimiques - Résumé', type: 'note', sharedBy: 'Tom B.', date: 'Il y a 2 jours' },
    ],
    upcomingSessions: [
      { id: 's3', title: 'Révision Thermodynamique', date: 'Ven 21 Mar', time: '10:00', participants: 5, type: 'Révision' },
    ],
    chatMessages: [
      { id: 'c6', sender: 'Marie L.', senderInitials: 'ML', senderColor: '#6366F1', message: 'Le TD de thermo est disponible', time: '13:00' },
      { id: 'c7', sender: 'Tom B.', senderInitials: 'TB', senderColor: '#EF4444', message: 'Merci ! Je le regarde ce soir', time: '13:15' },
    ],
    memberList: [
      { id: 'm7', name: 'Marie Laurent', initials: 'ML', color: '#6366F1', isOnline: true, role: 'Admin' },
      { id: 'm8', name: 'Thomas Blanc', initials: 'TB', color: '#EF4444', isOnline: true, role: 'Membre' },
      { id: 'm9', name: 'Julie Roux', initials: 'JR', color: '#10B981', isOnline: false, role: 'Membre' },
    ],
  },
  {
    id: 'g3',
    name: 'Anglais B2+',
    description: 'Perfectionnement en anglais - préparation TOEIC et Cambridge',
    initials: 'AB',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600',
    members: 15,
    onlineCount: 5,
    subjectTags: ['Anglais', 'TOEIC', 'Cambridge'],
    activityLevel: 'Actif',
    lastActivity: 'Il y a 2 min',
    isMember: true,
    isActive: true,
    privacy: 'Sur invitation',
    maxMembers: 25,
    sharedResources: [
      { id: 'r6', name: 'Vocabulary List - Unit 7', type: 'document', sharedBy: 'Sarah K.', date: 'Aujourd\'hui' },
      { id: 'r7', name: 'Grammar Notes - Conditionals', type: 'note', sharedBy: 'Pierre V.', date: 'Aujourd\'hui' },
    ],
    upcomingSessions: [
      { id: 's4', title: 'Practice Speaking Session', date: 'Aujourd\'hui', time: '18:00', participants: 8, type: 'Brainstorming' },
      { id: 's5', title: 'Quiz TOEIC Listening', date: 'Sam 22 Mar', time: '09:00', participants: 10, type: 'Quiz collaboratif' },
    ],
    chatMessages: [
      { id: 'c8', sender: 'Sarah K.', senderInitials: 'SK', senderColor: '#F59E0B', message: 'Who wants to practice speaking today at 6pm?', time: '15:20' },
      { id: 'c9', sender: 'Pierre V.', senderInitials: 'PV', senderColor: '#3B82F6', message: 'I\'m in! Let\'s do it! 🙌', time: '15:22' },
      { id: 'c10', sender: 'Sarah K.', senderInitials: 'SK', senderColor: '#F59E0B', message: 'Great! I\'ll prepare some topics', time: '15:23' },
    ],
    memberList: [
      { id: 'm10', name: 'Sarah Klein', initials: 'SK', color: '#F59E0B', isOnline: true, role: 'Admin' },
      { id: 'm11', name: 'Pierre Vidal', initials: 'PV', color: '#3B82F6', isOnline: true, role: 'Modérateur' },
      { id: 'm12', name: 'Claire Dupont', initials: 'CD', color: '#EC4899', isOnline: true, role: 'Membre' },
    ],
  },
  {
    id: 'g4',
    name: 'Droit Constitutionnel',
    description: 'Révisions et discussions sur le droit constitutionnel français',
    initials: 'DC',
    color: '#EF4444',
    gradient: 'from-red-500 to-rose-600',
    members: 6,
    onlineCount: 1,
    subjectTags: ['Droit', 'Constitution', 'Institutions'],
    activityLevel: 'Calme',
    lastActivity: 'Il y a 2h',
    isMember: true,
    isActive: false,
    privacy: 'Privé',
    maxMembers: 10,
    sharedResources: [
      { id: 'r8', name: 'Fiche - Conseil Constitutionnel', type: 'note', sharedBy: 'Alice G.', date: 'Il y a 3 jours' },
    ],
    upcomingSessions: [],
    chatMessages: [
      { id: 'c11', sender: 'Alice G.', senderInitials: 'AG', senderColor: '#EF4444', message: 'N\'oubliez pas le partiel la semaine prochaine !', time: '10:00' },
    ],
    memberList: [
      { id: 'm13', name: 'Alice Garcia', initials: 'AG', color: '#EF4444', isOnline: false, role: 'Admin' },
      { id: 'm14', name: 'Maxime Leroy', initials: 'ML', color: '#10B981', isOnline: true, role: 'Membre' },
    ],
  },
]

const discoverGroups: StudyGroup[] = [
  {
    id: 'd1',
    name: 'Informatique Python',
    description: 'Apprentissage collaboratif de Python - de débutant à avancé. Projets et exercices ensemble.',
    initials: 'IP',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-600',
    members: 24,
    onlineCount: 7,
    subjectTags: ['Informatique', 'Python', 'Programmation'],
    activityLevel: 'Actif',
    lastActivity: 'Il y a 1 min',
    isMember: false,
    isActive: true,
    privacy: 'Public',
    maxMembers: 30,
    sharedResources: [
      { id: 'dr1', name: 'Intro Python - Chapitre 1.pdf', type: 'document', sharedBy: 'Julien T.', date: 'Aujourd\'hui' },
    ],
    upcomingSessions: [
      { id: 'ds1', title: 'Projet Python - Session Code', date: 'Demain', time: '15:00', participants: 10, type: 'Brainstorming' },
    ],
    chatMessages: [
      { id: 'dc1', sender: 'Julien T.', senderInitials: 'JT', senderColor: '#3B82F6', message: 'Nouveau projet : créer un jeu en Pygame !', time: '16:00' },
      { id: 'dc2', sender: 'Lina W.', senderInitials: 'LW', senderColor: '#EC4899', message: 'Trop bien ! Je suis partante 🎮', time: '16:02' },
    ],
    memberList: [
      { id: 'dm1', name: 'Julien Thomas', initials: 'JT', color: '#3B82F6', isOnline: true, role: 'Admin' },
      { id: 'dm2', name: 'Lina Wang', initials: 'LW', color: '#EC4899', isOnline: true, role: 'Modérateur' },
    ],
  },
  {
    id: 'd2',
    name: 'SVT - Biologie Cellulaire',
    description: 'Comprendre la biologie cellulaire avec des schémas et des quiz interactifs.',
    initials: 'BC',
    color: '#14B8A6',
    gradient: 'from-teal-500 to-emerald-600',
    members: 18,
    onlineCount: 3,
    subjectTags: ['SVT', 'Biologie', 'Cellule'],
    activityLevel: 'Modéré',
    lastActivity: 'Il y a 15 min',
    isMember: false,
    isActive: false,
    privacy: 'Public',
    maxMembers: 25,
    sharedResources: [],
    upcomingSessions: [
      { id: 'ds2', title: 'Quiz Mitose & Méiose', date: 'Ven 21 Mar', time: '11:00', participants: 8, type: 'Quiz collaboratif' },
    ],
    chatMessages: [
      { id: 'dc3', sender: 'Camille R.', senderInitials: 'CR', senderColor: '#14B8A6', message: 'Les schémas de mitose sont en ligne !', time: '12:30' },
    ],
    memberList: [
      { id: 'dm3', name: 'Camille Rousseau', initials: 'CR', color: '#14B8A6', isOnline: true, role: 'Admin' },
    ],
  },
  {
    id: 'd3',
    name: 'Philosophie - Dissertations',
    description: 'Entraînement à la dissertation philosophique. Méthodologie et sujets corrigés.',
    initials: 'PD',
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
    members: 11,
    onlineCount: 2,
    subjectTags: ['Philosophie', 'Dissertation', 'Méthodologie'],
    activityLevel: 'Modéré',
    lastActivity: 'Il y a 1h',
    isMember: false,
    isActive: false,
    privacy: 'Public',
    maxMembers: 15,
    sharedResources: [],
    upcomingSessions: [],
    chatMessages: [],
    memberList: [],
  },
  {
    id: 'd4',
    name: 'Économie - Microéconomie',
    description: 'Révisions de microéconomie : offre, demande, équilibre, concurrence.',
    initials: 'EM',
    color: '#F97316',
    gradient: 'from-orange-500 to-red-500',
    members: 9,
    onlineCount: 1,
    subjectTags: ['Économie', 'Microéconomie', 'Marchés'],
    activityLevel: 'Calme',
    lastActivity: 'Il y a 3h',
    isMember: false,
    isActive: false,
    privacy: 'Public',
    maxMembers: 20,
    sharedResources: [],
    upcomingSessions: [],
    chatMessages: [],
    memberList: [],
  },
  {
    id: 'd5',
    name: 'Espagnol B1-B2',
    description: 'Práctica del español - conversations, grammaire et culture hispanique.',
    initials: 'EB',
    color: '#DC2626',
    gradient: 'from-red-600 to-pink-600',
    members: 14,
    onlineCount: 4,
    subjectTags: ['Espagnol', 'Langues', 'Conversation'],
    activityLevel: 'Actif',
    lastActivity: 'Il y a 10 min',
    isMember: false,
    isActive: true,
    privacy: 'Public',
    maxMembers: 20,
    sharedResources: [],
    upcomingSessions: [
      { id: 'ds3', title: 'Conversación en español', date: 'Aujourd\'hui', time: '17:00', participants: 6, type: 'Brainstorming' },
    ],
    chatMessages: [
      { id: 'dc4', sender: 'Ana M.', senderInitials: 'AM', senderColor: '#DC2626', message: '¡Hola a todos! ¿Listos para practicar?', time: '15:50' },
    ],
    memberList: [],
  },
  {
    id: 'd6',
    name: 'Histoire Contemporaine',
    description: 'De la Révolution industrielle à nos jours. Analyses et fiches de révision.',
    initials: 'HC',
    color: '#78716C',
    gradient: 'from-stone-500 to-stone-700',
    members: 7,
    onlineCount: 0,
    subjectTags: ['Histoire', 'Contemporain', 'XXe siècle'],
    activityLevel: 'Calme',
    lastActivity: 'Il y a 1 jour',
    isMember: false,
    isActive: false,
    privacy: 'Public',
    maxMembers: 15,
    sharedResources: [],
    upcomingSessions: [],
    chatMessages: [],
    memberList: [],
  },
  {
    id: 'd7',
    name: 'Stats & Probabilités',
    description: 'Statistiques descriptives, probabilités et tests d\'hypothèses. Cours et exercices.',
    initials: 'SP',
    color: '#0EA5E9',
    gradient: 'from-sky-500 to-blue-600',
    members: 20,
    onlineCount: 6,
    subjectTags: ['Statistiques', 'Probabilités', 'Maths'],
    activityLevel: 'Actif',
    lastActivity: 'Il y a 8 min',
    isMember: false,
    isActive: true,
    privacy: 'Public',
    maxMembers: 30,
    sharedResources: [],
    upcomingSessions: [
      { id: 'ds4', title: 'Quiz Loi Normale', date: 'Demain', time: '10:00', participants: 12, type: 'Quiz collaboratif' },
    ],
    chatMessages: [],
    memberList: [],
  },
  {
    id: 'd8',
    name: 'Médecine - Anat P1',
    description: 'Anatomie P1 : ostéologie, arthrologie, myologie. QCM et fiches partagées.',
    initials: 'AP',
    color: '#059669',
    gradient: 'from-emerald-600 to-green-700',
    members: 32,
    onlineCount: 9,
    subjectTags: ['Médecine', 'Anatomie', 'PACES'],
    activityLevel: 'Actif',
    lastActivity: 'Il y a 3 min',
    isMember: false,
    isActive: true,
    privacy: 'Sur invitation',
    maxMembers: 50,
    sharedResources: [],
    upcomingSessions: [
      { id: 'ds5', title: 'Révision Ostéologie', date: 'Aujourd\'hui', time: '19:00', participants: 15, type: 'Révision' },
    ],
    chatMessages: [],
    memberList: [],
  },
]

const activeSessions: ActiveSession[] = [
  {
    id: 'as1',
    groupName: 'Maths Supérieure',
    groupInitials: 'MS',
    groupColor: '#10B981',
    subject: 'Intégrales & Primitives',
    participants: 4,
    maxParticipants: 8,
    duration: '32 min',
    type: 'Révision',
  },
  {
    id: 'as2',
    groupName: 'Anglais B2+',
    groupInitials: 'AB',
    groupColor: '#F59E0B',
    subject: 'Speaking Practice',
    participants: 5,
    maxParticipants: 10,
    duration: '18 min',
    type: 'Brainstorming',
  },
  {
    id: 'as3',
    groupName: 'Stats & Probabilités',
    groupInitials: 'SP',
    groupColor: '#0EA5E9',
    subject: 'Loi Normale & Tests',
    participants: 6,
    maxParticipants: 12,
    duration: '45 min',
    type: 'Quiz collaboratif',
  },
]

const subjectOptions = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'SVT',
  'Français',
  'Anglais',
  'Espagnol',
  'Histoire',
  'Géographie',
  'Philosophie',
  'Économie',
  'Informatique',
  'Droit',
  'Médecine',
]

const colorOptions = [
  { name: 'Émeraude', value: '#10B981', gradient: 'from-emerald-500 to-teal-600' },
  { name: 'Indigo', value: '#6366F1', gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Ambre', value: '#F59E0B', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Rose', value: '#F43F5E', gradient: 'from-rose-500 to-pink-600' },
  { name: 'Bleu', value: '#3B82F6', gradient: 'from-blue-500 to-cyan-600' },
  { name: 'Violet', value: '#8B5CF6', gradient: 'from-violet-500 to-purple-600' },
  { name: 'Rouge', value: '#EF4444', gradient: 'from-red-500 to-rose-600' },
  { name: 'Cyan', value: '#06B6D4', gradient: 'from-cyan-500 to-sky-600' },
]

// ─── Animation Variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const sidebarVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ─── Helper Components ───────────────────────────────────────────────────────

function ActivityBadge({ level }: { level: StudyGroup['activityLevel'] }) {
  const config = {
    Actif: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Modéré: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    Calme: { bg: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  }
  const c = config[level]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {level}
    </span>
  )
}

function PrivacyIcon({ privacy }: { privacy: StudyGroup['privacy'] }) {
  switch (privacy) {
    case 'Public':
      return <Globe className="h-3.5 w-3.5 text-gray-400" />
    case 'Privé':
      return <Lock className="h-3.5 w-3.5 text-gray-400" />
    case 'Sur invitation':
      return <Mail className="h-3.5 w-3.5 text-gray-400" />
  }
}

function SessionTypeIcon({ type }: { type: ActiveSession['type'] }) {
  switch (type) {
    case 'Révision':
      return <BookOpen className="h-4 w-4" />
    case 'Quiz collaboratif':
      return <Brain className="h-4 w-4" />
    case 'Brainstorming':
      return <Lightbulb className="h-4 w-4" />
  }
}

function ResourceTypeIcon({ type }: { type: SharedResource['type'] }) {
  switch (type) {
    case 'document':
      return <FileText className="h-4 w-4 text-blue-500" />
    case 'note':
      return <BookOpen className="h-4 w-4 text-emerald-500" />
    case 'quiz':
      return <Zap className="h-4 w-4 text-amber-500" />
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StudyGroupsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'my' | 'discover' | 'online'>('my')
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set())
  const [showAllDiscover, setShowAllDiscover] = useState(false)

  // Create group form state
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [newGroupSubject, setNewGroupSubject] = useState('')
  const [newGroupPrivacy, setNewGroupPrivacy] = useState<'Public' | 'Privé' | 'Sur invitation'>('Public')
  const [newGroupMaxMembers, setNewGroupMaxMembers] = useState([20])
  const [newGroupColor, setNewGroupColor] = useState(colorOptions[0])

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroups((prev) => new Set(prev).add(groupId))
  }

  const handleOpenDetail = (group: StudyGroup) => {
    setSelectedGroup(group)
    setDetailOpen(true)
  }

  const handleCreateGroup = () => {
    setCreateOpen(false)
    setNewGroupName('')
    setNewGroupDesc('')
    setNewGroupSubject('')
    setNewGroupPrivacy('Public')
    setNewGroupMaxMembers([20])
    setNewGroupColor(colorOptions[0])
  }

  const filters = [
    { key: 'my' as const, label: 'Mes groupes', count: myGroups.length },
    { key: 'discover' as const, label: 'Découvrir', count: discoverGroups.length },
    { key: 'online' as const, label: 'En ligne maintenant', count: [...myGroups, ...discoverGroups].filter((g) => g.isActive).length },
  ]

  const filteredMyGroups = myGroups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subjectTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredDiscover = discoverGroups
    .filter(
      (g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.subjectTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, showAllDiscover ? undefined : 8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        {/* ─── Header ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Groupes d&apos;Étude
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                Apprenez ensemble, progressez plus vite
              </p>
            </div>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 gap-2">
                  <Plus className="h-4 w-4" />
                  Créer un groupe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                    Créer un groupe d&apos;étude
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Nom du groupe</Label>
                    <Input
                      id="group-name"
                      placeholder="Ex: Maths Supérieure"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-desc">Description</Label>
                    <Textarea
                      id="group-desc"
                      placeholder="Décrivez l'objectif de votre groupe..."
                      value={newGroupDesc}
                      onChange={(e) => setNewGroupDesc(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Matière principale</Label>
                    <Select value={newGroupSubject} onValueChange={setNewGroupSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjectOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Confidentialité</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Public', 'Privé', 'Sur invitation'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewGroupPrivacy(p)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-sm ${
                            newGroupPrivacy === p
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <PrivacyIcon privacy={p} />
                          <span className="font-medium">{p}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre max de membres : {newGroupMaxMembers[0]}</Label>
                    <Slider
                      value={newGroupMaxMembers}
                      onValueChange={setNewGroupMaxMembers}
                      min={5}
                      max={50}
                      step={5}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>5</span>
                      <span>50</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Couleur du groupe</Label>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setNewGroupColor(c)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            newGroupColor.value === c.value
                              ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim()}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Créer le groupe
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un groupe, une matière..."
                className="pl-9 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeFilter === f.key
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeFilter === f.key
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Main Layout ──────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ─── My Groups (Horizontal Scroll) ────────────────────── */}
            <AnimatePresence mode="wait">
              {(activeFilter === 'my' || activeFilter === 'online') && (
                <motion.section
                  key="my-groups"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-500" />
                      Mes Groupes
                    </h2>
                    <span className="text-sm text-gray-400">{filteredMyGroups.length} groupes</span>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex gap-4"
                    >
                      {filteredMyGroups
                        .filter((g) => (activeFilter === 'online' ? g.isActive : true))
                        .map((group) => (
                          <motion.div
                            key={group.id}
                            variants={cardVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="shrink-0 w-[280px] cursor-pointer"
                            onClick={() => handleOpenDetail(group)}
                          >
                            <Card className="border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                  <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 relative"
                                    style={{ backgroundColor: group.color }}
                                  >
                                    {group.initials}
                                    {group.isActive && (
                                      <motion.span
                                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                                      {group.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <PrivacyIcon privacy={group.privacy} />
                                      <span className="text-xs text-gray-400">
                                        {group.members} membres
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex -space-x-1.5">
                                    {group.memberList.slice(0, 3).map((m) => (
                                      <Avatar key={m.id} className="h-6 w-6 border-2 border-white">
                                        <AvatarFallback
                                          className="text-[8px] font-bold text-white"
                                          style={{ backgroundColor: m.color }}
                                        >
                                          {m.initials}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {group.members > 3 && (
                                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 border-2 border-white text-[8px] font-medium text-gray-500">
                                        +{group.members - 3}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-emerald-600 ml-auto">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    {group.onlineCount} en ligne
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {group.subjectTags.slice(0, 2).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {group.lastActivity}
                                  </span>
                                  <ActivityBadge level={group.activityLevel} />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      {filteredMyGroups.filter((g) => (activeFilter === 'online' ? g.isActive : true)).length === 0 && (
                        <div className="flex items-center justify-center w-[280px] h-[200px] rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
                          Aucun groupe en ligne
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ─── Discover Groups Grid ─────────────────────────────── */}
            <AnimatePresence mode="wait">
              {(activeFilter === 'discover' || activeFilter === 'online') && (
                <motion.section
                  key="discover"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-500" />
                      Découvrir des Groupes
                    </h2>
                    <span className="text-sm text-gray-400">
                      {discoverGroups.length} groupes disponibles
                    </span>
                  </div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {filteredDiscover
                      .filter((g) => (activeFilter === 'online' ? g.isActive : true))
                      .map((group) => {
                        const isJoined = joinedGroups.has(group.id) || group.isMember
                        return (
                          <motion.div
                            key={group.id}
                            variants={cardVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="cursor-pointer"
                            onClick={() => handleOpenDetail(group)}
                          >
                            <Card className="border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden">
                              {/* Cover Gradient */}
                              <div
                                className={`h-20 bg-gradient-to-r ${group.gradient} relative overflow-hidden`}
                              >
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute bottom-2 right-3 text-white/80 text-xs flex items-center gap-1">
                                  <PrivacyIcon privacy={group.privacy} />
                                </div>
                                <div className="absolute top-2 right-3">
                                  <ActivityBadge level={group.activityLevel} />
                                </div>
                                {group.isActive && (
                                  <div className="absolute top-2 left-3">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-emerald-700 text-xs font-medium">
                                      <motion.span
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                      />
                                      En ligne
                                    </span>
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-2">
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 -mt-7 border-2 border-white shadow-sm"
                                    style={{ backgroundColor: group.color }}
                                  >
                                    {group.initials}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                                      {group.name}
                                    </h3>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                                  {group.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {group.subjectTags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {group.members}
                                    </span>
                                    <span className="flex items-center gap-1 text-emerald-600">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      {group.onlineCount} en ligne
                                    </span>
                                  </div>
                                  <motion.div whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      className={
                                        isJoined
                                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (!isJoined) handleJoinGroup(group.id)
                                      }}
                                    >
                                      {isJoined ? (
                                        <>
                                          <Check className="h-3.5 w-3.5 mr-1" />
                                          Rejoint
                                        </>
                                      ) : (
                                        'Rejoindre'
                                      )}
                                    </Button>
                                  </motion.div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                  </motion.div>
                  {!showAllDiscover && discoverGroups.length > 6 && activeFilter === 'discover' && (
                    <div className="flex justify-center mt-6">
                      <Button
                        variant="outline"
                        className="gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => setShowAllDiscover(true)}
                      >
                        Voir plus de groupes
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Active Sessions Sidebar ────────────────────────────── */}
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-[320px] shrink-0"
          >
            <Card className="border border-gray-100 shadow-sm sticky top-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
                    <Video className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Sessions en direct</h3>
                    <p className="text-xs text-gray-400">{activeSessions.length} en cours</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ x: 2 }}
                      className="rounded-xl border border-gray-100 hover:border-emerald-200 p-3 transition-all duration-200"
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: session.groupColor }}
                        >
                          {session.groupInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 text-xs truncate">
                            {session.groupName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{session.subject}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-red-500"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          LIVE
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 text-[10px] font-medium">
                          <SessionTypeIcon type={session.type} />
                          {session.type}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Users className="h-3 w-3" />
                          {session.participants}/{session.maxParticipants}
                        </div>
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-white gap-1"
                        >
                          Rejoindre
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">
                    Planifiez votre prochaine session
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 gap-1"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Créer une session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </div>

      {/* ─── Group Detail Dialog ─────────────────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          {selectedGroup && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0 bg-gradient-to-r ${selectedGroup.gradient}`}
                  >
                    {selectedGroup.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <DialogTitle className="text-lg">{selectedGroup.name}</DialogTitle>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {selectedGroup.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {selectedGroup.members} membres
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {selectedGroup.onlineCount} en ligne
                      </span>
                      <span className="flex items-center gap-1">
                        <PrivacyIcon privacy={selectedGroup.privacy} />
                        {selectedGroup.privacy}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setDetailOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-5 py-2">
                  {/* Session en cours indicator */}
                  {selectedGroup.isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-3 text-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="w-2 h-2 rounded-full bg-white"
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="font-semibold text-sm">Session en cours</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                          Rejoindre
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Members */}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-emerald-500" />
                      Membres ({selectedGroup.memberList.length > 0 ? selectedGroup.memberList.length : selectedGroup.members})
                    </h4>
                    <div className="space-y-1.5">
                      {selectedGroup.memberList.length > 0
                        ? selectedGroup.memberList.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback
                                    className="text-xs font-bold text-white"
                                    style={{ backgroundColor: member.color }}
                                  >
                                    {member.initials}
                                  </AvatarFallback>
                                </Avatar>
                                {member.isOnline && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {member.name}
                                </p>
                                <p className="text-xs text-gray-400">{member.role}</p>
                              </div>
                              {member.isOnline && (
                                <span className="text-xs text-emerald-600 font-medium">En ligne</span>
                              )}
                            </div>
                          ))
                        : (
                          <div className="flex -space-x-2">
                            {Array.from({ length: Math.min(selectedGroup.members, 5) }).map((_, i) => (
                              <Avatar key={i} className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="text-xs font-bold text-white" style={{ backgroundColor: colorOptions[i % colorOptions.length].value }}>
                                  {String.fromCharCode(65 + i)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {selectedGroup.members > 5 && (
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium text-gray-500">
                                +{selectedGroup.members - 5}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  <Separator />

                  {/* Shared Resources */}
                  {selectedGroup.sharedResources.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-500" />
                        Ressources partagées
                      </h4>
                      <div className="space-y-1.5">
                        {selectedGroup.sharedResources.map((res) => (
                          <div
                            key={res.id}
                            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <ResourceTypeIcon type={res.type} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{res.name}</p>
                              <p className="text-xs text-gray-400">
                                {res.sharedBy} · {res.date}
                              </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-gray-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Sessions */}
                  {selectedGroup.upcomingSessions.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                          Prochaines sessions
                        </h4>
                        <div className="space-y-2">
                          {selectedGroup.upcomingSessions.map((session) => (
                            <div
                              key={session.id}
                              className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 hover:border-emerald-200 transition-colors"
                            >
                              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50">
                                <SessionTypeIcon type={session.type as ActiveSession['type']} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{session.title}</p>
                                <p className="text-xs text-gray-400">
                                  {session.date} à {session.time} · {session.participants} participants
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-[10px] shrink-0">
                                {session.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Chat Preview */}
                  {selectedGroup.chatMessages.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-emerald-500" />
                          Derniers messages
                        </h4>
                        <div className="space-y-2.5">
                          {selectedGroup.chatMessages.slice(-5).map((msg) => (
                            <div key={msg.id} className="flex items-start gap-2">
                              <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                                <AvatarFallback
                                  className="text-[8px] font-bold text-white"
                                  style={{ backgroundColor: msg.senderColor }}
                                >
                                  {msg.senderInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs font-semibold text-gray-900">
                                    {msg.sender}
                                  </span>
                                  <span className="text-[10px] text-gray-300">{msg.time}</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {msg.message}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-emerald-600 hover:bg-emerald-50 gap-1"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Ouvrir le chat
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
