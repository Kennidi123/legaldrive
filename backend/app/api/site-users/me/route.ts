import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, getPool } from '@/lib/apiHelpers'
import { getSiteUserId } from '@/lib/siteAuth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/** Dados do usuário logado (sem senha). Exige Authorization: Bearer <token>. */
export async function GET(req: NextRequest) {
  try {
    const uid = getSiteUserId(req)
    if (!uid) return NextResponse.json({ user: null }, { status: 401, headers: corsHeaders })

    const pool = await getPool()
    if (!pool) return NextResponse.json({ user: null }, { status: 503, headers: corsHeaders })

    const res = await pool.query('SELECT id, name, email, whatsapp, created_at FROM site_users WHERE id = $1 LIMIT 1', [uid])
    const user = res.rows[0] || null
    if (!user) return NextResponse.json({ user: null }, { status: 401, headers: corsHeaders })
    return NextResponse.json({ user }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
