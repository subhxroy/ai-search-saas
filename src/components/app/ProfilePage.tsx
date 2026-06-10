'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'
import {
  User,
  Camera,
  Save,
  Trash2,
  Building2,
  Briefcase,
  FileText,
  Mail,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

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
/*  ProfilePage component                                              */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useAppStore()

  const [name, setName] = useState(currentUser?.name || '')
  const [company, setCompany] = useState(currentUser?.company || '')
  const [jobTitle, setJobTitle] = useState(currentUser?.jobTitle || '')
  const [bio, setBio] = useState(currentUser?.bio || '')

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'

  const handleSave = () => {
    if (!currentUser) return
    setCurrentUser({
      ...currentUser,
      name,
      company,
      jobTitle,
      bio,
    })
  }

  return (
    <motion.div
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ======== HEADER ======== */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
          <User className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>
      </motion.div>

      {/* ======== AVATAR SECTION ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 ring-2 ring-white/10">
              {currentUser?.avatar && (
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              )}
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold">{currentUser?.name || 'User'}</h2>
            <p className="text-sm text-muted-foreground mb-3">
              {currentUser?.email || 'user@nexus.ai'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-xs"
              disabled
            >
              <Camera className="h-3.5 w-3.5" />
              Change Avatar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ======== FORM FIELDS ======== */}
      <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-6 mb-6 space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Full Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
        </div>

        <Separator className="bg-white/5" />

        {/* Email (disabled) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email
          </Label>
          <Input
            id="email"
            value={currentUser?.email || ''}
            disabled
            readOnly
            className="bg-white/5 border-white/10 opacity-60 cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <Separator className="bg-white/5" />

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            Company
          </Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter your company"
            className="bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
        </div>

        <Separator className="bg-white/5" />

        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="flex items-center gap-2 text-sm font-medium">
            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
            Job Title
          </Label>
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter your job title"
            className="bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
          />
        </div>

        <Separator className="bg-white/5" />

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Bio
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            rows={2}
            className="bg-white/5 border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none"
          />
        </div>
      </motion.div>

      {/* ======== SAVE BUTTON ======== */}
      <motion.div variants={itemVariants} className="mb-8">
        <Button
          onClick={handleSave}
          className="w-full sm:w-auto px-8 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] h-auto"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>

      {/* ======== DANGER ZONE ======== */}
      <motion.div variants={itemVariants}>
        <div className="rounded-2xl p-6 bg-red-500/5 border border-red-500/10 backdrop-blur-xl">
          <h3 className="text-base font-semibold text-red-400 mb-1.5">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="outline"
            disabled
            className="gap-2 text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
            <span className="text-[10px] font-normal opacity-70">(Coming soon)</span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
