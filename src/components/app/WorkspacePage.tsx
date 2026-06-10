'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Users,
  Plus,
  X,
  Mail,
  Shield,
  ChevronDown,
  Trash2,
  Globe,
  Sparkles,
  Telescope,
  FolderOpen,
  Settings,
  Crown,
  Eye,
  ArrowRight,
  Save,
  MessageSquare,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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

type MemberRole = 'owner' | 'admin' | 'member'

interface Member {
  id: string
  name: string
  email: string
  role: MemberRole
  joinedAt: string
  avatar?: string
}

interface SharedResearch {
  id: string
  title: string
  sharedBy: string
  date: string
  memberCount: number
}

interface SharedCollection {
  id: string
  name: string
  itemCount: number
  color: string
  updatedAt: string
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockMembers: Member[] = [
  {
    id: 'm1',
    name: 'Alex Chen',
    email: 'alex@nexus.ai',
    role: 'owner',
    joinedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: 'm2',
    name: 'Sarah Kim',
    email: 'sarah@nexus.ai',
    role: 'admin',
    joinedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'm3',
    name: 'James Liu',
    email: 'james@nexus.ai',
    role: 'admin',
    joinedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'm4',
    name: 'Emily Ross',
    email: 'emily@nexus.ai',
    role: 'member',
    joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'm5',
    name: 'David Park',
    email: 'david@nexus.ai',
    role: 'member',
    joinedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
]

const mockSharedResearch: SharedResearch[] = [
  {
    id: 'sr1',
    title: 'AI Market Landscape 2025',
    sharedBy: 'Alex Chen',
    date: new Date(Date.now() - 3600000).toISOString(),
    memberCount: 4,
  },
  {
    id: 'sr2',
    title: 'Quantum Computing Use Cases',
    sharedBy: 'Sarah Kim',
    date: new Date(Date.now() - 86400000).toISOString(),
    memberCount: 3,
  },
  {
    id: 'sr3',
    title: 'SaaS Pricing Model Analysis',
    sharedBy: 'James Liu',
    date: new Date(Date.now() - 172800000).toISOString(),
    memberCount: 5,
  },
  {
    id: 'sr4',
    title: 'Climate Tech Funding Report',
    sharedBy: 'Emily Ross',
    date: new Date(Date.now() - 259200000).toISOString(),
    memberCount: 2,
  },
]

const mockSharedCollections: SharedCollection[] = [
  {
    id: 'sc1',
    name: 'AI Research',
    itemCount: 12,
    color: '#06b6d4',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'sc2',
    name: 'Market Analysis',
    itemCount: 8,
    color: '#a855f7',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'sc3',
    name: 'Technical Docs',
    itemCount: 23,
    color: '#10b981',
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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function getJoinedDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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

function getRoleBadgeClasses(role: MemberRole): string {
  switch (role) {
    case 'owner':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'admin':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    case 'member':
      return 'bg-white/[0.06] text-muted-foreground border-white/[0.08]'
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function getAvatarColor(name: string): string {
  const colors = ['#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#f43f5e']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
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
/*  Non-team empty state                                               */
/* ------------------------------------------------------------------ */

function EmptyWorkspaceState() {
  const { navigate, currentUser } = useAppStore()

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <motion.div variants={itemVariants}>
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-2xl glass-strong flex items-center justify-center mx-auto">
            <Users className="h-11 w-11 text-muted-foreground/50" />
          </div>
          <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
            <Plus className="h-4 w-4 text-cyan-400" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-2xl font-bold mb-3">Create a Workspace</h3>
        <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
          Collaborate on research with your team. Share conversations, build
          collections together, and stay aligned with shared AI-powered
          insights.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 max-w-sm w-full">
        <div className="glass-strong rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/20 flex items-center justify-center">
              <Globe className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-sm font-medium">Shared Research</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Share AI-powered research sessions with your team in real-time
          </p>
        </div>

        <div className="glass-strong rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20 flex items-center justify-center">
              <FolderOpen className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-sm font-medium">Team Collections</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Build and organize shared collections of sources and insights
          </p>
        </div>

        <div className="glass-strong rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium">Role-based Access</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Control who can view, edit, and manage team resources
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-8">
        <Button
          onClick={() => navigate('billing')}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl px-8 h-11"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Create Workspace
        </Button>
        {currentUser?.plan === 'free' && (
          <p className="text-xs text-muted-foreground mt-3">
            Requires Pro plan or above
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  WorkspacePage component                                            */
/* ------------------------------------------------------------------ */

export default function WorkspacePage() {
  const { navigate, currentUser } = useAppStore()

  // If the user doesn't have a workspace, show empty state
  const hasWorkspace = currentUser?.plan === 'pro' || currentUser?.plan === 'enterprise'

  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<MemberRole>('member')
  const [sendingInvite, setSendingInvite] = useState(false)

  // Workspace settings
  const [workspaceName, setWorkspaceName] = useState('Nexus Research Team')
  const [defaultModel, setDefaultModel] = useState('gpt-4o')
  const [autoShare, setAutoShare] = useState(true)
  const [saving, setSaving] = useState(false)

  // Send invite
  const handleSendInvite = useCallback(async () => {
    if (!inviteEmail.trim()) return
    setSendingInvite(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      joinedAt: new Date().toISOString(),
    }
    setMembers((prev) => [...prev, newMember])
    setInviteEmail('')
    setInviteRole('member')
    setSendingInvite(false)
    setShowInvite(false)
  }, [inviteEmail, inviteRole])

  // Change role
  const handleChangeRole = useCallback((memberId: string, newRole: MemberRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    )
  }, [])

  // Remove member
  const handleRemoveMember = useCallback((memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }, [])

  // Save settings
  const handleSaveSettings = useCallback(async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
  }, [])

  if (!hasWorkspace) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">
        <EmptyWorkspaceState />
      </div>
    )
  }

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
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workspace</h1>
            <p className="text-sm text-muted-foreground">
              Collaborate on research with your team
            </p>
          </div>
        </div>
      </motion.div>

      {/* ======== WORKSPACE INFO CARD ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="glass-strong rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {workspaceName}
                </h2>
                <Badge
                  variant="secondary"
                  className="shrink-0 text-[10px] px-2 py-0 h-5 font-semibold bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 border-cyan-500/20"
                >
                  Pro
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {members.length} members
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Active workspace
                </span>
              </div>
            </div>
            <Button
              onClick={() => setShowInvite(!showInvite)}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl shrink-0"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Members
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ======== INVITE FORM ======== */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  Invite a Team Member
                </h3>
                <button
                  onClick={() => setShowInvite(false)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-accent/80 transition-colors"
                  aria-label="Close invite form"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@email.com"
                  type="email"
                  className="flex-1 bg-white/[0.03] border-white/[0.06] focus:border-cyan-500/30 focus:ring-cyan-500/10 h-10 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendInvite()
                  }}
                />
                <Select
                  value={inviteRole}
                  onValueChange={(v) => setInviteRole(v as MemberRole)}
                >
                  <SelectTrigger className="w-full sm:w-[140px] bg-white/[0.03] border-white/[0.06] h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSendInvite}
                  disabled={!inviteEmail.trim() || sendingInvite}
                  className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl disabled:opacity-40 shrink-0"
                >
                  {sendingInvite ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invite
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======== MEMBERS LIST ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Members
          </h3>
          <Badge variant="secondary" className="text-xs font-medium">
            {members.length}
          </Badge>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin pr-1">
          <AnimatePresence mode="popLayout">
            {members.map((member, i) => {
              const avatarColor = getAvatarColor(member.name)
              return (
                <motion.div
                  key={member.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ delay: i * 0.03 }}
                  layout
                >
                  <div className="glass rounded-xl p-3 sm:p-4 hover:bg-accent/30 transition-all group">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold ring-1 ring-white/10"
                        style={{
                          backgroundColor: hexToRgba(avatarColor, 0.15),
                          color: avatarColor,
                        }}
                      >
                        {getInitials(member.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-foreground truncate">
                            {member.name}
                          </span>
                          {member.role === 'owner' && (
                            <Crown className="h-3 w-3 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate block">
                          {member.email}
                        </span>
                      </div>

                      {/* Role badge + actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-2 py-0 h-5 font-medium capitalize hidden sm:inline-flex ${getRoleBadgeClasses(member.role)}`}
                        >
                          {member.role}
                        </Badge>

                        {/* Role change dropdown */}
                        {member.role !== 'owner' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-accent/80 transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Change role"
                              >
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem
                                onClick={() => handleChangeRole(member.id, 'admin')}
                              >
                                <Shield className="h-3.5 w-3.5 mr-2 text-cyan-400" />
                                Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleChangeRole(member.id, 'member')}
                              >
                                <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}

                        {/* Remove button */}
                        {member.role !== 'owner' && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Remove member"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                          </button>
                        )}

                        {/* Joined date - desktop only */}
                        <span className="text-xs text-muted-foreground hidden lg:block min-w-[80px] text-right">
                          {getJoinedDate(member.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ======== SHARED RESEARCH ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Shared Research
          </h3>
          <Badge variant="secondary" className="text-xs font-medium">
            {mockSharedResearch.length}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mockSharedResearch.map((research, i) => (
            <motion.div
              key={research.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => navigate('chat', { id: research.id })}
                className="w-full glass rounded-xl p-4 text-left hover:bg-accent/40 transition-all group feature-card"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-purple-500/10 ring-1 ring-purple-500/20 flex items-center justify-center">
                    <Telescope className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate group-hover:text-cyan-400 transition-colors mb-1">
                      {research.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>by {research.sharedBy}</span>
                      <span>{getRelativeDate(research.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {research.memberCount} members
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ======== SHARED COLLECTIONS ======== */}
      <motion.div variants={itemVariants} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Shared Collections
          </h3>
          <Badge variant="secondary" className="text-xs font-medium">
            {mockSharedCollections.length}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mockSharedCollections.map((collection, i) => (
            <motion.div
              key={collection.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => navigate('collections')}
                className="w-full glass rounded-xl overflow-hidden text-left hover:bg-accent/40 transition-all group feature-card"
              >
                {/* Color accent bar */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${collection.color}, ${hexToRgba(collection.color, 0.3)})`,
                  }}
                />
                <div className="p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: hexToRgba(collection.color, 0.12),
                        boxShadow: `0 0 16px -4px ${hexToRgba(collection.color, 0.15)}`,
                      }}
                    >
                      <FolderOpen
                        className="h-4 w-4"
                        style={{ color: collection.color }}
                      />
                    </div>
                    <h4 className="text-sm font-medium text-foreground truncate group-hover:text-cyan-400 transition-colors">
                      {collection.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {collection.itemCount} items
                    </span>
                    <span>{getRelativeDate(collection.updatedAt)}</span>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ======== WORKSPACE SETTINGS ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace Settings
          </h3>
        </div>

        <div className="glass-strong rounded-2xl p-5 sm:p-6 space-y-6">
          {/* Workspace name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Workspace Name
            </label>
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="max-w-md bg-white/[0.03] border-white/[0.06] focus:border-cyan-500/30 focus:ring-cyan-500/10 h-10 rounded-xl"
            />
          </div>

          {/* Default AI model */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Default AI Model for Team
            </label>
            <Select value={defaultModel} onValueChange={setDefaultModel}>
              <SelectTrigger className="w-full sm:w-[240px] bg-white/[0.03] border-white/[0.06] h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5">
              This model will be used as default for all team research
            </p>
          </div>

          {/* Auto-share research toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-foreground block">
                Auto-share Research
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically share deep research results with the team
              </p>
            </div>
            <Switch
              checked={autoShare}
              onCheckedChange={setAutoShare}
            />
          </div>

          {/* Save button */}
          <div className="flex items-center justify-end pt-2">
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 rounded-xl disabled:opacity-60"
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
