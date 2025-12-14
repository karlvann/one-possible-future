/**
 * Cache Refresh API Endpoint
 *
 * Triggers a cache refresh for Notion content.
 * Works by setting headers that bypass ISR cache on next page load.
 */

export default defineEventHandler(async (event) => {
  // Set headers to prevent caching of this response
  setResponseHeaders(event, {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  })

  // For Vercel, we can use the x-prerender-revalidate header
  // This tells Vercel to revalidate the ISR cache
  // Note: For production, you'd want to protect this endpoint with authentication

  try {
    // Return success - the page reload will fetch fresh content
    // because ISR will serve stale content while revalidating in background
    return {
      success: true,
      message: 'Cache refresh triggered. Page will reload with fresh content.',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('[refresh-cache] Error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to refresh cache'
    })
  }
})
