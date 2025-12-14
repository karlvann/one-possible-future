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

  const body = await readBody(event)

  const auth = Buffer.from(`${config.mailjetApiKey}:${config.mailjetApiSecret}`).toString('base64')

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

    const customerShippingHtml = `${order.customer.name}<br style="box-sizing: border-box;" />${ order.customer.shipping_address_line1 ? order.customer.shipping_address_line1 + '<br style="box-sizing: border-box;" />' : '' }${ order.customer.shipping_address_line2 ? order.customer.shipping_address_line2 + '<br style="box-sizing: border-box;" />' : '' }${order.customer.shipping_address_city}, ${order.customer.shipping_address_state} ${order.customer.shipping_address_postal_code}`

    let customerBillingHtml = ''
    if (order.customer.different_billing) {
      customerBillingHtml = `${order.customer.name}<br style="box-sizing: border-box;" />${ order.customer.abn ? order.customer.abn + '<br style="box-sizing: border-box;" />' : '' }${ order.customer.billing_address_line1 ? order.customer.billing_address_line1 + '<br style="box-sizing: border-box;" />' : '' }${ order.customer.billing_address_line2 ? order.customer.billing_address_line2 + '<br style="box-sizing: border-box;" />' : '' }${order.customer.billing_address_city}, ${order.customer.billing_address_state} ${order.customer.billing_address_postal_code}`
    } else {
      customerBillingHtml = customerShippingHtml
    }

    let itemsHtml = ''
    order.skus.forEach(skuItem => {
      const sku = skuItem.skus_id
      const product = sku.product_id

      let productImage = null
      if (product && product?.image) {
        productImage = `https://cdn.ausbeds.com.au/${product.image.id}/${product.image.file_download}`
      } else if (sku.sku.includes('mattressremoval')) {
        productImage = 'https://cdn.ausbeds.com.au/3860d12d-a964-4cd3-90e5-e15b6ffeeb13.png'
      } else {
        productImage = 'https://cdn.ausbeds.com.au/37345a30-766b-4ff7-81cc-a7b4be97e1b4.png'
      }

      const productName = sku.name || ''
      const quantity = skuItem.quantity || 1
      const price = Number.parseFloat(sku.price || 0).toFixed(2)

      itemsHtml += `<table class="row row-6 mobile_hide" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; background: 0% 0% / auto;">
        <tbody style="box-sizing: border-box;">
          <tr style="box-sizing: border-box;">
            <td style="box-sizing: border-box;">
              <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; background: 0% 0% / auto; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                <tbody style="box-sizing: border-box;">
                  <tr style="box-sizing: border-box;">
                    <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 10px; padding-left: 60px; padding-top: 10px; box-sizing: border-box; border-width: 0px;" align="left" bgcolor="#97D7ED" valign="middle">
                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="width: 100%; box-sizing: border-box;">
                              <div class="alignment" align="left" style="line-height: 10px; box-sizing: border-box;">
                                <div style="max-width: 110px; box-sizing: border-box;">
                                  <img src="${productImage}" style="display: block; height: auto; width: 100%; box-sizing: border-box; border-width: 0; border-radius: 10px" width="110" height="auto" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="column column-2" width="41.666666666666664%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box; padding: 10px 20px; border-width: 0px;" align="left" bgcolor="#97D7ED" valign="middle">
                      <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">${ productName }</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="left">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0;">Qty: ${ quantity } </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 21px; box-sizing: border-box;" align="left">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0;"></p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="column column-3" width="25%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 10px; padding-right: 60px; padding-top: 10px; box-sizing: border-box; border-width: 0px;" align="left" bgcolor="#97D7ED" valign="middle">
                      <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="right">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0;">$${ price }</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="row row-7 desktop_hide" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box; background: 0% 0% / auto;">
        <tbody style="box-sizing: border-box;">
          <tr style="box-sizing: border-box;">
            <td style="box-sizing: border-box;">
              <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; background: 0% 0% / auto; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                <tbody style="box-sizing: border-box;">
                  <tr style="box-sizing: border-box;">
                    <td class="column column-1" width="40%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 10px; padding-left: 60px; padding-top: 10px; box-sizing: border-box; border-width: 0px;" align="left" bgcolor="#97D7ED" valign="middle">
                      <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="width: 100%; box-sizing: border-box;">
                              <div class="alignment" align="left" style="line-height: 10px; box-sizing: border-box;">
                                <div style="max-width: 120px; box-sizing: border-box;">
                                  <img src="${ productImage }" style="display: block; height: auto; width: 100%; box-sizing: border-box; border-width: 0; border-radius: 8px;" width="120" height="auto" />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="column column-2" width="60%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box; padding: 10px 20px; border-width: 0px;" align="left" bgcolor="#97D7ED" valign="middle">
                      <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;  padding-bottom: 10px;" align="left">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold">${ productName }</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box; padding-bottom: 10px;" align="left">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0;">Qty: ${ quantity }</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="left">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0;"></p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="paragraph_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                        <tbody>
                          <tr style="box-sizing: border-box;">
                            <td class="pad" style="box-sizing: border-box;">
                              <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="right">
                                <p style="box-sizing: border-box; line-height: inherit; margin: 0;">$${ price }</p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      `
    })

    const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">
