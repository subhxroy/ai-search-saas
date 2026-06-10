'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function FinalCTASection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(103,232,249,0.06) 0%, rgba(167,139,250,0.04) 25%, rgba(103,232,249,0.02) 50%, rgba(167,139,250,0.06) 75%, rgba(103,232,249,0.04) 100%)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.4) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Headline */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
        >
          Start Searching{' '}
          <span className="gradient-text">Smarter</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          Join millions of researchers, developers, and thinkers who trust Nexus
          AI for accurate, cited answers.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            }}
          >
            Get Started — It&apos;s Free
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Secondary text */}
        <motion.p
          variants={itemVariants}
          className="mt-4 text-xs sm:text-sm text-muted-foreground/60"
        >
          No credit card required
        </motion.p>
      </motion.div>
    </section>
  )
}
