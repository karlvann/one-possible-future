import { 
  createDirectus,
  staticToken,
  rest,
  readItems,
  updateItem
} from '@directus/sdk'

const orderTable = (order) => {

  if (order.length === 0) {
    return `
      <tr>
        <td align="left" vertical-align="middle" style="background:transparent;font-size:0px;padding:0px 24px 0px 24px;padding-top:0px;padding-right:24px;padding-bottom:0px;padding-left:24px;word-break:break-word;">
          <span style="color:#000000;font-family:Inter, Arial;font-size:16px;">Your cart is empty.</span>
        </td>
      </tr>
    `
  }

  let orderHTML = ''
  orderHTML += `
  <tr>
    <td align="left" vertical-align="middle" style="background:transparent;font-size:0px;padding:0px 24px 0px 24px;padding-top:0px;padding-right:24px;padding-bottom:0px;padding-left:24px;word-break:break-word;width:100%;">
      <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px;width:100%">
        <tr>
          <td colspan="2" style="padding:10px 0px;border-bottom:1px solid #e0e0e0;">
            <span style="color:#000000;font-family:Inter, Arial;font-size:18px;font-weight:bold;">Your cart items</span>
          </td>
        </tr>
  `

  order.forEach(item => {
    orderHTML += `
      <tr>
        <td style="padding:15px 10px;border-bottom:1px solid #e0e0e0;vertical-align:top;">
          <img src="${item.image}" alt="${item.name}" style="width:100px;height:100px;object-fit:cover;display:block;border:1px solid #e0e0e0;" />
        </td>
        <td style="padding:15px 10px;border-bottom:1px solid #e0e0e0;vertical-align:middle;">
          <p style="margin:0;margin-bottom:8px;">
            <span style="color:#000000;font-family:Inter, Arial;font-size:16px;font-weight:600;">
            ${item.name}
            </span>
          </p>
          <p style="margin:0;">
            <span style="color:#000000;font-family:Inter, Arial;font-size:16px;">
            $${item.price}${item.quantity ?' x ' + item.quantity : ''}
            </span>
          </p>
        </td>
      </tr>
    `
  })
  
  orderHTML += `
      </table>
    </td>
  </tr>
  `
  return orderHTML
}

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  const directusUrl = config.public.directus.url
  const directusToken = config.directusToken
  
  const client = createDirectus(directusUrl)
    .with(staticToken(directusToken))
    .with(rest())

  const carts = await client.request(
    readItems('carts', {
      filter: { 
        reminder_1_sent: { _neq: true },
        date_created: { _lte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }
      },
      limit: 10,
      fields: [
        'id', 
        'email', 
        'date_created',
        'skus.*', 'skus.skus_id.*',
        'skus.skus_id.product_id.image.id',
        'skus.skus_id.product_id.image.filename_download'
      ]
    })
  )

  if (!carts || carts.length === 0) {
    console.log('No customers found for cart reminder.')
    return { status: 'success', message: 'No carts to process' }
  }

  const processingResults = await Promise.all(carts.map(async (cart) => {
    
    if (!cart.email || !cart.skus || cart.skus.length === 0) {
      return { id: cart.id, status: 'skipped', reason: 'Missing email or items' }
    }

    const order = cart.skus.map(item => ({
      id: item.skus_id.id,
      name: item.skus_id.name,
      quantity: item.quantity,
      price: Number.parseFloat(item.skus_id.price).toFixed(2),
      image: item.skus_id.product_id?.image?.id ? `https://cdn.ausbeds.com.au/${item.skus_id.product_id.image.id}/${item.skus_id.product_id.image.filename_download}` : ''
    }))

    const orderTableHtml = orderTable(order)

    try {

      const response = await $fetch(`/api/mailjet/sendCartReminder`, {
        method: 'POST',
        body: {
          to: cart.email,
          cartTable: orderTableHtml
        }
      })

      if (response) {
        await client.request(
          updateItem('carts', cart.id, {
            reminder_1_sent: true
          })
        )
        return { id: cart.id, status: 'sent' }
      }

    } catch (error) {
      console.error(`Error processing cart ${cart.id}:`, error)
      return { id: cart.id, status: 'error', error: error.message }
    }
  }))

  return {
    status: 'completed',
    results: processingResults
  }
})