import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Limpa publicações (posts).
 * - /api/clear-posts?secret=SECRET            -> apaga TODOS os posts
 * - /api/clear-posts?secret=SECRET&slug=xyz   -> apaga apenas o post com esse slug
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const slug = req.nextUrl.searchParams.get('slug')

  const steps: string[] = []
  try {
    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    const where = slug ? { slug: { equals: slug } } : {}
    const found = await payload.find({ collection: 'posts', where, limit: 500, depth: 0 })

    if (found.totalDocs === 0) {
      // fallback: tenta apagar direto via SQL caso o registro esteja "fantasma"
      if (slug) {
        try {
          const pool: any = (payload.db as any).pool
          if (pool?.query) {
            const res = await pool.query('DELETE FROM "posts" WHERE "slug" = $1', [slug])
            return NextResponse.json({ status: 'ok', message: `SQL delete por slug "${slug}"`, rowCount: res.rowCount })
          }
        } catch (e: any) {
          return NextResponse.json({ status: 'error', message: e?.message || String(e) }, { status: 500 })
        }
      }
      return NextResponse.json({ status: 'ok', message: 'Nenhum post encontrado.', steps })
    }

    for (const post of found.docs) {
      try {
        await payload.delete({ collection: 'posts', id: post.id })
        steps.push(`🗑 Removido: ${post.title} (${post.slug})`)
      } catch (e: any) {
        steps.push(`✗ Falha: ${post.slug} → ${e?.message || e}`)
      }
    }

    return NextResponse.json({ status: 'ok', message: `${steps.length} post(s) processado(s).`, steps })
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err?.message || String(err), steps }, { status: 500 })
  }
}
