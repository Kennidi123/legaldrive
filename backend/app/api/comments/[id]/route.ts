import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL || '*'
const corsHeaders = {
  'Access-Control-Allow-Origin': FRONTEND,
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/**
 * Exclui um comentário. SOMENTE ADMIN — exige usuário autenticado do Payload
 * (o painel envia `Authorization: JWT <token>`). Sem usuário válido → 401.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numId = Number(id)
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400, headers: corsHeaders })
    }

    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    // Autenticação: valida o JWT do admin enviado pelo painel.
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: corsHeaders })
    }

    const db = payload.db as unknown as {
      pool?: { query: (sql: string, values?: unknown[]) => Promise<{ rowCount: number }> }
    }
    if (db.pool?.query) {
      await db.pool.query('DELETE FROM comments WHERE id = $1', [numId])
    }

    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
