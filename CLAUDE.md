# CLAUDE.md — Legal Drive

Guia do projeto para qualquer sessão da IA. Leia isto antes de mexer no código.

## O que é

**Legal Drive** (`legaldrivemultas.com.br`) é um portal de notícias jurídicas sobre
**Direito de Trânsito** no Brasil (multas, CNH, radar, bafômetro, legislação). Tem um
site público + um CMS para a equipe publicar notícias.

Idioma de todo o produto e dos commits/respostas: **português (Brasil)**.

## Arquitetura — DOIS apps no mesmo repositório

⚠️ Ponto mais importante de entender. Este repo contém **dois aplicativos Next.js
separados**, cada um com seu `package.json` e seu deploy no Coolify:

### 1. Frontend (raiz `/`) — o site público + CMS customizado
- Next.js 15.3.9 (App Router), React 19, Tailwind. **NÃO tem Payload nas deps.**
- Deploy no Coolify com **Base Directory = `/`**.
- Porta 3000. Domínio: `legaldrivemultas.com.br`.
- Lê dados do backend via **REST API** (`NEXT_PUBLIC_PAYLOAD_URL`).

### 2. Backend (`/backend`) — Payload CMS + banco
- Next.js 15.3.9 + **Payload CMS v3** (adapter postgres), porta 3001.
- Deploy no Coolify com **Base Directory = `/backend`**.
- Domínio: `api.legaldrivemultas.com.br`.
- Expõe `/api/*` (REST/GraphQL do Payload) e `/admin` (painel nativo do Payload, **pouco usado**).
- É a **única fonte de verdade dos dados** (PostgreSQL).

> ⚠️ Existem na RAIZ um `payload.config.ts`, uma pasta `collections/` e `prisma/`
> que são **LEGADO/não usados** (Payload nem está nas deps da raiz). A config real do
> Payload é `backend/payload.config.ts` + `backend/collections/`. Edite sempre as do
> `backend/`. As da raiz estão desatualizadas (ex.: nem têm `featureLevel`).

## O CMS é CUSTOMIZADO (não é o /admin do Payload)

A equipe publica pelo **painel customizado** em `app/(cms)/admin/`, que é um conjunto de
páginas React no FRONTEND que falam com a API REST do backend. Detalhes:

- Login: `app/(cms)/admin-login/` → `loginAction` em `actions.ts` faz POST em
  `/api/users/login` e grava o JWT no cookie httpOnly `cms_token`.
- `app/(cms)/admin/layout.tsx` valida a sessão (`/api/users/me`) a cada acesso.
- Dashboard: `app/(cms)/admin/page.tsx` — histórico de notícias em **cards**.
- Criar: `app/(cms)/admin/posts/new/page.tsx`.
- Editar/Excluir: `app/(cms)/admin/posts/[id]/page.tsx`.
- Upload de imagem: `ImageUpload.tsx` → POST `/api/upload-image` no backend → retorna **URL**
  (o CMS trabalha com **URLs de imagem**, não com relações de upload do Payload).
- Helpers compartilhados: `app/(cms)/admin/content-utils.ts`
  (`textToLexical`, `lexicalToText`, `cleanMedia`, `mediaFromPost`, tipo `MediaValue`).
- Seletor de mídia (Nenhuma/Imagem/Vídeo): `app/(cms)/admin/MediaField.tsx`.

- Excluir notícia: pelos **cards do dashboard** (`DeletePostButton.tsx` → server action
  `deletePostAction` em `actions.ts`) ou pelo botão Excluir dentro da edição.

Ao mudar o formato de uma notícia, geralmente é preciso mexer em **3 lugares**:
1. `backend/collections/Posts.ts` (schema)
2. `app/(cms)/admin/posts/new` e `.../[id]` (formulário do CMS)
3. `components/ArticleBody.tsx` + `lib/lexical.ts` (renderização no site)

## Login do admin (trocar e-mail/senha)

