'use client'

import { Plus, ArrowRight } from 'lucide-react'
import { useChatStore } from '@/store/chat-store'

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
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2 mb-3">
        <Plus className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Follow up
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all text-left"
          >
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
