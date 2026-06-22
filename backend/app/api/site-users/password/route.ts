import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, getPool } from '@/lib/apiHelpers'
import { getSiteUserId, verifyPassword, hashPassword } from '@/lib/siteAuth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/** Redefinição de senha do próprio usuário: { currentPassword, newPassword }. */
export async function POST(req: NextRequest) {
  try {
    const uid = getSiteUserId(req)
    if (!uid) return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: corsHeaders })

    const pool = await getPool()
    if (!pool) return NextResponse.json({ error: 'Indisponível' }, { status: 503, headers: corsHeaders })

    const body = await req.json().catch(() => ({}))
    const currentPassword = String(body.currentPassword || '')
    const newPassword = String(body.newPassword || '')

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter ao menos 6 caracteres.' }, { status: 400, headers: corsHeaders })
    }

    const res = await pool.query('SELECT password FROM site_users WHERE id = $1 LIMIT 1', [uid])
    const row = res.rows[0]
    if (!row) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404, headers: corsHeaders })
    if (!verifyPassword(currentPassword, row.password)) {
      return NextResponse.json({ error: 'Senha atual incorreta.' }, { status: 400, headers: corsHeaders })
    }

    await pool.query('UPDATE site_users SET password = $1 WHERE id = $2', [hashPassword(newPassword), uid])
    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
