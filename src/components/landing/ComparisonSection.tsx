'use client'

import { motion } from 'framer-motion'
import { Search, Sparkles, X, Check } from 'lucide-react'

interface ComparisonRow {
  label: string
  traditional: string
  nexus: string
}

const COMPARISONS: ComparisonRow[] = [
  {
    label: 'Time to Insight',
    traditional: '30+ minutes of scrolling',
    nexus: 'Seconds with cited answer',
  },
  {
    label: 'Accuracy',
    traditional: 'SEO-optimized results',
    nexus: 'Cross-referenced, verified',
  },
  {
    label: 'Research Speed',
    traditional: 'Open 20+ tabs',
    nexus: 'One conversation',
  },
  {
    label: 'Source Credibility',
    traditional: 'Sponsored results first',
    nexus: 'Academic + trusted sources',
  },
  {
    label: 'Conversational',
    traditional: 'No follow-up possible',
    nexus: 'Natural dialogue with memory',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function ComparisonSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background accents */}
      <div
        className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-1/4 left-0 w-[350px] h-[350px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 sm:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            The <span className="gradient-text">New Standard</span>
          </h2>
          <div
            className="mx-auto w-32 h-1 rounded-full mb-5 animate-gradient"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 100%',
            }}
          />
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            See how Nexus AI compares to traditional search engines.
          </p>
        </motion.div>

        {/* Column Headers */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Traditional Search Header */}
          <motion.div
            variants={rowVariants}
            className="glass rounded-2xl p-5 sm:p-6 flex items-center gap-3 opacity-60"
          >
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-muted-foreground">
              Traditional Search
            </h3>
          </motion.div>

          {/* Nexus AI Header */}
          <motion.div
            variants={rowVariants}
            className="glass-strong rounded-2xl p-5 sm:p-6 flex items-center gap-3 border-l-2 border-cyan-400/60"
            style={{
              boxShadow: '0 0 30px -10px rgba(103,232,249,0.15)',
            }}
          >
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold gradient-text">
              Nexus AI
            </h3>
          </motion.div>
        </motion.div>

        {/* Comparison Rows */}
        <motion.div
          className="flex flex-col gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {COMPARISONS.map((comparison, index) => (
            <motion.div
              key={comparison.label}
              variants={rowVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
            >
              {/* Traditional Column */}
              <div className="glass rounded-xl p-4 sm:p-5 flex items-center gap-3 opacity-50 hover:opacity-70 transition-opacity duration-300">
                <div className="h-7 w-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <X className="h-3.5 w-3.5 text-red-400/80" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground/60 block mb-0.5">
                    {comparison.label}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground leading-snug">
                    {comparison.traditional}
                  </span>
                </div>
              </div>

              {/* Nexus AI Column */}
              <div
                className="glass rounded-xl p-4 sm:p-5 flex items-center gap-3 border-l-2 border-cyan-400/40 hover:border-cyan-400/70 transition-colors duration-300"
                style={{
                  boxShadow: `0 0 ${20 - index * 2}px -8px rgba(103,232,249,0.1)`,
                }}
              >
                <div className="h-7 w-7 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-cyan-400/60 block mb-0.5">
                    {comparison.label}
                  </span>
                  <span className="text-xs sm:text-sm text-foreground leading-snug">
                    {comparison.nexus}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
