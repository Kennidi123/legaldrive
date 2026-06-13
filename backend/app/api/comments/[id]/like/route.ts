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
 * Curtir um comentário (coração). PÚBLICO — operação NÃO destrutiva
 * (apenas `likes = likes + 1`), atômica no banco. O front evita curtidas
 * repetidas por navegador via localStorage.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      pool?: { query: (sql: string, values?: unknown[]) => Promise<{ rows: { likes: number }[] }> }
    }

    let likes: number | null = null
    if (db.pool?.query) {
      const res = await db.pool.query(
        'UPDATE comments SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING likes',
        [numId],
      )
      likes = res.rows?.[0]?.likes ?? null
    }

    return NextResponse.json({ likes }, { status: 200, headers: corsHeaders })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders })
  }
}
