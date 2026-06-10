'use client'

import { useRef, useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'
import MessageBubble from './MessageBubble'
import SourceCard from './SourceCard'
import FollowUpQuestions from './FollowUpQuestions'
import SearchInput from './SearchInput'
import { Loader2 } from 'lucide-react'

export default function ChatView() {
  const {
    messages,
    isLoading,
    addMessage,
    setIsLoading,
    setCurrentSources,
    setCurrentFollowUps,
    setConversationId,
    conversationId,
    updateLastAssistantMessage,
    finalizeLastAssistantMessage,
  } = useChatStore()

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

    // Add placeholder assistant message
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
      // Finalize - clear streaming state, attach sources/followups
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

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.map((msg, i) => (
            <div key={i}>
              <MessageBubble
                role={msg.role}
                content={msg.content}
                sources={msg.role === 'assistant' ? msg.sources : undefined}
                isStreaming={msg.isStreaming}
              />

              {/* Sources for assistant messages */}
              {msg.role === 'assistant' &&
                !msg.isStreaming &&
                msg.sources &&
                msg.sources.length > 0 && (
                  <SourceCard sources={msg.sources} />
                )}

              {/* Follow-up questions for assistant messages */}
              {msg.role === 'assistant' &&
                !msg.isStreaming &&
                msg.followUps &&
                msg.followUps.length > 0 && (
                  <FollowUpQuestions
                    questions={msg.followUps}
                    onSelect={handleFollowUp}
                  />
                )}
            </div>
          ))}

          {/* Loading indicator when starting a new search */}
          {isLoading && messages.length > 0 && messages[messages.length - 1].isStreaming && !messages[messages.length - 1].content && (
            <div className="flex items-center gap-2 text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Searching the web...</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom search input - continues conversation */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-4">
        <SearchInput isNewSearch={false} />
      </div>
    </div>
  )
}
