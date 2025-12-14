import {
  createDirectus,
  staticToken,
  rest,
  readItems
} from '@directus/sdk'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

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

    const { orderId, email } = body

    if (!orderId || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Order ID and email are required'
      })
    }

    // Fetch the order by order_number, including customer email and payments
    const order = await client.request(
      readItems('orders', {
        filter: {
          order_number: {
            _eq: orderId
          }
        },
        limit: 1,
        fields: [
          'id',
          'order_number',
          'total',
          'customer.email',
          'payments.id',
          'payments.amount',
          'payments.status'
        ]
      })
    ).then(res => res[0] || null)

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    // Verify the email matches the order's customer email
    const customerEmail = order.customer?.email?.toLowerCase()
    const providedEmail = email.toLowerCase()

    if (customerEmail !== providedEmail) {
      return {
        success: false,
        error: 'Email does not match order'
      }
    }

    // Calculate net payments received (sum of all payment amounts)
    // Positive amounts are payments, negative amounts are refunds
    const payments = order.payments || []
    const netPaymentsReceived = payments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount) || 0
      return sum + amount
    }, 0)

    // Balance owing is the order total minus net payments received
    const balanceOwing = Math.max(0, order.total - netPaymentsReceived)

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      orderTotal: order.total,
      paymentsReceived: netPaymentsReceived,
      balanceOwing: balanceOwing
    }

  } catch (error) {
    console.error('Error fetching order payments:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Error fetching order payments'
    })
  }
})
