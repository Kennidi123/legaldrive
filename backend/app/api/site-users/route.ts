import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, getPool, getPayloadInstance } from '@/lib/apiHelpers'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/**
 * Lista os usuários cadastrados no site. SOMENTE ADMIN (JWT do Payload).
 * Nunca retorna a senha — apenas nome, e-mail, whatsapp e data.
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayloadInstance()
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: corsHeaders })

    const pool = await getPool()
    if (!pool) return NextResponse.json({ docs: [] }, { headers: corsHeaders })

    const res = await pool.query(
      `SELECT u.id, u.name, u.email, u.whatsapp, u.created_at,
              (SELECT COUNT(*) FROM comments c WHERE c.user_id = u.id)::int AS comment_count
         FROM site_users u
        ORDER BY u.created_at DESC
        LIMIT 1000`,
    )
    return NextResponse.json({ docs: res.rows }, { headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
