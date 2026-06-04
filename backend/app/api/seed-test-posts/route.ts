import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Cria posts de TESTE: 5 por categoria, slugs nova-cnh1..nova-cnhN.
 * - O 1º post de cada categoria vira "destaque" (topo da página da categoria).
 * - O 1º post no geral vira "principal" (hero da Home).
 * - Todos publicados com publishedAt = agora (aparecem na Home/Recentes).
 * Uso: /api/seed-test-posts?secret=SECRET
 * Para limpar depois: /api/clear-posts?secret=SECRET
 */

function lexical(text: string) {
  return {
    root: {
      type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
      children: [
        { type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0,
          children: [{ type: 'text', version: 1, text, format: 0, style: '', mode: 'normal', detail: 0 }] },
      ],
    },
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const perCategory = Number(req.nextUrl.searchParams.get('count') || '5')

  const steps: string[] = []
  try {
    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    const cats = await payload.find({ collection: 'categories', limit: 50, sort: 'name' })
    if (cats.totalDocs === 0) {
      return NextResponse.json({ status: 'error', message: 'Sem categorias. Rode /api/seed primeiro.' }, { status: 400 })
    }

    const now = new Date().toISOString()
    let counter = 0

    for (const cat of cats.docs) {
      for (let i = 0; i < perCategory; i++) {
        counter++
        const slug = `nova-cnh${counter}`
        const isFirstOverall = counter === 1
        const isFirstOfCat = i === 0
        const featureLevel = isFirstOverall ? 'principal' : isFirstOfCat ? 'destaque' : 'normal'

        // remove se já existir (idempotente)
        const existing = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1 })
        if (existing.totalDocs > 0) {
          await payload.delete({ collection: 'posts', id: existing.docs[0].id })
        }

        try {
          await payload.create({
            collection: 'posts',
            data: {
              title: `Nova CNH ${counter} — ${cat.name}`,
              slug,
              excerpt: `Publicação de teste número ${counter} na categoria ${cat.name}. Conteúdo de exemplo para validar o layout dos cards e destaques.`,
              status: 'published',
              publishedAt: now,
              featureLevel,
              category: cat.id,
              coverImageUrl: `https://picsum.photos/seed/${slug}/1200/675`,
              readingTime: 4,
              content: lexical(`Este é o corpo da publicação de teste ${counter} (${cat.name}). Texto de exemplo apenas para teste de layout. Pode apagar tudo depois com /api/clear-posts.`),
            } as any,
          })
          steps.push(`✓ ${slug} → ${cat.name} [${featureLevel}]`)
        } catch (e: any) {
          steps.push(`✗ ${slug} → ${e?.message || e}`)
        }
      }
    }

    return NextResponse.json({ status: 'ok', message: `${counter} posts de teste criados.`, steps })
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err?.message || String(err), steps }, { status: 500 })
  }
}
