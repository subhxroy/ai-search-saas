'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

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
    navigate,
    setIsLoading,
    setCurrentSources,
    setCurrentFollowUps,
    setConversationId,
    conversationId,
    updateLastAssistantMessage,
    finalizeLastAssistantMessage,
    clearMessages,
  } = useAppStore()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return

    setInput('')

    if (isNewSearch) {
      clearMessages()
      setConversationId(null)
    }

    addMessage({ role: 'user', content: query.trim() })
    navigate('chat')
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
        updateLastAssistantMessage('Sorry, something went wrong. Please try again.')
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
      const state = useAppStore.getState()
      finalizeLastAssistantMessage(state.currentSources, state.currentFollowUps)
    } catch {
      updateLastAssistantMessage('Network error. Please check your connection and try again.')
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
        <div
          className="relative flex items-center"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '8px',
            height: 48,
          }}
        >
          <Search
            className="absolute left-4"
            style={{ width: 18, height: 18, color: 'var(--ash)' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isNewSearch ? "Ask anything..." : "Ask a follow-up..."}
            disabled={isLoading}
            className="w-full pl-12 pr-14 bg-transparent border-none outline-none text-base disabled:opacity-50"
            style={{
              color: 'var(--ink)',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: 14,
              lineHeight: 1.43,
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: input.trim() ? 'var(--primary)' : 'var(--surface-elevated)',
              color: input.trim() ? 'var(--primary-on)' : 'var(--stone)',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s ease',
            }}
          >
            {isLoading ? (
              <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />
            ) : (
              <ArrowRight style={{ width: 16, height: 16 }} />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
