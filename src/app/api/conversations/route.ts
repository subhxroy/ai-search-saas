import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/conversations - List all conversations
export async function GET() {
  try {
    const conversations = await db.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('List conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to list conversations' },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json()

    const conversation = await db.conversation.create({
      data: {
        title: title || 'New Conversation',
      },
    })

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}

// DELETE /api/conversations - Delete all conversations
export async function DELETE() {
  try {
    await db.message.deleteMany()
    await db.source.deleteMany()
    await db.conversation.deleteMany()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete all conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversations' },
      { status: 500 }
    )
  }
}
