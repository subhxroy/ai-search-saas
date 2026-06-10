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
  rank: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, conversationId } = body as {
      query: string
      conversationId?: string
    }

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const zai = await getZAI()

    // Step 1: Search the web
    const searchResults = await zai.functions.invoke('web_search', {
      query: query.trim(),
      num: 8,
    })

    const sources: SearchSource[] = (searchResults || []).map(
      (r: Record<string, unknown>, i: number) => ({
        title: (r.name as string) || '',
        url: (r.url as string) || '',
        snippet: (r.snippet as string) || '',
        favicon: (r.favicon as string) || '',
        host_name: (r.host_name as string) || '',
        rank: i + 1,
      })
    )

    // Step 2: Read top 3 pages IN PARALLEL for richer context
    const topUrls = sources.slice(0, 3).map((s) => s.url)
    const pageResults = await Promise.allSettled(
      topUrls.map(async (url) => {
        try {
          const pageResult = await zai.functions.invoke('page_reader', { url })
          if (pageResult?.data?.html) {
            return (pageResult.data.html as string)
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 2000)
          }
        } catch {
          // Skip
        }
        return null
      })
    )
    const pageContents = pageResults
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter((c): c is string => c !== null && c.length > 0)

    // Step 3: Build context for LLM
    const searchContext = sources
      .slice(0, 6)
      .map(
        (s, i) =>
          `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.snippet}`
      )
      .join('\n\n')

    const pageContext =
      pageContents.length > 0
        ? `\n\nAdditional extracted content:\n${pageContents.map((c, i) => `--- Page ${i + 1} ---\n${c}`).join('\n\n')}`
        : ''

    // Step 4: Get conversation history if exists
    let conversation = conversationId
      ? await db.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        })
      : null

    const historyMessages =
      conversation?.messages
        ?.filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-8)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })) || []

    // Step 5: Build messages for LLM
    const systemPrompt = `You are an AI research assistant similar to Perplexity. You provide accurate, well-structured answers with inline citations.

RULES:
1. Always cite your sources using [1], [2], [3] etc. format in your answer.
2. The citation numbers correspond to the source numbers provided below.
3. Be comprehensive but concise.
4. Structure your answer with clear sections using markdown.
5. If multiple sources support a claim, cite all relevant sources.
6. At the end of your answer, always generate exactly 3 follow-up questions that the user might want to ask next.
7. Format the follow-up questions EXACTLY like this at the very end of your response:

---
**Related Questions:**
1. [First follow-up question]
2. [Second follow-up question]
3. [Third follow-up question]

SOURCES:
${searchContext}
${pageContext}`

    const messages = [
      { role: 'assistant' as const, content: systemPrompt },
      ...historyMessages,
      { role: 'user' as const, content: query },
    ]

    // Step 6: Call LLM
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    })

    const fullAnswer =
      completion.choices?.[0]?.message?.content ||
      'I was unable to generate a response. Please try again.'

    // Step 7: Parse follow-up questions from response
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

    // Ensure we always have follow-ups
    if (followUps.length === 0) {
      followUps = [
        `Tell me more about ${query.split(' ').slice(0, 5).join(' ')}`,
        'What are the latest developments on this topic?',
        'Can you compare different perspectives on this?',
      ]
    }

    // Step 8: Create conversation if needed
    if (!conversation) {
      const title =
        query.length > 60 ? query.slice(0, 57) + '...' : query
      conversation = await db.conversation.create({
        data: { title },
      })
    }

    // Step 9: Stream the response back, then save to DB
    const conversationId_ = conversation.id
    const sources_ = sources.slice(0, 6)
    const answerText_ = answerText
    const followUps_ = followUps

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // First send sources
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'sources', data: sources_ })}\n\n`
          )
        )

        // Stream the answer word by word for typewriter effect
        const words = answerText_.split(' ')
        for (let i = 0; i < words.length; i++) {
          const word = i === 0 ? words[i] : ' ' + words[i]
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'token', data: word })}\n\n`
            )
          )
          // Small delay for typewriter effect
          await new Promise((resolve) => setTimeout(resolve, 12))
        }

        // Send follow-ups
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'followups', data: followUps_ })}\n\n`
          )
        )

        // Send completion signal
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'done',
              data: {
                conversationId: conversationId_,
              },
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
