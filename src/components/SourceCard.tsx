'use client'

import { ExternalLink, Globe } from 'lucide-react'
import type { Source } from '@/store/app-store'

interface SourceCardProps {
  sources: Source[]
}

export default function SourceCard({ sources }: SourceCardProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Globe className="h-3.5 w-3.5" style={{ color: 'var(--ash)' }} />
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--ash)' }}
        >
          Sources
        </span>
      </div>
      <div
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-56 p-3 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline-strong)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--hairline)'
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {source.favicon ? (
                <img
                  src={source.favicon}
                  alt=""
                  className="w-3.5 h-3.5 rounded-sm"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <Globe className="w-3.5 h-3.5" style={{ color: 'var(--stone)' }} />
              )}
              <span
                className="text-[11px] truncate flex-1"
                style={{ color: 'var(--ash)' }}
              >
                {source.host_name || source.domain || new URL(source.url).hostname}
              </span>
              <ExternalLink
                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--ash)' }}
              />
            </div>
            <div
              className="text-sm font-medium line-clamp-2 leading-snug mb-1"
              style={{ color: 'var(--ink)' }}
            >
              {source.title}
            </div>
            {source.snippet && (
              <div
                className="text-xs line-clamp-2 leading-relaxed"
                style={{ color: 'var(--charcoal)' }}
              >
                {source.snippet}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
