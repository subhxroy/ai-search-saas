import { cookies } from 'next/headers'
import { verifySession } from './crypto'
import { db } from './db'

/**
 * Resolves the currently authenticated user from the session cookie.
 * Works inside Next.js API route handlers.
 */
export async function getSessionUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('nexus_session')?.value
    if (!token) return null

    const userId = verifySession(token)
    if (!userId) return null

    const user = await db.user.findUnique({
      where: { id: userId },
    })

    return user
  } catch (err) {
    // Sanitized log — never dump the full error which may contain token/cookie data
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('getSessionUser failed:', message)
    return null
  }
}
