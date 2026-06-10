'use client'

import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useAppStore, type Message, type Source } from '@/store/app-store'
import { handleSearch, handleFollowUp } from '@/lib/search-handler'
import {
  Search,
  ArrowRight,
  Loader2,
  Telescope,
  Sparkles,
  ExternalLink,
  Globe,
  Plus,
  Send,
  Microscope,
  TrendingUp,
  Brain,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

/* ------------------------------------------------------------------ */
/*  Suggestion cards data (matching landing hero)                      */
/* ------------------------------------------------------------------ */

const SUGGESTIONS = [
  {
    icon: Microscope,
    title: 'Latest breakthroughs',
    subtitle: 'in quantum computing',
    query: 'What are the latest breakthroughs in quantum computing?',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: TrendingUp,
    title: 'AI SaaS trends',
    subtitle: 'shaping 2026',
    query: 'What AI SaaS trends are shaping 2026?',
    gradient: 'from-purple-500/10 to-pink-500/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: Globe,
    title: 'Climate tech solutions',
    subtitle: 'making real impact',
    query: 'What climate tech solutions are making real impact?',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Brain,
    title: 'Healthcare AI innovations',
    subtitle: 'transforming patient care',
    query: 'How is AI transforming healthcare and patient care?',
    gradient: 'from-amber-500/10 to-orange-500/10',
    iconColor: 'text-amber-400',
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

/* ------------------------------------------------------------------ */
/*  Citation processor                                                 */
/* ------------------------------------------------------------------ */

function processCitations(content: string, sources: Source[]): string {
  if (!sources.length) return content
  return content.replace(/\[(\d+)\]/g, (match, numStr) => {
    const idx = parseInt(numStr, 10) - 1
    if (idx >= 0 && idx < sources.length) {
      const url = sources[idx].url
      return `[${match}](${url})`
    }
    return match
  })
}

/* ------------------------------------------------------------------ */
/*  Source card (inline for ChatPage)                                  */
/* ------------------------------------------------------------------ */

function ChatSourceCard({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-4 mb-2">
      <div className="flex items-center gap-2 mb-2.5">
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Sources
        </span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-56 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-accent/50 hover:border-cyan-500/20 transition-all duration-300"
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
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className="text-[11px] text-muted-foreground truncate flex-1">
                {source.host_name || source.domain || new URL(source.url).hostname}
              </span>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-sm font-medium text-foreground line-clamp-2 leading-snug mb-1">
              {source.title}
            </div>
            {source.snippet && (
              <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {source.snippet}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Follow-up questions (inline for ChatPage)                          */
/* ------------------------------------------------------------------ */

function ChatFollowUps({
  questions,
  onSelect,
}: {
  questions: string[]
  onSelect: (q: string) => void
}) {
  if (!questions || questions.length === 0) return null

  return (
    <div className="mt-3 pt-3 border-t border-border/40">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Follow up
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {questions.slice(0, 3).map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/40 bg-card/30 hover:bg-accent/40 hover:border-cyan-500/15 transition-all duration-200 text-left"
          >
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-cyan-400 shrink-0 transition-colors" />
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-snug">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Streaming cursor                                                   */
/* ------------------------------------------------------------------ */

function StreamingCursor() {
  return (
    <span className="inline-block w-0.5 h-[1.1em] bg-cyan-400 animate-blink ml-0.5 align-text-bottom rounded-full" />
  )
}

/* ------------------------------------------------------------------ */
/*  Loading dots                                                       */
/* ------------------------------------------------------------------ */

function LoadingDots() {
  return (
    <div className="flex items-center gap-2.5 text-muted-foreground">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce" />
      </div>
      <span className="text-sm text-muted-foreground/70">
        Searching and analyzing sources...
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Custom markdown components                                         */
/* ------------------------------------------------------------------ */

function getMarkdownComponents(sources: Source[]) {
  return {
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      const isCitation = href && children && String(children).match(/^\[\d+\]$/)
      if (isCitation) {
        const num = String(children).match(/\d+/)?.[0]
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-cyan-500/15 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/25 transition-colors no-underline align-middle mx-0.5"
            title={sources[parseInt(num || '1', 10) - 1]?.title || 'Source'}
          >
            {num}
          </a>
        )
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
        >
          {children}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      )
    },
    p: ({ children }: { children?: ReactNode }) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0 text-foreground">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-xl font-bold mt-5 mb-2 text-foreground">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-3 border-cyan-500/30 pl-4 italic text-muted-foreground my-3">
        {children}
      </blockquote>
    ),
    code: ({
      className,
      children,
    }: {
      className?: string
      children?: ReactNode
    }) => {
      const isInline = !className
      if (isInline) {
        return (
          <code className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono text-cyan-300">
            {children}
          </code>
        )
      }
      return (
        <div className="relative my-3">
          <code
            className={`${className || ''} block bg-muted/60 border border-border/30 p-4 rounded-xl text-sm font-mono overflow-x-auto leading-relaxed`}
          >
            {children}
          </code>
        </div>
      )
    },
    pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic text-foreground/90">{children}</em>
    ),
    hr: () => <hr className="my-4 border-border/40" />,
    table: ({ children }: { children?: ReactNode }) => (
      <div className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th className="border border-border/40 px-3 py-2 bg-muted/50 text-left font-medium">
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="border border-border/40 px-3 py-2">{children}</td>
    ),
  }
}

/* ================================================================== */
/*  MAIN: ChatPage                                                     */
/* ================================================================== */

export default function ChatPage() {
  const {
    messages,
    isLoading,
    conversationId,
    isDeepResearch,
    setIsDeepResearch,
    researchProgress,
  } = useAppStore()

  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  /* ---- Auto-scroll on new messages/tokens ---- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  /* ---- Auto-resize textarea ---- */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  /* ---- Handle submit ---- */
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return
      const query = input.trim()
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      if (!conversationId) {
        handleSearch(query)
      } else {
        handleFollowUp(query)
      }
    },
    [input, isLoading, conversationId]
  )

  /* ---- Handle suggestion click ---- */
  const onSuggestionClick = useCallback(
    (query: string) => {
      if (isLoading) return
      handleSearch(query)
    },
    [isLoading]
  )

  /* ---- Handle follow-up click ---- */
  const onFollowUpClick = useCallback(
    (question: string) => {
      if (isLoading) return
      handleFollowUp(question)
    },
    [isLoading]
  )

  /* ---- Keyboard: Enter to submit, Shift+Enter for newline ---- */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (input.trim() && !isLoading) {
          const query = input.trim()
          setInput('')
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
          }
          if (!conversationId) {
            handleSearch(query)
          } else {
            handleFollowUp(query)
          }
        }
      }
    },
    [input, isLoading, conversationId]
  )

  /* ---- Deep research progress display ---- */
  const researchSteps = useMemo(
    () => [
      { label: 'Searching...', threshold: 20 },
      { label: 'Reading sources...', threshold: 45 },
      { label: 'Analyzing...', threshold: 70 },
      { label: 'Generating report...', threshold: 90 },
      { label: 'Complete', threshold: 100 },
    ],
    []
  )

  const currentStep = useMemo(
    () =>
      researchSteps.findIndex(
        (step, i) =>
          researchProgress <= step.threshold &&
          (i === 0 || researchProgress > researchSteps[i - 1].threshold)
      ),
    [researchProgress, researchSteps]
  )

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="flex flex-col h-full relative">
      {/* ============ MESSAGES AREA ============ */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        <AnimatePresence mode="wait">
          {isEmpty ? (
            /* ============ EMPTY STATE ============ */
            <motion.div
              key="empty"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12"
            >
              {/* Logo & Title */}
              <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10 mx-auto mb-4">
                  <Sparkles className="h-7 w-7 text-cyan-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  <span className="gradient-text">Ask anything...</span>
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                  Get AI-powered answers with real-time sources and citations
                </p>
              </motion.div>

              {/* Suggestion cards */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-8"
              >
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestionClick(s.query)}
                    disabled={isLoading}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-accent/40 hover:border-cyan-500/15 transition-all duration-300 text-left disabled:opacity-50 feature-card"
                  >
                    <div
                      className={`h-8 w-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0 ring-1 ring-white/5`}
                    >
                      <s.icon className={`h-4 w-4 ${s.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate group-hover:text-cyan-400 transition-colors">
                        {s.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {s.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>

              {/* Inline search bar for empty state */}
              <motion.div variants={itemVariants} className="w-full max-w-2xl">
                <form onSubmit={onSubmit}>
                  <div className="glass-strong search-glow glow-border rounded-2xl flex items-center gap-3 px-5 py-3.5">
                    <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Ask anything... get answers with sources"
                      rows={1}
                      className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base resize-none max-h-[120px]"
                      disabled={isLoading}
                    />
                    <div className="flex items-center gap-2 shrink-0 border-l border-border/40 pl-3">
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
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white disabled:opacity-40 transition-opacity hover:shadow-lg hover:shadow-cyan-500/20"
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
            </motion.div>
          ) : (
            /* ============ MESSAGES LIST ============ */
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto px-4 py-6 space-y-1"
            >
              {messages.map((msg, i) => {
                if (msg.role === 'system') return null

                /* ---- User message ---- */
                if (msg.role === 'user') {
                  return (
                    <div key={i} className="flex justify-end mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="max-w-[80%] sm:max-w-[70%] px-5 py-3 rounded-2xl rounded-br-md bg-gradient-to-br from-cyan-600 to-purple-600 text-white text-[15px] leading-relaxed shadow-lg shadow-cyan-500/10"
                      >
                        {msg.content}
                      </motion.div>
                    </div>
                  )
                }

                /* ---- Assistant message ---- */
                const sources = msg.sources || []
                const followUps = msg.followUps || []
                const processedContent = sources.length
                  ? processCitations(msg.content, sources)
                  : msg.content
                const markdownComponents = getMarkdownComponents(sources)

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mb-6 max-w-full"
                  >
                    {/* Assistant label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-5 w-5 rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/5">
                        <Sparkles className="h-3 w-3 text-cyan-400" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Nexus AI
                      </span>
                      {isDeepResearch && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 font-semibold">
                          Deep Research
                        </span>
                      )}
                    </div>

                    {/* Content glass card */}
                    <div className="glass rounded-2xl p-4 sm:p-5">
                      <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed">
                        {msg.content ? (
                          <>
                            <ReactMarkdown components={markdownComponents}>
                              {processedContent}
                            </ReactMarkdown>
                            {msg.isStreaming && <StreamingCursor />}
                          </>
                        ) : msg.isStreaming ? (
                          <LoadingDots />
                        ) : null}
                      </div>

                      {/* Deep research progress (during streaming) */}
                      {msg.isStreaming && isDeepResearch && researchProgress > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/30">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">
                              {currentStep >= 0
                                ? researchSteps[currentStep].label
                                : 'Processing...'}
                            </span>
                            <span className="text-xs font-medium text-cyan-400">
                              {researchProgress}%
                            </span>
                          </div>
                          <Progress
                            value={researchProgress}
                            className="h-1.5 bg-muted/50 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-purple-500"
                          />
                        </div>
                      )}

                      {/* Source cards */}
                      {!msg.isStreaming && sources.length > 0 && (
                        <ChatSourceCard sources={sources} />
                      )}

                      {/* Follow-up questions */}
                      {!msg.isStreaming && followUps.length > 0 && (
                        <ChatFollowUps
                          questions={followUps}
                          onSelect={onFollowUpClick}
                        />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============ BOTTOM INPUT BAR (visible when messages exist) ============ */}
      {!isEmpty && (
        <div className="sticky bottom-0 border-t border-border/30 glass-strong px-4 py-3">
          <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    conversationId
                      ? 'Ask a follow-up...'
                      : 'Ask anything...'
                  }
                  rows={1}
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground outline-none text-sm resize-none max-h-[120px] focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10 transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0 pb-0.5">
                {/* Deep research toggle */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/30 bg-muted/20">
                  <Telescope className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Deep
                  </span>
                  <Switch
                    checked={isDeepResearch}
                    onCheckedChange={setIsDeepResearch}
                    className="scale-75 data-[state=checked]:bg-cyan-600"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-cyan-500/20 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
