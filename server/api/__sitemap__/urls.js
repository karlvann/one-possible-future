import { getDynamicSitemapRoutes } from '../../utils/dynamicRoutes'
export default defineSitemapEventHandler(async () => {
  const getRoutes = await getDynamicSitemapRoutes()
  return getRoutes
})