'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Share2,
  Copy,
  ShieldOff,
  ExternalLink,
  Eye,
  Globe,
  Lock,
  Sparkles,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SharedChat {
  id: string
  conversationId: string
  title: string
  slug: string
  isPublic: boolean
  accessCount: number
  createdAt: string
}

/* ------------------------------------------------------------------ */
/*  Mock data (MVP)                                                    */
/* ------------------------------------------------------------------ */

const mockSharedChats: SharedChat[] = [
  {
    id: 'shared-1',
    conversationId: 'conv-1',
    title: 'AI Market Analysis 2025',
    slug: 'ai-market-analysis-2025-xk3m',
    isPublic: true,
    accessCount: 142,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'shared-2',
    conversationId: 'conv-4',
    title: 'Climate Tech Investments',
    slug: 'climate-tech-investments-q7rn',
    isPublic: false,
    accessCount: 3,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
]

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

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
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
/*  SharedPage component                                               */
/* ------------------------------------------------------------------ */

export default function SharedPage() {
  const { navigate } = useAppStore()

  const [sharedChats, setSharedChats] = useState<SharedChat[]>(mockSharedChats)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  // Copy share link
  const copyLink = useCallback(async (slug: string, id: string) => {
    const link = `https://nexus.ai/share/${slug}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  // Revoke access
  const revokeAccess = useCallback((id: string) => {
    setRevokingId(id)
    setTimeout(() => {
      setSharedChats((prev) => prev.filter((c) => c.id !== id))
      setRevokingId(null)
    }, 400)
  }, [])

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
            <Share2 className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shared Chats</h1>
            <p className="text-sm text-muted-foreground">
              Conversations you&apos;ve shared with others
            </p>
          </div>
        </div>
      </motion.div>

      {/* ======== SHARED CHAT LIST ======== */}
      {sharedChats.length === 0 ? (
        /* ======== EMPTY STATE ======== */
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-2xl glass-strong flex items-center justify-center mx-auto">
              <Share2 className="h-9 w-9 text-muted-foreground/50" />
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
              <ExternalLink className="h-3 w-3 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No shared chats yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Share a conversation to collaborate with others
          </p>
          <Button
            onClick={() => navigate('chat')}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl px-6"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start a Chat
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sharedChats.map((chat, i) => (
              <motion.div
                key={chat.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: i * 0.05 }}
                layout
              >
                <div className="glass rounded-xl p-4 sm:p-5 hover:bg-accent/30 transition-all group feature-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="shrink-0 h-10 w-10 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20 flex items-center justify-center">
                      <Share2 className="h-[18px] w-[18px] text-cyan-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-cyan-400 transition-colors">
                          {chat.title}
                        </h3>
                        {/* Visibility badge */}
                        <Badge
                          variant="secondary"
                          className={`shrink-0 text-[10px] px-1.5 py-0 h-[18px] font-medium ${
                            chat.isPublic
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {chat.isPublic ? (
                            <Globe className="h-2.5 w-2.5 mr-0.5" />
                          ) : (
                            <Lock className="h-2.5 w-2.5 mr-0.5" />
                          )}
                          {chat.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </div>

                      {/* Share link */}
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-xs text-muted-foreground bg-white/[0.03] px-2 py-0.5 rounded-md truncate max-w-[240px]">
                          nexus.ai/share/{chat.slug}
                        </code>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {chat.accessCount} views
                        </span>
                        <span>{getRelativeDate(chat.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyLink(chat.slug, chat.id)}
                        className="h-8 rounded-lg text-muted-foreground hover:text-foreground gap-1.5"
                      >
                        {copiedId === chat.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-xs text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span className="text-xs hidden sm:inline">Copy</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => revokeAccess(chat.id)}
                        disabled={revokingId === chat.id}
                        className="h-8 rounded-lg text-muted-foreground hover:text-destructive gap-1.5 disabled:opacity-50"
                      >
                        <ShieldOff className="h-3.5 w-3.5" />
                        <span className="text-xs hidden sm:inline">Revoke</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
