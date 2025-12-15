/**
 * On-Demand ISR Revalidation API
 *
 * Purges Vercel's edge cache for specific paths, allowing
 * instant content updates from Notion without waiting for ISR expiry.
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
 * - VERCEL_TOKEN: Your Vercel API token
 * - VERCEL_PROJECT_ID: Your Vercel project ID
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

  // Ensure path starts with /
  const normalizedPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`

  console.log(`[Revalidate] Purging cache for: ${normalizedPath}`)

  try {
    // Call Vercel's purge cache API
    const response = await fetch(
      `https://api.vercel.com/v1/projects/${config.vercelProjectId}/purge-cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.vercelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paths: [normalizedPath]
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('[Revalidate] Vercel API error:', error)
      throw createError({
        statusCode: response.status,
        message: `Vercel API error: ${error}`
      })
    }

    const result = await response.json()

    console.log(`[Revalidate] Successfully purged: ${normalizedPath}`)

    return {
      success: true,
      revalidated: true,
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
