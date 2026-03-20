import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Données mock pour les courses programmées
const MOCK_SCHEDULED_RIDES = [
  {
    id: 'SCH-001',
    userId: 'USR-001',
    userName: 'Fatou Diallo',
    userPhone: '+221 77 123 45 67',
    pickupAddress: 'Dakar Plateau, Rue 10x',
    pickupLat: 14.6928,
    pickupLon: -17.4467,
    destinationAddress: 'Dakar Médina, Avenue Cheick Anta Diop',
    destLat: 14.7012,
    destLon: -17.4523,
    serviceType: 'Moto Taxi',
    scheduledDate: '2024-03-20',
    scheduledTime: '08:30',
    recurrence: 'none', // none, daily, weekly, monthly
    recurrenceDays: null, // ['mon', 'wed', 'fri'] pour weekly
    status: 'pending', // pending, confirmed, assigned, cancelled, completed
    driverId: null,
    driverName: null,
    estimatedPrice: 1500,
    notes: 'Sonner à l\'entrée',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'SCH-002',
    userId: 'USR-002',
    userName: 'Moussa Ndiaye',
    userPhone: '+221 76 234 56 78',
    pickupAddress: 'Thiès Centre',
    pickupLat: 14.7912,
    pickupLon: -16.9358,
    destinationAddress: 'Dakar Plateau',
    destLat: 14.6928,
    destLon: -17.4467,
    serviceType: 'Voiture Taxi',
    scheduledDate: '2024-03-21',
    scheduledTime: '07:00',
    recurrence: 'weekly',
    recurrenceDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    status: 'confirmed',
    driverId: 'DRV-005',
    driverName: 'Abdoulaye Mbaye',
    estimatedPrice: 5000,
    notes: null,
    createdAt: '2024-03-14T15:00:00Z',
  },
]

const RECURRENCE_OPTIONS = [
  { id: 'none', label: 'Une seule fois', description: 'Course unique' },
  { id: 'daily', label: 'Quotidienne', description: 'Tous les jours à la même heure' },
  { id: 'weekly', label: 'Hebdomadaire', description: 'Jours sélectionnés chaque semaine' },
  { id: 'monthly', label: 'Mensuelle', description: 'Même jour chaque mois' },
]

const WEEKDAYS = [
  { id: 'mon', label: 'Lun', fullLabel: 'Lundi' },
  { id: 'tue', label: 'Mar', fullLabel: 'Mardi' },
  { id: 'wed', label: 'Mer', fullLabel: 'Mercredi' },
  { id: 'thu', label: 'Jeu', fullLabel: 'Jeudi' },
  { id: 'fri', label: 'Ven', fullLabel: 'Vendredi' },
  { id: 'sat', label: 'Sam', fullLabel: 'Samedi' },
  { id: 'sun', label: 'Dim', fullLabel: 'Dimanche' },
]

/**
 * Récupère toutes les courses programmées (admin)
 */
export async function getScheduledRides(filters = {}) {
  try {
    let query = supabase.from('scheduled_rides').select('*')
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters.date) {
      query = query.eq('scheduled_date', filters.date)
    }
    if (filters.upcoming) {
      query = query.gte('scheduled_date', new Date().toISOString().split('T')[0])
    }
    
    const { data, error } = await query.order('scheduled_date', { ascending: true })
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getScheduledRides: fallback mock', err)
  }
  return resolveMock(MOCK_SCHEDULED_RIDES)
}

/**
 * Récupère les courses programmées d'un utilisateur
 */
export async function getUserScheduledRides(userId) {
  try {
    const { data, error } = await supabase
      .from('scheduled_rides')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'confirmed', 'assigned'])
      .order('scheduled_date', { ascending: true })
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getUserScheduledRides: fallback mock', err)
  }
  return resolveMock(MOCK_SCHEDULED_RIDES.filter(r => r.userId === userId && !['cancelled', 'completed'].includes(r.status)))
}

/**
 * Crée une nouvelle course programmée
 */
export async function createScheduledRide(rideData) {
  const scheduledRide = {
    user_id: rideData.userId,
    user_name: rideData.userName,
    user_phone: rideData.userPhone,
    pickup_address: rideData.pickupAddress,
    pickup_lat: rideData.pickupLat,
    pickup_lon: rideData.pickupLon,
    destination_address: rideData.destinationAddress,
    dest_lat: rideData.destLat,
    dest_lon: rideData.destLon,
    service_type: rideData.serviceType,
    scheduled_date: rideData.scheduledDate,
    scheduled_time: rideData.scheduledTime,
    recurrence: rideData.recurrence || 'none',
    recurrence_days: rideData.recurrenceDays || null,
    status: 'pending',
    estimated_price: rideData.estimatedPrice || 0,
    notes: rideData.notes || null,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('scheduled_rides')
      .insert(scheduledRide)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createScheduledRide: simulation locale', err)
    return {
      id: `SCH-${Date.now()}`,
      ...scheduledRide,
    }
  }
}

