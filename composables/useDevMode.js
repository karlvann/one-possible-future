/**
 * Dev Mode Composable
 *
 * Controls visibility of SEO annotations and developer notes.
 * Defaults to OFF (customer view) - annotations hidden.
 * Persists preference in localStorage.
 */

export const useDevMode = () => {
  // Default to false (customer view)
  const devMode = useState('devMode', () => false)

  // Initialize from localStorage on client
  if (import.meta.client) {
    const stored = localStorage.getItem('ausbeds-dev-mode')
    if (stored !== null) {
      devMode.value = stored === 'true'
    }
  }

  const toggleDevMode = () => {
    devMode.value = !devMode.value
    if (import.meta.client) {
      localStorage.setItem('ausbeds-dev-mode', devMode.value.toString())
    }
  }

  const setDevMode = (value) => {
    devMode.value = value
    if (import.meta.client) {
      localStorage.setItem('ausbeds-dev-mode', value.toString())
    }
  }

  return {
    devMode: readonly(devMode),
    isDevMode: computed(() => devMode.value),
    toggleDevMode,
    setDevMode
  }
}
