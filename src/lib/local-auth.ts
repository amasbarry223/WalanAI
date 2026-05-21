import {
  isAdminEmail,
  isSuperAdminEmail,
  normalizeLoginEmail,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD,
} from '@/lib/auth'
import { logAdminAction, removeUserMeta } from '@/lib/admin-store'
import { readJson, writeJson, writeSession } from '@/lib/storage'
import type { User } from '@/lib/store'

const USERS_KEY = 'walanai-accounts'

export interface StoredAccount {
  name: string
  email: string
  password: string
  plan: 'gratuit' | 'pro'
  role: 'etudiant' | 'admin' | 'super-admin'
  active?: boolean
  onboardingCompleted: boolean
  createdAt: string
}

function getAccounts(): StoredAccount[] {
  return readJson<StoredAccount[]>(USERS_KEY, [])
}

function saveAccounts(accounts: StoredAccount[]): void {
  writeJson(USERS_KEY, accounts)
}

export function getAllStoredAccounts(): StoredAccount[] {
  return getAccounts().map((a) => ({
    ...a,
    active: a.active !== false,
  }))
}

function withActive(account: StoredAccount): StoredAccount {
  return { ...account, active: account.active !== false }
}

export function accountExists(email: string): boolean {
  const normalized = normalizeLoginEmail(email)
  if (isSuperAdminEmail(email)) return true
  return getAccounts().some((a) => a.email === normalized)
}

export function registerAccount(input: {
  name: string
  email: string
  password: string
}): { ok: true } | { ok: false; error: string } {
  const email = normalizeLoginEmail(input.email)
  if (isSuperAdminEmail(email)) {
    return { ok: false, error: 'Cet email est réservé.' }
  }
  if (getAccounts().some((a) => a.email === email)) {
    return { ok: false, error: 'Un compte existe déjà avec cet email.' }
  }

  const accounts = getAccounts()
  accounts.push({
    name: input.name.trim(),
    email,
    password: input.password,
    plan: 'gratuit',
    role: 'etudiant',
    active: true,
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
  })
  saveAccounts(accounts)
  return { ok: true }
}

export function authenticateUser(
  email: string,
  password: string
): { ok: true; user: User; onboardingCompleted: boolean } | { ok: false; error: string } {
  const normalized = normalizeLoginEmail(email)

  if (isSuperAdminEmail(normalized)) {
    if (password !== SUPER_ADMIN_PASSWORD) {
      return { ok: false, error: 'Identifiants invalides.' }
    }
    return {
      ok: true,
      onboardingCompleted: true,
      user: {
        name: 'Admin WalanAI',
        email: SUPER_ADMIN_EMAIL,
        plan: 'pro',
        role: 'super-admin',
      },
    }
  }

  const account = getAccounts().find((a) => a.email === normalized)
  if (!account) {
    return { ok: false, error: 'Aucun compte trouvé. Créez un compte d\'abord.' }
  }

  if (account.active === false) {
    return { ok: false, error: 'Ce compte est suspendu. Contactez le support.' }
  }

  if (account.password !== password) {
    return { ok: false, error: 'Mot de passe incorrect.' }
  }

  const isAdmin = isAdminEmail(normalized)
  return {
    ok: true,
    onboardingCompleted: account.onboardingCompleted,
    user: {
      name: account.name,
      email: account.email,
      plan: account.plan,
      role: isAdmin ? 'admin' : account.role,
    },
  }
}

export function issuePasswordResetCode(email: string): { ok: true; code: string } | { ok: false; error: string } {
  const normalized = normalizeLoginEmail(email)
  if (isSuperAdminEmail(normalized)) {
    return { ok: false, error: 'Réinitialisation non disponible pour ce compte admin.' }
  }
  if (!getAccounts().some((a) => a.email === normalized)) {
    return { ok: false, error: 'Aucun compte associé à cet email.' }
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  writeSession(`walanai-reset:${normalized}`, { code, expiresAt: Date.now() + 15 * 60 * 1000 })
  return { ok: true, code }
}

export function verifyPasswordResetCode(email: string, code: string): boolean {
  const normalized = normalizeLoginEmail(email)
  const stored = readSession<{ code: string; expiresAt: number } | null>(
    `walanai-reset:${normalized}`,
    null
  )
  if (!stored) return false
  if (Date.now() > stored.expiresAt) return false
  return stored.code === code
}

export function resetAccountPassword(
  email: string,
  newPassword: string
): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeLoginEmail(email)
  const accounts = getAccounts()
  const index = accounts.findIndex((a) => a.email === normalized)
  if (index === -1) {
    return { ok: false, error: 'Compte introuvable.' }
  }
  accounts[index] = { ...accounts[index], password: newPassword }
  saveAccounts(accounts)
  return { ok: true }
}

