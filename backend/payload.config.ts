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

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— Legal Drive CMS' },
    importMap: { baseDir: path.resolve(dirname) },
    css: path.resolve(dirname, 'styles/admin.css'),
  },
  collections: [Posts, Categories, Videos, Authors, Tags, Media, Users],
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
