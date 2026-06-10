import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/collections - List all collections
export async function GET() {
  try {
    const collections = await db.collection.findMany({
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
    console.error('List collections error:', error)
    return NextResponse.json(
      { error: 'Failed to list collections' },
      { status: 500 }
    )
  }
}

// POST /api/collections - Create a new collection
export async function POST(req: NextRequest) {
  try {
    const { name, description, color } = await req.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 }
      )
    }

    // For MVP, use a default userId since we have simplified local auth
    let userId = 'local-user'
    try {
      const user = await db.user.findFirst()
      if (user) userId = user.id
    } catch {
      // Use default
    }

    const collection = await db.collection.create({
      data: {
        name: name.trim(),
        description: (description as string) || '',
        color: (color as string) || '#06b6d4',
        userId,
      },
    })

    return NextResponse.json({ collection })
  } catch (error) {
    console.error('Create collection error:', error)
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}
