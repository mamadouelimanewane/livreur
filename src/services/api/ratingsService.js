import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Données mock pour les évaluations
const MOCK_RATINGS = [
  { id: 'RAT-001', rideId: 'RID-001', fromUserId: 'USR-001', toDriverId: 'DRV-001', rating: 5, comment: 'Excellent service, très ponctuel!', createdAt: '2024-03-15T10:30:00Z' },
  { id: 'RAT-002', rideId: 'RID-002', fromUserId: 'USR-002', toDriverId: 'DRV-001', rating: 4, comment: 'Bien, mais un peu de retard', createdAt: '2024-03-14T15:45:00Z' },
  { id: 'RAT-003', rideId: 'RID-003', fromUserId: 'USR-003', toDriverId: 'DRV-003', rating: 5, comment: 'Parfait!', createdAt: '2024-03-13T09:20:00Z' },
  { id: 'RAT-004', rideId: 'RID-004', fromDriverId: 'DRV-001', toUserId: 'USR-001', rating: 5, comment: 'Client respectueux', createdAt: '2024-03-15T10:35:00Z' },
]

const MOCK_DRIVER_STATS = {
  'DRV-001': { totalRatings: 48, averageRating: 4.8, fiveStars: 40, fourStars: 5, threeStars: 2, twoStars: 1, oneStars: 0 },
  'DRV-003': { totalRatings: 61, averageRating: 4.9, fiveStars: 55, fourStars: 4, threeStars: 1, twoStars: 1, oneStars: 0 },
  'DRV-005': { totalRatings: 27, averageRating: 4.6, fiveStars: 20, fourStars: 5, threeStars: 1, twoStars: 1, oneStars: 0 },
}

/**
 * Récupère toutes les évaluations
 */
export async function getRatings(filters = {}) {
  try {
    let query = supabase.from('ratings').select('*')
    
    if (filters.driverId) {
      query = query.eq('to_driver_id', filters.driverId)
    }
    if (filters.userId) {
      query = query.eq('to_user_id', filters.userId)
    }
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getRatings: fallback mock', err)
  }
  return resolveMock(MOCK_RATINGS)
}

/**
 * Récupère les statistiques d'évaluation d'un conducteur
 */
export async function getDriverRatingStats(driverId) {
  try {
    const { data, error } = await supabase
      .from('driver_rating_stats')
      .select('*')
      .eq('driver_id', driverId)
      .single()
    
    if (error) throw error
    if (data) return data
  } catch (err) {
    console.warn('getDriverRatingStats: fallback mock', err)
  }
  return MOCK_DRIVER_STATS[driverId] || { totalRatings: 0, averageRating: 0, fiveStars: 0, fourStars: 0, threeStars: 0, twoStars: 0, oneStars: 0 }
}

/**
 * Crée une nouvelle évaluation après une course
 */
export async function createRating({ rideId, fromUserId, fromDriverId, toUserId, toDriverId, rating, comment }) {
  const ratingData = {
    ride_id: rideId,
    from_user_id: fromUserId || null,
    from_driver_id: fromDriverId || null,
    to_user_id: toUserId || null,
    to_driver_id: toDriverId || null,
    rating,
    comment: comment || null,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert(ratingData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createRating: simulation locale', err)
    // Simulation locale pour la démo
    return {
      id: `RAT-${Date.now()}`,
      ...ratingData,
    }
  }
}

/**
 * Vérifie si une course a déjà été évaluée
 */
export async function hasRatedRide(rideId, byType = 'user') {
  try {
    const field = byType === 'user' ? 'from_user_id' : 'from_driver_id'
    const { data, error } = await supabase
      .from('ratings')
      .select('id')
      .eq('ride_id', rideId)
      .not(field, 'is', null)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  } catch (err) {
    console.warn('hasRatedRide: fallback false', err)
    return false
  }
}

/**
 * Récupère les évaluations récentes pour affichage public
 */
export async function getRecentRatings(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*, rides!inner(id, type)')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getRecentRatings: fallback mock', err)
  }
  return resolveMock(MOCK_RATINGS.slice(0, limit))
}

/**
 * Signale un comportement inapproprié
 */
export async function reportBehavior({ rideId, reporterId, reportedId, reporterType, reason, description }) {
  const reportData = {
    ride_id: rideId,
    reporter_id: reporterId,
    reported_id: reportedId,
    reporter_type: reporterType, // 'user' ou 'driver'
    reason,
    description: description || null,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('behavior_reports')
      .insert(reportData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('reportBehavior: simulation locale', err)
    return {
      id: `REP-${Date.now()}`,
      ...reportData,
    }
  }
}

/**
 * Récupère les signalements pour l'admin
 */
export async function getBehaviorReports(filters = {}) {
  try {
    let query = supabase.from('behavior_reports').select('*')
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    if (data) return data
  } catch (err) {
    console.warn('getBehaviorReports: fallback mock', err)
  }
  
  // Mock data
  return [
    { id: 'REP-001', ride_id: 'RID-010', reporter_id: 'USR-001', reported_id: 'DRV-002', reporter_type: 'user', reason: 'Conduite dangereuse', description: 'Le conducteur roulait trop vite', status: 'pending', created_at: '2024-03-15T14:00:00Z' },
    { id: 'REP-002', ride_id: 'RID-011', reporter_id: 'DRV-001', reported_id: 'USR-003', reporter_type: 'driver', reason: 'Client irrespectueux', description: 'Comportement agressif', status: 'resolved', created_at: '2024-03-14T16:30:00Z' },
  ]
}

/**
 * Met à jour le statut d'un signalement
 */
export async function updateReportStatus(reportId, status, adminNotes = null) {
  try {
    const { data, error } = await supabase
      .from('behavior_reports')
      .update({ status, admin_notes: adminNotes, updated_at: new Date().toISOString() })
      .eq('id', reportId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateReportStatus: simulation', err)
    return { id: reportId, status, admin_notes: adminNotes }
  }
}
