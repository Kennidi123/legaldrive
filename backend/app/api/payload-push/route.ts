import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const OLD_TABLES = [
  '"User"', '"Post"', '"Video"', '"Tag"', '"Category"',
  '"Author"', '"Media"', '"_PostToTag"', '"_TagToVideo"',
  '"_CategoryToPost"', '"_AuthorToPost"',
]

async function runPush() {
  const steps: string[] = []
  try {
    steps.push('1. Removendo tabelas antigas...')
    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    for (const t of OLD_TABLES) {
      await pool.query(`DROP TABLE IF EXISTS ${t} CASCADE`)
    }
    await pool.end()
    steps.push('✓ Tabelas antigas removidas')

    steps.push('2. Inicializando Payload...')
    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    steps.push('3. Aplicando schema...')
    const db = payload.db as any
    const { pushSchema } = await import('drizzle-kit/api')
    const result = await pushSchema(db.schema, db.drizzle)
    await result.apply()

    steps.push('✓ Tabelas do Payload criadas!')
    return { status: 'ok', steps }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    steps.push(`ERRO: ${message}`)
    return { status: 'error', steps, message }
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
