import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Tabelas do Prisma (schema antigo) que precisam ser removidas antes do Payload criar as suas
const OLD_PRISMA_TABLES = [
  '"User"', '"Post"', '"Video"', '"Tag"', '"Category"',
  '"Author"', '"Media"', '"_PostToTag"', '"_TagToVideo"',
  '"_CategoryToPost"', '"_AuthorToPost"',
]

async function runPush(): Promise<{ status: string; steps: string[]; message?: string; stack?: string }> {
  const steps: string[] = []
  try {
    steps.push('1. Removendo tabelas antigas do Prisma...')
    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    for (const table of OLD_PRISMA_TABLES) {
      await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`)
    }
    await pool.end()
    steps.push('✓ Tabelas antigas removidas')

    steps.push('2. Importando Payload...')
    const { getPayload: _getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const config = configMod.default

    steps.push('3. Inicializando Payload...')
    const payload = await _getPayload({ config })

    steps.push('4. Obtendo adaptador do banco...')
    const db = payload.db as any
    const drizzle = db.drizzle
    const schema = db.schema

    if (!drizzle) throw new Error('drizzle instance not found on payload.db')
    if (!schema) throw new Error('schema not found on payload.db')

    steps.push('5. Importando pushSchema do drizzle-kit...')
    const { pushSchema } = await import('drizzle-kit/api')

    steps.push('6. Calculando diff do schema (banco limpo, sem prompts)...')
    const result = await pushSchema(schema, drizzle)

    steps.push(`7. hasDataLoss: ${result.hasDataLoss}, warnings: ${result.warnings?.length ?? 0}`)
    steps.push('8. Aplicando schema no banco...')
    await result.apply()
    steps.push('✓ Tabelas do Payload criadas com sucesso!')
    return { status: 'ok', steps }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack?.split('\n').slice(0, 8).join('\n') : undefined
    steps.push(`ERRO: ${message}`)
    return { status: 'error', steps, message, stack }
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runPush()
  return NextResponse.json(result, { status: result.status === 'ok' ? 200 : 500 })
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-setup-secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runPush()
  return NextResponse.json(result, { status: result.status === 'ok' ? 200 : 500 })
}
