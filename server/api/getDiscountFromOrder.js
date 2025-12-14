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
      orderId
    } = body

    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid parameters'
      })
    }

    const order = await client.request(
      readItems('orders', {
        filter: { 
          order_number: { 
            _eq: orderId
          }
        },
        limit: 1,
        fields: ['discount']
      })
    ).then(res => res[0] || null)

    if (!order || !order?.discount) {
      return 0
    }

    return parseInt(order.discount) || 0
    
  } catch (error) {
    console.error('Error getting discount:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error getting discount'
    })
  }
})