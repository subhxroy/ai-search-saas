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
    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Plus style={{ width: 16, height: 16, color: 'var(--ash)' }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)' }}>
          Follow up
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="group flex items-center gap-3 p-3 text-left transition-colors"
            style={{
              borderRadius: '12px',
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline)',
              cursor: 'pointer',
            }}
          >
            <ArrowRight style={{ width: 16, height: 16, color: 'var(--ash)', shrink: 0, transition: 'color 0.15s ease' }} className="group-hover:!text-[var(--accent-blue)]" />
            <span style={{ fontSize: 14, color: 'var(--ink)', transition: 'color 0.15s ease' }} className="group-hover:!text-[var(--accent-blue)]">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
