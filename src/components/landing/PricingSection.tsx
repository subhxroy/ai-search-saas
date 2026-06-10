'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  variant: 'free' | 'pro' | 'enterprise'
  badge?: string
}

const TIERS: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'For curious minds',
    features: [
      '10 searches per day',
      'Standard AI models',
      'Basic citations',
      'Web search',
    ],
    cta: 'Get Started',
    variant: 'free',
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/mo',
    description: 'For serious researchers',
    features: [
      'Unlimited searches',
      'Premium AI models',
      'Deep research mode',
      'Advanced citations',
      'Conversation memory',
      'File uploads',
      'Priority speed',
    ],
    cta: 'Start Pro Trial',
    variant: 'pro',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams & organizations',
    features: [
      'Everything in Pro',
      'Team workspace',
      'API access',
      'Custom integrations',
      'Admin dashboard',
      'SSO & security',
      'Priority support',
    ],
    cta: 'Contact Sales',
    variant: 'enterprise',
  },
]

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

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function PricingSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background accents */}
      <div
        className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(103,232,249,0.3) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-[450px] h-[450px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
          filter: 'blur(120px)',
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
            Simple,{' '}
            <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <div
            className="mx-auto w-32 h-1 rounded-full mb-5 animate-gradient"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #06b6d4)',
              backgroundSize: '200% 100%',
            }}
          />
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
            Start free. Scale when you&apos;re ready.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative rounded-2xl overflow-hidden ${
                tier.variant === 'pro'
                  ? 'glass-strong pricing-glow md:scale-105 md:z-10'
                  : 'glass'
              }`}
              style={
                tier.variant === 'pro'
                  ? {
                      border: '1px solid rgba(103,232,249,0.15)',
                    }
                  : undefined
              }
            >
              {/* Gradient border for Pro */}
              {tier.variant === 'pro' && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    padding: '1px',
                    background:
                      'linear-gradient(135deg, rgba(103,232,249,0.4), rgba(167,139,250,0.4), rgba(103,232,249,0.15))',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
              )}

              <div className="relative p-6 sm:p-8 flex flex-col">
                {/* Badge */}
                {tier.badge && (
                  <div className="flex justify-center mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{
                        background:
                          'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Tier Name */}
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    tier.variant === 'pro' ? 'gradient-text' : 'text-foreground'
                  }`}
                >
                  {tier.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-5">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={`text-4xl sm:text-5xl font-bold tracking-tight ${
                      tier.variant === 'pro' ? 'gradient-text' : 'text-foreground'
                    }`}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground text-sm">
                      {tier.period}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          tier.variant === 'pro'
                            ? 'text-cyan-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                      <span className="text-sm text-foreground/80">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {tier.variant === 'pro' ? (
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background:
                        'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                    }}
                  >
                    {tier.cta}
                  </button>
                ) : (
                  <button className="w-full py-3 rounded-xl font-semibold text-sm text-muted-foreground border border-border hover:text-foreground hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    {tier.cta}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