/**
 * Met à jour une course programmée
 */
export async function updateScheduledRide(rideId, updates) {
  try {
    const { data, error } = await supabase
      .from('scheduled_rides')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', rideId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateScheduledRide: simulation', err)
    return { id: rideId, ...updates }
  }
}

/**
 * Annule une course programmée
 */
export async function cancelScheduledRide(rideId, reason = null) {
  return updateScheduledRide(rideId, { 
    status: 'cancelled', 
    cancellation_reason: reason,
    cancelled_at: new Date().toISOString(),
  })
}

/**
 * Assigne un conducteur à une course programmée
 */
export async function assignDriverToScheduledRide(rideId, driverId, driverName) {
  return updateScheduledRide(rideId, {
    status: 'assigned',
    driver_id: driverId,
    driver_name: driverName,
    assigned_at: new Date().toISOString(),
  })
}

/**
 * Supprime une course programmée
 */
export async function deleteScheduledRide(rideId) {
  try {
    const { error } = await supabase
      .from('scheduled_rides')
      .delete()
      .eq('id', rideId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('deleteScheduledRide: simulation', err)
    return true
  }
}

/**
 * Récupère les courses à venir pour aujourd'hui
 */
export async function getTodayScheduledRides() {
  const today = new Date().toISOString().split('T')[0]
  return getScheduledRides({ date: today, status: 'pending' })
}

/**
 * Récupère les courses récurrentes actives
 */
export async function getActiveRecurringRides() {
  try {
    const { data, error } = await supabase
      .from('scheduled_rides')
      .select('*')
      .neq('recurrence', 'none')
      .eq('status', 'confirmed')
    
    if (error) throw error
    if (data) return data
  } catch (err) {
    console.warn('getActiveRecurringRides: fallback mock', err)
  }
  return resolveMock(MOCK_SCHEDULED_RIDES.filter(r => r.recurrence !== 'none' && r.status === 'confirmed'))
}

/**
 * Convertit une course programmée en course active
 */
export async function activateScheduledRide(scheduledRideId) {
  try {
    // Récupérer la course programmée
    const { data: scheduled, error: fetchError } = await supabase
      .from('scheduled_rides')
      .select('*')
      .eq('id', scheduledRideId)
      .single()
    
    if (fetchError) throw fetchError
    
    // Créer la course active
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .insert({
        pickup_address: scheduled.pickup_address,
        destination_address: scheduled.destination_address,
        status: scheduled.driver_id ? 'accepted' : 'pending',
        category: scheduled.service_type.toLowerCase().includes('taxi') ? 'taxi' : 'delivery',
        type: scheduled.service_type,
        price: scheduled.estimated_price,
        driver_id: scheduled.driver_id,
        user_id: scheduled.user_id,
        scheduled_from: scheduledRideId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (rideError) throw rideError
    
    // Marquer la course programmée comme complétée
    await updateScheduledRide(scheduledRideId, { status: 'completed' })
    
    return ride
  } catch (err) {
    console.error('activateScheduledRide error:', err)
    throw err
  }
}

/**
 * Retourne les options de récurrence
 */
export function getRecurrenceOptions() {
  return RECURRENCE_OPTIONS
}

/**
 * Retourne les jours de la semaine
 */
export function getWeekdays() {
  return WEEKDAYS
}

/**
 * Calcule les prochaines dates pour une récurrence
 */
export function calculateNextOccurrences(recurrence, startDate, days = null, count = 5) {
  const occurrences = []
  const start = new Date(startDate)
  
  for (let i = 0; i < count; i++) {
    const next = new Date(start)
    
    switch (recurrence) {
      case 'daily':
        next.setDate(start.getDate() + i)
        break
      case 'weekly':
        if (days && days.length > 0) {
          // Trouver le prochain jour correspondant
          const dayMap = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }
          let found = false
          let attempts = 0
          while (!found && attempts < 7) {
            next.setDate(start.getDate() + i * 7 + attempts)
            if (days.includes(Object.keys(dayMap).find(k => dayMap[k] === next.getDay()))) {
              found = true
            }
            attempts++
          }
        } else {
          next.setDate(start.getDate() + i * 7)
        }
        break
      case 'monthly':
        next.setMonth(start.getMonth() + i)
        break
      default:
        return occurrences
    }
    
    occurrences.push(next.toISOString().split('T')[0])
  }
  
  return occurrences
}
