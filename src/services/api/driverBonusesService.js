import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Types de bonus
export const BONUS_TYPES = {
  signup: { label: 'Bonus d\'inscription', description: 'Bonus pour les nouveaux conducteurs' },
  referral: { label: 'Bonus de parrainage', description: 'Bonus pour avoir parrainé un nouveau conducteur' },
  rides_count: { label: 'Bonus nombre de courses', description: 'Bonus atteint un certain nombre de courses' },
  rating: { label: 'Bonus excellente note', description: 'Bonus pour maintien d\'une excellente note' },
  peak_hours: { label: 'Bonus heures de pointe', description: 'Bonus pour courses pendant les heures de pointe' },
  weekend: { label: 'Bonus weekend', description: 'Bonus pour courses le weekend' },
  streak: { label: 'Bonus série', description: 'Bonus pour série de jours consécutifs actifs' },
  zone_high_demand: { label: 'Bonus zone forte demande', description: 'Bonus pour service dans zones à forte demande' },
  completion_rate: { label: 'Bonus taux de complétion', description: 'Bonus pour excellent taux de complétion' },
  custom: { label: 'Bonus personnalisé', description: 'Bonus attribué manuellement' },
}

// Statuts de bonus
export const BONUS_STATUS = {
  pending: { label: 'En attente', color: '#ffb64d' },
  earned: { label: 'Gagné', color: '#2ed8a3' },
  claimed: { label: 'Réclamé', color: '#4680ff' },
  paid: { label: 'Payé', color: '#2ed8a3' },
  expired: { label: 'Expiré', color: '#6f42c1' },
  cancelled: { label: 'Annulé', color: '#ff5370' },
}

// Objectifs prédéfinis
const DEFAULT_GOALS = [
  {
    id: 'GOAL-001',
    type: 'rides_count',
    name: '10 courses/jour',
    description: 'Compléter 10 courses en une journée',
    target: 10,
    period: 'daily',
    reward: 500,
    isActive: true,
  },
  {
    id: 'GOAL-002',
    type: 'rides_count',
    name: '50 courses/semaine',
    description: 'Compléter 50 courses en une semaine',
    target: 50,
    period: 'weekly',
    reward: 3000,
    isActive: true,
  },
  {
    id: 'GOAL-003',
    type: 'rides_count',
    name: '200 courses/mois',
    description: 'Compléter 200 courses en un mois',
    target: 200,
    period: 'monthly',
    reward: 15000,
    isActive: true,
  },
  {
    id: 'GOAL-004',
    type: 'rating',
    name: 'Excellence 4.9+',
    description: 'Maintenir une note de 4.9+ sur 50 courses',
    target: 4.9,
    period: 'rolling',
    reward: 5000,
    isActive: true,
  },
  {
    id: 'GOAL-005',
    type: 'streak',
    name: 'Série 7 jours',
    description: 'Être actif 7 jours consécutifs',
    target: 7,
    period: 'streak',
    reward: 2000,
    isActive: true,
  },
  {
    id: 'GOAL-006',
    type: 'completion_rate',
    name: 'Taux 95%+',
    description: 'Maintenir un taux de complétion de 95%+',
    target: 95,
    period: 'weekly',
    reward: 2500,
    isActive: true,
  },
]

// Données mock
const MOCK_BONUSES = [
  {
    id: 'BON-001',
    driverId: 'DRV-001',
    type: 'rides_count',
    goalId: 'GOAL-001',
    goalName: '10 courses/jour',
    progress: 8,
    target: 10,
    reward: 500,
    status: 'pending',
    periodStart: '2024-03-15T00:00:00Z',
    periodEnd: '2024-03-15T23:59:59Z',
    createdAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'BON-002',
    driverId: 'DRV-003',
    type: 'rides_count',
    goalId: 'GOAL-002',
    goalName: '50 courses/semaine',
    progress: 52,
    target: 50,
    reward: 3000,
    status: 'earned',
    periodStart: '2024-03-11T00:00:00Z',
    periodEnd: '2024-03-17T23:59:59Z',
    earnedAt: '2024-03-15T14:30:00Z',
    createdAt: '2024-03-11T00:00:00Z',
  },
  {
    id: 'BON-003',
    driverId: 'DRV-001',
    type: 'referral',
    goalId: null,
    goalName: 'Parrainage',
    progress: 1,
    target: 1,
    reward: 2000,
    status: 'paid',
    referredDriverId: 'DRV-020',
    createdAt: '2024-03-10T10:00:00Z',
    paidAt: '2024-03-12T10:00:00Z',
  },
]

