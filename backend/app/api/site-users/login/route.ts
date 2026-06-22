import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, getPool } from '@/lib/apiHelpers'
import { verifyPassword, signToken } from '@/lib/siteAuth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/** Login do usuário do site: { email, password }. */
export async function POST(req: NextRequest) {
  try {
    const pool = await getPool()
    if (!pool) return NextResponse.json({ error: 'Indisponível' }, { status: 503, headers: corsHeaders })

    const body = await req.json().catch(() => ({}))
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    const res = await pool.query(
      'SELECT id, name, email, whatsapp, password, created_at FROM site_users WHERE lower(email) = lower($1) LIMIT 1',
      [email],
    )
    const row = res.rows[0]
    if (!row || !verifyPassword(password, row.password)) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401, headers: corsHeaders })
    }

    const { password: _pw, ...user } = row
    return NextResponse.json({ token: signToken(row.id), user }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
