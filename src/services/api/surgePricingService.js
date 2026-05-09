import { supabase } from './supabaseClient'

/**
 * Règles de surge pricing par heure et densité
 */
const SURGE_RULES = [
  { id: 'morning-peak', label: 'Heure de pointe matin',   hours: [7, 8, 9],       minDemand: 0, multiplier: 1.5 },
  { id: 'evening-peak', label: 'Heure de pointe soir',    hours: [17, 18, 19, 20], minDemand: 0, multiplier: 1.7 },
  { id: 'rain',         label: 'Forte demande (pluie)',   hours: null,             minDemand: 30, multiplier: 2.0 },
  { id: 'night',        label: 'Tarif nuit',              hours: [22, 23, 0, 1, 2, 3, 4], minDemand: 0, multiplier: 1.3 },
  { id: 'holiday',      label: 'Jour férié / événement',  hours: null,             minDemand: 50, multiplier: 2.5 },
]

const MOCK_ZONE_DEMAND = {
  'Dakar Centre': 12,
  'Plateau':      8,
  'Parcelles':    6,
  'Guédiawaye':   4,
  'Almadies':     3,
  'default':      5,
}

/**
 * Retourne le multiplicateur surge actif pour une zone
 */
export async function getSurgePricing(zone = 'default') {
  const hour = new Date().getHours()

  try {
    // Essai Supabase
    const { data } = await supabase
      .from('surge_pricing')
      .select('*')
      .eq('zone', zone)
      .eq('active', true)
      .gte('expires_at', new Date().toISOString())
      .order('multiplier', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) return { multiplier: data.multiplier, label: data.label, zone, fromDB: true }
  } catch {
    // fallback local
  }

  // Règle par heure
  for (const rule of SURGE_RULES) {
    if (rule.hours && rule.hours.includes(hour)) {
      return { multiplier: rule.multiplier, label: rule.label, zone, ruleId: rule.id }
    }
  }

  return { multiplier: 1.0, label: null, zone }
}

/**
 * Retourne toutes les zones avec leur état surge actuel
 */
export async function getAllZonesSurge() {
  const zones = Object.keys(MOCK_ZONE_DEMAND)
  const results = await Promise.all(zones.map(async (zone) => {
    const surge = await getSurgePricing(zone)
    const demand = MOCK_ZONE_DEMAND[zone] || 0
    return {
      zone,
      demand,
      demandLevel: demand > 15 ? 'critical' : demand > 8 ? 'high' : demand > 4 ? 'medium' : 'low',
      ...surge,
    }
  }))
  return results
}

/**
 * Admin: Créer / mettre à jour une règle surge manuelle
 */
export async function setManualSurge({ zone, multiplier, label, durationMinutes }) {
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString()
  try {
    const { data, error } = await supabase
      .from('surge_pricing')
      .upsert({ zone, multiplier, label, active: true, expires_at: expiresAt, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('setManualSurge simulation:', err.message)
    return { zone, multiplier, label, expiresAt, simulated: true }
  }
}

/**
 * Admin: Désactiver le surge pour une zone
 */
export async function deactivateSurge(zone) {
  try {
    await supabase.from('surge_pricing').update({ active: false }).eq('zone', zone)
  } catch {
    // no-op
  }
}

/**
 * Retourne la couleur associée à un multiplicateur
 */
export function getSurgeColor(multiplier) {
  if (multiplier >= 2.0) return '#ef4444'
  if (multiplier >= 1.5) return '#f97316'
  if (multiplier >= 1.2) return '#f59e0b'
  return '#22c55e'
}
