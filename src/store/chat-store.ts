import { create } from 'zustand'

export interface Source {
  title: string
  url: string
  snippet: string
  favicon: string
  host_name?: string
  rank: number
}

export interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  followUps?: string[]
  isStreaming?: boolean
}

interface ChatState {
  // View state
  view: 'home' | 'chat'
  setView: (view: 'home' | 'chat') => void

  // Conversation
  conversationId: string | null
  setConversationId: (id: string | null) => void

  // Messages
  messages: Message[]
  addMessage: (message: Message) => void
  updateLastAssistantMessage: (content: string) => void
  setMessages: (messages: Message[]) => void
  clearMessages: () => void

  // Current response sources
  currentSources: Source[]
  setCurrentSources: (sources: Source[]) => void

  // Current follow-ups
  currentFollowUps: string[]
  setCurrentFollowUps: (followUps: string[]) => void

  // Finalize assistant message (clear streaming, attach sources/followups)
  finalizeLastAssistantMessage: (sources: Source[], followUps: string[]) => void

  // Loading
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Reset
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  view: 'home',
  setView: (view) => set({ view }),

  conversationId: null,
  setConversationId: (id) => set({ conversationId: id }),

  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastAssistantMessage: (content) =>
    set((state) => {
      const messages = [...state.messages]
      const lastIdx = messages.findLastIndex((m) => m.role === 'assistant')
      if (lastIdx >= 0) {
        messages[lastIdx] = { ...messages[lastIdx], content }
      }
      return { messages }
    }),
  finalizeLastAssistantMessage: (sources, followUps) =>
    set((state) => {
      const messages = [...state.messages]
      const lastIdx = messages.findLastIndex((m) => m.role === 'assistant')
      if (lastIdx >= 0) {
        messages[lastIdx] = {
          ...messages[lastIdx],
          isStreaming: false,
          sources,
          followUps,
        }
      }
      return { messages }
    }),
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),

  currentSources: [],
  setCurrentSources: (sources) => set({ currentSources: sources }),

  currentFollowUps: [],
  setCurrentFollowUps: (followUps) => set({ currentFollowUps: followUps }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  reset: () =>
    set({
      view: 'home',
      conversationId: null,
      messages: [],
      currentSources: [],
      currentFollowUps: [],
      isLoading: false,
    }),
}))
