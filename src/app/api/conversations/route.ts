import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-session'

// GET /api/conversations - List conversations for the logged-in user (or guest)
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req)
    const activeUserId = user ? user.id : 'local-user'

    const conversations = await db.conversation.findMany({
      where: { userId: activeUserId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    })

    // Format conversations with messageCount and preview
    const formattedConversations = conversations.map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      pinned: c.pinned,
      isDeepResearch: c.isDeepResearch,
      researchStatus: c.researchStatus,
      messageCount: c._count.messages,
      preview: c.messages[0]?.content || '',
    }))

    return NextResponse.json({ conversations: formattedConversations })
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
    const user = await getSessionUser(req)
    const activeUserId = user ? user.id : 'local-user'
    const { title } = await req.json()

    if (activeUserId === 'local-user') {
      await db.user.upsert({
        where: { id: 'local-user' },
        update: {},
        create: {
          id: 'local-user',
          email: 'local@nexus.ai',
          name: 'Local User',
        }
      })
    }

    const conversation = await db.conversation.create({
      data: {
        title: title || 'New Conversation',
        userId: activeUserId,
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

// DELETE /api/conversations - Delete all conversations for the active user
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser(req)
    const activeUserId = user ? user.id : 'local-user'

    // Delete messages and sources associated with user's conversations
    const userConvs = await db.conversation.findMany({
      where: { userId: activeUserId },
      select: { id: true },
    })
    const convIds = userConvs.map((c) => c.id)

    if (convIds.length > 0) {
      await db.source.deleteMany({
        where: { message: { conversationId: { in: convIds } } },
      })
      await db.message.deleteMany({
        where: { conversationId: { in: convIds } },
      })
      await db.conversation.deleteMany({
        where: { id: { in: convIds } },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete all conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversations' },
      { status: 500 }
    )
  }
}
