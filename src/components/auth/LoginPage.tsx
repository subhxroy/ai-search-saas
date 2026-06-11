'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, EyeOff, Github } from 'lucide-react'
import { useAppStore, loginAsDefault } from '@/store/app-store'

/* ------------------------------------------------------------------ */
/*  Google icon (inline SVG)                                           */
/* ------------------------------------------------------------------ */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared auth card styles                                            */
/* ------------------------------------------------------------------ */
const cardStyle: React.CSSProperties = {
  background: '#0a0a0c',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '12px',
  padding: '32px',
}

/* ------------------------------------------------------------------ */
/*  LoginPage — Resend editorial style                                 */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    loginAsDefault()
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#000000' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[400px]"
      >
        <div style={cardStyle}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search style={{ width: 16, height: 16, color: '#fcfdff' }} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 500,
                color: '#fcfdff',
              }}
            >
              Nexus AI
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h1
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: '28px',
                fontWeight: 400,
                lineHeight: 1.1,
                color: '#fcfdff',
                marginBottom: 8,
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ash)', lineHeight: 1.43 }}>
              Sign in to continue your research
            </p>
          </div>

          {/* Social login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => loginAsDefault()}
              className="btn-ghost w-full"
              style={{ height: 44, gap: 10, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
            >
              <GoogleIcon style={{ width: 20, height: 20 }} />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => loginAsDefault()}
              className="btn-ghost w-full"
              style={{ height: 44, gap: 10, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
            >
              <Github style={{ width: 20, height: 20 }} />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <div style={{ height: 1, background: 'var(--hairline)' }} />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#0a0a0c',
                padding: '0 12px',
                fontSize: 12,
                color: 'var(--stone)',
              }}
            >
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, color: 'var(--charcoal)' }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-input w-full"
                autoComplete="email"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 14, color: 'var(--charcoal)' }}>Password</label>
                <button
                  type="button"
                  onClick={() => navigate('forgot-password')}
                  style={{
                    fontSize: 12,
                    color: 'var(--accent-blue)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-input w-full"
                  style={{ paddingRight: 40 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--stone)',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
              style={{ height: 44, marginTop: 4 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--ash)', marginTop: 24 }}>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('signup')}
              style={{
                color: 'var(--accent-blue)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              Sign up
            </button>
          </p>

          {/* Demo login */}
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--hairline)' }}>
            <button
              type="button"
              onClick={loginAsDefault}
              style={{
                width: '100%',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--stone)',
                background: 'var(--surface-card)',
                border: '1px solid var(--hairline)',
                borderRadius: '8px',
                cursor: 'pointer',
                padding: '10px 0',
                transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-elevated)'
                e.currentTarget.style.borderColor = 'var(--hairline-strong)'
                e.currentTarget.style.color = 'var(--charcoal)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-card)'
                e.currentTarget.style.borderColor = 'var(--hairline)'
                e.currentTarget.style.color = 'var(--stone)'
              }}
            >
              Demo Login — Skip to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
