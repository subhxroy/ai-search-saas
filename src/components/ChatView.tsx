'use client'

import { useRef, useEffect } from 'react'
import { useAppStore } from '@/store/app-store'
import MessageBubble from './MessageBubble'
import FollowUpQuestions from './FollowUpQuestions'
import SearchInput from './SearchInput'
import { handleFollowUp } from '@/lib/search-handler'
import { Globe, ExternalLink } from 'lucide-react'

export default function ChatView() {
  const {
    messages,
    isLoading,
    currentSources,
  } = useAppStore()

  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new content
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

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
          {showSources && lastAssistantMsg?.sources && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2.5">
                <Globe className="h-3.5 w-3.5" style={{ color: 'var(--ash)' }} />
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--ash)' }}
                >
                  Sources
                </span>
              </div>
              <div
                className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {lastAssistantMsg.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex-shrink-0 w-56 p-3 rounded-xl transition-all duration-200"
                    style={{
                      background: 'var(--surface-card)',
                      border: '1px solid var(--hairline)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--hairline-strong)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--hairline)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {source.favicon ? (
                        <img
                          src={source.favicon}
                          alt=""
                          className="w-3.5 h-3.5 rounded-sm"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <Globe className="w-3.5 h-3.5" style={{ color: 'var(--stone)' }} />
                      )}
                      <span className="text-[11px] truncate flex-1" style={{ color: 'var(--ash)' }}>
                        {source.host_name || source.domain || new URL(source.url).hostname.replace('www.', '')}
                      </span>
                      <ExternalLink
                        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--ash)' }}
                      />
                    </div>
                    <div
                      className="text-sm font-medium line-clamp-2 leading-snug mb-1"
                      style={{ color: 'var(--ink)' }}
                    >
                      {source.title}
                    </div>
                    {source.snippet && (
                      <div
                        className="text-xs line-clamp-2 leading-relaxed"
                        style={{ color: 'var(--charcoal)' }}
                      >
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
              <div className="flex items-center gap-2 mb-2.5">
                <Globe className="h-3.5 w-3.5" style={{ color: 'var(--ash)' }} />
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--ash)' }}
                >
                  Searching sources...
                </span>
              </div>
              <div
                className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {streamingSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-56 p-3 rounded-xl"
                    style={{
                      background: 'var(--surface-card)',
                      border: '1px solid var(--hairline)',
                      opacity: 0.7,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {source.favicon ? (
                        <img
                          src={source.favicon}
                          alt=""
                          className="w-3.5 h-3.5 rounded-sm"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <Globe className="w-3.5 h-3.5" style={{ color: 'var(--stone)' }} />
                      )}
                      <span className="text-[11px] truncate flex-1" style={{ color: 'var(--ash)' }}>
                        {source.host_name || source.domain || '...'}
                      </span>
                    </div>
                    <div
                      className="text-sm font-medium line-clamp-2 leading-snug"
                      style={{ color: 'var(--ink)' }}
                    >
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
                sources={msg.sources}
                isStreaming={msg.isStreaming}
              />
            </div>
          ))}

          {/* Loading indicator when starting a new search */}
          {isLoading && messages.length > 0 && messages[messages.length - 1].isStreaming && !messages[messages.length - 1].content && (
            <div className="flex items-center gap-2.5 py-2">
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]"
                  style={{ background: 'var(--accent-blue)', opacity: 0.5 }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]"
                  style={{ background: 'var(--accent-blue)', opacity: 0.5 }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: 'var(--accent-blue)', opacity: 0.5 }}
                />
              </div>
              <span className="text-sm" style={{ color: 'var(--ash)' }}>
                Searching the web...
              </span>
            </div>
          )}

          {/* Follow-up questions at the bottom */}
          {showFollowUps && lastAssistantMsg?.followUps && (
            <div className="feature-card-bordered" style={{ padding: '16px 20px' }}>
              <FollowUpQuestions
                questions={lastAssistantMsg.followUps}
                onSelect={handleFollowUp}
              />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Bottom search input - continues conversation */}
      <div
        style={{
          borderTop: '1px solid var(--hairline)',
          background: 'var(--canvas)',
          padding: '12px 16px',
        }}
      >
        <SearchInput isNewSearch={false} />
      </div>
    </div>
  )
}
