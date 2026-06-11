'use client'

import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useAppStore, type Source } from '@/store/app-store'
import { handleSearch, handleFollowUp } from '@/lib/search-handler'
import SourceCard from '@/components/SourceCard'
import FollowUpQuestions from '@/components/FollowUpQuestions'
import {
  Search,
  ArrowRight,
  Loader2,
  Telescope,
  Sparkles,
  ExternalLink,
  Globe,
  Send,
  Microscope,
  TrendingUp,
  Brain,
  Zap,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

/* ------------------------------------------------------------------ */
/*  Suggestion cards data                                              */
/* ------------------------------------------------------------------ */

const SUGGESTIONS = [
  {
    icon: Microscope,
    title: 'Best headphones',
    subtitle: 'under ₹1,000 in India',
    query: 'Best headphones under 1000 in India',
    accentVar: '--accent-blue',
  },
  {
    icon: TrendingUp,
    title: 'Top mutual funds',
    subtitle: 'for SIP in 2026',
    query: 'Best mutual funds for SIP investment in India 2026',
    accentVar: '--accent-orange',
  },
  {
    icon: Globe,
    title: 'Budget travel',
    subtitle: 'destinations from India',
    query: 'Best budget international travel destinations from India',
    accentVar: '--accent-green',
  },
  {
    icon: Brain,
    title: 'UPSC preparation',
    subtitle: 'strategy and resources',
    query: 'Best UPSC preparation strategy and resources 2026',
    accentVar: '--accent-yellow',
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
/*  Streaming cursor                                                   */
/* ------------------------------------------------------------------ */

function StreamingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-[1.1em] animate-blink ml-0.5 align-text-bottom rounded-full"
      style={{ background: 'var(--accent-blue)' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Progressive loading animation                                      */
/* ------------------------------------------------------------------ */

const LOADING_STAGES = [
  { label: 'Searching', icon: Search },
  { label: 'Reading sources', icon: Globe },
  { label: 'Analyzing', icon: Brain },
  { label: 'Generating answer', icon: Sparkles },
]

function ProgressiveLoader({ isDeep }: { isDeep: boolean }) {
  const [stage, setStage] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    if (isDeep) return // Deep research uses its own progress bar
    const delays = [1800, 3000, 5000]
    const timers: ReturnType<typeof setTimeout>[] = []

    delays.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          if (mountedRef.current) setStage(i + 1)
        }, delay)
      )
    })

    return () => {
      mountedRef.current = false
      timers.forEach(clearTimeout)
    }
  }, [isDeep])

  const currentStage = isDeep ? 0 : Math.min(stage, LOADING_STAGES.length - 1)
  const StageIcon = LOADING_STAGES[currentStage].icon

  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex gap-1.5">
        {LOADING_STAGES.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: i <= currentStage ? 'var(--accent-blue)' : 'var(--stone)',
              opacity: i <= currentStage ? 0.85 : 0.25,
              transform: i === currentStage ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <StageIcon
          className="h-3.5 w-3.5 transition-all duration-300"
          style={{ color: 'var(--accent-blue)', opacity: 0.7 }}
        />
        <span className="text-sm transition-all duration-300" style={{ color: 'var(--ash)' }}>
          {LOADING_STAGES[currentStage].label}…
        </span>
      </div>
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
            className="citation-chip no-underline"
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
          className="inline-flex items-center gap-1 transition-colors no-underline underline-offset-2"
          style={{ color: 'var(--accent-blue)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--accent-blue)'
          }}
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
      <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0" style={{ color: 'var(--ink)' }}>
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-xl font-bold mt-5 mb-2" style={{ color: 'var(--ink)' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-lg font-semibold mt-4 mb-2" style={{ color: 'var(--ink)' }}>
        {children}
      </h3>
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
      <blockquote
        className="pl-4 italic my-3"
        style={{
          borderLeft: '3px solid var(--hairline-strong)',
          color: 'var(--charcoal)',
        }}
      >
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
          <code
            className="px-1.5 py-0.5 rounded text-sm font-mono"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--accent-blue)',
            }}
          >
            {children}
          </code>
        )
      }
      return (
        <div className="relative my-3">
          <code
            className={`${className || ''} block p-4 rounded-xl text-sm font-mono overflow-x-auto leading-relaxed`}
            style={{
              background: 'var(--surface-deep)',
              border: '1px solid var(--hairline-strong)',
              color: 'var(--body)',
            }}
          >
            {children}
          </code>
        </div>
      )
    },
    pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold" style={{ color: 'var(--ink)' }}>
        {children}
      </strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic" style={{ color: 'var(--body)' }}>
        {children}
      </em>
    ),
    hr: () => <hr style={{ borderColor: 'var(--hairline)' }} />,
    table: ({ children }: { children?: ReactNode }) => (
      <div className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th
        className="px-3 py-2 text-left font-medium"
        style={{
          border: '1px solid var(--hairline)',
          background: 'var(--surface-elevated)',
          color: 'var(--ink)',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td
        className="px-3 py-2"
        style={{
          border: '1px solid var(--hairline)',
          color: 'var(--body)',
        }}
      >
        {children}
      </td>
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
    currentSources,
  } = useAppStore()

  const [input, setInput] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const emptyTextareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomTextareaRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  /* ---- Auto-scroll on new messages/tokens ---- */
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  /* ---- Auto-resize empty state textarea ---- */
  useEffect(() => {
    if (emptyTextareaRef.current) {
      emptyTextareaRef.current.style.height = 'auto'
      emptyTextareaRef.current.style.height = `${Math.min(emptyTextareaRef.current.scrollHeight, 120)}px`
    }
  }, [input, isEmpty])

  /* ---- Auto-resize bottom textarea ---- */
  useEffect(() => {
    if (bottomTextareaRef.current) {
      bottomTextareaRef.current.style.height = 'auto'
      bottomTextareaRef.current.style.height = `${Math.min(bottomTextareaRef.current.scrollHeight, 120)}px`
    }
  }, [input, !isEmpty])

  /* ---- Handle submit ---- */
  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return
      const query = input.trim()
      setInput('')
      if (emptyTextareaRef.current) emptyTextareaRef.current.style.height = 'auto'
      if (bottomTextareaRef.current) bottomTextareaRef.current.style.height = 'auto'
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
          if (emptyTextareaRef.current) emptyTextareaRef.current.style.height = 'auto'
          if (bottomTextareaRef.current) bottomTextareaRef.current.style.height = 'auto'
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

  /* ---- Resolve sources for a message (handles streaming vs final) ---- */
  const getSourcesForMessage = useCallback(
    (msg: (typeof messages)[0]) => {
      if (msg.isStreaming) return currentSources
      return msg.sources || []
    },
    [currentSources]
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
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: 'var(--surface-card)',
                    border: '1px solid var(--hairline-strong)',
                  }}
                >
                  <Sparkles className="h-7 w-7" style={{ color: 'var(--accent-blue)' }} />
                </div>
                <h1 className="heading-md mb-2" style={{ color: 'var(--ink)' }}>
                  Ask anything
                </h1>
                <p className="body-sm max-w-md mx-auto mb-3">
                  Get AI-powered answers with real-time sources and citations
                </p>
                {/* Powered by AI badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  <Zap className="h-3 w-3" style={{ color: 'var(--accent-blue)' }} />
                  <span
                    className="text-[11px] font-medium tracking-wide uppercase"
                    style={{ color: 'var(--stone)' }}
                  >
                    Powered by AI
                  </span>
                </div>
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
                    className="group flex items-start gap-3 text-left disabled:opacity-50 transition-all duration-200"
                    style={{
                      padding: '14px 16px',
                      background: 'var(--surface-card)',
                      border: '1px solid var(--hairline)',
                      borderRadius: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--hairline-strong)'
                      e.currentTarget.style.background = 'var(--surface-elevated)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--hairline)'
                      e.currentTarget.style.background = 'var(--surface-card)'
                    }}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: 'var(--surface-elevated)',
                        border: '1px solid var(--hairline)',
                      }}
                    >
                      <s.icon className="h-4 w-4" style={{ color: `var(${s.accentVar})` }} />
                    </div>
                    <div className="min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--ink)' }}
                      >
                        {s.title}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--ash)' }}>
                        {s.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>

              {/* Inline search bar for empty state */}
              <motion.div variants={itemVariants} className="w-full max-w-2xl">
                <form onSubmit={onSubmit}>
                  <div
                    className="rounded-2xl flex items-center gap-3 px-4 sm:px-5 py-3 transition-all duration-200"
                    style={{
                      background: 'var(--surface-card)',
                      border: `1px solid ${inputFocused ? 'var(--ink)' : 'var(--hairline-strong)'}`,
                      boxShadow: inputFocused
                        ? '0 0 0 1px var(--ink), 0 0 24px -6px var(--accent-blue-glow)'
                        : 'none',
                    }}
                  >
                    <Search className="h-5 w-5 shrink-0" style={{ color: 'var(--stone)' }} />
                    <textarea
                      ref={emptyTextareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder="Ask anything... get answers with sources"
                      rows={1}
                      className="flex-1 bg-transparent outline-none text-base resize-none"
                      style={{
                        color: 'var(--ink)',
                        maxHeight: 120,
                      }}
                      disabled={isLoading}
                    />
                    <div
                      className="flex items-center gap-2 shrink-0 pl-3"
                      style={{ borderLeft: '1px solid var(--hairline)' }}
                    >
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <Telescope className="h-3.5 w-3.5" style={{ color: 'var(--ash)' }} />
                          <span
                            className="text-xs hidden sm:inline"
                            style={{ color: 'var(--ash)' }}
                          >
                            Deep Research
                          </span>
                          <Switch
                            checked={isDeepResearch}
                            onCheckedChange={setIsDeepResearch}
                            style={
                              isDeepResearch
                                ? { backgroundColor: 'var(--accent-blue)' }
                                : undefined
                            }
                          />
                        </div>
                        {isDeepResearch && (
                          <span
                            className="text-[10px] hidden sm:block"
                            style={{ color: 'var(--stone)' }}
                          >
                            Thorough multi-source analysis
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="btn-primary shrink-0"
                      style={{
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        borderRadius: '8px',
                      }}
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
              className="max-w-3xl mx-auto px-4 sm:px-6 py-6"
            >
              {messages.map((msg, i) => {
                if (msg.role === 'system') return null

                /* ---- User message — Perplexity-style simple text ---- */
                if (msg.role === 'user') {
                  return (
                    <div key={i} className="pt-4 pb-1 first:pt-0">
                      <motion.h2
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="text-lg sm:text-xl font-medium leading-relaxed"
                        style={{ color: 'var(--ink)' }}
                      >
                        {msg.content}
                      </motion.h2>
                    </div>
                  )
                }

                /* ---- Assistant message ---- */
                const sources = getSourcesForMessage(msg)
                const followUps = msg.followUps || []
                const processedContent = sources.length
                  ? processCitations(msg.content, sources)
                  : msg.content
                const markdownComponents = getMarkdownComponents(sources)

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="pb-6"
                  >
                    {/* Source cards — ABOVE the answer, like Perplexity */}
                    {sources.length > 0 && (
                      <div className="mb-4">
                        <SourceCard sources={sources} />
                      </div>
                    )}

                    {/* Assistant label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="h-5 w-5 rounded-md flex items-center justify-center"
                        style={{
                          background: 'var(--surface-card)',
                          border: '1px solid var(--hairline)',
                        }}
                      >
                        <Sparkles className="h-3 w-3" style={{ color: 'var(--accent-blue)' }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'var(--ash)' }}>
                        Nexus AI
                      </span>
                      {isDeepResearch && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{
                            background: 'rgba(59,158,255,0.12)',
                            color: 'var(--accent-blue)',
                          }}
                        >
                          Deep Research
                        </span>
                      )}
                    </div>

                    {/* Answer text — no heavy card wrapper */}
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed"
                      style={{ color: 'var(--body)' }}
                    >
                      {msg.content ? (
                        <>
                          <ReactMarkdown components={markdownComponents}>
                            {processedContent}
                          </ReactMarkdown>
                          {msg.isStreaming && <StreamingCursor />}
                        </>
                      ) : msg.isStreaming ? (
                        <ProgressiveLoader isDeep={isDeepResearch} />
                      ) : null}
                    </div>

                    {/* Deep research progress (during streaming) */}
                    {msg.isStreaming && isDeepResearch && researchProgress > 0 && (
                      <div
                        className="mt-4 pt-3"
                        style={{ borderTop: '1px solid var(--hairline)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs" style={{ color: 'var(--ash)' }}>
                            {currentStep >= 0
                              ? researchSteps[currentStep].label
                              : 'Processing...'}
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{ color: 'var(--accent-blue)' }}
                          >
                            {researchProgress}%
                          </span>
                        </div>
                        <Progress
                          value={researchProgress}
                          className="h-1.5"
                          style={{
                            background: 'var(--surface-elevated)',
                          }}
                        />
                      </div>
                    )}

                    {/* Follow-up questions — shown after streaming completes */}
                    {!msg.isStreaming && followUps.length > 0 && (
                      <div className="mt-4">
                        <FollowUpQuestions
                          questions={followUps}
                          onSelect={onFollowUpClick}
                        />
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* Scroll anchor */}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============ BOTTOM INPUT BAR (visible when messages exist) ============ */}
      {!isEmpty && (
        <div
          className="sticky bottom-0 px-3 sm:px-4 py-3 transition-all duration-200"
          style={{
            background: 'var(--canvas)',
            borderTop: inputFocused
              ? '1px solid var(--hairline-strong)'
              : '1px solid var(--hairline)',
          }}
        >
          <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
            <div
              className="flex items-end gap-2 rounded-2xl px-3 sm:px-4 py-2.5 transition-all duration-200"
              style={{
                background: 'var(--surface-card)',
                border: `1px solid ${inputFocused ? 'var(--ink)' : 'var(--hairline-strong)'}`,
                boxShadow: inputFocused
                  ? '0 0 0 1px var(--ink), 0 0 24px -6px var(--accent-blue-glow)'
                  : 'none',
              }}
            >
              {/* Textarea */}
              <textarea
                ref={bottomTextareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder={
                  conversationId
                    ? 'Ask a follow-up…'
                    : 'Ask anything…'
                }
                rows={1}
                className="flex-1 bg-transparent outline-none text-sm resize-none"
                style={{
                  color: 'var(--ink)',
                  height: 'auto',
                  minHeight: '24px',
                  maxHeight: '120px',
                  padding: '4px 0',
                }}
                disabled={isLoading}
              />

              {/* Controls row */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pb-0.5">
                {/* Deep research toggle */}
                <div
                  className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg transition-all duration-200"
                  style={{
                    background: isDeepResearch
                      ? 'rgba(59,158,255,0.08)'
                      : 'var(--surface-elevated)',
                    border: `1px solid ${isDeepResearch ? 'rgba(59,158,255,0.2)' : 'var(--hairline)'}`,
                  }}
                >
                  <Telescope
                    className="h-3 w-3 transition-colors duration-200"
                    style={{ color: isDeepResearch ? 'var(--accent-blue)' : 'var(--ash)' }}
                  />
                  <span
                    className="text-[11px] font-medium hidden sm:inline transition-colors duration-200"
                    style={{ color: isDeepResearch ? 'var(--accent-blue)' : 'var(--ash)' }}
                  >
                    Deep
                  </span>
                  <Switch
                    checked={isDeepResearch}
                    onCheckedChange={setIsDeepResearch}
                    className="scale-75"
                    style={
                      isDeepResearch
                        ? { backgroundColor: 'var(--accent-blue)' }
                        : undefined
                    }
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="btn-primary shrink-0 transition-all duration-200"
                  style={{
                    width: '36px',
                    height: '36px',
                    padding: 0,
                    borderRadius: '10px',
                  }}
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
