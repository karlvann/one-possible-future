import { 
  createDirectus,
  staticToken,
  rest, 
  createItems, 
  createItem,
  deleteItems,
  readItems,
  updateItem
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
    // 1. Read and validate request body
    const body = await readBody(event)
    
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Request body is required'
      })
    }

    const { 
      email,
      cart,
      cartId
    } = body

    let cartIdResult = cartId

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart items are required'
      })
    }

    const existingCustomer = await client.request(
      readItems('customers', {
        filter: { 
          email: { 
            _eq: email
          }
        },
        limit: 1
      })
    )

    if (existingCustomer?.length > 0) {
      // console.log('Save cart: Customer already exists.')
      return false
    }

    if (!cartIdResult) {
      const existingCart = await client.request(
        readItems('carts', {
          filter: { 
            email: { 
              _eq: email
            }
          },
          limit: 1
        })
      )

      if (existingCart?.length > 0) {
        console.log('Save cart: Retreiving customer ID.')
        cartIdResult = existingCart[0].id
      }
    }

    // create or update carts record
    if (cartIdResult) {
      // update existing cart
      const updateCart = await client.request(
        updateItem('carts', cartIdResult, {
          email
        })
      )

      const m2mData = cart.map(item => ({
        carts_id: updateCart.id,
        skus_id: item.id,
        quantity: item.quantity
      }))

      // first clear existing relations
      // First, get the IDs of existing relations to delete
      const existingRelations = await client.request(
        readItems('carts_skus', {
          filter: {
            carts_id: {
              _eq: updateCart.id
            }
          },
          fields: ['id']
        })
      )

      // Delete existing relations if any exist
      if (existingRelations && existingRelations.length > 0) {
        const idsToDelete = existingRelations.map(rel => rel.id)
        await client.request(
          deleteItems('carts_skus', idsToDelete)
        )
      }

      // then create new relations
      await client.request(
        createItems('carts_skus', m2mData)
      )

      // console.log('Save cart: Updated.')

      return updateCart.id

    } else {
      // create new cart
      const newCart = await client.request(
        createItem('carts', {
          email
        })
      )

      const m2mData = cart.map(item => ({
        carts_id: newCart.id,
        skus_id: item.id,
        quantity: item.quantity
      }))

      await client.request(
        createItems('carts_skus', m2mData)
      )

      // console.log('Save cart: Saved.')

      return newCart.id
    }
    
  } catch (error) {
    console.log('Save cart error: ', error)
    return false
  }
})