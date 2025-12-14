export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const customerAddress = body.address
  const config = useRuntimeConfig()

  if (!customerAddress) {
    return {
      error: {
        message: 'Address is required.'
      }
    }
  }

  const apiKey = config.googleMapsApiKey
  if (!apiKey) {
    return {
      error: {
        message: 'Google Maps is not configured.'
      }
    }
  }

  // Factory location
  const FACTORY_ADDRESS = '136 Victoria Road, Marrickville, NSW, Australia'
  
  // Metro depot locations
  const METRO_DEPOTS = {
    melbourne: {
      address: '768 Bourke St, Docklands VIC 3008',
      city: 'Melbourne'
    },
    brisbane: {
      address: '59 Adelaide St, Brisbane City QLD 4000', 
      city: 'Brisbane'
    },
    canberra: {
      address: '180 London Cct, Canberra ACT 2601',
      city: 'Canberra'
    }
  }

  // Simple polyline decoder
  const decodePolyline = (encoded) => {
    if (!encoded) return []
    
    const points = []
    let index = 0
    let lat = 0
    let lng = 0

    try {
      while (index < encoded.length) {
        let shift = 0
        let result = 0
        let byte

        do {
          byte = encoded.charCodeAt(index++) - 63
          result |= (byte & 0x1f) << shift
          shift += 5
        } while (byte >= 0x20)

        const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
        lat += dlat

        shift = 0
        result = 0

        do {
          byte = encoded.charCodeAt(index++) - 63
          result |= (byte & 0x1f) << shift
          shift += 5
        } while (byte >= 0x20)

        const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
        lng += dlng

        points.push({
          lat: lat / 1e5,
          lng: lng / 1e5
        })
      }
    } catch (e) {
      console.error('Error decoding polyline:', e)
    }

    return points
  }

  // Simple distance calculator (Haversine formula)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Check if location is within tolerance of any point on the polyline
  const distanceToPolyline = (lat, lng, polylineString) => {
    if (!polylineString) return false
    
    try {
      const points = decodePolyline(polylineString)
      
      // Check each point on the polyline
      for (const point of points) {
        const distance = getDistance(lat, lng, point.lat, point.lng)
        if (distance <= 30) { // 30km tolerance
          return distance
        }
      }
      
      return false
    } catch (e) {
      console.error('Error checking polyline proximity:', e)
      return false
    }
  }

  try {
    // Geocode the address
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(customerAddress)}&key=${apiKey}`
    const geocodeResponse = await $fetch(geocodeUrl)
    
    if (geocodeResponse.status !== 'OK' || !geocodeResponse.results.length) {
      return {
        error: {
          message: 'Could not find address. contact us for assistance.'
        }
      }
    }

    const location = geocodeResponse.results[0]

    const addressComponents = location.address_components
    const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name
    const customerLat = location.geometry.location.lat
    const customerLng = location.geometry.location.lng

    // Check for restricted states
    const restrictedStates = {
      'NT': 'Northern Territory',
      'WA': 'Western Australia',
      'TAS': 'Tasmania',
      'SA': 'South Australia'
    }

    if (state && restrictedStates[state]) {
      return {
        error: {
          message: `Sorry, we do not deliver to ${restrictedStates[state]} at this time. Please contact us for assistance.`
        }
      }
    }

    // Calculate distance from factory
    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(FACTORY_ADDRESS)}&destinations=${encodeURIComponent(customerAddress)}&mode=driving&units=metric&key=${apiKey}`
    const distanceResponse = await $fetch(distanceUrl)

    if (distanceResponse.status !== 'OK' || distanceResponse.rows[0].elements[0].status !== 'OK') {
      return {
        error: {
          message: 'Could not calculate distance. Please check the address.'
        }
      }
    }

    const distanceFromFactory = distanceResponse.rows[0].elements[0].distance.value / 1000 // Convert to km

    // RULE 1: Within 15km of factory
    if (distanceFromFactory <= 15) {
      // console.log({
      //   data: {
      //     totalPrice: 0,
      //     message: 'Within 15km of factory',
      //     twoManDeliveryAvailable: true,
      //     twoManTotal: 50
      //   }
      // })
      return {
        data: {
          totalPrice: 0,
          message: 'Within 15km of factory.',
          twoManDeliveryAvailable: true,
          twoManTotal: 50
        }
      }
    }

    // RULE 2: Within 110km of factory
    if (distanceFromFactory <= 110) {
      const deliveryCost = Math.ceil(distanceFromFactory * 2)
      // console.log({
      //   data: {
      //     totalPrice: deliveryCost,
      //     message: `${Math.ceil(distanceFromFactory)}km from factory`,
      //     twoManDeliveryAvailable: true,
      //     twoManTotal: Math.ceil(distanceFromFactory * 4)
      //   }
      // })
      return {
        data: {
          totalPrice: deliveryCost,
          message: `${Math.ceil(distanceFromFactory)}km from factory`,
          twoManDeliveryAvailable: true,
          twoManTotal: Math.ceil(distanceFromFactory * 4)
        }
      }
    }

    // RULE 3: Check metro depots (within 100km)
    let nearestDepot = null
    let shortestDepotDistance = Infinity

    for (const [depot] of Object.entries(METRO_DEPOTS)) {

      const depotDistUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(METRO_DEPOTS[depot].address)}&destinations=${encodeURIComponent(customerAddress)}&mode=driving&units=metric&key=${apiKey}`
      const depotDistResponse = await $fetch(depotDistUrl)
      
      if (depotDistResponse.status === 'OK' && depotDistResponse.rows[0].elements[0].status === 'OK') {
        const distance = depotDistResponse.rows[0].elements[0].distance.value / 1000
        
        if (distance <= 110 && distance < shortestDepotDistance) {
          shortestDepotDistance = distance
          nearestDepot = METRO_DEPOTS[depot].city
        }
      }
    }

    if (nearestDepot) {
      const basePrice = 190
      let deliveryCost = Math.ceil(shortestDepotDistance * 2)
      if (shortestDepotDistance <= 15) {
        deliveryCost = 0
      }
      // console.log({
      //   data: {
      //     totalPrice: basePrice + deliveryCost,
      //     message: `Delivery from ${nearestDepot} depot ($190 base + $2/km)`,
      //     twoManDeliveryAvailable: false, // always 2-person from depots
      //     twoManTotal: null
      //   }
      // })
      return {
        data: {
          totalPrice: basePrice + deliveryCost,
          message: `Delivery from ${nearestDepot} depot ($190 base + $2/km)`,
          twoManDeliveryAvailable: false, // always 2-person from depots
          twoManTotal: null
        }
      }
    }

    // RULE 4: Check if within 20km of highways (using polylines)
    const sydneyToBrisbane = config.public.sydneyToBrisbanePolyline
    const sydneyToMelbourne = config.public.sydneyToMelbournePolyline
    const sydneyToCanberra = config.public.sydneyToCanberraPolyline

    const nearBrisbaneHighway = distanceToPolyline(customerLat, customerLng, sydneyToBrisbane)
    const nearMelbourneHighway = distanceToPolyline(customerLat, customerLng, sydneyToMelbourne)
    const nearCanberraHighway = distanceToPolyline(customerLat, customerLng, sydneyToCanberra)

    if (nearBrisbaneHighway || nearMelbourneHighway || nearCanberraHighway) {
      const basePrice = 190
      let highwayName = 'major highway'
      let distanceFromHighway = 0
      if (nearBrisbaneHighway) {
        highwayName = 'Sydney-Brisbane Highway'
        distanceFromHighway = nearBrisbaneHighway
      }
      else if (nearMelbourneHighway) {
        highwayName = 'Sydney-Melbourne Highway'
        distanceFromHighway = nearMelbourneHighway
      }
      else if (nearCanberraHighway) {
        highwayName = 'Sydney-Canberra Highway'
        distanceFromHighway = nearCanberraHighway
      }

      // add an extra $80 distances between 10-30km
      let deliveryCost = 80
      if (distanceFromHighway <= 10) {
        deliveryCost = 0
      }

      // console.log({
      //   data: {
      //     totalPrice: basePrice + deliveryCost,
      //     message: `Near ${highwayName}`,
      //     twoManDeliveryAvailable: false,
      //     twoManTotal: null
      //   }
      // })

      return {
        data: {
          totalPrice: basePrice + deliveryCost,
          message: `Near ${highwayName}`,
          twoManDeliveryAvailable: false,
          twoManTotal: null
        }
      }
    }

    // console.log('Sorry, this address is outside our delivery range.')

    return {
      error: {
        message: 'Sorry, this address is outside our delivery range. Please contact us for assistance.'
      }
    }

  } catch (error) {
    console.error('Delivery calculation error:', error)
    return {
      error: {
        message: error.message || 'An error occurred while calculating delivery cost. Please try again.'
      }
    }
  }
})