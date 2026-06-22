const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL || '*'

/** Cabeçalhos CORS para as rotas customizadas (frontend → API). */
export const corsHeaders = {
  'Access-Control-Allow-Origin': FRONTEND,
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export type Pool = {
  query: (sql: string, values?: unknown[]) => Promise<{ rows: any[]; rowCount?: number }>
}

/** Pool do Postgres do Payload (para SQL direto, como nas rotas de comentários). */
export async function getPool(): Promise<Pool | null> {
  const { getPayload } = await import('payload')
  const configMod = await import('@payload-config')
  const payload = await getPayload({ config: configMod.default })
  const db = payload.db as unknown as { pool?: Pool }
  return db.pool ?? null
}

/** Instância do Payload (para validar JWT do admin via payload.auth). */
export async function getPayloadInstance() {
  const { getPayload } = await import('payload')
  const configMod = await import('@payload-config')
  return getPayload({ config: configMod.default })
}
