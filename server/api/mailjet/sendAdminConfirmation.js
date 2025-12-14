import { 
  createDirectus,
  staticToken,
  rest, 
  readItems
} from '@directus/sdk'

import fetch from 'node-fetch'

export default eventHandler(async (event) => {

  const config = useRuntimeConfig()
  
  const directusUrl = config.public.directus.url
  const directusToken = config.directusToken

  const test = config.public.environment !== 'production'
  
  const client = createDirectus(directusUrl)
    .with(staticToken(directusToken))
    .with(rest())

  const auth = Buffer.from(`${config.mailjetApiKey}:${config.mailjetApiSecret}`).toString('base64')

  const body = await readBody(event)
  const {
    orderId
  } = body

  // const orderId = '2059c1ef-8285-49c0-9c5d-bb535389c2cd'

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order ID is required'
    })
  }

  try {
    // Fetch order details
    const orders = await client.request(
      readItems('orders', {
        filter: { 
          id: { 
            _eq: orderId 
          }
        },
        fields: [
          '*',
          'customer.*', 
          'payments.*',
          'invoices.invoices_id.invoice.*',
          // 'invoices..id',
          'skus.*',
          'skus.skus_id.*',
          'skus.skus_id.product_id.image.id',
          'skus.skus_id.product_id.image.filename_download'
        ],
        limit: 1
      })
    )

    if (!orders || orders.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      })
    }

    const order = orders[0]

    const orderDate = new Date(order.date_created).toLocaleDateString('en-AU')
    const paymentMethod = order.payments && order.payments.length > 0 ? order.payments[0].payment_method : 'N/A'

    // Build the HTML email content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media print {
      body {
        margin: 0;
        padding: 10px;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.4;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 15px;
      font-size: 11px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .order-number {
      font-size: 18px;
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
    }
    .order-link {
      display: inline-block;
      margin-top: 6px;
      padding: 4px 10px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 3px;
      font-size: 10px;
    }
    .row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    .col-50 {
      flex: 1;
      width: 50%;
    }
    .section {
      margin-bottom: 15px;
      padding: 12px;
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 6px;
    }
    .section-title {
      font-size: 13px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e9ecef;
    }
    .info-row {
      margin-bottom: 5px;
      font-size: 11px;
    }
    .info-label {
      font-weight: 600;
      color: #6c757d;
      display: inline-block;
      min-width: 100px;
    }
    .info-value {
      color: #333;
    }
    .alert {
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      color: #856404;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      font-size: 11px;
    }
    .customer-notes {
      background-color: #f1f3f4;
      padding: 8px;
      border-radius: 4px;
      margin-top: 6px;
      font-style: italic;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .items-table th {
      background-color: #f8f9fa;
      padding: 6px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
      font-weight: 600;
      font-size: 10px;
    }
    .items-table td {
      padding: 5px;
      border-bottom: 1px solid #e9ecef;
      font-size: 10px;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .badge-paid {
      background-color: #d4edda;
      color: #155724;
    }
    .badge-pending {
      background-color: #fff3cd;
      color: #856404;
    }
    .badge-delivery {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e9ecef;
      text-align: center;
      color: #6c757d;
      font-size: 10px;
    }
    .totals-section {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #dee2e6;
    }
    .totals-section .info-row {
      margin-bottom: 3px;
    }
    .total-row {
      font-size: 13px;
      margin-top: 6px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="order-number">New Order #${order.order_number}</h1>
    <p style="margin: 3px 0; color: #6c757d; font-size: 10px;"><a href="https://content.ausbeds.com.au/admin/content/orders/${order.id}">Order ID: ${order.id}</a></p>
    <p style="margin: 3px 0; color: #6c757d; font-size: 10px;">Date: ${orderDate}</p>
  </div>

  ${order.customer_notes ? `
  <div class="alert">
    <strong>⚠️ Customer Notes:</strong>
    <div class="customer-notes">
      ${order.customer_notes}
    </div>
  </div>
  ` : ''}

  <div class="row">
    <div class="col-50">
      <div class="section">
        <h2 class="section-title">Customer Information</h2>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${order.customer.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value"><a href="mailto:${order.customer.email}">${order.customer.email}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value"><a href="tel:${order.customer.phone}">${order.customer.phone}</a></span>
        </div>
        ${order.customer.abn ? `
        <div class="info-row">
          <span class="info-label">ABN:</span>
          <span class="info-value">${order.customer.abn}</span>
        </div>
        ` : ''}
      </div>
    </div>

    <div class="col-50">
      <div class="section">
        <h2 class="section-title">Shipping Address</h2>
        <div style="line-height: 1.5;">
          <strong>${order.customer.name}</strong><br>
          ${order.customer.shipping_address_line1 ? `${order.customer.shipping_address_line1}<br>` : ''}
          ${order.customer.shipping_address_line2 ? `${order.customer.shipping_address_line2}<br>` : ''}
          ${order.customer.shipping_address_city}, ${order.customer.shipping_address_state.toUpperCase()} ${order.customer.shipping_address_postal_code}<br>
          ${order.customer.shipping_address_country}
        </div>
      </div>
    </div>
  </div>

  ${order.customer.different_billing ? `
  <div class="section">
    <h2 class="section-title">Billing Address</h2>
    <div style="line-height: 1.5;">
      <strong>${order.customer.name}</strong><br>
      ${order.customer.abn ? `ABN: ${order.customer.abn}<br>` : ''}
      ${order.customer.billing_address_line1 ? `${order.customer.billing_address_line1}<br>` : ''}
      ${order.customer.billing_address_line2 ? `${order.customer.billing_address_line2}<br>` : ''}
      ${order.customer.billing_address_city}, ${order.customer.billing_address_state.toUpperCase()} ${order.customer.billing_address_postal_code}<br>
      ${order.customer.billing_address_country}
    </div>
  </div>
  ` : ''}

  <div class="row">
    <div class="col-50">
      <div class="section">
        <h2 class="section-title">Order Details</h2>
        <div class="info-row">
          <span class="info-label">Payment Status:</span>
          <span class="info-value">
            <span class="badge ${order.payment_status === 'paid' ? 'badge-paid' : 'badge-pending'}">
              ${order.payment_status}
            </span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Payment Method:</span>
          <span class="info-value">${paymentMethod}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Delivery Type:</span>
          <span class="info-value">
            <span class="badge badge-delivery">
              ${order.delivery_type}
            </span>
          </span>
        </div>
        ${order.delivery_time ? `
        <div class="info-row">
          <span class="info-label">Delivery Time:</span>
          <span class="info-value">${order.delivery_time}</span>
        </div>
        ` : ''}
      </div>
    </div>

    <div class="col-50">
      <div class="section">
        <h2 class="section-title">Order Summary</h2>
        <div class="info-row">
          <span class="info-label">Subtotal:</span>
          <span class="info-value">$${Number.parseFloat(order.subtotal).toFixed(2)}</span>
        </div>
        ${order.tax && Number.parseFloat(order.tax) > 0 ? `
        <div class="info-row">
          <span class="info-label">GST:</span>
          <span class="info-value">$${Number.parseFloat(order.tax).toFixed(2)}</span>
        </div>
        ` : ''}
        ${order.shipping && Number.parseFloat(order.shipping) > 0 ? `
        <div class="info-row">
          <span class="info-label">Shipping:</span>
          <span class="info-value">$${Number.parseFloat(order.shipping).toFixed(2)}</span>
        </div>
        ` : ''}
        ${order.discount && Number.parseFloat(order.discount) > 0 ? `
        <div class="info-row">
          <span class="info-label">Discount:</span>
          <span class="info-value">-$${Number.parseFloat(order.discount).toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="info-row total-row">
          <span class="info-label">Total:</span>
          <span class="info-value">$${Number.parseFloat(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Order Items</h2>
    <table class="items-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.skus.map(skuItem => {
          const sku = skuItem.skus_id;
          const quantity = skuItem.quantity || 1;
          const price = Number.parseFloat(sku.price || 0);
          const total = price * quantity;
          return `
        <tr>
          <td><strong>${sku.name || 'N/A'}</strong></td>
          <td>${sku.sku || 'N/A'}</td>
          <td>${quantity}</td>
          <td>$${price.toFixed(2)}</td>
          <td>$${total.toFixed(2)}</td>
        </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>This is an automated order notification from Ausbeds</p>
    <p>Order received on ${orderDate}</p>
  </div>
</body>
</html>
    `;

    let to = [
      {
        Email: 'sales@ausbeds.com.au',
        Name: 'Ausbeds Sales'
      },
      {
        Email: 'tech@ausbeds.com.au',
        Name: 'Ausbeds Tech'
      },
      {
        Email: 'big-new-printer@hpeprint.com',
        Name: 'Ausbeds Printer'
      },
    ]

    if (test) {
      to = [{
        Email: 'tech@ausbeds.com.au',
        Name: 'Alex'
      }]
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        Messages: [{
          From: {
            Email: 'no-reply@ausbeds.com.au',
            Name: 'Karl from Ausbeds'
          },
          ReplyTo: {
            Email: 'sales@ausbeds.com.au',
            Name: 'Karl from Ausbeds'
          },
          To: to,
          Subject: `New order received - #${order.order_number}`,
          HTMLPart: htmlContent
        }]
      })
    }

    try {
      await fetch('https://api.mailjet.com/v3.1/send', options)
      return true
    } catch(e) {
      console.error('Error sending email:', e)
      return false
    }

  } catch(e) {
    console.error('Error fetching order details:', e)
  }

})