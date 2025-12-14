import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: 'https://2c6ff9530f35b258e8b490f59170578a@o4510083863609344.ingest.us.sentry.io/4510083864657920',
  tracesSampleRate: 1.0,
  debug: false
})
