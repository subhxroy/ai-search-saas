'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, EyeOff, Github, Check } from 'lucide-react'
import { useAppStore } from '@/store/app-store'

/* ------------------------------------------------------------------ */
/*  Google icon                                                        */
/* ------------------------------------------------------------------ */
function GoogleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

  if (score <= 1) return { label: 'Weak', color: 'var(--accent-red)', width: '20%' }
  if (score === 2) return { label: 'Fair', color: 'var(--accent-orange)', width: '40%' }
  if (score === 3) return { label: 'Good', color: 'var(--accent-yellow)', width: '60%' }
  if (score === 4) return { label: 'Strong', color: 'var(--accent-green)', width: '80%' }
  return { label: 'Excellent', color: 'var(--accent-blue)', width: '100%' }
}

/* ------------------------------------------------------------------ */
/*  Password requirement checker                                       */
/* ------------------------------------------------------------------ */
function getPasswordRequirements(password: string) {
  return [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase & lowercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special character', met: /[^a-zA-Z0-9]/.test(password) },
  ]
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
/*  SignupPage — Resend editorial style                                */
/* ------------------------------------------------------------------ */
export default function SignupPage() {
  const navigate = useAppStore((s) => s.navigate)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const requirements = useMemo(() => getPasswordRequirements(password), [password])
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: fullName }),
      })
      const data = await res.json()
      if (res.ok) {
        useAppStore.setState({
          currentUser: data.user,
          isAuthenticated: true,
        })
        navigate('dashboard')
      } else {
        setError(data.error || 'Failed to register. Please try again.')
      }
    } catch (err) {
      setError('A network error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
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
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ash)', lineHeight: 1.43 }}>
              Start searching smarter today
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(255,32,71,0.1)',
                border: '1px solid var(--accent-red)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--accent-red)',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Social signup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setError('Google sign-up is currently disabled. Please use the email form.')}
              className="btn-ghost w-full"
              style={{ height: 44, gap: 10, justifyContent: 'center', display: 'flex', alignItems: 'center' }}
            >
              <GoogleIcon style={{ width: 20, height: 20 }} />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              onClick={() => setError('GitHub sign-up is currently disabled. Please use the email form.')}
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
              <label style={{ fontSize: 14, color: 'var(--charcoal)' }}>Full name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-input w-full"
                autoComplete="name"
              />
            </div>

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
              <label style={{ fontSize: 14, color: 'var(--charcoal)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-input w-full"
                  style={{ paddingRight: 40 }}
                  autoComplete="new-password"
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
              {password.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* Strength bar */}
                  <div style={{ height: 4, width: '100%', borderRadius: 2, background: 'var(--hairline)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 2, background: strength.color }}
                    />
                  </div>
                  {/* Requirements */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {requirements.map((req) => (
                      <span
                        key={req.label}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          color: req.met ? 'var(--accent-green)' : 'var(--stone)',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {req.met && <Check style={{ width: 10, height: 10 }} />}
                        {req.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, color: 'var(--charcoal)' }}>Confirm password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-input w-full"
                style={{
                  borderColor: confirmPassword.length > 0 && !passwordsMatch
                    ? 'var(--accent-red)'
                    : passwordsMatch
                    ? 'var(--accent-green)'
                    : undefined,
                }}
                autoComplete="new-password"
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p style={{ fontSize: 11, color: 'var(--accent-red)' }}>Passwords don&apos;t match</p>
              )}
              {passwordsMatch && (
                <p style={{ fontSize: 11, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check style={{ width: 10, height: 10 }} /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
              style={{ height: 44, marginTop: 4 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--ash)', marginTop: 24 }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('login')}
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
              Sign in
            </button>
          </p>


        </div>
      </motion.div>
    </div>
  )
}
