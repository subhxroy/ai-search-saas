'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function FinalCTASection() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <section className="glow-blue relative px-4 sm:px-6 overflow-hidden" style={{ paddingTop: 'var(--spacing-section)', paddingBottom: 'var(--spacing-section)' }}>
      <motion.div
        className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 },
          },
        }}
      >
        {/* Headline */}
        <motion.h2 variants={itemVariants} className="display-xl mb-4">
          Get started today
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="body-lg mb-10 max-w-lg"
          style={{ color: 'var(--charcoal)' }}
        >
          Join lakhs of researchers, developers, and thinkers across India who trust Nexus
          AI for accurate, cited answers.
        </motion.p>

        {/* CTA Button — the single bright white pixel */}
        <motion.div variants={itemVariants}>
          <button
            className="btn-primary inline-flex items-center gap-2"
            style={{ height: '44px', padding: '0 24px', fontSize: '15px' }}
            onClick={() => navigate('signup')}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Secondary text */}
        <motion.p
          variants={itemVariants}
          className="mt-4 body-sm"
          style={{ color: 'var(--stone)' }}
        >
No credit card or UPI required
        </motion.p>
      </motion.div>
    </section>
  )
}
