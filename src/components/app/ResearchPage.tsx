'use client'

import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { useAppStore, type Source } from '@/store/app-store'
import { handleSearch, handleFollowUp } from '@/lib/search-handler'
import {
  Telescope,
  Search,
  ArrowRight,
  Loader2,
  Sparkles,
  ExternalLink,
  Globe,
  Plus,
  Send,
  BookOpen,
  Scale,
  FileText,
  Clock,
  CheckCircle2,
  Zap,
  GraduationCap,
  TrendingUp,
  Atom,
  Heart,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'

/* ------------------------------------------------------------------ */
/*  Deep research example prompts                                      */
/* ------------------------------------------------------------------ */

const RESEARCH_PROMPTS = [
  {
    icon: TrendingUp,
    query: 'Analyze the competitive landscape of AI SaaS in 2026',
    label: 'AI SaaS competitive landscape',
    gradient: 'from-cyan-500/10 to-purple-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Atom,
    query: 'Compare quantum computing approaches across IBM, Google, and startups',
    label: 'Quantum computing comparison',
    gradient: 'from-purple-500/10 to-pink-500/10',
    iconColor: 'text-purple-400',
  },
  {
    icon: Heart,
    query: 'What does the latest research say about longevity treatments?',
    label: 'Longevity research',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-400',
  },
]

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

/* ------------------------------------------------------------------ */
/*  Research steps                                                     */
/* ------------------------------------------------------------------ */

const RESEARCH_STEPS = [
  { label: 'Searching sources', icon: Search, description: 'Finding relevant information across the web...' },
  { label: 'Reading sources', icon: BookOpen, description: 'Analyzing and extracting key information...' },
  { label: 'Analyzing data', icon: Scale, description: 'Cross-referencing and validating findings...' },
  { label: 'Generating report', icon: FileText, description: 'Composing comprehensive research report...' },
  { label: 'Complete', icon: CheckCircle2, description: 'Your research report is ready' },
]

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
/*  Custom markdown components for research report                     */
/* ------------------------------------------------------------------ */

function getResearchMarkdownComponents(sources: Source[]) {
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
            className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-md bg-cyan-500/15 text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/25 transition-colors no-underline align-middle mx-0.5"
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
      <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
    ),
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-2xl font-bold mt-8 mb-4 first:mt-0 text-foreground">{children}</h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-xl font-bold mt-6 mb-3 text-foreground">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">{children}</h3>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-3 border-cyan-500/30 pl-5 italic text-muted-foreground my-4">
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
        <div className="relative my-4">
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
    hr: () => <hr className="my-5 border-border/40" />,
    table: ({ children }: { children?: ReactNode }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th className="border border-border/40 px-4 py-2.5 bg-muted/50 text-left font-medium">
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="border border-border/40 px-4 py-2.5">{children}</td>
    ),
  }
}

/* ------------------------------------------------------------------ */
/*  Source grid card for research page                                 */
/* ------------------------------------------------------------------ */

