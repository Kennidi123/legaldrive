'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { type SiteUser, getStoredUser, getToken, fetchMe, clearAuth } from '@/lib/site-auth'
import AuthModal from './AuthModal'
import ChangePasswordModal from './ChangePasswordModal'

interface SiteAuthContextValue {
  user: SiteUser | null
  openAuth: (mode?: 'login' | 'register') => void
  openPassword: () => void
  logout: () => void
}

const SiteAuthContext = createContext<SiteAuthContextValue | null>(null)

export function useSiteAuth(): SiteAuthContextValue {
  const ctx = useContext(SiteAuthContext)
  if (!ctx) throw new Error('useSiteAuth deve ser usado dentro de <SiteAuthProvider>')
  return ctx
}

export default function SiteAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SiteUser | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [pwOpen, setPwOpen] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
    // Valida a sessão; só desloga se o token for explicitamente inválido (401).
    ;(async () => {
      try {
        const me = await fetchMe()
        if (me) setUser(me)
        else if (getToken()) {
          clearAuth()
          setUser(null)
        }
      } catch {
        /* erro de rede: mantém a sessão local */
      }
    })()
  }, [])

  const openAuth = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode)
    setAuthOpen(true)
  }, [])
  const openPassword = useCallback(() => setPwOpen(true), [])
  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
  }, [])

  return (
    <SiteAuthContext.Provider value={{ user, openAuth, openPassword, logout }}>
      {children}
      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onAuthed={(u) => {
            setUser(u)
            setAuthOpen(false)
          }}
        />
      )}
      {pwOpen && <ChangePasswordModal onClose={() => setPwOpen(false)} />}
    </SiteAuthContext.Provider>
  )
}
