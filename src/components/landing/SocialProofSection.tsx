'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

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

const statVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
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

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  )
}

export default function SocialProofSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background accents */}
      <div
        className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute bottom-1/3 right-0 w-[450px] h-[450px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 sm:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Trusted by Researchers{' '}
            <span className="gradient-text">Worldwide</span>
          </h2>
          <div
            className="mx-auto w-32 h-1 rounded-full mb-5 animate-gradient"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 100%',
            }}
          />
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Join millions who search smarter.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              className="glass feature-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center group"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text leading-none mb-2">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground leading-snug">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              variants={cardVariants}
              className="glass feature-card rounded-2xl p-6 sm:p-7 flex flex-col gap-5 group"
            >
              {/* Star Rating */}
              <StarRating />

              {/* Quote */}
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div
                    className="h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background:
                        'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    }}
                  >
                    {testimonial.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
