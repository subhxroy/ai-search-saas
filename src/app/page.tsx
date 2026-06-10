'use client'

import { useEffect, useCallback } from 'react'
import { useChatStore } from '@/store/chat-store'
import ChatView from '@/components/ChatView'
import ConversationSidebar from '@/components/ConversationSidebar'
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
import { Menu, Sparkles, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const {
    view,
    setView,
    sidebarOpen,
    setSidebarOpen,
    reset,
    addMessage,
    setIsLoading,
    setCurrentSources,
    setCurrentFollowUps,
    setConversationId,
    conversationId,
    updateLastAssistantMessage,
    finalizeLastAssistantMessage,
    clearMessages,
  } = useChatStore()

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return

      // Clear old messages and start fresh
      clearMessages()
      setConversationId(null)
      addMessage({ role: 'user', content: query.trim() })
      setView('chat')
      setIsLoading(true)
      setCurrentSources([])
      setCurrentFollowUps([])

      // Add placeholder assistant message
      addMessage({ role: 'assistant', content: '', isStreaming: true })

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
        })

        if (!res.ok) {
          updateLastAssistantMessage(
            'Sorry, something went wrong. Please try again.'
          )
          finalizeLastAssistantMessage([], [])
          setIsLoading(false)
          return
        }

        const reader = res.body?.getReader()
        if (!reader) {
          updateLastAssistantMessage('Failed to read response.')
          finalizeLastAssistantMessage([], [])
          setIsLoading(false)
          return
        }

        const decoder = new TextDecoder()
        let accumulatedText = ''
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6))
                if (parsed.type === 'sources') {
                  setCurrentSources(parsed.data)
                } else if (parsed.type === 'token') {
                  accumulatedText += parsed.data
                  updateLastAssistantMessage(accumulatedText)
                } else if (parsed.type === 'followups') {
                  setCurrentFollowUps(parsed.data)
                } else if (parsed.type === 'done') {
                  setConversationId(parsed.data.conversationId)
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
        // Finalize the message
        const state = useChatStore.getState()
        finalizeLastAssistantMessage(
          state.currentSources,
          state.currentFollowUps
        )
      } catch {
        updateLastAssistantMessage(
          'Network error. Please check your connection and try again.'
        )
        finalizeLastAssistantMessage([], [])
      } finally {
        setIsLoading(false)
      }
    },
    [
      addMessage,
      clearMessages,
      conversationId,
      finalizeLastAssistantMessage,
      setConversationId,
      setCurrentFollowUps,
      setCurrentSources,
      setIsLoading,
      setView,
      updateLastAssistantMessage,
    ]
  )

  const handleBackToLanding = () => {
    reset()
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar - always visible */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {view === 'chat' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToLanding}
              className="h-9 w-9 mr-1"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-9 w-9"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <button
            onClick={handleBackToLanding}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-base font-semibold tracking-tight hidden sm:inline">
              Nexus AI
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {view === 'chat' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLanding}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">New Search</span>
            </Button>
          )}
          {view === 'home' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-sm"
                onClick={() => {
                  document
                    .getElementById('pricing')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Pricing
              </Button>
              <Button
                size="sm"
                className="text-sm font-medium"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(139,92,246,0.9))',
                }}
                onClick={() => {
                  document
                    .getElementById('hero-search')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <ConversationSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {view === 'home' ? (
          /* Landing Page */
          <div className="pt-16">
            {/* Hero Section */}
            <div id="hero-search">
              <HeroSection onSearch={handleSearch} />
            </div>

            {/* AI Demo Section */}
            <AIDemoSection />

            {/* Why This Product */}
            <WhyThisProductSection />

            {/* Research Workflow */}
            <ResearchWorkflowSection />

            {/* Comparison */}
            <ComparisonSection />

            {/* Social Proof */}
            <SocialProofSection />

            {/* Pricing */}
            <div id="pricing">
              <PricingSection />
            </div>

            {/* FAQ */}
            <FAQSection />

            {/* Final CTA */}
            <FinalCTASection />

            {/* Footer */}
            <Footer />
          </div>
        ) : (
          /* Chat View */
          <div className="pt-16 flex-1 flex flex-col">
            <ChatView />
          </div>
        )}
      </main>
    </div>
  )
}
