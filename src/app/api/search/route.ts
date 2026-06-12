import { NextRequest, NextResponse } from 'next/server'
import { getZAI } from '@/lib/zai'
import { db } from '@/lib/db'

export const maxDuration = 60

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SearchSource {
  title: string
  url: string
  snippet: string
  favicon: string
  host_name: string
  domain: string
  rank: number
}

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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    promise.then(
      (v) => { clearTimeout(timer); resolve(v) },
      (e) => { clearTimeout(timer); reject(e) }
    )
  })
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 2,
  baseDelay = 1000
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, baseDelay * (attempt + 1)))
      }
    }
  }
  throw lastError
}

async function webSearchFallback(query: string, num: number = 6): Promise<SearchSource[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const res = await withTimeout(
      fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }),
      8000
    );
    
    if (!res.ok) {
      console.warn(`DuckDuckGo fallback status: ${res.status}`);
      return [];
    }
    
    const html = await res.text();
    const regex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    const results: SearchSource[] = [];
    let match;
    let rank = 1;
    
    while ((match = regex.exec(html)) !== null && results.length < num) {
      let link = match[1];
      if (link.includes('uddg=')) {
        const parts = link.split('uddg=');
        link = decodeURIComponent(parts[1].split('&')[0]);
      }
      
      const title = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const snippet = match[3].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      
      let hostname = '';
      try {
        hostname = new URL(link).hostname.replace('www.', '');
      } catch {
        hostname = 'web';
      }
      
      results.push({
        title,
        url: link,
        snippet,
        favicon: `https://external-content.duckduckgo.com/ip3/${hostname}.ico`,
        host_name: hostname,
        domain: hostname,
        rank: rank++,
      });
    }
    return results;
  } catch (err) {
    console.error('DuckDuckGo fallback search failed:', err);
    return [];
  }
}

function preprocessQuery(q: string): string {
  // Pattern: "under 1k", "below 2k", "within 5k", "under 10k", etc.
  const currencyPattern = /\b(under|below|within|under|around|about|less than|upto|up to|within)\s*(₹|rs\.?|inr)?\s*(\d+)\s*k\b/i
  // Pattern: "1k rupees", "2k inr", "5k rs"
  const explicitCurrencyPattern = /\b(\d+)\s*k\s*(rupees|inr|rs\.?|₹)/i
  // Pattern: "under 1000", "below 5000" with Indian market context
  const pricePattern = /\b(under|below|within|less than|upto|up to|around|about)\s*(₹|rs\.?|inr)?\s*(\d{3,6})\b/i
  // Pattern: Indian terms
  const indianTerms = /\b(rupees|inr|₹|rs\.|lakh|lakhs|crore|crores)\b/i
  // Pattern: "best headphones", "laptop", "phone" etc. - product queries that might need India context
  const productQuery = /\b(buy|best|top|cheapest|affordable|budget|price|cost|deal|offer|review|compare)\b/i
  const productItem = /\b(phone|laptop|headphone|earphone|earbud|tablet|camera|tv|monitor|watch|router|speaker|charger|powerbank|mic|keyboard|mouse|printer|fridge|ac|washing machine|microwave|gadget|device)\b/i

  const hasCurrencyMatch = currencyPattern.test(q) || explicitCurrencyPattern.test(q)
  const hasPriceMatch = pricePattern.test(q)
  const hasIndianTerms = indianTerms.test(q)
  const isProductQuery = productQuery.test(q) && productItem.test(q)

  // If the query already mentions India/INR explicitly, don't add it again
  const alreadyIndia = /\b(india|indian|inr|₹|amazon\.in|flipkart)\b/i.test(q)

  if (alreadyIndia) return q

  // Expand "k" suffix to full number with INR context
  let processed = q.replace(/\b(\d+)k\b/gi, (_match, num) => {
    return `${num}000`
  })

  // Add India context for currency/price/product queries
  if (hasCurrencyMatch || hasPriceMatch || hasIndianTerms || isProductQuery) {
    processed = `${processed} in India`
  }

  return processed
}

function computeRelevance(rank: number): number {
  // 1st = 0.95, 2nd = 0.90, decreasing by 0.05, minimum 0.05
  return Math.max(0.05, +(1.0 - rank * 0.05).toFixed(2))
}

/* ------------------------------------------------------------------ */
/*  CORS Headers                                                       */
/* ------------------------------------------------------------------ */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
}

