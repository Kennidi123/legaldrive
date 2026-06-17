import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import ScrollReveal from '@/components/ScrollReveal'
import type React from 'react'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Header />
      {children}
      <Footer />
      <ScrollReveal />
    </>
  )
}
