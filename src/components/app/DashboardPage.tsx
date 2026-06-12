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
  { label: 'Best phones under 20k', icon: TrendingUp },
  { label: 'SIP mutual funds 2026', icon: Sparkles },
  { label: 'UPSC preparation tips', icon: Zap },
  { label: 'IPL 2026 updates', icon: ArrowRight },
  { label: 'Startup ideas India', icon: Telescope },
  { label: 'Best laptops under 50k', icon: Sparkles },
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
        const convList = data.conversations
        if (!cancelled && Array.isArray(convList)) {
          setConversations(
            convList.slice(0, 4).map((c: Record<string, unknown>) => ({
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
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <h1
          style={{
            fontFamily: 'var(--font-serif), Georgia, Times New Roman, serif',
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
          }}
        >
          {getGreeting()}, {userName}
        </h1>
        <p
          className="mt-2"
          style={{
            fontSize: 16,
            color: 'var(--ash)',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            lineHeight: 1.5,
          }}
        >
          What would you like to research today?
        </p>
      </motion.div>

      {/* ======== SEARCH BAR — HERO ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <form onSubmit={onSearch} className="max-w-2xl mx-auto">
          <div
            style={{
              background: 'var(--surface-card)',
              border: `1.5px solid ${searchFocused ? 'var(--accent-blue)' : 'var(--hairline-strong)'}`,
              borderRadius: '14px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0 18px',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxShadow: searchFocused ? '0 0 0 3px rgba(59,158,255,0.12)' : 'none',
            }}
          >
            <Search
              className="shrink-0"
              style={{ width: 18, height: 18, color: searchFocused ? 'var(--accent-blue)' : 'var(--ash)', transition: 'color 0.15s ease' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Ask anything — get answers with sources"
              className="flex-1 bg-transparent outline-none"
              style={{
                color: 'var(--ink)',
                fontSize: 15,
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
              disabled={isLoading}
            />
            {/* Deep research toggle */}
            <div
              className="flex items-center gap-2 shrink-0"
              style={{ borderLeft: '1px solid var(--hairline)', paddingLeft: '14px' }}
            >
              <Telescope
                className="shrink-0"
                style={{ width: 15, height: 15, color: isDeepResearch ? 'var(--accent-blue)' : 'var(--ash)', transition: 'color 0.15s ease' }}
              />
              <span
                className="hidden sm:inline"
                style={{ color: isDeepResearch ? 'var(--accent-blue)' : 'var(--ash)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-inter), system-ui, sans-serif', transition: 'color 0.15s ease' }}
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
                height: '36px',
                width: '36px',
                padding: 0,
                borderRadius: '8px',
                minWidth: '36px',
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
          <div className="flex justify-center mt-3">
            <span style={{ fontSize: 12, color: 'var(--stone)', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
              Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', fontSize: 11, fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>Enter</kbd> to search · <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', fontSize: 11, fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>⌘K</kbd> from anywhere
            </span>
          </div>
        </form>
      </motion.div>

      {/* ======== QUICK ACTIONS ======== */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
          <button
            onClick={() => {
              setQuery('')
              navigate('chat')
            }}
            className="btn-ghost"
            style={{
              borderRadius: '9999px',
              gap: '8px',
              padding: '8px 18px',
              fontSize: 13,
              border: '1px solid var(--hairline-strong)',
              background: 'var(--surface-card)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-blue)'
              e.currentTarget.style.background = 'rgba(59,158,255,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline-strong)'
              e.currentTarget.style.background = 'var(--surface-card)'
            }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-blue)' }} />
            Start New Research
          </button>
          <button
            onClick={() => setIsDeepResearch(!isDeepResearch)}
            className="btn-ghost"
            style={{
              borderRadius: '9999px',
              gap: '8px',
              padding: '8px 18px',
              fontSize: 13,
              border: isDeepResearch ? '1px solid var(--accent-blue)' : '1px solid var(--hairline-strong)',
              background: isDeepResearch ? 'rgba(59,158,255,0.06)' : 'var(--surface-card)',
            }}
          >
            <Telescope className="h-3.5 w-3.5" style={{ color: 'var(--accent-orange)' }} />
            Deep Research
          </button>
          <button
            onClick={() => navigate('history')}
            className="btn-ghost"
            style={{
              borderRadius: '9999px',
              gap: '8px',
              padding: '8px 18px',
              fontSize: 13,
              border: '1px solid var(--hairline-strong)',
              background: 'var(--surface-card)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-yellow)'
              e.currentTarget.style.background = 'rgba(255,197,61,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline-strong)'
              e.currentTarget.style.background = 'var(--surface-card)'
            }}
          >
            <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent-yellow)' }} />
            Browse History
          </button>
          <button
            onClick={() => navigate('collections')}
            className="btn-ghost"
            style={{
              borderRadius: '9999px',
              gap: '8px',
              padding: '8px 18px',
              fontSize: 13,
              border: '1px solid var(--hairline-strong)',
              background: 'var(--surface-card)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-green)'
              e.currentTarget.style.background = 'rgba(17,255,153,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline-strong)'
              e.currentTarget.style.background = 'var(--surface-card)'
            }}
          >
            <FolderOpen className="h-3.5 w-3.5" style={{ color: 'var(--accent-green)' }} />
            View Collections
          </button>
        </div>
      </motion.div>

      {/* ======== RECENT CONVERSATIONS ======== */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ash)',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Recent
          </h2>
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
              fontWeight: 500,
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
                style={{ padding: '14px 16px', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--hairline-strong)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = ''
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="text-sm font-medium line-clamp-1"
                    style={{
                      color: 'var(--ink)',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: 14,
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
                    className="line-clamp-2 mb-3"
                    style={{
                      color: 'var(--charcoal)',
                      fontSize: 13,
                      lineHeight: 1.45,
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    }}
                  >
                    {conv.preview}
                  </p>
                )}
                <div
                  className="flex items-center gap-3"
                  style={{
                    color: 'var(--stone)',
                    fontSize: 12,
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  }}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(conv.date)}
                  </span>
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
            style={{ padding: '40px 32px' }}
          >
            <MessageSquare
              className="h-8 w-8 mx-auto mb-3"
              style={{ color: 'var(--stone)' }}
            />
            <p
              style={{
                color: 'var(--charcoal)',
                fontSize: 14,
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              No conversations yet
            </p>
            <p
              className="mt-1.5"
              style={{
                color: 'var(--stone)',
                fontSize: 13,
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
              }}
            >
              Start a search to begin your first research session
            </p>
          </div>
        )}
      </motion.div>

      {/* ======== TRENDING TOPICS ======== */}
      <motion.div variants={itemVariants} className="mb-12">
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ash)',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Trending Topics
        </h2>
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
                fontSize: 13,
                padding: '6px 12px',
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
          style={{ padding: '14px 18px' }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: currentUser?.plan === 'pro'
                  ? 'rgba(17,255,153,0.1)'
                  : currentUser?.plan === 'enterprise'
                    ? 'rgba(255,128,31,0.1)'
                    : 'rgba(59,158,255,0.1)',
                flexShrink: 0,
              }}
            >
              <Zap
                style={{
                  width: 16,
                  height: 16,
                  color: currentUser?.plan === 'pro'
                    ? 'var(--accent-green)'
                    : currentUser?.plan === 'enterprise'
                      ? 'var(--accent-orange)'
                      : 'var(--accent-blue)',
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: 'var(--ink)',
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  }}
                >
                  {currentUser?.plan === 'pro'
                    ? 'Pro Plan'
                    : currentUser?.plan === 'enterprise'
                      ? 'Enterprise Plan'
                      : 'Free Plan'}
                </span>
                {(currentUser?.plan === 'pro' || currentUser?.plan === 'enterprise') && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      color: currentUser?.plan === 'pro' ? 'var(--accent-green)' : 'var(--accent-orange)',
                      background: currentUser?.plan === 'pro' ? 'rgba(17,255,153,0.1)' : 'rgba(255,128,31,0.1)',
                      letterSpacing: '0.03em',
                    }}
                  >
                    ACTIVE
                  </span>
                )}
              </div>
              <span
                style={{
                  color: 'var(--ash)',
                  fontSize: 13,
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                }}
              >
                {searchesUsed}/{searchesLimit} searches today
              </span>
            </div>
          </div>
          {(currentUser?.plan === 'free' || !currentUser?.plan) && (
            <button
              onClick={() => navigate('billing')}
              style={{
                color: 'var(--accent-blue)',
                fontWeight: 500,
                fontSize: 13,
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                transition: 'color 0.15s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-blue)')}
            >
              Upgrade →
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
