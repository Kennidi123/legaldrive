import type { CollectionConfig } from 'payload'
import { extractYouTubeId } from '../youtube'

export const Videos: CollectionConfig = {
  slug: 'videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'youtubeId', 'publishedAt'],
    description: 'Vídeos do canal YouTube integrados ao portal.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título',
    },
    {
      name: 'youtubeId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Link ou ID do YouTube',
      admin: {
        description: 'Cole o link do vídeo (ex: youtube.com/watch?v=... ou youtu.be/...) OU só o ID. O sistema extrai e guarda só o ID automaticamente.',
      },
      hooks: {
        beforeChange: [({ value }) => (value ? extractYouTubeId(value) || value : value)],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
    },
    {
      name: 'thumbnail',
      type: 'text',
      label: 'URL do Thumbnail',
      admin: { description: 'Deixe em branco para usar o thumbnail automático do YouTube.' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data de Publicação',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: '⭐ Destaque na Home',
      defaultValue: false,
    },
  ],
}
