'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Copy, Check, Download, Loader2, ExternalLink } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

const CODE_CONTENT = `import { NexusAI } from 'nexus-ai';

const nexus = new NexusAI();

const response = await nexus.search({
  query: "Best AI startups 2026",
  deepResearch: false,
});

// Sources found: 8
// Response time: 1.2s

console.log(response.answer);
// → "The AI SaaS landscape in 2026 is defined
//    by several high-impact opportunities..."

console.log(response.sources);
// → [
//     { title: "Top AI SaaS Trends 2026",
//       url: "techcrunch.com/ai-saas-trends",
//       relevance: 0.94 },
//     { title: "Autonomous AI Agents",
//       url: "forbes.com/ai-agents-enterprise",
//       relevance: 0.91 },
//     ...6 more
//   ]`

const DEMO_QUERIES = [
  'Best AI startups 2026',
  'Best headphones under 1k',
  'Top mutual funds India 2026',
  'How does GST work in India',
]

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Query',
    description: 'Your natural language question is parsed and expanded into optimized search queries across multiple indices.',
  },
  {
    step: '02',
    title: 'Retrieve',
    description: 'Real-time web search across 8+ sources — news, research papers, documentation, and verified databases.',
  },
  {
    step: '03',
    title: 'Synthesize',
    description: 'Multi-model AI cross-references sources, resolves conflicts, and constructs a coherent, cited answer.',
  },
  {
    step: '04',
    title: 'Cite',
    description: 'Every claim is anchored to a source. Click any citation to verify — full transparency, zero hallucination.',
  },
]

interface SourceResult {
  title: string
  url: string
  snippet: string
  relevance: number
}

interface SearchResult {
  answer: string
  sources: SourceResult[]
  followUps: string[]
  conversationId: string
  query: string
}

type TabView = 'code' | 'response' | 'live'

