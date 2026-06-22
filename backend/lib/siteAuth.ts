import crypto from 'crypto'

/**
 * Autenticação dos USUÁRIOS DO SITE (leitores que comentam) — independente do
 * Payload. Senha em hash scrypt; sessão via token assinado com HMAC (PAYLOAD_SECRET).
 * Sem dependências externas (apenas o módulo `crypto` do Node).
 */

const SECRET = process.env.PAYLOAD_SECRET || 'legaldrive-change-this-secret'
const TOKEN_TTL = 60 * 60 * 24 * 30 // 30 dias (em segundos)

/** Gera `salt:hash` (hex) para guardar no banco. */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

/** Confere a senha contra o `salt:hash` armazenado (comparação em tempo constante). */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = (stored || '').split(':')
  if (!salt || !hash) return false
  const hashBuf = Buffer.from(hash, 'hex')
  const testBuf = crypto.scryptSync(password, salt, 64)
  return hashBuf.length === testBuf.length && crypto.timingSafeEqual(hashBuf, testBuf)
}

/** Cria um token de sessão assinado (payload base64url + assinatura HMAC). */
export function signToken(uid: number): string {
  const payload = Buffer.from(JSON.stringify({ uid, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL })).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

/** Valida o token e devolve o id do usuário, ou null se inválido/expirado. */
export function verifyToken(token: string | null | undefined): number | null {
  if (!token || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url')
  if (!sig || sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof data.uid !== 'number') return null
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null
    return data.uid
  } catch {
    return null
  }
}

/** Lê o token do header `Authorization: Bearer <token>`. */
export function getBearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer\s+(.+)$/i)
  return m ? m[1] : null
}

/** Atalho: id do usuário do site autenticado na requisição (ou null). */
export function getSiteUserId(req: Request): number | null {
  return verifyToken(getBearerToken(req))
}

/** Validação simples de e-mail. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
