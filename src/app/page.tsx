'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import AppShell from '@/components/app/AppShell'
import LoginPage from '@/components/auth/LoginPage'
import SignupPage from '@/components/auth/SignupPage'
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
import { handleSearch, handleFollowUp } from '@/lib/search-handler'
import { Search, ArrowLeft, Plus } from 'lucide-react'

export default function Home() {
  const { page, isAuthenticated, messages, theme, navigate, setTheme, clearMessages, setConversationId } = useAppStore()

  // Enable dark mode by default
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [theme])

  // ─── Auth pages (no app shell) ───
  if (page === 'login') return <LoginPage />
  if (page === 'signup') return <SignupPage />
  if (page === 'forgot-password') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#000000' }}>
        <div
          className="max-w-md w-full text-center space-y-6 p-8"
          style={{
            background: '#0a0a0c',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <Search style={{ width: 20, height: 20, color: '#3b9eff' }} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: '28px',
              fontWeight: 400,
              lineHeight: 1.1,
              color: '#fcfdff',
            }}
          >
            Reset Password
          </h1>
          <p className="body-sm" style={{ color: '#a1a4a5' }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            className="text-input w-full"
          />
          <button className="btn-primary w-full" style={{ height: 44 }}>
            Send Reset Link
          </button>
          <button
            onClick={() => navigate('login')}
            className="nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  // ─── Authenticated pages (with app shell) ───
  if (isAuthenticated) {
    return <AppShell />
  }

  // ─── Chat view for unauthenticated users ───
  // When messages exist, show the chat interface
  const hasMessages = messages.length > 0

  if (hasMessages && page === 'chat') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000', color: '#fcfdff' }}>
        {/* Chat top bar */}
        <header
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
          style={{
            height: 56,
            backgroundColor: '#000000',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearMessages()
                setConversationId(null)
                navigate('landing')
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ash)',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Back
            </button>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)' }} />
            <button
              onClick={() => {
                clearMessages()
                setConversationId(null)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ash)',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              New search
            </button>
          </div>
          <div className="flex items-center gap-3">
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
          </div>
        </header>

        {/* Chat content */}
        <main className="flex-1 pt-14">
          <ChatView />
        </main>
      </div>
    )
  }

  // ─── Landing page (default for unauthenticated) ───
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000', color: '#fcfdff' }}>
      {/* Navbar — Resend style */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6"
        style={{
          height: 64,
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Left: Wordmark */}
        <div className="flex items-center gap-6">
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

          {/* Center: Nav links (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-5">
            {['Features', 'Pricing', 'Docs', 'Customers'].map((label) => (
              <a
                key={label}
                href={label === 'Pricing' ? '#pricing' : '#'}
                className="nav-link"
                onClick={(e) => {
                  if (label === 'Pricing') {
                    e.preventDefault()
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Sign in + CTA */}
        <div className="flex items-center gap-3">
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
        </div>
      </header>

      {/* Landing content */}
      <main className="flex-1 pt-16">
        <div id="hero-search">
          <HeroSection onSearch={handleSearch} />
        </div>
        <AIDemoSection />
        <WhyThisProductSection />
        <ComparisonSection />
        <SocialProofSection />
        <div id="pricing">
          <PricingSection />
        </div>
        <FAQSection />
        <FinalCTASection />
        <Footer />
      </main>
    </div>
  )
}
