const defaultTitle = 'Mattress Shop Sydney | Discover & Shop Ausbeds Today'
const defaultDescription = 'Discover comfort at Ausbeds – the trusted mattress shop in Sydney. Visit our Marrickville or Willoughby showroom for honest advice.'
const defaultImage = 'https://cdn.ausbeds.com.au/f58d83f4-ee11-4a15-b80e-0718ce5d76e5/ausbeds-meta-image.png'


function getImageUrl(imageObj) {
  if (!imageObj) return defaultImage
  
  if (typeof imageObj === 'string') return imageObj
  
  if (imageObj.id && imageObj.filename_download) {
    return `https://cdn.ausbeds.com.au/${imageObj.id}/${imageObj.filename_download}`
  }
  
  return defaultImage
}


function useSocialMeta(content, url) {
  const { title, description, image } = content
  const imageUrl = getImageUrl(image)
  const fullUrl = `https://ausbeds.com.au${url === '/' ? '' : url}`
  
  return [
    {
      hid: 'og:title',
      property: 'og:title',
      content: title,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: description,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: imageUrl,
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: fullUrl,
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: 'Ausbeds',
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: 'website',
    },
    
    // Twitter meta
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: title,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: description,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: imageUrl,
    }
  ]
}

export const useSeo = (meta, url, options = {}) => {
  if (!meta) {
    return {
      title: defaultTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: defaultDescription,
        },
        ...useSocialMeta({
          title: defaultTitle,
          description: defaultDescription,
          image: null
        }, url),
      ],
    }
  }
  
  const { meta_title, meta_description, meta_image } = meta
  
  const title = meta_title || defaultTitle
  const description = meta_description || defaultDescription
  
  const socialMetas = useSocialMeta({
    title,
    description,
    image: meta_image
  }, url)
  
  const canonicalHref = options.forceCanonical || `https://ausbeds.com.au${url === '/' ? '' : url}`
  
  return {
    title,
    link: [
      {
        hid: 'canonical',
        rel: 'canonical',
        href: canonicalHref,
      },
    ],
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: description,
      },
      ...socialMetas,
    ],
  }
}