import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { verifyPassword, hashPassword, signSession } from '@/lib/crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const trimmedEmail = email.trim().toLowerCase()

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: trimmedEmail },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password hash (supports legacy + current formats)
    const { valid, needsRehash } = verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Transparent rehash: upgrade legacy 1000-iteration hashes to 100k
    if (needsRehash) {
      const newHash = hashPassword(password)
      await db.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      })
    }

    // Sign session and set cookie
    const token = signSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set('nexus_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Login error:', msg)
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    )
  }
}
