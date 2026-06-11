'use client'

import { useRef, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import MessageBubble from './MessageBubble'
import SourceCard from './SourceCard'
import FollowUpQuestions from './FollowUpQuestions'
import SearchInput from './SearchInput'
import { Loader2, Globe, ExternalLink } from 'lucide-react'

export default function ChatView() {
  const {
    messages,
    isLoading,
    currentSources,
    addMessage,
    setIsLoading,
    setCurrentSources,
    setCurrentFollowUps,
    setConversationId,
    conversationId,
    updateLastAssistantMessage,
    finalizeLastAssistantMessage,
  } = useAppStore()

  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleFollowUp = async (question: string) => {
    addMessage({ role: 'user', content: question })
    setIsLoading(true)
    setCurrentSources([])
    setCurrentFollowUps([])
    addMessage({ role: 'assistant', content: '', isStreaming: true })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question,
          conversationId: conversationId || undefined,
        }),
      })

      if (!res.ok) {
        updateLastAssistantMessage('Something went wrong. Please try again.')
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

      const state = useAppStore.getState()
      finalizeLastAssistantMessage(state.currentSources, state.currentFollowUps)
    } catch (err) {
      console.error('Follow-up error:', err)
      updateLastAssistantMessage('Network error. Please try again.')
      finalizeLastAssistantMessage([], [])
    } finally {
      setIsLoading(false)
    }
  }

  // Get the last assistant message's sources and follow-ups
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant')
  const showSources = lastAssistantMsg && !lastAssistantMsg.isStreaming && lastAssistantMsg.sources && lastAssistantMsg.sources.length > 0
  const showFollowUps = lastAssistantMsg && !lastAssistantMsg.isStreaming && lastAssistantMsg.followUps && lastAssistantMsg.followUps.length > 0

  // Show current streaming sources
  const streamingSources = (isLoading && currentSources.length > 0) ? currentSources : []

  return (
    <div className="flex-1 flex flex-col h-full" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 py-6">

          {/* Show sources at the top like Perplexity */}
          {(showSources && lastAssistantMsg?.sources) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Globe style={{ width: 16, height: 16, color: 'var(--ash)' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)' }}>Sources</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {lastAssistantMsg.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-shrink-0 w-56 p-3 transition-colors"
                    style={{
                      borderRadius: '12px',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--hairline)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {source.favicon ? (
                        <img src={source.favicon} alt="" className="w-4 h-4 rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <Globe style={{ width: 16, height: 16, color: 'var(--ash)' }} />
                      )}
                      <span className="truncate flex-1" style={{ fontSize: 12, color: 'var(--ash)' }}>
                        {source.host_name || source.domain || new URL(source.url).hostname.replace('www.', '')}
                      </span>
                      <ExternalLink style={{ width: 12, height: 12, color: 'var(--ash)', opacity: 0, transition: 'opacity 0.15s' }} className="group-hover:!opacity-100" />
                    </div>
                    <div className="line-clamp-2 leading-snug" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                      {source.title}
                    </div>
                    {source.snippet && (
                      <div className="line-clamp-2 mt-1 leading-relaxed" style={{ fontSize: 12, color: 'var(--ash)' }}>
                        {source.snippet}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Show streaming sources while loading */}
          {streamingSources.length > 0 && !showSources && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Globe style={{ width: 16, height: 16, color: 'var(--ash)' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)' }}>Searching sources...</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {streamingSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-56 p-3"
                    style={{
                      borderRadius: '12px',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--hairline)',
                      opacity: 0.7,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {source.favicon ? (
                        <img src={source.favicon} alt="" className="w-4 h-4 rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <Globe style={{ width: 16, height: 16, color: 'var(--ash)' }} />
                      )}
                      <span className="truncate flex-1" style={{ fontSize: 12, color: 'var(--ash)' }}>
                        {source.host_name || source.domain || '...'}
                      </span>
                    </div>
                    <div className="line-clamp-2 leading-snug" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                      {source.title}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i}>
              <MessageBubble
                role={msg.role}
                content={msg.content}
                isStreaming={msg.isStreaming}
              />
            </div>
          ))}

          {/* Loading indicator when starting a new search */}
          {isLoading && messages.length > 0 && messages[messages.length - 1].isStreaming && !messages[messages.length - 1].content && (
            <div className="flex items-center gap-2 py-2" style={{ color: 'var(--ash)' }}>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span style={{ fontSize: 14 }}>Searching the web...</span>
            </div>
          )}

          {/* Follow-up questions at the bottom */}
          {showFollowUps && lastAssistantMsg?.followUps && (
            <FollowUpQuestions
              questions={lastAssistantMsg.followUps}
              onSelect={handleFollowUp}
            />
          )}
        </div>
      </div>

      {/* Bottom search input - continues conversation */}
      <div
        style={{
          borderTop: '1px solid var(--hairline)',
          background: 'var(--canvas)',
          padding: '16px',
        }}
      >
        <SearchInput isNewSearch={false} />
      </div>
    </div>
  )
}
