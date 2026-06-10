'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Mic, Paperclip, ArrowRight, Zap, BookOpen, Shield, Brain, Play } from 'lucide-react'

const PLACEHOLDER_QUERIES = [
  'What are the best AI startups in 2026?',
  'How does quantum computing work?',
  'Latest breakthroughs in biotech',
  'Explain the future of SaaS',
]

const TRENDING_SEARCHES = [
  'Best startup ideas 2026',
  'How to build a SaaS',
  'AI business opportunities',
  'Climate tech solutions',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

interface HeroSectionProps {
  onSearch: (query: string) => void
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [input, setInput] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cycle through placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_QUERIES.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Floating gradient orbs */}
      <div
        className="animate-float-1 absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(103,232,249,0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="animate-float-2 absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="animate-float-3 absolute bottom-[15%] left-[40%] w-[300px] h-[300px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(103,232,249,0.3) 0%, rgba(167,139,250,0.2) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          Search Smarter.
          <br />
          Think <span className="gradient-text">Faster.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          The future of AI-powered search. Ask anything and get accurate answers
          with real-time citations from across the web.
        </motion.p>

        {/* AI Search Bar */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl mb-6">
          <form onSubmit={handleSubmit}>
            <div
              className={`glass-strong search-glow glow-border rounded-2xl flex items-center gap-2 px-4 sm:px-5 py-2 transition-all duration-300 ${
                isFocused ? 'scale-[1.01]' : ''
              }`}
            >
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={PLACEHOLDER_QUERIES[placeholderIndex]}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-base sm:text-lg py-3 min-w-0 transition-all"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  aria-label="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="h-9 w-9 rounded-xl bg-cyan-500/90 text-white flex items-center justify-center hover:bg-cyan-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ml-1"
                  aria-label="Submit search"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Trending Searches */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          <span className="text-xs text-muted-foreground/60 mr-1">Trending:</span>
          {TRENDING_SEARCHES.map((query) => (
            <button
              key={query}
              onClick={() => handleTrendingClick(query)}
              className="glass px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              {query}
            </button>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mb-16"
        >
          <button
            onClick={() => inputRef.current?.focus()}
            className="px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            }}
          >
            Start Searching
          </button>
          <button className="px-7 py-3 rounded-xl font-semibold text-sm text-muted-foreground border border-border hover:text-foreground hover:border-white/20 transition-all duration-300 flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98]">
            <Play className="h-4 w-4" />
            Watch Demo
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {[
            { icon: Zap, label: 'Lightning Fast' },
            { icon: BookOpen, label: 'Cited Sources' },
            { icon: Shield, label: 'Trusted Research' },
            { icon: Brain, label: 'Multi-Model AI' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 text-muted-foreground/40"
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
