import {
  isAdminEmail,
  isSuperAdminEmail,
  normalizeLoginEmail,
  SUPER_ADMIN_EMAIL,
} from '@/lib/auth'
import { getUserMeta } from '@/lib/admin-store'
import {
  adminCreateAccount,
  adminDeleteAccount,
  adminSetAccountActive,
  adminUpdateAccount,
  getAllStoredAccounts,
  type StoredAccount,
} from '@/lib/local-auth'

export interface AdminUserRow {
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
  isSystemAccount: boolean
}

function formatJoinedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatLastActive(iso: string | undefined): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Il y a ${days}j`
  return formatJoinedAt(iso)
}

function resolveRole(account: StoredAccount): AdminUserRow['role'] {
  if (isSuperAdminEmail(account.email)) return 'super-admin'
  if (isAdminEmail(account.email)) return 'admin'
  return account.role
}

function accountToRow(account: StoredAccount): AdminUserRow {
  const meta = getUserMeta(account.email)
  const documents = meta?.documents ?? 0
  const quizzes = meta?.quizzes ?? 0
  const flashcards = meta?.flashcards ?? documents * 8

  return {
    id: account.email,
    name: account.name,
    email: account.email,
    plan: account.plan,
    role: resolveRole(account),
    active: account.active !== false,
    documents,
    flashcards,
    quizzes,
    joinedAt: formatJoinedAt(account.createdAt),
    lastActive: formatLastActive(meta?.lastActiveAt),
    streak: meta?.streak ?? 0,
    score: meta?.score ?? 0,
    isSystemAccount: false,
  }
}

function superAdminRow(): AdminUserRow {
  const meta = getUserMeta(SUPER_ADMIN_EMAIL)
  return {
    id: SUPER_ADMIN_EMAIL,
    name: 'Admin WalanAI',
    email: SUPER_ADMIN_EMAIL,
    plan: 'pro',
    role: 'super-admin',
    active: true,
    documents: meta?.documents ?? 0,
    flashcards: meta?.flashcards ?? 0,
    quizzes: meta?.quizzes ?? 0,
    joinedAt: '1 janv. 2026',
    lastActive: formatLastActive(meta?.lastActiveAt),
    streak: meta?.streak ?? 0,
    score: meta?.score ?? 0,
    isSystemAccount: true,
  }
}

export function listAdminUsers(): AdminUserRow[] {
  const accounts = getAllStoredAccounts()
  const rows = accounts.map(accountToRow)
  return [superAdminRow(), ...rows]
}

export {
  adminCreateAccount,
  adminDeleteAccount,
  adminSetAccountActive,
  adminUpdateAccount,
}
