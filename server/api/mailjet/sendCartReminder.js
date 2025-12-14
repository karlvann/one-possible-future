import fetch from 'node-fetch'

export default eventHandler(async (event) => {

  const config = useRuntimeConfig()
  const body = await readBody(event)

  const auth = Buffer.from(`${config.mailjetApiKey}:${config.mailjetApiSecret}`).toString('base64')

  const {
    to,
    cartTable
  } = body

  if (!to || !cartTable) {
    console.error('Missing parameters for cart reminder email.')
    return false
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
        To: [
          {
            Email: to,
            Name: ''
          }
        ],
        TemplateID: 7431605,
        TemplateLanguage: true,
        Subject: 'Did you forget something?',
        Variables: {
				  'cart_table': cartTable
				}
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

})  