export default function AIDemoSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [displayedCode, setDisplayedCode] = useState('')
  const [typingComplete, setTypingComplete] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)
  const navigate = useAppStore((s) => s.navigate)

  // Live demo state
  const [activeTab, setActiveTab] = useState<TabView>('code')
  const [liveQuery, setLiveQuery] = useState('Best headphones under 1k')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [searchTime, setSearchTime] = useState<number | null>(null)

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
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Typing animation
  useEffect(() => {
    if (!isVisible) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < CODE_CONTENT.length) {
        const chunkSize = Math.floor(Math.random() * 2) + 1
        const nextIndex = Math.min(currentIndex + chunkSize, CODE_CONTENT.length)
        setDisplayedCode(CODE_CONTENT.slice(0, nextIndex))
        currentIndex = nextIndex
      } else {
        setTypingComplete(true)
        clearInterval(interval)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isVisible])

  // Live search handler
  const handleLiveSearch = useCallback(async () => {
    if (!liveQuery.trim() || isSearching) return

    setIsSearching(true)
    setSearchError(null)
    setSearchResult(null)
    setActiveTab('live')

    const startTime = Date.now()

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: liveQuery.trim(), deepResearch: false }),
      })

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      setSearchTime(parseFloat(elapsed))

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Request failed' }))
        setSearchError(errData.error || `Error ${res.status}`)
        return
      }

      const data = await res.json()
      setSearchResult(data)
    } catch (err) {
      setSearchError('Network error. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }, [liveQuery, isSearching])

  // Copy code handler
  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CODE_CONTENT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = CODE_CONTENT
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  // Download SDK handler
  const handleDownloadSDK = useCallback(() => {
    const link = document.createElement('a')
    link.href = '/api/sdk'
    link.download = 'nexus-ai.js'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // Syntax-highlighted code rendering
  const renderCode = (code: string) => {
    return code.split('\n').map((line, i) => {
      let rendered = line
        .replace(/(const|await|false|true|return|let|var|function|import|from)/g, '<kw>$1</kw>')
        .replace(/(\/\/.*)/g, '<cm>$1</cm>')
        .replace(/(".*?")/g, '<str>$1</str>')
        .replace(/(\.\w+)\(/g, '<fn>$1</fn>(')
        .replace(/(nexus\.)/g, '<obj>$1</obj>')

      const parts = rendered.split(/(<kw>|<\/kw>|<cm>|<\/cm>|<str>|<\/str>|<fn>|<\/fn>|<obj>|<\/obj>)/g)
      const elements: React.ReactNode[] = []
      let currentTag = ''
      let buffer = ''
      let keyIdx = 0

      for (const part of parts) {
        if (part.startsWith('<') && !part.startsWith('</')) {
          if (buffer) {
            elements.push(<span key={keyIdx++}>{buffer}</span>)
            buffer = ''
          }
          currentTag = part.slice(1, -1)
        } else if (part.startsWith('</')) {
          const className =
            currentTag === 'kw' ? 'text-[var(--accent-orange)]' :
            currentTag === 'cm' ? 'italic' :
            currentTag === 'str' ? 'text-[var(--accent-green)]' :
            currentTag === 'fn' ? 'text-[var(--accent-blue)]' :
            currentTag === 'obj' ? 'text-[var(--accent-yellow)]' :
            ''
          const colorStyle =
            currentTag === 'cm' ? { color: 'var(--stone)' } :
            {}
          elements.push(<span key={keyIdx++} className={className} style={colorStyle}>{buffer}</span>)
          buffer = ''
          currentTag = ''
        } else {
          buffer += part
        }
      }
      if (buffer) {
        elements.push(<span key={keyIdx++}>{buffer}</span>)
      }

      return (
        <div key={i} className="min-h-[1.6em]">
          {elements}
        </div>
      )
    })
  }

  // Format JSON response with syntax highlighting
  const renderResponseJson = (result: SearchResult) => {
    const displayObj = {
      answer: result.answer.slice(0, 200) + (result.answer.length > 200 ? '...' : ''),
      sources: result.sources.slice(0, 3).map(s => ({
        title: s.title,
        url: s.url,
        relevance: s.relevance,
      })),
      followUps: result.followUps,
      conversationId: result.conversationId.slice(0, 12) + '...',
    }

    const json = JSON.stringify(displayObj, null, 2)

    return json.split('\n').map((line, i) => {
      let rendered = line
        .replace(/(".*?")\s*:/g, '<key>$1</key>:')
        .replace(/:\s*(".*?")/g, ': <str>$1</str>')
        .replace(/:\s*(\d+\.?\d*)/g, ': <num>$1</num>')

      const parts = rendered.split(/(<key>|<\/key>|<str>|<\/str>|<num>|<\/num>)/g)
      const elements: React.ReactNode[] = []
      let currentTag = ''
      let buffer = ''
      let keyIdx = 0

      for (const part of parts) {
        if (part.startsWith('<') && !part.startsWith('</')) {
          if (buffer) {
            elements.push(<span key={keyIdx++}>{buffer}</span>)
            buffer = ''
          }
          currentTag = part.slice(1, -1)
        } else if (part.startsWith('</')) {
          const className =
            currentTag === 'key' ? 'text-[var(--accent-blue)]' :
            currentTag === 'str' ? 'text-[var(--accent-green)]' :
            currentTag === 'num' ? 'text-[var(--accent-orange)]' :
            ''
          elements.push(<span key={keyIdx++} className={className}>{buffer}</span>)
          buffer = ''
          currentTag = ''
        } else {
          buffer += part
        }
      }
      if (buffer) {
        elements.push(<span key={keyIdx++}>{buffer}</span>)
      }

      return (
        <div key={i} className="min-h-[1.6em]">
          {elements}
        </div>
      )
    })
  }

  return (
    <section
      id="ai-demo"
      ref={sectionRef}
      className="glow-blue"
      style={{ paddingTop: 'var(--spacing-section)', paddingBottom: 'var(--spacing-section)' }}
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="display-xl mb-4">
            See it in action
          </h2>
          <p className="body-md max-w-[520px]" style={{ color: 'var(--charcoal)' }}>
            From natural language to cited answer. Our search pipeline retrieves,
            synthesizes, and cites — in under two seconds.
          </p>
        </motion.div>

        {/* 2-up split: narrative left, code window right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Pipeline narrative */}
          <motion.div
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {PIPELINE_STEPS.map((step) => (
              <div key={step.step} className="flex gap-4 lg:gap-5">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--surface-elevated)', border: '1px solid var(--hairline)' }}
                >
                  <span className="code-md" style={{ color: 'var(--accent-blue)' }}>{step.step}</span>
                </div>
                <div>
                  <h3 className="heading-sm mb-1">{step.title}</h3>
                  <p className="body-sm">{step.description}</p>
                </div>
              </div>
            ))}

            {/* Live Try-It Section */}
            <div
              className="rounded-xl p-5 space-y-4"
              style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline-strong)' }}
            >
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" style={{ color: 'var(--accent-green)' }} />
                <span className="body-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                  Try it live
                </span>
              </div>

              {/* Query input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={liveQuery}
                  onChange={(e) => setLiveQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLiveSearch()}
                  placeholder="Ask anything..."
                  className="flex-1 text-input"
                  style={{ height: 36, fontSize: '13px' }}
                  disabled={isSearching}
                />
                <button
                  className="btn-primary shrink-0 gap-1.5"
                  style={{ height: 36, padding: '0 14px', fontSize: '13px' }}
                  onClick={handleLiveSearch}
                  disabled={isSearching || !liveQuery.trim()}
                >
                  {isSearching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">{isSearching ? 'Searching...' : 'Run'}</span>
                </button>
              </div>

              {/* Quick query suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {DEMO_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => setLiveQuery(q)}
                    className="badge-pill cursor-pointer"
                    style={{
                      transition: 'background 0.15s ease, color 0.15s ease',
                      fontSize: '11px',
                      padding: '3px 8px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--ink)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--charcoal)'
                      e.currentTarget.style.background = 'var(--surface-elevated)'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                className="btn-primary gap-2"
                onClick={() => navigate('signup')}
              >
                Try it free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="btn-ghost gap-2"
                onClick={handleCopyCode}
              >
                {copied ? <Check className="h-3.5 w-3.5" style={{ color: 'var(--accent-green)' }} /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy code'}
              </button>
              <button
                className="btn-ghost gap-2"
                onClick={handleDownloadSDK}
              >
                <Download className="h-3.5 w-3.5" />
                Download SDK
              </button>
            </div>
          </motion.div>

          {/* Right: Code window */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="code-window">
              {/* Traffic light dots + tab strip */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="traffic-light-red" />
                  <div className="traffic-light-yellow" />
                  <div className="traffic-light-green" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="code-tab"
                    style={activeTab === 'code' ? { color: 'var(--ink)', borderBottom: '1px solid var(--hairline-strong)' } : {}}
                    onClick={() => setActiveTab('code')}
                  >
                    search.ts
                  </button>
                  <button
                    className="code-tab"
                    style={activeTab === 'response' ? { color: 'var(--ink)', borderBottom: '1px solid var(--hairline-strong)' } : {}}
                    onClick={() => setActiveTab('response')}
                  >
                    response.json
                  </button>
                  {searchResult && (
                    <button
                      className="code-tab"
                      style={activeTab === 'live' ? { color: 'var(--ink)', borderBottom: '1px solid var(--hairline-strong)' } : {}}
                      onClick={() => setActiveTab('live')}
                    >
                      live result
                    </button>
                  )}
                </div>
              </div>

              {/* Tab content */}
              <div className="code-md overflow-x-auto" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                  {/* CODE TAB */}
                  {activeTab === 'code' && (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isVisible ? (
                        <pre className="whitespace-pre">
                          {renderCode(displayedCode)}
                          {!typingComplete && (
                            <span className="inline-block w-[2px] h-[16px] animate-blink align-middle ml-[1px]" style={{ background: 'var(--accent-blue)' }} />
                          )}
                        </pre>
                      ) : (
                        <pre className="whitespace-pre" style={{ color: 'var(--stone)' }}>
                          {'// Loading...'}
                        </pre>
                      )}
                    </motion.div>
                  )}

                  {/* RESPONSE TAB (static example) */}
                  {activeTab === 'response' && (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <pre className="whitespace-pre" style={{ color: 'var(--body)' }}>
{`{
  "answer": "The AI SaaS landscape in 2026 is defined
    by several high-impact opportunities...",
  "sources": [
    {
      "title": "Top AI SaaS Trends 2026",
      "url": "techcrunch.com/ai-saas-trends",
      "relevance": 0.94
    },
    {
      "title": "Autonomous AI Agents",
      "url": "forbes.com/ai-agents-enterprise",
      "relevance": 0.91
    }
  ],
  "followUps": [
    "What are the top AI startups in India?",
    "How is AI impacting SaaS pricing?",
    "Which AI verticals show most growth?"
  ],
  "conversationId": "conv_abc123..."
}`}
                      </pre>
                    </motion.div>
                  )}

                  {/* LIVE RESULT TAB */}
                  {activeTab === 'live' && searchResult && (
                    <motion.div
                      key="live"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Status bar */}
                      <div
                        className="flex items-center gap-3 mb-3 pb-3"
                        style={{ borderBottom: '1px solid var(--hairline)' }}
                      >
                        <span className="status-dot" />
                        <span style={{ color: 'var(--accent-green)', fontSize: '12px', fontWeight: 500 }}>
                          200 OK
                        </span>
                        {searchTime && (
                          <span style={{ color: 'var(--stone)', fontSize: '12px' }}>
                            {searchTime}s
                          </span>
                        )}
                        <span style={{ color: 'var(--stone)', fontSize: '12px' }}>
                          {searchResult.sources.length} sources
                        </span>
                      </div>

                      {/* Answer preview */}
                      <div className="mb-3">
                        <span style={{ color: 'var(--stone)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          Answer
                        </span>
                        <p className="mt-1" style={{ color: 'var(--body)', fontSize: '13px', lineHeight: 1.6 }}>
                          {searchResult.answer.slice(0, 400)}
                          {searchResult.answer.length > 400 ? '...' : ''}
                        </p>
                      </div>

                      {/* Sources */}
                      {searchResult.sources.length > 0 && (
                        <div className="mb-3">
                          <span style={{ color: 'var(--stone)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Sources
                          </span>
                          <div className="space-y-1.5 mt-1.5">
                            {searchResult.sources.slice(0, 5).map((source, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 rounded p-2"
                                style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
                              >
                                <span className="citation-chip shrink-0" style={{ fontSize: '9px', height: 16, minWidth: 16 }}>
                                  {i + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div style={{ color: 'var(--ink)', fontSize: '12px', fontWeight: 500 }} className="truncate">
                                    {source.title}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span style={{ color: 'var(--accent-blue)', fontSize: '11px' }} className="truncate">
                                      {source.url}
                                    </span>
                                    <span style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 500, flexShrink: 0 }}>
                                      {source.relevance.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-ups */}
                      {searchResult.followUps.length > 0 && (
                        <div>
                          <span style={{ color: 'var(--stone)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Follow-ups
                          </span>
                          <div className="mt-1.5 space-y-1">
                            {searchResult.followUps.map((fu, i) => (
                              <div key={i} style={{ color: 'var(--charcoal)', fontSize: '12px', paddingLeft: 8 }}>
                                {i + 1}. {fu}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Raw JSON toggle */}
                      <details className="mt-3">
                        <summary
                          style={{
                            color: 'var(--stone)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 500,
                          }}
                        >
                          View raw JSON
                        </summary>
                        <pre className="whitespace-pre mt-2" style={{ color: 'var(--body)' }}>
                          {renderResponseJson(searchResult)}
                        </pre>
                      </details>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading state */}
                {isSearching && activeTab === 'live' && (
                  <div className="flex items-center gap-3 py-8 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--accent-blue)' }} />
                    <span style={{ color: 'var(--charcoal)', fontSize: '13px' }}>
                      Searching...
                    </span>
                  </div>
                )}

                {/* Error state */}
                {searchError && activeTab === 'live' && (
                  <div className="py-4">
                    <span style={{ color: 'var(--accent-red)', fontSize: '13px' }}>
                      {searchError}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Source citations — appear after typing completes (code tab) */}
            {typingComplete && activeTab === 'code' && (
              <motion.div
                className="mt-4 space-y-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span
                  style={{
                    color: 'var(--stone)',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Sources
                </span>
                <div className="space-y-1.5">
                  {[
                    { title: 'Top AI SaaS Trends Reshaping 2026', url: 'techcrunch.com/ai-saas-trends-2026' },
                    { title: 'Autonomous AI Agents in Enterprise', url: 'forbes.com/autonomous-ai-agents' },
                    { title: 'Vertical AI: The Next Frontier', url: 'a16z.com/vertical-ai-copilots' },
                  ].map((source, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg p-3 transition-colors"
                      style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline)' }}
                    >
                      <span className="citation-chip shrink-0 mt-0.5">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="body-sm font-medium" style={{ color: 'var(--ink)' }}>{source.title}</div>
                        <div className="body-sm" style={{ color: 'var(--accent-blue)', fontSize: '12px' }}>{source.url}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* SDK Local Usage Banner */}
        <motion.div
          className="mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className="rounded-xl p-6 sm:p-8"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--hairline-strong)' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="heading-sm mb-2">Run it locally</h3>
                <p className="body-sm" style={{ color: 'var(--charcoal)' }}>
                  Download the SDK and use it in your own projects. Works in Node.js, browsers, and any JavaScript environment. 
                  Just point it at the Nexus AI API and start searching.
                </p>
                <div
                  className="mt-3 code-md rounded-lg p-3 overflow-x-auto"
                  style={{ background: 'var(--surface-deep)', border: '1px solid var(--hairline)' }}
                >
                  <code style={{ color: 'var(--body)' }}>
                    <span style={{ color: 'var(--accent-orange)' }}>import</span>{' '}
                    {'{ NexusAI }'}{' '}
                    <span style={{ color: 'var(--accent-orange)' }}>from</span>{' '}
                    <span style={{ color: 'var(--accent-green)' }}>'./nexus-ai.js'</span>;{'\n'}
                    {'\n'}
                    <span style={{ color: 'var(--accent-orange)' }}>const</span> nexus ={' '}
                    <span style={{ color: 'var(--accent-orange)' }}>new</span>{' '}
                    <span style={{ color: 'var(--accent-blue)' }}>NexusAI</span>({'{'}
                      {'\n  '}
                      baseUrl: <span style={{ color: 'var(--accent-green)' }}>'https://your-instance.com'</span>{'\n'}
                    {'}'});{'\n'}
                    {'\n'}
                    <span style={{ color: 'var(--accent-orange)' }}>const</span> response ={' '}
                    <span style={{ color: 'var(--accent-orange)' }}>await</span> nexus.<span style={{ color: 'var(--accent-blue)' }}>search</span>({'{'}
                      {'\n  '}
                      query: <span style={{ color: 'var(--accent-green)' }}>"Best laptops under 50k"</span>{'\n'}
                    {'}'});
                  </code>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  className="btn-primary gap-2"
                  onClick={handleDownloadSDK}
                  style={{ minWidth: 160 }}
                >
                  <Download className="h-4 w-4" />
                  Download SDK
                </button>
                <button
                  className="btn-ghost gap-2"
                  onClick={handleCopyCode}
                  style={{ minWidth: 160 }}
                >
                  {copied ? <Check className="h-3.5 w-3.5" style={{ color: 'var(--accent-green)' }} /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy snippet'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
