'use client'

import { useEffect } from 'react'

const BACKEND = (process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '')

/**
 * Conta uma visualização da notícia. Roda no navegador (não conta prefetch/bots
 * do SSR) e usa sessionStorage para somar no máximo 1 por sessão/post — evita
 * inflar o número com F5. Não renderiza nada.
 */
export default function ViewTracker({ postId }: { postId: string | number }) {
  useEffect(() => {
    if (!postId) return
    const key = `viewed:${postId}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage indisponível — segue sem dedup
    }
    fetch(`${BACKEND}/api/posts/${postId}/view`, { method: 'POST', keepalive: true }).catch(() => {})
  }, [postId])

  return null
}
