import { NextRequest, NextResponse } from 'next/server'
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
} from '@/lib/search-config'

export const maxDuration = 60

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SearchResponseBody {
  answer: string
  sources: {
    title: string
    url: string
    snippet: string
    relevance: number
  }[]
  followUps: string[]
  conversationId: string
  query: string
}

interface ErrorResponse {
  error: string
  code: string
}

/* ------------------------------------------------------------------ */
/*  CORS                                                               */
/* ------------------------------------------------------------------ */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
}

function corsResponse(
  body: unknown,
  status: number,
  extraHeaders?: Record<string, string>
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { ...CORS_HEADERS, ...extraHeaders },
  })
}

function computeRelevance(rank: number): number {
  return Math.max(0.05, +(1.0 - rank * 0.05).toFixed(2))
}

/* ------------------------------------------------------------------ */
/*  OPTIONS — preflight                                                */
/* ------------------------------------------------------------------ */

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS })
}

/* ------------------------------------------------------------------ */
/*  GET — ?query=...&deepResearch=false                                */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const query = searchParams.get('query')
  const deepResearch = searchParams.get('deepResearch') === 'true'

  if (!query || query.trim().length === 0) {
    return corsResponse(
      { error: 'Query is required', code: 'MISSING_QUERY' } satisfies ErrorResponse,
      400
    )
  }

  return handleSearch(query.trim(), deepResearch)
}

/* ------------------------------------------------------------------ */
/*  POST — { query, deepResearch? }                                    */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, deepResearch } = body as {
      query: string
      deepResearch?: boolean
    }

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return corsResponse(
        { error: 'Query is required', code: 'MISSING_QUERY' } satisfies ErrorResponse,
        400
      )
    }

    return handleSearch(query.trim(), deepResearch === true)
  } catch {
    return corsResponse(
      { error: 'Invalid JSON body', code: 'INVALID_BODY' } satisfies ErrorResponse,
      400
    )
  }
}

/* ------------------------------------------------------------------ */
/*  Core search pipeline                                               */
/* ------------------------------------------------------------------ */

async function handleSearch(
  query: string,
  deepResearch: boolean
): Promise<NextResponse> {
  try {
    const user = await getSessionUser()
    const activeUserId = user ? user.id : 'local-user'

    const zai = await getZAI()
    const isDeep = deepResearch
    const startTime = Date.now()

    // ── Step 1: Search ──
    const processedQuery = preprocessQuery(query)
    const searchQuery = processedQuery !== query ? processedQuery : query
    const numResults = isDeep ? 10 : 6
    const sources = await webSearchFallback(searchQuery, numResults)

    // ── Step 2: Build prompt ──
    const systemPrompt = buildSystemPrompt({ sources, isDeep })

    const messages = [
      { role: 'assistant' as const, content: systemPrompt },
      { role: 'user' as const, content: query },
    ]

    // ── Step 3: Call LLM ──
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

    if (!llmSuccess) {
      return corsResponse(
        {
          error: 'AI service is temporarily unavailable. Please try again later.',
          code: 'LLM_ERROR',
        } satisfies ErrorResponse,
        503
      )
    }

    if (!fullAnswer) {
      return corsResponse(
        {
          error: 'Failed to generate a response. Please try again.',
          code: 'EMPTY_RESPONSE',
        } satisfies ErrorResponse,
        502
      )
    }

    // ── Step 4: Parse ──
    const { answerText, followUps } = parseFollowUps(fullAnswer, query)

    const slicedSources = sources.slice(0, isDeep ? 8 : 5)
    const responseSources = slicedSources.map((s) => ({
      title: s.title,
      url: s.url,
      snippet: s.snippet,
      relevance: computeRelevance(s.rank),
    }))

    // ── Step 5: Save to DB ──
    let conversationId = ''
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
      conversationId = newConv.id

      await db.message.create({
        data: { role: 'user', content: query, conversationId },
      })

      await db.message.create({
        data: {
          role: 'assistant',
          content: answerText,
          conversationId,
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
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })

      const duration = Date.now() - startTime
      await db.usageLog.create({
        data: {
          userId: activeUserId,
          type: 'search',
          sourceCount: sources.length,
          duration,
        },
      })
    } catch (dbErr) {
      const msg = dbErr instanceof Error ? dbErr.message : 'DB error'
      console.error('DB save error:', msg)
      conversationId = `local-${Date.now()}`
    }

    // ── Step 6: Return ──
    const responseBody: SearchResponseBody = {
      answer: answerText,
      sources: responseSources,
      followUps,
      conversationId,
      query,
    }

    return corsResponse(responseBody, 200, { 'Cache-Control': 'no-store' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Search API error:', msg)
    return corsResponse(
      {
        error: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR',
      } satisfies ErrorResponse,
      500
    )
  }
}