const MOCK_DRIVER_STATS = {
  'DRV-001': {
    totalBonuses: 15000,
    pendingBonuses: 500,
    earnedNotClaimed: 3000,
    ridesToday: 8,
    ridesThisWeek: 35,
    ridesThisMonth: 142,
    currentStreak: 5,
    longestStreak: 12,
    completionRate: 94.5,
    averageRating: 4.8,
  },
  'DRV-003': {
    totalBonuses: 25000,
    pendingBonuses: 3000,
    earnedNotClaimed: 0,
    ridesToday: 12,
    ridesThisWeek: 52,
    ridesThisMonth: 198,
    currentStreak: 15,
    longestStreak: 15,
    completionRate: 97.2,
    averageRating: 4.9,
  },
}

/**
 * Récupère tous les objectifs de bonus
 */
export async function getBonusGoals() {
  try {
    const { data, error } = await supabase
      .from('bonus_goals')
      .select('*')
      .eq('is_active', true)
      .order('reward', { ascending: false })
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getBonusGoals: fallback mock', err)
  }
  return resolveMock(DEFAULT_GOALS)
}

/**
 * Récupère les bonus d'un conducteur
 */
export async function getDriverBonuses(driverId, filters = {}) {
  try {
    let query = supabase.from('driver_bonuses').select('*')
      .eq('driver_id', driverId)
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getDriverBonuses: fallback mock', err)
  }
  return resolveMock(MOCK_BONUSES.filter(b => b.driverId === driverId))
}

/**
 * Récupère les statistiques de bonus d'un conducteur
 */
export async function getDriverBonusStats(driverId) {
  try {
    const { data, error } = await supabase
      .from('driver_bonus_stats')
      .select('*')
      .eq('driver_id', driverId)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getDriverBonusStats: fallback mock', err)
    return MOCK_DRIVER_STATS[driverId] || MOCK_DRIVER_STATS['DRV-001']
  }
}

/**
 * Met à jour la progression d'un bonus
 */
