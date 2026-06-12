'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Clock,
  Search,
  Pin,
  PinOff,
  Trash2,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Conversation {
  id: string
  title: string
  date: string
  messageCount: number
  preview: string
  pinned: boolean
  type: 'chat' | 'research'
}

type FilterTab = 'all' | 'pinned' | 'research' | 'chat'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRelativeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function getDateGroup(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return 'This Week'
    return 'Older'
  } catch {
    return 'Older'
  }
}

const dateGroupOrder: Record<string, number> = {
  Today: 0,
  Yesterday: 1,
  'This Week': 2,
  Older: 3,
}

/* ------------------------------------------------------------------ */
/*  Fallback data                                                      */
/* ------------------------------------------------------------------ */

const fallbackConversations: Conversation[] = [
  {
    id: '1',
    title: 'AI market analysis 2025',
    date: new Date(Date.now() - 1800000).toISOString(),
    messageCount: 8,
    preview: 'Comprehensive overview of AI market trends and growth projections for the coming year...',
    pinned: true,
    type: 'research',
  },
  {
    id: '2',
    title: 'Quantum computing breakthroughs',
    date: new Date(Date.now() - 7200000).toISOString(),
    messageCount: 5,
    preview: 'Recent advances in quantum error correction and fault-tolerant computing...',
    pinned: false,
    type: 'research',
  },
  {
    id: '3',
    title: 'SaaS pricing strategies',
    date: new Date(Date.now() - 86400000).toISOString(),
    messageCount: 12,
    preview: 'Analysis of usage-based pricing models and their impact on customer retention...',
    pinned: false,
    type: 'chat',
  },
  {
    id: '4',
    title: 'Climate tech investments',
    date: new Date(Date.now() - 172800000).toISOString(),
    messageCount: 6,
    preview: 'Top climate tech startups and funding rounds in Q4 2025...',
    pinned: true,
    type: 'research',
  },
  {
    id: '5',
    title: 'React Server Components guide',
    date: new Date(Date.now() - 345600000).toISOString(),
    messageCount: 4,
    preview: 'Deep dive into RSC architecture patterns and best practices...',
    pinned: false,
    type: 'chat',
  },
  {
    id: '6',
    title: 'Neural architecture search',
    date: new Date(Date.now() - 604800000).toISOString(),
    messageCount: 9,
    preview: 'Automated approaches to finding optimal neural network architectures...',
    pinned: false,
    type: 'research',
  },
  {
    id: '7',
    title: 'Startup pitch deck tips',
    date: new Date(Date.now() - 1209600000).toISOString(),
    messageCount: 3,
    preview: 'Key elements of a compelling pitch deck for early-stage fundraising...',
    pinned: false,
    type: 'chat',
  },
]

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
}

/* ------------------------------------------------------------------ */
/*  HistoryPage component                                              */
/* ------------------------------------------------------------------ */

