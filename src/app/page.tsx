'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore } from '@/store/app-store'
import AppShell from '@/components/app/AppShell'
import LoginPage from '@/components/auth/LoginPage'
import SignupPage from '@/components/auth/SignupPage'
import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage'
import HeroSection from '@/components/landing/HeroSection'
import AIDemoSection from '@/components/landing/AIDemoSection'
import WhyThisProductSection from '@/components/landing/WhyThisProductSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import SocialProofSection from '@/components/landing/SocialProofSection'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import FinalCTASection from '@/components/landing/FinalCTASection'
import Footer from '@/components/landing/Footer'
import ChatView from '@/components/ChatView'
import SearchInput from '@/components/SearchInput'
import { handleSearch } from '@/lib/search-handler'
import { Search, ArrowLeft, Plus, Menu, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

/* ------------------------------------------------------------------ */
/*  Landing page navbar — shared between landing & chat views          */
/* ------------------------------------------------------------------ */

function LandingNavbar({ variant = 'landing' }: { variant?: 'landing' | 'chat' }) {
  const navigate = useAppStore((s) => s.navigate)
  const clearMessages = useAppStore((s) => s.clearMessages)
  const setConversationId = useAppStore((s) => s.setConversationId)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = useCallback(
    (label: string) => {
      setMobileMenuOpen(false)
      if (label === 'Features') {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
      } else if (label === 'Pricing') {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
      } else if (label === 'Customers') {
        document.getElementById('customers')?.scrollIntoView({ behavior: 'smooth' })
      } else if (label === 'Docs') {
        navigate('signup')
      }
    },
    [navigate]
  )

  const navLinks = ['Features', 'Pricing', 'Docs', 'Customers']

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6"
      style={{
        height: variant === 'chat' ? 56 : 64,
        backgroundColor: '#000000',
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {variant === 'chat' ? (
          <>
            <button
              onClick={() => {
                clearMessages()
                setConversationId(null)
                navigate('landing')
              }}
              className="btn-ghost"
              style={{ height: 32, padding: '0 10px', gap: 5, fontSize: 13 }}
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span className="hidden sm:inline">Home</span>
            </button>
            <div style={{ width: 1, height: 20, background: 'var(--hairline)' }} />
            <button
              onClick={() => {
                clearMessages()
                setConversationId(null)
              }}
              className="btn-ghost"
              style={{ height: 32, padding: '0 10px', gap: 5, fontSize: 13 }}
            >
              <Plus style={{ width: 14, height: 14 }} />
              <span className="hidden sm:inline">New search</span>
            </button>
          </>
        ) : (
          <>
            {/* Logo */}
            <button
              onClick={() => navigate('landing')}
              className="flex items-center gap-2"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search style={{ width: 14, height: 14, color: '#fcfdff' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#fcfdff',
                  letterSpacing: '-0.01em',
                }}
              >
                Nexus AI
              </span>
            </button>

            {/* Center: Nav links (desktop) */}
            <nav className="hidden md:flex items-center gap-5 ml-4">
              {navLinks.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(label)
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {variant === 'chat' ? (
          <>
            <button
              onClick={() => navigate('login')}
              className="nav-link hidden sm:block"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign in
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate('signup')}
              style={{ fontSize: 13, padding: '6px 14px', height: 32 }}
            >
              Get Started
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('login')}
              className="nav-link hidden sm:block"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Sign in
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate('signup')}
            >
              Get Started
            </button>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--charcoal)',
              }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu style={{ width: 20, height: 20 }} />
            </button>
          </>
        )}
      </div>

      {/* Mobile menu sheet (landing only) */}
      {variant === 'landing' && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent
            side="right"
            style={{
              background: '#0a0a0c',
              borderLeft: '1px solid var(--hairline)',
            }}
          >
            <SheetHeader>
              <SheetTitle
                style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#fcfdff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Search style={{ width: 12, height: 12, color: '#fcfdff' }} />
                </div>
                Nexus AI
              </SheetTitle>
            </SheetHeader>
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '8px 16px',
              }}
            >
              {navLinks.map((label) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: 15,
                    fontWeight: 500,
                    color: 'var(--charcoal)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    textAlign: 'left',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-card)'
                    e.currentTarget.style.color = 'var(--ink)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none'
                    e.currentTarget.style.color = 'var(--charcoal)'
                  }}
                >
                  {label}
                </button>
              ))}
              <div style={{ height: 1, background: 'var(--hairline)', margin: '8px 0' }} />
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('login')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--charcoal)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  textAlign: 'left',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-card)'
                  e.currentTarget.style.color = 'var(--ink)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = 'var(--charcoal)'
                }}
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('signup')
                }}
                className="btn-primary"
                style={{ marginTop: 8, width: '100%' }}
              >
                Get Started
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Empty chat state for unauthenticated users                         */
/* ------------------------------------------------------------------ */

const SUGGESTED_QUERIES = [
  'Best smartphones under 15k',
  'Top mutual funds for SIP 2026',
  'How to file ITR online',
  'Best laptops under 50k India',
]

