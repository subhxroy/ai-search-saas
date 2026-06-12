'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  FileText,
  Cookie,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

/* ------------------------------------------------------------------ */
/*  Legal tab type                                                     */
/* ------------------------------------------------------------------ */

type LegalTab = 'privacy' | 'terms' | 'cookies' | 'refund'

interface LegalTabInfo {
  id: LegalTab
  label: string
  icon: React.ElementType
  lastUpdated: string
}

const LEGAL_TABS: LegalTabInfo[] = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield, lastUpdated: 'March 1, 2026' },
  { id: 'terms', label: 'Terms of Service', icon: FileText, lastUpdated: 'March 1, 2026' },
  { id: 'cookies', label: 'Cookie Policy', icon: Cookie, lastUpdated: 'February 15, 2026' },
  { id: 'refund', label: 'Refund Policy', icon: RotateCcw, lastUpdated: 'January 20, 2026' },
]

/* ------------------------------------------------------------------ */
/*  Legal content sections data                                        */
/* ------------------------------------------------------------------ */

interface LegalSection {
  id: string
  title: string
  content: string[]
}

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'data-collection',
    title: 'What Data We Collect',
    content: [
      'We collect information you provide directly, including your name, email address, and payment information when you create an account or make a purchase.',
      'We automatically collect usage data such as search queries, pages visited, time spent on features, and device information (browser type, operating system, IP address) to improve our service.',
      'Optional data includes profile information such as your company name, job title, and bio, which you may choose to provide.',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Data',
    content: [
      'We use your data to provide and improve the Nexus AI service, process your searches, and deliver research results.',
      'Usage data helps us understand how you interact with our platform so we can optimize performance, fix bugs, and develop new features.',
      'We may send you service-related emails (account verification, billing receipts, security alerts). Marketing emails require your opt-in consent.',
    ],
  },
  {
    id: 'third-parties',
    title: 'Third Parties',
    content: [
      'We use trusted third-party services for payment processing (Stripe), infrastructure (AWS), and analytics (PostHog). These providers have their own privacy policies.',
      'We never sell your personal data to third parties for marketing purposes.',
      'We may share anonymized, aggregated usage statistics with partners for research purposes.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: [
      'You have the right to access, correct, or delete your personal data at any time through your account settings or by contacting us.',
      'You can export all your data (search history, collections, account info) in a machine-readable format.',
      'If you are in the EU or UK, you have additional rights under GDPR including the right to restrict processing and data portability.',
    ],
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: [
      'We retain your account data for as long as your account is active. Upon account deletion, we remove personal data within 30 days.',
      'Search history and research data are retained for the lifetime of your account unless you manually delete them.',
      'Anonymized, aggregated data may be retained indefinitely for analytics and service improvement.',
    ],
  },
  {
    id: 'privacy-contact',
    title: 'Contact',
    content: [
      'For any privacy-related questions or requests, contact our Data Protection Officer at privacy@nexus-ai.com.',
      'We aim to respond to all privacy inquiries within 48 hours.',
    ],
  },
]

