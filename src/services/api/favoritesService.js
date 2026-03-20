import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Données mock pour les favoris
const MOCK_FAVORITE_ADDRESSES = [
  { id: 'FAV-001', userId: 'USR-001', label: 'Domicile', address: 'Dakar Plateau, Rue 10x', lat: 14.6928, lon: -17.4467, isDefault: true, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'FAV-002', userId: 'USR-001', label: 'Travail', address: 'Dakar Médina, Avenue Cheick Anta Diop', lat: 14.7012, lon: -17.4523, isDefault: false, createdAt: '2024-01-20T09:00:00Z' },
  { id: 'FAV-003', userId: 'USR-001', label: 'Gym', address: 'Parcelles Assainies, Centre Sportif', lat: 14.7234, lon: -17.4389, isDefault: false, createdAt: '2024-02-01T08:00:00Z' },
]

const MOCK_FAVORITE_DRIVERS = [
  { id: 'FDR-001', userId: 'USR-001', driverId: 'DRV-001', driverName: 'Oumar Sall', driverPhone: '+221 77 100 22 33', vehicle: 'Moto', rating: 4.8, totalRides: 5, lastRideDate: '2024-03-10T14:30:00Z', createdAt: '2024-02-15T10:00:00Z' },
  { id: 'FDR-002', userId: 'USR-002', driverId: 'DRV-003', driverName: 'Ibrahima Ba', driverPhone: '+221 70 300 44 55', vehicle: 'Moto', rating: 4.9, totalRides: 3, lastRideDate: '2024-03-12T09:15:00Z', createdAt: '2024-02-20T11:00:00Z' },
]

/**
 * Récupère les adresses favorites d'un utilisateur
 */
export async function getFavoriteAddresses(userId) {
  try {
    const { data, error } = await supabase
      .from('favorite_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getFavoriteAddresses: fallback mock', err)
  }
  return resolveMock(MOCK_FAVORITE_ADDRESSES.filter(f => f.userId === userId))
}

/**
 * Ajoute une adresse aux favoris
 */
export async function addFavoriteAddress({ userId, label, address, lat, lon, isDefault = false }) {
  const addressData = {
    user_id: userId,
    label,
    address,
    lat,
    lon,
    is_default: isDefault,
    created_at: new Date().toISOString(),
  }

  try {
    // Si c'est l'adresse par défaut, on retire le défaut des autres
    if (isDefault) {
      await supabase
        .from('favorite_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
    }

    const { data, error } = await supabase
      .from('favorite_addresses')
      .insert(addressData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('addFavoriteAddress: simulation locale', err)
    return {
      id: `FAV-${Date.now()}`,
      ...addressData,
    }
  }
}

/**
 * Met à jour une adresse favorite
 */
export async function updateFavoriteAddress(addressId, updates) {
  try {
    const { data, error } = await supabase
      .from('favorite_addresses')
      .update(updates)
      .eq('id', addressId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateFavoriteAddress: simulation', err)
    return { id: addressId, ...updates }
  }
}

/**
 * Supprime une adresse favorite
 */
export async function deleteFavoriteAddress(addressId) {
  try {
    const { error } = await supabase
      .from('favorite_addresses')
      .delete()
      .eq('id', addressId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('deleteFavoriteAddress: simulation', err)
    return true
  }
}

/**
 * Définit une adresse comme adresse par défaut
 */
export async function setDefaultAddress(userId, addressId) {
  try {
    // Retirer le défaut de toutes les adresses
    await supabase
      .from('favorite_addresses')
      .update({ is_default: false })
      .eq('user_id', userId)
    
    // Définir la nouvelle adresse par défaut
    const { data, error } = await supabase
      .from('favorite_addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('setDefaultAddress: simulation', err)
    return { id: addressId, is_default: true }
  }
}

/**
 * Récupère les conducteurs favoris d'un utilisateur
 */
export async function getFavoriteDrivers(userId) {
  try {
    const { data, error } = await supabase
      .from('favorite_drivers')
      .select(`
        *,
        drivers(id, name, phone, vehicle, rating)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getFavoriteDrivers: fallback mock', err)
  }
  return resolveMock(MOCK_FAVORITE_DRIVERS.filter(f => f.userId === userId))
}

/**
 * Ajoute un conducteur aux favoris
 */
export async function addFavoriteDriver({ userId, driverId, driverName, driverPhone, vehicle, rating }) {
  const driverData = {
    user_id: userId,
    driver_id: driverId,
    driver_name: driverName,
    driver_phone: driverPhone,
    vehicle,
    rating,
    total_rides: 1,
    last_ride_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('favorite_drivers')
      .insert(driverData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('addFavoriteDriver: simulation locale', err)
    return {
      id: `FDR-${Date.now()}`,
      ...driverData,
    }
  }
}

/**
 * Vérifie si un conducteur est dans les favoris
 */
export async function isFavoriteDriver(userId, driverId) {
  try {
    const { data, error } = await supabase
      .from('favorite_drivers')
      .select('id')
      .eq('user_id', userId)
      .eq('driver_id', driverId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  } catch (err) {
    console.warn('isFavoriteDriver: fallback false', err)
    return false
  }
}

/**
 * Supprime un conducteur des favoris
 */
export async function removeFavoriteDriver(userId, driverId) {
  try {
    const { error } = await supabase
      .from('favorite_drivers')
      .delete()
      .eq('user_id', userId)
      .eq('driver_id', driverId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('removeFavoriteDriver: simulation', err)
    return true
  }
}

/**
 * Met à jour les stats d'un conducteur favori après une course
 */
export async function updateFavoriteDriverStats(userId, driverId) {
  try {
    const { data, error } = await supabase
      .rpc('increment_favorite_driver_rides', { p_user_id: userId, p_driver_id: driverId })
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateFavoriteDriverStats: simulation', err)
    return true
  }
}

/**
 * Récupère les types d'adresses prédéfinis
 */
export function getAddressTypes() {
  return [
    { id: 'home', label: 'Domicile', icon: 'home' },
    { id: 'work', label: 'Travail', icon: 'briefcase' },
    { id: 'gym', label: 'Salle de sport', icon: 'dumbbell' },
    { id: 'school', label: 'École', icon: 'graduation-cap' },
    { id: 'hospital', label: 'Hôpital', icon: 'heart' },
    { id: 'other', label: 'Autre', icon: 'map-pin' },
  ]
}
