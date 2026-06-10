'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  CreditCard,
  Check,
  Sparkles,
  Zap,
  Search,
  FileText,
  Upload,
  Code2,
  Download,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
/*  Plan data                                                          */
/* ------------------------------------------------------------------ */

interface PlanData {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  variant: 'free' | 'pro' | 'enterprise'
  badge?: string
}

const PLANS: PlanData[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: ['10 searches/day', 'Standard AI', 'Basic citations', 'Web search'],
    cta: 'Downgrade',
    variant: 'free',
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/mo',
    features: [
      'Unlimited searches',
      'Premium AI',
      'Deep research',
      'Memory',
      'Uploads',
    ],
    cta: 'Current Plan',
    variant: 'pro',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Everything in Pro +', 'Team workspace', 'API access', 'SSO'],
    cta: 'Contact Sales',
    variant: 'enterprise',
  },
]

/* ------------------------------------------------------------------ */
/*  Usage data                                                         */
/* ------------------------------------------------------------------ */

interface UsageItem {
  label: string
  icon: React.ElementType
  current: number
  limit: number | null
  color: string
}

const USAGE: UsageItem[] = [
  { label: 'Searches', icon: Search, current: 47, limit: null, color: 'from-cyan-500 to-cyan-400' },
  { label: 'Research Reports', icon: FileText, current: 3, limit: 50, color: 'from-purple-500 to-purple-400' },
  { label: 'File Uploads', icon: Upload, current: 2, limit: 100, color: 'from-emerald-500 to-emerald-400' },
  { label: 'API Calls', icon: Code2, current: 0, limit: 10000, color: 'from-amber-500 to-amber-400' },
]

/* ------------------------------------------------------------------ */
/*  Invoice data                                                       */
/* ------------------------------------------------------------------ */

interface Invoice {
  id: string
  date: string
  amount: string
  status: 'Paid' | 'Pending' | 'Upcoming'
}

const INVOICES: Invoice[] = [
  { id: 'INV-001', date: 'Jun 1, 2026', amount: '$20.00', status: 'Paid' },
  { id: 'INV-002', date: 'May 1, 2026', amount: '$20.00', status: 'Paid' },
  { id: 'INV-003', date: 'Jul 1, 2026', amount: '$20.00', status: 'Upcoming' },
]

/* ------------------------------------------------------------------ */
/*  BillingPage component                                              */
/* ------------------------------------------------------------------ */

export default function BillingPage() {
  const { currentUser } = useAppStore()
  const plan = currentUser?.plan || 'free'

  const planLabel = plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Free'

  const getPlanBadgeGradient = (p: string) => {
    if (p === 'pro') return 'from-cyan-500 to-purple-500'
    if (p === 'enterprise') return 'from-purple-500 to-pink-500'
    return 'from-gray-500 to-gray-400'
  }

  const getUsagePercent = (item: UsageItem) => {
    if (item.limit === null) return Math.min((item.current / 100) * 100, 100)
    return (item.current / item.limit) * 100
  }

  const getUsageLabel = (item: UsageItem) => {
    if (item.limit === null) return `${item.current}/Unlimited`
    return `${item.current}/${item.limit.toLocaleString()}`
  }

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
          <CreditCard className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">Manage your subscription and usage</p>
        </div>
      </motion.div>

      {/* ======== CURRENT PLAN CARD ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${getPlanBadgeGradient(plan).replace('from-', '').replace('to-', '')})`,
              }}
            >
              <Sparkles className="h-3 w-3" />
              {planLabel}
            </span>
            <span className="text-sm text-muted-foreground">Your current plan</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Billing period: <span className="text-foreground font-medium">Monthly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <p className="text-xs text-muted-foreground mb-0.5">Searches today</p>
            <p className="text-lg font-bold">
              47 <span className="text-xs font-normal text-muted-foreground">/ Unlimited</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <p className="text-xs text-muted-foreground mb-0.5">Research reports this week</p>
            <p className="text-lg font-bold">
              3 <span className="text-xs font-normal text-muted-foreground">/ 50</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/3 border border-white/5">
            <p className="text-xs text-muted-foreground mb-0.5">Next billing date</p>
            <p className="text-lg font-bold">Jul 1, 2026</p>
          </div>
        </div>
      </motion.div>

      {/* ======== PLAN COMPARISON ======== */}
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Compare Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((p) => {
            const isCurrent = p.variant === plan
            return (
              <div
                key={p.name}
                className={`relative rounded-2xl p-5 flex flex-col transition-all ${
                  isCurrent
                    ? 'glass-strong border-cyan-500/15'
                    : 'glass'
                }`}
                style={
                  isCurrent
                    ? { border: '1px solid rgba(103,232,249,0.15)' }
                    : undefined
                }
              >
                {isCurrent && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      padding: '1px',
                      background:
                        'linear-gradient(135deg, rgba(103,232,249,0.3), rgba(167,139,250,0.3), rgba(103,232,249,0.1))',
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                )}

                <div className="relative flex flex-col flex-1">
                  {/* Badge */}
                  {p.badge && (
                    <div className="flex justify-center mb-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{
                          background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                        }}
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {p.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      isCurrent ? 'gradient-text' : 'text-foreground'
                    }`}
                  >
                    {p.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span
                      className={`text-3xl font-bold tracking-tight ${
                        isCurrent ? 'gradient-text' : 'text-foreground'
                      }`}
                    >
                      {p.price}
                    </span>
                    {p.period && (
                      <span className="text-sm text-muted-foreground">{p.period}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5 flex-1">
                    {p.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check
                          className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                            isCurrent ? 'text-cyan-400' : 'text-muted-foreground'
                          }`}
                        />
                        <span className="text-xs text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <Button
                      disabled
                      className="w-full py-2 rounded-xl font-semibold text-sm text-white"
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                      }}
                    >
                      Current Plan
                    </Button>
                  ) : p.variant === 'enterprise' ? (
                    <Button
                      variant="outline"
                      className="w-full py-2 rounded-xl font-semibold text-sm border-white/10 hover:bg-accent"
                    >
                      Contact Sales
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full py-2 rounded-xl font-semibold text-sm border-white/10 hover:bg-accent"
                    >
                      Downgrade
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ======== USAGE METERS ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          Usage This Period
        </h2>
        <div className="space-y-5">
          {USAGE.map((item) => {
            const percent = getUsagePercent(item)
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{getUsageLabel(item)}</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ======== PAYMENT METHOD ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-[10px] font-bold tracking-wider">
              VISA
            </div>
            <div>
              <h3 className="text-sm font-medium">Visa ending in 4242</h3>
              <p className="text-xs text-muted-foreground">Expires 12/2028</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-white/10 hover:bg-accent text-xs"
          >
            Update
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </motion.div>

      {/* ======== INVOICE HISTORY ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Invoice History</h2>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-right text-muted-foreground">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id} className="border-white/5">
                <TableCell className="text-sm">{inv.date}</TableCell>
                <TableCell className="text-sm font-medium">{inv.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.status === 'Paid'
                        ? 'secondary'
                        : inv.status === 'Upcoming'
                          ? 'outline'
                          : 'default'
                    }
                    className={`text-[10px] font-medium ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : inv.status === 'Upcoming'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : ''
                    }`}
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={inv.status === 'Upcoming'}
                    className="gap-1 text-xs text-muted-foreground hover:text-foreground h-auto py-1"
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  )
}
