/**
 * On-Demand ISR Revalidation API
 *
 * Triggers Vercel's on-demand ISR revalidation for specific paths.
 * Works by sending a HEAD request with x-prerender-revalidate header.
 *
 * Usage:
 * POST /api/revalidate
 * Body: { "path": "/guides/article-slug", "secret": "your-secret" }
 *
 * Or from Notion webhook:
 * POST /api/revalidate?secret=your-secret&path=/guides/article-slug
 *
 * Environment variables required:
 * - REVALIDATE_SECRET: Secret to authenticate requests
 * - VERCEL_BYPASS_TOKEN: Token configured in Nitro for ISR bypass
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Get params from body or query (Notion webhooks use POST body)
  const body = await readBody(event).catch(() => ({}))
  const query = getQuery(event)

  const secret = body.secret || query.secret
  const path = body.path || query.path

  // Also support Notion's webhook format where path might be in a nested object
  const notionPath = body?.data?.path || body?.properties?.path?.rich_text?.[0]?.plain_text
  const finalPath = path || notionPath

  // Verify secret
  if (secret !== config.revalidateSecret) {
    console.error('[Revalidate] Invalid secret provided')
    throw createError({
      statusCode: 401,
      message: 'Invalid secret'
    })
  }

  // Validate path
  if (!finalPath) {
    throw createError({
      statusCode: 400,
      message: 'Missing path parameter. Provide path in body or query string.'
    })
  }

  // Validate bypass token is configured
  if (!config.vercelBypassToken) {
    console.error('[Revalidate] VERCEL_BYPASS_TOKEN not configured')
    throw createError({
      statusCode: 500,
      message: 'Server configuration error: bypass token not set'
    })
  }

  // Ensure path starts with /
  const normalizedPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`

  // Build full URL for the page
  const baseUrl = config.public.siteUrl || 'https://ausbeds.com.au'
  const revalidateUrl = `${baseUrl}${normalizedPath}`

  console.log(`[Revalidate] Triggering revalidation for: ${revalidateUrl}`)

  try {
    // Send HEAD request with x-prerender-revalidate header
    // This tells Vercel to revalidate the ISR cache for this path
    const response = await fetch(revalidateUrl, {
      method: 'HEAD',
      headers: {
        'x-prerender-revalidate': config.vercelBypassToken
      }
    })

    // Check for successful revalidation
    const cacheStatus = response.headers.get('x-vercel-cache')

    console.log(`[Revalidate] Response status: ${response.status}`)
    console.log(`[Revalidate] X-Vercel-Cache: ${cacheStatus}`)

    // REVALIDATED means cache was successfully purged and rebuilt
    const wasRevalidated = cacheStatus === 'REVALIDATED'

    if (wasRevalidated) {
      console.log(`[Revalidate] Successfully revalidated: ${normalizedPath}`)
    } else {
      console.log(`[Revalidate] Request sent but cache status was: ${cacheStatus}`)
      console.log('[Revalidate] Note: Cache may still be revalidated on next request')
    }

    return {
      success: true,
      revalidated: wasRevalidated,
      cacheStatus: cacheStatus || 'unknown',
      path: normalizedPath,
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
