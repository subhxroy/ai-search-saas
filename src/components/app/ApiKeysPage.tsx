'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Key,
  Plus,
  Copy,
  Ban,
  Trash2,
  FileText,
  Check,
  Search,
  MessageSquare,
  Telescope,
  Eye,
  Shield,
  Zap,
  Clock,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'

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

/* ------------------------------------------------------------------ */
/*  Types & Mock data                                                  */
/* ------------------------------------------------------------------ */

type Permission = 'search' | 'chat' | 'research' | 'read-only'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: Permission[]
  created: string
  lastUsed: string
  status: 'active' | 'revoked'
}

const MOCK_KEYS: ApiKey[] = [
  {
    id: '1',
    name: 'Production Key',
    key: 'nx_****************************a3f2',
    permissions: ['search', 'chat', 'research'],
    created: 'Mar 15, 2026',
    lastUsed: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'Dev Testing',
    key: 'nx_****************************b7e1',
    permissions: ['search', 'read-only'],
    created: 'May 2, 2026',
    lastUsed: '3 days ago',
    status: 'revoked',
  },
]

const PERMISSION_OPTIONS: { id: Permission; label: string; icon: React.ElementType }[] = [
  { id: 'search', label: 'Search', icon: Search },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'research', label: 'Research', icon: Telescope },
  { id: 'read-only', label: 'Read-only', icon: Eye },
]

const PERMISSION_COLORS: Record<Permission, string> = {
  search: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  chat: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  research: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'read-only': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

/* ------------------------------------------------------------------ */
/*  ApiKeysPage component                                              */
/* ------------------------------------------------------------------ */

export default function ApiKeysPage() {
  const { navigate } = useAppStore()
  const [keyName, setKeyName] = useState('')
  const [permissions, setPermissions] = useState<Permission[]>(['search'])
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const togglePermission = (perm: Permission) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  const handleGenerateKey = () => {
    if (!keyName.trim()) return
    const randomSuffix = Math.random().toString(36).substring(2, 6)
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: keyName.trim(),
      key: `nx_****************************${randomSuffix}`,
      permissions: [...permissions],
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never',
      status: 'active',
    }
    setKeys((prev) => [newKey, ...prev])
    setKeyName('')
    setPermissions(['search'])
    setShowCreate(false)
  }

  const handleCopyKey = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRevoke = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k))
    )
  }

  const handleDelete = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id))
  }

  const requestsUsed = 1247
  const requestsLimit = 10000
  const usagePercent = (requestsUsed / requestsLimit) * 100

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
          <Key className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground">Manage your developer access</p>
        </div>
      </motion.div>

      {/* ======== CREATE KEY SECTION ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4 text-cyan-400" />
            Create New Key
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreate(!showCreate)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showCreate ? 'Cancel' : 'New Key'}
          </Button>
        </div>

        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                {/* Key name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Key Name</label>
                  <Input
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="bg-white/3 border-white/6"
                  />
                </div>

                {/* Permissions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Permissions</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PERMISSION_OPTIONS.map((perm) => (
                      <label
                        key={perm.id}
                        className={`flex items-center gap-2.5 p-3 rounded-xl cursor-pointer transition-all ${
                          permissions.includes(perm.id)
                            ? 'glass-strong border-cyan-500/20'
                            : 'glass hover:bg-accent/30'
                        }`}
                        style={
                          permissions.includes(perm.id)
                            ? { border: '1px solid rgba(103,232,249,0.2)' }
                            : undefined
                        }
                      >
                        <Checkbox
                          checked={permissions.includes(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
                          className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        />
                        <div className="flex items-center gap-1.5">
                          <perm.icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium">{perm.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Generate button */}
                <Button
                  onClick={handleGenerateKey}
                  disabled={!keyName.trim() || permissions.length === 0}
                  className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 hover:opacity-90 disabled:opacity-40"
                >
                  <Key className="h-4 w-4" />
                  Generate Key
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ======== KEY LIST ======== */}
      <motion.div variants={itemVariants} className="space-y-4 mb-6">
        {keys.length === 0 ? (
          /* Empty state */
          <div className="glass-strong rounded-2xl p-12 text-center">
            <div className="h-14 w-14 rounded-2xl glass mx-auto flex items-center justify-center mb-4">
              <Key className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No API Keys</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
              Create your first API key to get started
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create API Key
            </Button>
          </div>
        ) : (
          keys.map((apiKey) => (
            <div
              key={apiKey.id}
              className={`glass-strong rounded-2xl p-5 transition-all ${
                apiKey.status === 'revoked' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/15 to-purple-500/15 flex items-center justify-center ring-1 ring-white/5">
                    <Key className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{apiKey.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            apiKey.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span
                          className={`text-[10px] font-semibold ${
                            apiKey.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {apiKey.status === 'active' ? 'Active' : 'Revoked'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{apiKey.key}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyKey(apiKey.id)}
                    className="gap-1.5 text-xs h-8 border border-white/5 hover:bg-accent"
                  >
                    {copiedId === apiKey.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                  {apiKey.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevoke(apiKey.id)}
                      className="gap-1.5 text-xs h-8 text-amber-400 hover:text-amber-300 border border-white/5 hover:bg-accent"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      Revoke
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(apiKey.id)}
                    className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive border border-white/5 hover:bg-accent"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Permission badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {apiKey.permissions.map((perm) => (
                  <Badge
                    key={perm}
                    variant="secondary"
                    className={`text-[10px] font-semibold ${PERMISSION_COLORS[perm]}`}
                  >
                    {perm}
                  </Badge>
                ))}
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created {apiKey.created}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Last used {apiKey.lastUsed}
                </span>
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* ======== USAGE STATS ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          Usage This Month
        </h2>
        <div className="space-y-4">
          {/* Requests */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Requests</span>
              <span className="text-xs text-muted-foreground">
                {requestsUsed.toLocaleString()} / {requestsLimit.toLocaleString()}
              </span>
            </div>
            <Progress value={usagePercent} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-purple-500" />
          </div>

          {/* Rate limit & Latency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Rate Limit</p>
              <p className="text-sm font-bold flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-purple-400" />
                100 req/min
              </p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Avg Latency</p>
              <p className="text-sm font-bold flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                245ms
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ======== DOCUMENTATION LINK ======== */}
      <motion.div variants={itemVariants}>
        <Button
          onClick={() => navigate('docs')}
          variant="outline"
          className="gap-2 border-white/10 hover:bg-accent w-full sm:w-auto"
        >
          <FileText className="h-4 w-4" />
          View API Docs
        </Button>
      </motion.div>
    </motion.div>
  )
}
