'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin } from 'lucide-react'

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

const PRODUCT_LINKS = ['Features', 'Pricing', 'API', 'Changelog']
const RESOURCE_LINKS = ['Blog', 'Documentation', 'Community', 'Support']
const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security']

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

function LinkColumn({
  heading,
  links,
  index,
}: {
  heading: string
  links: string[]
  index: number
}) {
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
          <li key={link}>
            <a
              href="#"
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.43,
                letterSpacing: 0,
                color: 'var(--ash)',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLElement).style.color = 'var(--ink)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLElement).style.color = 'var(--ash)'
              }}
            >
              {link}
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
      style={{
        background: '#000000',
        padding: '64px 32px',
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
            marginBottom: '48px',
          }}
          className="max-sm:grid-cols-2 max-sm:gap-8"
        >
          {/* Brand column */}
          <motion.div
            custom={0}
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-sm:col-span-2"
          >
            {/* Wordmark */}
            <span className="heading-sm" style={{ display: 'block', marginBottom: '12px' }}>
              Nexus AI
            </span>

            {/* Description */}
            <p className="body-sm" style={{ marginBottom: '20px', maxWidth: '260px' }}>
              AI-powered search that understands context, delivers clarity, and accelerates discovery.
            </p>

            {/* Status indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                className="status-dot"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: 'var(--accent-green)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
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
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="max-sm:flex-col max-sm:gap-4"
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
            © 2026 Nexus AI. All rights reserved.
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
