'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  FolderOpen,
  Plus,
  X,
  Sparkles,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Collection {
  id: string
  name: string
  description: string
  color: string
  itemCount: number
  updatedAt: string
}

/* ------------------------------------------------------------------ */
/*  Preset colors                                                      */
/* ------------------------------------------------------------------ */

const PRESET_COLORS = [
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Slate', value: '#64748b' },
]

/* ------------------------------------------------------------------ */
/*  Default collections (MVP)                                          */
/* ------------------------------------------------------------------ */

const defaultCollections: Collection[] = [
  {
    id: 'default-1',
    name: 'AI Research',
    description: 'Latest papers and breakthroughs in artificial intelligence',
    color: '#06b6d4',
    itemCount: 12,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'default-2',
    name: 'Startup Ideas',
    description: 'Validated business concepts and market opportunities',
    color: '#a855f7',
    itemCount: 7,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'default-3',
    name: 'Technical Docs',
    description: 'API references, architecture guides, and best practices',
    color: '#10b981',
    itemCount: 23,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
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
/*  CollectionsPage component                                          */
/* ------------------------------------------------------------------ */

export default function CollectionsPage() {
  const { navigate } = useAppStore()

  const [collections, setCollections] = useState<Collection[]>(defaultCollections)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0].value)

  // Create collection
  const handleCreate = useCallback(async () => {
    if (!newName.trim()) return

    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      name: newName.trim(),
      description: newDescription.trim(),
      color: newColor,
      itemCount: 0,
      updatedAt: new Date().toISOString(),
    }

    // Try API first, fall back to local state
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim(),
          color: newColor,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.collection) {
          newCollection.id = data.collection.id
        }
      }
    } catch {
      // Use local state for MVP
    }

    setCollections((prev) => [newCollection, ...prev])
    setNewName('')
    setNewDescription('')
    setNewColor(PRESET_COLORS[0].value)
    setShowCreateForm(false)
  }, [newName, newDescription, newColor])

  const handleCancel = useCallback(() => {
    setNewName('')
    setNewDescription('')
    setNewColor(PRESET_COLORS[0].value)
    setShowCreateForm(false)
  }, [])

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl glass flex items-center justify-center">
            <FolderOpen className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-sm text-muted-foreground">Organize your research</p>
          </div>
        </div>

        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </motion.div>

      {/* ======== CREATE FORM ======== */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Create Collection</h3>
                <button
                  onClick={handleCancel}
                  className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-accent/80 transition-colors"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Collection name"
                  className="bg-white/[0.03] border-white/[0.06] focus:border-cyan-500/30 focus:ring-cyan-500/10 h-10 rounded-xl"
                  autoFocus
                />
                <Input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="bg-white/[0.03] border-white/[0.06] focus:border-cyan-500/30 focus:ring-cyan-500/10 h-10 rounded-xl"
                />

                {/* Color picker */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewColor(color.value)}
                        className={`h-8 w-8 rounded-lg transition-all duration-200 flex items-center justify-center ${
                          newColor === color.value
                            ? 'ring-2 ring-offset-2 ring-offset-background scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: hexToRgba(color.value, 0.2),
                          borderColor:
                            newColor === color.value ? color.value : 'transparent',
                          ...(newColor === color.value
                            ? { ringColor: color.value }
                            : {}),
                        }}
                        aria-label={color.name}
                      >
                        {newColor === color.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: color.value }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="rounded-xl text-muted-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl disabled:opacity-40"
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======== COLLECTIONS GRID ======== */}
      {collections.length === 0 ? (
        /* ======== EMPTY STATE ======== */
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-2xl glass-strong flex items-center justify-center mx-auto">
              <FolderOpen className="h-9 w-9 text-muted-foreground/50" />
            </div>
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
              <Plus className="h-3 w-3 text-cyan-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Create your first collection to organize research
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {collections.map((collection, i) => (
              <motion.div
                key={collection.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: i * 0.05 }}
                layout
              >
                <button
                  onClick={() => navigate('library')}
                  className="w-full glass rounded-2xl overflow-hidden text-left hover:bg-accent/40 transition-all group feature-card"
                >
                  {/* Color accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${collection.color}, ${hexToRgba(collection.color, 0.3)})`,
                    }}
                  />

                  <div className="p-5">
                    {/* Icon + name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: hexToRgba(collection.color, 0.12),
                          boxShadow: `0 0 20px -5px ${hexToRgba(collection.color, 0.15)}`,
                        }}
                      >
                        <FolderOpen
                          className="h-5 w-5"
                          style={{ color: collection.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-cyan-400 transition-colors">
                          {collection.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    {collection.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {collection.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-3 w-3" />
                        {collection.itemCount} items
                      </span>
                      <span>{getRelativeDate(collection.updatedAt)}</span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
