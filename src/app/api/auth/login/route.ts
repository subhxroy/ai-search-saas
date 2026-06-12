import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { verifyPassword, signSession } from '@/lib/crypto'
import { insforge } from '@/lib/insforge'

// Helper function to migrate database user ID to InsForge User ID
async function migrateUserId(oldId: string, newId: string, email: string) {
  try {
    // 1. Fetch user data
    const user = await db.user.findUnique({ where: { id: oldId } })
    if (!user) return null

    // 2. Create temporary user row
    await db.user.create({
      data: {
        id: newId,
        email: email + '.temp',
        name: user.name,
        role: user.role,
        plan: user.plan,
        onboarded: user.onboarded,
        onboardingData: user.onboardingData,
        preferences: user.preferences,
      }
    })

    // 3. Update child rows
    await db.conversation.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.collection.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.savedItem.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.sharedChat.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.apiKey.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.usageLog.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.feedback.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.teamMember.updateMany({ where: { userId: oldId }, data: { userId: newId } })
    await db.subscription.updateMany({ where: { userId: oldId }, data: { userId: newId } })

    // 4. Delete old user row
    await db.user.delete({ where: { id: oldId } })

    // 5. Restore correct email
    const updated = await db.user.update({
      where: { id: newId },
      data: { email }
    })
    return updated
  } catch (err) {
    console.error('Failed to migrate user ID:', err)
    return null
  }
}

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

    // 1. Try to authenticate using InsForge
    const { data: insforgeData, error: insforgeError } = await insforge.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    let finalUser = null

    if (!insforgeError && insforgeData && insforgeData.user) {
      const insUserId = insforgeData.user.id

      // Find user in database by ID
      let user = await db.user.findUnique({
        where: { id: insUserId },
      })

      if (!user) {
        // Check if user exists by email (legacy ID)
        const userByEmail = await db.user.findUnique({
          where: { email: trimmedEmail },
        })

        if (userByEmail) {
          // Migrate ID to match InsForge
          const migrated = await migrateUserId(userByEmail.id, insUserId, trimmedEmail)
          if (migrated) {
            user = migrated
          }
        } else {
          // Create new user row
          user = await db.user.create({
            data: {
              id: insUserId,
              email: trimmedEmail,
              name: insforgeData.user.profile?.name || trimmedEmail.split('@')[0],
              role: 'user',
              plan: 'free',
              onboarded: true,
            },
          })
        }
      }

      finalUser = user
    } else {
      // 2. If InsForge failed, fall back to checking legacy password hash in db
      const legacyUser = await db.user.findUnique({
        where: { email: trimmedEmail },
      })

      if (!legacyUser || !legacyUser.passwordHash) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      const { valid } = verifyPassword(password, legacyUser.passwordHash)
      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      // If valid, auto-migrate to InsForge Auth
      console.log(`Auto-migrating legacy user ${trimmedEmail} to InsForge Auth...`)
      const { data: insData, error: insError } = await insforge.auth.signUp({
        email: trimmedEmail,
        password,
        name: legacyUser.name || trimmedEmail.split('@')[0],
      })

      if (insError || !insData || !insData.user) {
        console.error('Failed to auto-migrate legacy user:', insError?.message)
        return NextResponse.json(
          { error: 'Authentication failed. Please verify credentials.' },
          { status: 401 }
        )
      }

      // Migrate database record ID to match new InsForge ID
      const migrated = await migrateUserId(legacyUser.id, insData.user.id, trimmedEmail)
      if (!migrated) {
        return NextResponse.json(
          { error: 'Internal server error during account sync' },
          { status: 500 }
        )
      }

      finalUser = migrated
    }

    if (!finalUser) {
      return NextResponse.json(
        { error: 'Account sync failed' },
        { status: 500 }
      )
    }

    // Sign session and set cookie
    const token = signSession(finalUser.id)
    const cookieStore = await cookies()
    cookieStore.set('nexus_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user info without password hash
    const { passwordHash: _, ...userWithoutPassword } = finalUser
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Login error:', msg)
    return NextResponse.json(
      { error: `Internal server error during login: ${msg}` },
      { status: 500 }
    )
  }
}
