'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const CODE_CONTENT = `const response = await nexus.search({
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

const DEMO_SOURCES = [
  {
    title: 'Top AI SaaS Trends Reshaping 2026',
    url: 'techcrunch.com/ai-saas-trends-2026',
  },
  {
    title: 'Autonomous AI Agents in Enterprise',
    url: 'forbes.com/autonomous-ai-agents',
  },
  {
    title: 'Vertical AI: The Next Frontier',
    url: 'a16z.com/vertical-ai-copilots',
  },
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

export default function AIDemoSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [displayedCode, setDisplayedCode] = useState('')
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

  // Syntax-highlighted code rendering
  const renderCode = (code: string) => {
    return code.split('\n').map((line, i) => {
      // Keywords
      let rendered = line
        .replace(/(const|await|false|true|return|let|var|function)/g, '<kw>$1</kw>')
        .replace(/(\/\/.*)/g, '<cm>$1</cm>')
        .replace(/(".*?")/g, '<str>$1</str>')
        .replace(/(\.\w+)\(/g, '<fn>$1</fn>(')
        .replace(/(nexus\.)/g, '<obj>$1</obj>')

      // Parse custom tags into spans
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
            currentTag === 'kw' ? 'text-[var(--accent-purple,#c084fc)]' :
            currentTag === 'cm' ? 'text-[var(--stone)] italic' :
            currentTag === 'str' ? 'text-[var(--accent-green)]' :
            currentTag === 'fn' ? 'text-[var(--accent-blue)]' :
            currentTag === 'obj' ? 'text-[var(--accent-yellow)]' :
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
      ref={sectionRef}
      className="glow-blue"
      style={{ paddingTop: 'var(--spacing-section)', paddingBottom: 'var(--spacing-section)' }}
    >
      <div className="max-w-[1120px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-16"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Pipeline narrative */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {PIPELINE_STEPS.map((step, index) => (
              <div key={step.step} className="flex gap-5">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--surface-elevated)', border: '1px solid var(--hairline)' }}
                >
                  <span className="code-md text-[var(--accent-blue)]">{step.step}</span>
                </div>
                <div>
                  <h3 className="heading-sm mb-1.5">{step.title}</h3>
                  <p className="body-sm">{step.description}</p>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <button className="btn-primary gap-2">
                Try it free
                <ArrowRight className="h-4 w-4" />
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
                  <span className="code-tab code-tab-active">search.ts</span>
                  <span className="code-tab">response.json</span>
                </div>
              </div>

              {/* Code content with typing animation */}
              <div className="code-md overflow-x-auto">
                {isVisible && (
                  <pre className="whitespace-pre">
                    {renderCode(displayedCode)}
                    {!typingComplete && (
                      <span className="inline-block w-[2px] h-[16px] bg-[var(--accent-blue)] animate-blink align-middle ml-[1px]" />
                    )}
                  </pre>
                )}
                {!isVisible && (
                  <pre className="whitespace-pre text-[var(--stone)]">
                    {'// Loading...'}
                  </pre>
                )}
              </div>
            </div>

            {/* Source citations — appear after typing completes */}
            {typingComplete && (
              <motion.div
                className="mt-4 space-y-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="body-sm" style={{ color: 'var(--stone)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Sources
                </span>
                <div className="space-y-1.5">
                  {DEMO_SOURCES.map((source, i) => (
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
      </div>
    </section>
  )
}
