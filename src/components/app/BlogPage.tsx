'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  PenSquare,
  ArrowRight,
  Clock,
  Calendar,
  Mail,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

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
/*  Category helpers                                                   */
/* ------------------------------------------------------------------ */

type BlogCategory = 'Product' | 'Research' | 'Tutorial' | 'Engineering'

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  Product: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Research: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Tutorial: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Engineering: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

const CATEGORY_GRADIENTS: Record<BlogCategory, string> = {
  Product: 'from-cyan-500/40 to-cyan-600/20',
  Research: 'from-purple-500/40 to-purple-600/20',
  Tutorial: 'from-emerald-500/40 to-emerald-600/20',
  Engineering: 'from-amber-500/40 to-amber-600/20',
}

const ALL_CATEGORIES: ('All' | BlogCategory)[] = ['All', 'Product', 'Research', 'Tutorial', 'Engineering']

/* ------------------------------------------------------------------ */
/*  Blog post data                                                     */
/* ------------------------------------------------------------------ */

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: BlogCategory
  date: string
  readTime: string
  featured?: boolean
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Introducing Deep Research Mode',
    excerpt:
      'Our new deep research mode delivers comprehensive, cited research reports that synthesize information from dozens of sources — saving you hours of manual work.',
    category: 'Product',
    date: 'Mar 3, 2026',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: '2',
    title: 'How RAG Pipelines Power Nexus AI Search',
    excerpt:
      'A deep dive into the retrieval-augmented generation architecture that makes our search results accurate and verifiable.',
    category: 'Engineering',
    date: 'Feb 27, 2026',
    readTime: '8 min read',
  },
  {
    id: '3',
    title: '5 Tips for Better AI Research Queries',
    excerpt:
      'Learn how to phrase your questions to get more precise, relevant answers from AI-powered search tools.',
    category: 'Tutorial',
    date: 'Feb 22, 2026',
    readTime: '4 min read',
  },
  {
    id: '4',
    title: 'The State of AI Search in 2026',
    excerpt:
      'We analyzed 2 million search queries to uncover trends in how professionals use AI for research.',
    category: 'Research',
    date: 'Feb 18, 2026',
    readTime: '6 min read',
  },
  {
    id: '5',
    title: 'Collections 2.0: Collaborative Research',
    excerpt:
      'Share collections with your team, add annotations, and build a shared knowledge base together.',
    category: 'Product',
    date: 'Feb 12, 2026',
    readTime: '4 min read',
  },
  {
    id: '6',
    title: 'Building an Efficient Embedding Index',
    excerpt:
      'How we optimized our vector search to deliver sub-100ms results across billions of documents.',
    category: 'Engineering',
    date: 'Feb 7, 2026',
    readTime: '10 min read',
  },
  {
    id: '7',
    title: 'Getting Started with the Nexus AI API',
    excerpt:
      'A step-by-step tutorial on integrating AI search into your own applications using our REST API.',
    category: 'Tutorial',
    date: 'Feb 1, 2026',
    readTime: '7 min read',
  },
]

/* ------------------------------------------------------------------ */
/*  BlogPage component                                                 */
/* ------------------------------------------------------------------ */

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | BlogCategory>('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return BLOG_POSTS
    return BLOG_POSTS.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const featuredPost = BLOG_POSTS.find((p) => p.featured)
  const gridPosts = filteredPosts.filter((p) => !p.featured)

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
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
          <PenSquare className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-sm text-muted-foreground">Insights, tips, and updates</p>
        </div>
      </motion.div>

      {/* ======== FEATURED POST ======== */}
      {featuredPost && activeCategory === 'All' && (
        <motion.div variants={itemVariants} className="mt-6 mb-8">
          <div className="glass-strong rounded-2xl overflow-hidden group feature-card cursor-pointer">
            {/* Gradient overlay image placeholder */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[featuredPost.category]}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className={`${CATEGORY_COLORS[featuredPost.category]} text-[10px] font-semibold border`}>
                  {featuredPost.category === 'Product' ? 'Product Update' : featuredPost.category}
                </Badge>
              </div>
            </div>
            <div className="p-6 -mt-12 relative">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {featuredPost.readTime}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ======== CATEGORY FILTER ======== */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6 flex-wrap">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 ring-1 ring-cyan-500/20'
                : 'bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] ring-1 ring-white/[0.04]'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* ======== POST GRID ======== */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {gridPosts.map((post) => (
          <div
            key={post.id}
            className="glass rounded-2xl p-5 group cursor-pointer feature-card"
          >
            <Badge
              className={`${CATEGORY_COLORS[post.category]} text-[10px] font-semibold border mb-3`}
            >
              {post.category}
            </Badge>
            <h3 className="text-sm font-semibold mb-2 leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {post.date}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-sm text-muted-foreground">
          No posts found in this category.
        </div>
      )}

      {/* ======== NEWSLETTER SIGNUP ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/15 to-purple-500/15 flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Subscribe to our newsletter</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get the latest articles and product updates delivered to your inbox.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-10 bg-white/[0.03] border-white/[0.06] rounded-xl text-sm placeholder:text-muted-foreground/60 focus-visible:ring-cyan-500/20"
            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
          />
          <Button
            onClick={handleSubscribe}
            className="h-10 px-5 rounded-xl font-semibold text-sm text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
          >
            {subscribed ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </div>
        {subscribed && (
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            You&apos;re subscribed! Check your inbox.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
