import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-session'
import { ensureLocalUser } from '@/lib/ensure-local-user'

// GET /api/collections - List collections for the authenticated user
export async function GET() {
  try {
    const user = await getSessionUser()
    const activeUserId = user ? user.id : 'local-user'

    const collections = await db.collection.findMany({
      where: { userId: activeUserId },
      orderBy: { updatedAt: 'desc' },
      include: {
        items: {
          select: { id: true },
        },
      },
    })

    const result = collections.map((c) => ({
      ...c,
      itemCount: c.items.length,
      items: undefined,
    }))

    return NextResponse.json({ collections: result })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('List collections error:', msg)
    return NextResponse.json(
      { error: 'Failed to list collections' },
      { status: 500 }
    )
  }
}

// POST /api/collections - Create a new collection
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser()
    const activeUserId = user ? user.id : 'local-user'
    const { name, description, color } = await req.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 }
      )
    }

    if (activeUserId === 'local-user') {
      await ensureLocalUser()
    }

    const collection = await db.collection.create({
      data: {
        name: name.trim(),
        description: (description as string) || '',
        color: (color as string) || '#06b6d4',
        userId: activeUserId,
      },
    })

    return NextResponse.json({ collection })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Create collection error:', msg)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}