function corsResponse(body: unknown, status: number, extraHeaders?: Record<string, string>): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  })
}

/* ------------------------------------------------------------------ */
/*  OPTIONS — preflight                                                */
/* ------------------------------------------------------------------ */

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
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
/*  POST — { query, deepResearch?, apiKey? }                           */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, deepResearch, apiKey } = body as {
      query: string
      deepResearch?: boolean
      apiKey?: string
    }

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return corsResponse(
        { error: 'Query is required', code: 'MISSING_QUERY' } satisfies ErrorResponse,
        400
      )
    }

    // apiKey is accepted but currently not validated (future: API key auth)
    void apiKey

    return handleSearch(query.trim(), deepResearch === true)
  } catch {
    return corsResponse(
      { error: 'Invalid JSON body', code: 'INVALID_BODY' } satisfies ErrorResponse,
      400
    )
  }
}

/* ------------------------------------------------------------------ */
/*  Core search pipeline (shared by GET & POST)                        */
/* ------------------------------------------------------------------ */

async function handleSearch(
  query: string,
  deepResearch: boolean
): Promise<NextResponse> {
  try {
    const zai = await getZAI()
    const isDeep = deepResearch

    const startTime = Date.now()

    // ── Step 1: Preprocess query for Indian context ──
    const processedQuery = preprocessQuery(query)
    const searchQuery = processedQuery !== query ? processedQuery : query

    const numResults = isDeep ? 10 : 6
    // Directly run DuckDuckGo fallback search since ZAI web_search always returns 404 on OpenRouter
    const sources = await webSearchFallback(searchQuery, numResults)

    // Skip page reader step to avoid 404 timeouts, using snippets directly
    const pageContents: string[] = []

    // ── Step 4: Build context ──
    const searchContext = sources
      .slice(0, isDeep ? 8 : 5)
      .map(
        (s, i) =>
          `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.snippet}`
      )
      .join('\n\n')

    const pageContext =
      pageContents.length > 0
        ? `\n\nAdditional extracted content:\n${pageContents.map((c, i) => `--- Page ${i + 1} ---\n${c}`).join('\n\n')}`
        : ''

    // ── Step 5: Build system prompt ──
    const deepResearchInstructions = isDeep
      ? `
DEEP RESEARCH MODE ACTIVE:
- Perform a thorough, comprehensive analysis.
- Cover multiple viewpoints and perspectives.
- Include supporting evidence for each claim.
- Structure your answer with clear sections: Overview, Key Findings, Different Perspectives, Implications, Conclusion.
- Be detailed and academic in tone.
- Cross-reference multiple sources when possible.
- Highlight any contradictions between sources.`
      : ''

    const sourcesBlock = sources.length > 0
      ? `SOURCES:\n${searchContext}\n${pageContext}`
      : 'No web sources were found. Answer from your general knowledge but note that you could not verify with web sources.'

    const systemPrompt = `You are Nexus AI, an AI research assistant built for Indian users. You provide accurate, well-structured answers with inline citations.

CRITICAL CONTEXT — YOU ARE SERVING INDIAN USERS:
- The default currency is Indian Rupee (INR, ₹). When users say "1k", "2k", "5k", "10k", "15k", "20k", "25k", "50k", "1L", etc., they mean ₹1,000, ₹2,000, ₹5,000, ₹10,000, ₹15,000, ₹20,000, ₹25,000, ₹50,000, ₹1,00,000 (₹1 Lakh) respectively.
- "k" = thousand (1k = ₹1,000), "L" or "lakh" = lakh (1L = ₹1,00,000)
- Always interpret prices in INR unless the user explicitly mentions USD, dollars, or another currency.
- When recommending products, prioritize options available in the Indian market (Amazon.in, Flipkart, Croma, Reliance Digital, etc.).
- Show prices in ₹ (Indian Rupees) format.
- When mentioning prices from international sources, convert to approximate INR (use approximate rate: $1 ≈ ₹83).
- Use Indian English conventions (e.g., "lakh", "crore" when appropriate).

RULES:
1. Always cite your sources using [1], [2], [3] etc. format in your answer.
2. The citation numbers correspond to the source numbers provided below.
3. Be comprehensive but concise. Write in a clear, helpful style.
4. Structure your answer with clear sections using markdown.
5. If multiple sources support a claim, cite all relevant sources.
6. Do not invent facts not supported by the provided sources.
7. Maintain a useful research tone — like a knowledgeable colleague.
8. At the end of your answer, always generate exactly 3 follow-up questions.
9. Format the follow-up questions EXACTLY like this at the very end:

---
**Related Questions:**
1. [First follow-up question]
2. [Second follow-up question]
3. [Third follow-up question]
${deepResearchInstructions}

${sourcesBlock}`

    const messages = [
      { role: 'assistant' as const, content: systemPrompt },
      { role: 'user' as const, content: query },
    ]

    // ── Step 6: Call LLM (with fallback models & retry) — NON-STREAMING ──
    let fullAnswer = ''
    // Prioritize fast, high-quality models first (Gemini 2.5 flash is extremely fast on OpenRouter)
    const modelsToTry = [
      'google/gemini-2.5-flash',
      'meta-llama/llama-3.3-70b-instruct',
      zai.config.defaultModel || 'openrouter/owl-alpha'
    ]

    let llmSuccess = false
    let lastLlmError: any = null

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
        console.warn(`LLM call failed for model ${modelName}:`, err)
        lastLlmError = err
      }
    }

    if (!llmSuccess) {
      console.error('All LLM models failed after retries:', lastLlmError)
      return corsResponse(
        { error: 'AI service is temporarily unavailable. Please try again later.', code: 'LLM_ERROR' } satisfies ErrorResponse,
        503
      )
    }

    if (!fullAnswer) {
      return corsResponse(
        { error: 'Failed to generate a response. Please try again.', code: 'EMPTY_RESPONSE' } satisfies ErrorResponse,
        502
      )
    }

    // ── Step 7: Parse follow-up questions ──
    let answerText = fullAnswer
    let followUps: string[] = []

    const followUpMatch = fullAnswer.match(
      /\*\*Related Questions:\*\*\s*\n([\s\S]*?)$/
    )
    if (followUpMatch) {
      answerText = fullAnswer.slice(0, followUpMatch.index).trim()
      const questions = followUpMatch[1]
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
        .filter((q: string) => q.length > 0)
      followUps = questions.slice(0, 3)
    }

    if (followUps.length === 0) {
      followUps = [
        `What are the latest developments regarding ${query.split(' ').slice(0, 5).join(' ')}?`,
        'Can you compare different perspectives on this topic?',
        'What should I explore next related to this?',
      ]
    }

    // ── Step 8: Build response sources with relevance ──
    const responseSources = sources.slice(0, isDeep ? 8 : 5).map((s) => ({
      title: s.title,
      url: s.url,
      snippet: s.snippet,
      relevance: computeRelevance(s.rank),
    }))

    // ── Step 9: Create conversation and save to DB ──
    let conversationId = ''
    try {
      const title = query.length > 60 ? query.slice(0, 57) + '...' : query
      // Ensure local-user exists for foreign key constraints in PostgreSQL
      await db.user.upsert({
        where: { id: 'local-user' },
        update: {},
        create: {
          id: 'local-user',
          email: 'local@nexus.ai',
          name: 'Local User',
        }
      })
      const newConv = await db.conversation.create({
        data: {
          title,
          userId: 'local-user',
          isDeepResearch: isDeep,
          researchStatus: 'completed',
        },
      })
      conversationId = newConv.id

      // Save user message
      await db.message.create({
        data: {
          role: 'user',
          content: query,
          conversationId,
        },
      })

      // Save assistant message with sources
      await db.message.create({
        data: {
          role: 'assistant',
          content: answerText,
          conversationId,
          followUps: JSON.stringify(followUps),
          sources: {
            create: sources.slice(0, isDeep ? 8 : 5).map((s) => ({
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

      // Update conversation timestamp
      await db.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })

      // Log usage
      const duration = Date.now() - startTime
      await db.usageLog.create({
        data: {
          userId: 'local-user',
          type: 'search',
          sourceCount: sources.length,
          duration,
        },
      })
    } catch (dbErr) {
      console.error('DB save error:', dbErr)
      conversationId = `local-${Date.now()}`
    }

    // ── Step 10: Return structured JSON ──
    const responseBody: SearchResponseBody = {
      answer: answerText,
      sources: responseSources,
      followUps,
      conversationId,
      query,
    }

    return corsResponse(responseBody, 200, {
      'Cache-Control': 'no-store',
    })
  } catch (error) {
    console.error('Search API error:', error)
    return corsResponse(
      { error: 'An unexpected error occurred. Please try again.', code: 'INTERNAL_ERROR' } satisfies ErrorResponse,
      500
    )
  }
}
