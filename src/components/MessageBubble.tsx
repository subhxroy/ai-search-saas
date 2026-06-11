'use client'

import ReactMarkdown from 'react-markdown'
import { ExternalLink } from 'lucide-react'
import type { Source } from '@/store/app-store'

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system'
  content: string
  sources?: Source[]
  isStreaming?: boolean
}

export default function MessageBubble({
  role,
  content,
  sources,
  isStreaming,
}: MessageBubbleProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-6">
        <div
          className="max-w-[80%] px-5 py-3"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--hairline-strong)',
            borderRadius: '12px',
            borderBottomRightRadius: '4px',
            color: 'var(--ink)',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 max-w-full">
      <div className="prose prose-sm dark:prose-invert max-w-none" style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--body)' }}>
        {content ? (
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                  style={{ color: 'var(--accent-blue)', textDecoration: 'underline', textUnderlineOffset: 2 }}
                >
                  {children}
                  <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              ),
              p: ({ children }) => (
                <p className="mb-3 last:mb-0">{children}</p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0" style={{ color: 'var(--ink)' }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mt-5 mb-2" style={{ color: 'var(--ink)' }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-4 mb-2" style={{ color: 'var(--ink)' }}>
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote style={{ borderLeft: '3px solid var(--hairline-strong)', paddingLeft: 16, fontStyle: 'italic', color: 'var(--charcoal)' }}>
                  {children}
                </blockquote>
              ),
              code: ({ className, children }) => {
                const isInline = !className
                if (isInline) {
                  return (
                    <code
                      style={{
                        background: 'var(--surface-card)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: 13,
                        fontFamily: 'var(--font-geist-mono), monospace',
                      }}
                    >
                      {children}
                    </code>
                  )
                }
                return (
                  <code
                    className={`${className} block overflow-x-auto`}
                    style={{
                      background: 'var(--surface-deep)',
                      padding: 12,
                      borderRadius: '8px',
                      fontSize: 13,
                      fontFamily: 'var(--font-geist-mono), monospace',
                      border: '1px solid var(--hairline)',
                    }}
                  >
                    {children}
                  </code>
                )
              },
              strong: ({ children }) => (
                <strong className="font-semibold" style={{ color: 'var(--ink)' }}>
                  {children}
                </strong>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        ) : isStreaming ? (
          <div className="flex items-center gap-2" style={{ color: 'var(--ash)' }}>
            <div className="flex gap-1">
              <span
                className="rounded-full animate-bounce"
                style={{
                  width: 6, height: 6,
                  background: 'rgba(252,253,255,0.3)',
                  animationDelay: '-0.3s',
                }}
              />
              <span
                className="rounded-full animate-bounce"
                style={{
                  width: 6, height: 6,
                  background: 'rgba(252,253,255,0.3)',
                  animationDelay: '-0.15s',
                }}
              />
              <span
                className="rounded-full animate-bounce"
                style={{
                  width: 6, height: 6,
                  background: 'rgba(252,253,255,0.3)',
                }}
              />
            </div>
            <span style={{ fontSize: 14 }}>Searching and analyzing sources...</span>
          </div>
        ) : null}
      </div>

      {/* Sources inline citations */}
      {sources && sources.length > 0 && content && (
        <div className="mt-4 flex flex-wrap gap-1.5">
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

      {/* Cursor animation when streaming */}
      {isStreaming && content && (
        <span
          className="inline-block animate-blink ml-0.5 align-text-bottom"
          style={{
            width: 2,
            height: 16,
            background: 'var(--accent-blue)',
          }}
        />
      )}
    </div>
  )
}
