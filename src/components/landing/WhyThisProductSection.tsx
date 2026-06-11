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
}

const FEATURES: Feature[] = [
  {
    icon: Globe,
    title: 'Real-time Web Search',
    description: 'Search the entire web in real-time. No stale data, no outdated answers — always current.',
  },
  {
    icon: Quote,
    title: 'Accurate Citations',
    description: 'Every claim backed by sources. Click any citation to verify the original material.',
  },
  {
    icon: Brain,
    title: 'Multi-Model AI',
    description: 'Powered by multiple AI models, orchestrated for the best possible answer to your query.',
  },
  {
    icon: Telescope,
    title: 'Deep Research Mode',
    description: 'Go deeper with research mode for comprehensive, multi-source analysis on complex topics.',
  },
  {
    icon: MessageSquare,
    title: 'Conversation Memory',
    description: 'Your context persists across turns. Ask follow-ups naturally without repeating yourself.',
  },
  {
    icon: Sparkles,
    title: 'Smart Follow-ups',
    description: 'AI suggests what to ask next. Never hit a dead end — always one question away from insight.',
  },
  {
    icon: FileUp,
    title: 'File Uploads',
    description: 'Upload documents, images, and files for AI analysis. PDFs, spreadsheets, and more.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Responses stream in real-time. No waiting for full generation — answers as they arrive.',
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
      className="glow-orange"
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
            Built for depth
          </h2>
          <p className="body-md max-w-[520px]" style={{ color: 'var(--charcoal)' }}>
            Every feature designed for depth, speed, and trust.
            No shortcuts, no compromises.
          </p>
        </motion.div>

        {/* Feature Cards Grid — 3 col desktop, 2 tablet, 1 mobile */}
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
              className="feature-card-bordered flex flex-col gap-4"
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                style={{ background: 'var(--surface-elevated)' }}
              >
                <feature.icon
                  className="h-5 w-5"
                  style={{ color: 'var(--accent-blue)' }}
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
