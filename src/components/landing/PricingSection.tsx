'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

interface PricingTier {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  variant: 'free' | 'pro' | 'enterprise'
  badge?: string
}

const TIERS: PricingTier[] = [
  {
    name: 'Free',
    price: '₹0',
    period: '/mo',
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
    price: '₹499',
    period: '/mo',
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
    badge: 'Recommended',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
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

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function PricingSection() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <section
      id="pricing"
      className="glow-green relative px-4 sm:px-6 overflow-hidden"
      style={{ paddingTop: 'var(--spacing-section)', paddingBottom: 'var(--spacing-section)' }}
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="display-xl mb-4">Simple pricing</h2>
          <p className="body-md" style={{ color: 'var(--charcoal)' }}>
            Start free. Upgrade when you&apos;re ready. All prices in INR.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
              className={
                tier.variant === 'pro'
                  ? 'pricing-tier-featured flex flex-col'
                  : 'pricing-tier flex flex-col'
              }
            >
              {/* Badge */}
              {tier.badge && (
                <div className="mb-6">
                  <span className="badge-pill" style={{ color: 'var(--accent-green)' }}>
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className="heading-md mb-4">{tier.name}</h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span
                  style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: '-0.05em',
                    color: 'var(--ink)',
                  }}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="body-sm" style={{ color: 'var(--stone)' }}>
                    {tier.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className="h-4 w-4 mt-0.5 shrink-0"
                      style={{ color: 'var(--accent-green)' }}
                    />
                    <span className="body-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {tier.variant === 'pro' ? (
                <button className="btn-primary w-full" onClick={() => navigate('signup')}>
                  {tier.cta}
                </button>
              ) : tier.variant === 'free' ? (
                <button className="btn-outline w-full" onClick={() => navigate('signup')}>
                  {tier.cta}
                </button>
              ) : (
                <button className="btn-ghost w-full" onClick={() => navigate('signup')}>
                  {tier.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