<html style="box-sizing: border-box;">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Permanent+Marker&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 20px;
      }
      @media (max-width:620px) {
        .image_block div.fullWidth {
          max-width: 100% !important;
        }
        .mobile_hide {
          display: none;
        }
        .row-content {
          width: 100% !important;
        }
        .stack .column {
          width: 100%;
          display: block;
        }
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }
        .desktop_hide {
          display: table !important;
          max-height: none !important;
        }
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
        .row-3 .column-1 {
          padding: 0 !important;
        }
        .row-3 .column-1 .block-1.image_block td.pad {
          padding: 0 !important;
        }
        .row-3 .column-1 .block-2.image_block td.pad {
          padding: 0 !important;
        }
        .row-6 .column-2 .block-1.paragraph_block td.pad {
          padding: 0 !important;
        }
        .row-7 .column-1 .block-1.image_block td.pad {
          padding: 0 !important;
        }
        .row-7 .column-2 .block-1.paragraph_block td.pad {
          padding: 0 !important;
        }
        .row-7 .column-2 .block-2.paragraph_block td.pad {
          padding: 0 !important;
        }
        .row-7 .column-2 .block-3.paragraph_block td.pad {
          padding: 0 !important;
        }
        .row-7 .column-2 .block-4.paragraph_block td.pad {
          padding: 0 !important;
        }
        .row-3 .column-1 .block-1.image_block .alignment div {
          margin: 0 auto !important;
        }
        .row-3 .column-1 .block-2.image_block .alignment div {
          margin: 0 auto !important;
        }
        .row-5 .column-1 .block-1.image_block .alignment div {
          margin: 0 auto !important;
        }
        .row-6 .column-1 .block-1.image_block .alignment div {
          margin: 0 auto !important;
        }
        .row-7 .column-1 .block-1.image_block .alignment div {
          margin: 0 auto !important;
        }
        .row-2 .column-1 .block-1.image_block .alignment div {
          margin: 0 auto 0 0 !important;
        }
        .row-5 .column-1 .block-1.image_block td.pad {
          padding: 0 22px !important;
        }
        .row-6 .column-2 .block-1.paragraph_block td.pad>div {
          text-align: center !important;
          font-size: 18px !important;
        }
        .row-6 .column-3 .block-1.paragraph_block td.pad>div {
          text-align: center !important;
          font-size: 18px !important;
        }
        .row-6 .column-1 .block-1.image_block td.pad {
          padding: 20px !important;
        }
        .row-5 .column-1 .block-2.paragraph_block td.pad {
          padding: 20px 0 15px !important;
        }
        .row-6 .column-2 .block-2.paragraph_block td.pad>div {
          text-align: center !important;
          font-size: 13px !important;
        }
        .row-6 .column-2 .block-3.paragraph_block td.pad>div {
          text-align: center !important;
          font-size: 13px !important;
        }
        .row-6 .column-2 .block-2.paragraph_block td.pad {
          padding: 0 10px !important;
        }
        .row-6 .column-2 .block-3.paragraph_block td.pad {
          padding: 0 10px !important;
        }
        .row-6 .column-3 .block-1.paragraph_block td.pad {
          padding: 0 10px !important;
        }
        .row-7 .column-2 .block-2.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-7 .column-2 .block-3.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-14 .column-1 .block-11.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-14 .column-1 .block-2.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-14 .column-1 .block-5.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-14 .column-1 .block-8.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-15 .column-1 .block-2.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-15 .column-2 .block-2.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-16 .column-1 .block-2.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-16 .column-2 .block-2.paragraph_block td.pad>div {
          text-align: left !important;
          font-size: 16px !important;
        }
        .row-7 .column-2 .block-1.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-7 .column-2 .block-4.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-9 .column-2 .block-1.paragraph_block td.pad>div {
          font-size: 18px !important;
        }
        .row-14 .column-1 .block-12.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-14 .column-1 .block-3.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-14 .column-1 .block-6.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-14 .column-1 .block-9.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-15 .column-1 .block-3.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-15 .column-2 .block-3.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-16 .column-1 .block-3.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-16 .column-2 .block-3.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-9 .column-1 .block-1.paragraph_block td.pad>div {
          text-align: left !important;
        }
        .row-14 .column-1 .block-1.divider_block td.pad {
          padding: 20px 0 !important;
        }
        .row-14 .column-1 .block-10.divider_block td.pad {
          padding: 20px 0 !important;
        }
        .row-14 .column-1 .block-4.divider_block td.pad {
          padding: 20px 0 !important;
        }
        .row-14 .column-1 .block-7.divider_block td.pad {
          padding: 20px 0 !important;
        }
        .row-14 .column-1 .block-1.divider_block .alignment table {
          display: inline-table;
        }
        .row-14 .column-1 .block-10.divider_block .alignment table {
          display: inline-table;
        }
        .row-14 .column-1 .block-13.divider_block .alignment table {
          display: inline-table;
        }
        .row-14 .column-1 .block-4.divider_block .alignment table {
          display: inline-table;
        }
        .row-14 .column-1 .block-7.divider_block .alignment table {
          display: inline-table;
        }
        .row-15 .column-2 .block-1.divider_block .alignment table {
          display: inline-table;
        }
        .row-16 .column-2 .block-1.divider_block .alignment table {
          display: inline-table;
        }
        .row-14 .column-1 .block-1.divider_block .alignment {
          text-align: center !important;
          font-size: 1px;
        }
        .row-14 .column-1 .block-10.divider_block .alignment {
          text-align: center !important;
          font-size: 1px;
        }
        .row-14 .column-1 .block-13.divider_block .alignment {
          text-align: center !important;
          font-size: 1px;
        }
        .row-14 .column-1 .block-4.divider_block .alignment {
          text-align: center !important;
          font-size: 1px;
        }
        .row-14 .column-1 .block-7.divider_block .alignment {
          text-align: center !important;
          font-size: 1px;
        }
        .row-15 .column-2 .block-1.divider_block .alignment {
          text-align: center !important;
          font-size: 1px;
        }
        .row-16 .column-2 .block-1.divider_block .alignment {
          text-align: center !important;
          font-size: 1px;
        }
        .row-14 .column-1 .block-13.divider_block td.pad {
          padding: 20px 0 40px !important;
        }
        .row-15 .column-2 .block-1.divider_block td.pad {
          padding: 5px 0 24px !important;
        }
        .row-16 .column-2 .block-1.divider_block td.pad {
          padding: 5px 0 24px !important;
        }
        .row-17 .column-1 .block-2.paragraph_block td.pad>div {
          text-align: center !important;
          font-size: 12px !important;
        }
        .row-17 .column-1 .block-2.paragraph_block td.pad {
          padding: 35px 0 10px !important;
        }
        .row-18 .column-1 .block-1.image_block td.pad {
          padding: 0 0 20px !important;
        }
        .row-18 .column-1 .block-2.paragraph_block td.pad>div {
          font-size: 14px !important;
        }
        .row-20 .column-1 .block-2.paragraph_block td.pad>div {
          font-size: 14px !important;
        }
        .row-20 .column-1 .block-3.paragraph_block td.pad>div {
          font-size: 14px !important;
        }
        .row-18 .column-1 .block-2.paragraph_block td.pad {
          padding: 5px 0 0 !important;
        }
        .row-19 .column-1 .block-1.paragraph_block td.pad>div {
          text-align: center !important;
          font-size: 14px !important;
        }
        .row-1 .column-1 {
          padding: 10px 0 20px !important;
        }
        .row-2 .column-1 {
          padding: 32px 20px !important;
        }
        .row-4 .column-1 {
          padding: 35px 20px !important;
        }
        .row-5 .column-1 {
          padding: 46px 20px 35px !important;
        }
        .row-14 .column-1 {
          padding: 0px 20px 0 !important;
        }
        .row-6 .column-1 {
          padding: 10px 20px 0 !important;
        }
        .row-7 .column-1 {
          padding: 10px 10px 0 20px !important;
        }
        .row-6 .column-2 {
          padding: 10px 10px 0 !important;
        }
        .row-7 .column-2 {
          padding: 10px 20px 0 5px !important;
        }
        .row-6 .column-3 {
          padding: 0 20px 15px !important;
        }
        .row-7 .column-3 {
          padding: 0 20px 15px !important;
        }
        .row-8 .column-1 {
          padding: 25px 20px 5px !important;
        }
        .row-10 .column-1 {
          padding: 0 20px 10px !important;
        }
        .row-11 .column-1 {
          padding: 0 20px 10px !important;
        }
        .row-12 .column-1 {
          padding: 0 20px 10px !important;
        }
        .row-13 .column-1 {
          padding: 0 20px 0px !important;
        }
        .row-9 .column-1 {
          padding: 0 20px 10px !important;
        }
        .row-12 .column-2 {
          padding: 0 30px 10px 0 !important;
        }
        .row-9 .column-2 {
          padding: 0 30px 10px 0 !important;
        }
        .row-10 .column-2 {
          padding: 0 30px 5px 0 !important;
        }
        .row-11 .column-2 {
          padding: 0 30px 5px 0 !important;
        }
        .row-13 .column-2 {
          padding: 0 30px 0 0 !important;
        }
        .row-15 .column-1 {
          padding: 0 20px !important;
        }
        .row-15 .column-2 {
          padding: 0 20px !important;
        }
        .row-16 .column-1 {
          padding: 16px 20px 5px !important;
        }
        .row-16 .column-2 {
          padding: 0 20px 16px !important;
        }
        .row-17 .column-1 {
          padding: 5px 20px 35px !important;
        }
        .row-18 .column-1 {
          padding: 46px 30px 0 !important;
        }
        .row-19 .column-1 {
          padding: 40px 10px 0 !important;
        }
        .row-20 .column-1 {
          padding: 20px 25px 0 !important;
        }
      }
    </style>
  </head>
  <body style="box-sizing: border-box; margin: 0; padding: 0;">
    <title style="box-sizing: border-box;"></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" style="box-sizing: border-box;" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" style="box-sizing: border-box;" />
    <div class="preheader" style="display: none; font-size: 1px; color: #333333; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; box-sizing: border-box;"></div>
    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;" bgcolor="#ffffff">
      <tbody style="box-sizing: border-box;">
        <tr style="box-sizing: border-box;">
          <td style="box-sizing: border-box;">
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 36px; padding-top: 36px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="width: 100%; padding-right: 0px; padding-left: 0px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="line-height: 10px; box-sizing: border-box;">
                                      <div style="max-width: 200px; box-sizing: border-box;">
                                        <a href="https://ausbeds.com.au" target="_blank" style="outline: none; box-sizing: border-box;" tabindex="-1">
                                          <img src="https://cdn.ausbeds.com.au/b594e9ab-11f8-4524-8a38-cb258c507c7c.png" style="display: block; height: auto; width: 100%; box-sizing: border-box; border-width: 0;" width="200" alt="Ausbeds mattress shop Sydney" title="Ausbeds mattress shop Sydney" height="auto" />
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;" bgcolor="#ffffff">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 32px 32px 0 0; border-top-width: 2px; border-top-color: #ffffff; border-top-style: solid; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box; padding: 50px 60px 30px; border-width: 0px;" align="left" valign="middle">
                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td style="width: 100%; padding-bottom: 10px; padding-right: 0px; padding-left: 0px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="line-height: 10px; box-sizing: border-box;">
                                      <div class="fullWidth" style="max-width: 100%; box-sizing: border-box; font-family: 'Permanent Marker'; font-size: 32px; line-height: 1.1;">
                                        <img src="https://cdn.ausbeds.com.au/7897c302-bc50-4e97-a2aa-98c3f995d8ff.png" style="display: block; height: auto; width: 100%; box-sizing: border-box; border-width: 0;" width="240" alt="Thank you for your order!" title="Thank you for your order!" height="auto" />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box; padding: 20px 10px 15px;">
                                    <div style="color: #000; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 17px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 20.4px; box-sizing: border-box;" align="center">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">Order #${ order.order_number }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="divider_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 10px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            ${ itemsHtml }
            <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box; padding: 25px 60px 5px; border-width: 0px;" align="left" valign="top">
                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 10px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 14px; padding-left: 60px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">Subtotal</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-right: 60px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="right">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">$${ order.subtotal }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 14px; padding-left: 60px; padding-top: 2px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">Shipping</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-right: 60px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 120%; mso-line-height-alt: 15.6px; box-sizing: border-box;" align="right">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">$${ order.shipping }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-left: 60px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Order total</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td class="column gap" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box;" align="left" valign="top">
                            <table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 15px; height: 15px; box-sizing: border-box;" width="15" height="15"></table>
                          </td>
                          <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-right: 60px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box; text-align: right;" align="right">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">$${ order.total }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-14 desktop_hide" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 5px; padding-top: 5px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Ordered on</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">${ orderDate }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="divider_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Payment method</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">${ paymentMethod }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="divider_block block-7" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-8" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Shipping to</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-9" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">
                                        ${ customerShippingHtml }
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="divider_block block-10" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-11" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Billing details</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-12" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">
                                        ${ customerBillingHtml }
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="divider_block block-13" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-15 mobile_hide" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-left: 60px; padding-top: 16px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Ordered on</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">${ orderDate }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td class="column gap" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box;" align="left" valign="top">
                            <table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 20px; height: 20px; box-sizing: border-box;" width="20" height="20"></table>
                          </td>
                          <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-right: 60px; padding-top: 16px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Payment method</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">${ paymentMethod }</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-16 mobile_hide" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-left: 60px; padding-top: 16px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Shipping to</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">
                                        ${ customerShippingHtml }
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td class="column gap" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box;" align="left" valign="top">
                            <table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 20px; height: 20px; box-sizing: border-box;" width="20" height="20"></table>
                          </td>
                          <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-bottom: 16px; padding-right: 60px; padding-top: 16px; box-sizing: border-box; border-width: 0px;" align="left" valign="top">
                            <table class="divider_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-bottom: 24px; padding-top: 10px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="box-sizing: border-box;">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                                        <tbody>
                                          <tr style="box-sizing: border-box;">
                                            <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top-width: 1px; border-top-color: #dddddd; border-top-style: solid; box-sizing: border-box;"><span style="word-break: break-word; box-sizing: border-box;"> </span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 18px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 27px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0; font-weight: bold;">Billing details</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 13px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 19.5px; box-sizing: border-box;" align="left">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">
                                        ${ customerBillingHtml }
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-17" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;" bgcolor="#ffffff">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-bottom-width: 2px; border-bottom-color: #ffffff; border-bottom-style: solid; border-radius: 0 0 32px 32px; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box; padding: 20px 60px 50px; border-width: 0px;" align="left" valign="middle">
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box; padding: 35px 10px 10px;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 17px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 25.5px; box-sizing: border-box;" align="center">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">
                                        Questions? <strong>Call (02) 8999 3333</strong></p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-18" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;" bgcolor="#ffffff">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 32px; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto; border: 2px solid #ffffff;" width="600" bgcolor="#97D7ED">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; padding-left: 60px; padding-right: 60px; padding-top: 56px; box-sizing: border-box; border-width: 0px;" align="left" valign="middle">
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-top: 0px; box-sizing: border-box;">
                                    <div style="color: #29292c; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 17px; font-weight: 400; letter-spacing: 0px; line-height: 180%; mso-line-height-alt: 30.6px; box-sizing: border-box;" align="center">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">
                                        Thanks for your order! We're already getting things moving. Someone from our team will be in touch shortly to organise a delivery time that suits. Remember, you've got a 100-night trial to make sure it's perfect. If it's not quite right, we'll happily make tweaks until you're sleeping soundly. You can read all the details on our <a href="https://ausbeds.com.au/policies/returns" style="color: #29292c">support</a> page. Cheers!
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="padding-top: 40px; padding-bottom: 40px; width: 100%; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="line-height: 10px; box-sizing: border-box;">
                                      <div style="max-width: 150px; box-sizing: border-box;">
                                        <img src="https://cdn.ausbeds.com.au/4bbf8f92-d337-4612-8201-53fad1a84820.png" style="display: block; height: auto; width: 100%; box-sizing: border-box; border-width: 0;" width="476" height="auto" />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-20" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
              <tbody style="box-sizing: border-box;">
                <tr style="box-sizing: border-box;">
                  <td style="box-sizing: border-box;">
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 600px; box-sizing: border-box; margin: 0 auto;" width="600">
                      <tbody style="box-sizing: border-box;">
                        <tr style="box-sizing: border-box;">
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; box-sizing: border-box; padding: 20px 60px 5px; border-width: 0px;" align="left" valign="top">
                            <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="box-sizing: border-box; padding: 10px 10px 25px;">
                                    <div style="color: #7d7a79; direction: ltr; font-family: 'Inter', Helvetica, Arial, Open Sans; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 150%; mso-line-height-alt: 21px; box-sizing: border-box;" align="center">
                                      <p style="box-sizing: border-box; line-height: inherit; margin: 0;">Ausbeds<br style="box-sizing: border-box;" />136 Victoria Rd<br style="box-sizing: border-box;" />Marrickville, NSW, 2204</p>
                                      <p style="box-sizing: border-box; line-height: inherit; margin-top: 15px; color: #7d7a79">sales@ausbeds.com.au</p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="image_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box;">
                              <tbody>
                                <tr style="box-sizing: border-box;">
                                  <td class="pad" style="width: 100%; padding-right: 0px; padding-left: 0px; box-sizing: border-box;">
                                    <div class="alignment" align="center" style="line-height: 10px; box-sizing: border-box;">
                                      <div style="max-width: 144px; box-sizing: border-box; padding-bottom: 30px;">
                                        <a href="https://ausbeds.com.au" target="_blank" style="outline: none; box-sizing: border-box;" tabindex="-1">
                                          <img src="https://cdn.ausbeds.com.au/b594e9ab-11f8-4524-8a38-cb258c507c7c.png" style="display: block; height: auto; width: 100%; box-sizing: border-box; border-width: 0;" width="144" alt="Ausbeds mattress shop Sydney" title="Ausbeds mattress shop Sydney" height="auto" />
                                        </a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`

  const invoiceUrl = order.invoices.length && order.invoices[0].invoices_id?.invoice.id ? `${directusUrl}/assets/${order.invoices[0].invoices_id.invoice.id}/${order.invoices[0].invoices_id.invoice.filename_download}` : null
  const invoiceResponse = await fetch(invoiceUrl)
  const invoiceBuffer = await invoiceResponse.arrayBuffer()
  const invoiceBase64 = Buffer.from(invoiceBuffer).toString('base64')

  let attachments = []
  if (invoiceUrl) {
    attachments.push({
      ContentType: 'application/pdf',
      Filename: `Ausbeds_Invoice_${order.order_number}.pdf`,
      Base64Content: invoiceBase64
    })
  }

  let to = {
    Email: order.customer.email,
    Name: order.customer.name
  }

  if (test) {
    to = {
      Email: 'tech@ausbeds.com.au',
      Name: 'Alex'
    }
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
        To: [to],
        Subject: 'Order received - Ausbeds',
        HTMLPart: htmlContent,
        Attachments: attachments
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