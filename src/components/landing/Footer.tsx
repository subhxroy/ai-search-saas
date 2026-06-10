'use client'

import { motion } from 'framer-motion'
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react'

const PRODUCT_LINKS = ['Features', 'Pricing', 'API', 'Changelog']
const RESOURCE_LINKS = ['Blog', 'Documentation', 'Community', 'Support']
const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security']

const SOCIAL_LINKS = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
]

const footerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function Footer() {
  return (
    <footer className="relative mt-auto">
      {/* Gradient top border */}
      <div
        className="h-px w-full animate-gradient"
        style={{
          background:
            'linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, transparent)',
          backgroundSize: '200% 100%',
        }}
      />

      <div className="bg-background/50 backdrop-blur-sm">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Main footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 mb-12">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <span className="text-lg font-bold gradient-text">Nexus AI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                The future of AI-powered search
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {RESOURCE_LINKS.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 Nexus AI. All rights reserved.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-white transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
