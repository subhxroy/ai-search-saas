import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { hashPassword, signSession } from '@/lib/crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const trimmedEmail = email.trim().toLowerCase()

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: trimmedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const passwordHash = hashPassword(password)
    const user = await db.user.create({
      data: {
        email: trimmedEmail,
        name: name.trim(),
        passwordHash,
        role: 'user',
        plan: 'free',
        onboarded: true,
      },
    })

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
    console.error('Signup error:', msg)
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    )
  }
}
