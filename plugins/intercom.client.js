export default defineNuxtPlugin(() => {
  setTimeout(() => {
    if (typeof window.Intercom === 'function') {
      Intercom('onShow', function() {
        umTrackEvent('intercom_chat_opened')
      })
      Intercom('onUserEmailSupplied', function () {
        umTrackEvent('intercom_email_supplied')
      })
    }
  }, 2500)
})