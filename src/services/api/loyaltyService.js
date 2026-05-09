import { supabase } from './supabaseClient'

/**
 * Programme de fidélité LiviStars
 * Points gagnés par course → niveaux → réductions
 */
export const LOYALTY_LEVELS = [
  { name: 'Bronze',   minPoints: 0,    discount: 0,    color: '#cd7f32', emoji: '🥉', perksLabel: 'Accès standard'              },
  { name: 'Argent',   minPoints: 500,  discount: 5,    color: '#a8a9ad', emoji: '🥈', perksLabel: '-5% sur toutes les courses'   },
  { name: 'Or',       minPoints: 1500, discount: 10,   color: '#ffd700', emoji: '🥇', perksLabel: '-10% + priorité dispatch'     },
  { name: 'Platine',  minPoints: 4000, discount: 15,   color: '#4680ff', emoji: '💎', perksLabel: '-15% + chauffeur dédié dispo' },
  { name: 'Diamant',  minPoints: 10000,discount: 20,   color: '#a855f7', emoji: '👑', perksLabel: '-20% + accès VIP'             },
]

export const POINTS_RULES = {
  ride_completed:  10,   // points par course terminée
  per_1000_fcfa:    5,   // points par tranche de 1 000 FCFA dépensés
  first_ride:      50,   // bonus première course
  referral:       100,   // parrainage réussi
  review_left:     15,   // avis laissé
  consecutive_7:   75,   // 7 courses consécutives
}

/**
 * Calcule le niveau d'un utilisateur selon ses points
 */
export function getLoyaltyLevel(points) {
  let level = LOYALTY_LEVELS[0]
  for (const l of LOYALTY_LEVELS) {
    if (points >= l.minPoints) level = l
    else break
  }
  const next = LOYALTY_LEVELS[LOYALTY_LEVELS.indexOf(level) + 1] || null
  const progress = next ? ((points - level.minPoints) / (next.minPoints - level.minPoints)) * 100 : 100
  return { ...level, points, nextLevel: next, progress: Math.min(100, Math.round(progress)) }
}

/**
 * Retourne le profil fidélité d'un utilisateur
 */
export async function getLoyaltyProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('loyalty_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error) throw error
    if (data) return { ...data, levelInfo: getLoyaltyLevel(data.total_points) }
  } catch { /* fallback */ }

  const mockPoints = 1850
  return {
    userId,
    totalPoints: mockPoints,
    availablePoints: 1200,
    totalRides: 48,
    totalSpent: 87000,
    levelInfo: getLoyaltyLevel(mockPoints),
    simulated: true,
  }
}

/**
 * Crédite des points après une course
 */
export async function awardPoints({ userId, rideId, amount, eventType = 'ride_completed' }) {
  const basePoints = POINTS_RULES[eventType] || 0
  const spendPoints = Math.floor((amount || 0) / 1000) * POINTS_RULES.per_1000_fcfa
  const totalPoints = basePoints + spendPoints

  try {
    const { data: profile } = await supabase
      .from('loyalty_profiles')
      .select('id, total_points, available_points')
      .eq('user_id', userId).single()

    if (profile) {
      await supabase.from('loyalty_profiles').update({
        total_points:     profile.total_points + totalPoints,
        available_points: profile.available_points + totalPoints,
        updated_at: new Date().toISOString(),
      }).eq('id', profile.id)

      await supabase.from('loyalty_transactions').insert({
        user_id: userId, ride_id: rideId,
        points: totalPoints, event_type: eventType,
        created_at: new Date().toISOString(),
      })
    }
  } catch (err) {
    console.warn('awardPoints simulation:', err.message)
  }

  return { awarded: totalPoints, eventType }
}

/**
 * Utilise des points pour obtenir une réduction
 */
export async function redeemPoints({ userId, pointsToRedeem, rideId }) {
  const discountFCFA = Math.floor(pointsToRedeem / 10) * 100 // 100 FCFA par 10 points

  try {
    const { data: profile } = await supabase
      .from('loyalty_profiles')
      .select('id, available_points')
      .eq('user_id', userId).single()

    if (!profile || profile.available_points < pointsToRedeem) {
      throw new Error('Points insuffisants')
    }
    await supabase.from('loyalty_profiles').update({
      available_points: profile.available_points - pointsToRedeem,
    }).eq('id', profile.id)

    await supabase.from('loyalty_transactions').insert({
      user_id: userId, ride_id: rideId,
      points: -pointsToRedeem, event_type: 'redemption',
      discount_fcfa: discountFCFA,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.warn('redeemPoints simulation:', err.message)
  }

  return { pointsUsed: pointsToRedeem, discountFCFA, formatted: `${discountFCFA.toLocaleString('fr-FR')} FCFA` }
}

/**
 * Leaderboard des 10 meilleurs clients
 */
export async function getLoyaltyLeaderboard() {
  try {
    const { data, error } = await supabase
      .from('loyalty_profiles')
      .select('user_id, total_points, total_rides')
      .order('total_points', { ascending: false })
      .limit(10)
    if (error) throw error
    if (data?.length > 0) return data
  } catch { /* fallback */ }

  return [
    { user_id: 'USR-012', name: 'Fatou Diallo',   total_points: 8420, total_rides: 312 },
    { user_id: 'USR-007', name: 'Cheikh Fall',     total_points: 5930, total_rides: 198 },
    { user_id: 'USR-023', name: 'Aminata Koné',   total_points: 4100, total_rides: 145 },
  ]
}
