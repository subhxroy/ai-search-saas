import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { signSession } from '@/lib/crypto'
import { insforge } from '@/lib/insforge'

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

    // Check if user already exists in db
    const existingUser = await db.user.findUnique({
      where: { email: trimmedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      )
    }

    // Sign up using InsForge Auth
    const { data: insforgeData, error: insforgeError } = await insforge.auth.signUp({
      email: trimmedEmail,
      password,
      name: name.trim(),
    })

    if (insforgeError) {
      return NextResponse.json(
        { error: insforgeError.message || 'Registration failed' },
        { status: 400 }
      )
    }

    if (!insforgeData || !insforgeData.user) {
      return NextResponse.json(
        { error: 'Registration failed to return user data' },
        { status: 500 }
      )
    }

    // Create user in database (Prisma User model)
    const user = await db.user.create({
      data: {
        id: insforgeData.user.id,
        email: trimmedEmail,
        name: name.trim(),
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
      { error: `Internal server error during registration: ${msg}` },
      { status: 500 }
    )
  }
}
