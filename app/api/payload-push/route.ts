import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-setup-secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const steps: string[] = []

  try {
    steps.push('1. Importando Payload...')
    const { getPayload: _getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const config = configMod.default

    steps.push('2. Inicializando Payload...')
    const payload = await _getPayload({ config })

    steps.push('3. Obtendo adaptador do banco...')
    const db = payload.db as any
    const drizzle = db.drizzle
    const schema = db.schema

    if (!drizzle) throw new Error('drizzle instance not found on payload.db')
    if (!schema) throw new Error('schema not found on payload.db')

    steps.push('4. Importando pushSchema do drizzle-kit...')
    const { pushSchema } = await import('drizzle-kit/api')

    steps.push('5. Calculando diff do schema...')
    const result = await pushSchema(schema, drizzle)

    steps.push(`6. hasDataLoss: ${result.hasDataLoss}, warnings: ${result.warnings?.length ?? 0}`)

    steps.push('7. Aplicando schema no banco...')
    await result.apply()

    steps.push('✓ Tabelas criadas com sucesso!')

    return NextResponse.json({ status: 'ok', steps })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack?.split('\n').slice(0, 8).join('\n') : undefined
    steps.push(`ERRO: ${message}`)
    return NextResponse.json({ status: 'error', message, steps, stack }, { status: 500 })
  }
}
