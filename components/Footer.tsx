import Link from 'next/link'
import Image from 'next/image'

const columns = [
  {
    title: 'Serviços',
    links: [
      { label: 'Recurso de Multas', href: '/contato' },
      { label: 'Defesa CNH', href: '/contato' },
      { label: 'Gestão de Frotas', href: '/contato' },
      { label: 'Consultoria Legal', href: '/contato' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termos de Uso', href: '#' },
      { label: 'Política de Privacidade', href: '#' },
      { label: 'Compliance', href: '#' },
    ],
  },
]

const categories = [
  { label: 'Multas', href: '/multas' },
  { label: 'CNH', href: '/cnh' },
  { label: 'Radar', href: '/radar' },
  { label: 'Legislação', href: '/leis-de-transito' },
  { label: 'Tecnologia', href: '/mobilidade-eletrica' },
  { label: 'Cidadania', href: '/direitos-do-motorista' },
  { label: 'Análise', href: '/contato' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)]">
      <div className="max-w-content mx-auto px-4 md:px-16 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-3">
            <Link href="/" className="block mb-5">
              <Image
                src="/logovariavel2.png"
                alt="Legal Drive"
                width={44}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[var(--on-surface-variant)] text-sm leading-relaxed mb-6">
              Inteligência jurídica a serviço do motorista brasileiro. Tecnologia e expertise para sua mobilidade.
            </p>
            <div className="flex gap-4">
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 flex items-center justify-center border border-[var(--outline-variant)] rounded text-[var(--on-surface-variant)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.653a11.77 11.77 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 flex items-center justify-center border border-[var(--outline-variant)] rounded text-[var(--on-surface-variant)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-5 border-l-2 border-[var(--secondary)] pl-3">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs tracking-widest uppercase text-[var(--secondary)] mb-5 border-l-2 border-[var(--secondary)] pl-3">
              Categorias
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded bg-[var(--surface-container)] text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)] hover:text-[var(--secondary)] transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--outline-variant)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider">
            © 2024 Legal Drive Inteligência Jurídica. Todos os direitos reservados.
          </p>
          <p className="font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider">
            CNPJ 00.000.000/0001-00
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[var(--outline)] uppercase tracking-wider">Desenvolvido por</span>
            <Image
              src="/Kennidi Anderson.png"
              alt="Kennidi Anderson"
              width={80}
              height={24}
              className="h-6 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
