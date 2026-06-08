import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL || '*'
const corsHeaders = {
  'Access-Control-Allow-Origin': FRONTEND,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

/**
 * Incrementa o contador de visualizações de uma notícia.
 * Operação NÃO destrutiva (apenas `views = views + 1`), por isso é pública.
 * Atômica no banco (sem condição de corrida) e não altera `updated_at`.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const numId = Number(id)
    if (!Number.isInteger(numId) || numId <= 0) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400, headers: corsHeaders })
    }

    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })
    const db = payload.db as unknown as {
      pool?: { query: (sql: string, values?: unknown[]) => Promise<{ rows: { views: number }[] }> }
    }

    let views: number | null = null
    if (db.pool?.query) {
      const res = await db.pool.query(
        'UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE id = $1 RETURNING views',
        [numId],
      )
      views = res.rows?.[0]?.views ?? null
    }

    return NextResponse.json({ views }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
