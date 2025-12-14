import { 
  createDirectus,
  staticToken,
  rest,
  readItems
} from '@directus/sdk'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Initialize Directus client early
  const directusUrl = config.public.directus.url
  const directusToken = config.directusToken
  
  const client = createDirectus(directusUrl)
    .with(staticToken(directusToken))
    .with(rest())

  try {

    const body = await readBody(event)
    
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Request body is required'
      })
    }

    const { 
      orderEmail,
      orderId
    } = body

    if (!orderEmail || !orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid parameters'
      })
    }

    const orders = await client.request(
      readItems('orders', {
        filter: { 
          order_number: { 
            _eq: orderId
          }
        },
        limit: 1,
        fields: ['id', 'customer.email']
      })
    )

    if (orders.length === 0) {
      return false
    }

    if (orders[0]?.customer?.email === orderEmail) {
      return true
    } else {
      return false
    }
    
  } catch (error) {
    console.error('Error checking order email:', error)

    // Generic error response
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error checking order email'
    })
  }
})