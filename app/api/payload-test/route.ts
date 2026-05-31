import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-setup-secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { getPayload: _getPayload } = await import('payload')
    const config = await import('@payload-config')
    const payload = await _getPayload({ config: config.default })
    const users = await payload.find({ collection: 'users', limit: 1 })
    return NextResponse.json({
      status: 'ok',
      message: 'Payload initialized successfully',
      userCount: users.totalDocs,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[payload-test]', err)
    return NextResponse.json({ status: 'error', message, stack }, { status: 500 })
  }
}
