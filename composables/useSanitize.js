export const useSanitize = (html) => {
  let htmlContent = html

  const baseUrls = ['https://ausbeds.com.au']
  const regex = /<a\s+([^>]*?)>/gi

  if (!html) return null

  const updatedHtml = htmlContent.replace(regex, (match, attrs) => {
    let hrefMatch = attrs.match(/href\s*=\s*(['"])(.*?)\1/i)
    let href = hrefMatch ? hrefMatch[2] : ''
    let isLocal = href.startsWith('/') || baseUrls.some(baseUrl => href.startsWith(baseUrl))
    let hasTargetAttr = attrs.match(/target\s*=\s*(['"]).*?\1/i)

    if (isLocal) {
      attrs = attrs.replace(/target\s*=\s*(['"]).*?\1/i, '')
    } else if (!hasTargetAttr) {
      attrs += ' target="_blank" rel="noopener noreferrer"'
    }

    if (href.startsWith('https://ausbeds.com.au')) { // make links relative
      attrs = attrs.replace(/href\s*=\s*(['"])(https:\/\/ausbeds\.com\.au)(.*?)\1/i, 'href="$3"')
    }

    if (isLocal && href.endsWith('/')) { // remove trailing slash
      attrs = attrs.replace(/href\s*=\s*(['"])(.*?)\/\1/i, 'href="$2"')
    }
    
    return `<a ${attrs}>`
  })

  return updatedHtml
}