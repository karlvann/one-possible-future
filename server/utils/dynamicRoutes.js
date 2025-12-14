import fetch from 'node-fetch'

async function fetchDirectusItems(endpoint, fields) {
  const apiUrl = 'https://content.ausbeds.com.au/items/'
  try {
    const response = await fetch(`${apiUrl}${endpoint}?fields=${fields.join(',')}&limit=-1&status=published`)
    const data = await response.json()
    // console.log(data)
    return data.data || []
  } catch (error) {
    console.error(`❌ Error fetching from Directus endpoint [${endpoint}]:`, error)
    return []
  }
}

const staticRoutes = [
  { loc: '/', changefreq: 'weekly', priority: 1 },
  { loc: '/mattress-guide', changefreq: 'weekly', priority: 0.8 },
]

export async function getDynamicSitemapRoutes() {
  // console.log('🚀 Fetching dynamic routes...')

  const dynamicRoutes = []
  const defaultDate = new Date().toISOString().split('T')[0]
  const formatDate = (d) => (d ? d.substring(0, 10) : defaultDate)

  const standardEndpoints = [
    { name: 'articles', path: '/guides/' },
    { name: 'products', path: '/mattresses/' },
    { name: 'article_categories', path: '/mattress-guide/' },
    { name: 'policies', path: '/policies/' }
  ]

  for (const endpoint of standardEndpoints) {
    const items = await fetchDirectusItems(endpoint.name, ['slug', 'status', 'date_updated'])
    items.forEach(item => {
      if (item?.status && item.status !== 'published') {
        // console.warn(`⚠️ Skipping slug "${item.slug}" due to status "${item.status}"`)
        return
      }
      dynamicRoutes.push({
        loc: `${endpoint.path}${item.slug}`,
        lastmod: formatDate(item.date_updated),
      })
    })
  }

  // --- Process special 'page' endpoint ---
  const pageItems = await fetchDirectusItems('pages', ['slug', 'status', 'path', 'date_updated'])
  pageItems.forEach(item => {
    
    if (item?.status && item.status !== 'published') {
      // console.warn(`⚠️ Skipping slug "${item.slug}" due to status "${item.status}"`)
      return
    }

    let basePath = ''
    if (item.path) {
      basePath = `/${item.path}`
    }

    // console.log(`🔍 Processing page slug "${item.slug}" with path "${item.path}"`)

    dynamicRoutes.push({
      loc: `${basePath}/${item.slug}`,
      lastmod: formatDate(item.date_updated),
    })
  })

  const allRoutes = [...staticRoutes, ...dynamicRoutes]
  // console.log(`✅ Found ${dynamicRoutes.length} total dynamic routes.`)
  return allRoutes
}