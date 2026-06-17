/**
 * Fontes (links externos) de uma notícia.
 *
 * Armazenadas no campo `sources` (jsonb) dos posts como uma lista de objetos
 * `{ url, label? }`. O campo legado `externalLink` (string única) continua
 * sendo respeitado para notícias antigas — `normalizeSources` une os dois.
 */
export interface SourceLink {
  url: string
  label?: string
}

/** Lê o valor cru de `sources` (e o `externalLink` legado) e devolve uma lista limpa e sem duplicatas. */
export function normalizeSources(raw: unknown, legacyExternalLink?: string | null): SourceLink[] {
  const out: SourceLink[] = []
  const seen = new Set<string>()

  const push = (url: unknown, label?: unknown) => {
    if (typeof url !== 'string') return
    const u = url.trim()
    if (!u || seen.has(u)) return
    seen.add(u)
    const l = typeof label === 'string' ? label.trim() : ''
    out.push(l ? { url: u, label: l } : { url: u })
  }

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === 'string') push(item)
      else if (item && typeof item === 'object') push((item as any).url, (item as any).label)
    }
  }

  if (legacyExternalLink) push(legacyExternalLink)

  return out
}
