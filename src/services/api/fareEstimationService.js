import { supabase } from './supabaseClient'
import { getSurgePricing } from './surgePricingService'

/**
 * Tarifs de base par type de service (FCFA/km)
 */
export const BASE_RATES = {
  'Moto Taxi':             { base: 300, perKm: 150, minFare: 500,  maxFare: 5000  },
  'Taxi Premium':          { base: 500, perKm: 220, minFare: 1000, maxFare: 15000 },
  'Livraison Express':     { base: 400, perKm: 200, minFare: 800,  maxFare: 8000  },
  'Livraison Alimentaire': { base: 350, perKm: 180, minFare: 600,  maxFare: 6000  },
  'Covoiturage':           { base: 200, perKm: 100, minFare: 300,  maxFare: 3000  },
}

/**
 * Distance Haversine entre deux points GPS (en mètres)
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Estime le tarif d'une course avec surge pricing inclus
 */
export async function estimateFare({ serviceType, distanceMeters, zone = null }) {
  const rate = BASE_RATES[serviceType] || BASE_RATES['Moto Taxi']
  const km = distanceMeters / 1000

  // Tarif brut
  const rawFare = rate.base + km * rate.perKm
  const baseFare = Math.min(Math.max(Math.round(rawFare), rate.minFare), rate.maxFare)

  // Surge multiplier
  let surgeMultiplier = 1.0
  let surgeName = null
  try {
    const surge = await getSurgePricing(zone || 'default')
    surgeMultiplier = surge.multiplier
    surgeName = surge.label
  } catch {
    // no surge
  }

  const finalFare = Math.round(baseFare * surgeMultiplier)

  return {
    baseFare,
    finalFare,
    surgeMultiplier,
    surgeName,
    hasSurge: surgeMultiplier > 1,
    breakdown: {
      baseFee: rate.base,
      distanceFee: Math.round(km * rate.perKm),
      km: parseFloat(km.toFixed(2)),
    },
    formatted: `${finalFare.toLocaleString('fr-FR')} FCFA`,
    range: `${Math.round(finalFare * 0.9).toLocaleString('fr-FR')} – ${Math.round(finalFare * 1.1).toLocaleString('fr-FR')} FCFA`,
  }
}

/**
 * Calcule la distance entre 2 adresses textuelles (via Nominatim OSM gratuit)
 */
export async function estimateFareFromAddresses({ pickupAddress, dropoffAddress, serviceType, zone }) {
  try {
    const encode = (q) => encodeURIComponent(q + ', Sénégal')
    const [fromRes, toRes] = await Promise.all([
      fetch(`https://nominatim.openstreetmap.org/search?q=${encode(pickupAddress)}&format=json&limit=1`).then(r => r.json()),
      fetch(`https://nominatim.openstreetmap.org/search?q=${encode(dropoffAddress)}&format=json&limit=1`).then(r => r.json()),
    ])
    const from = fromRes[0]
    const to   = toRes[0]
    if (!from || !to) throw new Error('Adresse introuvable')

    const distanceMeters = haversineDistance(
      parseFloat(from.lat), parseFloat(from.lon),
      parseFloat(to.lat),   parseFloat(to.lon)
    )
    const durationSeconds = (distanceMeters / 1000) * 3 * 60 // ~3 min/km en ville

    return {
      ...(await estimateFare({ serviceType, distanceMeters, zone })),
      distanceMeters,
      durationSeconds,
      from: { lat: parseFloat(from.lat), lon: parseFloat(from.lon), display: from.display_name },
      to:   { lat: parseFloat(to.lat),   lon: parseFloat(to.lon),   display: to.display_name },
    }
  } catch (err) {
    console.warn('estimateFareFromAddresses fallback:', err.message)
    // Fallback estimation (5 km par défaut)
    const fallbackDistance = 5000
    return {
      ...(await estimateFare({ serviceType, distanceMeters: fallbackDistance, zone })),
      distanceMeters: fallbackDistance,
      durationSeconds: 900,
      isFallback: true,
    }
  }
}

/**
 * Sauvegarde l'estimation en DB pour audit tarifaire
 */
export async function saveEstimation({ rideId, estimation }) {
  try {
    await supabase.from('fare_estimations').insert({
      ride_id: rideId,
      base_fare: estimation.baseFare,
      final_fare: estimation.finalFare,
      surge_multiplier: estimation.surgeMultiplier,
      distance_meters: estimation.distanceMeters,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Non-critique
  }
}
