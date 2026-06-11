'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Bookmark,
  Search,
  MessageSquare,
  Globe,
  Telescope,
  ChevronDown,
  Trash2,
  FolderOpen,
  CheckSquare,
  Square,
  ArrowRight,
  Sparkles,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ItemType = 'chat' | 'source' | 'research'
type FilterTab = 'all' | 'chats' | 'sources' | 'research'
type SortOption = 'recent' | 'oldest' | 'az'

interface SavedItem {
  id: string
  type: ItemType
  title: string
  date: string
  // Chat-specific
  messageCount?: number
  // Source-specific
  domain?: string
  snippet?: string
  url?: string
  // Research-specific
  sourceCount?: number
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockItems: SavedItem[] = [
  {
    id: 'lib-1',
    type: 'chat',
    title: 'AI Market Analysis 2025',
    date: new Date(Date.now() - 1800000).toISOString(),
    messageCount: 8,
  },
  {
    id: 'lib-2',
    type: 'chat',
    title: 'SaaS Pricing Strategy Deep Dive',
    date: new Date(Date.now() - 86400000).toISOString(),
    messageCount: 12,
  },
  {
    id: 'lib-3',
    type: 'source',
    title: 'The State of AI Report 2025',
    domain: 'stanford.edu',
    snippet:
      'Comprehensive analysis of AI trends, funding, and technical progress across the industry.',
    url: 'https://stanford.edu/ai-report-2025',
    date: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'lib-4',
    type: 'source',
    title: 'Transformer Architecture Explained',
    domain: 'arxiv.org',
    snippet:
      'Attention is all you need: a detailed breakdown of the transformer model architecture.',
    url: 'https://arxiv.org/abs/1706.03762',
    date: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'lib-5',
    type: 'research',
    title: 'Quantum Computing Applications',
    date: new Date(Date.now() - 7200000).toISOString(),
    sourceCount: 15,
  },
  {
    id: 'lib-6',
    type: 'research',
    title: 'Climate Tech Investment Trends',
    date: new Date(Date.now() - 259200000).toISOString(),
    sourceCount: 22,
  },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRelativeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function getTypeIcon(type: ItemType) {
  switch (type) {
    case 'chat':
      return MessageSquare
    case 'source':
      return Globe
    case 'research':
      return Telescope
  }
}

function getTypeBadgeClasses(type: ItemType): string {
  switch (type) {
    case 'chat':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    case 'source':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'research':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
}

function getTypeIconBg(type: ItemType): string {
  switch (type) {
    case 'chat':
      return 'bg-cyan-500/10 ring-1 ring-cyan-500/20'
    case 'source':
      return 'bg-emerald-500/10 ring-1 ring-emerald-500/20'
    case 'research':
      return 'bg-purple-500/10 ring-1 ring-purple-500/20'
  }
}

function getTypeIconColor(type: ItemType): string {
  switch (type) {
    case 'chat':
      return 'text-cyan-400'
    case 'source':
      return 'text-emerald-400'
    case 'research':
      return 'text-purple-400'
  }
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyLibraryState() {
  const { navigate } = useAppStore()

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl glass-strong flex items-center justify-center mx-auto">
          <Bookmark className="h-9 w-9 text-muted-foreground/50" />
        </div>
        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
          <Sparkles className="h-3 w-3 text-cyan-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
        Save chats and sources to build your research library
      </p>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate('chat')}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl px-5"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Start Searching
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('history')}
          className="rounded-xl border-white/[0.08] hover:bg-accent/50"
        >
          <Clock className="h-4 w-4 mr-2" />
          Browse History
        </Button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  LibraryPage component                                              */
/* ------------------------------------------------------------------ */

export default function LibraryPage() {
  const { navigate } = useAppStore()

  const [items, setItems] = useState<SavedItem[]>(mockItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Toggle item selection
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Select all / deselect all
  const toggleSelectAll = useCallback(
    (filteredIds: string[]) => {
      if (selectedIds.size === filteredIds.length) {
        setSelectedIds(new Set())
      } else {
        setSelectedIds(new Set(filteredIds))
      }
    },
    [selectedIds.size]
  )

  // Delete selected items
  const deleteSelected = useCallback(() => {
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)))
    setSelectedIds(new Set())
  }, [selectedIds])

  // Move selected to collection (MVP: just clear selection)
  const moveToCollection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // Delete single item
  const deleteItem = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = items

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.snippet && item.snippet.toLowerCase().includes(q)) ||
          (item.domain && item.domain.toLowerCase().includes(q))
      )
    }

    // Tab filter
    switch (activeTab) {
      case 'chats':
        result = result.filter((item) => item.type === 'chat')
        break
      case 'sources':
        result = result.filter((item) => item.type === 'source')
        break
      case 'research':
        result = result.filter((item) => item.type === 'research')
        break
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        result = [...result].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        break
      case 'oldest':
        result = [...result].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        break
      case 'az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [items, searchQuery, activeTab, sortBy])

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'chats', label: 'Chats' },
    { key: 'sources', label: 'Sources' },
    { key: 'research', label: 'Research' },
  ]

  const hasSelection = selectedIds.size > 0

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl glass flex items-center justify-center">
            <Bookmark className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Library</h1>
            <p className="text-sm text-muted-foreground">
              Your saved research and sources
            </p>
          </div>
        </div>
      </motion.div>

      {/* ======== SEARCH BAR ======== */}
      <motion.div variants={itemVariants} className="mb-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your library..."
            className="pl-10 bg-white/[0.03] border-white/[0.06] focus:border-cyan-500/30 focus:ring-cyan-500/10 h-10 rounded-xl"
          />
        </div>
      </motion.div>

      {/* ======== FILTER TABS + SORT ======== */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key)
                setSelectedIds(new Set())
              }}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-accent text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? 'item' : 'items'}
            </Badge>

            {/* Sort dropdown */}
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger
                size="sm"
                className="w-[120px] bg-white/[0.03] border-white/[0.06] rounded-lg text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Select all toggle */}
            {filteredItems.length > 0 && (
              <button
                onClick={() => toggleSelectAll(filteredItems.map((i) => i.id))}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors"
                aria-label={
                  selectedIds.size === filteredItems.length
                    ? 'Deselect all'
                    : 'Select all'
                }
              >
                {selectedIds.size === filteredItems.length &&
                filteredItems.length > 0 ? (
                  <CheckSquare className="h-4 w-4 text-cyan-400" />
                ) : (
                  <Square className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ======== BATCH ACTIONS ======== */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="glass-strong rounded-xl p-3 flex items-center gap-3">
              <Badge variant="secondary" className="text-xs font-medium shrink-0">
                {selectedIds.size} selected
              </Badge>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={moveToCollection}
                className="rounded-lg text-muted-foreground hover:text-foreground gap-1.5 h-8"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span className="text-xs">Move to Collection</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteSelected}
                className="rounded-lg text-muted-foreground hover:text-destructive gap-1.5 h-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="text-xs">Delete</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======== SAVED ITEMS GRID ======== */}
      {filteredItems.length === 0 && items.length === 0 ? (
        <EmptyLibraryState />
      ) : filteredItems.length === 0 ? (
        /* No results for current filter */
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="h-16 w-16 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4">
            <Search className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('')
              setActiveTab('all')
            }}
            className="rounded-xl text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => {
              const Icon = getTypeIcon(item.type)
              const isSelected = selectedIds.has(item.id)

              return (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ delay: i * 0.04 }}
                  layout
                >
                  <div
                    className={`glass rounded-2xl overflow-hidden hover:bg-accent/30 transition-all group feature-card relative ${
                      isSelected ? 'ring-1 ring-cyan-500/40 bg-cyan-500/[0.03]' : ''
                    }`}
                  >
                    {/* Selection checkbox overlay */}
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className="absolute top-3 left-3 z-10 h-6 w-6 rounded-md flex items-center justify-center bg-background/60 backdrop-blur-sm hover:bg-accent/80 transition-colors"
                      aria-label={isSelected ? 'Deselect' : 'Select'}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>

                    <div className="p-5 pt-4">
                      {/* Icon + Type badge */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ${getTypeIconBg(item.type)}`}
                        >
                          <Icon
                            className={`h-4 w-4 ${getTypeIconColor(item.type)}`}
                          />
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 h-4 font-medium capitalize ${getTypeBadgeClasses(item.type)}`}
                        >
                          {item.type}
                        </Badge>
                        <div className="flex-1" />

                        {/* Item actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-accent/80 transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Item actions"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                moveToCollection()
                              }}
                            >
                              <FolderOpen className="h-3.5 w-3.5 mr-2" />
                              Save to Collection
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => deleteItem(item.id, e as unknown as React.MouseEvent)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h4>

                      {/* Type-specific content */}
                      {item.type === 'chat' && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {item.messageCount} messages
                          </span>
                          <span>{getRelativeDate(item.date)}</span>
                        </div>
                      )}

                      {item.type === 'source' && (
                        <>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">
                              {item.domain}
                            </span>
                          </div>
                          {item.snippet && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                              {item.snippet}
                            </p>
                          )}
                        </>
                      )}

                      {item.type === 'research' && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {item.sourceCount} sources
                          </span>
                          <span>{getRelativeDate(item.date)}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {item.type === 'chat' || item.type === 'research' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate('chat', { id: item.id })
                            }
                            className="h-7 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate('chat', { id: item.id })
                              }
                              className="h-7 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveToCollection()}
                              className="h-7 rounded-lg text-xs text-muted-foreground hover:text-foreground gap-1 px-2.5"
                            >
                              <FolderOpen className="h-3 w-3" />
                              Save to Collection
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
