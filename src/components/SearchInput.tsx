'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { handleSearch, handleFollowUp } from '@/lib/search-handler'

interface SearchInputProps {
  showSuggestions?: boolean
  /** If true, starts a new search (clears messages). If false, continues conversation. */
  isNewSearch?: boolean
}

export default function SearchInput({ isNewSearch = true }: SearchInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isLoading } = useAppStore()

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const query = input.trim()
    setInput('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    if (isNewSearch) {
      handleSearch(query)
    } else {
      handleFollowUp(query)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        const query = input.trim()
        setInput('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
        if (isNewSearch) {
          handleSearch(query)
        } else {
          handleFollowUp(query)
        }
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className="relative flex items-end"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: '12px',
            minHeight: 48,
            padding: '6px 6px 6px 14px',
            transition: 'border-color 0.15s ease',
          }}
        >
          <Search
            className="shrink-0 mb-2"
            style={{ width: 18, height: 18, color: 'var(--ash)' }}
          />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={isNewSearch ? 'Ask anything... get answers with sources' : 'Ask a follow-up...'}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none outline-none resize-none pl-3 pr-2 disabled:opacity-50"
            style={{
              color: 'var(--ink)',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: 14,
              lineHeight: 1.43,
              minHeight: 36,
              maxHeight: 120,
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 flex items-center justify-center mb-0.5"
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: input.trim() ? 'var(--primary)' : 'var(--surface-elevated)',
              color: input.trim() ? 'var(--primary-on)' : 'var(--stone)',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
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
