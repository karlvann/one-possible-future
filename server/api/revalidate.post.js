/**
 * On-Demand ISR Revalidation API (v2)
 *
 * Triggers Vercel's on-demand ISR revalidation for specific paths.
 * Works by sending a HEAD request with x-prerender-revalidate header.
 *
 * Usage:
 * POST /api/revalidate
 * Body: { "path": "/guides/article-slug", "secret": "your-secret" }
 *
 * Or from Notion webhook (guides):
 * POST /api/revalidate?secret=your-secret&type=guides
 *
 * Or from Notion webhook (faq):
 * POST /api/revalidate?secret=your-secret&type=faq
 *
 * Environment variables required:
 * - REVALIDATE_SECRET: Secret to authenticate requests
 * - VERCEL_BYPASS_TOKEN: Token configured in Nitro for ISR bypass
 */

// Helper function to revalidate a single path
async function revalidatePath(baseUrl, path, bypassToken) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const revalidateUrl = `${baseUrl}${normalizedPath}`

  console.log(`[Revalidate] Triggering revalidation for: ${revalidateUrl}`)

  const response = await fetch(revalidateUrl, {
    method: 'HEAD',
    headers: {
      'x-prerender-revalidate': bypassToken
    }
  })

  const cacheStatus = response.headers.get('x-vercel-cache')
  const wasRevalidated = cacheStatus === 'REVALIDATED'

  console.log(`[Revalidate] ${normalizedPath} - Status: ${response.status}, Cache: ${cacheStatus}`)

  return {
    path: normalizedPath,
    status: response.status,
    cacheStatus: cacheStatus || 'unknown',
    revalidated: wasRevalidated
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Get params from body or query (Notion webhooks use POST body)
  const body = await readBody(event).catch(() => null) || {}
  const query = getQuery(event)

  const secret = body.secret || query.secret
  const path = body.path || query.path
  const type = body.type || query.type // 'guides' or 'faq'

  // Support Notion's webhook format - extract Slug property
  // Notion sends: { "data": { "properties": { "Slug": { "rich_text": [{ "plain_text": "my-article" }] } } } }
  const notionSlug = body?.data?.properties?.Slug?.rich_text?.[0]?.plain_text

  // Log incoming payload for debugging
  console.log('[Revalidate] Incoming body:', JSON.stringify(body, null, 2))
  console.log('[Revalidate] Type:', type, 'Slug:', notionSlug)

  // Verify secret
  if (secret !== config.revalidateSecret) {
    console.error('[Revalidate] Invalid secret provided')
    throw createError({
      statusCode: 401,
      message: 'Invalid secret'
    })
  }

  // Validate bypass token is configured (trim to handle env var whitespace/newlines)
  const bypassToken = config.vercelBypassToken?.trim()
  if (!bypassToken) {
    console.error('[Revalidate] VERCEL_BYPASS_TOKEN not configured')
    throw createError({
      statusCode: 500,
      message: 'Server configuration error: bypass token not set'
    })
  }

  // Build base URL from request
  const requestUrl = getRequestURL(event)
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`

  // Determine paths to revalidate based on type
  let pathsToRevalidate = []

  if (type === 'faq') {
    // FAQ: revalidate the article pages, raw pages, and index/API
    if (notionSlug) {
      pathsToRevalidate.push(`/faq/${notionSlug}`)
      pathsToRevalidate.push(`/raw/${notionSlug}`)
    }
    // Always revalidate FAQ index, KB, and all marketing pages
    pathsToRevalidate.push('/faq')
    pathsToRevalidate.push('/kb')
    pathsToRevalidate.push('/raw/combined-knowledge')
    // Marketing pages with FAQ dropdowns - add new pages here
    const marketingPages = ['/delivery']
    pathsToRevalidate.push(...marketingPages)
    // Note: API routes don't need ISR revalidation - they fetch fresh from Notion
  } else if (type === 'guides' || notionSlug) {
    // Guides: revalidate the single article page
    const guidesPath = path || (notionSlug ? `/guides/${notionSlug}` : null)
    if (guidesPath) {
      pathsToRevalidate.push(guidesPath)
    }
  } else if (path) {
    // Direct path provided
    pathsToRevalidate.push(path)
  }

  // Validate we have paths to revalidate
  if (pathsToRevalidate.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Missing path or type parameter. Provide path, or type with slug from Notion.'
    })
  }

  try {
    // Revalidate all paths
    const results = await Promise.all(
      pathsToRevalidate.map(p => revalidatePath(baseUrl, p, bypassToken))
    )

    const allRevalidated = results.every(r => r.revalidated)
    const anyRevalidated = results.some(r => r.revalidated)

    console.log(`[Revalidate] Completed. ${results.filter(r => r.revalidated).length}/${results.length} paths revalidated`)

    // Re-ingest KB to Ragie after FAQ revalidation
    let ragieResult = null
    if (type === 'faq' && config.ragieApiKey) {
      const ragieDocId = '16248a9c-bcbf-4a65-9456-402e6bfd2dd0'
      try {
        const ragieResponse = await fetch(`https://api.ragie.ai/documents/${ragieDocId}/url`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${config.ragieApiKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: `${baseUrl}/kb` })
        })
        ragieResult = { status: ragieResponse.status, ok: ragieResponse.ok }
        console.log(`[Revalidate] Ragie re-ingest: ${ragieResponse.status} ${ragieResponse.ok ? 'OK' : 'FAILED'}`)
      } catch (ragieError) {
        ragieResult = { error: ragieError.message }
        console.error(`[Revalidate] Ragie re-ingest failed: ${ragieError.message}`)
      }
    }

    return {
      success: true,
      revalidated: allRevalidated,
      partiallyRevalidated: anyRevalidated && !allRevalidated,
      results,
      ragie: ragieResult,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('[Revalidate] Error:', error.message)
    throw createError({
      statusCode: 500,
      message: `Failed to revalidate: ${error.message}`
    })
  }
})