const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using Nexus AI, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.',
      'We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.',
    ],
  },
  {
    id: 'account-responsibilities',
    title: 'Account Responsibilities',
    content: [
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
      'You must provide accurate and complete information when creating your account and keep it up to date.',
      'You must notify us immediately of any unauthorized use of your account.',
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: [
      'You agree not to use Nexus AI for any illegal, harmful, or fraudulent purpose. This includes generating content that violates laws or infringes on others\' rights.',
      'You must not attempt to reverse-engineer, decompile, or extract our AI models, algorithms, or proprietary technology.',
      'Rate limits and usage quotas must be respected. Automated scraping or abuse of the service is prohibited.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: [
      'Nexus AI and its original content, features, and functionality are owned by Nexus AI Inc. and are protected by international copyright, trademark, and other intellectual property laws.',
      'You retain ownership of content you input into the service. By using Nexus AI, you grant us a limited license to process your queries and generate responses.',
      'AI-generated output may be used by you in accordance with your plan\'s terms. Enterprise users receive a full IP waiver on outputs.',
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    content: [
      'Nexus AI is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of AI-generated content.',
      'AI-generated responses may contain errors or inaccuracies. You should verify critical information independently before relying on it.',
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    content: [
      'We may suspend or terminate your account if you violate these Terms, with or without notice depending on severity.',
      'You may terminate your account at any time through account settings. Upon termination, your right to use the service ceases immediately.',
      'Provisions that by their nature should survive termination will remain in effect, including IP provisions, disclaimers, and limitations of liability.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: [
      'These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.',
      'Any disputes arising from these Terms shall be resolved in the courts of Delaware, unless otherwise required by applicable local law.',
    ],
  },
]

const COOKIES_SECTIONS: LegalSection[] = [
  {
    id: 'what-cookies',
    title: 'What Cookies We Use',
    content: [
      'Essential cookies are required for the service to function properly, including session management, authentication, and security features. These cannot be disabled.',
      'Functional cookies remember your preferences such as theme (dark/light mode), sidebar state, and display settings.',
      'Performance cookies help us understand how visitors interact with our service so we can improve it. These are always anonymized.',
    ],
  },
  {
    id: 'analytics-cookies',
    title: 'Analytics Cookies',
    content: [
      'We use PostHog for product analytics. This helps us understand feature usage, user flows, and identify areas for improvement.',
      'All analytics data is anonymized and aggregated. We do not track individual users across sessions or across other websites.',
      'You can opt out of analytics tracking in your account settings.',
    ],
  },
  {
    id: 'preference-cookies',
    title: 'Preference Cookies',
    content: [
      'These cookies allow the service to remember choices you make (such as your preferred theme, language, or layout) and provide a more personalized experience.',
      'Preference cookies are set by our domain and cannot be read by third-party websites.',
    ],
  },
  {
    id: 'managing-cookies',
    title: 'Managing Cookies',
    content: [
      'You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies.',
      'Please note that blocking essential cookies may impact the functionality of Nexus AI.',
      'For more information on managing cookies, visit your browser\'s help documentation or allaboutcookies.org.',
    ],
  },
]

const REFUND_SECTIONS: LegalSection[] = [
  {
    id: 'money-back',
    title: '30-Day Money-Back Guarantee',
    content: [
      'We offer a full refund within 30 days of your initial subscription purchase if you are not satisfied with Nexus AI.',
      'The 30-day guarantee applies to first-time purchases only. Renewals are covered by our standard refund policy.',
    ],
  },
  {
    id: 'how-to-request',
    title: 'How to Request a Refund',
    content: [
      'To request a refund, navigate to Settings → Billing → Request Refund, or email billing@nexus-ai.com with your account email and order ID.',
      'Please include a brief reason for your request — this helps us improve our service but is not required for processing.',
    ],
  },
  {
    id: 'processing-time',
    title: 'Processing Time',
    content: [
      'Refund requests are reviewed within 1 business day. Approved refunds are processed within 5-10 business days.',
      'Refunds are credited to the original payment method. Credit card refunds may take an additional billing cycle to appear on your statement.',
    ],
  },
  {
    id: 'exceptions',
    title: 'Exceptions',
    content: [
      'Refunds are not available for accounts that have been terminated due to Terms of Service violations.',
      'Partial-month refunds are not available for monthly subscriptions after the 30-day guarantee period. We recommend canceling before your renewal date.',
      'Annual subscriptions are eligible for a prorated refund within the first 30 days only.',
    ],
  },
]

const SECTIONS_MAP: Record<LegalTab, LegalSection[]> = {
  privacy: PRIVACY_SECTIONS,
  terms: TERMS_SECTIONS,
  cookies: COOKIES_SECTIONS,
  refund: REFUND_SECTIONS,
}

/* ------------------------------------------------------------------ */
/*  LegalPage component                                                */
/* ------------------------------------------------------------------ */

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy')

  const activeTabInfo = LEGAL_TABS.find((t) => t.id === activeTab)!
  const sections = SECTIONS_MAP[activeTab]

  const handleTocClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
          <Shield className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Legal</h1>
          <p className="text-sm text-muted-foreground">Policies and agreements</p>
        </div>
      </motion.div>

      {/* ======== TAB NAVIGATION ======== */}
      <motion.div variants={itemVariants} className="mt-6 mb-6">
        {/* Desktop tabs */}
        <div className="hidden sm:flex items-center gap-1 p-1 glass rounded-xl">
          {LEGAL_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 ring-1 ring-cyan-500/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile dropdown */}
        <div className="sm:hidden">
          <Select value={activeTab} onValueChange={(v) => setActiveTab(v as LegalTab)}>
            <SelectTrigger className="w-full h-10 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEGAL_TABS.map((tab) => (
                <SelectItem key={tab.id} value={tab.id}>
                  <div className="flex items-center gap-2">
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* ======== CONTENT AREA ======== */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex gap-6"
      >
        {/* Table of Contents - Desktop */}
        <div className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 glass-strong rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              On This Page
            </h3>
            <nav className="space-y-0.5">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleTocClick(section.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors text-left"
                >
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Last updated */}
          <div className="glass-strong rounded-2xl p-6">
            <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Last updated: {activeTabInfo.lastUpdated}
            </p>

            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-purple-400" />
                    {section.title}
                  </h2>
                  <div className="space-y-3 pl-3 border-l border-white/[0.04]">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
