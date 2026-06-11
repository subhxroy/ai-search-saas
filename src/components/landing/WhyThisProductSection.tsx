'use client'

import { motion } from 'framer-motion'
import {
  Globe,
  Quote,
  Brain,
  Telescope,
  MessageSquare,
  Sparkles,
  FileUp,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  accent: string
}

const FEATURES: Feature[] = [
  {
    icon: Globe,
    title: 'Real-time Web Search',
    description: 'Search the entire web in real-time. No stale data, no outdated answers — always current.',
    accent: 'var(--accent-blue)',
  },
  {
    icon: Quote,
    title: 'Accurate Citations',
    description: 'Every claim backed by sources. Click any citation to verify the original material.',
    accent: 'var(--accent-green)',
  },
  {
    icon: Brain,
    title: 'Multi-Model AI',
    description: 'Powered by multiple AI models, orchestrated for the best possible answer to your query.',
    accent: 'var(--accent-orange)',
  },
  {
    icon: Telescope,
    title: 'Deep Research Mode',
    description: 'Go deeper with research mode for comprehensive, multi-source analysis on complex topics.',
    accent: 'var(--accent-blue)',
  },
  {
    icon: MessageSquare,
    title: 'Conversation Memory',
    description: 'Your context persists across turns. Ask follow-ups naturally without repeating yourself.',
    accent: 'var(--accent-yellow)',
  },
  {
    icon: Sparkles,
    title: 'Smart Follow-ups',
    description: 'AI suggests what to ask next. Never hit a dead end — always one question away from insight.',
    accent: 'var(--accent-orange)',
  },
  {
    icon: FileUp,
    title: 'File Uploads',
    description: 'Upload documents, images, and files for AI analysis. PDFs, spreadsheets, and more.',
    accent: 'var(--accent-green)',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Responses stream in real-time. No waiting for full generation — answers as they arrive.',
    accent: 'var(--accent-yellow)',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function WhyThisProductSection() {
  return (
    <section
      id="features"
      className="glow-orange"
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
            Built for depth
          </h2>
          <p className="body-md max-w-[520px]" style={{ color: 'var(--charcoal)' }}>
            Every feature designed for depth, speed, and trust.
            No shortcuts, no compromises.
          </p>
        </motion.div>

        {/* Feature Cards Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="feature-card-bordered flex flex-col gap-4 group cursor-default"
              style={{ transition: 'border-color 0.2s ease, background 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.background = 'var(--surface-elevated)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--hairline-strong)'
                e.currentTarget.style.background = 'var(--surface-card)'
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                style={{ background: 'var(--surface-elevated)', border: '1px solid var(--hairline)', transition: 'border-color 0.2s ease' }}
              >
                <feature.icon
                  className="h-5 w-5"
                  style={{ color: feature.accent }}
                />
              </div>

              {/* Title */}
              <h3 className="heading-sm">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="body-sm" style={{ marginTop: '-4px' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
