'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  Search,
  BarChart3,
  Sparkles,
  BookOpen,
  User,
  Bot,
  Globe,
  ExternalLink,
} from 'lucide-react'

const FLOW_STEPS = [
  { icon: MessageCircle, label: 'Ask' },
  { icon: Search, label: 'Search' },
  { icon: BarChart3, label: 'Analyze' },
  { icon: Sparkles, label: 'Generate' },
  { icon: BookOpen, label: 'Cite' },
]

const DEMO_ANSWER = `The AI SaaS landscape in 2026 is defined by several high-impact opportunities that leverage advances in foundation models and vertical-specific data. [1]

First, **AI-native customer support platforms** are seeing explosive growth. Companies like Decagon and Sierra are building autonomous agents that handle complex multi-turn conversations, replacing traditional rule-based chatbots. The key differentiator is their ability to reason through customer issues, access backend systems, and resolve tickets end-to-end without human intervention. [2]

Second, **vertical AI copilots** for specialized industries — legal, healthcare, and financial services — represent a massive opportunity. These tools go beyond generic chatbots by embedding deep domain knowledge and regulatory compliance into their workflows. Harvey for legal, Hippocratic AI for healthcare, and Ramp for finance are leading examples. [3]

Third, **AI-powered data analytics and business intelligence** is being reinvented. Instead of writing SQL queries or building dashboards manually, natural language interfaces now let anyone query complex datasets. Tools like TextQL and Parseur are making data accessible to non-technical teams, dramatically reducing time-to-insight.

Finally, **AI agent infrastructure** — the picks-and-shovels layer — is perhaps the biggest opportunity. Frameworks for building, orchestrating, and monitoring autonomous AI agents are essential as every industry adopts agentic workflows. Companies providing observability, safety guardrails, and multi-agent orchestration will become foundational infrastructure.`

const DEMO_SOURCES = [
  {
    title: 'Top AI SaaS Trends Reshaping 2026',
    url: 'techcrunch.com/ai-saas-trends-2026',
    snippet: 'The AI SaaS market is projected to reach $280B by 2026, with vertical solutions leading growth...',
  },
  {
    title: 'Autonomous AI Agents in Enterprise',
    url: 'forbes.com/autonomous-ai-agents',
    snippet: 'Enterprise adoption of autonomous agents has grown 340% year-over-year, with customer support leading...',
  },
  {
    title: 'Vertical AI: The Next Frontier',
    url: 'a16z.com/vertical-ai-copilots',
    snippet: 'Domain-specific AI copilots are outperforming general-purpose tools by 3-5x in accuracy and user satisfaction...',
  },
]

const DEMO_FOLLOWUPS = [
  'What funding trends exist for AI SaaS startups?',
  'How do AI agents differ from traditional automation?',
  'Which industries are adopting AI fastest?',
]

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function AIDemoSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [typingComplete, setTypingComplete] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  // IntersectionObserver to start typing when section enters viewport
  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          setIsVisible(true)
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Typing animation
  useEffect(() => {
    if (!isVisible) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < DEMO_ANSWER.length) {
        // Reveal a chunk of characters for a more natural typing feel
        const chunkSize = Math.floor(Math.random() * 3) + 1
        const nextIndex = Math.min(currentIndex + chunkSize, DEMO_ANSWER.length)
        setDisplayedText(DEMO_ANSWER.slice(0, nextIndex))
        currentIndex = nextIndex
      } else {
        setTypingComplete(true)
        clearInterval(interval)
      }
    }, 18)

    return () => clearInterval(interval)
  }, [isVisible])

  // Parse inline citations from the displayed text
  const renderTextWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g)
    return parts.map((part, i) => {
      const citationMatch = part.match(/^\[(\d+)\]$/)
      if (citationMatch) {
        return (
          <span
            key={i}
            className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-400 mx-0.5 align-middle"
          >
            {citationMatch[1]}
          </span>
        )
      }
      // Handle bold markdown
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      return boldParts.map((bp, j) => {
        const boldMatch = bp.match(/^\*\*([^*]+)\*\*$/)
        if (boldMatch) {
          return (
            <strong key={`${i}-${j}`} className="text-foreground font-semibold">
              {boldMatch[1]}
            </strong>
          )
        }
        return <span key={`${i}-${j}`}>{bp}</span>
      })
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.3) 0%, rgba(167,139,250,0.2) 50%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            See How It Works
          </h2>
          <div className="mx-auto w-32 h-1 rounded-full mb-4 animate-gradient" style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)', backgroundSize: '200% 100%' }} />
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            From question to cited answer in seconds
          </p>
        </motion.div>

        {/* Flow Badges */}
        <motion.div
          className="flex items-center justify-center gap-2 sm:gap-0 mb-14 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {FLOW_STEPS.map((step, index) => (
            <div key={step.label} className="flex items-center">
              <div className="glass rounded-full px-3 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-2">
                <step.icon className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs sm:text-sm font-medium text-foreground/80">
                  {step.label}
                </span>
              </div>
              {index < FLOW_STEPS.length - 1 && (
                <div className="hidden sm:block w-6 lg:w-10 h-px bg-gradient-to-r from-cyan-500/30 to-purple-500/30 mx-1 lg:mx-2" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Main Demo Card */}
        <motion.div
          className="glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {/* Left: User Question */}
            <div className="glass rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-cyan-500/15 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">You</span>
                  <span className="text-xs text-muted-foreground ml-2">Just now</span>
                </div>
              </div>
              <p className="text-base sm:text-lg text-foreground leading-relaxed">
                What are the best AI SaaS ideas for 2026?
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50 mt-auto">
                <Globe className="h-3 w-3" />
                <span>Searching across 8 sources...</span>
              </div>
            </div>

            {/* Right: AI Response */}
            <div className="glass rounded-xl p-5 flex flex-col gap-4 min-h-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-purple-500/15 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Nexus AI</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {typingComplete ? 'Complete' : 'Analyzing...'}
                  </span>
                </div>
              </div>

              {/* Typing response */}
              <div className="text-sm sm:text-base text-foreground/85 leading-relaxed flex-1 overflow-y-auto max-h-80 scrollbar-thin">
                {renderTextWithCitations(displayedText)}
                {!typingComplete && isVisible && (
                  <span className="inline-block w-0.5 h-4 bg-cyan-400 animate-blink ml-0.5 align-middle" />
                )}
              </div>

              {/* Source Cards */}
              {typingComplete && (
                <motion.div
                  className="space-y-2 mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                    Sources
                  </span>
                  <div className="space-y-1.5">
                    {DEMO_SOURCES.map((source, i) => (
                      <div
                        key={i}
                        className="glass rounded-lg p-2.5 flex items-start gap-2 group hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center justify-center h-4 w-4 rounded bg-cyan-500/20 text-[9px] font-bold text-cyan-400 shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-foreground truncate">
                              {source.title}
                            </span>
                            <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[10px] text-cyan-400/60 truncate block">
                            {source.url}
                          </span>
                          <p className="text-[10px] text-muted-foreground/50 line-clamp-1 mt-0.5">
                            {source.snippet}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Follow-up Questions */}
              {typingComplete && (
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                    Follow-up
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DEMO_FOLLOWUPS.map((question) => (
                      <span
                        key={question}
                        className="glass rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {question}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
