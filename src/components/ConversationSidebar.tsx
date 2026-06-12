'use client'

import { useState, useEffect } from 'react'
import { MessageSquarePlus, Trash2, ChevronLeft, MessageSquare, Clock } from 'lucide-react'
import { useAppStore } from '@/store/app-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ConversationItem {
  id: string
  title: string
  updatedAt: string
  createdAt: string
}

export default function ConversationSidebar() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen)
  const conversationId = useAppStore((s) => s.conversationId)
  const setConversationId = useAppStore((s) => s.setConversationId)
  const setMessages = useAppStore((s) => s.setMessages)
  const navigate = useAppStore((s) => s.navigate)
  const setCurrentSources = useAppStore((s) => s.setCurrentSources)
  const setCurrentFollowUps = useAppStore((s) => s.setCurrentFollowUps)

  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sidebarOpen) {
      fetchConversations()
    }
  }, [sidebarOpen])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`)
      if (res.ok) {
        const data = await res.json()
        const conv = data.conversation
        setConversationId(conv.id)
        navigate('chat')
        setCurrentSources([])
        setCurrentFollowUps([])
        setMessages(
          conv.messages.map((m: { role: string; content: string; sources: { title: string; url: string; snippet: string; favicon: string; rank: number }[]; followUps: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            sources: m.sources || [],
            followUps: m.followUps ? JSON.parse(m.followUps) : [],
            isStreaming: false,
          }))
        )
        setSidebarOpen(false)
      }
    } catch {
      // ignore
    }
  }

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id))
        if (conversationId === id) {
          useAppStore.getState().reset()
        }
      }
    } catch {
      // ignore
    }
  }

  const startNewChat = () => {
    useAppStore.getState().reset()
    setSidebarOpen(false)
  }

  // Group conversations by time
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)

  const groups = {
    today: [] as ConversationItem[],
    yesterday: [] as ConversationItem[],
    older: [] as ConversationItem[],
  }

  conversations.forEach((c) => {
    const date = new Date(c.updatedAt)
    if (date >= today) {
      groups.today.push(c)
    } else if (date >= yesterday) {
      groups.yesterday.push(c)
    } else {
      groups.older.push(c)
    }
  })

  if (!sidebarOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">History</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={startNewChat}
              title="New chat"
              className="h-8 w-8"
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                Loading...
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                <span className="text-sm">No conversations yet</span>
              </div>
            ) : (
              <>
                {groups.today.length > 0 && (
                  <SidebarGroup
                    label="Today"
                    items={groups.today}
                    activeId={conversationId}
                    onSelect={loadConversation}
                    onDelete={deleteConversation}
                  />
                )}
                {groups.yesterday.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <SidebarGroup
                      label="Yesterday"
                      items={groups.yesterday}
                      activeId={conversationId}
                      onSelect={loadConversation}
                      onDelete={deleteConversation}
                    />
                  </>
                )}
                {groups.older.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <SidebarGroup
                      label="Older"
                      items={groups.older}
                      activeId={conversationId}
                      onSelect={loadConversation}
                      onDelete={deleteConversation}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

function SidebarGroup({
  label,
  items,
  activeId,
  onSelect,
  onDelete,
}: {
  label: string
  items: ConversationItem[]
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string, e: React.MouseEvent) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="space-y-0.5">
        {items.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              activeId === conv.id
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="text-sm truncate flex-1">{conv.title}</span>
            <button
              onClick={(e) => onDelete(conv.id, e)}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 rounded hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
