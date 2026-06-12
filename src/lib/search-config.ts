/* ------------------------------------------------------------------ */
/*  search-config.ts — Shared search pipeline utilities                */
/*  Eliminates duplication between chat/route.ts and search/route.ts   */
/* ------------------------------------------------------------------ */

export interface SearchSource {
  title: string
  url: string
  snippet: string
  favicon: string
  host_name: string
  domain: string
  rank: number
}

/* ------------------------------------------------------------------ */
/*  LLM Model Configuration                                            */
/* ------------------------------------------------------------------ */

/**
 * Read from LLM_MODELS env var (comma-separated) or use defaults.
 */
export function getLLMModels(fallbackModel?: string): string[] {
  const envModels = process.env.LLM_MODELS
  if (envModels) {
    return envModels.split(',').map((m) => m.trim()).filter(Boolean)
  }
  return [
    'google/gemini-2.5-flash',
    'meta-llama/llama-3.3-70b-instruct',
    fallbackModel || 'openrouter/owl-alpha',
  ]
}

/* ------------------------------------------------------------------ */
/*  Async Utilities                                                    */
/* ------------------------------------------------------------------ */

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    promise.then(
      (v) => { clearTimeout(timer); resolve(v) },
      (e) => { clearTimeout(timer); reject(e) }
    )
  })
}

export async function retryWithBackoff<T>(
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

/* ------------------------------------------------------------------ */
/*  Web Search Fallback (DuckDuckGo HTML scraper)                      */
/* ------------------------------------------------------------------ */

export async function webSearchFallback(
  query: string,
  num: number = 6
): Promise<SearchSource[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  try {
    const res = await withTimeout(
      fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      }),
      8000
    )

    if (!res.ok) {
      console.warn(`DuckDuckGo fallback status: ${res.status}`)
      return []
    }

    const html = await res.text()
    const regex =
      /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g
    const results: SearchSource[] = []
    let match
    let rank = 1

    while ((match = regex.exec(html)) !== null && results.length < num) {
      let link = match[1]
      if (link.includes('uddg=')) {
        const parts = link.split('uddg=')
        link = decodeURIComponent(parts[1].split('&')[0])
      }

      const title = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      const snippet = match[3].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

      let hostname = ''
      try {
        hostname = new URL(link).hostname.replace('www.', '')
      } catch {
        hostname = 'web'
      }

      results.push({
        title,
        url: link,
        snippet,
        favicon: `https://external-content.duckduckgo.com/ip3/${hostname}.ico`,
        host_name: hostname,
        domain: hostname,
        rank: rank++,
      })
    }
    return results
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('DuckDuckGo search failed:', msg)
    return []
  }
}

/* ------------------------------------------------------------------ */
/*  Query Preprocessing (Indian context)                               */
/* ------------------------------------------------------------------ */

export function preprocessQuery(q: string): string {
  const currencyPattern =
    /\b(under|below|within|around|about|less than|upto|up to)\s*(₹|rs\.?|inr)?\s*(\d+)\s*k\b/i
  const explicitCurrencyPattern = /\b(\d+)\s*k\s*(rupees|inr|rs\.?|₹)/i
  const pricePattern =
    /\b(under|below|within|less than|upto|up to|around|about)\s*(₹|rs\.?|inr)?\s*(\d{3,6})\b/i
  const indianTerms = /\b(rupees|inr|₹|rs\.|lakh|lakhs|crore|crores)\b/i
  const productQuery =
    /\b(buy|best|top|cheapest|affordable|budget|price|cost|deal|offer|review|compare)\b/i
  const productItem =
    /\b(phone|laptop|headphone|earphone|earbud|tablet|camera|tv|monitor|watch|router|speaker|charger|powerbank|mic|keyboard|mouse|printer|fridge|ac|washing machine|microwave|gadget|device)\b/i

  const hasCurrencyMatch = currencyPattern.test(q) || explicitCurrencyPattern.test(q)
  const hasPriceMatch = pricePattern.test(q)
  const hasIndianTerms = indianTerms.test(q)
  const isProductQuery = productQuery.test(q) && productItem.test(q)
  const alreadyIndia = /\b(india|indian|inr|₹|amazon\.in|flipkart)\b/i.test(q)

  if (alreadyIndia) return q

  let processed = q.replace(/\b(\d+)k\b/gi, (_match, num) => `${num}000`)

  if (hasCurrencyMatch || hasPriceMatch || hasIndianTerms || isProductQuery) {
    processed = `${processed} in India`
  }

  return processed
}

/* ------------------------------------------------------------------ */
/*  System Prompt Builder                                              */
/* ------------------------------------------------------------------ */

export function buildSystemPrompt(opts: {
  sources: SearchSource[]
  isDeep: boolean
  pageContents?: string[]
}): string {
  const { sources, isDeep, pageContents = [] } = opts

  const searchContext = sources
    .slice(0, isDeep ? 8 : 5)
    .map((s, i) => `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.snippet}`)
    .join('\n\n')

  const pageContext =
    pageContents.length > 0
      ? `\n\nAdditional extracted content:\n${pageContents.map((c, i) => `--- Page ${i + 1} ---\n${c}`).join('\n\n')}`
      : ''

  const deepInstructions = isDeep
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

  const sourcesBlock =
    sources.length > 0
      ? `SOURCES:\n${searchContext}\n${pageContext}`
      : 'No web sources were found. Answer from your general knowledge but note that you could not verify with web sources.'

  return `You are Nexus AI, an AI research assistant built for Indian users. You provide accurate, well-structured answers with inline citations.

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
${deepInstructions}

${sourcesBlock}`
}

/* ------------------------------------------------------------------ */
/*  Follow-up question parser                                          */
/* ------------------------------------------------------------------ */

export function parseFollowUps(
  fullAnswer: string,
  query: string
): { answerText: string; followUps: string[] } {
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

  return { answerText, followUps }
}
