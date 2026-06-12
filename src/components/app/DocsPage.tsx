'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  FileText,
  Search,
  UserPlus,
  MessageSquare,
  Quote,
  Bookmark,
  ChevronRight,
  Sparkles,
  BookOpen,
  Telescope,
  FolderOpen,
  Users,
  Code2,
  CreditCard,
  ArrowRight,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
/*  Quick start steps                                                  */
/* ------------------------------------------------------------------ */

interface QuickStartStep {
  number: number
  title: string
  description: string
  icon: React.ElementType
}

const QUICK_START_STEPS: QuickStartStep[] = [
  {
    number: 1,
    title: 'Create your account',
    description: 'Sign up in seconds with your email or Google account.',
    icon: UserPlus,
  },
  {
    number: 2,
    title: 'Ask your first question',
    description: 'Type any question and let our AI find the best answers.',
    icon: MessageSquare,
  },
  {
    number: 3,
    title: 'Review sources and citations',
    description: 'Every answer includes verifiable sources with links.',
    icon: Quote,
  },
  {
    number: 4,
    title: 'Save to collections',
    description: 'Organize your research into shareable collections.',
    icon: Bookmark,
  },
]

/* ------------------------------------------------------------------ */
/*  Doc sections data                                                  */
/* ------------------------------------------------------------------ */

interface DocSection {
  id: string
  title: string
  icon: React.ElementType
  articles: { title: string; slug: string }[]
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    articles: [
      { title: 'Account setup and onboarding', slug: 'account-setup' },
      { title: 'Your first AI search', slug: 'first-search' },
      { title: 'Understanding citations', slug: 'citations' },
      { title: 'Keyboard shortcuts', slug: 'shortcuts' },
    ],
  },
  {
    id: 'ai-search',
    title: 'AI Search',
    icon: Telescope,
    articles: [
      { title: 'How search works', slug: 'how-search-works' },
      { title: 'Deep research mode', slug: 'deep-research' },
      { title: 'Source extraction & ranking', slug: 'source-extraction' },
      { title: 'Search operators & filters', slug: 'search-operators' },
    ],
  },
  {
    id: 'collections',
    title: 'Collections',
    icon: FolderOpen,
    articles: [
      { title: 'Creating collections', slug: 'creating-collections' },
      { title: 'Organizing your research', slug: 'organizing-research' },
      { title: 'Sharing with teammates', slug: 'sharing-collections' },
    ],
  },
  {
    id: 'team-workspace',
    title: 'Team Workspace',
    icon: Users,
    articles: [
      { title: 'Inviting team members', slug: 'inviting-members' },
      { title: 'Roles and permissions', slug: 'roles-permissions' },
      { title: 'Shared research library', slug: 'shared-library' },
      { title: 'Activity and audit logs', slug: 'audit-logs' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code2,
    articles: [
      { title: 'Authentication & API keys', slug: 'api-auth' },
      { title: 'Endpoints overview', slug: 'endpoints' },
      { title: 'Rate limits & quotas', slug: 'rate-limits' },
      { title: 'Code examples', slug: 'code-examples' },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: CreditCard,
    articles: [
      { title: 'Plans and pricing', slug: 'plans-pricing' },
      { title: 'Upgrading your plan', slug: 'upgrading' },
      { title: 'Invoices and receipts', slug: 'invoices' },
      { title: 'Refund policy', slug: 'refund-policy' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Popular articles                                                   */
/* ------------------------------------------------------------------ */

interface PopularArticle {
  title: string
  description: string
  slug: string
  views: string
}

const POPULAR_ARTICLES: PopularArticle[] = [
  {
    title: 'How does AI search work?',
    description: 'Learn how Nexus AI processes queries and surfaces relevant results.',
    slug: 'how-search-works',
    views: '12.4k',
  },
  {
    title: 'Deep research mode explained',
    description: 'Get comprehensive, cited research reports in minutes.',
    slug: 'deep-research',
    views: '9.8k',
  },
  {
    title: 'API authentication guide',
    description: 'Set up API keys and authenticate your requests.',
    slug: 'api-auth',
    views: '8.2k',
  },
  {
    title: 'Creating and sharing collections',
    description: 'Organize research and collaborate with your team.',
    slug: 'creating-collections',
    views: '7.1k',
  },
]

/* ------------------------------------------------------------------ */
/*  DocsPage component                                                 */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const { navigate } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return DOC_SECTIONS
    const q = searchQuery.toLowerCase()
    return DOC_SECTIONS.map((section) => ({
      ...section,
      articles: section.articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) || section.title.toLowerCase().includes(q)
      ),
    })).filter((s) => s.articles.length > 0)
  }, [searchQuery])

  const filteredPopular = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_ARTICLES
    const q = searchQuery.toLowerCase()
    return POPULAR_ARTICLES.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
  }, [searchQuery])

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
          <FileText className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documentation</h1>
          <p className="text-sm text-muted-foreground">Everything you need to get started</p>
        </div>
      </motion.div>

      {/* ======== SEARCH BAR ======== */}
      <motion.div variants={itemVariants} className="mt-6 mb-8">
        <div className="relative search-glow rounded-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm placeholder:text-muted-foreground/60 focus-visible:ring-cyan-500/20"
          />
        </div>
      </motion.div>

      {/* ======== QUICK START ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <h2 className="text-lg font-semibold">Quick Start</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_START_STEPS.map((step) => (
            <div
              key={step.number}
              className="relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/15 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/15 to-purple-500/15 shrink-0">
                  <step.icon className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                      {step.number}
                    </span>
                    <span className="text-sm font-medium leading-tight">{step.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ======== DOC SECTIONS (ACCORDION) ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Browse by Topic</h2>
        <div className="glass-strong rounded-2xl p-1">
          <Accordion type="multiple" defaultValue={['getting-started']} className="px-4">
            {filteredSections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-white/[0.04]">
                <AccordionTrigger className="hover:no-underline hover:text-foreground py-4">
                  <div className="flex items-center gap-2.5">
                    <section.icon className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="text-sm font-medium">{section.title}</span>
                    <span className="text-[10px] text-muted-foreground bg-white/[0.04] px-1.5 py-0.5 rounded-full ml-1">
                      {section.articles.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pb-2">
                    {section.articles.map((article) => (
                      <button
                        key={article.slug}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-white/[0.03] transition-colors group"
                      >
                        <span>{article.title}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>

      {/* ======== POPULAR ARTICLES ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Popular Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPopular.map((article) => (
            <div
              key={article.slug}
              className="glass rounded-2xl p-5 hover:border-cyan-500/15 transition-all cursor-pointer group feature-card"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-medium leading-snug group-hover:text-cyan-400 transition-colors">
                  {article.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{article.description}</p>
              <span className="text-[10px] text-muted-foreground bg-white/[0.04] px-2 py-0.5 rounded-full">
                {article.views} views
              </span>
            </div>
          ))}
        </div>
        {filteredPopular.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No articles match your search.
          </div>
        )}
      </motion.div>

      {/* ======== CTA ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium">Still need help?</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Our support team is ready to assist you</p>
        <Button
          onClick={() => navigate('support')}
          className="gap-2 rounded-xl font-semibold text-sm text-white px-6"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
        >
          Contact Support
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
