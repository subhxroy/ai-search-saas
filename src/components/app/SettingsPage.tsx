'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  Settings,
  User,
  Palette,
  Bell,
  Shield,
  Brain,
  Lock,
  Mail,
  KeyRound,
  Chrome,
  Github,
  Download,
  Sun,
  Moon,
  Type,
  Minimize2,
  Search,
  Clock,
  Trash2,
  Monitor,
  Smartphone,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SettingsTab = 'account' | 'appearance' | 'notifications' | 'privacy' | 'ai' | 'security'

/* ------------------------------------------------------------------ */
/*  SettingsPage component                                             */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const { currentUser, theme, setTheme } = useAppStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')

  // Account settings
  const [emailInput, setEmailInput] = useState(currentUser?.email || '')
  const [passwordInput, setPasswordInput] = useState('')
  const [googleConnected, setGoogleConnected] = useState(true)
  const [githubConnected, setGithubConnected] = useState(false)

  // Appearance settings
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [compactMode, setCompactMode] = useState(false)

  // Notification settings
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [researchNotifs, setResearchNotifs] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [productUpdates, setProductUpdates] = useState(true)

  // Privacy settings
  const [profilePublic, setProfilePublic] = useState(true)
  const [saveHistory, setSaveHistory] = useState(true)
  const [dataRetention, setDataRetention] = useState<'30' | '90' | '365'>('90')

  // AI settings
  const [defaultModel, setDefaultModel] = useState('auto')
  const [responseStyle, setResponseStyle] = useState<'concise' | 'balanced' | 'detailed'>('balanced')
  const [citeSources, setCiteSources] = useState(true)
  const [autoFollowUps, setAutoFollowUps] = useState(true)
  const [deepResearchDefault, setDeepResearchDefault] = useState(false)

  // Security settings
  const [twoFactor, setTwoFactor] = useState(false)

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'ai', label: 'AI', icon: Brain },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
          <Settings className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your Nexus AI experience</p>
        </div>
      </motion.div>

      {/* ======== TABS ======== */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingsTab)}>
          {/* Scrollable tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
            <TabsList className="inline-flex w-full sm:w-auto min-w-max">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5 px-3">
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.label.slice(0, 3)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ======== ACCOUNT TAB ======== */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Email change */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  Email Address
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-cyan-500/50"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-white/10 hover:bg-accent"
                  >
                    Update Email
                  </Button>
                </div>
              </div>

              {/* Password change */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-cyan-400" />
                  Password
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter new password"
                      className="bg-white/5 border-white/10 focus:border-cyan-500/50"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-white/10 hover:bg-accent"
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              {/* Connected accounts */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Chrome className="h-4 w-4 text-cyan-400" />
                  Connected Accounts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Chrome className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Google</p>
                        <p className="text-xs text-muted-foreground">
                          {googleConnected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={googleConnected}
                      onCheckedChange={setGoogleConnected}
                      className="data-[state=checked]:bg-cyan-600"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Github className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">GitHub</p>
                        <p className="text-xs text-muted-foreground">
                          {githubConnected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={githubConnected}
                      onCheckedChange={setGithubConnected}
                      className="data-[state=checked]:bg-cyan-600"
                    />
                  </div>
                </div>
              </div>

              {/* Export data */}
              <div className="glass-strong rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold">Export Data</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Download all your data in JSON format
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-white/10 hover:bg-accent"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ======== APPEARANCE TAB ======== */}
          <TabsContent value="appearance">
            <div className="space-y-6">
              {/* Theme */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4 text-cyan-400" />
                  Theme
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-cyan-500/50 bg-cyan-500/5'
                        : 'border-white/5 bg-white/3 hover:border-white/10'
                    }`}
                  >
                    <div className="h-20 rounded-lg bg-[#09090B] border border-white/10 mb-3 p-2 space-y-1.5">
                      <div className="h-1.5 w-8 rounded bg-white/20" />
                      <div className="h-1.5 w-12 rounded bg-white/10" />
                      <div className="h-1.5 w-6 rounded bg-white/10" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-1.5">
                        <Moon className="h-3.5 w-3.5" />
                        Dark
                      </span>
                      {theme === 'dark' && (
                        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-cyan-500/50 bg-cyan-500/5'
                        : 'border-white/5 bg-white/3 hover:border-white/10'
                    }`}
                  >
                    <div className="h-20 rounded-lg bg-white border border-gray-200 mb-3 p-2 space-y-1.5">
                      <div className="h-1.5 w-8 rounded bg-gray-300" />
                      <div className="h-1.5 w-12 rounded bg-gray-200" />
                      <div className="h-1.5 w-6 rounded bg-gray-200" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5" />
                        Light
                      </span>
                      {theme === 'light' && (
                        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Font size */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Type className="h-4 w-4 text-cyan-400" />
                  Font Size
                </h3>
                <RadioGroup
                  value={fontSize}
                  onValueChange={(v) => setFontSize(v as 'small' | 'medium' | 'large')}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { value: 'small', label: 'Small', desc: 'Aa' },
                    { value: 'medium', label: 'Medium', desc: 'Aa' },
                    { value: 'large', label: 'Large', desc: 'Aa' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        fontSize === opt.value
                          ? 'border-cyan-500/50 bg-cyan-500/5'
                          : 'border-white/5 bg-white/3 hover:border-white/10'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      <span className={`${opt.value === 'small' ? 'text-sm' : opt.value === 'medium' ? 'text-base' : 'text-lg'} font-semibold`}>
                        {opt.desc}
                      </span>
                      <span className="text-xs text-muted-foreground">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Compact mode */}
              <div className="glass-strong rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Minimize2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Compact Mode</h3>
                      <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                  </div>
                  <Switch
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                    className="data-[state=checked]:bg-cyan-600"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ======== NOTIFICATIONS TAB ======== */}
          <TabsContent value="notifications">
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: 'Email Notifications',
                  desc: 'Receive email updates about your account',
                  checked: emailNotifs,
                  onChange: setEmailNotifs,
                },
                {
                  icon: Sparkles,
                  title: 'Research Complete',
                  desc: 'Get notified when deep research finishes',
                  checked: researchNotifs,
                  onChange: setResearchNotifs,
                },
                {
                  icon: Bell,
                  title: 'Weekly Digest',
                  desc: 'Receive a weekly summary of your research activity',
                  checked: weeklyDigest,
                  onChange: setWeeklyDigest,
                },
                {
                  icon: Settings,
                  title: 'Product Updates',
                  desc: 'Stay informed about new features and improvements',
                  checked: productUpdates,
                  onChange: setProductUpdates,
                },
              ].map((item) => (
                <div key={item.title} className="glass-strong rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={item.checked}
                      onCheckedChange={item.onChange}
                      className="data-[state=checked]:bg-cyan-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ======== PRIVACY TAB ======== */}
          <TabsContent value="privacy">
            <div className="space-y-6">
              {/* Profile visibility */}
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Profile Visibility</h3>
                      <p className="text-xs text-muted-foreground">
                        {profilePublic ? 'Your profile is visible to everyone' : 'Your profile is private'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={profilePublic}
                    onCheckedChange={setProfilePublic}
                    className="data-[state=checked]:bg-cyan-600"
                  />
                </div>
              </div>

              {/* Search history */}
              <div className="glass-strong rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Save Search History</h3>
                      <p className="text-xs text-muted-foreground">
                        {saveHistory ? 'Search history is being saved' : 'Search history will not be saved'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={saveHistory}
                    onCheckedChange={setSaveHistory}
                    className="data-[state=checked]:bg-cyan-600"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All History
                </Button>
              </div>

              {/* Data retention */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Data Retention
                </h3>
                <RadioGroup
                  value={dataRetention}
                  onValueChange={(v) => setDataRetention(v as '30' | '90' | '365')}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { value: '30', label: '30 Days' },
                    { value: '90', label: '90 Days' },
                    { value: '365', label: '365 Days' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        dataRetention === opt.value
                          ? 'border-cyan-500/50 bg-cyan-500/5'
                          : 'border-white/5 bg-white/3 hover:border-white/10'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          {/* ======== AI TAB ======== */}
          <TabsContent value="ai">
            <div className="space-y-6">
              {/* Default model */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4 text-cyan-400" />
                  Default Model
                </h3>
                <Select value={defaultModel} onValueChange={setDefaultModel}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="auto">Auto-select</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Response style */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Type className="h-4 w-4 text-cyan-400" />
                  Response Style
                </h3>
                <RadioGroup
                  value={responseStyle}
                  onValueChange={(v) => setResponseStyle(v as 'concise' | 'balanced' | 'detailed')}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { value: 'concise', label: 'Concise', desc: 'Short & direct' },
                    { value: 'balanced', label: 'Balanced', desc: 'Moderate detail' },
                    { value: 'detailed', label: 'Detailed', desc: 'In-depth answers' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        responseStyle === opt.value
                          ? 'border-cyan-500/50 bg-cyan-500/5'
                          : 'border-white/5 bg-white/3 hover:border-white/10'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="sr-only" />
                      <span className="text-sm font-medium">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* AI toggles */}
              {[
                {
                  icon: Sparkles,
                  title: 'Always Cite Sources',
                  desc: 'Include source citations in every response',
                  checked: citeSources,
                  onChange: setCiteSources,
                },
                {
                  icon: Brain,
                  title: 'Auto-generate Follow-ups',
                  desc: 'Suggest follow-up questions after each response',
                  checked: autoFollowUps,
                  onChange: setAutoFollowUps,
                },
                {
                  icon: Search,
                  title: 'Deep Research as Default',
                  desc: 'Use deep research mode by default for all queries',
                  checked: deepResearchDefault,
                  onChange: setDeepResearchDefault,
                },
              ].map((item) => (
                <div key={item.title} className="glass-strong rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={item.checked}
                      onCheckedChange={item.onChange}
                      className="data-[state=checked]:bg-cyan-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ======== SECURITY TAB ======== */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* 2FA */}
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Coming soon</span>
                    <Switch
                      checked={twoFactor}
                      onCheckedChange={setTwoFactor}
                      disabled
                      className="data-[state=checked]:bg-cyan-600"
                    />
                  </div>
                </div>
              </div>

              {/* Active sessions */}
              <div className="glass-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-cyan-400" />
                  Active Sessions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Chrome on macOS</p>
                        <p className="text-xs text-muted-foreground">Current session</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Safari on iPhone</p>
                        <p className="text-xs text-muted-foreground">Last active 2h ago</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground font-medium">
                      Idle
                    </span>
                  </div>
                </div>
                <Separator className="bg-white/5" />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-white/10 hover:bg-accent text-destructive hover:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out All Devices
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
