import { supabase } from './supabaseClient'

/**
 * Service de tracking GPS temps réel via Supabase Realtime
 */

const MOCK_POSITIONS = [
  { id: 'DRV-001', name: 'Oumar Sall',      lat: 14.6937, lon: -17.4441, status: 'on_ride',  vehicle: 'Moto',    zone: 'Plateau',      rating: 4.8 },
  { id: 'DRV-002', name: 'Mame Diarra',     lat: 14.7120, lon: -17.4680, status: 'available',vehicle: 'Moto',    zone: 'Almadies',     rating: 4.6 },
  { id: 'DRV-003', name: 'Ibrahima Ba',     lat: 14.7001, lon: -17.4552, status: 'on_ride',  vehicle: 'Moto',    zone: 'Dakar Centre', rating: 4.9 },
  { id: 'DRV-004', name: 'Seydou Ndiaye',   lat: 14.7241, lon: -17.4386, status: 'available',vehicle: 'Voiture', zone: 'Parcelles',    rating: 4.7 },
  { id: 'DRV-005', name: 'Abdoulaye Mbaye', lat: 14.6820, lon: -17.4600, status: 'available',vehicle: 'Voiture', zone: 'Dakar Centre', rating: 4.6 },
  { id: 'DRV-006', name: 'Rokhaya Diop',    lat: 14.6780, lon: -17.4350, status: 'offline',  vehicle: 'Moto',    zone: 'Plateau',      rating: 4.3 },
  { id: 'DRV-007', name: 'Moussa Faye',     lat: 14.7312, lon: -17.4712, status: 'on_ride',  vehicle: 'Moto',    zone: 'Guédiawaye',   rating: 4.5 },
]

/**
 * Charge les positions initiales de tous les conducteurs en ligne
 */
export async function getDriverPositions() {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name, last_location, is_online, status, vehicle, zone, rating')
      .in('status', ['Approuvé'])
      .eq('is_online', true)

    if (!error && data?.length > 0) {
      return data.map(d => ({
        id: d.id,
        name: d.name,
        lat: d.last_location?.lat || 0,
        lon: d.last_location?.lon || 0,
        status: d.last_location?.status || 'available',
        vehicle: d.vehicle,
        zone: d.zone,
        rating: d.rating,
        fromDB: true,
      })).filter(d => d.lat && d.lon)
    }
  } catch { /* fallback */ }

  // Simuler des positions légèrement différentes à chaque appel
  return MOCK_POSITIONS.map(d => ({
    ...d,
    lat: d.lat + (Math.random() - 0.5) * 0.002,
    lon: d.lon + (Math.random() - 0.5) * 0.002,
  }))
}

/**
 * Met à jour la position d'un conducteur
 */
export async function updateDriverPosition(driverId, { lat, lon, speed, heading, status }) {
  try {
    await supabase.from('drivers').update({
      last_location: { lat, lon, speed, heading, status, updated_at: new Date().toISOString() },
    }).eq('id', driverId)
  } catch (err) {
    console.warn('updateDriverPosition:', err.message)
  }
}

/**
 * S'abonne aux changements de position en temps réel
 * @param {Function} onUpdate — callback({ driverId, lat, lon, status })
 * @returns cleanup function
 */
export function subscribeToDriverPositions(onUpdate) {
  try {
    const channel = supabase.channel('driver-positions')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'drivers',
      }, (payload) => {
        const loc = payload.new?.last_location
        if (loc?.lat && loc?.lon) {
          onUpdate({
            driverId: payload.new.id,
            name: payload.new.name,
            lat: loc.lat,
            lon: loc.lon,
            status: loc.status || 'available',
            vehicle: payload.new.vehicle,
            zone: payload.new.zone,
          })
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  } catch {
    // Supabase non configuré — simuler des updates
    const interval = setInterval(() => {
      const driver = MOCK_POSITIONS[Math.floor(Math.random() * MOCK_POSITIONS.length)]
      if (driver.status !== 'offline') {
        onUpdate({
          driverId: driver.id,
          name: driver.name,
          lat: driver.lat + (Math.random() - 0.5) * 0.001,
          lon: driver.lon + (Math.random() - 0.5) * 0.001,
          status: driver.status,
          vehicle: driver.vehicle,
          zone: driver.zone,
        })
      }
    }, 4000)
    return () => clearInterval(interval)
  }
}

/**
 * S'abonne aux changements de statut des courses en temps réel
 */
export function subscribeToRideEvents(onEvent) {
  try {
    const channel = supabase.channel('ride-events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, (payload) => {
        onEvent({
          type: payload.eventType,
          ride: payload.new,
          old: payload.old,
        })
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  } catch {
    return () => {}
  }
}
