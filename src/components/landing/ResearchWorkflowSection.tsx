'use client'

import { motion } from 'framer-motion'
import {
  MessageCircle,
  Search,
  Brain,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Step {
  icon: LucideIcon
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: MessageCircle,
    title: 'Ask Your Question',
    description: 'Type any question in natural language. No keywords needed.',
  },
  {
    icon: Search,
    title: 'Web Search Instantly',
    description: 'Our engine searches the entire web in milliseconds.',
  },
  {
    icon: Brain,
    title: 'AI Analyzes Information',
    description: 'Multiple AI models process and cross-reference results.',
  },
  {
    icon: Sparkles,
    title: 'Smart Answer Generated',
    description: 'A structured, comprehensive answer is synthesized.',
  },
  {
    icon: BookOpen,
    title: 'Sources Cited',
    description: 'Every claim linked to its source. Verify anything instantly.',
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

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const lineVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.15 + 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const verticalLineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.15 + 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export default function ResearchWorkflowSection() {
  return (
    <section className="glow-blue relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="display-lg mb-4">From Question to Answer</h2>
          <div
            className="mx-auto w-32 h-1 rounded-full mb-5"
            style={{ background: 'var(--accent-blue)' }}
          />
          <p className="body-md max-w-lg mx-auto">
            Five steps. Ten seconds. Complete clarity.
          </p>
        </motion.div>

        {/* Desktop: Horizontal Timeline (lg+) */}
        <div className="hidden lg:block">
          <div className="relative flex items-start justify-between">
            {/* Horizontal connector line behind the circles */}
            <div className="absolute top-[28px] left-[56px] right-[56px] h-[2px]">
              {STEPS.slice(0, -1).map((_, i) => {
                const segmentWidth = 100 / (STEPS.length - 1)
                return (
                  <motion.div
                    key={`line-h-${i}`}
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${i * segmentWidth}%`,
                      width: `${segmentWidth}%`,
                      background: 'var(--hairline-strong)',
                    }}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  />
                )
              })}
            </div>

            {/* Step nodes */}
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-col items-center text-center relative z-10"
                style={{ width: `${100 / STEPS.length}%` }}
              >
                {/* Numbered circle */}
                <div className="relative mb-5">
                  <div
                    className="rounded-full h-14 w-14 flex items-center justify-center"
                    style={{
                      background: 'var(--surface-card)',
                      border: '1px solid var(--hairline-strong)',
                    }}
                  >
                    <span
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{
                        background: 'var(--accent-blue)',
                        color: 'var(--primary-on)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <step.icon className="h-5 w-5" style={{ color: 'var(--accent-blue)' }} />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-sm font-semibold mb-2 leading-snug"
                  style={{ color: 'var(--ink)' }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="text-xs leading-relaxed max-w-[180px]"
                  style={{ color: 'var(--ash)' }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Timeline */}
        <div className="lg:hidden">
          <div className="relative pl-10 sm:pl-14">
            {/* Vertical connector line */}
            <div className="absolute left-[17px] sm:left-[23px] top-0 bottom-0 w-[2px]">
              {STEPS.slice(0, -1).map((_, i) => {
                const segmentHeight = 100 / (STEPS.length - 1)
                return (
                  <motion.div
                    key={`line-v-${i}`}
                    className="absolute w-full rounded-full"
                    style={{
                      top: `${i * segmentHeight}%`,
                      height: `${segmentHeight}%`,
                      background: 'var(--hairline-strong)',
                    }}
                    custom={i}
                    variants={verticalLineVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                  />
                )
              })}
            </div>

            {/* Step nodes */}
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative flex items-start gap-4 sm:gap-5 mb-10 last:mb-0"
              >
                {/* Numbered circle */}
                <div className="relative shrink-0 -ml-10 sm:-ml-14">
                  <div
                    className="rounded-full h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center"
                    style={{
                      background: 'var(--surface-card)',
                      border: '1px solid var(--hairline-strong)',
                    }}
                  >
                    <span
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center"
                      style={{
                        background: 'var(--accent-blue)',
                        color: 'var(--primary-on)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--accent-blue)' }} />
                  </div>
                </div>

                {/* Content */}
                <div className="feature-card-bordered flex-1 min-w-0" style={{ padding: '16px 20px' }}>
                  <h3
                    className="text-sm sm:text-base font-semibold mb-1.5 leading-snug"
                    style={{ color: 'var(--ink)' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: 'var(--ash)' }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
