'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, Mail } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

export default function ForgotPasswordPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsLoading(true)
    // Simulate sending reset email
    await new Promise((r) => setTimeout(r, 800))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#000000' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <div
          style={{
            background: '#0a0a0c',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: '12px',
            padding: '32px',
          }}
        >
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

          {!isSubmitted ? (
            <>
              {/* Header */}
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
                  Reset Password
                </h1>
                <p style={{ fontSize: 14, color: '#a1a4a5', lineHeight: 1.43 }}>
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 14, color: '#a1a4a5' }}>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-input w-full"
                    autoComplete="email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="btn-primary w-full"
                  style={{ height: 44, opacity: email.trim() ? 1 : 0.5 }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'rgba(17,255,153,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Mail style={{ width: 24, height: 24, color: 'var(--accent-green)' }} />
                </div>
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
                  Check your email
                </h1>
                <p style={{ fontSize: 14, color: '#a1a4a5', lineHeight: 1.43, marginBottom: 24 }}>
                  We&apos;ve sent a password reset link to <span style={{ color: 'var(--ink)' }}>{email}</span>
                </p>
                <button
                  onClick={() => navigate('login')}
                  className="btn-primary w-full"
                  style={{ height: 44 }}
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}

          {/* Back link (when not submitted) */}
          {!isSubmitted && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => navigate('login')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ash)',
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  margin: '0 auto',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ink)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ash)' }}
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
