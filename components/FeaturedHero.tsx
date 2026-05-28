import Link from 'next/link'
import Image from 'next/image'

interface SidePost {
  title: string
  slug: string
  categorySlug: string
  categoryName: string
  excerpt?: string | null
}

interface FeaturedHeroProps {
  title: string
  slug: string
  excerpt: string
  coverImage?: string | null
  category: { name: string; slug: string }
  publishedAt?: Date | null
  readingTime?: number | null
  sidePosts?: SidePost[]
}

function formatDate(date?: Date | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))
}

export default function FeaturedHero({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  publishedAt,
  readingTime,
  sidePosts = [],
}: FeaturedHeroProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Story */}
      <article className="lg:col-span-8 group cursor-pointer">
        <Link href={`/${category.slug}/${slug}`} className="block">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-[var(--surface-container-high)]">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            ) : (
              <div className="w-full h-full bg-[var(--surface-container-high)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="font-mono text-[11px] font-medium tracking-widest uppercase bg-[var(--secondary)] text-[var(--on-secondary)] px-3 py-1 rounded">
                Destaque
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-4 space-y-3">
          <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--secondary)]">
            {category.name}
          </span>

          <Link href={`/${category.slug}/${slug}`}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--on-surface)] leading-tight group-hover:text-[var(--secondary)] transition-colors">
              {title}
            </h2>
          </Link>

          <p className="text-[var(--primary)] text-base leading-relaxed line-clamp-3">
            {excerpt}
          </p>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[var(--outline)] uppercase tracking-wider">
            {publishedAt && <span>{formatDate(publishedAt)}</span>}
            {readingTime && (
              <>
                <span className="text-[var(--outline-variant)]">·</span>
                <span>{readingTime} min de leitura</span>
              </>
            )}
          </div>
        </div>
      </article>

      {/* Side Stories */}
      {sidePosts.length > 0 && (
        <div className="lg:col-span-4 flex flex-col gap-0 divide-y divide-[var(--outline-variant)]">
          {sidePosts.map((post) => (
            <article key={post.slug} className="group cursor-pointer py-5 first:pt-0">
              <Link href={`/${post.categorySlug}/${post.slug}`} className="block space-y-2">
                <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--secondary)]">
                  {post.categoryName}
                </span>
                <h3 className="font-display text-base font-bold text-[var(--on-surface)] leading-snug group-hover:text-[var(--secondary)] transition-colors line-clamp-3">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-[var(--on-surface-variant)] text-sm line-clamp-2 hidden md:block">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
