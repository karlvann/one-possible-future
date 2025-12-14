import fetch from 'node-fetch'
import { getDynamicSitemapRoutes } from './server/utils/dynamicRoutes.js'
  
const buildIndex = async () => {

  const getRoutes = await getDynamicSitemapRoutes()
  const routesArray = getRoutes.map(route => 'https://ausbeds.com.au' + route.loc)

  console.log('Submitting URLs to indexnow...', routesArray)

  // console.log('routesArray', routesArray)
  const indexNow = await fetch('https://api.indexnow.org', {
    method: 'POST',
    body: JSON.stringify({
      host: 'https://ausbeds.com.au',
      key: '1026c3075f684cfeac29db3a0687226c',
      keyLocation: 'https://ausbeds.com.au/1026c3075f684cfeac29db3a0687226c.txt',
      urlList: routesArray
    })
  })
  
  if (!indexNow.ok) {
    throw new Error(`HTTP error! status: ${indexNow.status}`)
  } else {
    console.info('URLs submitted to indexnow')
  }

}
  
buildIndex().catch('e: ' + console.error)
   