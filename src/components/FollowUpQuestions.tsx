'use client'

import { Plus, ArrowRight } from 'lucide-react'

interface FollowUpQuestionsProps {
  questions: string[]
  onSelect: (question: string) => void
}

export default function FollowUpQuestions({
  questions,
  onSelect,
}: FollowUpQuestionsProps) {
  if (!questions || questions.length === 0) return null

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Plus className="h-3.5 w-3.5" style={{ color: 'var(--ash)' }} />
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--ash)' }}
        >
          Follow up
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {questions.slice(0, 3).map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline-strong)'
              e.currentTarget.style.background = 'var(--surface-elevated)'
              const arrow = e.currentTarget.querySelector('.follow-up-arrow') as HTMLElement
              if (arrow) arrow.style.color = 'var(--accent-blue)'
              const text = e.currentTarget.querySelector('.follow-up-text') as HTMLElement
              if (text) text.style.color = 'var(--ink)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline)'
              e.currentTarget.style.background = 'var(--surface-card)'
              const arrow = e.currentTarget.querySelector('.follow-up-arrow') as HTMLElement
              if (arrow) arrow.style.color = 'var(--stone)'
              const text = e.currentTarget.querySelector('.follow-up-text') as HTMLElement
              if (text) text.style.color = 'var(--charcoal)'
            }}
          >
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 transition-colors follow-up-arrow"
              style={{ color: 'var(--stone)' }}
            />
            <span
              className="text-sm leading-snug transition-colors follow-up-text"
              style={{ color: 'var(--charcoal)' }}
            >
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
