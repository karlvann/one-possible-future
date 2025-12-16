/**
 * Stub composable for useDirectusItems
 *
 * This provides a no-op implementation when the nuxt-directus module is disabled.
 * Prevents "useDirectusItems is not defined" errors during SSR.
 */

export const useDirectusItems = () => {
  const getItems = async (options) => {
    console.warn('[useDirectusItems] Directus module is disabled. Returning empty array.')
    return []
  }

  const getSingletonItem = async (options) => {
    console.warn('[useDirectusItems] Directus module is disabled. Returning null.')
    return null
  }

  const createItems = async (options) => {
    console.warn('[useDirectusItems] Directus module is disabled. Cannot create items.')
    return null
  }

  const deleteItems = async (options) => {
    console.warn('[useDirectusItems] Directus module is disabled. Cannot delete items.')
    return null
  }

  const updateItem = async (options) => {
    console.warn('[useDirectusItems] Directus module is disabled. Cannot update item.')
    return null
  }

  return {
    getItems,
    getSingletonItem,
    createItems,
    deleteItems,
    updateItem
  }
}
