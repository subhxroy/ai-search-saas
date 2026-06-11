'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  HelpCircle,
  Search,
  BookOpen,
  CreditCard,
  Brain,
  Bug,
  ChevronDown,
  Mail,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
/*  Quick help cards data                                              */
/* ------------------------------------------------------------------ */

interface QuickHelpCard {
  title: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
}

const QUICK_HELP_CARDS: QuickHelpCard[] = [
  {
    title: 'Getting Started',
    description: 'New to Nexus? Start here',
    icon: BookOpen,
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500/15 to-cyan-600/10',
  },
  {
    title: 'Account & Billing',
    description: 'Manage your subscription',
    icon: CreditCard,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/15 to-purple-600/10',
  },
  {
    title: 'AI & Search',
    description: 'How search and AI work',
    icon: Brain,
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/15 to-emerald-600/10',
  },
  {
    title: 'Report a Bug',
    description: 'Found an issue? Let us know',
    icon: Bug,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/15 to-amber-600/10',
  },
]

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does AI search differ from regular search engines?',
    answer:
      'Nexus AI search uses advanced language models to understand the intent behind your question, not just keyword matching. It synthesizes information from multiple sources, provides direct answers with citations, and can perform deep research that goes far beyond traditional search results.',
  },
  {
    question: 'What is Deep Research mode?',
    answer:
      'Deep Research mode performs an exhaustive multi-step analysis of your query. It searches across dozens of sources, cross-references information, and produces a comprehensive research report with full citations. This process takes 1-3 minutes but saves hours of manual research.',
  },
  {
    question: 'How do I upgrade to Pro?',
    answer:
      'Navigate to Settings → Billing and click "Upgrade to Pro." You can pay with any major credit card. Pro unlocks unlimited searches, deep research mode, file uploads, and priority access to new features.',
  },
  {
    question: 'Can I share my research with others?',
    answer:
      'Yes! You can share individual search results or entire collections. Click the share icon on any result or collection to generate a shareable link. Pro users can also invite team members to shared workspaces.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Absolutely. We use end-to-end encryption for all data in transit and at rest. Your search queries and research are never used to train our models without explicit consent. You can delete your data at any time from Settings.',
  },
]

/* ------------------------------------------------------------------ */
/*  SupportPage component                                              */
/* ------------------------------------------------------------------ */

export default function SupportPage() {
  const { navigate } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const filteredFAQ = searchQuery.trim()
    ? FAQ_ITEMS.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQ_ITEMS

  const handleSubmit = () => {
    if (subject.trim() && message.trim()) {
      setSubmitted(true)
      setSubject('')
      setCategory('')
      setMessage('')
      setTimeout(() => setSubmitted(false), 4000)
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
          <HelpCircle className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support</h1>
          <p className="text-sm text-muted-foreground">We&apos;re here to help</p>
        </div>
      </motion.div>

      {/* ======== SEARCH ======== */}
      <motion.div variants={itemVariants} className="mt-6 mb-8">
        <div className="relative search-glow rounded-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm placeholder:text-muted-foreground/60 focus-visible:ring-cyan-500/20"
          />
        </div>
      </motion.div>

      {/* ======== QUICK HELP CARDS ======== */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {QUICK_HELP_CARDS.map((card) => (
          <button
            key={card.title}
            onClick={() => navigate('docs')}
            className="glass rounded-2xl p-4 text-left group feature-card cursor-pointer"
          >
            <div
              className={`h-9 w-9 rounded-lg bg-gradient-to-br ${card.bgColor} flex items-center justify-center mb-3`}
            >
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <h3 className="text-sm font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
              {card.title}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{card.description}</p>
          </button>
        ))}
      </motion.div>

      {/* ======== FAQ SECTION ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          Frequently Asked Questions
        </h2>
        <div className="glass-strong rounded-2xl p-1">
          <Accordion type="single" collapsible className="px-4">
            {filteredFAQ.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="border-white/[0.04]"
              >
                <AccordionTrigger className="hover:no-underline hover:text-foreground text-sm text-left py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {filteredFAQ.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No results match your search. Try different keywords.
          </div>
        )}
      </motion.div>

      {/* ======== CONTACT FORM ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-1">Contact Us</h2>
        <p className="text-xs text-muted-foreground mb-5">
          Can&apos;t find what you&apos;re looking for? Send us a message.
        </p>

        {submitted && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-400">Message sent! We&apos;ll get back to you shortly.</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Subject</label>
            <Input
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm placeholder:text-muted-foreground/60 focus-visible:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-10 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="feature-request">Feature Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Message</label>
            <Textarea
              placeholder="Describe your issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="bg-white/[0.03] border-white/[0.06] rounded-xl text-sm placeholder:text-muted-foreground/60 resize-none focus-visible:ring-cyan-500/20"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!subject.trim() || !message.trim()}
            className="gap-2 rounded-xl font-semibold text-sm text-white px-6 h-10"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
          >
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        </div>
      </motion.div>

      {/* ======== CONTACT INFO ======== */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/15 to-purple-500/15 flex items-center justify-center">
              <Mail className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Email Support</p>
              <p className="text-xs text-muted-foreground">support@nexus-ai.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Response Time</p>
              <p className="text-xs text-muted-foreground">We typically respond within 2 hours</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
