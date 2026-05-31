import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nome',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biografia',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Cargo / Especialidade',
      admin: { description: 'Ex: Advogada especialista em Direito de Trânsito' },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto (upload)',
    },
    {
      name: 'avatarUrl',
      type: 'text',
      label: 'Foto (URL externa)',
      admin: { description: 'Use se a foto estiver hospedada externamente.' },
    },
  ],
}
