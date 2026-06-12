import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-session'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const allUsers = await db.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Return users without password hash
    const sanitizedUsers = allUsers.map(({ passwordHash: _, ...u }) => u)

    return NextResponse.json({ users: sanitizedUsers })
  } catch (error) {
    console.error('Admin GET users error:', (error as Error).message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const activeUser = await getSessionUser()
    if (!activeUser || activeUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, role, plan } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (userId === activeUser.id && role && role !== 'admin') {
      return NextResponse.json(
        { error: 'You cannot demote yourself from admin role' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (plan !== undefined) updateData.plan = plan

    const updated = await db.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    console.error('Admin PUT user error:', (error as Error).message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const activeUser = await getSessionUser()
    if (!activeUser || activeUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (userId === activeUser.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own admin account' },
        { status: 400 }
      )
    }

    await db.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin DELETE user error:', (error as Error).message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
