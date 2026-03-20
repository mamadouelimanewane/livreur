import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Données mock pour les promotions
const MOCK_PROMOTIONS = [
  {
    id: 'PROMO-001',
    code: 'BIENVENUE20',
    description: '20% de réduction pour les nouveaux utilisateurs',
    type: 'percentage', // percentage, fixed, free_ride
    value: 20,
    minAmount: 500,
    maxDiscount: 2000,
    usageLimit: 1000,
    usageCount: 245,
    userLimit: 1,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    applicableTo: 'first_ride', // all, first_ride, specific_service
    services: null,
    zones: ['Dakar'],
    status: 'active', // active, paused, expired
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'PROMO-002',
    code: 'LIVRAISON500',
    description: '500 FCFA de réduction sur les livraisons',
    type: 'fixed',
    value: 500,
    minAmount: 1500,
    maxDiscount: 500,
    usageLimit: 500,
    usageCount: 89,
    userLimit: 3,
    validFrom: '2024-03-01',
    validUntil: '2024-03-31',
    applicableTo: 'specific_service',
    services: ['Livraison Express', 'Livraison Standard'],
    zones: null,
    status: 'active',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'PROMO-003',
    code: 'WEEKEND25',
    description: '25% de réduction le weekend',
    type: 'percentage',
    value: 25,
    minAmount: 1000,
    maxDiscount: 3000,
    usageLimit: null,
    usageCount: 156,
    userLimit: null,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    applicableTo: 'all',
    services: null,
    zones: null,
    status: 'paused',
    createdAt: '2024-01-15T00:00:00Z',
  },
]

const PROMO_TYPES = [
  { id: 'percentage', label: 'Pourcentage', description: 'Réduction en % du montant' },
  { id: 'fixed', label: 'Montant fixe', description: 'Réduction en FCFA' },
  { id: 'free_ride', label: 'Course gratuite', description: 'Course entièrement gratuite (jusqu\'à un max)' },
]

const APPLICABLE_TO_OPTIONS = [
  { id: 'all', label: 'Tous les services' },
  { id: 'first_ride', label: 'Première course uniquement' },
  { id: 'specific_service', label: 'Services spécifiques' },
]

/**
 * Récupère toutes les promotions
 */
export async function getPromotions(filters = {}) {
  try {
    let query = supabase.from('promotions').select('*')
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.active) {
      const now = new Date().toISOString().split('T')[0]
      query = query.eq('status', 'active').lte('valid_from', now).gte('valid_until', now)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getPromotions: fallback mock', err)
  }
  return resolveMock(MOCK_PROMOTIONS)
}

/**
 * Récupère une promotion par son code
 */
export async function getPromotionByCode(code) {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getPromotionByCode: fallback mock', err)
    return MOCK_PROMOTIONS.find(p => p.code === code.toUpperCase() && p.status === 'active') || null
  }
}

/**
 * Vérifie si un code promo est valide pour un utilisateur
 */
export async function validatePromoCode(code, userId, rideAmount, serviceType, zone) {
  const promo = await getPromotionByCode(code)
  
  if (!promo) {
    return { valid: false, error: 'Code promo invalide' }
  }
  
  // Vérifier les dates de validité
  const now = new Date().toISOString().split('T')[0]
  if (promo.validFrom > now || promo.validUntil < now) {
    return { valid: false, error: 'Code promo expiré' }
  }
  
  // Vérifier le montant minimum
  if (promo.minAmount && rideAmount < promo.minAmount) {
    return { valid: false, error: `Montant minimum requis: ${promo.minAmount} FCFA` }
  }
  
  // Vérifier la limite d'utilisation globale
  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
    return { valid: false, error: 'Code promo épuisé' }
  }
  
  // Vérifier la limite par utilisateur
  if (promo.userLimit) {
    const userUsage = await getUserPromoUsage(userId, promo.id)
    if (userUsage >= promo.userLimit) {
      return { valid: false, error: 'Vous avez déjà utilisé ce code promo' }
    }
  }
  
  // Vérifier les services applicables
  if (promo.applicableTo === 'specific_service' && promo.services) {
    if (!promo.services.includes(serviceType)) {
      return { valid: false, error: 'Ce code promo ne s\'applique pas à ce service' }
    }
  }
  
  // Vérifier les zones
  if (promo.zones && promo.zones.length > 0) {
    if (!promo.zones.includes(zone)) {
      return { valid: false, error: 'Ce code promo n\'est pas valide dans votre zone' }
  }
  }
  
  // Calculer la réduction
  let discount = 0
  switch (promo.type) {
    case 'percentage':
      discount = Math.min(rideAmount * (promo.value / 100), promo.maxDiscount || rideAmount)
      break
    case 'fixed':
      discount = Math.min(promo.value, rideAmount)
      break
    case 'free_ride':
      discount = Math.min(rideAmount, promo.maxDiscount || rideAmount)
      break
  }
  
  return {
    valid: true,
    promotion: promo,
    discount: Math.round(discount),
    finalAmount: rideAmount - Math.round(discount),
  }
}

