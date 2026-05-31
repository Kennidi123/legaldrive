import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-setup-secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, password, name } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'email e password sao obrigatorios' }, { status: 400 })
    }

    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    const existing = await payload.find({ collection: 'users', limit: 1 })
    if (existing.totalDocs > 0) {
      return NextResponse.json({ error: 'Ja existe um usuario admin. Use /admin para login.' }, { status: 400 })
    }

    const user = await payload.create({
      collection: 'users',
      data: { email, password, name: name || 'Admin' },
    })

    return NextResponse.json({ status: 'ok', message: 'Usuario criado! Acesse /admin para entrar.', email: user.email })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ status: 'error', message }, { status: 500 })
  }
}
