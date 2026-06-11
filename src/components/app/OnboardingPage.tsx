'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Code,
  PenTool,
  BarChart3,
  Lightbulb,
  Microscope,
  Users,
  Crown,
  UserPlus,
  Search,
  Group,
  Blocks,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'
import { loginAsDefault } from '@/store/app-store'
import { Button } from '@/components/ui/button'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ChoiceItem {
  id: string
  label: string
  icon: React.ElementType
}

/* ------------------------------------------------------------------ */
/*  Step data                                                          */
/* ------------------------------------------------------------------ */
const stepMeta = [
  { title: 'What brings you here?', subtitle: 'Select all that apply' },
  { title: 'Your role', subtitle: 'Choose the best fit' },
  { title: 'How will you use Nexus?', subtitle: 'Select all that apply' },
]

const step1Choices: ChoiceItem[] = [
  { id: 'academic', label: 'Academic Research', icon: GraduationCap },
  { id: 'business', label: 'Business Strategy', icon: Briefcase },
  { id: 'development', label: 'Software Development', icon: Code },
  { id: 'content', label: 'Content Creation', icon: PenTool },
  { id: 'data', label: 'Data Analysis', icon: BarChart3 },
  { id: 'general', label: 'General Knowledge', icon: Lightbulb },
]

const step2Choices: ChoiceItem[] = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'researcher', label: 'Researcher', icon: Microscope },
  { id: 'developer', label: 'Developer', icon: Code },
  { id: 'manager', label: 'Manager', icon: Users },
  { id: 'executive', label: 'Executive', icon: Crown },
  { id: 'freelancer', label: 'Freelancer', icon: Briefcase },
]

const step3Choices: ChoiceItem[] = [
  { id: 'personal', label: 'Personal research', icon: Search },
  { id: 'team', label: 'Team collaboration', icon: Group },
  { id: 'products', label: 'Building products', icon: Blocks },
  { id: 'learning', label: 'Learning & education', icon: BookOpen },
]

/* ------------------------------------------------------------------ */
/*  Slide transition variants                                          */
/* ------------------------------------------------------------------ */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

/* ------------------------------------------------------------------ */
/*  Choice card                                                        */
/* ------------------------------------------------------------------ */
function ChoiceCard({
  item,
  selected,
  onClick,
  multiple,
}: {
  item: ChoiceItem
  selected: boolean
  onClick: () => void
  multiple: boolean
}) {
  const Icon = item.icon
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
        selected
          ? 'glass-strong border-cyan-500/30 shadow-lg shadow-cyan-500/10'
          : 'glass border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
      }`}
    >
      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"
        >
          <Check className="h-3 w-3 text-white" />
        </motion.div>
      )}

      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
          selected
            ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 ring-1 ring-cyan-500/20'
            : 'bg-white/[0.04] ring-1 ring-white/[0.06]'
        }`}
      >
        <Icon
          className={`h-6 w-6 transition-colors duration-300 ${
            selected ? 'text-cyan-400' : 'text-muted-foreground'
          }`}
        />
      </div>

      <span
        className={`text-sm font-medium text-center leading-tight transition-colors duration-300 ${
          selected ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        {item.label}
      </span>
    </motion.button>
  )
}

/* ------------------------------------------------------------------ */
/*  Step indicator                                                     */
/* ------------------------------------------------------------------ */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            animate={{
              width: i === current ? 28 : 8,
              backgroundColor:
                i <= current
                  ? 'rgba(6,182,212,0.9)'
                  : 'rgba(255,255,255,0.08)',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-2 rounded-full"
          />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  OnboardingPage component                                           */
/* ------------------------------------------------------------------ */
export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [selections, setSelections] = useState<Record<number, string[]>>({
    0: [],
    1: [],
    2: [],
  })

  const totalSteps = 3

  const currentChoices =
    step === 0 ? step1Choices : step === 1 ? step2Choices : step3Choices
  const isMultiple = step !== 1 // step 2 is single choice

  const toggleSelection = (id: string) => {
    setSelections((prev) => {
      const current = prev[step] || []
      if (isMultiple) {
        return {
          ...prev,
          [step]: current.includes(id)
            ? current.filter((s) => s !== id)
            : [...current, id],
        }
      }
      // Single choice — replace
      return { ...prev, [step]: current.includes(id) ? [] : [id] }
    })
  }

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (step > 0) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }

  const handleSkip = () => {
    loginAsDefault()
  }

  const handleGetStarted = () => {
    loginAsDefault()
  }

  const hasSelection = (selections[step] || []).length > 0

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full animate-float-1"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full animate-float-2"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full animate-float-3"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* ---- Logo ---- */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center ring-1 ring-white/10">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">
            Nexus AI
          </span>
        </motion.div>

        {/* ---- Step indicator ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StepIndicator current={step} total={totalSteps} />
        </motion.div>

        {/* ---- Card ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30"
        >
          {/* ---- Step content ---- */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Step heading */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-1.5">
                  {stepMeta[step].title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {stepMeta[step].subtitle}
                </p>
              </div>

              {/* Choice grid */}
              <div
                className={`grid gap-3 ${
                  step === 2
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {currentChoices.map((item) => (
                  <ChoiceCard
                    key={item.id}
                    item={item}
                    selected={(selections[step] || []).includes(item.id)}
                    onClick={() => toggleSelection(item.id)}
                    multiple={isMultiple}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ---- Navigation ---- */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
            {/* Back */}
            <div>
              {step > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}
            </div>

            {/* Skip */}
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Skip
            </button>

            {/* Next / Get Started */}
            {step < totalSteps - 1 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={!hasSelection}
                className="gap-1.5 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-40"
                style={{
                  background: hasSelection
                    ? 'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(139,92,246,0.9))'
                    : undefined,
                }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleGetStarted}
                className="gap-1.5 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(139,92,246,0.9))',
                }}
              >
                Get Started
                <UserPlus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
