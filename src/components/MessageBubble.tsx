'use client'

import ReactMarkdown from 'react-markdown'
import type { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Source } from '@/store/app-store'

/* ------------------------------------------------------------------ */
/*  Citation processor                                                 */
/* ------------------------------------------------------------------ */

function processCitations(content: string, sources: Source[]): string {
  if (!sources.length) return content
  return content.replace(/\[(\d+)\]/g, (match, numStr) => {
    const idx = parseInt(numStr, 10) - 1
    if (idx >= 0 && idx < sources.length) {
      const url = sources[idx].url
      return `[${match}](${url})`
    }
    return match
  })
}

/* ------------------------------------------------------------------ */
/*  Streaming cursor                                                   */
/* ------------------------------------------------------------------ */

function StreamingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-[1.1em] animate-blink ml-0.5 align-text-bottom rounded-full"
      style={{ background: 'var(--accent-blue)' }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Loading dots                                                       */
/* ------------------------------------------------------------------ */

function LoadingDots() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]"
          style={{ background: 'var(--accent-blue)', opacity: 0.5 }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]"
          style={{ background: 'var(--accent-blue)', opacity: 0.5 }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ background: 'var(--accent-blue)', opacity: 0.5 }}
        />
      </div>
      <span className="text-sm" style={{ color: 'var(--ash)' }}>
        Searching and analyzing sources...
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Markdown components                                                */
/* ------------------------------------------------------------------ */

function getMarkdownComponents(sources: Source[]) {
  return {
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      const isCitation = href && children && String(children).match(/^\[\d+\]$/)
      if (isCitation) {
        const num = String(children).match(/\d+/)?.[0]
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="citation-chip no-underline"
            title={sources[parseInt(num || '1', 10) - 1]?.title || 'Source'}
          >
            {num}
          </a>
        )
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-colors no-underline underline-offset-2"
          style={{ color: 'var(--accent-blue)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--accent-blue)'
          }}
        >
          {children}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      )
    },
    p: ({ children }: { children?: ReactNode }) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0" style={{ color: 'var(--ink)' }}>
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-xl font-bold mt-5 mb-2" style={{ color: 'var(--ink)' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-lg font-semibold mt-4 mb-2" style={{ color: 'var(--ink)' }}>
        {children}
      </h3>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote
        className="pl-4 italic my-3"
        style={{
          borderLeft: '3px solid var(--hairline-strong)',
          color: 'var(--charcoal)',
        }}
      >
        {children}
      </blockquote>
    ),
    code: ({
      className,
      children,
    }: {
      className?: string
      children?: ReactNode
    }) => {
      const isInline = !className
      if (isInline) {
        return (
          <code
            className="px-1.5 py-0.5 rounded text-sm font-mono"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--accent-blue)',
            }}
          >
            {children}
          </code>
        )
      }
      return (
        <div className="relative my-3">
          <code
            className={`${className || ''} block p-4 rounded-xl text-sm font-mono overflow-x-auto leading-relaxed`}
            style={{
              background: 'var(--surface-deep)',
              border: '1px solid var(--hairline-strong)',
              color: 'var(--body)',
            }}
          >
            {children}
          </code>
        </div>
      )
    },
    pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold" style={{ color: 'var(--ink)' }}>
        {children}
      </strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic" style={{ color: 'var(--body)' }}>{children}</em>
    ),
    hr: () => <hr style={{ borderColor: 'var(--hairline)' }} />,
    table: ({ children }: { children?: ReactNode }) => (
      <div className="overflow-x-auto my-3">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th
        className="px-3 py-2 text-left font-medium"
        style={{
          border: '1px solid var(--hairline)',
          background: 'var(--surface-elevated)',
          color: 'var(--ink)',
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td
        className="px-3 py-2"
        style={{
          border: '1px solid var(--hairline)',
          color: 'var(--body)',
        }}
      >
        {children}
      </td>
    ),
  }
}

/* ------------------------------------------------------------------ */
/*  MessageBubble component                                            */
/* ------------------------------------------------------------------ */

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system'
  content: string
  sources?: Source[]
  isStreaming?: boolean
}

export default function MessageBubble({
  role,
  content,
  sources = [],
  isStreaming,
}: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-6">
        <div
          className="max-w-[80%] sm:max-w-[70%] px-5 py-3 text-[15px] leading-relaxed"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: '12px 12px 4px 12px',
            color: 'var(--ink)',
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  if (role === 'system') return null

  const processedContent = sources.length
    ? processCitations(content, sources)
    : content
  const markdownComponents = getMarkdownComponents(sources)

  return (
    <div className="mb-6 max-w-full">
      <div
        className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed"
        style={{ color: 'var(--body)' }}
      >
        {content ? (
          <>
            <ReactMarkdown components={markdownComponents}>
              {processedContent}
            </ReactMarkdown>
            {isStreaming && <StreamingCursor />}
          </>
        ) : isStreaming ? (
          <LoadingDots />
        ) : null}
      </div>

      {/* Inline citation chips below content */}
      {sources.length > 0 && content && !isStreaming && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="citation-chip"
              style={{ gap: 4, maxWidth: 180, textDecoration: 'none' }}
              title={source.title}
            >
              <span style={{ fontWeight: 600 }}>[{i + 1}]</span>
              <span className="truncate" style={{ color: 'var(--charcoal)', fontSize: 11 }}>
                {source.host_name || source.title}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
