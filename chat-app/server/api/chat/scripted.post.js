/**
 * Scripted Chat API Endpoint
 *
 * Handles off-script questions by:
 * 1. Fetching the knowledge base from /api/faq/combined
 * 2. Building context-aware system prompt
 * 3. Calling Claude 4.5 for intelligent response
 *
 * POST /api/chat/scripted
 * Body: {
 *   question: string,
 *   context: { weight, firmness, selectedProduct, currentState, hint },
 *   messages: [{ role, content }]  // conversation history
 * }
 * Returns: { answer: string }
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { question, context = {}, messages = [] } = body

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
    // Fetch the knowledge base
    const kbResponse = await $fetch('/api/faq/combined', {
      baseURL: getRequestURL(event).origin
    })

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context, kbResponse)

    // Build messages array for multi-turn conversation
    const apiMessages = buildMessages(messages, question)

    // Call Claude API
    // Note: Model and maxTokens can be configured in chat-config.js CLAUDE settings
    const response = await $fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: {
        model: 'claude-sonnet-4-20250514',  // Using Sonnet for cost efficiency
        max_tokens: 1024,
        messages: apiMessages,
        system: systemPrompt
      }
    })

    const answer = response.content?.[0]?.text || "Sorry, I couldn't generate a response."

    return { answer }

  } catch (error) {
    console.error('[Chat Scripted API] Error:', error.message)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process question'
    })
  }
})

/**
 * Build the system prompt with conversation context
 */
function buildSystemPrompt(context, knowledgeBase) {
  let prompt = `You are Karl from Ausbeds, an Australian mattress company based in Sydney. You've personally fitted 15,000+ customers in the showroom and built this AI to help customers online.

PERSONALITY:
- Conversational, friendly, and direct - like texting with a knowledgeable friend
- Keep responses SHORT (2-4 sentences max unless explaining something complex)
- Use Australian English (colour, favour, etc.)
- Never be pushy or salesy - just helpful and honest

PRODUCT LINEUP (Queen prices):
• Cooper - $1,500 - Budget-friendly, firm surface feel
• Aurora - $2,450 - Most popular, balanced feel, 1,600 micro springs
• Cloud - $2,940 - Best for side sleepers, 3,200 micro springs, double the springs of Aurora

KEY FACTS:
• 4-month trial (120 nights) - full refund if not happy
• 2 free component swaps during trial
• Firmness adjustments available forever (not just trial)
• Components can be replaced individually (springs, latex)
• Latex never dips - we've never seen it fail
• Springs don't wear out - it's always foam that fails
• Weight-matched firmness system (levels 6-10)

FIRMNESS GUIDE:
• Under 65kg: Level 6-7 (Medium)
• 66-80kg: Level 8 (Firm)
• 81-110kg: Level 9 (Firmer)
• 111kg+: Level 10 (Extra Firm)

CONTACT:
• Showroom: 19 Sydenham Road, Brookvale NSW (by appointment)
• Phone: (02) 8999 3333
• WhatsApp: +61 450 606 589

IMPORTANT RULES:
1. Answer questions using the knowledge base below
2. If you don't know something, say so - suggest calling (02) 8999 3333
3. After answering, gently guide back to the sales flow if appropriate
4. Never make up prices or features not in the knowledge base
5. All prices mentioned should be Queen size unless asked otherwise`

  // Add conversation context
  if (context.weight || context.firmness || context.selectedProduct) {
    prompt += `\n\nCURRENT CONVERSATION CONTEXT:`

    if (context.weight) {
      prompt += `\n• Customer weight: ${context.weight}kg`
    }
    if (context.firmness) {
      prompt += `\n• Recommended firmness: Level ${context.firmness.level} (${context.firmness.name})`
    }
    if (context.selectedProduct) {
      prompt += `\n• Selected product: ${context.selectedProduct.name}`
    }
    if (context.currentState) {
      prompt += `\n• Conversation stage: ${context.currentState}`
    }
  }

  // Add hint for specific handling
  if (context.hint) {
    prompt += `\n\nNOTE: ${context.hint}`
  }

  // Add knowledge base
  prompt += `\n\n---\n\nKNOWLEDGE BASE:\n${knowledgeBase}`

  return prompt
}

/**
 * Build messages array for Claude API
 * Includes recent conversation history for context
 */
function buildMessages(history, currentQuestion) {
  const messages = []

  // Include last 6 messages for context (3 exchanges)
  const recentHistory = history.slice(-6)

  for (const msg of recentHistory) {
    // Skip if this is the current question (we'll add it separately)
    if (msg.content === currentQuestion && msg.role === 'user') {
      continue
    }

    messages.push({
      role: msg.role,
      content: msg.content
    })
  }

  // Add current question
  messages.push({
    role: 'user',
    content: currentQuestion
  })

  return messages
}
