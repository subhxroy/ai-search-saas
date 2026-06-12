import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-session'

// GET /api/conversations/[id] - Get a specific conversation with messages (filtered by user session)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSessionUser()
    const activeUserId = user ? user.id : 'local-user'

    const conversation = await db.conversation.findFirst({
      where: { id, userId: activeUserId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sources: { orderBy: { rank: 'asc' } } },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Get conversation error:', msg)
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    )
  }
}

// DELETE /api/conversations/[id] - Delete a conversation (filtered by user session)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSessionUser()
    const activeUserId = user ? user.id : 'local-user'

    // Verify ownership first
    const conversation = await db.conversation.findFirst({
      where: { id, userId: activeUserId },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or unauthorized' },
        { status: 404 }
      )
    }

    await db.conversation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Delete conversation error:', msg)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
}
