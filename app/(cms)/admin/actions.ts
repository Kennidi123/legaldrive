'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const res = await fetch(`${BACKEND}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  if (!res.ok) return { error: 'Email ou senha incorretos' }

  const { token } = await res.json()
  const cookieStore = await cookies()
  cookieStore.set('cms_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/admin')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('cms_token')
  redirect('/admin-login')
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('cms_token')?.value ?? null
}

export async function deletePostAction(id: string | number) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return { error: 'Erro ao excluir a notícia' }
  revalidatePath('/admin')
  return { success: true }
}

export async function createVideoAction(data: { title: string; youtubeId: string; description?: string }) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({
      title: data.title,
      youtubeId: data.youtubeId,
      description: data.description || undefined,
      publishedAt: new Date().toISOString(),
    }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) return { error: json.errors?.[0]?.message || 'Erro ao adicionar o vídeo' }
  revalidatePath('/admin/videos')
  return { success: true }
}

export async function deleteVideoAction(id: string | number) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/videos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return { error: 'Erro ao excluir o vídeo' }
  revalidatePath('/admin/videos')
  return { success: true }
}

export async function createAuthorAction(data: { name: string; role?: string; avatarUrl?: string }) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name: data.name, role: data.role || undefined, avatarUrl: data.avatarUrl || undefined }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) return { error: json.errors?.[0]?.message || 'Erro ao criar o autor' }
  revalidatePath('/admin/authors')
  return { success: true }
}

export async function updateAuthorAction(id: string | number, data: { name: string; role?: string; avatarUrl?: string }) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/authors/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name: data.name, role: data.role ?? '', avatarUrl: data.avatarUrl ?? '' }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) return { error: json.errors?.[0]?.message || 'Erro ao salvar o autor' }
  revalidatePath('/admin/authors')
  return { success: true }
}

export async function deleteAuthorAction(id: string | number) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/authors/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return { error: 'Erro ao excluir o autor' }
  revalidatePath('/admin/authors')
  return { success: true }
}

export async function deleteCommentAction(id: string | number) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/comments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return { error: 'Erro ao excluir o comentário' }
  revalidatePath('/admin/comments')
  return { success: true }
}

export async function deleteSiteUserAction(id: string | number) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}/api/site-users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return { error: 'Erro ao excluir o usuário' }
  revalidatePath('/admin/users')
  return { success: true }
}

export async function apiGet(path: string) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}${path}`, {
    headers: { Authorization: `JWT ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export async function apiPost(path: string, data: Record<string, unknown>) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) return { error: json.errors?.[0]?.message || 'Erro ao salvar' }
  return { success: true, doc: json.doc }
}

export async function apiPatch(path: string, data: Record<string, unknown>) {
  const token = await getToken()
  const res = await fetch(`${BACKEND}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok) return { error: json.errors?.[0]?.message || 'Erro ao atualizar' }
  return { success: true, doc: json.doc }
}
