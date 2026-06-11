'use client'

import { motion } from 'framer-motion'
import { X, Check, Search, Sparkles } from 'lucide-react'

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

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function ComparisonSection() {
  return (
    <section className="glow-red relative px-4 sm:px-6 overflow-hidden" style={{ paddingTop: 'var(--spacing-section)', paddingBottom: 'var(--spacing-section)' }}>
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="display-xl mb-4">A new standard</h2>
          <p className="body-md" style={{ color: 'var(--charcoal)' }}>
            See how Nexus AI compares to traditional search engines.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="feature-card overflow-hidden p-0">
          {/* Column Headers */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid var(--hairline)' }}>
            {/* Traditional Search */}
            <div className="flex items-center gap-3 p-6" style={{ borderRight: '1px solid var(--hairline)' }}>
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--surface-elevated)' }}
              >
                <Search className="h-4 w-4" style={{ color: 'var(--ash)' }} />
              </div>
              <span className="heading-sm" style={{ color: 'var(--ash)' }}>
                Traditional Search
              </span>
            </div>

            {/* Nexus AI */}
            <div className="flex items-center gap-3 p-6">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--surface-elevated)' }}
              >
                <Sparkles className="h-4 w-4" style={{ color: 'var(--ink)' }} />
              </div>
              <span className="heading-sm">
                Nexus AI
              </span>
            </div>
          </div>

          {/* Comparison Rows */}
          {COMPARISONS.map((comparison, index) => (
            <motion.div
              key={comparison.label}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-2"
              style={{
                borderBottom: index < COMPARISONS.length - 1 ? '1px solid var(--hairline)' : 'none',
              }}
            >
              {/* Traditional Column */}
              <div
                className="flex items-center gap-3 p-5"
                style={{
                  borderRight: '1px solid var(--hairline)',
                  opacity: 0.6,
                }}
              >
                <div
                  className="h-6 w-6 rounded flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,32,71,0.1)' }}
                >
                  <X className="h-3 w-3" style={{ color: 'var(--accent-red)' }} />
                </div>
                <div className="min-w-0">
                  <span
                    className="body-sm block mb-0.5"
                    style={{ color: 'var(--stone)' }}
                  >
                    {comparison.label}
                  </span>
                  <span className="body-sm" style={{ color: 'var(--ash)' }}>
                    {comparison.traditional}
                  </span>
                </div>
              </div>

              {/* Nexus AI Column */}
              <div className="flex items-center gap-3 p-5">
                <div
                  className="h-6 w-6 rounded flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(17,255,153,0.1)' }}
                >
                  <Check className="h-3 w-3" style={{ color: 'var(--accent-green)' }} />
                </div>
                <div className="min-w-0">
                  <span
                    className="body-sm block mb-0.5"
                    style={{ color: 'var(--stone)' }}
                  >
                    {comparison.label}
                  </span>
                  <span className="body-sm">
                    {comparison.nexus}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
