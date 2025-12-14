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

    const { 
      orderId
    } = body

    const existingPayment = await client.request(
      readItems('payments', {
        filter: { 
          transaction_id: { 
            _eq: orderId
          },
          payment_method: {
            _eq: 'zip'
          }
        },
        limit: 1
      })
    )

    // console.log('Existing Zip payment check:', existingPayment)
    if (existingPayment.length > 0) {
      return true
    } else {
      return false
    }

  } catch (error) {
    console.error('Failed to check Zip payment existence: ', error)
    return true // don't create the order if there's an error
  }
})