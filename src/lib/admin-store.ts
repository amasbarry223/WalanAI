import { readJson, writeJson } from '@/lib/storage'

const ADMIN_KEY = 'walanai-admin'

export interface UserActivityMeta {
  lastActiveAt: string
  documents: number
  flashcards: number
  quizzes: number
  streak: number
  score: number
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  actorEmail: string
  action: string
  entity: string
  details: string
}

export interface AdminPlatformSettings {
  maintenanceMode: boolean
  maintenanceMessage: string
  platformName: string
}

interface AdminPersistedState {
  userMeta: Record<string, UserActivityMeta>
  auditLog: AuditLogEntry[]
  settings: AdminPlatformSettings
}

const DEFAULT_SETTINGS: AdminPlatformSettings = {
  maintenanceMode: false,
  maintenanceMessage:
    'Nous effectuons une maintenance programmée. Merci de réessayer dans quelques minutes.',
  platformName: 'WalanAI',
}

function load(): AdminPersistedState {
  return readJson<AdminPersistedState>(ADMIN_KEY, {
    userMeta: {},
    auditLog: [],
    settings: { ...DEFAULT_SETTINGS },
  })
}

function save(state: AdminPersistedState): void {
  writeJson(ADMIN_KEY, state)
}

export function getAdminSettings(): AdminPlatformSettings {
  return { ...DEFAULT_SETTINGS, ...load().settings }
}

export function updateAdminSettings(
  updates: Partial<AdminPlatformSettings>
): AdminPlatformSettings {
  const state = load()
  state.settings = { ...state.settings, ...updates }
  save(state)
  return state.settings
}

export function isMaintenanceMode(): boolean {
  return load().settings.maintenanceMode === true
}

export function getUserMeta(email: string): UserActivityMeta | null {
  return load().userMeta[email.toLowerCase()] ?? null
}

export function touchUserActivity(
  email: string,
  patch?: Partial<Omit<UserActivityMeta, 'lastActiveAt'>>
): void {
  const key = email.toLowerCase()
  const state = load()
  const existing = state.userMeta[key] ?? {
    lastActiveAt: new Date().toISOString(),
    documents: 0,
    flashcards: 0,
    quizzes: 0,
    streak: 0,
    score: 0,
  }
  state.userMeta[key] = {
    ...existing,
    ...patch,
    lastActiveAt: new Date().toISOString(),
  }
  save(state)
}

export function syncUserUsageFromApp(
  email: string,
  usage: { documents: number; quizzes: number; flashcards?: number }
): void {
  const key = email.toLowerCase()
  const state = load()
  const existing = state.userMeta[key] ?? {
    lastActiveAt: new Date().toISOString(),
    documents: 0,
    flashcards: 0,
    quizzes: 0,
    streak: 0,
    score: 0,
  }
  const flashcards =
    usage.flashcards ??
    existing.flashcards ??
    usage.documents * 8
  const avgScore =
    usage.quizzes > 0
      ? Math.min(100, Math.round(55 + usage.quizzes * 2.5))
      : existing.score
  state.userMeta[key] = {
    ...existing,
    lastActiveAt: new Date().toISOString(),
    documents: usage.documents,
    quizzes: usage.quizzes,
    flashcards,
    score: avgScore,
  }
  save(state)
}

export function removeUserMeta(email: string): void {
  const state = load()
  delete state.userMeta[email.toLowerCase()]
  save(state)
}

export function logAdminAction(entry: {
  actorEmail: string
  action: string
  entity: string
  details: string
}): void {
  const state = load()
  state.auditLog.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  })
  if (state.auditLog.length > 200) {
    state.auditLog = state.auditLog.slice(0, 200)
  }
  save(state)
}

export function getAuditLog(): AuditLogEntry[] {
  return load().auditLog
}
