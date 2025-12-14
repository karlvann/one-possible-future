export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)

    const { 
      customer, 
      total,
      zipCartItems
    } = body

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Zip-Version': '2021-08-25',
        'content-type': 'application/json',
        Authorization: `Bearer ${config.zipPrivateKey}`
      },
      body: JSON.stringify({
        shopper: {
          first_name: customer.first_name || '',
          last_name: customer.last_name || '',
          phone: customer.phone || '',
          email: customer.email || '',
        },
        order: {
          amount: total,
          currency: 'AUD',
          items: zipCartItems
        },
        config: {
          redirect_uri: `https://ausbeds.com.au/checkout`
        }
      })
    }
    
    const zipCheckout = await $fetch(`${config.public.zipApiUrl}/checkouts`, options)
    return zipCheckout

  } catch (error) {
    console.error('Failed to create Zip checkout: ', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create Zip checkout'
    })
  }
})
