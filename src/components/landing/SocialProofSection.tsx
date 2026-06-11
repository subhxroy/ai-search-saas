'use client'

import { motion } from 'framer-motion'

interface Stat {
  value: string
  label: string
}

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
}

const STATS: Stat[] = [
  { value: '10M+', label: 'Searches completed' },
  { value: '95%', label: 'Faster research' },
  { value: '500K+', label: 'Active researchers' },
  { value: '4.9/5', label: 'User satisfaction' },
]

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Nexus AI cut my research time by 80%. The citations are always accurate and verifiable.',
    author: 'Dr. Sarah Chen',
    role: 'AI Researcher',
    company: 'Stanford',
  },
  {
    quote:
      'I replaced 6 different tools with Nexus. The follow-up suggestions are game-changing.',
    author: 'Marcus Rivera',
    role: 'Product Lead',
    company: 'Stripe',
  },
  {
    quote:
      "The depth of analysis with cited sources is unlike anything else. It's my daily research companion.",
    author: 'Priya Patel',
    role: 'Data Scientist',
    company: 'Google',
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function SocialProofSection() {
  return (
    <section id="customers" className="glow-yellow relative px-4 sm:px-6 overflow-hidden" style={{ paddingTop: 'var(--spacing-section)', paddingBottom: 'var(--spacing-section)' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="display-xl mb-4">Trusted by researchers</h2>
          <p className="body-md" style={{ color: 'var(--charcoal)' }}>
            Join millions who search smarter.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
              className="feature-card flex flex-col items-center text-center p-6"
            >
              <span
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  letterSpacing: '-0.05em',
                  color: 'var(--ink)',
                }}
              >
                {stat.value}
              </span>
              <span className="body-sm">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.1 }}
              className="feature-card-bordered flex flex-col"
            >
              {/* Quote */}
              <p className="body-md mb-6 flex-1" style={{ color: 'var(--body)' }}>
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div
                className="pt-5"
                style={{ borderTop: '1px solid var(--hairline)' }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div
                    className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center"
                    style={{ background: 'var(--surface-elevated)' }}
                  >
                    <span className="body-sm" style={{ color: 'var(--ash)', fontSize: '12px' }}>
                      {testimonial.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="body-sm" style={{ color: 'var(--ink)' }}>
                      {testimonial.author}
                    </p>
                    <p className="body-sm" style={{ color: 'var(--stone)' }}>
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