O login fica no banco (coleção `Users`), não no código. **Nunca** hardcode senha no repo
(é público). Duas formas de trocar:
1. **Painel nativo do Payload**: `https://api.legaldrivemultas.com.br/admin` → entrar com o
   login atual → conta (canto inferior esquerdo) → editar e-mail + "Change Password".
2. **Via env (Coolify)**: definir `ADMIN_UPSERT=true`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` no
   backend → redeploy (o `onInit` atualiza/cria o usuário) → **remover as 3 variáveis** e
   redeployar de novo.

## Modelo de conteúdo — a Notícia (Posts)

Uma notícia (`posts`) tem o corpo dividido em **até 3 partes**, com um bloco de **mídia
opcional** (imagem OU vídeo do YouTube) entre cada parte:

```
content      (richText) — 1ª parte (Início) — obrigatório
mediaInicial (group)    — mídia após o início
contentMeio  (richText) — 2ª parte (Meio) — opcional
mediaMeio    (group)    — mídia após o meio
contentFinal (richText) — 3ª parte (Final) — opcional
mediaFinal   (group)    — mídia após o final
```

Cada `media*` é um group: `{ tipo: 'none'|'image'|'video', imageUrl, caption, video }`.
`tipo` é **text** (NÃO radio/select) de propósito — ver seção de schema abaixo.
Se `tipo='none'`, renderiza só o texto. Imagens entre textos saem em **16:9** e, no
desktop, **pequenas e centralizadas** (`md:max-w-sm mx-auto`); no mobile, largura total.

Outros campos: `title`, `slug`, `excerpt`, `coverImageUrl` (capa — **obrigatória no CMS**),
`coverImage` (upload, legado), `youtubeId` (vídeo de capa legado), `externalLink`,
`category`, `author`, `tags`, `readingTime`, `status` (draft/published),
`featureLevel` (`normal`/`destaque`/`principal`), `publishedAt` (agendamento), `seo`,
`views` (contador de visualizações — ver seção abaixo).

Coleções: `Posts`, `Categories`, `Authors`, `Tags`, `Media`, `Videos`, `Users`.

## Contador de visualizações (views)

Cada notícia tem um campo `views` (integer) que conta quantas pessoas abriram a notícia.
É **só para o painel admin** (não aparece no site público). Não usa Google Analytics.

Como funciona:
- `components/ViewTracker.tsx` (client) roda na página da notícia e faz `POST` em
  `${NEXT_PUBLIC_PAYLOAD_URL}/api/posts/<id>/view`. Usa `sessionStorage` (`viewed:<id>`)
  para contar **no máximo 1 por sessão/post** (F5 não infla). Renderiza `null`.
- `backend/app/api/posts/[id]/view/route.ts` (endpoint público) faz um `UPDATE posts SET
  views = COALESCE(views, 0) + 1 WHERE id = $1 RETURNING views` — **atômico** (sem corrida)
  e **não altera `updated_at`**. É público porque é uma operação NÃO destrutiva (não viola
  a regra de segurança de DDL/destrutivo). Tem CORS travado em `NEXT_PUBLIC_FRONTEND_URL`.
- No `Posts.ts` o campo `views` é `number`, readOnly, na sidebar do /admin nativo.
- O dashboard (`app/(cms)/admin/page.tsx`) mostra `👁 N` por card e o total na estatística
  "Visualizações".

## Comentários (sem login + curtidas + moderação)

As notícias têm comentários **públicos** (não exigem login) com **curtida (coração)**.
O admin pode **excluir** qualquer comentário.

- Tabela própria `comments` (NÃO é collection do Payload) — criada no boot via
  `ENSURE_COMMENTS_TABLE` no `onInit` (`CREATE TABLE IF NOT EXISTS`, idempotente; FK
  `post_id` com `ON DELETE CASCADE`). Colunas: `id`, `post_id`, `author_name`, `content`,
  `likes`, `created_at`. Manipulada por SQL direto no pool (igual ao contador de views).
- Rotas no backend (`backend/app/api/comments/`):
  - `GET /api/comments?postId=N` — lista os comentários de uma notícia (público).
  - `GET /api/comments?all=1` — lista recentes de todas (com título do post; usado no painel).
  - `POST /api/comments` — cria comentário `{ postId, authorName, content }` (**público**,
    sem login). `content`/`authorName` são limitados em tamanho e tratados como texto puro.
  - `POST /api/comments/[id]/like` — incrementa `likes` (**público**, NÃO destrutivo, atômico).
  - `DELETE /api/comments/[id]` — **só admin**: valida o JWT via `payload.auth({ headers })`
    (o painel envia `Authorization: JWT <token>`); sem usuário → 401.
- Frontend: `components/Comments.tsx` (client) renderiza formulário + lista + botão de curtir.
  Curtidas usam `localStorage` (`ld:liked-comments`) para evitar repetição por navegador.
  É renderizado dentro de `ArticleLayout` (recebe `postId`) no fim do artigo.
- Painel: `app/(cms)/admin/comments/` (lista + `DeleteCommentButton` → `deleteCommentAction`).
  Link "💬 Comentários" no header do CMS e no dashboard.

## Banco de dados e schema (ARMADILHA IMPORTANTE)

O backend usa postgres com `push: true`. **Mas `push` só roda em desenvolvimento.** Em
produção (`next start`, `NODE_ENV=production`) o Payload **NÃO** sincroniza o schema.
Então, ao adicionar campos novos numa collection, as colunas **não são criadas** e a
collection inteira passa a dar **erro 500** (`column ... does not exist`) — inclusive em
GETs de listagem.

Soluções usadas neste projeto:
- `backend/payload.config.ts` tem um **`onInit`** que roda um `ALTER TABLE ... ADD COLUMN
  IF NOT EXISTS` (idempotente) no boot para garantir as colunas novas. Ao adicionar
  campos, **adicione as colunas correspondentes nesse SQL** (`ENSURE_POSTS_COLUMNS`).
  Tipos: richText → `jsonb`; text → `varchar`.
- Não há pasta de migrations. (Solução durável futura: adotar `payload migrate` no deploy.)
- Evite campos `radio`/`select` em collections novas: viram **ENUM** no Postgres, que o
  push/ALTER tem dificuldade de criar. Prefira `type: 'text'`.

Reset de notícias (sem terminal no Coolify): definir env `RESET_POSTS=true` no backend →
redeploy (o `onInit` faz `TRUNCATE posts`) → **remover a variável** e redeployar de novo.

## Estrutura de pastas (frontend / raiz)

```
app/
  (frontend)/          site público: page.tsx (home), [categoria]/[slug] (notícia),
                       busca, contato, sobre, videos, layout.tsx
  (cms)/               CMS customizado (admin, admin-login) — ver seção acima
  api/health/          healthcheck
  og/route.tsx         imagem Open Graph dinâmica (1200x630)
