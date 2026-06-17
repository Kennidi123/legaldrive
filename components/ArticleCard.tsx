import Link from 'next/link'
import CategoryBadge from './CategoryBadge'
import CoverImage from './CoverImage'

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string
  coverImage?: string | null
  category: { name: string; slug: string }
  publishedAt?: Date | null
  readingTime?: number | null
  animationDelay?: number
}

function formatDate(date?: Date | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

export default function ArticleCard({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  publishedAt,
  readingTime,
  animationDelay = 0,
}: ArticleCardProps) {
  return (
    <article
      className="card-base group flex flex-col overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Link href={`/${category.slug}/${slug}`} className="block overflow-hidden">
        <div className="media-zoom relative aspect-video overflow-hidden bg-[var(--surface-container-high)]">
          {coverImage ? (
            <CoverImage
              src={coverImage}
              alt={title}
              className="transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-[var(--surface-container-high)] flex items-center justify-center">
              <span className="text-[var(--outline)] font-mono text-xs uppercase tracking-widest">Legal Drive</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <CategoryBadge name={category.name} slug={category.slug} />

        <Link href={`/${category.slug}/${slug}`}>
          <h3 className="font-display text-lg font-bold text-[var(--on-surface)] leading-snug group-hover:text-[var(--secondary)] transition-colors duration-150 line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-[var(--on-surface-variant)] text-sm leading-relaxed line-clamp-2 flex-1">
          {excerpt}
        </p>

        <div className="flex items-center gap-3 pt-2 border-t border-[var(--outline-variant)]">
          {publishedAt && (
            <span className="font-mono text-[11px] text-[var(--outline)] uppercase tracking-wider">
              {formatDate(publishedAt)}
            </span>
          )}
          {readingTime && (
            <>
              <span className="w-px h-3 bg-[var(--outline-variant)]" />
              <span className="font-mono text-[11px] text-[var(--outline)] uppercase tracking-wider">
                {readingTime} min
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
