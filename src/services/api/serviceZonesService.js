import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Données mock pour les zones de service
const MOCK_SERVICE_ZONES = [
  {
    id: 'ZONE-001',
    name: 'Dakar Centre',
    description: 'Centre-ville de Dakar',
    boundaries: {
      type: 'Polygon',
      coordinates: [[[14.68, -17.46], [14.71, -17.46], [14.71, -17.43], [14.68, -17.43], [14.68, -17.46]]],
    },
    center: { lat: 14.695, lon: -17.445 },
    radius: 5000, // mètres
    isActive: true,
    priority: 1,
    pricingMultiplier: 1.0,
    estimatedDemand: 'high',
    driverCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ZONE-002',
    name: 'Plateau',
    description: 'Quartier du Plateau',
    boundaries: {
      type: 'Polygon',
      coordinates: [[[14.70, -17.45], [14.73, -17.45], [14.73, -17.42], [14.70, -17.42], [14.70, -17.45]]],
    },
    center: { lat: 14.715, lon: -17.435 },
    radius: 4000,
    isActive: true,
    priority: 2,
    pricingMultiplier: 1.1,
    estimatedDemand: 'high',
    driverCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ZONE-003',
    name: 'Médina',
    description: 'Quartier de la Médina',
    boundaries: {
      type: 'Polygon',
      coordinates: [[[14.69, -17.44], [14.72, -17.44], [14.72, -17.41], [14.69, -17.41], [14.69, -17.44]]],
    },
    center: { lat: 14.705, lon: -17.425 },
    radius: 3500,
    isActive: true,
    priority: 3,
    pricingMultiplier: 1.0,
    estimatedDemand: 'medium',
    driverCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

const MOCK_DRIVER_ZONES = [
  { driverId: 'DRV-001', zoneId: 'ZONE-001', isPreferred: true, stats: { rides: 45, rating: 4.8 } },
  { driverId: 'DRV-001', zoneId: 'ZONE-002', isPreferred: false, stats: { rides: 12, rating: 4.7 } },
  { driverId: 'DRV-003', zoneId: 'ZONE-002', isPreferred: true, stats: { rides: 55, rating: 4.9 } },
]

/**
 * Récupère toutes les zones de service
 */
export async function getServiceZones(filters = {}) {
  try {
    let query = supabase.from('service_zones').select('*')
    
    if (filters.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive)
    }
    
    const { data, error } = await query.order('priority', { ascending: true })
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getServiceZones: fallback mock', err)
  }
  return resolveMock(MOCK_SERVICE_ZONES)
}

/**
 * Récupère une zone par ID
 */
export async function getServiceZone(zoneId) {
  try {
    const { data, error } = await supabase
      .from('service_zones')
      .select('*')
      .eq('id', zoneId)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getServiceZone: fallback mock', err)
    return MOCK_SERVICE_ZONES.find(z => z.id === zoneId) || null
  }
}

/**
 * Crée une nouvelle zone de service
 */
export async function createServiceZone(zoneData) {
  const zone = {
    name: zoneData.name,
    description: zoneData.description || null,
    boundaries: zoneData.boundaries,
    center: zoneData.center,
    radius: zoneData.radius || 5000,
    is_active: true,
    priority: zoneData.priority || 10,
    pricing_multiplier: zoneData.pricingMultiplier || 1.0,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('service_zones')
      .insert(zone)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createServiceZone: simulation', err)
    return {
      id: `ZONE-${Date.now()}`,
      ...zone,
    }
  }
}

/**
 * Met à jour une zone de service
 */
export async function updateServiceZone(zoneId, updates) {
  try {
    const { data, error } = await supabase
      .from('service_zones')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', zoneId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateServiceZone: simulation', err)
    return { id: zoneId, ...updates }
  }
}

/**
 * Supprime une zone de service
 */
