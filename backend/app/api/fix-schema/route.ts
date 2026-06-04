import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Sincroniza o schema da tabela "posts" adicionando colunas que o Payload
 * espera mas que não existem no banco (quando push:true não roda no Docker).
 * Idempotente: pode rodar várias vezes.
 * Uso: /api/fix-schema?secret=SEU_SETUP_SECRET
 */

// Cada item é um comando SQL idempotente.
const STATEMENTS: string[] = [
  // Enum do featureLevel (cria só se não existir)
  `DO $$ BEGIN
     CREATE TYPE enum_posts_feature_level AS ENUM ('normal', 'destaque', 'principal');
   EXCEPTION WHEN duplicate_object THEN null; END $$;`,

  // Coluna featureLevel (enum)
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "feature_level" enum_posts_feature_level DEFAULT 'normal' NOT NULL;`,

  // Demais colunas que podem estar faltando
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "cover_image_url" varchar;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "youtube_id" varchar;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "external_link" varchar;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "seo_meta_desc" varchar;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "reading_time" numeric;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "published_at" timestamp(3) with time zone;`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author_id" integer;`,
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

    // pg Pool exposto pelo adapter postgres
    const pool: any = (payload.db as any).pool || (payload.db as any).drizzle?.session?.client
    if (!pool || typeof pool.query !== 'function') {
      return NextResponse.json({ status: 'error', message: 'Pool de conexão não acessível em payload.db.pool', dbKeys: Object.keys(payload.db || {}) }, { status: 500 })
    }

    for (const sql of STATEMENTS) {
      try {
        await pool.query(sql)
        steps.push(`✓ OK: ${sql.replace(/\s+/g, ' ').slice(0, 80)}`)
      } catch (e: any) {
        steps.push(`✗ ERRO: ${sql.replace(/\s+/g, ' ').slice(0, 60)} → ${e?.message || e}`)
      }
    }

    return NextResponse.json({ status: 'ok', message: 'Schema sincronizado. Tente publicar um post agora.', steps })
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err?.message || String(err), steps }, { status: 500 })
  }
}
