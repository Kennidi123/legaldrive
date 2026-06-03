import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { name: 'Multas', slug: 'multas', description: 'Análises sobre multas de trânsito, recursos e direitos do motorista.' },
  { name: 'CNH', slug: 'cnh', description: 'Suspensão, cassação e renovação de CNH. Saiba como defender sua habilitação.' },
  { name: 'Radar', slug: 'radar', description: 'Fiscalização eletrônica, radares fixos e portáteis e como contestar autuações.' },
  { name: 'Legislação', slug: 'leis-de-transito', description: 'CTB, resoluções do CONTRAN e atualizações da legislação de trânsito.' },
  { name: 'Tecnologia', slug: 'mobilidade-eletrica', description: 'Inovação, mobilidade elétrica e tecnologia aplicada ao trânsito.' },
  { name: 'Cidadania', slug: 'direitos-do-motorista', description: 'Direitos do motorista, educação no trânsito e cidadania.' },
]

const OBSOLETE_SLUGS = ['fiscalizacao', 'casos-reais']

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const steps: string[] = []
  try {
    const { getPayload } = await import('payload')
    const configMod = await import('@payload-config')
    const payload = await getPayload({ config: configMod.default })

    // Criar ou atualizar categorias do menu
    for (const cat of CATEGORIES) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })
      if (existing.totalDocs === 0) {
        await payload.create({ collection: 'categories', data: cat })
        steps.push(`✓ Criada: ${cat.name}`)
      } else {
        await payload.update({ collection: 'categories', id: existing.docs[0].id, data: { name: cat.name, description: cat.description } })
        steps.push(`↺ Atualizada: ${cat.name}`)
      }
    }

    // Remover categorias obsoletas (sem posts vinculados)
    for (const slug of OBSOLETE_SLUGS) {
      const found = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
      if (found.totalDocs > 0) {
        const cat = found.docs[0]
        const posts = await payload.find({ collection: 'posts', where: { category: { equals: cat.id } }, limit: 1 })
        if (posts.totalDocs === 0) {
          await payload.delete({ collection: 'categories', id: cat.id })
          steps.push(`🗑 Removida (obsoleta, sem posts): ${cat.name}`)
        } else {
          steps.push(`⚠ Mantida (tem posts vinculados): ${cat.name}`)
        }
      }
    }

    return NextResponse.json({ status: 'ok', steps })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ status: 'error', message, steps }, { status: 500 })
  }
}
