'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type AppPage } from '@/store/app-store'
import {
  Menu,
  Sparkles,
  Sun,
  Moon,
  Search,
  LayoutDashboard,
  MessageSquarePlus,
  Telescope,
  Clock,
  FolderOpen,
  Share2,
  Bookmark,
  Users,
  Shield,
  FileText,
  PenSquare,
  HelpCircle,
  LogOut,
  User,
  Settings,
  CreditCard,
  Key,
  Zap,
  ChevronRight,
  X,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DashboardPage from '@/components/app/DashboardPage'
import OnboardingPage from '@/components/app/OnboardingPage'
import ChatPage from '@/components/app/ChatPage'
import ResearchPage from '@/components/app/ResearchPage'
import HistoryPage from '@/components/app/HistoryPage'
import CollectionsPage from '@/components/app/CollectionsPage'
import SharedPage from '@/components/app/SharedPage'
import ProfilePage from '@/components/app/ProfilePage'
import SettingsPage from '@/components/app/SettingsPage'
import BillingPage from '@/components/app/BillingPage'
import AdminPage from '@/components/app/AdminPage'
import AnalyticsPage from '@/components/app/AnalyticsPage'
import ApiKeysPage from '@/components/app/ApiKeysPage'
import DocsPage from '@/components/app/DocsPage'
import BlogPage from '@/components/app/BlogPage'
import SupportPage from '@/components/app/SupportPage'
import LegalPage from '@/components/app/LegalPage'
import ErrorPage from '@/components/app/ErrorPage'
import WorkspacePage from '@/components/app/WorkspacePage'
import LibraryPage from '@/components/app/LibraryPage'

/* ------------------------------------------------------------------ */
/*  Navigation items definition                                        */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string
  page: AppPage
  icon: React.ElementType
  separatorAfter?: boolean
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
  { label: 'New Chat', page: 'chat', icon: MessageSquarePlus },
  { label: 'Deep Research', page: 'research', icon: Telescope },
  { label: 'History', page: 'history', icon: Clock },
  { label: 'Collections', page: 'collections', icon: FolderOpen },
  { label: 'Shared', page: 'shared', icon: Share2 },
  { label: 'Library', page: 'library', icon: Bookmark, separatorAfter: true },
  { label: 'Workspace', page: 'workspace', icon: Users },
  { label: 'Admin', page: 'admin', icon: Shield, adminOnly: true },
  { label: 'Analytics', page: 'analytics', icon: BarChart3, adminOnly: true, separatorAfter: true },
  { label: 'Docs', page: 'docs', icon: FileText },
  { label: 'Blog', page: 'blog', icon: PenSquare },
  { label: 'Support', page: 'support', icon: HelpCircle },
]

/* ------------------------------------------------------------------ */
/*  Mobile bottom nav items                                            */
/* ------------------------------------------------------------------ */

const mobileNavItems: { label: string; page: AppPage; icon: React.ElementType }[] = [
  { label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
  { label: 'Chat', page: 'chat', icon: MessageSquarePlus },
  { label: 'Research', page: 'research', icon: Telescope },
  { label: 'History', page: 'history', icon: Clock },
  { label: 'Profile', page: 'profile', icon: User },
]

/* ------------------------------------------------------------------ */
/*  Page renderer placeholder for pages not yet built                  */
/* ------------------------------------------------------------------ */

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="h-12 w-12 rounded-2xl glass mx-auto flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-cyan-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">Coming soon</p>
      </div>
    </div>
  )
}

function renderPage(page: AppPage) {
  switch (page) {
    case 'onboarding':
      return <OnboardingPage />
    case 'dashboard':
      return <DashboardPage />
    case 'chat':
      return <ChatPage />
    case 'research':
      return <ResearchPage />
    case 'history':
      return <HistoryPage />
    case 'collections':
      return <CollectionsPage />
    case 'shared':
      return <SharedPage />
    case 'library':
      return <LibraryPage />
    case 'workspace':
      return <WorkspacePage />
    case 'admin':
      return <AdminPage />
    case 'profile':
      return <ProfilePage />
    case 'settings':
      return <SettingsPage />
    case 'billing':
      return <BillingPage />
    case 'api-keys':
      return <ApiKeysPage />
    case 'analytics':
      return <AnalyticsPage />
    case 'docs':
      return <DocsPage />
    case 'blog':
      return <BlogPage />
    case 'support':
      return <SupportPage />
    case 'legal':
      return <LegalPage />
    case 'error':
      return <ErrorPage />
    default:
      return <PlaceholderPage title="Page" />
  }
}