export async function updateBonusProgress(bonusId, progress) {
  try {
    const { data, error } = await supabase
      .from('driver_bonuses')
      .update({ progress, updated_at: new Date().toISOString() })
      .eq('id', bonusId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateBonusProgress: simulation', err)
    return { id: bonusId, progress }
  }
}

/**
 * Vérifie et attribue les bonus gagnés
 */
export async function checkAndAwardBonuses(driverId) {
  const goals = await getBonusGoals()
  const stats = await getDriverBonusStats(driverId)
  const awarded = []
  
  for (const goal of goals) {
    let progress = 0
    let achieved = false
    
    switch (goal.type) {
      case 'rides_count':
        if (goal.period === 'daily') {
          progress = stats.ridesToday
          achieved = progress >= goal.target
        } else if (goal.period === 'weekly') {
          progress = stats.ridesThisWeek
          achieved = progress >= goal.target
        } else if (goal.period === 'monthly') {
          progress = stats.ridesThisMonth
          achieved = progress >= goal.target
        }
        break
      
      case 'rating':
        progress = stats.averageRating
        achieved = progress >= goal.target
        break
      
      case 'streak':
        progress = stats.currentStreak
        achieved = progress >= goal.target
        break
      
      case 'completion_rate':
        progress = stats.completionRate
        achieved = progress >= goal.target
        break
    }
    
    if (achieved) {
      const bonus = await awardBonus(driverId, goal)
      if (bonus) awarded.push(bonus)
    }
  }
  
  return awarded
}

/**
 * Attribue un bonus à un conducteur
 */
export async function awardBonus(driverId, goal) {
  const bonus = {
    driver_id: driverId,
    type: goal.type,
    goal_id: goal.id,
    goal_name: goal.name,
    progress: goal.target,
    target: goal.target,
    reward: goal.reward,
    status: 'earned',
    earned_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('driver_bonuses')
      .insert(bonus)
      .select()
      .single()
    
    if (error) throw error
    
    // Notifier le conducteur
    await supabase.from('notifications').insert({
      user_id: driverId,
      type: 'bonus_earned',
      title: 'Bonus gagné ! 🎉',
      body: `Vous avez gagné ${goal.reward} FCFA pour "${goal.name}"`,
      data: { bonus_id: data.id },
      created_at: new Date().toISOString(),
    })
    
    return data
  } catch (err) {
    console.warn('awardBonus: simulation', err)
    return {
      id: `BON-${Date.now()}`,
      ...bonus,
    }
  }
}

/**
 * Attribue un bonus personnalisé
 */
export async function awardCustomBonus(driverId, amount, reason, adminId) {
  const bonus = {
    driver_id: driverId,
    type: 'custom',
    goal_id: null,
    goal_name: reason,
    progress: 1,
    target: 1,
    reward: amount,
    status: 'earned',
    earned_at: new Date().toISOString(),
    awarded_by: adminId,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('driver_bonuses')
      .insert(bonus)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('awardCustomBonus: simulation', err)
    return {
      id: `BON-${Date.now()}`,
      ...bonus,
    }
  }
}

/**
 * Réclame un bonus (transfert vers le portefeuille)
 */
export async function claimBonus(bonusId) {
  try {
    const { data: bonus, error: fetchError } = await supabase
      .from('driver_bonuses')
      .select('*')
      .eq('id', bonusId)
      .eq('status', 'earned')
      .single()
    
    if (fetchError) throw fetchError
    
    // Mettre à jour le statut
    const { data, error } = await supabase
      .from('driver_bonuses')
      .update({
        status: 'claimed',
        claimed_at: new Date().toISOString(),
      })
      .eq('id', bonusId)
      .select()
      .single()
    
    if (error) throw error
    
    // Ajouter au portefeuille du conducteur
    await supabase.rpc('add_to_wallet', {
      p_user_id: bonus.driver_id,
      p_amount: bonus.reward,
    })
    
    return data
  } catch (err) {
    console.warn('claimBonus: simulation', err)
    return { id: bonusId, status: 'claimed' }
  }
}

/**
 * Réclame tous les bonus gagnés
 */
export async function claimAllBonuses(driverId) {
  const bonuses = await getDriverBonuses(driverId, { status: 'earned' })
  
  const results = []
  for (const bonus of bonuses) {
    const result = await claimBonus(bonus.id)
    results.push(result)
  }
  
  return results
}

/**
 * Enregistre un parrainage
 */
export async function registerReferral(referrerId, referredId) {
  try {
    const { data, error } = await supabase
      .from('driver_referrals')
      .insert({
        referrer_id: referrerId,
        referred_id: referredId,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('registerReferral: simulation', err)
    return {
      id: `REF-${Date.now()}`,
      referrer_id: referrerId,
      referred_id: referredId,
      status: 'pending',
    }
  }
}

/**
 * Complète un parrainage (quand le conducteur parrainé est approuvé)
 */
export async function completeReferral(referralId) {
  try {
    const referralBonus = 2000 // Montant du bonus de parrainage
    
    // Mettre à jour le statut du parrainage
    const { data: referral, error } = await supabase
      .from('driver_referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', referralId)
      .select()
      .single()
    
    if (error) throw error
    
    // Attribuer le bonus au parrain
    await awardCustomBonus(
      referral.referrer_id,
      referralBonus,
      'Bonus de parrainage',
      null
    )
    
    return referral
  } catch (err) {
    console.warn('completeReferral: simulation', err)
    return { id: referralId, status: 'completed' }
  }
}

/**
 * Récupère le classement des conducteurs par bonus
 */
export async function getBonusLeaderboard(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('driver_bonus_stats')
      .select('driver_id, total_bonuses, drivers(name, rating)')
      .order('total_bonuses', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getBonusLeaderboard: fallback mock', err)
    return [
      { driver_id: 'DRV-003', total_bonuses: 25000, drivers: { name: 'Ibrahima Ba', rating: 4.9 } },
      { driver_id: 'DRV-001', total_bonuses: 15000, drivers: { name: 'Oumar Sall', rating: 4.8 } },
      { driver_id: 'DRV-005', total_bonuses: 8500, drivers: { name: 'Abdoulaye Mbaye', rating: 4.6 } },
    ]
  }
}

/**
 * Met à jour les statistiques quotidiennes
 */
export async function updateDailyStats(driverId, stats) {
  try {
    const { error } = await supabase
      .from('driver_daily_stats')
      .upsert({
        driver_id: driverId,
        date: new Date().toISOString().split('T')[0],
        rides: stats.rides,
        earnings: stats.earnings,
        online_hours: stats.onlineHours,
        rating: stats.rating,
        updated_at: new Date().toISOString(),
      })
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('updateDailyStats: simulation', err)
    return true
  }
}

/**
 * Récupère les types de bonus
 */
export function getBonusTypes() {
  return BONUS_TYPES
}

/**
 * Récupère les statuts de bonus
 */
export function getBonusStatuses() {
  return BONUS_STATUS
}

/**
 * Calcule le bonus potentiel pour les heures de pointe
 */
export function calculatePeakHourBonus(amount, hour) {
  const peakHours = [7, 8, 9, 17, 18, 19] // 7h-9h et 17h-19h
  const isPeak = peakHours.includes(hour)
  
  if (isPeak) {
    return Math.round(amount * 0.1) // 10% de bonus
  }
  
  return 0
}

/**
 * Calcule le bonus weekend
 */
export function calculateWeekendBonus(amount, dayOfWeek) {
  // 0 = dimanche, 6 = samedi
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  
  if (isWeekend) {
    return Math.round(amount * 0.05) // 5% de bonus
  }
  
  return 0
}
