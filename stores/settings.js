export const useSettingsStore = defineStore('settings-store', {

  persist: true,

  state: () => {
    return {
      //
      loadingModal: false,
      //
      banner: true
    }
  },

  actions: {

    showLoadingModal() {
      this.loadingModal = true
    },
    
    hideLoadingModal() {
      this.loadingModal = false
    }

  }
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
