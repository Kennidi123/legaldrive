import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { name: 'Multas', slug: 'multas', description: 'Análises sobre multas de trânsito, recursos e direitos do motorista.' },
  { name: 'CNH', slug: 'cnh', description: 'Suspensão, cassação e renovação de CNH. Saiba como defender sua habilitação.' },
  { name: 'Radar', slug: 'radar', description: 'Fiscalização eletrônica, radares fixos e portáteis e como contestar autuações.' },
  { name: 'Fiscalização', slug: 'fiscalizacao', description: 'Blitz, barreiras policiais e operações de fiscalização de trânsito.' },
  { name: 'Leis de Trânsito', slug: 'leis-de-transito', description: 'CTB, resoluções do CONTRAN e atualizações da legislação de trânsito.' },
  { name: 'Casos Reais', slug: 'casos-reais', description: 'Casos reais de recursos de multas e defesas de CNH com resultados.' },
]

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
        steps.push(`— Já existe: ${cat.name}`)
      }
    }

    return NextResponse.json({ status: 'ok', steps })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ status: 'error', message, steps }, { status: 500 })
  }
}
