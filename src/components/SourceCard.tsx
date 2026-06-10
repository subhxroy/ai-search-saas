'use client'

import { ExternalLink, Globe } from 'lucide-react'
import type { Source } from '@/store/chat-store'

interface SourceCardProps {
  sources: Source[]
}

export default function SourceCard({ sources }: SourceCardProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Sources</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sources.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-56 p-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all"
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
                <Globe className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground truncate flex-1">
                {source.host_name || new URL(source.url).hostname}
              </span>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
              {source.title}
            </div>
            {source.snippet && (
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                {source.snippet}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
