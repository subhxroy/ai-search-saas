'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'
import SearchInput from '@/components/SearchInput'
import ChatView from '@/components/ChatView'
import ConversationSidebar from '@/components/ConversationSidebar'
import { Menu, Sparkles, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { view, sidebarOpen, setSidebarOpen, reset } = useChatStore()

  // Enable dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
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
            onClick={() => reset()}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="text-base font-semibold tracking-tight hidden sm:inline">
              Nexus AI
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => reset()}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">New Search</span>
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <ConversationSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {view === 'home' ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 animate-fade-in">
            <div className="mb-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 leading-tight">
                Where knowledge
                <br />
                <span className="text-primary">begins</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Search the web with AI. Get answers with sources, citations, and
                follow-up suggestions.
              </p>
            </div>
            <SearchInput showSuggestions />
          </div>
        ) : (
          <ChatView />
        )}
      </main>

      {/* Footer */}
      <footer className="h-10 flex items-center justify-center border-t border-border shrink-0">
        <p className="text-xs text-muted-foreground">
          Powered by AI Search &middot; Nexus AI
        </p>
      </footer>
    </div>
  )
}
