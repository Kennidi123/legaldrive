import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome Completo',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Função',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
