/**
 * Chat API Endpoint
 *
 * Answers questions using the full Ausbeds knowledge base.
 *
 * Flow:
 * 1. Fetch /kb (full KB markdown)
 * 2. Send question + KB to Claude
 * 3. Return answer
 *
 * POST /api/chat
 * Body: { question: string }
 * Returns: { answer: string }
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { question } = body

  if (!question?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Question is required'
    })
  }

  const config = useRuntimeConfig()

  // Check for API key
  if (!config.anthropicApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ANTHROPIC_API_KEY not configured'
    })
  }

  try {
    // Fetch the full knowledge base
    const kbResponse = await $fetch('/kb', {
      baseURL: getRequestURL(event).origin
    })

    // Build the prompt
    const systemPrompt = `You are a helpful customer service assistant for Ausbeds, an Australian mattress company based in Sydney.

Use ONLY the knowledge base below to answer questions. If the answer isn't in the knowledge base, say you don't have that information and suggest calling (02) 8999 3333 or WhatsApp +61 450 606 589.

Be concise, friendly, and helpful. Use Australian English (colour, favour, etc).

If asked about pricing, always mention they can get an exact quote by providing their address on the product page.

KNOWLEDGE BASE:
${kbResponse}`

    const userPrompt = question

    // Call Claude API
    const response = await $fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: userPrompt }
        ],
        system: systemPrompt
      }
    })

    const answer = response.content?.[0]?.text || 'Sorry, I couldn\'t generate a response.'

    return { answer }

  } catch (error) {
    console.error('[Chat API] Error:', error.message)

    // Don't expose internal errors to client
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process question'
    })
  }
})
