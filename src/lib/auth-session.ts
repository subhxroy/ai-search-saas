import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession } from './crypto'
import { db } from './db'

/**
 * Resolves the currently authenticated user from the cookies.
 * Works inside Next.js API route handlers.
 */
export async function getSessionUser(req?: NextRequest) {
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
    console.error('getSessionUser error:', err)
    return null
  }
}
