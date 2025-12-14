import {
  createDirectus,
  staticToken,
  rest,
  createItems,
  createItem,
  readItems,
  updateItem,
  deleteItem
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
      customer,
      customer_notes,
      cart,
      total,
      subtotal,
      tax,
      amount,
      method,
      shipping,
      deliveryType,
      transaction_id,
      saleSource,
      existingInvoiceId
    } = body

    // 2. Validate required fields
    if (!customer?.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Customer email is required'
      })
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cart items are required'
      })
    }

    if (!transaction_id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Transaction ID is required'
      })
    }

    // 3. Handle customer creation/retrieval
    let customerId = null

    try {
      // Check for existing customer
      const existingCustomers = await client.request(
        readItems('customers', {
          filter: { 
            email: { 
              _eq: customer.email 
            }
          },
          limit: 1
        })
      )

      if (existingCustomers && existingCustomers.length > 0) {
        // Existing customer found
        customerId = existingCustomers[0].id
        
        // Optionally update customer information
        try {
          await client.request(
            updateItem('customers', existingCustomers[0].id, {
              name: `${customer.first_name} ${customer.last_name}`,
              phone: customer.phone,
              shipping_address_line1: customer.shipping_address_line1,
              shipping_address_line2: customer.shipping_address_line2,
              shipping_address_city: customer.shipping_address_city,
              shipping_address_state: customer.shipping_address_state,
              shipping_address_postal_code: customer.shipping_address_postal_code,
              shipping_address_country: customer.shipping_address_country,
              different_billing: customer.different_billing,
              billing_address_line1: customer.billing_address_line1,
              billing_address_line2: customer.billing_address_line2,
              billing_address_city: customer.billing_address_city,
              billing_address_state: customer.billing_address_state,
              billing_address_postal_code: customer.billing_address_postal_code,
              billing_address_country: customer.billing_address_country,
              abn: customer.abn || ''
            })
          )
        } catch (updateError) {
          console.warn('Failed to update existing customer info:', updateError)
          // Continue with existing customer ID even if update fails
        }
      } else {
        // Create new customer
        const newCustomer = await client.request(
          createItem('customers', {
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            phone: customer.phone || '',
            shipping_address_line1: customer.shipping_address_line1 || '',
            shipping_address_line2: customer.shipping_address_line2 || '',
            shipping_address_city: customer.shipping_address_city || '',
            shipping_address_state: customer.shipping_address_state || '',
            shipping_address_postal_code: customer.shipping_address_postal_code || '',
            shipping_address_country: customer.shipping_address_country || '',
            different_billing: customer.different_billing || false,
            billing_address_line1: customer.billing_address_line1 || '',
            billing_address_line2: customer.billing_address_line2 || '',
            billing_address_city: customer.billing_address_city || '',
            billing_address_state: customer.billing_address_state || '',
            billing_address_postal_code: customer.billing_address_postal_code || '',
            billing_address_country: customer.billing_address_country || '',
            abn: customer.abn || ''
          })
        )
        
        customerId = newCustomer.id
      }
    } catch (customerError) {
      console.error('Customer handling error:', customerError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to process customer: ${customerError.message}`
      })
    }

    if (!customerId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve or create customer ID'
      })
    }

    // 4. Create order
    let orderId = null
    let orderNumber = null

    try {

      if (existingInvoiceId) {
        // if the user is paying for an existing invoice
        const existingOrder = await client.request(
          readItems('orders', {
            filter: {
              order_number: {
                _eq: existingInvoiceId
              }
            },
            limit: 1,
            fields: ['id', 'order_number']
          })
        ).then(res => res[0] || null)

        if (!existingOrder) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Invoice not found'
          })
        }

        // Update the existing order with payment details
        await client.request(
          updateItem('orders', existingOrder.id, {
            payment_status: 'paid',
            transaction_id: transaction_id,
            payment_method: method || 'stripe',
            customer: customerId,
            customer_notes: customer_notes || '',
            delivery_type: deliveryType,
            sale_source: saleSource || 'website'
          })
        )

        orderId = existingOrder.id
        orderNumber = existingOrder.order_number

      } else {
        // if the user is creating a new order
        // Get the last order number for incremental numbering
        let lastOrderNumber = 0
        try {
          const lastOrder = await client.request(
            readItems('orders', {
              sort: ['-order_number'],
              limit: 1,
              fields: ['order_number']
            })
          )

          if (lastOrder && lastOrder.length > 0 && lastOrder[0].order_number) {
            lastOrderNumber = Number.parseInt(lastOrder[0].order_number)
          }
        } catch (fetchError) {
          console.warn('Could not fetch last order number, using default:', fetchError.message)
          // Continue with default lastOrderNumber
        }

        // Increment to get new order number
        orderNumber = lastOrderNumber + 1
        
        const newOrder = await client.request(
          createItem('orders', {
            order_number: orderNumber,
            payment_status: 'paid',
            subtotal: subtotal || 0,
            shipping: shipping || 0,
            discount: 0,
            tax: tax || 0,
            total: total || 0,
            delivery_type: deliveryType,
            customer: customerId,
            transaction_id: transaction_id,
            payment_method: method || 'stripe',
            customer_notes: customer_notes || '',
            sale_source: saleSource || 'website'
          })
        )

        orderId = newOrder.id

      }

      
    } catch (orderError) {
      console.error('Order creation error:', orderError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create order: ${orderError.message}`
      })
    }

    if (!orderId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create order - no order ID returned'
      })
    }

    // 5. Link SKUs to order (M2M relationship)
    if (existingInvoiceId) {
      // First, we should delete existing orders_skus entries for this order
      try {
        const existingOrderSkus = await client.request(
          readItems('orders_skus', {
            filter: {
              orders_id: {
                _eq: orderId
              }
            },
            fields: ['id']
          })
        )

        for (const orderSku of existingOrderSkus) {
          await client.request(
            deleteItem('orders_skus', orderSku.id)
          )
        }
      } catch (cleanupError) {
        console.error('Failed to clean up existing order SKUs:', cleanupError)
        // Continue even if cleanup fails
      }
    }

    // Note: Batch creation is more efficient than individual creates
    const orderSkuItems = cart.map(item => ({
      orders_id: orderId,
      skus_id: item.id,
      quantity: item.quantity || 1
    }))

    try {
      // Use createItems (plural) for batch creation - more efficient
      if (orderSkuItems.length === 1) {
        // Single item
        await client.request(
          createItem('orders_skus', orderSkuItems[0])
        )
      } else {
        // Multiple items - batch create
        await client.request(
          createItems('orders_skus', orderSkuItems)
        )
      }
    } catch (skuError) {
      console.error('SKU linking error:', skuError)
      // Log the error but don't fail the entire order
      // You might want to implement a cleanup mechanism here
      console.error('Warning: Some SKUs may not have been linked to the order')
    }

    // 6. Create payment record
    let paymentId = null

    try {
      const newPayment = await client.request(
        createItem('payments', {
          status: 'paid',
          manual_payment: false,
          payment_method: method || 'stripe',
          amount: amount || total || 0,
          transaction_id: transaction_id,
          order: orderId
        })
      )

      paymentId = newPayment.id
    } catch (paymentError) {
      console.error('Payment record creation error:', paymentError)
      // Payment record creation failure shouldn't break the order
      // but should be logged for manual reconciliation
      console.error('Warning: Payment record creation failed for order:', orderId)
    }

    return {
      success: true,
      orderId: orderId,
      orderNumber: orderNumber,
      customerId: customerId,
      paymentId: paymentId,
      message: 'Order completed successfully'
    }
    
  } catch (error) {
    console.error('Error completing order:', error)

    if (error.statusCode) {
      throw error
    }

    // Generic error response
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to complete order'
    })
  }
})