export default function HistoryPage() {
  const { navigate } = useAppStore()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch conversations
  useEffect(() => {
    let cancelled = false
    async function fetchConversations() {
      setLoading(true)
      try {
        const res = await fetch('/api/conversations')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!cancelled && Array.isArray(data.conversations)) {
          setConversations(
            data.conversations.map((c: Record<string, unknown>) => ({
              id: c.id as string,
              title: (c.title as string) || 'Untitled conversation',
              date: (c.updatedAt as string) || (c.createdAt as string) || new Date().toISOString(),
              messageCount: Array.isArray(c.messages) ? c.messages.length : 0,
              preview:
                Array.isArray(c.messages) && c.messages.length > 0
                  ? ((c.messages[0] as Record<string, unknown>)?.content as string)?.slice(0, 120) || ''
                  : '',
              pinned: (c.pinned as boolean) || false,
              type: (c.isDeepResearch as boolean) ? 'research' : 'chat',
            }))
          )
        }
      } catch {
        if (!cancelled) {
          setConversations(fallbackConversations)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchConversations()
    return () => {
      cancelled = true
    }
  }, [])

  // Toggle pin
  const togglePin = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    )
  }, [])

  // Delete conversation
  const deleteConversation = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    } catch {
      // Silently handle - still remove locally
    }
    setConversations((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
  }, [])

  // Filter and group
  const filteredConversations = useMemo(() => {
    let result = conversations

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
      )
    }

    // Tab filter
    if (activeTab === 'pinned') {
      result = result.filter((c) => c.pinned)
    } else if (activeTab === 'research') {
      result = result.filter((c) => c.type === 'research')
    } else if (activeTab === 'chat') {
      result = result.filter((c) => c.type === 'chat')
    }

    return result
  }, [conversations, searchQuery, activeTab])

  const groupedConversations = useMemo(() => {
    const groups: Record<string, Conversation[]> = {}
    for (const conv of filteredConversations) {
      const group = getDateGroup(conv.date)
      if (!groups[group]) groups[group] = []
      groups[group].push(conv)
    }
    // Sort groups by order
    return Object.entries(groups).sort(
      ([a], [b]) => (dateGroupOrder[a] ?? 99) - (dateGroupOrder[b] ?? 99)
    )
  }, [filteredConversations])

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pinned', label: 'Pinned' },
    { key: 'research', label: 'Research' },
    { key: 'chat', label: 'Chat' },
  ]

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="h-10 w-10 rounded-xl glass flex items-center justify-center">
            <Clock className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">History</h1>
            <p className="text-sm text-muted-foreground">
              All your research conversations
            </p>
          </div>
        </div>
      </motion.div>

      {/* ======== SEARCH BAR ======== */}
      <motion.div variants={itemVariants} className="mb-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 bg-white/[0.03] border-white/[0.06] focus:border-cyan-500/30 focus:ring-cyan-500/10 h-10 rounded-xl"
          />
        </div>
      </motion.div>

      {/* ======== FILTER TABS ======== */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-accent text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto">
            <Badge variant="secondary" className="text-xs font-medium">
              {filteredConversations.length}{' '}
              {filteredConversations.length === 1 ? 'conversation' : 'conversations'}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* ======== CONVERSATION LIST ======== */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-3/5 bg-white/5 rounded" />
                <div className="h-3 w-16 bg-white/5 rounded" />
              </div>
              <div className="h-3 w-4/5 bg-white/5 rounded mb-2" />
              <div className="h-3 w-1/4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filteredConversations.length === 0 ? (
        /* ======== EMPTY STATE ======== */
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-2xl glass-strong flex items-center justify-center mx-auto">
              <Clock className="h-9 w-9 text-muted-foreground/50" />
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
              <Sparkles className="h-3 w-3 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Start your first research and it will appear here
          </p>
          <Button
            onClick={() => navigate('chat')}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl px-6"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </motion.div>
      ) : (
        /* ======== DATE-GROUPED LIST ======== */
        <div className="space-y-8">
          {groupedConversations.map(([group, convs]) => (
            <div key={group}>
              <motion.h3
                variants={itemVariants}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
              >
                {group}
              </motion.h3>
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {convs.map((conv, i) => (
                    <motion.div
                      key={conv.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: i * 0.04 }}
                      layout
                    >
                      <button
                        onClick={() => navigate('chat', { id: conv.id })}
                        className="w-full glass rounded-xl p-4 text-left hover:bg-accent/40 transition-all group feature-card"
                      >
                        <div className="flex items-start gap-3">
                          {/* Type indicator */}
                          <div
                            className={`shrink-0 mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center ${
                              conv.type === 'research'
                                ? 'bg-purple-500/10 ring-1 ring-purple-500/20'
                                : 'bg-cyan-500/10 ring-1 ring-cyan-500/20'
                            }`}
                          >
                            {conv.type === 'research' ? (
                              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            ) : (
                              <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-sm font-medium text-foreground truncate group-hover:text-cyan-400 transition-colors">
                                {conv.title}
                              </h4>
                              {conv.pinned && (
                                <Pin className="h-3 w-3 text-amber-400 shrink-0" />
                              )}
                            </div>
                            {conv.preview && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                                {conv.preview}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{getRelativeDate(conv.date)}</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {conv.messageCount}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`text-[10px] px-1.5 py-0 h-4 font-medium ${
                                  conv.type === 'research'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                }`}
                              >
                                {conv.type === 'research' ? 'Research' : 'Chat'}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => togglePin(conv.id, e)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-accent/80 transition-colors"
                              aria-label={conv.pinned ? 'Unpin' : 'Pin'}
                            >
                              {conv.pinned ? (
                                <PinOff className="h-3.5 w-3.5 text-amber-400" />
                              ) : (
                                <Pin className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                            <button
                              onClick={(e) => deleteConversation(conv.id, e)}
                              disabled={deletingId === conv.id}
                              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors disabled:opacity-50"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>

                          {/* Hover arrow */}
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-0.5" />
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
