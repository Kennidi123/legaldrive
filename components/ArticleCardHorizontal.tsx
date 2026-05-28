import Link from 'next/link'
import Image from 'next/image'
import CategoryBadge from './CategoryBadge'

interface ArticleCardHorizontalProps {
  title: string
  slug: string
  excerpt?: string
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

export default function ArticleCardHorizontal({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  publishedAt,
  readingTime,
  animationDelay = 0,
}: ArticleCardHorizontalProps) {
  return (
    <article
      className="group flex gap-4 items-start animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Link href={`/${category.slug}/${slug}`} className="flex-none">
        <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-[var(--surface-container-high)]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-[var(--surface-container-high)]" />
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1.5 min-w-0">
        <CategoryBadge name={category.name} slug={category.slug} />

        <Link href={`/${category.slug}/${slug}`}>
          <h4 className="font-display text-sm font-bold text-[var(--on-surface)] leading-snug group-hover:text-[var(--secondary)] transition-colors duration-150 line-clamp-2">
            {title}
          </h4>
        </Link>

        {excerpt && (
          <p className="text-xs text-[var(--on-surface-variant)] line-clamp-2 leading-relaxed hidden sm:block">
            {excerpt}
          </p>
        )}

        <div className="flex items-center gap-2">
          {publishedAt && (
            <span className="font-mono text-[10px] text-[var(--outline)] uppercase">
              {formatDate(publishedAt)}
            </span>
          )}
          {readingTime && (
            <>
              <span className="text-[var(--outline-variant)]">·</span>
              <span className="font-mono text-[10px] text-[var(--outline)] uppercase">
                {readingTime} min
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
