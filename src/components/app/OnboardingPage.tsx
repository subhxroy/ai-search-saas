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
import { useAppStore } from '@/store/app-store'
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
      className="relative flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 cursor-pointer"
      style={{
        background: selected
          ? 'var(--surface-elevated)'
          : 'var(--surface-card)',
        borderColor: selected
          ? 'var(--accent-blue)'
          : 'var(--hairline)',
      }}
    >
      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent-blue)' }}
        >
          <Check className="h-3 w-3" style={{ color: '#000000' }} />
        </motion.div>
      )}

      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center transition-colors duration-200"
        style={{
          background: selected
            ? 'var(--surface-card)'
            : 'var(--surface-elevated)',
          border: selected
            ? '1px solid var(--hairline-strong)'
            : '1px solid var(--hairline)',
        }}
      >
        <Icon
          className="h-6 w-6 transition-colors duration-200"
          style={{ color: selected ? 'var(--accent-blue)' : 'var(--ash)' }}
        />
      </div>

      <span
        className="text-sm font-medium text-center leading-tight transition-colors duration-200"
        style={{ color: selected ? 'var(--ink)' : 'var(--ash)' }}
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
                  ? 'var(--accent-blue)'
                  : 'var(--hairline)',
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
  const navigate = useAppStore((s) => s.navigate)
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

  const finishOnboarding = async (dataSelections: any) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboarded: true,
          onboardingData: dataSelections,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        useAppStore.setState({ currentUser: data.user })
      }
    } catch (e) {
      console.error('Failed to save onboarding data:', e)
    }
    navigate('dashboard')
  }

  const handleSkip = () => {
    finishOnboarding({})
  }

  const handleGetStarted = () => {
    finishOnboarding(selections)
  }

  const hasSelection = (selections[step] || []).length > 0

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background atmospheric glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full animate-float-1"
          style={{
            background:
              'radial-gradient(circle, var(--accent-blue-glow) 0%, transparent 70%)',
            opacity: 0.4,
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full animate-float-2"
          style={{
            background:
              'radial-gradient(circle, var(--accent-orange-glow) 0%, transparent 70%)',
            opacity: 0.4,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full animate-float-3"
          style={{
            background:
              'radial-gradient(circle, var(--accent-blue-glow) 0%, transparent 60%)',
            opacity: 0.15,
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
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline-strong)',
            }}
          >
            <Sparkles
              className="h-5 w-5"
              style={{ color: 'var(--accent-blue)' }}
            />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
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
          className="feature-card-bordered"
          style={{ padding: '24px 32px' }}
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
                <h2
                  className="heading-md mb-1.5"
                >
                  {stepMeta[step].title}
                </h2>
                <p className="body-sm">
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
          <div
            className="flex items-center justify-between mt-8 pt-6"
            style={{ borderTop: '1px solid var(--hairline)' }}
          >
            {/* Back */}
            <div>
              {step > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  className="gap-1.5"
                  style={{ color: 'var(--ash)' }}
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
              className="text-xs transition-colors"
              style={{ color: 'var(--stone)' }}
            >
              Skip
            </button>

            {/* Next / Get Started */}
            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!hasSelection}
                className="btn-primary gap-1.5 inline-flex items-center justify-center"
                style={{
                  opacity: hasSelection ? 1 : 0.4,
                  cursor: hasSelection ? 'pointer' : 'not-allowed',
                }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGetStarted}
                className="btn-primary gap-1.5 inline-flex items-center justify-center"
              >
                Get Started
                <UserPlus className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
