import { NextRequest } from 'next/server'
import { getZAI } from '@/lib/zai'
import { db } from '@/lib/db'

export const maxDuration = 60

interface SearchSource {
  title: string
  url: string
  snippet: string
  favicon: string
  host_name: string
  domain: string
  rank: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, conversationId, deepResearch } = body as {
      query: string
      conversationId?: string
      deepResearch?: boolean
    }

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const zai = await getZAI()
    const isDeep = deepResearch === true

    // ── Step 1: Web Search ──
    let sources: SearchSource[] = []
    try {
      const numResults = isDeep ? 12 : 8
      const searchResults = await zai.functions.invoke('web_search', {
        query: query.trim(),
        num: numResults,
      })

      sources = (searchResults || []).map(
        (r: Record<string, unknown>, i: number) => ({
          title: (r.name as string) || '',
          url: (r.url as string) || '',
          snippet: (r.snippet as string) || '',
          favicon: (r.favicon as string) || '',
          host_name: (r.host_name as string) || '',
          domain: (r.host_name as string) || (r.url ? new URL(r.url as string).hostname.replace('www.', '') : ''),
          rank: i + 1,
        })
      )
    } catch (searchErr) {
      console.error('Web search failed:', searchErr)
      // Continue without sources — the LLM can still answer
    }

    // ── Step 2: Read top pages (with aggressive error handling) ──
    const pageContents: string[] = []
    const topCount = isDeep ? 3 : 2
    const topUrls = sources.slice(0, topCount).map((s) => s.url)

    for (const url of topUrls) {
      try {
        const pageResult = await zai.functions.invoke('page_reader', { url })
        if (pageResult?.data?.html) {
          const text = (pageResult.data.html as string)
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, isDeep ? 3000 : 2000)
          if (text.length > 50) pageContents.push(text)
        }
        // Small delay between page reads
        await new Promise((r) => setTimeout(r, 300))
      } catch (pageErr) {
        // Silently skip failed page reads — this is expected
        console.warn('Page read failed for:', url, (pageErr as Error)?.message?.slice(0, 100))
      }
    }

    // ── Step 3: Build context ──
    const searchContext = sources
      .slice(0, isDeep ? 10 : 6)
      .map(
        (s, i) =>
          `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.snippet}`
      )
      .join('\n\n')

    const pageContext =
      pageContents.length > 0
        ? `\n\nAdditional extracted content:\n${pageContents.map((c, i) => `--- Page ${i + 1} ---\n${c}`).join('\n\n')}`
        : ''

    // ── Step 4: Get conversation history ──
    let conversation = null
    try {
      if (conversationId) {
        conversation = await db.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        })
      }
    } catch (dbErr) {
      console.warn('Failed to load conversation history:', dbErr)
    }

    const historyMessages =
      conversation?.messages
        ?.filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-8)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })) || []

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

    const systemPrompt = `You are Nexus AI, an AI research assistant. You provide accurate, well-structured answers with inline citations.

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
      ...historyMessages,
      { role: 'user' as const, content: query },
    ]

    // ── Step 6: Call LLM ──
    let fullAnswer: string
    try {
      const completion = await zai.chat.completions.create({
        messages,
        thinking: { type: 'disabled' },
      })
      fullAnswer = completion.choices?.[0]?.message?.content || ''
    } catch (llmErr) {
      console.error('LLM call failed:', llmErr)
      fullAnswer = 'I encountered an error generating a response. The AI service may be temporarily unavailable. Please try again.'
    }

    if (!fullAnswer) {
      fullAnswer = 'I was unable to generate a response. Please try again.'
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

    // ── Step 8: Create conversation if needed ──
    let conversationId_: string = conversation?.id || ''
    if (!conversation) {
      try {
        const title = query.length > 60 ? query.slice(0, 57) + '...' : query
        const newConv = await db.conversation.create({
          data: {
            title,
            userId: 'local-user',
            isDeepResearch: isDeep,
            researchStatus: 'completed',
          },
        })
        conversationId_ = newConv.id
      } catch (dbErr) {
        console.error('Failed to create conversation:', dbErr)
        conversationId_ = `local-${Date.now()}`
      }
    }

    // ── Step 9: Stream the response back ──
    const sources_ = sources.slice(0, isDeep ? 10 : 6)
    const answerText_ = answerText
    const followUps_ = followUps

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // Send sources first
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'sources', data: sources_ })}\n\n`
          )
        )

        // Stream answer word by word
        const words = answerText_.split(' ')
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
            `data: ${JSON.stringify({ type: 'followups', data: followUps_ })}\n\n`
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
              content: answerText_,
              conversationId: conversationId_,
              followUps: JSON.stringify(followUps_),
              sources: {
                create: sources_.map((s) => ({
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
          console.error('DB save error:', dbError)
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
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process your query' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
