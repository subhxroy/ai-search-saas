'use client'

import ReactMarkdown from 'react-markdown'
import { ExternalLink } from 'lucide-react'
import type { Source } from '@/store/chat-store'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
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
        <div className="max-w-[80%] px-5 py-3 rounded-2xl rounded-br-md bg-primary text-primary-foreground text-[15px] leading-relaxed">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 max-w-full">
      <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed">
        {content ? (
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 inline-flex items-center gap-1"
                >
                  {children}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ),
              p: ({ children }) => (
                <p className="mb-3 last:mb-0">{children}</p>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-6 mb-3 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
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
                <blockquote className="border-l-3 border-primary/30 pl-4 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              code: ({ className, children }) => {
                const isInline = !className
                if (isInline) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  )
                }
                return (
                  <code className={`${className} block bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto`}>
                    {children}
                  </code>
                )
              },
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        ) : isStreaming ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
            </div>
            <span className="text-sm">Searching and analyzing sources...</span>
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
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted hover:bg-accent text-xs text-muted-foreground hover:text-foreground transition-colors max-w-[180px]"
              title={source.title}
            >
              <span className="font-medium text-primary">[{i + 1}]</span>
              <span className="truncate">{source.host_name || source.title}</span>
            </a>
          ))}
        </div>
      )}

      {/* Cursor animation when streaming */}
      {isStreaming && content && (
        <span className="inline-block w-0.5 h-4 bg-foreground/70 animate-pulse ml-0.5 align-text-bottom" />
      )}
    </div>
  )
}
