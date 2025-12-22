/**
 * Submit order from checkout
 * POST /api/quote/order
 *
 * Saves the complete order with all customer details.
 * For now, this just stores the order - payment will be handled manually.
 */

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const dataDir = join(process.cwd(), '.data')
  const ordersDir = join(dataDir, 'orders')

  // Ensure directories exist
  try {
    await mkdir(ordersDir, { recursive: true })
  } catch (e) {
    // Ignore if exists
  }

  // Generate order ID
  const orderId = `o_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`

  const orderData = {
    orderId,
    quoteId: body.quoteId,
    status: 'pending_payment',
    createdAt: new Date().toISOString(),

    // Customer details
    customer: {
      name: body.name,
      email: body.email,
      phone: body.phone
    },

    // Delivery address
    delivery: {
      address: body.address,
      suburb: body.suburb,
      state: body.state,
      postcode: body.postcode,
      instructions: body.instructions || null
    },

    // Product details
    product: body.product,
    size: body.size,
    sizeName: body.sizeName,
    deliveryCost: body.delivery,
    totalPrice: body.totalPrice,
    totalFormatted: body.totalFormatted
  }

  // Save order
  const filePath = join(ordersDir, `${orderId}.json`)
  await writeFile(filePath, JSON.stringify(orderData, null, 2))

  // Also save as latest order for easy access
  const latestPath = join(dataDir, 'last-order.json')
  await writeFile(latestPath, JSON.stringify(orderData, null, 2))

  console.log('[Order] Created order:', orderId)

  return {
    success: true,
    orderId,
    message: 'Order submitted. We will contact you to complete payment.'
  }
})
