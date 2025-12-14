export default defineEventHandler(event => {
  const countryHeader = getHeader(event, 'x-vercel-ip-country')
  const country = countryHeader ? decodeURIComponent(countryHeader) : 'AU'
  return country
})