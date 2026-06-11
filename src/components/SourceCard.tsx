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
      <div className="flex items-center gap-2 mb-3">
        <Globe style={{ width: 16, height: 16, color: 'var(--ash)' }} />
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)' }}>Sources</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-56 p-3 transition-colors"
            style={{
              borderRadius: '12px',
              background: 'var(--surface-card)',
              border: '1px solid var(--hairline)',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {source.favicon ? (
                <img
                  src={source.favicon}
                  alt=""
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <Globe style={{ width: 16, height: 16, color: 'var(--ash)' }} />
              )}
              <span className="truncate flex-1" style={{ fontSize: 12, color: 'var(--ash)' }}>
                {source.host_name || new URL(source.url).hostname}
              </span>
              <ExternalLink style={{ width: 12, height: 12, color: 'var(--ash)', opacity: 0, transition: 'opacity 0.15s' }} className="group-hover:!opacity-100" />
            </div>
            <div className="line-clamp-2 leading-snug" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
              {source.title}
            </div>
            {source.snippet && (
              <div className="line-clamp-2 mt-1 leading-relaxed" style={{ fontSize: 12, color: 'var(--ash)' }}>
                {source.snippet}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
