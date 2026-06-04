import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf, adminOnlyField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: {
    // Proteção contra brute force: trava a conta após 5 tentativas por 15 min.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    // Sessão expira em 2h; exige login novamente depois disso.
    tokenExpiration: 2 * 60 * 60,
  },
  hooks: {
    // Bootstrap seguro: o primeiríssimo usuário do sistema nasce admin.
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users' })
          if (totalDocs === 0) return { ...data, role: 'admin' }
        }
        return data
      },
    ],
    // Rede de segurança: se ainda não existe NENHUM admin, promove quem logar.
    // Como o cadastro é fechado e não há mais endpoint de criação, só o dono
    // (com credenciais válidas) chega aqui — sem reabrir brecha.
    afterLogin: [
      async ({ req, user }) => {
        const admins = await req.payload.count({
          collection: 'users',
          where: { role: { equals: 'admin' } },
        })
        if (admins.totalDocs === 0) {
          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: { role: 'admin' },
            overrideAccess: true,
          })
        }
      },
    ],
  },
  access: {
    // Apenas admin cria, lista e remove usuários. Editar: admin ou a própria conta.
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    // Gate do painel do Payload: somente administradores conseguem logar/entrar.
    admin: ({ req }) => req.user?.role === 'admin',
  },
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
      // Anti-escalação: só admin define/altera o papel. Um editor não pode se
      // promover a admin nem alterar o papel de ninguém.
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
    },
  ],
}
