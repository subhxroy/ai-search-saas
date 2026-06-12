import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-session'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const totalUsers = await db.user.count()
    const totalConversations = await db.conversation.count()
    const totalSearches = await db.usageLog.count({
      where: { type: 'search' }
    })

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    // Count users active today via conversation activity or profile updates
    const activeToday = await db.user.count({
      where: {
        OR: [
          { updatedAt: { gte: startOfToday } },
          { conversations: { some: { createdAt: { gte: startOfToday } } } }
        ]
      }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalSearches,
        totalConversations,
        activeToday,
      }
    })
  } catch (error) {
    console.error('Admin GET stats error:', (error as Error).message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
