import type { CollectionConfig } from 'payload'

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
      label: 'ID do YouTube',
      admin: { description: 'Ex: dQw4w9WgXcQ — apenas o ID, não a URL completa.' },
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
