'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Eye, EyeOff, Mail, Lock, User, Github } from 'lucide-react'
import { useAppStore, loginAsDefault } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

/* ------------------------------------------------------------------ */
/*  Floating gradient orbs                                             */
/* ------------------------------------------------------------------ */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-40 -right-32 w-96 h-96 rounded-full animate-float-2"
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full animate-float-1"
        style={{
          background:
            'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full animate-float-3"
        style={{
          background:
            'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)',
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Google icon                                                        */
/* ------------------------------------------------------------------ */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Password strength calculator                                       */
/* ------------------------------------------------------------------ */
function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' }
  if (score === 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' }
  if (score === 3) return { label: 'Good', color: 'bg-yellow-500', width: '60%' }
  if (score === 4) return { label: 'Strong', color: 'bg-emerald-400', width: '80%' }
  return { label: 'Excellent', color: 'bg-cyan-400', width: '100%' }
}

/* ------------------------------------------------------------------ */
/*  SignupPage component                                               */
/* ------------------------------------------------------------------ */
export default function SignupPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    loginAsDefault()
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <FloatingOrbs />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 shadow-2xl shadow-black/30">
          {/* ---- Logo ---- */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">
              Nexus AI
            </span>
          </div>

          {/* ---- Headline ---- */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1.5">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start searching smarter today
            </p>
          </div>

          {/* ---- Social signup ---- */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 glass rounded-xl border-white/[0.08] hover:bg-white/[0.06] text-foreground font-medium transition-all duration-200"
              onClick={() => loginAsDefault()}
            >
              <GoogleIcon className="h-5 w-5 mr-2.5" />
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 glass rounded-xl border-white/[0.08] hover:bg-white/[0.06] text-foreground font-medium transition-all duration-200"
              onClick={() => loginAsDefault()}
            >
              <Github className="h-5 w-5 mr-2.5" />
              Continue with GitHub
            </Button>
          </div>

          {/* ---- Divider ---- */}
          <div className="relative mb-6">
            <Separator className="bg-white/[0.06]" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111113] px-3 text-xs text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* ---- Form ---- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm text-muted-foreground">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 pl-10 bg-white/[0.03] border-white/[0.08] rounded-xl focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/40 transition-all"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 bg-white/[0.03] border-white/[0.08] rounded-xl focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/40 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 pr-10 bg-white/[0.03] border-white/[0.08] rounded-xl focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/40 transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className={`h-full rounded-full ${strength.color}`}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Password strength:{' '}
                    <span className="text-foreground font-medium">
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm text-muted-foreground"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`h-11 pl-10 pr-10 bg-white/[0.03] border-white/[0.08] rounded-xl focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/40 transition-all ${
                    confirmPassword.length > 0 && !passwordsMatch
                      ? 'border-red-500/50 focus-visible:border-red-500/50 focus-visible:ring-red-500/30'
                      : ''
                  } ${passwordsMatch ? 'border-emerald-500/40' : ''}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-[11px] text-red-400">Passwords don&apos;t match</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              style={{
                background:
                  'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(139,92,246,0.9))',
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* ---- Sign in link ---- */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('login')}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>

          {/* ---- Demo login ---- */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={loginAsDefault}
              className="w-full text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors py-2"
            >
              ✨ Demo Login — Skip to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
