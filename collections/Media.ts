import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt' },
  access: { read: () => true },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto Alternativo (SEO)',
      required: true,
    },
  ],
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
  },
}
