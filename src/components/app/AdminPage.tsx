'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Shield,
  Users,
  FileText,
  CreditCard,
  Settings2,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Ban,
  Plus,
  Edit3,
  Megaphone,
  Save,
  Trash,
  AlertTriangle,
  Activity,
  Database,
  Globe,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
/*  Tab definition                                                     */
/* ------------------------------------------------------------------ */

type AdminTab = 'users' | 'content' | 'pricing' | 'system'

interface TabDef {
  id: AdminTab
  label: string
  icon: React.ElementType
}

const TABS: TabDef[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'system', label: 'System', icon: Settings2 },
]

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

function formatJoinedDate(dateStr: string): string {
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

interface FAQItem {
  id: string
  question: string
  answer: string
}

const MOCK_FAQS: FAQItem[] = [
  { id: '1', question: 'What is Nexus AI?', answer: 'Nexus AI is a premium AI-powered search and research platform.' },
  { id: '2', question: 'How does deep research work?', answer: 'Deep research uses multiple AI models to synthesize comprehensive reports.' },
  { id: '3', question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time.' },
  { id: '4', question: 'What AI models are available?', answer: 'We support GPT-4, Claude, Gemini, and custom fine-tuned models.' },
  { id: '5', question: 'Is my data secure?', answer: 'All data is encrypted at rest and in transit with SOC 2 compliance.' },
]

interface BlogPost {
  id: string
  title: string
  status: 'Published' | 'Draft'
  date: string
}

const MOCK_BLOGS: BlogPost[] = [
  { id: '1', title: 'Introducing Nexus AI 2.0', status: 'Published', date: 'Jun 1, 2026' },
  { id: '2', title: 'Deep Research: A Technical Deep Dive', status: 'Published', date: 'May 20, 2026' },
  { id: '3', title: 'Best Practices for AI-Powered Research', status: 'Draft', date: 'Jun 5, 2026' },
]

interface Announcement {
  id: string
  message: string
  date: string
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', message: 'Nexus AI 2.0 is here! Explore the new deep research features.', date: 'Jun 1, 2026' },
  { id: '2', message: 'Scheduled maintenance: June 15th, 2-4 AM UTC', date: 'Jun 3, 2026' },
]

interface PlanFeature {
  name: string
  free: boolean
  pro: boolean
  enterprise: boolean
}

const PLAN_FEATURES: PlanFeature[] = [
  { name: 'Web Search', free: true, pro: true, enterprise: true },
  { name: 'AI Citations', free: true, pro: true, enterprise: true },
  { name: 'Deep Research', free: false, pro: true, enterprise: true },
  { name: 'Memory', free: false, pro: true, enterprise: true },
  { name: 'File Uploads', free: false, pro: true, enterprise: true },
  { name: 'API Access', free: false, pro: false, enterprise: true },
  { name: 'Team Workspace', free: false, pro: false, enterprise: true },
  { name: 'SSO', free: false, pro: false, enterprise: true },
  { name: 'Priority Support', free: false, pro: false, enterprise: true },
  { name: 'Custom Models', free: false, pro: false, enterprise: true },
]

interface ErrorLog {
  id: string
  message: string
  timestamp: string
  severity: 'error' | 'warning'
}

const MOCK_ERRORS: ErrorLog[] = [
  { id: '1', message: 'Rate limit exceeded for search provider', timestamp: '5 min ago', severity: 'warning' },
  { id: '2', message: 'Database connection timeout (resolved)', timestamp: '1h ago', severity: 'error' },
  { id: '3', message: 'Webhook delivery failed to api.nexus.ai', timestamp: '3h ago', severity: 'warning' },
]

/* ------------------------------------------------------------------ */
/*  AdminPage component                                                */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const { currentUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [userSearch, setUserSearch] = useState('')
  const [planPrices, setPlanPrices] = useState({ free: '0', pro: '20', enterprise: '99' })
  const [features, setFeatures] = useState(PLAN_FEATURES)
  const [cacheCleared, setCacheCleared] = useState(false)

  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSearches: 0,
    totalConversations: 0,
    activeToday: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  // Fetch users list
  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Fetch system stats
  const fetchStats = async () => {
    setLoadingStats(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingStats(false)
    }
  }

  // Fetch data depending on active tab
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      if (activeTab === 'users') {
        fetchUsers()
      } else if (activeTab === 'system') {
        fetchStats()
      }
    }
  }, [activeTab, currentUser])

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        fetchUsers()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update role')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      })
      if (res.ok) {
        fetchUsers()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update plan')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchUsers()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete user')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Admin guard
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-16 w-16 rounded-2xl glass-strong mx-auto flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            You don&apos;t have permission to access this page.
          </p>
        </motion.div>
      </div>
    )
  }

  const filteredUsers = users.filter(
    (u) =>
      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  )

  const toggleFeature = (featureName: string, plan: 'free' | 'pro' | 'enterprise') => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.name === featureName ? { ...f, [plan]: !f[plan] } : f
      )
    )
  }

  const handleClearCache = () => {
    setCacheCleared(true)
    setTimeout(() => setCacheCleared(false), 3000)
  }

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
          <Shield className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage users, content, and system settings</p>
        </div>
      </motion.div>

      {/* ======== TAB NAVIGATION ======== */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex gap-1 p-1 glass rounded-xl">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <tab.icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ======== TAB CONTENT ======== */}
      <AnimatePresence mode="wait">
        {/* ---- USERS TAB ---- */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* User count stat */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium">{users.length} Users</span>
                </div>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-9 h-9 bg-white/3 border-white/6 text-sm"
                />
              </div>
            </div>

            {/* Users table */}
            <div className="glass-strong rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Plan</TableHead>
                      <TableHead className="text-muted-foreground">Role</TableHead>
                      <TableHead className="text-muted-foreground">Joined</TableHead>
                      <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/5">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10 text-xs font-medium">
                              {user.name ? user.name.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                            </div>
                            <span className="text-sm font-medium">{user.name || 'Unnamed User'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-semibold uppercase ${
                              user.plan === 'enterprise'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : user.plan === 'pro'
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  : 'bg-white/5 text-muted-foreground border-white/10'
                            }`}
                          >
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-semibold uppercase ${
                              user.role === 'admin'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-white/5 text-muted-foreground border-white/10'
                            }`}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatJoinedDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => handleUpdateRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => handleUpdatePlan(user.id, user.plan === 'free' ? 'pro' : user.plan === 'pro' ? 'enterprise' : 'free')}
                              >
                                <CreditCard className="h-3.5 w-3.5" />
                                Cycle Plan ({user.plan})
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                className="gap-2"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- CONTENT TAB ---- */}
        {activeTab === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* FAQ Section */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  FAQ Items
                </h2>
                <Button
                  size="sm"
                  className="gap-1.5 text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 hover:opacity-90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add FAQ
                </Button>
              </div>
              <div className="space-y-2">
                {MOCK_FAQS.map((faq) => (
                  <div
                    key={faq.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl glass hover:bg-accent/30 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{faq.question}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Posts Section */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-purple-400" />
                  Blog Posts
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs border-white/10 hover:bg-accent"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Post
                </Button>
              </div>
              <div className="space-y-2">
                {MOCK_BLOGS.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl glass hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold shrink-0 ${
                          post.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements Section */}
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-amber-400" />
                  Announcements
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs border-white/10 hover:bg-accent"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Post Announcement
                </Button>
              </div>
              <div className="space-y-2">
                {MOCK_ANNOUNCEMENTS.map((ann) => (
                  <div
                    key={ann.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl glass hover:bg-accent/30 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{ann.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ann.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- PRICING TAB ---- */}
        {activeTab === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Edit Prices */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cyan-400" />
                Plan Prices
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Free Plan ($/mo)</label>
                  <Input
                    type="number"
                    value={planPrices.free}
                    onChange={(e) => setPlanPrices((p) => ({ ...p, free: e.target.value }))}
                    className="bg-white/3 border-white/6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Pro Plan ($/mo)</label>
                  <Input
                    type="number"
                    value={planPrices.pro}
                    onChange={(e) => setPlanPrices((p) => ({ ...p, pro: e.target.value }))}
                    className="bg-white/3 border-white/6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Enterprise Plan ($/mo)</label>
                  <Input
                    type="number"
                    value={planPrices.enterprise}
                    onChange={(e) => setPlanPrices((p) => ({ ...p, enterprise: e.target.value }))}
                    className="bg-white/3 border-white/6"
                  />
                </div>
              </div>
            </div>

            {/* Toggle Features */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Feature Toggles</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Feature</TableHead>
                      <TableHead className="text-center text-muted-foreground">Free</TableHead>
                      <TableHead className="text-center text-muted-foreground">Pro</TableHead>
                      <TableHead className="text-center text-muted-foreground">Enterprise</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features.map((feature) => (
                      <TableRow key={feature.name} className="border-white/5">
                        <TableCell className="text-sm font-medium">{feature.name}</TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={feature.free}
                            onCheckedChange={() => toggleFeature(feature.name, 'free')}
                            className="data-[state=checked]:bg-cyan-600 mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={feature.pro}
                            onCheckedChange={() => toggleFeature(feature.name, 'pro')}
                            className="data-[state=checked]:bg-cyan-600 mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={feature.enterprise}
                            onCheckedChange={() => toggleFeature(feature.name, 'enterprise')}
                            className="data-[state=checked]:bg-cyan-600 mx-auto"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0 hover:opacity-90">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- SYSTEM TAB ---- */}
        {activeTab === 'system' && (
          <motion.div
            key="system"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* System Health */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                System Health
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'API Status', icon: Globe, status: 'Operational', color: 'emerald' },
                  { label: 'Database', icon: Database, status: 'Operational', color: 'emerald' },
                  { label: 'Search Provider', icon: Search, status: 'Operational', color: 'emerald' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl p-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium">{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'from-cyan-500/15 to-cyan-500/5' },
                  { label: 'Total Searches', value: stats.totalSearches.toLocaleString(), color: 'from-purple-500/15 to-purple-500/5' },
                  { label: 'Total Conversations', value: stats.totalConversations.toLocaleString(), color: 'from-emerald-500/15 to-emerald-500/5' },
                  { label: 'Active Today', value: stats.activeToday.toLocaleString(), color: 'from-amber-500/15 to-amber-500/5' },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-xl p-4 bg-gradient-to-br ${stat.color} border border-white/5`}>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Errors */}
            <div className="glass-strong rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Recent Errors
              </h2>
              <div className="space-y-2">
                {MOCK_ERRORS.map((err) => (
                  <div
                    key={err.id}
                    className="flex items-start gap-3 p-3 rounded-xl glass"
                  >
                    {err.severity === 'error' ? (
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{err.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{err.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Cache */}
            <div className="glass-strong rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Clear Application Cache</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Purge all cached responses and render data</p>
              </div>
              <Button
                onClick={handleClearCache}
                variant="outline"
                className="gap-2 border-white/10 hover:bg-accent text-sm"
              >
                {cacheCleared ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Cache Cleared
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Clear Cache
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