export function markOnboardingCompleted(email: string): void {
  const normalized = normalizeLoginEmail(email)
  const accounts = getAccounts()
  const index = accounts.findIndex((a) => a.email === normalized)
  if (index === -1) return
  accounts[index] = { ...accounts[index], onboardingCompleted: true }
  saveAccounts(accounts)
}

export function updateAccountProfile(
  email: string,
  updates: { name?: string; plan?: 'gratuit' | 'pro' }
): void {
  const normalized = normalizeLoginEmail(email)
  const accounts = getAccounts()
  const index = accounts.findIndex((a) => a.email === normalized)
  if (index === -1) return
  accounts[index] = { ...accounts[index], ...updates }
  saveAccounts(accounts)
}

export function deleteAccount(email: string): void {
  const normalized = normalizeLoginEmail(email)
  saveAccounts(getAccounts().filter((a) => a.email !== normalized))
  removeUserMeta(normalized)
}

export function adminCreateAccount(input: {
  name: string
  email: string
  password: string
  plan: 'gratuit' | 'pro'
  role: 'etudiant' | 'admin'
  actorEmail: string
}): { ok: true } | { ok: false; error: string } {
  const email = normalizeLoginEmail(input.email)
  if (isSuperAdminEmail(email)) {
    return { ok: false, error: 'Cet email est réservé au super-admin.' }
  }
  if (getAccounts().some((a) => a.email === email)) {
    return { ok: false, error: 'Un compte existe déjà avec cet email.' }
  }
  if (input.password.length < 6) {
    return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
  }

  const accounts = getAccounts()
  accounts.push({
    name: input.name.trim(),
    email,
    password: input.password,
    plan: input.plan,
    role: input.role,
    active: true,
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
  })
  saveAccounts(accounts)
  logAdminAction({
    actorEmail: input.actorEmail,
    action: 'create',
    entity: 'user',
    details: `Compte créé : ${email}`,
  })
  return { ok: true }
}

export function adminUpdateAccount(
  email: string,
  updates: {
    name?: string
    plan?: 'gratuit' | 'pro'
    role?: 'etudiant' | 'admin'
    active?: boolean
    password?: string
    actorEmail: string
  }
): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeLoginEmail(email)
  if (isSuperAdminEmail(normalized)) {
    return { ok: false, error: 'Le compte super-admin ne peut pas être modifié ici.' }
  }

  const accounts = getAccounts()
  const index = accounts.findIndex((a) => a.email === normalized)
  if (index === -1) {
    return { ok: false, error: 'Compte introuvable.' }
  }

  const { actorEmail, password, role, ...rest } = updates
  const next: StoredAccount = withActive({
    ...accounts[index],
    ...rest,
    ...(role !== undefined ? { role } : {}),
    ...(password && password.length >= 6 ? { password } : {}),
  })

  if (password && password.length > 0 && password.length < 6) {
    return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
  }

  accounts[index] = next
  saveAccounts(accounts)
  logAdminAction({
    actorEmail,
    action: 'update',
    entity: 'user',
    details: `Compte mis à jour : ${normalized}`,
  })
  return { ok: true }
}

export function adminSetAccountActive(
  email: string,
  active: boolean,
  actorEmail: string
): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeLoginEmail(email)
  if (isSuperAdminEmail(normalized)) {
    return { ok: false, error: 'Impossible de suspendre le super-admin.' }
  }
  const accounts = getAccounts()
  const index = accounts.findIndex((a) => a.email === normalized)
  if (index === -1) {
    return { ok: false, error: 'Compte introuvable.' }
  }
  accounts[index] = { ...accounts[index], active }
  saveAccounts(accounts)
  logAdminAction({
    actorEmail,
    action: active ? 'activate' : 'suspend',
    entity: 'user',
    details: `${normalized} — ${active ? 'réactivé' : 'suspendu'}`,
  })
  return { ok: true }
}

export function adminDeleteAccount(
  email: string,
  actorEmail: string
): { ok: true } | { ok: false; error: string } {
  const normalized = normalizeLoginEmail(email)
  if (isSuperAdminEmail(normalized)) {
    return { ok: false, error: 'Impossible de supprimer le super-admin.' }
  }
  if (!getAccounts().some((a) => a.email === normalized)) {
    return { ok: false, error: 'Compte introuvable.' }
  }
  deleteAccount(normalized)
  logAdminAction({
    actorEmail,
    action: 'delete',
    entity: 'user',
    details: `Compte supprimé : ${normalized}`,
  })
  return { ok: true }
}
