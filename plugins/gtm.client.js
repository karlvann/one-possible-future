export default defineNuxtPlugin(() => {

  const router = useRouter()
  
  window.dataLayer = window.dataLayer || []

  window.dataLayer.push({
    event: 'gtm.js',
    'gtm.start': Date.now()
  })

  router.afterEach((to) => {
    window.dataLayer.push({
      event: 'pageview',
      page: to.fullPath
    })
  })
  
  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtm.js?id=GTM-WDW2H449`,
        async: true,
      }
    ]
  })
})