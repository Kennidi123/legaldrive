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

// Origens permitidas (CORS/CSRF). Nunca usar '*': isso permitiria que qualquer
// site fizesse requisições autenticadas à API. Lista explícita por env + locais.
const allowedOrigins = [
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  'https://legaldrivemultas.com.br',
  'https://www.legaldrivemultas.com.br',
  'http://localhost:3000',
].filter((o): o is string => Boolean(o))

// Falha cedo em RUNTIME (não no build) se o secret estiver ausente: um secret
// previsível permite forjar tokens de admin. Durante `next build` o secret pode
// não estar disponível, então não bloqueamos a compilação.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
if (!process.env.PAYLOAD_SECRET && !isBuildPhase) {
  throw new Error('PAYLOAD_SECRET não definido — configure um valor forte e único no ambiente.')
}
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || 'build-only-placeholder-not-used-at-runtime'

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— Legal Drive CMS' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Posts, Categories, Videos, Authors, Tags, Media, Users],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '', max: 5 },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Sincroniza o schema automaticamente no start (cria colunas novas como
    // feature_level sem precisar gerar/rodar migrations manualmente).
    push: true,
  }),
  sharp,
})
