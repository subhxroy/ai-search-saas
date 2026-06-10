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
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.25) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            From Question to Answer
          </h2>
          <div
            className="mx-auto w-32 h-1 rounded-full mb-5 animate-gradient"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 100%',
            }}
          />
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
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
                    className="timeline-line absolute top-0 h-full rounded-full"
                    style={{
                      left: `${i * segmentWidth}%`,
                      width: `${segmentWidth}%`,
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
                {/* Numbered circle with glow */}
                <div className="relative mb-5">
                  <div
                    className="absolute inset-0 rounded-full animate-glow-pulse"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(103,232,249,0.25) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                      transform: 'scale(1.8)',
                    }}
                  />
                  <div className="relative glass-strong rounded-full h-14 w-14 flex items-center justify-center border border-cyan-500/20">
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-cyan-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {i + 1}
                    </span>
                    <step.icon className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-foreground mb-2 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
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
                    className="timeline-line absolute w-full rounded-full"
                    style={{
                      top: `${i * segmentHeight}%`,
                      height: `${segmentHeight}%`,
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
                {/* Numbered circle with glow */}
                <div className="relative shrink-0 -ml-10 sm:-ml-14">
                  <div
                    className="absolute inset-0 rounded-full animate-glow-pulse"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(103,232,249,0.25) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                      transform: 'scale(2)',
                    }}
                  />
                  <div className="relative glass-strong rounded-full h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center border border-cyan-500/20">
                    <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-cyan-500 text-[9px] sm:text-[10px] font-bold text-white flex items-center justify-center">
                      {i + 1}
                    </span>
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="glass feature-card rounded-xl p-4 sm:p-5 flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
