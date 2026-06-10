'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import AppShell from '@/components/app/AppShell'
import LoginPage from '@/components/auth/LoginPage'
import SignupPage from '@/components/auth/SignupPage'
import HeroSection from '@/components/landing/HeroSection'
import AIDemoSection from '@/components/landing/AIDemoSection'
import WhyThisProductSection from '@/components/landing/WhyThisProductSection'
import ResearchWorkflowSection from '@/components/landing/ResearchWorkflowSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import SocialProofSection from '@/components/landing/SocialProofSection'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import FinalCTASection from '@/components/landing/FinalCTASection'
import Footer from '@/components/landing/Footer'
import { handleSearch } from '@/lib/search-handler'
import { Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { page, isAuthenticated, theme, navigate, setTheme } = useAppStore()

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
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <Sparkles className="h-8 w-8 text-cyan-400 mx-auto" />
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            className="w-full h-11 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
          >
            Send Reset Link
          </button>
          <button
            onClick={() => navigate('login')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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

  // ─── Landing page (default for unauthenticated) ───
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="text-base font-semibold tracking-tight">Nexus AI</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground text-sm"
            onClick={() => navigate('login')}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(139,92,246,0.9))' }}
            onClick={() => navigate('signup')}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Landing content */}
      <main className="flex-1 pt-16">
        <div id="hero-search">
          <HeroSection onSearch={handleSearch} />
        </div>
        <AIDemoSection />
        <WhyThisProductSection />
        <ResearchWorkflowSection />
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
