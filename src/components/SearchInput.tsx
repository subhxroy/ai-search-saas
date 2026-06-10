'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { useChatStore } from '@/store/chat-store'

const SUGGESTIONS = [
  {
    icon: '🔬',
    title: 'Latest breakthroughs',
    subtitle: 'in quantum computing',
    query: 'What are the latest breakthroughs in quantum computing?',
  },
  {
    icon: '📈',
    title: 'AI SaaS trends',
    subtitle: 'shaping 2026',
    query: 'What AI SaaS trends are shaping 2026?',
  },
  {
    icon: '🌍',
    title: 'Climate tech solutions',
    subtitle: 'making real impact',
    query: 'What climate tech solutions are making real impact?',
  },
  {
    icon: '💊',
    title: 'Healthcare AI innovations',
    subtitle: 'transforming patient care',
    query: 'How is AI transforming healthcare and patient care?',
  },
]

interface SearchInputProps {
  showSuggestions?: boolean
  /** If true, starts a new search (clears messages). If false, continues conversation. */
  isNewSearch?: boolean
}

export default function SearchInput({ showSuggestions = false, isNewSearch = true }: SearchInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    isLoading,
    addMessage,
    setView,
    setIsLoading,
    setCurrentSources,
    setCurrentFollowUps,
    setConversationId,
    conversationId,
    updateLastAssistantMessage,
    finalizeLastAssistantMessage,
    clearMessages,
  } = useChatStore()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return

    setInput('')

    if (isNewSearch) {
      // Start fresh: clear old messages and conversation
      clearMessages()
      setConversationId(null)
    }

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
        body: JSON.stringify({
          query: query.trim(),
          conversationId: isNewSearch ? undefined : (conversationId || undefined),
        }),
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
      // Finalize the message - clear streaming state and attach sources/followups
      const state = useChatStore.getState()
      finalizeLastAssistantMessage(state.currentSources, state.currentFollowUps)
    } catch {
      updateLastAssistantMessage(
        'Network error. Please check your connection and try again.'
      )
      finalizeLastAssistantMessage([], [])
    } finally {
      setIsLoading(false)
    }
  }

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(input)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={onFormSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isNewSearch ? "Ask anything..." : "Ask a follow-up..."}
            disabled={isLoading}
            className="w-full h-14 pl-12 pr-14 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-base disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(s.query)}
              disabled={isLoading}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left group disabled:opacity-50"
            >
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {s.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {s.subtitle}
                </div>
              </div>
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
