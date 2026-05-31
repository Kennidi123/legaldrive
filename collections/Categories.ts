import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: { description: 'URL amigável. Ex: multas, cnh, radar' },
    },
    {
      name: 'color',
      type: 'text',
      label: 'Cor Hex',
      admin: { description: 'Ex: #ffb86b' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrição',
    },
  ],
}
