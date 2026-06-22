import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, getPool, getPayloadInstance } from '@/lib/apiHelpers'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/** Exclui um usuário do site. SOMENTE ADMIN (JWT do Payload). */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numId = Number(id)
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400, headers: corsHeaders })
    }

    const payload = await getPayloadInstance()
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: corsHeaders })

    const pool = await getPool()
    if (pool) {
      // Mantém os comentários, apenas desvincula o autor
      await pool.query('UPDATE comments SET user_id = NULL WHERE user_id = $1', [numId])
      await pool.query('DELETE FROM site_users WHERE id = $1', [numId])
    }
    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
