export const useCdn = (imgId, imgPath = '', width = 0, height = 0 ) => {
  if (imgPath === '') return `https://cdn.ausbeds.com.au/${imgId}`
  if (width === 0) return `https://cdn.ausbeds.com.au/${imgId}/${imgPath}`
  if (height === 0) return `https://cdn.ausbeds.com.au/${imgId}/${imgPath}?width=${width}`
  return `https://cdn.ausbeds.com.au/${imgId}/${imgPath}?width=${width}&height=${height}`
}