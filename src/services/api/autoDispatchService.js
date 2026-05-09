import { supabase } from './supabaseClient'
import { haversineDistance } from './fareEstimationService'

/**
 * Score un conducteur pour le dispatch automatique.
 * Formule : score = (1/distance * 0.5) + (rating/5 * 0.3) + (acceptance_rate * 0.2)
 */
function scoreDriver(driver, pickupLat, pickupLon) {
  const loc = driver.last_location
  if (!loc?.lat || !loc?.lon) return 0

  const distKm = haversineDistance(pickupLat, pickupLon, loc.lat, loc.lon) / 1000
  const distScore   = distKm < 0.1 ? 1 : 1 / (distKm + 0.5)
  const ratingScore = (driver.rating || 4.5) / 5
  const acceptRate  = driver.acceptance_rate != null ? driver.acceptance_rate / 100 : 0.8

  return distScore * 0.5 + ratingScore * 0.3 + acceptRate * 0.2
}

/**
 * Trouve le meilleur conducteur pour une course.
 * Retourne le conducteur avec le score le plus élevé dans un rayon de maxRadiusKm.
 */
export async function findBestDriver({ pickupLat, pickupLon, serviceType, maxRadiusKm = 5 }) {
  let candidates = []

  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name, phone, rating, vehicle, zone, is_online, last_location, acceptance_rate, status')
      .eq('status', 'Approuvé')
      .eq('is_online', true)

    if (!error && data?.length > 0) {
      candidates = data
    }
  } catch {
    // fallback mock
  }

  if (candidates.length === 0) {
    candidates = getMockDriversWithLocations()
  }

  // Filtrer par véhicule si nécessaire
  const needsMoto    = serviceType?.toLowerCase().includes('moto')
  const needsVoiture = serviceType?.toLowerCase().includes('premium')
  const filtered = candidates.filter(d => {
    if (needsMoto    && d.vehicle?.toLowerCase().includes('voiture')) return false
    if (needsVoiture && d.vehicle?.toLowerCase().includes('moto'))    return false
    return true
  })

  // Scorer et trier
  const scored = filtered
    .map(d => {
      const loc = d.last_location
      const distMeters = loc?.lat && loc?.lon
        ? haversineDistance(pickupLat, pickupLon, loc.lat, loc.lon)
        : Infinity
      return { ...d, distMeters, score: scoreDriver(d, pickupLat, pickupLon) }
    })
    .filter(d => d.distMeters <= maxRadiusKm * 1000)
    .sort((a, b) => b.score - a.score)

  return scored[0] || null
}

/**
 * Dispatch automatique : trouve le meilleur conducteur et crée la course
 */
export async function autoDispatch({ pickup, dropoff, pickupLat, pickupLon, client, serviceType, price, distance }) {
  const best = await findBestDriver({ pickupLat, pickupLon, serviceType })
  if (!best) throw new Error('Aucun conducteur disponible dans un rayon de 5 km')

  const ridePayload = {
    pickup_address: pickup,
    destination_address: dropoff,
    status: 'accepted',
    category: serviceType?.toLowerCase().includes('livraison') ? 'delivery' : 'taxi',
    type: serviceType,
    price: price ?? 0,
    distance_meters: distance ?? 0,
    payment_status: 'pending',
    driver_id: best.id,
    client_name: client || null,
    dispatched_by: 'auto',
    auto_dispatched: true,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase.from('rides').insert(ridePayload).select().single()
    if (error) throw error
    return { ride: data, driver: best }
  } catch (err) {
    console.warn('autoDispatch: simulation locale', err.message)
    return {
      ride: { id: `RID-AUTO-${Date.now()}`, ...ridePayload },
      driver: best,
      simulated: true,
    }
  }
}

/**
 * Compte les conducteurs disponibles par zone
 */
export async function getDriverCountByZone() {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('zone')
      .eq('status', 'Approuvé')
      .eq('is_online', true)
    if (!error && data) {
      return data.reduce((acc, d) => {
        acc[d.zone] = (acc[d.zone] || 0) + 1
        return acc
      }, {})
    }
  } catch { /* fallback */ }
  return { 'Dakar Centre': 4, 'Plateau': 3, 'Parcelles': 2, 'Almadies': 1 }
}

function getMockDriversWithLocations() {
  return [
    { id: 'DRV-001', name: 'Oumar Sall',     phone: '+221 77 100 22 33', vehicle: 'Moto',    zone: 'Dakar Centre', rating: 4.8, acceptance_rate: 92, last_location: { lat: 14.693, lon: -17.447 } },
    { id: 'DRV-003', name: 'Ibrahima Ba',    phone: '+221 70 300 44 55', vehicle: 'Moto',    zone: 'Plateau',      rating: 4.9, acceptance_rate: 95, last_location: { lat: 14.691, lon: -17.441 } },
    { id: 'DRV-005', name: 'Abdoulaye Mbaye',phone: '+221 76 500 66 77', vehicle: 'Voiture', zone: 'Dakar Centre', rating: 4.6, acceptance_rate: 88, last_location: { lat: 14.700, lon: -17.460 } },
  ]
}
