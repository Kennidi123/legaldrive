import type { Metadata } from 'next'
import { Chivo, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://legaldrive.com.br'),
  openGraph: {
    siteName: 'Legal Drive',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${chivo.variable} ${geist.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
