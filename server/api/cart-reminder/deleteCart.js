import { 
  createDirectus,
  staticToken,
  rest,
  deleteItems
} from '@directus/sdk'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const directusUrl = config.public.directus.url
  const directusToken = config.directusToken
  
  const client = createDirectus(directusUrl)
    .with(staticToken(directusToken))
    .with(rest())

  try {
    // 1. Read and validate request body
    const body = await readBody(event)
    
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Request body is required'
      })
    }

    const { 
      email
    } = body

    await client.request(deleteItems('carts', {
      filter: { 
        email: { 
          _eq: email 
        } 
      }
    }))

    return true
    
  } catch (error) {
    console.log('Delete cart error: ', error)
    return false
  }
})