components/            Header, Footer, ArticleLayout, ArticleBody, ArticleSidebar,
                       ArticleCard(+Horizontal), FeaturedHero, CategoryTabs/Badge,
                       VideoEmbed, ShareButtons, WhatsAppBanner, ViewTracker (conta views),
                       Comments (comentários públicos + curtidas)
lib/
  payload-api.ts       funções de fetch da API (getPostBySlug, getLatestPosts, etc.)
  lexical.ts           lexicalToHTML + helpers de imagem (getPostCoverImage, normalizeMediaUrl)
  seo.ts               metadata, Open Graph, JSON-LD (NewsArticle/Organization/WebSite)
  youtube.ts           extractYouTubeId (vários formatos de URL)
backend/
  payload.config.ts    config do Payload (onInit, cors, db, admin.css)
  collections/         Posts, Categories, Authors, Tags, Media, Videos, Users
  app/(payload)/       rotas do Payload (/admin, /api)
  app/api/             upload-image, image/[id], posts/[id]/view (views),
                       comments (+ [id], [id]/like) — comentários públicos
  youtube.ts           cópia do extractYouTubeId p/ o backend
  styles/admin.css     marca no /admin nativo do Payload
```

## Comandos

Frontend (na raiz):
```
npm run dev      # site em http://localhost:3000
npm run build
npx tsc --noEmit # checagem de tipos (sempre rode antes de commitar)
```
Backend (em `/backend`):
```
npm run dev      # backend/Payload em http://localhost:3001  (/admin e /api)
```

## Deploy (Coolify)

- Dois apps no Coolify, ambos do tipo **Public Repository** (o repo é público).
  - Backend: Base Directory `/backend`, domínio `api.legaldrivemultas.com.br`.
  - Frontend: Base Directory `/`, domínio `legaldrivemultas.com.br`.
- `NEXT_PUBLIC_*` são **inlined no build** → exigem **Redeploy** (rebuild), não só Restart.
  Se variável `NEXT_PUBLIC_*` não pega, use "Disable Build Cache" + Redeploy.
- Mudou backend (schema) → Redeploy do backend. Mudou frontend → Redeploy do frontend.

## Git

- Branch de trabalho: **`main`**. O branch padrão do GitHub é **`master`**.
- ⚠️ Sempre faça push para os DOIS: `git push origin main:main && git push origin main:master`
  (o Coolify pode puxar de qualquer um; mantê-los iguais evita deploy de código velho).
- Mensagens de commit em português, terminando com:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## Variáveis de ambiente

```
DATABASE_URL                  # postgres (backend)
PAYLOAD_SECRET                # segredo do Payload (backend)
NEXT_PUBLIC_PAYLOAD_URL       # URL do backend, ex: https://api.legaldrivemultas.com.br
NEXT_PUBLIC_FRONTEND_URL      # URL do site (usado no CORS do backend)
NEXT_PUBLIC_SITE_URL          # URL canônica p/ SEO
NEXT_PUBLIC_WHATSAPP_CHANNEL  # link do WhatsApp (usado em botões/CTA)
NEXT_PUBLIC_YOUTUBE_CHANNEL   # link do canal do YouTube
RESET_POSTS                   # (temporária) 'true' apaga todos os posts no boot do backend
ADMIN_UPSERT                  # (temporária) 'true' aplica a troca de login do admin no boot
ADMIN_EMAIL                   # (temporária) novo e-mail do admin (usado com ADMIN_UPSERT)
ADMIN_PASSWORD                # (temporária) nova senha do admin (usado com ADMIN_UPSERT)
```

As três últimas (`ADMIN_*`) e `RESET_POSTS` são **temporárias**: defina no Coolify, faça
redeploy e **REMOVA depois**. Nunca deixe senha fixa em variável nem no código.

## Segurança — NÃO reintroduzir

Existiam endpoints públicos perigosos (ex.: `/api/payload-push` com `SETUP_SECRET`
exposto que permitia DROP TABLE). Foram **removidos**. **Nunca** recrie endpoints que
executem DDL/operações destrutivas sem autenticação forte. O `SETUP_SECRET` no
`.env.example` é resíduo — ignore.

## Design / Marca

- Sistema visual "Kinetic Juris". Tema do **site é claro** (fundo branco), com **cabeçalho
  e rodapé navy** (`#0a192f`, classe `.dark-section` em `globals.css`). Secundária laranja
  (`#e07b00`). Tokens em `app/globals.css` (`--primary`, `--secondary`, `--on-surface`...).
- Logo do cabeçalho/rodapé: `/logo-completa.png`. Fonte de título: Chivo (`font-display`).
- Termo do produto: usar **"Bafômetro"** (não "Lei Seca").

## Dados de contato da empresa

CNPJ 58.389.187/0001-47 · Avenida Ordem e Progresso, 157, sala 1104 — Barra Funda,
São Paulo/SP · CEP 01141-030 · Celular/WhatsApp (11) 99398-2259 · Fixo (11) 5286-5004 ·
contato@legaldrivemultas.com.br. (No site em `components/Footer.tsx` e `app/(frontend)/contato`.)
