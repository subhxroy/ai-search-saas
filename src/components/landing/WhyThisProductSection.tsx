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
    description: 'Search the entire web in real-time. No stale data, no outdated answers.',
  },
  {
    icon: Quote,
    title: 'Accurate Citations',
    description: 'Every claim backed by sources. Click any citation to verify.',
  },
  {
    icon: Brain,
    title: 'Multi-Model AI',
    description: 'Powered by multiple AI models for the best possible answer.',
  },
  {
    icon: Telescope,
    title: 'Deep Research Mode',
    description: 'Go deeper with research mode for comprehensive analysis.',
  },
  {
    icon: MessageSquare,
    title: 'Conversation Memory',
    description: 'Your context persists. Ask follow-ups naturally.',
  },
  {
    icon: Sparkles,
    title: 'Smart Follow-ups',
    description: 'AI suggests what to ask next. Never hit a dead end.',
  },
  {
    icon: FileUp,
    title: 'File Uploads',
    description: 'Upload documents, images, and files for AI analysis.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Responses stream in real-time. No waiting for full generation.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
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

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function WhyThisProductSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Why{' '}
            <span className="gradient-text">Nexus AI</span>
          </h2>
          <div
            className="mx-auto w-32 h-1 rounded-full mb-5 animate-gradient"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 100%',
            }}
          />
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Every feature designed for depth, speed, and trust.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="glass feature-card rounded-2xl p-6 flex flex-col items-start gap-4 group"
            >
              {/* Icon in glass circle */}
              <div className="glass rounded-xl h-11 w-11 flex items-center justify-center shrink-0 group-hover:bg-white/[0.06] transition-colors duration-300">
                <feature.icon className="h-5 w-5 text-cyan-400" />
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