function EmptyChatState() {
  const navigate = useAppStore((s) => s.navigate)
  const clearMessages = useAppStore((s) => s.clearMessages)
  const setConversationId = useAppStore((s) => s.setConversationId)

  const handleBack = () => {
    clearMessages()
    setConversationId(null)
    navigate('landing')
  }

  return (
    <div
      className="flex flex-col items-center justify-center flex-1 px-4"
      style={{ minHeight: 'calc(100vh - 56px - 80px)' }}
    >
      <div className="w-full max-w-xl flex flex-col items-center text-center">
        {/* Icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            background: 'var(--surface-card)',
            border: '1px solid var(--hairline-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Search style={{ width: 24, height: 24, color: 'var(--ash)' }} />
        </div>

        {/* Title */}
        <h2
          className="heading-md"
          style={{ marginBottom: 8, textAlign: 'center' }}
        >
          What would you like to search?
        </h2>

        {/* Subtitle */}
        <p
          className="body-sm"
          style={{ marginBottom: 28, textAlign: 'center', maxWidth: 360 }}
        >
          Ask anything and get AI-powered answers with cited sources.
        </p>

        {/* Search input */}
        <div style={{ width: '100%', marginBottom: 28 }}>
          <SearchInput isNewSearch={true} />
        </div>

        {/* Suggested queries */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {SUGGESTED_QUERIES.map((query) => (
            <button
              key={query}
              onClick={() => handleSearch(query)}
              className="badge-pill cursor-pointer"
              style={{ transition: 'background 0.15s ease, color 0.15s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ink)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--charcoal)'
                e.currentTarget.style.background = 'var(--surface-elevated)'
              }}
            >
              {query}
            </button>
          ))}
        </div>

        {/* Back to home */}
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--ash)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ash)' }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          Back to home
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { page, conversationId, setConversationId, isAuthenticated, messages, theme } = useAppStore()
  const [isReady, setIsReady] = useState(false)

  // Enable dark mode by default
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [theme])

  // Session recovery and state recovery on mount
  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const { user, searchesUsed } = await res.json()
          useAppStore.setState({
            currentUser: user,
            isAuthenticated: true,
            searchesUsed: searchesUsed || 0,
          })

          // Restore last page and conversation ID
          const savedPage = localStorage.getItem('nexus_page')
          const savedConvId = localStorage.getItem('nexus_conv_id')
          if (savedPage) {
            useAppStore.setState({ page: savedPage as any })
          } else {
            useAppStore.setState({ page: 'dashboard' })
          }
          if (savedConvId) {
            setConversationId(savedConvId)
            // Fetch messages for this conversation
            const convRes = await fetch(`/api/conversations/${savedConvId}`)
            if (convRes.ok) {
              const { conversation } = await convRes.json()
              if (conversation && conversation.messages) {
                const mappedMessages = conversation.messages.map((m: any) => ({
                  id: m.id,
                  role: m.role,
                  content: m.content,
                  sources: m.sources,
                  followUps: JSON.parse(m.followUps || '[]'),
                  model: m.model,
                }))
                useAppStore.setState({ messages: mappedMessages })
              }
            }
          }
        } else {
          // If unauthorized, reset to landing or current unauthenticated page
          useAppStore.setState({ currentUser: null, isAuthenticated: false })
          useAppStore.setState((state) => {
            if (!['landing', 'login', 'signup', 'forgot-password', 'chat'].includes(state.page)) {
              return { page: 'landing' }
            }
            return {}
          })
        }
      } catch (err) {
        console.warn('Session verification failed:', err)
      } finally {
        setIsReady(true)
      }
    }
    initSession()
  }, [setConversationId])

  // Keep page persisted in localStorage on change
  useEffect(() => {
    if (isReady && page) {
      localStorage.setItem('nexus_page', page)
    }
  }, [page, isReady])

  // Keep conversation ID persisted in localStorage on change
  useEffect(() => {
    if (isReady) {
      if (conversationId) {
        localStorage.setItem('nexus_conv_id', conversationId)
      } else {
        localStorage.removeItem('nexus_conv_id')
      }
    }
  }, [conversationId, isReady])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black" style={{ color: '#fcfdff' }}>
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  // ─── Auth pages (no app shell) ───
  if (page === 'login') return <LoginPage />
  if (page === 'signup') return <SignupPage />
  if (page === 'forgot-password') return <ForgotPasswordPage />

  // ─── Authenticated pages (with app shell) ───
  if (isAuthenticated) {
    return <AppShell />
  }

  // ─── Chat view for unauthenticated users ───
  if (page === 'chat') {
    const hasMessages = messages.length > 0
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000', color: '#fcfdff' }}>
        <LandingNavbar variant="chat" />
        <main className="flex-1 pt-14">
          {hasMessages ? <ChatView /> : <EmptyChatState />}
        </main>
      </div>
    )
  }

  // ─── Landing page (default for unauthenticated) ───
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000', color: '#fcfdff' }}>
      <LandingNavbar variant="landing" />
      <main className="flex-1 pt-16">
        <HeroSection onSearch={handleSearch} />
        <AIDemoSection />
        <WhyThisProductSection />
        <ComparisonSection />
        <SocialProofSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  )
}
