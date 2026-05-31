import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-setup-secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const steps: string[] = []

  try {
    steps.push('Importing payload...')
    const { getPayload: _getPayload } = await import('payload')
    const config = await import('@payload-config')

    steps.push('Initializing Payload...')
    const payload = await _getPayload({ config: config.default })

    steps.push('Creating migration...')
    const db = payload.db as any

    try {
      await db.createMigration({
        file: undefined,
        forceAcceptWarning: true,
        migrationName: 'init',
        payload,
      })
      steps.push('Migration file created.')
    } catch (createErr) {
      steps.push(`createMigration warning: ${createErr instanceof Error ? createErr.message : String(createErr)}`)
    }

    steps.push('Running migrate...')
    await db.migrate({ payload })
    steps.push('Migration applied successfully!')

    return NextResponse.json({ status: 'ok', steps })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    return NextResponse.json({ status: 'error', message, steps, stack }, { status: 500 })
  }
}
