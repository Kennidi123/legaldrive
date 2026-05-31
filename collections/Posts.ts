import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt', 'featured'],
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
      name: 'featured',
      type: 'checkbox',
      label: '⭐ Destaque na Home',
      defaultValue: false,
      admin: { position: 'sidebar' },
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
      required: true,
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
    // ── Main content ──────────────────────────────────────
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
      name: 'content',
      type: 'richText',
      label: 'Conteúdo',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
    {
      name: 'youtubeId',
      type: 'text',
      label: 'ID do Vídeo YouTube',
      admin: { description: 'Ex: dQw4w9WgXcQ — apenas o ID, não a URL completa.' },
    },
    // ── SEO ───────────────────────────────────────────────
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
}
