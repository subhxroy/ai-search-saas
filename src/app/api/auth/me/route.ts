import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-session'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/crypto'

async function getSearchesCount(userId: string): Promise<number> {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  try {
    return await db.usageLog.count({
      where: {
        userId,
        type: 'search',
        createdAt: {
          gte: startOfToday,
        },
      },
    })
  } catch (err) {
    console.error('Failed to get searches count:', err)
    return 0
  }
}

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
    let prefs: any = {}
    try {
      prefs = JSON.parse(user.preferences || '{}')
    } catch (e) {
      prefs = {}
    }

    const searchesCount = await getSearchesCount(user.id)

    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        ...prefs,
        bio: prefs.bio || '',
      },
      searchesUsed: searchesCount,
    })
  } catch (error) {
    console.error('Session verify error:', (error as Error).message)
    return NextResponse.json(
      { error: 'Internal server error during session verification' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser(req)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.company !== undefined) updateData.company = body.company
    if (body.jobTitle !== undefined) updateData.jobTitle = body.jobTitle
    if (body.onboarded !== undefined) updateData.onboarded = body.onboarded

    if (body.onboardingData !== undefined) {
      updateData.onboardingData = typeof body.onboardingData === 'string'
        ? body.onboardingData
        : JSON.stringify(body.onboardingData)
    }

    // Process preferences updates
    let existingPrefs: any = {}
    try {
      existingPrefs = JSON.parse(user.preferences || '{}')
    } catch (e) {}

    const incomingPrefs: any = {}
    const prefKeys = [
      'theme', 'fontSize', 'compactMode', 'emailNotifs', 'researchNotifs',
      'weeklyDigest', 'productUpdates', 'profilePublic', 'saveHistory',
      'dataRetention', 'defaultModel', 'responseStyle', 'citeSources',
      'autoFollowUps', 'deepResearchDefault', 'bio'
    ]
    
    // Check both inside a 'preferences' object or directly in body
    for (const key of prefKeys) {
      if (body[key] !== undefined) {
        incomingPrefs[key] = body[key]
      } else if (body.preferences && body.preferences[key] !== undefined) {
        incomingPrefs[key] = body.preferences[key]
      }
    }

    if (Object.keys(incomingPrefs).length > 0) {
      updateData.preferences = JSON.stringify({
        ...existingPrefs,
        ...incomingPrefs,
      })
    }

    if (body.password) {
      updateData.passwordHash = hashPassword(body.password)
    }

    if (body.email && body.email !== user.email) {
      // Check if email already in use
      const existing = await db.user.findUnique({
        where: { email: body.email }
      })
      if (existing) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }
      updateData.email = body.email
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
    })

    const { passwordHash: _, ...userWithoutPassword } = updatedUser
    let finalPrefs: any = {}
    try {
      finalPrefs = JSON.parse(updatedUser.preferences || '{}')
    } catch (e) {}

    const searchesCount = await getSearchesCount(user.id)

    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        ...finalPrefs,
        bio: finalPrefs.bio || '',
      },
      searchesUsed: searchesCount,
    })
  } catch (error) {
    console.error('Update profile error:', (error as Error).message)
    return NextResponse.json(
      { error: 'Internal server error during profile update' },
      { status: 500 }
    )
  }
}
