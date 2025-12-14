export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const body = await readBody(event)

    const { 
      orderId
    } = body

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Zip-Version': '2021-08-25',
        'content-type': 'application/json',
        Authorization: `Bearer ${config.zipPrivateKey}`
      }
    }
    
    const zipCheckout = await $fetch(`${config.public.zipApiUrl}/checkouts/${orderId}`, options)
    console.log('Zip capture response:', zipCheckout)
    return zipCheckout

  } catch (error) {
    console.error('Failed to retrieve charge: ', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to retrieve charge'
    })
  }
})
