import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Authors } from './collections/Authors'
import { Tags } from './collections/Tags'
import { Posts } from './collections/Posts'
import { Videos } from './collections/Videos'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || '*'

// Garante as colunas dos campos novos da tabela `posts`. Necessário porque o
// `push: true` do Payload só roda em desenvolvimento — em produção (next start /
// NODE_ENV=production) ele não sincroniza o schema, e o código passa a fazer
// SELECT de colunas inexistentes (erro 500 em /api/posts). Este ALTER é
// idempotente (IF NOT EXISTS) e roda no boot do backend.
const ENSURE_POSTS_COLUMNS = `
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS media_inicial_tipo varchar DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS media_inicial_image_url varchar,
  ADD COLUMN IF NOT EXISTS media_inicial_caption varchar,
  ADD COLUMN IF NOT EXISTS media_inicial_video varchar,
  ADD COLUMN IF NOT EXISTS content_meio jsonb,
  ADD COLUMN IF NOT EXISTS media_meio_tipo varchar DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS media_meio_image_url varchar,
  ADD COLUMN IF NOT EXISTS media_meio_caption varchar,
  ADD COLUMN IF NOT EXISTS media_meio_video varchar,
  ADD COLUMN IF NOT EXISTS content_final jsonb,
  ADD COLUMN IF NOT EXISTS media_final_tipo varchar DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS media_final_image_url varchar,
  ADD COLUMN IF NOT EXISTS media_final_caption varchar,
  ADD COLUMN IF NOT EXISTS media_final_video varchar;
`

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— Legal Drive CMS' },
    importMap: { baseDir: path.resolve(dirname) },
    css: path.resolve(dirname, 'styles/admin.css'),
  },
  collections: [Posts, Categories, Videos, Authors, Tags, Media, Users],
  onInit: async (payload) => {
    try {
      const db = payload.db as unknown as {
        pool?: { query: (sql: string) => Promise<unknown> }
        drizzle?: { execute: (sql: string) => Promise<unknown> }
      }
      if (db.pool?.query) {
        await db.pool.query(ENSURE_POSTS_COLUMNS)
      } else if (db.drizzle?.execute) {
        await db.drizzle.execute(ENSURE_POSTS_COLUMNS)
      }
      payload.logger.info('[init] Colunas de mídia/segmentos garantidas na tabela posts.')
    } catch (err) {
      payload.logger.error(err, '[init] Falha ao garantir colunas novas em posts')
    }
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'legaldrive-change-this-secret',
  cors: [frontendUrl, 'http://localhost:3000'],
  csrf: [frontendUrl, 'http://localhost:3000'],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '', max: 5 },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Sincroniza o schema automaticamente no start (cria colunas novas como
    // feature_level sem precisar gerar/rodar migrations manualmente).
    push: true,
  }),
  sharp,
})