function ResearchSourceGrid({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Sources
        </span>
        <span className="text-xs text-muted-foreground/60">
          ({sources.length} references)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3.5 rounded-xl border border-border/40 bg-card/40 hover:bg-accent/40 hover:border-cyan-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-2">
              {source.favicon ? (
                <img
                  src={source.favicon}
                  alt=""
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <Globe className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground truncate flex-1">
                {source.host_name || source.domain || new URL(source.url).hostname}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-sm font-medium text-foreground line-clamp-2 leading-snug mb-1.5 group-hover:text-cyan-400 transition-colors">
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
/*  Key Takeaways extractor                                            */
/* ------------------------------------------------------------------ */

function KeyTakeaways({ content }: { content: string }) {
  // Try to extract key takeaways from the content
  // Look for sections with bullet points, or extract first few sentences
  const takeaways = (() => {
    if (!content) return []

    // Try to find bullet points
    const bulletPoints = content.match(/^[-•]\s+(.+)$/gm)
    if (bulletPoints && bulletPoints.length >= 2) {
      return bulletPoints.slice(0, 5).map((b) => b.replace(/^[-•]\s+/, '').trim())
    }

    // Try to find numbered points
    const numberedPoints = content.match(/^\d+\.\s+(.+)$/gm)
    if (numberedPoints && numberedPoints.length >= 2) {
      return numberedPoints.slice(0, 5).map((p) => p.replace(/^\d+\.\s+/, '').trim())
    }

    // Fallback: extract key sentences
    const sentences = content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20 && s.length < 200)
    return sentences.slice(0, 4)
  })()

  if (takeaways.length < 2) return null

  return (
    <div className="mt-6 p-4 rounded-xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-cyan-400" />
        <span className="text-sm font-semibold text-foreground">Key Takeaways</span>
      </div>
      <ul className="space-y-2">
        {takeaways.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="leading-relaxed">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Research Follow-ups                                                */
/* ------------------------------------------------------------------ */

function ResearchFollowUps({
  questions,
  onSelect,
}: {
  questions: string[]
  onSelect: (q: string) => void
}) {
  if (!questions || questions.length === 0) return null

  return (
    <div className="mt-6 pt-4 border-t border-border/40">
      <div className="flex items-center gap-1.5 mb-3">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Follow up
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {questions.slice(0, 3).map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border/40 bg-card/30 hover:bg-accent/40 hover:border-cyan-500/15 transition-all duration-200 text-left"
          >
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-cyan-400 shrink-0 transition-colors" />
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ================================================================== */
/*  MAIN: ResearchPage                                                 */
/* ================================================================== */

export default function ResearchPage() {
  const {
    messages,
    isLoading,
    conversationId,
    isDeepResearch,
    setIsDeepResearch,
    researchProgress,
  } = useAppStore()

  const [input, setInput] = useState('')
  const [includeAcademic, setIncludeAcademic] = useState(false)
  const [compareViewpoints, setCompareViewpoints] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hasResearch = messages.length > 0

  /* ---- Ensure deep research mode is on when on this page ---- */
  useEffect(() => {
    setIsDeepResearch(true)
  }, [setIsDeepResearch])

  /* ---- Auto-scroll ---- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading, researchProgress])

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

  /* ---- Handle prompt click ---- */
  const onPromptClick = useCallback(
    (query: string) => {
      if (isLoading) return
      handleSearch(query)
    },
    [isLoading]
  )

  /* ---- Handle follow-up ---- */
  const onFollowUpClick = useCallback(
    (question: string) => {
      if (isLoading) return
      handleFollowUp(question)
    },
    [isLoading]
  )

  /* ---- Keyboard handler ---- */
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

  /* ---- Current research step ---- */
  const currentStep = useMemo(() => {
    if (researchProgress <= 20) return 0
    if (researchProgress <= 45) return 1
    if (researchProgress <= 70) return 2
    if (researchProgress <= 90) return 3
    return 4
  }, [researchProgress])

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="flex flex-col h-full relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        <AnimatePresence mode="wait">
          {!hasResearch ? (
            /* ============ EMPTY STATE ============ */
            <motion.div
              key="empty"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12"
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10 mx-auto mb-4">
                  <Telescope className="h-7 w-7 text-cyan-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  <span className="gradient-text">Deep Research</span>
                </h1>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Comprehensive multi-step analysis with detailed source verification
                </p>
              </motion.div>

              {/* Animated gradient border banner */}
              <motion.div variants={itemVariants} className="w-full max-w-2xl mb-8">
                <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 animate-gradient">
                  <div className="rounded-xl bg-card/90 p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                      <Telescope className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Deep Research Mode
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Takes longer but provides more thorough analysis with verified sources,
                        cross-references, and comprehensive coverage.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Search input */}
              <motion.div variants={itemVariants} className="w-full max-w-2xl mb-5">
                <form onSubmit={onSubmit}>
                  <div className="glass-strong search-glow glow-border rounded-2xl flex items-center gap-3 px-5 py-4">
                    <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Describe your research question in detail..."
                      rows={2}
                      className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base resize-none max-h-[120px]"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="shrink-0 h-10 px-5 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center gap-2 text-white text-sm font-medium disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Telescope className="h-4 w-4" />
                          <span className="hidden sm:inline">Start Research</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Options */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-3 mb-8"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 bg-muted/20">
                  <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Academic sources</span>
                  <Switch
                    checked={includeAcademic}
                    onCheckedChange={setIncludeAcademic}
                    className="scale-75 data-[state=checked]:bg-cyan-600"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 bg-muted/20">
                  <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Compare viewpoints</span>
                  <Switch
                    checked={compareViewpoints}
                    onCheckedChange={setCompareViewpoints}
                    className="scale-75 data-[state=checked]:bg-cyan-600"
                  />
                </div>
              </motion.div>

              {/* Example prompts */}
              <motion.div variants={itemVariants} className="w-full max-w-2xl">
                <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wider font-medium">
                  Try a deep research query
                </p>
                <div className="flex flex-col gap-2">
                  {RESEARCH_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => onPromptClick(p.query)}
                      disabled={isLoading}
                      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border/40 bg-card/30 hover:bg-accent/40 hover:border-cyan-500/15 transition-all duration-300 text-left disabled:opacity-50 feature-card"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0 ring-1 ring-white/5`}
                      >
                        <p.icon className={`h-4 w-4 ${p.iconColor}`} />
                      </div>
                      <span className="text-sm text-foreground/80 group-hover:text-cyan-400 transition-colors flex-1">
                        {p.query}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* ============ RESEARCH IN PROGRESS / RESULT ============ */
            <motion.div
              key="research"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto px-4 py-6"
            >
              {/* Research progress indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="glass rounded-2xl p-5">
                    {/* Progress header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                          <div className="absolute inset-0 h-5 w-5 text-cyan-400/30 animate-ping">
                            <Telescope className="h-5 w-5" />
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          Research in Progress
                        </span>
                      </div>
                      <span className="text-lg font-bold gradient-text">
                        {researchProgress}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <Progress
                      value={researchProgress}
                      className="h-2 mb-5 bg-muted/50 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-purple-500 [&>div]:transition-all [&>div]:duration-500"
                    />

                    {/* Step indicators */}
                    <div className="flex items-start gap-0">
                      {RESEARCH_STEPS.map((step, i) => {
                        const isCompleted = currentStep > i
                        const isCurrent = currentStep === i
                        const StepIcon = step.icon

                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center relative"
                          >
                            {/* Connector line */}
                            {i < RESEARCH_STEPS.length - 1 && (
                              <div
                                className={`absolute top-3 left-1/2 w-full h-px ${
                                  isCompleted
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500'
                                    : 'bg-border/40'
                                }`}
                              />
                            )}

                            {/* Step circle */}
                            <div
                              className={`relative z-10 h-6 w-6 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/20'
                                  : isCurrent
                                    ? 'bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/30 animate-pulse'
                                    : 'bg-muted/50 text-muted-foreground'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <StepIcon className="h-3 w-3" />
                              )}
                            </div>

                            {/* Step label */}
                            <span
                              className={`text-[10px] text-center leading-tight font-medium ${
                                isCurrent
                                  ? 'text-cyan-400'
                                  : isCompleted
                                    ? 'text-foreground/80'
                                    : 'text-muted-foreground/50'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Current step description */}
                    <div className="mt-4 pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground text-center">
                        {RESEARCH_STEPS[currentStep]?.description || 'Processing your query...'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Messages display */}
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
                const msgProcessedContent = sources.length
                  ? processCitations(msg.content, sources)
                  : msg.content
                const msgMarkdownComponents = getResearchMarkdownComponents(sources)

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="mb-6"
                  >
                    {/* Research Report header (only for the first assistant message) */}
                    {i === messages.findIndex((m) => m.role === 'assistant') &&
                      !msg.isStreaming &&
                      msg.content && (
                        <div className="flex items-center gap-3 mb-5">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
                            <FileText className="h-4 w-4 text-cyan-400" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-foreground">
                              Research Report
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date().toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Assistant label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-5 w-5 rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/5">
                        <Sparkles className="h-3 w-3 text-cyan-400" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Nexus AI
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 font-semibold">
                        Deep Research
                      </span>
                    </div>

                    {/* Content glass card */}
                    <div className="glass rounded-2xl p-5 sm:p-6">
                      <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed">
                        {msg.content ? (
                          <>
                            <ReactMarkdown components={msgMarkdownComponents}>
                              {msgProcessedContent}
                            </ReactMarkdown>
                            {msg.isStreaming && (
                              <span className="inline-block w-0.5 h-[1.1em] bg-cyan-400 animate-blink ml-0.5 align-text-bottom rounded-full" />
                            )}
                          </>
                        ) : msg.isStreaming ? (
                          <div className="flex items-center gap-2.5 text-muted-foreground">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-bounce" />
                            </div>
                            <span className="text-sm text-muted-foreground/70">
                              Conducting deep research...
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* Key Takeaways (only when complete) */}
                      {!msg.isStreaming && msg.content && (
                        <KeyTakeaways content={msg.content} />
                      )}

                      {/* Source grid (2-column) */}
                      {!msg.isStreaming && sources.length > 0 && (
                        <ResearchSourceGrid sources={sources} />
                      )}

                      {/* Follow-up questions */}
                      {!msg.isStreaming && followUps.length > 0 && (
                        <ResearchFollowUps
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

      {/* ============ BOTTOM INPUT BAR ============ */}
      {hasResearch && (
        <div className="sticky bottom-0 border-t border-border/30 glass-strong px-4 py-3">
          <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
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
                      : 'Describe your research question...'
                  }
                  rows={1}
                  className="w-full bg-muted/30 border border-border/40 rounded-xl px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground outline-none text-sm resize-none max-h-[120px] focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10 transition-all"
                  disabled={isLoading}
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
          </form>
        </div>
      )}
    </div>
  )
}
