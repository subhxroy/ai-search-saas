import { NextRequest } from 'next/server'
import { getZAI } from '@/lib/zai'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-session'
import { ensureLocalUser } from '@/lib/ensure-local-user'
import {
  webSearchFallback,
  preprocessQuery,
  buildSystemPrompt,
  parseFollowUps,
  getLLMModels,
  retryWithBackoff,
  withTimeout,
  type SearchSource,
} from '@/lib/search-config'

export const maxDuration = 60

/* ------------------------------------------------------------------ */
/*  POST /api/chat — Streaming search with SSE                         */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, conversationId, deepResearch } = body as {
      query: string
      conversationId?: string
      deepResearch?: boolean
    }

    const user = await getSessionUser()
    const activeUserId = user ? user.id : 'local-user'

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const zai = await getZAI()
    const isDeep = deepResearch === true

    // ── Step 1: Preprocess query & web search ──
    const processedQuery = preprocessQuery(query.trim())
    const searchQuery = processedQuery !== query.trim() ? processedQuery : query.trim()
    const numResults = isDeep ? 10 : 6
    const sources: SearchSource[] = await webSearchFallback(searchQuery, numResults)

    // ── Step 2: Get conversation history ──
    let conversation = null
    try {
      if (conversationId) {
        conversation = await db.conversation.findFirst({
          where: { id: conversationId, userId: activeUserId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        })
      }
    } catch (dbErr) {
      const msg = dbErr instanceof Error ? dbErr.message : 'DB error'
      console.warn('Failed to load conversation history:', msg)
    }

    const historyMessages =
      conversation?.messages
        ?.filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })) || []

    // ── Step 3: Build prompt ──
    const systemPrompt = buildSystemPrompt({ sources, isDeep })

    const messages = [
      { role: 'assistant' as const, content: systemPrompt },
      ...historyMessages,
      { role: 'user' as const, content: query },
    ]

    // ── Step 4: Call LLM with fallback models ──
    let fullAnswer = ''
    const modelsToTry = getLLMModels(zai.config.defaultModel)
    let llmSuccess = false

    for (const modelName of modelsToTry) {
      try {
        const completion = await retryWithBackoff(async () => {
          return withTimeout(
            zai.chat.completions.create({
              model: modelName,
              messages,
              thinking: { type: 'disabled' },
              max_tokens: 2048,
            } as any),
            20000
          )
        }, 1, 1000)

        fullAnswer = completion.choices?.[0]?.message?.content || ''
        if (fullAnswer) {
          llmSuccess = true
          break
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.warn(`LLM failed [${modelName}]:`, msg)
      }
    }

    if (!llmSuccess || !fullAnswer) {
      fullAnswer =
        'I encountered an error generating a response. The AI service may be temporarily unavailable. Please try again in a moment.'
    }

    // ── Step 5: Parse follow-ups ──
    const { answerText, followUps } = parseFollowUps(fullAnswer, query)

    // ── Step 6: Create conversation if needed ──
    let conversationId_: string = conversation?.id || ''
    if (!conversation) {
      try {
        const title = query.length > 60 ? query.slice(0, 57) + '...' : query
        if (activeUserId === 'local-user') {
          await ensureLocalUser()
        }
        const newConv = await db.conversation.create({
          data: {
            title,
            userId: activeUserId,
            isDeepResearch: isDeep,
            researchStatus: 'completed',
          },
        })
        conversationId_ = newConv.id
      } catch (dbErr) {
        const msg = dbErr instanceof Error ? dbErr.message : 'DB error'
        console.error('Failed to create conversation:', msg)
        conversationId_ = `local-${Date.now()}`
      }
    }

    // ── Step 7: Stream the response back via SSE ──
    const slicedSources = sources.slice(0, isDeep ? 8 : 5)
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send sources
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'sources', data: slicedSources })}\n\n`
          )
        )

        // Stream answer word by word
        const words = answerText.split(' ')
        for (let i = 0; i < words.length; i++) {
          const word = i === 0 ? words[i] : ' ' + words[i]
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'token', data: word })}\n\n`
            )
          )
          await new Promise((resolve) => setTimeout(resolve, isDeep ? 8 : 12))
        }

        // Send follow-ups
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'followups', data: followUps })}\n\n`
          )
        )

        // Send completion
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'done',
              data: { conversationId: conversationId_ },
            })}\n\n`
          )
        )

        controller.close()

        // Save to DB in background (non-blocking)
        try {
          await db.message.create({
            data: {
              role: 'user',
              content: query,
              conversationId: conversationId_,
            },
          })

          await db.message.create({
            data: {
              role: 'assistant',
              content: answerText,
              conversationId: conversationId_,
              followUps: JSON.stringify(followUps),
              sources: {
                create: slicedSources.map((s) => ({
                  title: s.title,
                  url: s.url,
                  snippet: s.snippet,
                  favicon: s.favicon,
                  domain: s.domain || s.host_name,
                  rank: s.rank,
                })),
              },
            },
          })

          await db.conversation.update({
            where: { id: conversationId_ },
            data: { updatedAt: new Date() },
          })
        } catch (dbError) {
          const msg = dbError instanceof Error ? dbError.message : 'DB error'
          console.error('DB save error:', msg)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Chat API error:', msg)
    return new Response(
      JSON.stringify({ error: 'Failed to process your query' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
