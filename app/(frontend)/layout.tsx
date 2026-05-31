import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type React from 'react'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
