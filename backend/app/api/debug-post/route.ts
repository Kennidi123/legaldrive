import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Diagnóstico: tenta criar um post mínimo e retorna o ERRO REAL do banco.
 * Uso: /api/debug-post?secret=SEU_SETUP_SECRET
 * Remove o post de teste no final se for criado.
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const info: any = {}
  try {
    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    // 1. Pega a 1ª categoria existente
    const cats = await payload.find({ collection: 'categories', limit: 1 })
    info.categoriaUsada = cats.docs[0]?.name || null
    const categoryId = cats.docs[0]?.id

    if (!categoryId) {
      return NextResponse.json({ status: 'error', message: 'Nenhuma categoria existe. Rode /api/seed primeiro.', info }, { status: 400 })
    }

    // 2. Tenta criar um post de teste com TODOS os campos
    const slug = `debug-test-${Date.now()}`
    let created: any = null
    try {
      created = await payload.create({
        collection: 'posts',
        data: {
          title: 'DEBUG TEST',
          slug,
          excerpt: 'Teste de diagnóstico',
          status: 'draft',
          featureLevel: 'normal',
          category: categoryId,
          coverImageUrl: 'https://example.com/img.jpg',
          youtubeId: 'abc123',
          externalLink: 'https://example.com',
          content: { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'teste', version: 1 }], version: 1, direction: 'ltr', format: '', indent: 0 }], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } },
        } as any,
      })
      info.criado = true
      info.postId = created.id
      // limpa o teste
      await payload.delete({ collection: 'posts', id: created.id })
      info.removido = true
      return NextResponse.json({ status: 'ok', message: 'Criação de post funcionou! O problema pode ser outro campo específico.', info })
    } catch (createErr: any) {
      info.criado = false
      info.erroReal = createErr?.message || String(createErr)
      info.erroData = createErr?.data || null
      info.erroStack = (createErr?.stack || '').split('\n').slice(0, 5)
      // tenta extrair detalhe do Postgres
      if (createErr?.cause) info.causa = createErr.cause?.message || String(createErr.cause)
      return NextResponse.json({ status: 'error', message: 'Falha ao criar post — veja erroReal', info }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err?.message || String(err), info }, { status: 500 })
  }
}
