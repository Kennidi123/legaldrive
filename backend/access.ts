import type { Access, FieldAccess } from 'payload'

/** Usuário autenticado com papel de administrador. */
export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

/** Qualquer usuário autenticado (admin ou editor). */
export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

/** Admin OU o próprio usuário (para ler/editar a própria conta). */
export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}

/** Leitura pública apenas de conteúdo publicado; autenticados veem tudo (rascunhos). */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { status: { equals: 'published' } }
}

/** Acesso ao painel do Payload: somente administradores. */
export const isAdminPanel = ({ req }: { req: { user?: { role?: string } | null } }) =>
  req.user?.role === 'admin'

/** Campo editável somente por administradores (ex.: o próprio papel/role). */
export const adminOnlyField: FieldAccess = ({ req }) => req.user?.role === 'admin'
