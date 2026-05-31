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
    steps.push('1. Limpando tabelas antigas...')
    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    for (const t of OLD_TABLES) await pool.query(`DROP TABLE IF EXISTS ${t} CASCADE`)
    await pool.end()
    steps.push('✓ Limpeza concluída')

    steps.push('2. Importando Payload...')
    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    steps.push('3. Obtendo schema...')
    const db = payload.db as any
    if (!db.drizzle) throw new Error('drizzle not found')
    if (!db.schema) throw new Error('schema not found')

    steps.push('4. Importando pushSchema...')
    const { pushSchema } = await import('drizzle-kit/api')

    steps.push('5. Calculando diff...')
    const result = await pushSchema(db.schema, db.drizzle)
    steps.push(`6. hasDataLoss: ${result.hasDataLoss}, warnings: ${result.warnings?.length ?? 0}`)

    steps.push('7. Aplicando...')
    await result.apply()
    steps.push('✓ Tabelas criadas com sucesso!')
    return { status: 'ok', steps }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    steps.push(`ERRO: ${message}`)
    return { status: 'error', steps, message }
  }
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('secret') !== process.env.SETUP_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = await runPush()
  return NextResponse.json(result, { status: result.status === 'ok' ? 200 : 500 })
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-setup-secret') !== process.env.SETUP_SECRET)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = await runPush()
  return NextResponse.json(result, { status: result.status === 'ok' ? 200 : 500 })
}
