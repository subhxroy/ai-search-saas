'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Zap, BookOpen, Shield, Brain } from 'lucide-react'

const TRENDING_SEARCHES = [
  'Best startup ideas 2026',
  'How to build a SaaS',
  'AI business opportunities',
  'Climate tech solutions',
]

const TRUST_INDICATORS = [
  { icon: Zap, label: 'Lightning Fast' },
  { icon: BookOpen, label: 'Cited Sources' },
  { icon: Shield, label: 'Trusted Research' },
  { icon: Brain, label: 'Multi-Model AI' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: i * 0.1,
    },
  }),
}

interface HeroSectionProps {
  onSearch: (query: string) => void
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim()) return
      onSearch(input.trim())
      setInput('')
    },
    [input, onSearch]
  )

  const handleTrendingClick = useCallback(
    (query: string) => {
      onSearch(query)
    },
    [onSearch]
  )

  return (
    <section
      className="relative flex flex-col items-center justify-center px-4 sm:px-6"
      style={{ paddingTop: 'var(--spacing-band, 128px)', paddingBottom: '96px' }}
    >
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* ── Headline ── */}
        <motion.h1
          className="display-xxl mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          The AI search
          <br />
          engine
        </motion.h1>

        {/* ── Subtitle ── */}
        <motion.p
          className="body-lg max-w-lg mx-auto mb-10"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          AI-powered search with real-time citations. Ask anything and get
          verified answers from across the web — no guesswork, no dead links.
        </motion.p>

        {/* ── Search Bar ── */}
        <motion.div
          className="w-full max-w-xl mb-5"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <form onSubmit={handleSubmit}>
            <div
              className="flex items-center gap-0 overflow-hidden transition-colors duration-150"
              style={{
                background: 'var(--surface-card)',
                border: `1px solid ${isFocused ? 'var(--ink)' : 'var(--hairline-strong)'}`,
                borderRadius: '8px',
                height: '48px',
              }}
            >
              <div className="flex items-center justify-center pl-4 shrink-0">
                <Search
                  className="h-4 w-4 shrink-0"
                  style={{ color: 'var(--ash)' }}
                />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent border-none outline-none min-w-0 pl-3 pr-2"
                style={{
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.43',
                }}
              />
              <div className="flex items-center pr-2 shrink-0">
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="btn-primary flex items-center justify-center gap-1.5 shrink-0"
                  style={{
                    opacity: input.trim() ? 1 : 0.35,
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span className="hidden sm:inline">Search</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* ── Trending Searches ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <span
            style={{
              color: 'var(--stone)',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '12px',
            }}
          >
            Trending
          </span>
          {TRENDING_SEARCHES.map((query) => (
            <button
              key={query}
              onClick={() => handleTrendingClick(query)}
              className="badge-pill cursor-pointer transition-colors duration-150"
              style={{ outline: 'none' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ink)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--charcoal)'
                e.currentTarget.style.background = 'var(--surface-elevated)'
              }}
            >
              {query}
            </button>
          ))}
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div
          className="flex items-center gap-3 mb-16"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
        >
          <button
            onClick={() => inputRef.current?.focus()}
            className="btn-primary"
            style={{ padding: '8px 20px' }}
          >
            Start Searching
          </button>
          <button
            className="btn-ghost"
            style={{ padding: '8px 20px' }}
            onClick={() => document.getElementById('ai-demo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Watch Demo
          </button>
        </motion.div>

        {/* ── Trust Indicators ── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          {TRUST_INDICATORS.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className="hidden sm:inline-block"
                  style={{
                    width: '1px',
                    height: '12px',
                    background: 'var(--hairline-strong)',
                    marginRight: '8px',
                  }}
                />
              )}
              <Icon className="h-3.5 w-3.5" style={{ color: 'var(--stone)' }} />
              <span
                style={{
                  color: 'var(--stone)',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
