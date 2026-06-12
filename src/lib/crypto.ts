import crypto from 'crypto'

/* ------------------------------------------------------------------ */
/*  Secret key — REQUIRED in production, warning in development        */
/* ------------------------------------------------------------------ */

let cachedSecret: string | null = null

function getSecret(): string {
  if (cachedSecret) return cachedSecret
  const key = process.env.JWT_SECRET
  if (key && key.length >= 32) {
    cachedSecret = key
    return key
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is required in production (min 32 chars).'
    )
  }
  // Development-only fallback — logged once
  console.warn(
    '⚠️  JWT_SECRET is not set. Using insecure dev-only fallback. Set JWT_SECRET in .env before deploying.'
  )
  cachedSecret = 'nexus-dev-only-insecure-fallback-key-do-not-deploy'
  return cachedSecret
}

/* ------------------------------------------------------------------ */
/*  PBKDF2 password hashing                                            */
/* ------------------------------------------------------------------ */

const CURRENT_ITERATIONS = 100_000
const KEY_LENGTH = 64
const DIGEST = 'sha512'

/**
 * Hash a password using PBKDF2.
 * Returns `iterations:salt:hash` so the iteration count is self-describing.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, CURRENT_ITERATIONS, KEY_LENGTH, DIGEST)
    .toString('hex')
  return `${CURRENT_ITERATIONS}:${salt}:${hash}`
}

/**
 * Verify a password against a stored hash.
 * Supports both legacy format (salt:hash @ 1000 iter) and current (iterations:salt:hash).
 * Returns { valid, needsRehash }.
 */
export function verifyPassword(
  password: string,
  stored: string
): { valid: boolean; needsRehash: boolean } {
  const parts = stored.split(':')

  let iterations: number
  let salt: string
  let originalHash: string

  if (parts.length === 3) {
    // Current format: iterations:salt:hash
    iterations = parseInt(parts[0], 10)
    salt = parts[1]
    originalHash = parts[2]
  } else if (parts.length === 2) {
    // Legacy format: salt:hash (1000 iterations)
    iterations = 1000
    salt = parts[0]
    originalHash = parts[1]
  } else {
    return { valid: false, needsRehash: false }
  }

  if (!salt || !originalHash || isNaN(iterations)) {
    return { valid: false, needsRehash: false }
  }

  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST)
    .toString('hex')

  // Constant-time comparison to prevent timing attacks
  const valid =
    hash.length === originalHash.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash))

  return { valid, needsRehash: valid && iterations < CURRENT_ITERATIONS }
}

/* ------------------------------------------------------------------ */
/*  Signed session tokens (HMAC-SHA256)                                */
/* ------------------------------------------------------------------ */

/**
 * Sign a user session.
 * Returns `userId.signature`.
 */
export function signSession(userId: string): string {
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(userId)
    .digest('hex')
  return `${userId}.${signature}`
}

/**
 * Verify a signed session token.
 * Returns the userId if the signature is valid, otherwise null.
 */
export function verifySession(token: string): string | null {
  const dotIndex = token.indexOf('.')
  if (dotIndex < 1) return null

  const userId = token.slice(0, dotIndex)
  const signature = token.slice(dotIndex + 1)
  if (!userId || !signature) return null

  const expected = crypto
    .createHmac('sha256', getSecret())
    .update(userId)
    .digest('hex')

  // Constant-time comparison
  if (
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return userId
  }
  return null
}
