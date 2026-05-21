export const SUPER_ADMIN_EMAIL = 'barry@walanai.com'
export const SUPER_ADMIN_PASSWORD = 'admin2024'

/** Nettoie l'email saisi (espaces, guillemets, point final accidentel). */
export function normalizeLoginEmail(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/[.,;]+$/g, '')
}

export function isSuperAdminEmail(raw: string): boolean {
  return normalizeLoginEmail(raw) === SUPER_ADMIN_EMAIL
}

export function isAdminEmail(raw: string): boolean {
  const email = normalizeLoginEmail(raw)
  return email.includes('admin') || email === SUPER_ADMIN_EMAIL
}
