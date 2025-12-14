import { 
  createDirectus,
  staticToken,
  rest, 
  createItem,
  readItems
} from '@directus/sdk'

import PDFDocument from 'pdfkit'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()
  
  const directusUrl = config.public.directus.url
  const directusToken = config.directusToken
  
  const client = createDirectus(directusUrl)
    .with(staticToken(directusToken))
    .with(rest())

  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body is required'
    })
  }

  const { 
    orderId
  } = body
  
  // for testing, hardcode orderId
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

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(order)

    // Upload to Directus
    const fileName = `invoice-${order.order_number}.pdf`
    
    // Create FormData for Node.js environment
    const formData = new FormData()
    formData.append('title', `Invoice #INV-${order.order_number}`)
    formData.append('filename_download', fileName)
    formData.append('folder', 'c0f0d765-4033-401c-a2c0-74ec2daa8d2c') // Invoices folder ID
    formData.append('type', 'application/pdf')
    formData.append('file', pdfBuffer)

    const { data: uploadResponse, error } = await $fetch(`${directusUrl}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${directusToken}`
      },
      body: formData
    })
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `File upload failed: ${error}`
      })
    }

    // console.log('uploadResponse', uploadResponse)

    try {
      const addInvoiceItem = await client.request(
        createItem('invoices', {
          invoice: uploadResponse
        })
      )

      await client.request(
        createItem('invoices_orders', {
          invoices_id: addInvoiceItem.id,
          orders_id: orderId
        })
      )

    } catch(e) {
      console.error('Failed to link invoice to order:', e)
    }

    return true

    // // Return success response
    // return {
    //   success: true,
    //   invoice: {
    //     id: fileId,
    //     url: `${directusUrl}/assets/${fileId}`,
    //     download: `${directusUrl}/assets/${fileId}?download`,
    //     number: `INV-${order.order_number}`,
    //     filename: fileName
    //   }
    // }

  } catch (error) {
    // If it's already a Nuxt error, throw it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise create a generic server error
    console.error('Invoice generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Invoice generation failed',
      data: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

/**
 * Generate PDF invoice using PDFKit with async/await
 */
async function generateInvoicePDF(order) {
  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: `Invoice #INV-${order.order_number}`,
      Author: 'ausbeds',
      Subject: `Tax Invoice for Order ${order.order_number}`
    }
  })

  // Collect PDF chunks
  const chunks = []
  
  // Use async iterator to collect data
  const pdfBuffer = await new Promise((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Generate invoice content
    generateInvoiceContent(doc, order)
    
    // Finalize
    doc.end()
  })

  const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
  return blob
}

/**
 * Generate the actual invoice content
 */
