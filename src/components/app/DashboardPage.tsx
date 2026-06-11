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
  TrendingUp,
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
  { label: 'AI trends 2026', icon: TrendingUp },
  { label: 'Quantum computing', icon: Sparkles },
  { label: 'Climate tech', icon: Zap },
  { label: 'SaaS growth', icon: ArrowRight },
  { label: 'Space exploration', icon: Telescope },
  { label: 'Biotech breakthroughs', icon: Sparkles },
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
  const [searchFocused, setSearchFocused] = useState(false)
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
        <h1 className="heading-md" style={{ fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.3 }}>
          {getGreeting()},{' '}
          <span style={{ fontFamily: 'var(--font-serif), Georgia, Times New Roman, serif', color: 'var(--ink)' }}>
            {userName}
          </span>
        </h1>
        <p className="body-sm mt-1.5" style={{ color: 'var(--charcoal)' }}>
          What would you like to research today?
        </p>
      </motion.div>

      {/* ======== SEARCH BAR ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <form onSubmit={onSearch} className="max-w-2xl mx-auto">
          <div
            style={{
              background: 'var(--surface-card)',
              border: `1px solid ${searchFocused ? 'var(--ink)' : 'var(--hairline-strong)'}`,
              borderRadius: '12px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0 16px',
              transition: 'border-color 0.15s ease',
            }}
          >
            <Search
              className="h-4 w-4 shrink-0"
              style={{ color: 'var(--ash)' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Ask anything... get answers with sources"
              className="flex-1 bg-transparent outline-none text-base"
              style={{
                color: 'var(--ink)',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
              disabled={isLoading}
            />
            {/* Deep research toggle */}
            <div
              className="flex items-center gap-2 shrink-0"
              style={{ borderLeft: '1px solid var(--hairline)', paddingLeft: '12px' }}
            >
              <Telescope
                className="h-3.5 w-3.5"
                style={{ color: 'var(--ash)' }}
              />
              <span
                className="text-xs hidden sm:inline"
                style={{ color: 'var(--ash)' }}
              >
                Deep
              </span>
              <Switch
                checked={isDeepResearch}
                onCheckedChange={setIsDeepResearch}
                style={{ backgroundColor: isDeepResearch ? 'var(--accent-blue)' : undefined }}
              />
            </div>
            {/* Submit button */}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="btn-primary shrink-0"
              style={{
                height: '32px',
                width: '32px',
                padding: 0,
                borderRadius: '8px',
                minWidth: '32px',
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
          {/* Keyboard shortcut hint */}
          <div className="flex justify-center mt-2">
            <span style={{ fontSize: 11, color: 'var(--stone)' }}>
              Press <kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', fontSize: 10 }}>Enter</kbd> to search · <kbd style={{ padding: '1px 4px', borderRadius: '3px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', fontSize: 10 }}>⌘K</kbd> from anywhere
            </span>
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
            className="btn-ghost"
            style={{ borderRadius: '9999px', gap: '8px' }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-blue)' }} />
            Start New Research
          </button>
          <button
            onClick={() => setIsDeepResearch(!isDeepResearch)}
            className="btn-ghost"
            style={{ borderRadius: '9999px', gap: '8px' }}
          >
            <Telescope className="h-3.5 w-3.5" style={{ color: 'var(--accent-orange)' }} />
            Deep Research
          </button>
          <button
            onClick={() => navigate('history')}
            className="btn-ghost"
            style={{ borderRadius: '9999px', gap: '8px' }}
          >
            <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent-yellow)' }} />
            Browse History
          </button>
          <button
            onClick={() => navigate('collections')}
            className="btn-ghost"
            style={{ borderRadius: '9999px', gap: '8px' }}
          >
            <FolderOpen className="h-3.5 w-3.5" style={{ color: 'var(--accent-green)' }} />
            View Collections
          </button>
        </div>
      </motion.div>

      {/* ======== RECENT CONVERSATIONS ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-sm" style={{ fontSize: '18px' }}>Recent</h2>
          <button
            onClick={() => navigate('history')}
            className="flex items-center gap-1"
            style={{
              color: 'var(--ash)',
              fontSize: '13px',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              transition: 'color 0.15s ease',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ash)')}
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
                className="feature-card-bordered animate-pulse"
                style={{ padding: '16px' }}
              >
                <div
                  className="mb-2"
                  style={{
                    height: '16px',
                    width: '75%',
                    background: 'var(--surface-elevated)',
                    borderRadius: '4px',
                  }}
                />
                <div
                  className="mb-3"
                  style={{
                    height: '12px',
                    width: '50%',
                    background: 'var(--surface-elevated)',
                    borderRadius: '4px',
                  }}
                />
                <div
                  style={{
                    height: '12px',
                    width: '33%',
                    background: 'var(--surface-elevated)',
                    borderRadius: '4px',
                  }}
                />
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
                className="feature-card-bordered text-left group transition-all duration-200"
                style={{ padding: '16px', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hairline-strong)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = ''
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3
                    className="text-sm font-medium line-clamp-1"
                    style={{
                      color: 'var(--ink)',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    }}
                  >
                    {conv.title}
                  </h3>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--ash)' }}
                  />
                </div>
                {conv.preview && (
                  <p
                    className="text-xs line-clamp-2 mb-2.5"
                    style={{ color: 'var(--charcoal)' }}
                  >
                    {conv.preview}
                  </p>
                )}
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: 'var(--ash)' }}
                >
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
          <div
            className="feature-card-bordered text-center"
            style={{ padding: '32px' }}
          >
            <MessageSquare
              className="h-8 w-8 mx-auto mb-3"
              style={{ color: 'var(--ash)' }}
            />
            <p className="body-sm" style={{ color: 'var(--charcoal)' }}>No conversations yet</p>
            <p
              className="mt-1"
              style={{
                color: 'var(--stone)',
                fontSize: '13px',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
            >
              Start a search to begin your first research session
            </p>
          </div>
        )}
      </motion.div>

      {/* ======== TRENDING TOPICS ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <h2 className="heading-sm mb-4" style={{ fontSize: '18px' }}>Trending Topics</h2>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <button
              key={topic.label}
              onClick={() => onTopicClick(topic.label)}
              disabled={isLoading}
              className="badge-pill flex items-center gap-1.5"
              style={{
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'color 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                border: '1px solid var(--hairline)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.color = 'var(--ink)'
                  e.currentTarget.style.borderColor = 'var(--hairline-strong)'
                  e.currentTarget.style.background = 'var(--surface-card)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--charcoal)'
                e.currentTarget.style.borderColor = 'var(--hairline)'
                e.currentTarget.style.background = 'var(--surface-elevated)'
              }}
            >
              <topic.icon className="h-3 w-3" style={{ color: 'var(--stone)' }} />
              {topic.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ======== USAGE STATS ======== */}
      <motion.div variants={itemVariants}>
        <div
          className="feature-card-bordered flex items-center justify-between flex-wrap gap-3"
          style={{ padding: '12px 16px' }}
        >
          <div className="flex items-center gap-2">
            <Zap
              className="h-3.5 w-3.5"
              style={{ color: 'var(--accent-blue)' }}
            />
            <span
              style={{
                color: 'var(--ash)',
                fontSize: '13px',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
            >
              <span style={{ color: 'var(--ink)', fontWeight: 500 }}>
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
              style={{
                color: 'var(--accent-blue)',
                fontWeight: 500,
                fontSize: '13px',
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                transition: 'color 0.15s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-blue)')}
            >
              Upgrade
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
