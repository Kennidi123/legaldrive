/**
 * Extrai o ID de 11 caracteres de um vídeo do YouTube a partir de qualquer
 * formato — link completo, link curto, embed, shorts, live ou o ID puro.
 *
 * Exemplos aceitos:
 *   dQw4w9WgXcQ
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s&list=...
 *   https://youtu.be/dQw4w9WgXcQ
 *   https://www.youtube.com/embed/dQw4w9WgXcQ
 *   https://www.youtube.com/shorts/dQw4w9WgXcQ
 *   https://www.youtube.com/live/dQw4w9WgXcQ
 *   https://m.youtube.com/watch?v=dQw4w9WgXcQ
 */
export function extractYouTubeId(input?: string | null): string {
  if (!input) return ''
  const s = input.trim()

  // Já é um ID puro (11 caracteres válidos, sem barra ou ponto).
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s

  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = s.match(p)
    if (m) return m[1]
  }

  // Fallback: qualquer sequência isolada de 11 caracteres válidos.
  const generic = s.match(/(?:^|[/=])([a-zA-Z0-9_-]{11})(?:$|[?&/])/)
  return generic ? generic[1] : ''
}
