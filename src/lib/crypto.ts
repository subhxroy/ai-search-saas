import crypto from 'crypto'

const SECRET = process.env.JWT_SECRET || 'nexus-default-secret-key-1234567890'

/**
 * Hash a password using Node.js native pbkdf2Sync.
 * Returns salt:hash format.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify a password against a stored hash string (salt:hash).
 */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':')
  const salt = parts[0]
  const originalHash = parts[1]
  if (!salt || !originalHash) return false
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === originalHash
}

/**
 * Sign a user session.
 * Returns userId.signature
 */
export function signSession(userId: string): string {
  const signature = crypto.createHmac('sha256', SECRET).update(userId).digest('hex')
  return `${userId}.${signature}`
}

/**
 * Verify a signed user session.
 * Returns userId if signature is valid, or null.
 */
export function verifySession(token: string): string | null {
  const parts = token.split('.')
  const userId = parts[0]
  const signature = parts[1]
  if (!userId || !signature) return null
  const expectedSignature = crypto.createHmac('sha256', SECRET).update(userId).digest('hex')
  if (signature === expectedSignature) {
    return userId
  }
  return null
}