function generateInvoiceContent(doc, order) {

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const LOGO_BASE64 = 'data:image/png;base64,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'
  const logoBuffer = Buffer.from(LOGO_BASE64.split(',')[1], 'base64')

  // Constants
  const COMPANY = {
    name: 'ausbeds',
    tagline: 'Really comfy, hand made mattresses',
    address_line1: '136 Victoria Rd',
    address_line2: 'Marrickville NSW 2204',
    country: 'Australia',
    abn: '46161365742',
    bank: {
      name: 'Ausbeds',
      bsb: '032267',
      account: '342006'
    }
  }

  // Helpers
  const formatCurrency = (amount) => `$${Number.parseFloat(amount || 0).toFixed(2)}`
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-AU')

  // Invoice details
  const invoiceNumber = `INV-${order.order_number}`
  const invoiceDate = formatDate(order.date_created)
  const isPaid = order.payment_status === 'paid'

  // Financial data
  const subtotal = Number.parseFloat(order.subtotal || 0)
  const shipping = Number.parseFloat(order.shipping || 0)
  const tax = Number.parseFloat(order.tax || 0)
  const discount = Number.parseFloat(order.discount || 0)
  const total = Number.parseFloat(order.total || 0)
  const balance = isPaid ? 0 : total

  // Colors
  const colors = {
    primary: '#000000',
    success: '#27ae60',
    danger: '#e74c3c',
    gray: '#7f8c8d',
    lightGray: '#ecf0f1',
    darkGray: '#000000'
  }

  // Customer data
  const customer = order.customer || {}
  const useBilling = customer.different_billing === true

  // --- HEADER SECTION ---
  doc.image(logoBuffer, 50, 40, { fit: [130, 33], align: 'left' })
     .fontSize(14)
     .fillColor(colors.primary)
     .text(COMPANY.tagline, 50, 85)
     .fontSize(11)
     .fillColor(colors.gray)
     .text(COMPANY.address_line1, 50, 110)
     .text(COMPANY.address_line2, 50, 123)
     .text(COMPANY.country, 50, 136)
     .text(`ABN ${COMPANY.abn}`, 50, 149)

  // Invoice title and number
  doc.fontSize(18)
    .font('Helvetica-Bold')
    .fillColor(colors.primary)
    .text('Tax invoice', 350, 50, { align: 'right' })
    .fontSize(14)
    .fillColor(isPaid ? colors.success : colors.gray)
    .font('Helvetica')
    .text(`#${invoiceNumber}`, 350, 85, { align: 'right' })

  // watermark
  if (isPaid) {
    doc.save()
    doc.fontSize(60)
      .fillColor(colors.success)
      .rotate(-30, { origin: [205, 135] })
      .opacity(0.1)
      .text('PAID', 205, 135, { align: 'center' })
      .opacity(1)
    doc.restore()  
  }

  doc.fontSize(14)
    .font('Helvetica')
    .fillColor(colors.gray)
    .text(`Date: ${invoiceDate}`, 350, 105, { align: 'right' })

  // Separator line
  doc.moveTo(50, 175)
     .lineTo(545, 175)
     .strokeColor(colors.lightGray)
     .stroke()

  // --- ADDRESSES SECTION ---
  
  // Bill To
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .fillColor(colors.primary)
    .text('Bill to', 50, 195)

  doc.fontSize(11)
    .font('Helvetica')
    .fillColor(colors.primary)
    .text(customer.name || 'N/A', 50, 215)

  let billY = 230

  if (customer.abn) {
    doc.fontSize(11)
       .fillColor(colors.primary)
       .text(`ABN ${customer.abn}`, 50, billY)
    billY += 15
  }

  const billAddress = useBilling ? customer.billing_address_line1 : customer.shipping_address_line1
  const billCity = useBilling ? customer.billing_address_city : customer.shipping_address_city
  const billState = useBilling ? customer.billing_address_state : customer.shipping_address_state
  const billPostal = useBilling ? customer.billing_address_postal_code : customer.shipping_address_postal_code

  doc.fontSize(11)
     .fillColor(colors.primary)
     .text(billAddress || '', 50, billY)
  
  if (useBilling && customer.billing_address_line2) {
    doc.text(customer.billing_address_line2, 50, billY + 15)
    billY += 15
  }
  
  doc.text(`${billCity} ${billState} ${billPostal}`, 50, billY + 15)
    .text('Australia', 50, billY + 30)

  // Ship To
  doc.fontSize(14)
    .font('Helvetica-Bold')
    .fillColor(colors.primary)
    .text('Ship to', 300, 195)

  let shipY = 215
  doc.fontSize(11)
    .font('Helvetica')
    .fillColor(colors.primary)
    .text(customer.shipping_address_line1 || '', 300, shipY)
  
  if (customer.shipping_address_line2) {
    shipY += 15
    doc.text(customer.shipping_address_line2, 300, shipY)
  }
  
  doc.text(`${customer.shipping_address_city} ${customer.shipping_address_state} ${customer.shipping_address_postal_code}`, 300, shipY + 15)
    .text('Australia', 300, shipY + 30)

  if (customer.phone) {
    doc.fontSize(11)
      .text(customer.phone, 300, shipY + 45)
  }

  // --- ITEMS TABLE ---
  let currentY = 305

  // Table header
  doc.rect(50, currentY, 495, 25)
     .fillColor(colors.darkGray)
     .fill()

  doc.fontSize(11)
    .font('Helvetica-Bold')
    .fillColor('#ffffff')
    .text('#', 55, currentY + 8, { width: 30 })
    .text('Item & Description', 90, currentY + 8, { width: 200 })
    .text('Qty', 300, currentY + 8, { width: 40, align: 'center' })
    .text('Price', 350, currentY + 8, { width: 60, align: 'right' })
    .text('Tax', 420, currentY + 8, { width: 50, align: 'right' })
    .text('Amount', 480, currentY + 8, { width: 60, align: 'right' })

  currentY += 25

  // Items
  let itemNumber = 1
  
  if (order.skus?.length) {
    for (const [index, item] of order.skus.entries()) {
      const sku = item.skus_id || {}
      const quantity = item.quantity || 1
      const price = Number.parseFloat(sku.price || 0)
      const itemTax = price * 0.1
      const amount = price * quantity

      // Alternate row background
      if (index % 2 === 0) {
        doc.rect(50, currentY, 495, 45)
          .fillColor('#f8f9fa')
          .fill()
      }

      doc.fontSize(11)
        .font('Helvetica')
        .fillColor(colors.primary)
        .text(itemNumber.toString(), 55, currentY + 15)

      doc.fontSize(11)
        .fillColor(colors.primary)
        .text(sku.name || 'Product', 90, currentY + 15)
      
      // doc.fontSize(11)
      //   .fillColor(colors.gray)
      //   .text(`SKU: ${sku.sku || 'N/A'}`, 90, currentY + 20)

      // const details = [sku.range, sku.firmness, sku.size].filter(Boolean).join(' - ')
      // if (details) {
      //   doc.text(details, 90, currentY + 32)
      // }

      doc.fontSize(11)
         .fillColor(colors.primary)
         .text(quantity.toString(), 300, currentY + 15, { width: 40, align: 'center' })
         .text(formatCurrency(price), 350, currentY + 15, { width: 60, align: 'right' })
         .fontSize(11)
         .text(formatCurrency(itemTax), 420, currentY + 15, { width: 50, align: 'right' })
         .fontSize(11)
         .text(formatCurrency(amount), 480, currentY + 15, { width: 60, align: 'right' })

      currentY += 45
      itemNumber++
    }
  }

  // Delivery
  // if (itemNumber % 2 === 0) {
  //   doc.rect(50, currentY, 495, 35)
  //       .fillColor('#f8f9fa')
  //       .fill()
  // }

  // doc.fontSize(9)
  //     .fillColor(colors.gray)
  //     .text(itemNumber.toString(), 55, currentY + 5)

  // doc.fontSize(10)
  //     .fillColor(colors.primary)
  //     .text('Delivery', 90, currentY + 5)

  // doc.fontSize(8)
  //     .fillColor(colors.gray)
  //     .text(order.delivery_type || 'Standard delivery', 90, currentY + 20)

  // doc.fontSize(10)
  //     .fillColor('#333333')
  //     .text('1', 300, currentY + 10, { width: 40, align: 'center' })
  //     .text(formatCurrency(shipping), 350, currentY + 10, { width: 60, align: 'right' })
  //     .fontSize(10)
  //     .text(formatCurrency(shipping), 480, currentY + 10, { width: 60, align: 'right' })

  // currentY += 35

  // Line after items
  doc.moveTo(50, currentY + 10)
     .lineTo(545, currentY + 10)
     .strokeColor(colors.lightGray)
     .stroke()

  currentY += 25

  // --- TOTALS SECTION ---
  const totalsX = 380

  // Subtotal
  doc.fontSize(11)
    .fillColor(colors.primary)
    .text('Subtotal', totalsX, currentY, { width: 100, align: 'right' })
    .fillColor(colors.primary)
    .text(formatCurrency(subtotal), totalsX + 85, currentY, { width: 75, align: 'right' })

  currentY += 18

  // Shipping
  doc.fillColor(colors.primary)
    .text('Shipping', totalsX, currentY, { width: 100, align: 'right' })
    .fillColor(colors.primary)
    .text(formatCurrency(shipping), totalsX + 85, currentY, { width: 75, align: 'right' })

  currentY += 18

  // Discount
  if (discount > 0) {
    doc.fillColor(colors.primary)
      .text('Discount', totalsX, currentY, { width: 100, align: 'right' })
      .fillColor(colors.primary)
      .text(`-${formatCurrency(discount)}`, totalsX + 85, currentY, { width: 75, align: 'right' })
      currentY += 18
  }

  // Total line
  doc.moveTo(totalsX, currentY)
    .lineTo(545, currentY)
    .strokeColor(colors.lightGray)
    .stroke()

  currentY += 10

  // Total
  doc.fontSize(11)
    .fillColor(colors.primary)
    .font('Helvetica-Bold')
    .text('Total', totalsX, currentY, { width: 100, align: 'right' })
    .text(formatCurrency(total), totalsX + 85, currentY, { width: 75, align: 'right' })

  currentY += 18

  // GST
  doc.fontSize(11)
      .font('Helvetica')
     .fillColor(colors.primary)
     .text('GST (10% incl.)', totalsX, currentY, { width: 100, align: 'right' })
     .fillColor(colors.primary)
     .text(formatCurrency(tax), totalsX + 85, currentY, { width: 75, align: 'right' })

  currentY += 18

  // Payment made
  if (isPaid) {
    doc.fontSize(11)
      .fillColor(colors.success)
      .text('Payment made', totalsX, currentY, { width: 100, align: 'right' })
      .text(`${formatCurrency(total)}`, totalsX + 85, currentY, { width: 75, align: 'right' })
    currentY += 18
  }

  // Balance
  doc.fontSize(11)
    .fillColor(colors.primary)
    .text('Balance', totalsX, currentY, { width: 100, align: 'right' })
    .text(formatCurrency(balance), totalsX + 85, currentY, { width: 75, align: 'right' })

  
    // --- NOTES & PAYMENT INFO ---
  // Customer notes
  if (order.customer_notes) {
    doc.fontSize(14)
      .font('Helvetica-Bold')
      .fillColor(colors.primary)
      .text('Notes', 50, currentY - 60)
    
    doc.fontSize(11)
      .font('Helvetica')
      .fillColor(colors.gray)
      .text(order.customer_notes, 50, currentY - 40, { width: 280 })
  }

  // Payment info
  if (!isPaid) {
    const bottomY = 680
    doc.fontSize(14)
      .font('Helvetica-Bold')
      .fillColor(colors.primary)
      .text('Payment information', 50, bottomY)

    doc.fontSize(11)
      .font('Helvetica')
      .fillColor(colors.gray)
      .text('For next day delivery, please use credit card or PayPal.', 50, bottomY + 15)
      .text('Otherwise, bank deposit is fine:', 50, bottomY + 30)
      .text(`Account name: ${COMPANY.bank.name}`, 50, bottomY + 45)
      .text(`BSB: ${COMPANY.bank.bsb}   Account: ${COMPANY.bank.account}`, 50, bottomY + 60)
  }

}