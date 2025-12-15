/**
 * Debug endpoint to see what Notion sends
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const query = getQuery(event)
  const headers = getHeaders(event)

  console.log('[Debug Webhook] Headers:', JSON.stringify(headers, null, 2))
  console.log('[Debug Webhook] Query:', JSON.stringify(query, null, 2))
  console.log('[Debug Webhook] Body:', JSON.stringify(body, null, 2))

  return {
    received: true,
    timestamp: new Date().toISOString(),
    query,
    body,
    headers: {
      'content-type': headers['content-type'],
      'user-agent': headers['user-agent']
    }
  }
})
