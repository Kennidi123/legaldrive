import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import ScrollReveal from '@/components/ScrollReveal'
import SiteAuthProvider from '@/components/SiteAuthProvider'
import type React from 'react'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteAuthProvider>
      <ScrollProgress />
      <Header />
      {children}
      <Footer />
      <ScrollReveal />
    </SiteAuthProvider>
  )
}
