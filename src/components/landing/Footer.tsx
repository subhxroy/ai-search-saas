'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Search } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

const PRODUCT_LINKS = [
  { label: 'Features', action: 'scroll-features' as const },
  { label: 'Pricing', action: 'scroll-pricing' as const },
  { label: 'API', action: 'signup' as const },
  { label: 'Changelog', action: 'signup' as const },
]

const RESOURCE_LINKS = [
  { label: 'Blog', action: 'signup' as const },
  { label: 'Documentation', action: 'signup' as const },
  { label: 'Community', action: 'signup' as const },
  { label: 'Support', action: 'signup' as const },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', action: 'signup' as const },
  { label: 'Terms of Service', action: 'signup' as const },
  { label: 'Cookie Policy', action: 'signup' as const },
  { label: 'Security', action: 'signup' as const },
]

const SOCIAL_LINKS = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
]

/* ────────────────────────────────────────────
   Animation variants
   ──────────────────────────────────────────── */

const footerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const columnVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1 + i * 0.08,
    },
  }),
}

/* ────────────────────────────────────────────
   Link column component
   ──────────────────────────────────────────── */

type FooterAction = 'scroll-features' | 'scroll-pricing' | 'signup'

function LinkColumn({
  heading,
  links,
  index,
}: {
  heading: string
  links: { label: string; action: FooterAction }[]
  index: number
}) {
  const navigate = useAppStore((s) => s.navigate)

  const handleClick = (action: FooterAction) => {
    if (action === 'scroll-features') {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    } else if (action === 'scroll-pricing') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('signup')
    }
  }

  return (
    <motion.div
      custom={index}
      variants={columnVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <h4
        style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: 1.43,
          letterSpacing: '0.02em',
          color: 'var(--charcoal)',
          marginBottom: '16px',
        }}
      >
        {heading}
      </h4>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleClick(link.action)
              }}
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.43,
                letterSpacing: 0,
                color: 'var(--ash)',
                transition: 'color 0.15s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'var(--ink)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'var(--ash)'
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Footer
   ──────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: '#000000',
        padding: '64px 24px',
      }}
    >
      <motion.div
        className="mx-auto max-w-6xl"
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* ── 4-column grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="col-span-2 sm:col-span-1"
          >
            {/* Wordmark */}
            <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '5px',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search style={{ width: 12, height: 12, color: '#fcfdff' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em',
                }}
              >
                Nexus AI
              </span>
            </div>

            {/* Description */}
            <p className="body-sm" style={{ marginBottom: '20px', maxWidth: '260px' }}>
              AI-powered search that understands Indian context, delivers clarity, and accelerates discovery.
            </p>

            {/* Status indicator */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot" />
                <span
                  style={{
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: 'var(--ash)',
                  }}
                >
                  Status: Operational
                </span>
              </div>
              <span
                className="body-sm"
                style={{ color: 'var(--stone)', paddingLeft: '16px' }}
              >
                Bengaluru, India
              </span>
            </div>
          </motion.div>

          {/* Product */}
          <LinkColumn heading="Product" links={PRODUCT_LINKS} index={1} />

          {/* Resources */}
          <LinkColumn heading="Resources" links={RESOURCE_LINKS} index={2} />

          {/* Legal */}
          <LinkColumn heading="Legal" links={LEGAL_LINKS} index={3} />
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: '1px',
            background: 'var(--divider-soft)',
            marginBottom: '32px',
          }}
        />

        {/* ── Copyright row ── */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0"
          style={{
            justifyContent: 'space-between',
          }}
        >
          {/* Copyright */}
          <span
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'var(--stone)',
            }}
          >
            © 2026 Nexus AI. Made in India. All rights reserved.
          </span>

          {/* Social icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  color: 'var(--ash)',
                  transition: 'color 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--ink)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--ash)'
                }}
              >
                <Icon style={{ width: '16px', height: '16px' }} />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
