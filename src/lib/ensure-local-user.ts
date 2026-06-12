import { db } from './db'

/**
 * Module-level singleton promise to ensure the 'local-user' guest account
 * is created exactly once, even under concurrent requests.
 * Fixes B5: race condition on upsert with unique email constraint.
 */
let localUserPromise: Promise<void> | null = null

export function ensureLocalUser(): Promise<void> {
  if (!localUserPromise) {
    localUserPromise = db.user
      .upsert({
        where: { id: 'local-user' },
        update: {},
        create: {
          id: 'local-user',
          email: 'local@nexus.ai',
          name: 'Guest',
        },
      })
      .then(() => {})
      .catch((err) => {
        // If another process already created it, that's fine
        const message = err instanceof Error ? err.message : String(err)
        if (!message.includes('Unique constraint')) {
          console.error('ensureLocalUser failed:', message)
        }
        // Reset so next attempt retries
        localUserPromise = null
      })
  }
  return localUserPromise
}
