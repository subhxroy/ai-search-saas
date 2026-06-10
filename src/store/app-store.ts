import { create } from 'zustand'

export type AppPage =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'onboarding'
  | 'dashboard'
  | 'chat'
  | 'research'
  | 'history'
  | 'collections'
  | 'shared'
  | 'library'
  | 'profile'
  | 'settings'
  | 'billing'
  | 'workspace'
  | 'api-keys'
  | 'admin'
  | 'analytics'
  | 'docs'
  | 'blog'
  | 'support'
  | 'legal'
  | 'error'

export interface Source {
  title: string
  url: string
  snippet: string
  favicon: string
  host_name?: string
  domain?: string
  rank: number
}

export interface Message {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  sources?: Source[]
  followUps?: string[]
  isStreaming?: boolean
  model?: string
}

interface AppState {
  // Navigation
  page: AppPage
  setPage: (page: AppPage) => void
  pageParams: Record<string, string>
  setPageParams: (params: Record<string, string>) => void
  navigate: (page: AppPage, params?: Record<string, string>) => void

  // Auth (simplified - local user state)
  isAuthenticated: boolean
  setIsAuthenticated: (v: boolean) => void
  currentUser: {
    id: string
    email: string
    name: string
    avatar: string
    role: string
    plan: string
    onboarded: boolean
    company?: string
    jobTitle?: string
    bio?: string
  } | null
  setCurrentUser: (user: AppState['currentUser']) => void
  logout: () => void

  // Chat
  conversationId: string | null
  setConversationId: (id: string | null) => void
  messages: Message[]
  addMessage: (message: Message) => void
  updateLastAssistantMessage: (content: string) => void
  finalizeLastAssistantMessage: (sources: Source[], followUps: string[]) => void
  setMessages: (messages: Message[]) => void
  clearMessages: () => void
  currentSources: Source[]
  setCurrentSources: (sources: Source[]) => void
  currentFollowUps: string[]
  setCurrentFollowUps: (followUps: string[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isDeepResearch: boolean
  setIsDeepResearch: (v: boolean) => void
  researchProgress: number
  setResearchProgress: (v: number) => void

  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Theme
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void

  // Reset
  reset: () => void
}

const defaultUser = {
  id: 'local-user',
  email: 'user@nexus.ai',
  name: 'Researcher',
  avatar: '',
  role: 'user',
  plan: 'pro',
  onboarded: true,
  company: 'Nexus Labs',
  jobTitle: 'Senior Researcher',
  bio: 'Exploring the frontiers of AI-powered research and knowledge discovery.',
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  page: 'landing',
  setPage: (page) => set({ page }),
  pageParams: {},
  setPageParams: (params) => set({ pageParams: params }),
  navigate: (page, params) => {
    set({ page, pageParams: params || {} })
    window.scrollTo({ top: 0 })
  },

  // Auth
  isAuthenticated: false,
  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () =>
    set({
      isAuthenticated: false,
      currentUser: null,
      page: 'landing',
      messages: [],
      conversationId: null,
      currentSources: [],
      currentFollowUps: [],
    }),

  // Chat
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
  isDeepResearch: false,
  setIsDeepResearch: (v) => set({ isDeepResearch: v }),
  researchProgress: 0,
  setResearchProgress: (v) => set({ researchProgress: v }),

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Theme
  theme: 'dark',
  setTheme: (theme) => {
    set({ theme })
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },

  // Reset
  reset: () =>
    set({
      messages: [],
      conversationId: null,
      currentSources: [],
      currentFollowUps: [],
      isLoading: false,
      isDeepResearch: false,
      researchProgress: 0,
    }),
}))

// Helper to login (simplified local auth)
export function loginAsDefault() {
  const store = useAppStore.getState()
  store.setCurrentUser(defaultUser)
  store.setIsAuthenticated(true)
  store.navigate('dashboard')
}

export function loginAsAdmin() {
  const store = useAppStore.getState()
  store.setCurrentUser({ ...defaultUser, role: 'admin' })
  store.setIsAuthenticated(true)
  store.navigate('admin')
}
