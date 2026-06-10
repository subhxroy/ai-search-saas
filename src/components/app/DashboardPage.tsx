'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import { handleSearch } from '@/lib/search-handler'
import {
  Sparkles,
  Telescope,
  Clock,
  FolderOpen,
  Search,
  MessageSquare,
  ArrowRight,
  Loader2,
  Zap,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Conversation {
  id: string
  title: string
  date: string
  messageCount: number
  preview?: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(dateStr: string): string {
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
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

/* ------------------------------------------------------------------ */
/*  Trending topics data                                               */
/* ------------------------------------------------------------------ */

const trendingTopics = [
  'AI trends 2026',
  'Quantum computing',
  'Climate tech',
  'SaaS growth',
  'Space exploration',
  'Biotech breakthroughs',
]

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

/* ------------------------------------------------------------------ */
/*  DashboardPage component                                            */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { currentUser, isDeepResearch, setIsDeepResearch, navigate, isLoading } =
    useAppStore()

  const [query, setQuery] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConversations, setLoadingConversations] = useState(true)

  const userName = currentUser?.name || 'Researcher'

  // Fetch recent conversations
  useEffect(() => {
    let cancelled = false
    async function fetchConversations() {
      setLoadingConversations(true)
      try {
        const res = await fetch('/api/conversations')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) {
          setConversations(
            data.slice(0, 4).map((c: Record<string, unknown>) => ({
              id: c.id as string,
              title: (c.title as string) || 'Untitled conversation',
              date: (c.createdAt as string) || (c.updatedAt as string) || new Date().toISOString(),
              messageCount: (c.messageCount as number) || 0,
              preview: (c.preview as string) || '',
            }))
          )
        }
      } catch {
        // Use placeholder data on error
        if (!cancelled) {
          setConversations([
            { id: '1', title: 'AI market analysis 2025', date: new Date(Date.now() - 3600000).toISOString(), messageCount: 8, preview: 'Comprehensive overview of AI market trends...' },
            { id: '2', title: 'Quantum computing breakthroughs', date: new Date(Date.now() - 86400000).toISOString(), messageCount: 5, preview: 'Recent advances in quantum error correction...' },
            { id: '3', title: 'SaaS pricing strategies', date: new Date(Date.now() - 172800000).toISOString(), messageCount: 12, preview: 'Analysis of usage-based pricing models...' },
            { id: '4', title: 'Climate tech investments', date: new Date(Date.now() - 345600000).toISOString(), messageCount: 6, preview: 'Top climate tech startups and funding rounds...' },
          ])
        }
      } finally {
        if (!cancelled) setLoadingConversations(false)
      }
    }
    fetchConversations()
    return () => { cancelled = true }
  }, [])

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!query.trim() || isLoading) return
      handleSearch(query.trim())
    },
    [query, isLoading]
  )

  const onTopicClick = useCallback(
    (topic: string) => {
      if (isLoading) return
      handleSearch(topic)
    },
    [isLoading]
  )

  const searchesUsed = 47
  const searchesLimit = currentUser?.plan === 'pro' || currentUser?.plan === 'enterprise' ? 'Unlimited' : '50'

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== WELCOME HEADER ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {getGreeting()}, <span className="gradient-text">{userName}</span>
        </h1>
        <p className="mt-1.5 text-muted-foreground text-sm sm:text-base">
          What would you like to research today?
        </p>
      </motion.div>

      {/* ======== SEARCH BAR ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <form onSubmit={onSearch} className="relative max-w-2xl mx-auto">
          <div className="glass-strong search-glow glow-border rounded-2xl flex items-center gap-3 px-5 py-3.5">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... get answers with sources"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              disabled={isLoading}
            />
            {/* Deep research toggle */}
            <div className="flex items-center gap-2 shrink-0 border-l border-border/50 pl-3">
              <Telescope className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Deep
              </span>
              <Switch
                checked={isDeepResearch}
                onCheckedChange={setIsDeepResearch}
                className="data-[state=checked]:bg-cyan-600"
              />
            </div>
            {/* Submit button */}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ======== QUICK ACTIONS ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex flex-wrap gap-2.5 justify-center max-w-2xl mx-auto">
          <button
            onClick={() => {
              setQuery('')
              navigate('chat')
            }}
            className="glass rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/60 transition-all flex items-center gap-2"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Start New Research
          </button>
          <button
            onClick={() => setIsDeepResearch(!isDeepResearch)}
            className="glass rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/60 transition-all flex items-center gap-2"
          >
            <Telescope className="h-3.5 w-3.5 text-purple-400" />
            Deep Research Mode
          </button>
          <button
            onClick={() => navigate('history')}
            className="glass rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/60 transition-all flex items-center gap-2"
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Browse History
          </button>
          <button
            onClick={() => navigate('collections')}
            className="glass rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/60 transition-all flex items-center gap-2"
          >
            <FolderOpen className="h-3.5 w-3.5 text-emerald-400" />
            View Collections
          </button>
        </div>
      </motion.div>

      {/* ======== RECENT CONVERSATIONS ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent</h2>
          <button
            onClick={() => navigate('history')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {loadingConversations ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="glass rounded-xl p-4 animate-pulse"
              >
                <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
                <div className="h-3 w-1/2 bg-white/5 rounded mb-3" />
                <div className="h-3 w-1/3 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  navigate('chat', { id: conv.id })
                }}
                className="glass rounded-xl p-4 text-left hover:bg-accent/40 transition-all group feature-card"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {conv.title}
                  </h3>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {conv.preview && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5">
                    {conv.preview}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(conv.date)}</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {conv.messageCount}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a search to begin your first research session
            </p>
          </div>
        )}
      </motion.div>

      {/* ======== TRENDING TOPICS ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Trending Topics</h2>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => onTopicClick(topic)}
              disabled={isLoading}
              className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all disabled:opacity-50"
            >
              {topic}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ======== USAGE STATS ======== */}
      <motion.div variants={itemVariants}>
        <div className="glass rounded-xl px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>
              <span className="font-medium text-foreground">
                {currentUser?.plan === 'pro'
                  ? 'Pro Plan'
                  : currentUser?.plan === 'enterprise'
                    ? 'Enterprise Plan'
                    : 'Free Plan'}
              </span>
              {' · '}
              {searchesUsed}/{searchesLimit} searches today
            </span>
          </div>
          {(currentUser?.plan === 'free' || !currentUser?.plan) && (
            <button
              onClick={() => navigate('billing')}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Upgrade
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