/* ------------------------------------------------------------------ */
/*  AppShell component                                                 */
/* ------------------------------------------------------------------ */

export default function AppShell() {
  const {
    page,
    navigate,
    currentUser,
    sidebarOpen,
    setSidebarOpen,
    theme,
    setTheme,
    logout,
  } = useAppStore()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [page, setSidebarOpen])

  // Keyboard shortcut: Cmd+K to focus search (future)
  const handleSearchShortcut = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        navigate('dashboard')
      }
    },
    [navigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [handleSearchShortcut])

  const isAdmin = currentUser?.role === 'admin'
  const isFreePlan = currentUser?.plan === 'free'
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'

  const planLabel =
    currentUser?.plan === 'pro'
      ? 'Pro'
      : currentUser?.plan === 'enterprise'
        ? 'Enterprise'
        : 'Free'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ============ TOP NAVBAR ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-base font-semibold tracking-tight hidden sm:inline">
              Nexus AI
            </span>
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1.5">
          {/* Search shortcut indicator */}
          <button
            onClick={() => navigate('dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            <span>⌘K</span>
          </button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-7 w-7">
                  {currentUser?.avatar && (
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  )}
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ring-1 ring-white/10">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium leading-none">
                    {currentUser?.name || 'User'}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="hidden md:inline-flex text-[10px] px-1.5 py-0 h-4 font-semibold bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 border-cyan-500/20"
                >
                  {planLabel}
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.email || 'user@nexus.ai'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('billing')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('api-keys')}>
                  <Key className="mr-2 h-4 w-4" />
                  API Keys
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ============ SIDEBAR BACKDROP (mobile) ============ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ============ LEFT SIDEBAR ============ */}
      <AnimatePresence>
        {/* Mobile sidebar */}
        <motion.aside
          initial={{ x: -256 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-14 left-0 bottom-0 z-40 w-64 bg-background border-r border-border/50 flex flex-col lg:hidden overflow-y-auto scrollbar-thin"
        >
          <SidebarContent
            page={page}
            navigate={navigate}
            isAdmin={isAdmin}
            isFreePlan={isFreePlan}
            onClose={() => setSidebarOpen(false)}
          />
        </motion.aside>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex fixed top-14 left-0 bottom-0 z-30 w-64 bg-background border-r border-border/50 flex-col overflow-y-auto scrollbar-thin">
          <SidebarContent
            page={page}
            navigate={navigate}
            isAdmin={isAdmin}
            isFreePlan={isFreePlan}
          />
        </aside>
      </AnimatePresence>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 pt-14 lg:pl-64 pb-16 lg:pb-0">
        <div className="h-full">{renderPage(page)}</div>
      </main>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-2">
          {mobileNavItems.map((item) => {
            const isActive = page === item.page
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sidebar inner content (shared between mobile & desktop)            */
/* ------------------------------------------------------------------ */

interface SidebarContentProps {
  page: AppPage
  navigate: (page: AppPage, params?: Record<string, string>) => void
  isAdmin: boolean
  isFreePlan: boolean
  onClose?: () => void
}

function SidebarContent({ page, navigate, isAdmin, isFreePlan, onClose }: SidebarContentProps) {
  const handleNav = (targetPage: AppPage) => {
    navigate(targetPage)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Nav items */}
      <div className="flex-1 py-3 px-3 space-y-0.5">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null
          const isActive = page === item.page
          return (
            <div key={item.page}>
              <button
                onClick={() => handleNav(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-accent text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                <span>{item.label}</span>
                {item.page === 'research' && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-400 font-semibold">
                    NEW
                  </span>
                )}
              </button>
              {item.separatorAfter && (
                <Separator className="my-2 bg-border/50" />
              )}
            </div>
          )
        })}
      </div>

      {/* Upgrade card */}
      {isFreePlan && (
        <div className="p-3">
          <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-cyan-500/5 border border-cyan-500/10">
            {/* Decorative glow */}
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl" />
            <div className="relative space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlimited searches, deep research, and priority access.
              </p>
              <button
                onClick={() => handleNav('billing')}
                className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Upgrade now
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