/**
 * Récupère l'utilisation d'un code promo par un utilisateur
 */
async function getUserPromoUsage(userId, promoId) {
  try {
    const { data, error } = await supabase
      .from('promo_usage')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('promo_id', promoId)
    
    if (error) throw error
    return data?.length || 0
  } catch (err) {
    return 0
  }
}

/**
 * Applique un code promo à une course
 */
export async function applyPromoToRide({ promoId, rideId, userId, discount }) {
  try {
    // Enregistrer l'utilisation
    const { error: usageError } = await supabase
      .from('promo_usage')
      .insert({
        promo_id: promoId,
        ride_id: rideId,
        user_id: userId,
        discount_amount: discount,
        used_at: new Date().toISOString(),
      })
    
    if (usageError) throw usageError
    
    // Incrémenter le compteur d'utilisation
    await supabase.rpc('increment_promo_usage', { promo_id: promoId })
    
    return true
  } catch (err) {
    console.warn('applyPromoToRide: simulation', err)
    return true
  }
}

/**
 * Crée une nouvelle promotion
 */
export async function createPromotion(promoData) {
  const promotion = {
    code: promoData.code.toUpperCase(),
    description: promoData.description,
    type: promoData.type,
    value: promoData.value,
    min_amount: promoData.minAmount || 0,
    max_discount: promoData.maxDiscount || null,
    usage_limit: promoData.usageLimit || null,
    usage_count: 0,
    user_limit: promoData.userLimit || null,
    valid_from: promoData.validFrom,
    valid_until: promoData.validUntil,
    applicable_to: promoData.applicableTo || 'all',
    services: promoData.services || null,
    zones: promoData.zones || null,
    status: 'active',
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('promotions')
      .insert(promotion)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createPromotion: simulation locale', err)
    return {
      id: `PROMO-${Date.now()}`,
      ...promotion,
    }
  }
}

/**
 * Met à jour une promotion
 */
export async function updatePromotion(promoId, updates) {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', promoId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updatePromotion: simulation', err)
    return { id: promoId, ...updates }
  }
}

/**
 * Active/Désactive une promotion
 */
export async function togglePromotionStatus(promoId, status) {
  return updatePromotion(promoId, { status })
}

/**
 * Supprime une promotion
 */
export async function deletePromotion(promoId) {
  try {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', promoId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('deletePromotion: simulation', err)
    return true
  }
}

/**
 * Récupère les statistiques d'utilisation d'une promotion
 */
export async function getPromotionStats(promoId) {
  try {
    const { data, error } = await supabase
      .from('promo_usage')
      .select('discount_amount, used_at, rides!inner(id, type)')
      .eq('promo_id', promoId)
      .order('used_at', { ascending: false })
    
    if (error) throw error
    
    const totalDiscount = data?.reduce((sum, u) => sum + (u.discount_amount || 0), 0) || 0
    const usageByService = {}
    data?.forEach(u => {
      const service = u.rides?.type || 'Inconnu'
      usageByService[service] = (usageByService[service] || 0) + 1
    })
    
    return {
      totalUsage: data?.length || 0,
      totalDiscount,
      usageByService,
      recentUsage: data?.slice(0, 10) || [],
    }
  } catch (err) {
    console.warn('getPromotionStats: fallback mock', err)
    return {
      totalUsage: 89,
      totalDiscount: 44500,
      usageByService: { 'Livraison Express': 45, 'Moto Taxi': 44 },
      recentUsage: [],
    }
  }
}

/**
 * Génère un code promo unique
 */
export function generatePromoCode(prefix = '') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = prefix
  for (let i = 0; i < 8 - prefix.length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Retourne les types de promotions
 */
export function getPromoTypes() {
  return PROMO_TYPES
}

/**
 * Retourne les options d'applicabilité
 */
export function getApplicableToOptions() {
  return APPLICABLE_TO_OPTIONS
}
