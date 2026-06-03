'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
