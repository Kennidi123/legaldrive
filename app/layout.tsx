import type { Metadata, Viewport } from 'next'
import { Chivo, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrive.com.br'

const chivo = Chivo({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-chivo',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Legal Drive | Inteligência em Direito de Trânsito',
    template: '%s | Legal Drive',
  },
  description:
    'Inteligência jurídica aplicada ao Direito de Trânsito. Análise técnica sobre multas, CNH, radares e legislação para o motorista brasileiro.',
  metadataBase: new URL(siteUrl),
  applicationName: 'Legal Drive',
  authors: [{ name: 'Legal Drive' }],
  creator: 'Legal Drive',
  publisher: 'Legal Drive',
  category: 'Direito de Trânsito',
  keywords: [
    'direito de trânsito',
    'multas de trânsito',
    'recurso de multa',
    'CNH suspensa',
    'bafômetro',
    'radar',
    'CTB',
    'pontos na carteira',
  ],
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  formatDetection: { telephone: false },
  openGraph: {
    siteName: 'Legal Drive',
    title: 'Legal Drive | Inteligência em Direito de Trânsito',
    description:
      'Inteligência jurídica aplicada ao Direito de Trânsito. Análise técnica sobre multas, CNH, radares e legislação para o motorista brasileiro.',
    url: siteUrl,
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: `${siteUrl}/og`, width: 1200, height: 630, alt: 'Legal Drive — Inteligência em Direito de Trânsito' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Drive | Inteligência em Direito de Trânsito',
    description:
      'Inteligência jurídica aplicada ao Direito de Trânsito. Multas, CNH, radares e legislação para o motorista brasileiro.',
    images: [`${siteUrl}/og`],
    site: '@legaldrive',
    creator: '@legaldrive',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${chivo.variable} ${geist.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
