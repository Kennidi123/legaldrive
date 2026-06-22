// Auth dos USUÁRIOS DO SITE (leitores). Cliente: guarda token + usuário no
// localStorage e fala com a API do backend via Authorization: Bearer <token>.

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')
const TOKEN_KEY = 'ld:site-token'
const USER_KEY = 'ld:site-user'

export interface SiteUser {
  id: number
  name: string
  email: string
  whatsapp?: string | null
  created_at?: string
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): SiteUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as SiteUser) : null
  } catch {
    return null
  }
}

function store(token: string, user: SiteUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function authHeader(): Record<string, string> {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

/* ---------- Validação / máscara ---------- */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim())
}

export function onlyDigits(value: string): string {
  return (value || '').replace(/\D/g, '')
}

/** Aplica a máscara de celular brasileiro: (11) 99999-9999. */
export function formatWhatsapp(value: string): string {
  let d = onlyDigits(value)
  if (d.startsWith('55') && d.length > 11) d = d.slice(2) // remove DDI (+55) colado
  d = d.slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
}

/** Celular válido = DDD + 9 dígitos (11 no total). */
export function isValidWhatsapp(value: string): boolean {
  return onlyDigits(value).length === 11
}

export async function registerUser(data: {
  name: string
  email: string
  whatsapp: string
  password: string
}): Promise<{ user?: SiteUser; error?: string }> {
  try {
    const res = await fetch(`${BACKEND}/api/site-users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { error: json.error || 'Não foi possível cadastrar.' }
    store(json.token, json.user)
    return { user: json.user }
  } catch {
    return { error: 'Erro de conexão.' }
  }
}

export async function loginUser(data: { email: string; password: string }): Promise<{ user?: SiteUser; error?: string }> {
  try {
    const res = await fetch(`${BACKEND}/api/site-users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { error: json.error || 'E-mail ou senha incorretos.' }
    store(json.token, json.user)
    return { user: json.user }
  } catch {
    return { error: 'Erro de conexão.' }
  }
}

/** Valida a sessão no backend. Retorna o usuário, ou null se o token for inválido (401). Lança em erro de rede. */
export async function fetchMe(): Promise<SiteUser | null> {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${BACKEND}/api/site-users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const json = await res.json().catch(() => ({}))
  return (json.user as SiteUser) || null
}

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}): Promise<{ success?: true; error?: string }> {
  const token = getToken()
  if (!token) return { error: 'Sessão expirada. Entre novamente.' }
  try {
    const res = await fetch(`${BACKEND}/api/site-users/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) return { error: json.error || 'Não foi possível alterar a senha.' }
    return { success: true }
  } catch {
    return { error: 'Erro de conexão.' }
  }
}
