/**
 * Extrai o ID de 11 caracteres de um vídeo do YouTube a partir de qualquer
 * formato — link completo, link curto, embed, shorts, live ou o ID puro.
 * Usado nas collections para normalizar o que é salvo (sempre só o ID).
 */
export function extractYouTubeId(input?: string | null): string {
  if (!input) return ''
  const s = String(input).trim()

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

  const generic = s.match(/(?:^|[/=])([a-zA-Z0-9_-]{11})(?:$|[?&/])/)
  return generic ? generic[1] : ''
}
