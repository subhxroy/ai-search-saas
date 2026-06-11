import { useAppStore } from '@/store/app-store'

export async function handleSearch(query: string) {
  const store = useAppStore.getState()
  if (!query.trim() || store.isLoading) return

  // Clear previous state
  store.clearMessages()
  store.setConversationId(null)
  store.addMessage({ role: 'user', content: query.trim() })
  store.navigate('chat')
  store.setIsLoading(true)
  store.setCurrentSources([])
  store.setCurrentFollowUps([])
  store.addMessage({ role: 'assistant', content: '', isStreaming: true })

  const isDeep = store.isDeepResearch

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query.trim(),
        deepResearch: isDeep,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      console.error('Chat API error:', res.status, errorText?.slice(0, 200))

      // Provide user-friendly error messages based on status code
      let userMessage = 'I encountered an error while searching. Please try again.'
      if (res.status === 502 || res.status === 504) {
        userMessage = 'The search service is taking too long to respond. Please try again in a moment.'
      } else if (res.status === 429) {
        userMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (res.status === 500) {
        userMessage = 'Something went wrong on our end. Please try again.'
      }

      store.updateLastAssistantMessage(userMessage)
      store.finalizeLastAssistantMessage([], [])
      store.setIsLoading(false)
      return
    }

    const reader = res.body?.getReader()
    if (!reader) {
      store.updateLastAssistantMessage('Failed to read response. Please try again.')
      store.finalizeLastAssistantMessage([], [])
      store.setIsLoading(false)
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
              store.setCurrentSources(parsed.data)
            } else if (parsed.type === 'token') {
              accumulatedText += parsed.data
              store.updateLastAssistantMessage(accumulatedText)
            } else if (parsed.type === 'followups') {
              store.setCurrentFollowUps(parsed.data)
            } else if (parsed.type === 'done') {
              store.setConversationId(parsed.data.conversationId)
            } else if (parsed.type === 'progress') {
              store.setResearchProgress(parsed.data)
            }
          } catch {
            // skip malformed JSON lines
          }
        }
      }
    }

    const finalState = useAppStore.getState()
    store.finalizeLastAssistantMessage(
      finalState.currentSources,
      finalState.currentFollowUps
    )
  } catch (err) {
    console.error('Search handler error:', err)
    store.updateLastAssistantMessage(
      'Network error. Please check your connection and try again.'
    )
    store.finalizeLastAssistantMessage([], [])
  } finally {
    store.setIsLoading(false)
    store.setResearchProgress(0)
  }
}

export async function handleFollowUp(question: string) {
  const store = useAppStore.getState()
  if (!question.trim() || store.isLoading) return

  store.addMessage({ role: 'user', content: question.trim() })
  store.setIsLoading(true)
  store.setCurrentSources([])
  store.setCurrentFollowUps([])
  store.addMessage({ role: 'assistant', content: '', isStreaming: true })

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: question.trim(),
        conversationId: store.conversationId || undefined,
      }),
    })

    if (!res.ok) {
      let userMessage = 'Something went wrong. Please try again.'
      if (res.status === 502 || res.status === 504) {
        userMessage = 'The search service is taking too long. Please try again in a moment.'
      }
      store.updateLastAssistantMessage(userMessage)
      store.finalizeLastAssistantMessage([], [])
      store.setIsLoading(false)
      return
    }

    const reader = res.body?.getReader()
    if (!reader) {
      store.updateLastAssistantMessage('Failed to read response.')
      store.finalizeLastAssistantMessage([], [])
      store.setIsLoading(false)
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
              store.setCurrentSources(parsed.data)
            } else if (parsed.type === 'token') {
              accumulatedText += parsed.data
              store.updateLastAssistantMessage(accumulatedText)
            } else if (parsed.type === 'followups') {
              store.setCurrentFollowUps(parsed.data)
            } else if (parsed.type === 'done') {
              store.setConversationId(parsed.data.conversationId)
            }
          } catch {
            // skip
          }
        }
      }
    }

    const finalState = useAppStore.getState()
    store.finalizeLastAssistantMessage(
      finalState.currentSources,
      finalState.currentFollowUps
    )
  } catch (err) {
    console.error('Follow-up error:', err)
    store.updateLastAssistantMessage('Network error. Please try again.')
    store.finalizeLastAssistantMessage([], [])
  } finally {
    store.setIsLoading(false)
  }
}