export async function deleteServiceZone(zoneId) {
  try {
    const { error } = await supabase
      .from('service_zones')
      .delete()
      .eq('id', zoneId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('deleteServiceZone: simulation', err)
    return true
  }
}

/**
 * Vérifie si un point est dans une zone
 */
export function isPointInZone(lat, lon, zone) {
  // Simplification: vérifier si le point est dans le rayon du centre
  const distance = calculateDistance(lat, lon, zone.center.lat, zone.center.lon)
  return distance <= zone.radius
}

/**
 * Calcule la distance entre deux points (en mètres)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000 // Rayon de la Terre en mètres
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Trouve la zone pour un point donné
 */
export async function findZoneForPoint(lat, lon) {
  const zones = await getServiceZones({ isActive: true })
  return zones.find(zone => isPointInZone(lat, lon, zone)) || null
}

/**
 * Récupère les zones d'un conducteur
 */
export async function getDriverZones(driverId) {
  try {
    const { data, error } = await supabase
      .from('driver_zones')
      .select('*, service_zones(*)')
      .eq('driver_id', driverId)
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getDriverZones: fallback mock', err)
    return MOCK_DRIVER_ZONES.filter(dz => dz.driverId === driverId)
  }
}

/**
 * Assigne une zone à un conducteur
 */
export async function assignZoneToDriver(driverId, zoneId, isPreferred = false) {
  try {
    const { data, error } = await supabase
      .from('driver_zones')
      .insert({
        driver_id: driverId,
        zone_id: zoneId,
        is_preferred: isPreferred,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('assignZoneToDriver: simulation', err)
    return { driverId, zoneId, isPreferred }
  }
}

/**
 * Retire une zone d'un conducteur
 */
export async function removeZoneFromDriver(driverId, zoneId) {
  try {
    const { error } = await supabase
      .from('driver_zones')
      .delete()
      .eq('driver_id', driverId)
      .eq('zone_id', zoneId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('removeZoneFromDriver: simulation', err)
    return true
  }
}

/**
 * Définit la zone préférée d'un conducteur
 */
export async function setPreferredZone(driverId, zoneId) {
  try {
    // Retirer la préférence actuelle
    await supabase
      .from('driver_zones')
      .update({ is_preferred: false })
      .eq('driver_id', driverId)
    
    // Définir la nouvelle préférence
    const { data, error } = await supabase
      .from('driver_zones')
      .update({ is_preferred: true })
      .eq('driver_id', driverId)
      .eq('zone_id', zoneId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('setPreferredZone: simulation', err)
    return { driverId, zoneId, isPreferred: true }
  }
}

/**
 * Récupère les conducteurs dans une zone
 */
export async function getDriversInZone(zoneId) {
  try {
    const { data, error } = await supabase
      .from('driver_zones')
      .select('driver_id, is_preferred, drivers(id, name, phone, is_online, rating)')
      .eq('zone_id', zoneId)
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getDriversInZone: fallback mock', err)
    return []
  }
}

/**
 * Met à jour les statistiques de zone d'un conducteur
 */
export async function updateDriverZoneStats(driverId, zoneId, stats) {
  try {
    const { error } = await supabase
      .from('driver_zones')
      .update({
        rides: stats.rides,
        rating: stats.rating,
        updated_at: new Date().toISOString(),
      })
      .eq('driver_id', driverId)
      .eq('zone_id', zoneId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('updateDriverZoneStats: simulation', err)
    return true
  }
}

/**
 * Récupère la demande estimée par zone
 */
export async function getZoneDemand() {
  try {
    const { data, error } = await supabase
      .from('zone_demand')
      .select('*')
      .order('demand_score', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getZoneDemand: fallback mock', err)
    return [
      { zoneId: 'ZONE-001', demandScore: 85, trend: 'up' },
      { zoneId: 'ZONE-002', demandScore: 78, trend: 'stable' },
      { zoneId: 'ZONE-003', demandScore: 55, trend: 'down' },
    ]
  }
}

/**
 * Alerte un conducteur s'il sort de sa zone
 */
export async function checkDriverZoneAlert(driverId, lat, lon) {
  const driverZones = await getDriverZones(driverId)
  
  if (driverZones.length === 0) return null
  
  const preferredZone = driverZones.find(dz => dz.isPreferred)
  const zone = preferredZone ? await getServiceZone(preferredZone.zoneId) : null
  
  if (!zone) return null
  
  const inZone = isPointInZone(lat, lon, zone)
  
  if (!inZone) {
    return {
      alert: true,
      message: `Vous êtes sorti de votre zone de service (${zone.name})`,
      zone: zone.name,
    }
  }
  
  return { alert: false }
}

/**
 * Suggère les zones optimales pour un conducteur
 */
export async function suggestOptimalZones(driverId) {
  try {
    // Récupérer la demande actuelle
    const demand = await getZoneDemand()
    
    // Récupérer les zones actuelles du conducteur
    const currentZones = await getDriverZones(driverId)
    const currentZoneIds = currentZones.map(dz => dz.zoneId || dz.zone_id)
    
    // Filtrer les zones avec forte demande où le conducteur n'est pas déjà
    const suggestions = demand
      .filter(d => !currentZoneIds.includes(d.zoneId) && d.demandScore > 60)
      .slice(0, 3)
    
    return suggestions
  } catch (err) {
    console.warn('suggestOptimalZones: fallback', err)
    return [
      { zoneId: 'ZONE-001', demandScore: 85, name: 'Dakar Centre' },
      { zoneId: 'ZONE-002', demandScore: 78, name: 'Plateau' },
    ]
  }
}
