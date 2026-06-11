'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type AppPage } from '@/store/app-store'
import {
  Menu,
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
  BarChart3,
} from 'lucide-react'
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
/*  Page renderer placeholder                                          */
/* ------------------------------------------------------------------ */

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-4">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'var(--surface-card)',
            border: '1px solid var(--hairline-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          <Search style={{ width: 24, height: 24, color: 'var(--ash)' }} />
        </div>
        <h2 className="heading-md">{title}</h2>
        <p className="body-sm" style={{ color: 'var(--stone)' }}>Coming soon</p>
      </div>
    </div>
  )
}

function renderPage(page: AppPage) {
  switch (page) {
    case 'onboarding': return <OnboardingPage />
    case 'dashboard': return <DashboardPage />
    case 'chat': return <ChatPage />
    case 'research': return <ResearchPage />
    case 'history': return <HistoryPage />
    case 'collections': return <CollectionsPage />
    case 'shared': return <SharedPage />
    case 'library': return <LibraryPage />
    case 'workspace': return <WorkspacePage />
    case 'admin': return <AdminPage />
    case 'profile': return <ProfilePage />
    case 'settings': return <SettingsPage />
    case 'billing': return <BillingPage />
    case 'api-keys': return <ApiKeysPage />
    case 'analytics': return <AnalyticsPage />
    case 'docs': return <DocsPage />
    case 'blog': return <BlogPage />
    case 'support': return <SupportPage />
    case 'legal': return <LegalPage />
    case 'error': return <ErrorPage />
    default: return <PlaceholderPage title="Page" />
  }
}

/* ------------------------------------------------------------------ */
/*  AppShell component — Resend editorial style                        */
/* ------------------------------------------------------------------ */

export default function AppShell() {
  const {
    page,
    navigate,
    currentUser,
    sidebarOpen,
    setSidebarOpen,
    logout,
  } = useAppStore()

  useEffect(() => { setSidebarOpen(false) }, [page, setSidebarOpen])

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
    ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U'

  const planLabel =
    currentUser?.plan === 'pro' ? 'Pro'
      : currentUser?.plan === 'enterprise' ? 'Enterprise'
      : 'Free'

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000', color: '#fcfdff' }}>
      {/* ============ TOP NAVBAR ============ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{
          height: 56,
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Left section */}
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--charcoal)',
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          {/* Logo — Resend style monochrome */}
          <button
            onClick={() => navigate('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search style={{ width: 14, height: 14, color: '#fcfdff' }} />
            </div>
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                fontSize: 14,
                fontWeight: 500,
                color: '#fcfdff',
                letterSpacing: '-0.01em',
              }}
            >
              Nexus AI
            </span>
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Search shortcut */}
          <button
            onClick={() => navigate('dashboard')}
            className="hidden sm:flex items-center gap-1.5 cursor-pointer"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline)',
              color: 'var(--stone)',
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: 12,
            }}
          >
            <Search style={{ width: 14, height: 14 }} />
            <span>⌘K</span>
          </button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 8px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-card)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '9999px',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--ash)',
                  }}
                >
                  {initials}
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                    {currentUser?.name || 'User'}
                  </span>
                  <span
                    className="badge-pill"
                    style={{ fontSize: 10, padding: '2px 8px', color: 'var(--accent-blue)' }}
                  >
                    {planLabel}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser?.name || 'User'}</p>
                  <p style={{ fontSize: 12, color: 'var(--ash)' }}>
                    {currentUser?.email || 'user@nexus.ai'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('profile')}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('settings')}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('billing')}>
                  <CreditCard className="mr-2 h-4 w-4" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('api-keys')}>
                  <Key className="mr-2 h-4 w-4" /> API Keys
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ============ SIDEBAR BACKDROP ============ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.7)' }}
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
          className="fixed top-14 left-0 bottom-0 z-40 w-64 flex flex-col lg:hidden overflow-y-auto scrollbar-thin"
          style={{ background: '#06060a', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <SidebarContent page={page} navigate={navigate} isAdmin={isAdmin} isFreePlan={isFreePlan} onClose={() => setSidebarOpen(false)} />
        </motion.aside>

        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex fixed top-14 left-0 bottom-0 z-30 w-64 flex-col overflow-y-auto scrollbar-thin"
          style={{ background: '#06060a', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <SidebarContent page={page} navigate={navigate} isAdmin={isAdmin} isFreePlan={isFreePlan} />
        </aside>
      </AnimatePresence>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 pt-14 lg:pl-64 pb-16 lg:pb-0">
        <div className="h-full">{renderPage(page)}</div>
      </main>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: '#000000',
        }}
      >
        <div className="flex items-center justify-around h-14 px-2">
          {mobileNavItems.map((item) => {
            const isActive = page === item.page
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1"
                style={{
                  color: isActive ? '#fcfdff' : 'var(--stone)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                }}
              >
                <item.icon style={{ width: 20, height: 20 }} />
                <span style={{ fontSize: 10, fontWeight: 500, fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sidebar inner content — Resend editorial style                     */
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
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  background: isActive ? 'var(--surface-card)' : 'transparent',
                  color: isActive ? '#fcfdff' : 'var(--ash)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--surface-card)'
                    e.currentTarget.style.color = 'var(--ink)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--ash)'
                  }
                }}
              >
                <item.icon style={{ width: 16, height: 16, shrink: 0, color: isActive ? 'var(--accent-blue)' : 'inherit' }} />
                <span>{item.label}</span>
                {item.page === 'research' && (
                  <span className="badge-pill ml-auto" style={{ fontSize: 10, padding: '2px 8px', color: 'var(--accent-green)' }}>
                    NEW
                  </span>
                )}
              </button>
              {item.separatorAfter && (
                <div style={{ height: 1, background: 'var(--hairline)', margin: '8px 0' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Upgrade card */}
      {isFreePlan && (
        <div className="p-3">
          <div
            style={{
              borderRadius: '12px',
              padding: 16,
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline-strong)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap style={{ width: 16, height: 16, color: 'var(--accent-green)' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#fcfdff' }}>Upgrade to Pro</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--ash)', lineHeight: 1.5 }}>
                Unlimited searches, deep research, and priority access.
              </p>
              <button
                onClick={() => handleNav('billing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--accent-blue)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Upgrade now
                <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
