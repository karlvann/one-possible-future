import * as Sentry from '@sentry/nuxt'

// DSN removed - this is a demo project, don't send errors to production Sentry
Sentry.init({
  dsn: '',
  tracesSampleRate: 0,
  debug: false
})
