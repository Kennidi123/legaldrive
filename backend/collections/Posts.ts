import type { CollectionConfig, Field } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { extractYouTubeId } from '../youtube'

/**
 * Grupo de mídia reutilizável que vai ENTRE os blocos de texto da notícia.
 * O editor escolhe: Nenhuma (só texto) / Imagem (upload) / Vídeo (link YouTube).
 * Os campos aparecem de forma condicional — só mostra o input escolhido.
 */
const mediaBlock = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  admin: {
    description:
      'Opcional. Escolha uma imagem OU um link de vídeo do YouTube para aparecer aqui. Deixe em "Nenhuma" para mostrar somente o texto.',
  },
  fields: [
    {
      // Texto (não 'radio'/'select') de propósito: evita criar um ENUM no
      // Postgres, que faz o `push: true` falhar ao sincronizar o schema em
      // produção. Valores aceitos: 'none' | 'image' | 'video'.
      name: 'tipo',
      type: 'text',
      label: 'O que mostrar neste ponto?',
      defaultValue: 'none',
      admin: {
        description: 'Preenchido pelo painel: none (só texto), image ou video.',
      },
    },
    {
      // Galeria: permite mais de uma imagem por bloco intercalado.
      // type 'json' (vira coluna jsonb) — não cria tabela nova nem ENUM, então
      // o ALTER TABLE do onInit consegue criá-la em produção. Formato:
      // [{ url, caption }, ...]
      name: 'images',
      type: 'json',
      label: 'Imagens (galeria)',
      admin: {
        condition: (_, sibling) => sibling?.tipo === 'image',
        description: 'Lista de imagens [{ url, caption }]. Preenchido pelo painel customizado.',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Imagem (URL) — legado',
      admin: {
        condition: (_, sibling) => sibling?.tipo === 'image',
        description: 'Mantido por compatibilidade (1ª imagem da galeria).',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Legenda da imagem (opcional)',
      admin: { condition: (_, sibling) => sibling?.tipo === 'image' },
    },
    {
      name: 'video',
      type: 'text',
      label: 'Link ou ID do vídeo do YouTube',
      admin: {
        condition: (_, sibling) => sibling?.tipo === 'video',
        description: 'Cole o link (youtube.com/watch?v=... ou youtu.be/...) OU só o ID. O sistema extrai o ID automaticamente.',
      },
      hooks: {
        beforeChange: [({ value }) => (value ? extractYouTubeId(value) || value : value)],
      },
    },
  ],
})

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt', 'featureLevel'],
    description: 'Artigos, notícias e matérias do portal.',
  },
  access: { read: () => true },
  fields: [
    // ── Sidebar ───────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: '📝 Rascunho', value: 'draft' },
        { label: '✅ Publicado', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data de Publicação',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'featureLevel',
      type: 'select',
      label: 'Destaque',
      options: [
        { label: 'Normal (vai para a lista de cards)', value: 'normal' },
        { label: '⭐ Destaque (topo da categoria)', value: 'destaque' },
        { label: '🏆 Destaque Principal (Home)', value: 'principal' },
      ],
      defaultValue: 'normal',
      required: true,
      admin: {
        position: 'sidebar',
        description:
          'Normal: aparece na lista de cards. Destaque: vai para o topo da categoria. Destaque Principal: aparece na Home. Ao definir um novo destaque, o anterior volta para a lista automaticamente (sempre vale o mais recente).',
      },
    },
    {
      // Legado — mantido por compatibilidade. Use "Destaque" acima.
      name: 'featured',
      type: 'checkbox',
      label: '⭐ Destaque (legado)',
      defaultValue: false,
      admin: { position: 'sidebar', hidden: true },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Categoria',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Autor',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Tempo de Leitura (min)',
      admin: { position: 'sidebar' },
    },
    {
      name: 'views',
      type: 'number',
      label: 'Visualizações',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Contagem automática de quantas pessoas abriram a notícia.',
      },
    },
    // ── Conteúdo principal (em abas) ──────────────────────
    {
      type: 'tabs',
      tabs: [
        {
          label: '📝 Notícia',
          description: 'Escreva a notícia em até 3 partes. Entre cada parte você pode colocar uma imagem ou um vídeo. Se deixar vazio, aparece só o texto.',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Título',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug (URL)',
              admin: { description: 'Ex: novas-regras-de-radares-2024' },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              label: 'Resumo',
              admin: { description: 'Texto curto exibido nos cards e listagens.' },
            },
            // 1ª parte — Início
            {
              name: 'content',
              type: 'richText',
              label: '1️⃣ Texto — Início da Notícia',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [...defaultFeatures],
              }),
            },
            mediaBlock('mediaInicial', '🎞️ Mídia após o início'),
            // 2ª parte — Meio
            {
              name: 'contentMeio',
              type: 'richText',
              label: '2️⃣ Texto — Meio da Notícia (opcional)',
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [...defaultFeatures],
              }),
            },
            mediaBlock('mediaMeio', '🎞️ Mídia após o meio'),
            // 3ª parte — Final
            {
              name: 'contentFinal',
              type: 'richText',
              label: '3️⃣ Texto — Final da Notícia (opcional)',
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [...defaultFeatures],
              }),
            },
            mediaBlock('mediaFinal', '🎞️ Mídia após o final'),
          ],
        },
        {
          label: '🖼️ Capa & Links',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem de Capa (upload)',
            },
            {
              name: 'coverImageUrl',
              type: 'text',
              label: 'Imagem de Capa (URL externa)',
              admin: { description: 'Use para imagens hospedadas externamente. O upload tem prioridade.' },
            },
            {
              name: 'coverImageSquareUrl',
              type: 'text',
              label: 'Imagem Quadrada (formatos menores)',
              admin: { description: 'Opcional. Versão quadrada (1:1) usada nas miniaturas pequenas, evitando corte da capa. Se vazio, usa a capa.' },
            },
            {
              name: 'youtubeId',
              type: 'text',
              label: 'Vídeo de Capa (YouTube)',
              admin: {
                description: 'Opcional. Se preenchido, a capa da notícia vira um player de vídeo (a imagem de capa é usada como prévia). Cole o link ou o ID.',
              },
              hooks: {
                beforeChange: [({ value }) => (value ? extractYouTubeId(value) || value : value)],
              },
            },
            {
              name: 'externalLink',
              type: 'text',
              label: 'Link Externo (fonte) — legado',
              admin: { description: 'Campo antigo de fonte única. Mantido por compatibilidade; use "Fontes" abaixo.' },
            },
            {
              name: 'sources',
              type: 'json',
              label: 'Fontes (links externos)',
              admin: { description: 'Lista de fontes/links externos. Cada item: { "url": "https://...", "label": "opcional" }.' },
            },
          ],
        },
        {
          label: '🔍 SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta Título',
                  admin: { description: 'Deixe em branco para usar o título do artigo.' },
                },
                {
                  name: 'metaDesc',
                  type: 'textarea',
                  label: 'Meta Descrição',
                  admin: { description: 'Deixe em branco para usar o resumo.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
