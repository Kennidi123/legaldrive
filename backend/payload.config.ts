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
  ADD COLUMN IF NOT EXISTS media_inicial_images jsonb,
  ADD COLUMN IF NOT EXISTS content_meio jsonb,
  ADD COLUMN IF NOT EXISTS media_meio_tipo varchar DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS media_meio_image_url varchar,
  ADD COLUMN IF NOT EXISTS media_meio_caption varchar,
  ADD COLUMN IF NOT EXISTS media_meio_video varchar,
  ADD COLUMN IF NOT EXISTS media_meio_images jsonb,
  ADD COLUMN IF NOT EXISTS content_final jsonb,
  ADD COLUMN IF NOT EXISTS media_final_tipo varchar DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS media_final_image_url varchar,
  ADD COLUMN IF NOT EXISTS media_final_caption varchar,
  ADD COLUMN IF NOT EXISTS media_final_video varchar,
  ADD COLUMN IF NOT EXISTS media_final_images jsonb,
  ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;
`

// Cria a tabela de comentários das notícias. É uma tabela gerenciada por SQL
// próprio (não é uma collection do Payload) — manipulada pelas rotas em
// backend/app/api/comments. Necessário porque o `push: true` só roda em dev;
// em produção este CREATE garante a tabela no boot. Idempotente.
const ENSURE_COMMENTS_TABLE = `
CREATE TABLE IF NOT EXISTS comments (
  id serial PRIMARY KEY,
  post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name varchar NOT NULL DEFAULT 'Anônimo',
  content varchar NOT NULL,
  likes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
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
    const db = payload.db as unknown as {
      pool?: { query: (sql: string) => Promise<unknown> }
      drizzle?: { execute: (sql: string) => Promise<unknown> }
    }
    const runSql = async (sql: string) => {
      if (db.pool?.query) return db.pool.query(sql)
      if (db.drizzle?.execute) return db.drizzle.execute(sql)
    }

    try {
      await runSql(ENSURE_POSTS_COLUMNS)
      payload.logger.info('[init] Colunas de mídia/segmentos garantidas na tabela posts.')
    } catch (err) {
      payload.logger.error(err, '[init] Falha ao garantir colunas novas em posts')
    }

    try {
      await runSql(ENSURE_COMMENTS_TABLE)
      payload.logger.info('[init] Tabela de comentários garantida.')
    } catch (err) {
      payload.logger.error(err, '[init] Falha ao garantir a tabela de comentários')
    }

    // Reset único e controlado: apaga TODAS as notícias quando RESET_POSTS=true.
    // Use uma vez (defina a variável → redeploy) e DEPOIS remova a variável,
    // senão os posts serão apagados de novo a cada reinício do backend.
    if (process.env.RESET_POSTS === 'true') {
      try {
        await runSql('TRUNCATE TABLE posts RESTART IDENTITY CASCADE;')
        payload.logger.warn('[init] RESET_POSTS=true → TODAS as notícias foram apagadas. REMOVA a variável RESET_POSTS agora para não repetir.')
      } catch (err) {
        payload.logger.error(err, '[init] Falha ao apagar notícias (RESET_POSTS)')
      }
    }

    // Atualiza/cria o login do admin a partir de variáveis de ambiente (a senha NÃO
    // fica no código). Defina ADMIN_UPSERT=true, ADMIN_EMAIL e ADMIN_PASSWORD no
    // backend → redeploy → e DEPOIS REMOVA as três variáveis.
    if (process.env.ADMIN_UPSERT === 'true' && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      try {
        const email = process.env.ADMIN_EMAIL.trim()
        const password = process.env.ADMIN_PASSWORD
        const byEmail = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
        if (byEmail.docs.length > 0) {
          await payload.update({ collection: 'users', id: byEmail.docs[0].id, data: { password } })
        } else {
          const anyUser = await payload.find({ collection: 'users', limit: 1, sort: 'createdAt' })
          if (anyUser.docs.length > 0) {
            await payload.update({ collection: 'users', id: anyUser.docs[0].id, data: { email, password } })
          } else {
            await payload.create({ collection: 'users', data: { email, password } })
          }
        }
        payload.logger.warn('[init] ADMIN_UPSERT aplicado: login do admin atualizado. REMOVA ADMIN_UPSERT/ADMIN_EMAIL/ADMIN_PASSWORD agora.')
      } catch (err) {
        payload.logger.error(err, '[init] Falha ao aplicar ADMIN_UPSERT')
      }
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
