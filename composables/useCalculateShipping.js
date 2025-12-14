import { setOptions, importLibrary } from "@googlemaps/js-api-loader"

export const useCalculateShipping = async (address) => {
  const config = useRuntimeConfig()

  if (!address || address.trim() === '') {
    return { 
      status: 'error', 
      message: 'No address provided.' 
    }
  }

  // Variables
  let baseCost = 0
  let deliveryCost = 0

  // Warehouse locations
  const origins = [
    '136 Victoria Road, Marrickville NSW',
    'Docklands, VIC',
    'Queen St Mall, Brisbane QLD',
    '180 London Cct, Canberra ACT'
  ]

  // Route polylines for major highways
  const highwayPolylines = {
    brisbane: config.public.sydneyToBrisbanePolyline,
    melbourne: config.public.sydneyToMelbournePolyline,
    canberra: config.public.sydneyToCanberraPolyline,
  }

  // Load Google Maps API
  setOptions({ key: 'AIzaSyCAn-JvV4sTaGP5P4zFb0PlzFYOinzH1A8' })

  await importLibrary('routes')

  const directionsService = new google.maps.DirectionsService()
  const distanceMatrix = new google.maps.DistanceMatrixService()

  // Get closest warehouse and calculate distance
  const reqDistance = {
    origins,
    destinations: [address],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  }

  const distance = await distanceMatrix.getDistanceMatrix(reqDistance)

  let shippingOrigin = ''
  let minDistanceIndex = -1
  let distanceArr = []

  distance.rows.forEach(row => {
    const element = row.elements[0]
    if (element.status === 'OK') {
      distanceArr.push(element.distance.value)
    }
  })

  minDistanceIndex = distanceArr.indexOf(Math.min(...distanceArr))

  // Set shipping origin and base cost
  shippingOrigin = origins[minDistanceIndex]
  // If warehouse base is not in Sydney, set base cost to $190
  if (shippingOrigin !== origins[0]) {
    baseCost = 190
  }

  // console.log('Shipping origin: ', shippingOrigin)

  // Get route distance from warehouse to address
  const reqDirections = {
    origin: shippingOrigin,
    destination: address,
    travelMode: google.maps.TravelMode.DRIVING
  }

  const directionResponse = await directionsService.route(reqDirections)
  const route = directionResponse.routes[0].legs[0]
  if (!directionResponse.routes.length) {
    return {
      status: 'error',
      message: 'Could not calculate the route.'
    }
  }

  const distanceKm = Math.round(route.distance?.value / 1000 || 0)

  // console.log('Distance (km): ', distanceKm)

  if (distanceKm <= 15) {
    deliveryCost = 0
    return {
      status: 'success',
      cost: baseCost + deliveryCost,
      message: 'Within free delivery range.'
    }
  } else if (distanceKm <= 110) {
    deliveryCost = Math.ceil(distanceKm * 2)
    return {
      status: 'success',
      cost: baseCost + deliveryCost,
      message: `Delivery cost calculated for ${distanceKm} km.`
    }
  } else {
    // If over 110km, check if near a major highway
    const geocoder = new google.maps.Geocoder()
    const geocodeAddress = (address) => {
      return new Promise((resolve, reject) => {
        geocoder.geocode({ 'address': address }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].geometry.location)
          } else {
            reject('Geocode was not successful for the following reason: ' + status)
          }
        })
      })
    }

    const locationLatLng = await geocodeAddress(address)
    const toleranceMeters = 22000 // 22 km
    const routeStrings = Object.values(highwayPolylines)

    let nearHighway = false
    for (const polylineString of routeStrings) {
      const decodedPath = google.maps.geometry.encoding.decodePath(polylineString)
      const routePolyline = new google.maps.Polyline({ path: decodedPath })

      if (google.maps.geometry.poly.isLocationOnEdge(locationLatLng, routePolyline, toleranceMeters)) {
        nearHighway = true
        break
      }
    }

    if (nearHighway) {
      // console.log('Address is near a major highway.')
      deliveryCost = 0
      baseCost = 190
      return {
        status: 'success',
        cost: baseCost + deliveryCost,
        message: 'Address is near a major highway, allowing delivery.'
      }
    }
  }

  return { 
    status: 'error', 
    message: 'Address is outside our delivery range.' 
  }

}