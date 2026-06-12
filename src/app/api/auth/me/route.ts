import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-session'

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized, session expired or invalid' },
        { status: 401 }
      )
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Session verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error during session verification' },
      { status: 500 }
    )
  }
}
