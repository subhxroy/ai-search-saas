'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Search,
  Clock,
  Target,
  DollarSign,
  CreditCard,
  UserMinus,
  Zap,
  ArrowUpRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
/*  Time range                                                         */
/* ------------------------------------------------------------------ */

type TimeRange = '7d' | '30d' | '90d' | '1y'

const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
  { id: '90d', label: '90D' },
  { id: '1y', label: '1Y' },
]

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface MetricCard {
  label: string
  value: string
  change: string
  direction: 'up' | 'down'
  isPositive: boolean
  icon: React.ElementType
  gradient: string
}

const KEY_METRICS: MetricCard[] = [
  {
    label: 'Active Users',
    value: '2,847',
    change: '+12%',
    direction: 'up',
    isPositive: true,
    icon: Users,
    gradient: 'from-cyan-500/15 to-cyan-500/5',
  },
  {
    label: 'Search Volume',
    value: '48.2K',
    change: '+8%',
    direction: 'up',
    isPositive: true,
    icon: Search,
    gradient: 'from-purple-500/15 to-purple-500/5',
  },
  {
    label: 'Avg Response Time',
    value: '2.3s',
    change: '-15%',
    direction: 'down',
    isPositive: true,
    icon: Clock,
    gradient: 'from-emerald-500/15 to-emerald-500/5',
  },
  {
    label: 'Conversion Rate',
    value: '4.7%',
    change: '+0.3%',
    direction: 'up',
    isPositive: true,
    icon: Target,
    gradient: 'from-amber-500/15 to-amber-500/5',
  },
]

const DAILY_SEARCH_VOLUME = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 85 },
  { day: 'Wed', value: 68 },
  { day: 'Thu', value: 94 },
  { day: 'Fri', value: 88 },
  { day: 'Sat', value: 45 },
  { day: 'Sun', value: 52 },
]

const TOP_QUERIES = [
  { query: 'AI trends 2026', count: 1247 },
  { query: 'quantum computing explained', count: 983 },
  { query: 'climate tech investments', count: 876 },
  { query: 'SaaS pricing models', count: 754 },
  { query: 'machine learning frameworks', count: 691 },
  { query: 'cybersecurity best practices', count: 583 },
  { query: 'blockchain applications', count: 472 },
  { query: 'remote work productivity', count: 398 },
]

const MODEL_USAGE = [
  { name: 'GPT-4', percent: 45, color: 'bg-cyan-500' },
  { name: 'Claude', percent: 30, color: 'bg-purple-500' },
  { name: 'Gemini', percent: 25, color: 'bg-emerald-500' },
]

interface PopularSource {
  domain: string
  mentions: number
  relevance: string
}

const POPULAR_SOURCES: PopularSource[] = [
  { domain: 'arxiv.org', mentions: 4521, relevance: '94%' },
  { domain: 'nature.com', mentions: 3847, relevance: '91%' },
  { domain: 'techcrunch.com', mentions: 2963, relevance: '87%' },
  { domain: 'wikipedia.org', mentions: 2841, relevance: '82%' },
  { domain: 'medium.com', mentions: 2156, relevance: '78%' },
  { domain: 'github.com', mentions: 1987, relevance: '85%' },
  { domain: 'reuters.com', mentions: 1734, relevance: '89%' },
  { domain: 'bloomberg.com', mentions: 1523, relevance: '90%' },
]

const SIGNUP_DATA = [12, 18, 15, 22, 28, 24, 35, 31, 27, 38, 42, 36, 45, 40]

const BILLING_METRICS = [
  { label: 'MRR', value: '$47,280', icon: DollarSign, color: 'text-cyan-400' },
  { label: 'Active Subscriptions', value: '2,147', icon: CreditCard, color: 'text-purple-400' },
  { label: 'Churn Rate', value: '2.3%', icon: UserMinus, color: 'text-amber-400' },
]

/* ------------------------------------------------------------------ */
/*  AnalyticsPage component                                            */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const { currentUser } = useAppStore()
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')

  const isAdmin = currentUser?.role === 'admin'
  const maxSearchValue = Math.max(...DAILY_SEARCH_VOLUME.map((d) => d.value))
  const maxQueryCount = Math.max(...TOP_QUERIES.map((q) => q.count))
  const maxSignup = Math.max(...SIGNUP_DATA)

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'Platform performance insights' : 'Workspace analytics overview'}
            </p>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex gap-1 p-1 glass rounded-xl">
          {TIME_RANGES.map((range) => {
            const isActive = timeRange === range.id
            return (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ======== KEY METRICS ROW ======== */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KEY_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="glass-strong rounded-2xl p-5 hover:border-cyan-500/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${metric.gradient} flex items-center justify-center`}>
                <metric.icon className="h-4 w-4 text-foreground/80" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                metric.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {metric.direction === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {metric.change}
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{metric.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ======== CHARTS AREA ======== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Search Volume Chart */}
        <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-cyan-400" />
            Search Volume (This Week)
          </h3>
          <div className="flex items-end gap-3 h-40">
            {DAILY_SEARCH_VOLUME.map((item) => {
              const height = (item.value / maxSearchValue) * 100
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-medium">{item.value}</span>
                  <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/80 to-cyan-400/40 rounded-t-lg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">{item.day}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Top Queries */}
        <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            Top Queries
          </h3>
          <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-thin">
            {TOP_QUERIES.map((query, i) => {
              const width = (query.count / maxQueryCount) * 100
              return (
                <div key={query.query} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground w-4 text-right font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">{query.query}</span>
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">{query.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500/80 to-purple-400/40"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* ======== MODEL USAGE ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          Model Usage Distribution
        </h3>
        {/* Stacked bar */}
        <div className="h-8 w-full rounded-full overflow-hidden flex mb-3">
          {MODEL_USAGE.map((model) => (
            <div
              key={model.name}
              className={`${model.color} relative group transition-all`}
              style={{ width: `${model.percent}%` }}
            >
              <div className="absolute inset-0 bg-white/10" />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {model.percent}%
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {MODEL_USAGE.map((model) => (
            <div key={model.name} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${model.color}`} />
              <span className="text-xs text-muted-foreground">{model.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ======== POPULAR SOURCES ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          Popular Sources
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Domain</TableHead>
                <TableHead className="text-muted-foreground">Mentions</TableHead>
                <TableHead className="text-muted-foreground">Avg Relevance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {POPULAR_SOURCES.map((source) => (
                <TableRow key={source.domain} className="border-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-gradient-to-br from-cyan-500/15 to-purple-500/15 flex items-center justify-center ring-1 ring-white/5 text-[8px] font-bold">
                        {source.domain[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{source.domain}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {source.mentions.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-semibold ${
                        parseInt(source.relevance) >= 90
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : parseInt(source.relevance) >= 80
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {source.relevance}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* ======== USER ACTIVITY ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-cyan-400" />
          User Signups Over Time
        </h3>
        <div className="flex items-end gap-1.5 h-24">
          {SIGNUP_DATA.map((value, i) => {
            const height = (value / maxSignup) * 100
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, rgba(103,232,249,0.6), rgba(167,139,250,0.3))`,
                }}
              />
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">2 weeks ago</span>
          <span className="text-[10px] text-muted-foreground">Today</span>
        </div>
      </motion.div>

      {/* ======== BILLING METRICS ======== */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BILLING_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="glass-strong rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="h-10 w-10 rounded-xl bg-white/3 flex items-center justify-center ring-1 ring-white/5">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="text-lg font-bold">{metric.value}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
