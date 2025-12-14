import fetch from 'node-fetch'

export default eventHandler(async (event) => {

  const config = useRuntimeConfig()
  const body = await readBody(event)

  const auth = Buffer.from(`${config.mailjetApiKey}:${config.mailjetApiSecret}`).toString('base64')

  const {
    to,
    subject,
    message
  } = body

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
        To: to,
        Subject: subject,
        TextPart: message,
        ReplyTo: {
          Email: 'sales@ausbeds.com.au',
          Name: 'Karl from Ausbeds'
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