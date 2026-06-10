'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Search,
  AlertTriangle,
  Clock,
  CreditCard,
  Lock,
  Wifi,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const iconVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
}

const floatVariants = {
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

/* ------------------------------------------------------------------ */
/*  Error type config                                                  */
/* ------------------------------------------------------------------ */

type ErrorType =
  | 'no-results'
  | 'failed-search'
  | 'rate-limit'
  | 'payment-required'
  | 'unauthorized'
  | 'offline'
  | 'generic'

interface ErrorConfig {
  icon: React.ElementType
  title: string
  description: string
  gradient: string
  showUpgrade?: boolean
  upgradeText?: string
}

const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
  'no-results': {
    icon: Search,
    title: 'No results found',
    description: 'Try different keywords or check your spelling',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
  },
  'failed-search': {
    icon: AlertTriangle,
    title: 'Search failed',
    description: "We couldn't complete your search. Please try again.",
    gradient: 'from-amber-500/20 to-amber-600/5',
  },
  'rate-limit': {
    icon: Clock,
    title: 'Rate limit reached',
    description: "You've exceeded the free tier limit. Upgrade to Pro for unlimited searches.",
    gradient: 'from-purple-500/20 to-purple-600/5',
    showUpgrade: true,
    upgradeText: 'Upgrade to Pro',
  },
  'payment-required': {
    icon: CreditCard,
    title: 'Payment required',
    description: 'This feature requires a Pro plan.',
    gradient: 'from-purple-500/20 to-purple-600/5',
    showUpgrade: true,
    upgradeText: 'Upgrade Now',
  },
  unauthorized: {
    icon: Lock,
    title: 'Access denied',
    description: "You don't have permission to view this page.",
    gradient: 'from-red-500/20 to-red-600/5',
  },
  offline: {
    icon: Wifi,
    title: "You're offline",
    description: 'Check your internet connection and try again.',
    gradient: 'from-orange-500/20 to-orange-600/5',
  },
  generic: {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'An unexpected error occurred.',
    gradient: 'from-gray-500/20 to-gray-600/5',
  },
}

/* ------------------------------------------------------------------ */
/*  ErrorPage component                                                */
/* ------------------------------------------------------------------ */

export default function ErrorPage() {
  const { navigate, pageParams } = useAppStore()
  const errorType = (pageParams?.type || 'generic') as ErrorType
  const config = ERROR_CONFIGS[errorType] || ERROR_CONFIGS.generic
  const IconComponent = config.icon

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 relative overflow-hidden">
      {/* Floating orbs background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-cyan-500/[0.04] blur-[80px] animate-float-1" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/[0.04] blur-[80px] animate-float-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-cyan-500/[0.02] blur-[60px] animate-float-3" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="glass-strong rounded-2xl p-8 text-center">
          {/* Icon with animation */}
          <motion.div variants={iconVariants} className="flex justify-center mb-6">
            <motion.div
              variants={floatVariants}
              animate="animate"
              className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center ring-1 ring-white/10`}
            >
              <IconComponent className="h-9 w-9 text-foreground/70" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-xl font-bold tracking-tight mb-2"
          >
            {config.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm text-muted-foreground leading-relaxed mb-8"
          >
            {config.description}
          </motion.p>

          {/* Action buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {errorType === 'offline' || errorType === 'failed-search' ? (
              <Button
                onClick={() => window.location.reload()}
                className="gap-2 rounded-xl font-semibold text-sm text-white px-6 h-10"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
              >
                <ArrowLeft className="h-4 w-4" />
                Try Again
              </Button>
            ) : (
              <Button
                onClick={() => navigate('dashboard')}
                className="gap-2 rounded-xl font-semibold text-sm text-white px-6 h-10"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Home
              </Button>
            )}

            {/* Upgrade CTA */}
            {config.showUpgrade && (
              <Button
                onClick={() => navigate('billing')}
                variant="outline"
                className="gap-2 rounded-xl font-semibold text-sm border-white/10 hover:bg-accent px-6 h-10"
              >
                <Zap className="h-4 w-4 text-cyan-400" />
                {config.upgradeText}
              </Button>
            )}

            {/* Secondary action for non-upgrade states */}
            {!config.showUpgrade && errorType !== 'offline' && errorType !== 'failed-search' && (
              <Button
                onClick={() => navigate('support')}
                variant="outline"
                className="gap-2 rounded-xl font-semibold text-sm border-white/10 hover:bg-accent px-6 h-10"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Get Help
              </Button>
            )}
          </motion.div>

          {/* Additional context for specific error types */}
          {errorType === 'rate-limit' && (
            <motion.div variants={itemVariants} className="mt-6 pt-4 border-t border-white/[0.04]">
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Search className="h-3 w-3" />
                  <span>10 searches/day</span>
                </div>
                <div className="h-3 w-px bg-white/[0.06]" />
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-cyan-400" />
                  <span>Unlimited on Pro</span>
                </div>
              </div>
            </motion.div>
          )}

          {errorType === 'unauthorized' && (
            <motion.div variants={itemVariants} className="mt-6 pt-4 border-t border-white/[0.04]">
              <p className="text-xs text-muted-foreground">
                If you believe this is an error, please{' '}
                <button
                  onClick={() => navigate('support')}
                  className="text-cyan-400 hover:underline"
                >
                  contact support
                </button>
                .
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
