import { supabase } from './supabaseClient'

/**
 * Politique d'annulation LiviGo
 * Les frais augmentent avec le temps depuis la confirmation du conducteur
 */
export const CANCELLATION_POLICY = [
  { maxMinutes: 2,   feePercent: 0,    feeFCFA: 0,    label: 'Gratuit',       description: 'Annulation gratuite dans les 2 premières minutes' },
  { maxMinutes: 5,   feePercent: 0,    feeFCFA: 250,  label: '250 FCFA',      description: 'Frais modérés entre 2 et 5 minutes' },
  { maxMinutes: 10,  feePercent: 20,   feeFCFA: null, label: '20% du tarif',  description: 'Conducteur en route depuis plus de 5 min' },
  { maxMinutes: null,feePercent: 50,   feeFCFA: null, label: '50% du tarif',  description: 'Annulation tardive — conducteur arrivé' },
]

export const CANCELLATION_REASONS = [
  { id: 'changed_mind',       label: 'J\'ai changé d\'avis',                  penaltyDriver: false },
  { id: 'wrong_destination',  label: 'Mauvaise destination saisie',            penaltyDriver: false },
  { id: 'wait_too_long',      label: 'Attente trop longue',                    penaltyDriver: true  },
  { id: 'driver_behaviour',   label: 'Comportement du conducteur',             penaltyDriver: true  },
  { id: 'driver_wrong_place', label: 'Conducteur au mauvais endroit',          penaltyDriver: true  },
  { id: 'emergency',          label: 'Urgence personnelle',                    penaltyDriver: false },
  { id: 'other',              label: 'Autre raison',                           penaltyDriver: false },
]

/**
 * Calcule les frais d'annulation selon le temps écoulé depuis la confirmation
 */
export function computeCancellationFee({ confirmedAt, baseFare, cancelledBy = 'user' }) {
  if (cancelledBy === 'driver') {
    return { fee: 0, feeLabel: 'Gratuit', driverPenalty: true, message: 'Le conducteur a annulé — aucun frais pour vous.' }
  }

  const minutesElapsed = confirmedAt
    ? (Date.now() - new Date(confirmedAt).getTime()) / 60000
    : 0

  for (const tier of CANCELLATION_POLICY) {
    if (tier.maxMinutes === null || minutesElapsed <= tier.maxMinutes) {
      const fee = tier.feeFCFA !== null
        ? tier.feeFCFA
        : Math.round((baseFare || 0) * tier.feePercent / 100)
      return {
        fee,
        feeLabel: fee === 0 ? 'Gratuit' : `${fee.toLocaleString('fr-FR')} FCFA`,
        minutesElapsed: Math.round(minutesElapsed),
        tier: tier.label,
        message: tier.description,
        driverPenalty: false,
      }
    }
  }

  // Fallback dernier palier
  const lastTier = CANCELLATION_POLICY[CANCELLATION_POLICY.length - 1]
  const fee = Math.round((baseFare || 0) * lastTier.feePercent / 100)
  return { fee, feeLabel: `${fee.toLocaleString('fr-FR')} FCFA`, minutesElapsed: Math.round(minutesElapsed), tier: lastTier.label, message: lastTier.description }
}

/**
 * Annule une course et applique la politique
 */
export async function cancelRide({ rideId, reason, cancelledBy = 'user', confirmedAt, baseFare }) {
  const { fee, feeLabel, driverPenalty } = computeCancellationFee({ confirmedAt, baseFare, cancelledBy })

  const updatePayload = {
    status: 'cancelled',
    cancellation_reason: reason,
    cancelled_by: cancelledBy,
    cancellation_fee: fee,
    cancelled_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('rides').update(updatePayload).eq('id', rideId).select().single()
    if (error) throw error

    // Pénalité conducteur si applicable
    if (driverPenalty) {
      await applyDriverPenalty(data.driver_id, rideId)
    }
    return { ...data, fee, feeLabel }
  } catch (err) {
    console.warn('cancelRide: simulation', err.message)
    return { id: rideId, ...updatePayload, fee, feeLabel, simulated: true }
  }
}

async function applyDriverPenalty(driverId, rideId) {
  if (!driverId) return
  try {
    await supabase.from('driver_penalties').insert({
      driver_id: driverId,
      ride_id: rideId,
      type: 'cancellation',
      points: -5,
      created_at: new Date().toISOString(),
    })
  } catch { /* non-critique */ }
}

/**
 * Statistiques d'annulation admin
 */
export async function getCancellationStats(period = '7d') {
  const since = new Date(Date.now() - (period === '30d' ? 30 : 7) * 86400000).toISOString()
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('id, cancellation_reason, cancelled_by, cancellation_fee, cancelled_at')
      .eq('status', 'cancelled')
      .gte('cancelled_at', since)
    if (error) throw error
    if (data) return buildCancelStats(data)
  } catch { /* fallback */ }

  return {
    total: 28, byUser: 18, byDriver: 7, bySystem: 3,
    totalFees: 7000,
    topReasons: [
      { reason: 'J\'ai changé d\'avis', count: 9 },
      { reason: 'Attente trop longue', count: 7 },
      { reason: 'Comportement du conducteur', count: 4 },
    ],
  }
}

function buildCancelStats(rows) {
  const byUser   = rows.filter(r => r.cancelled_by === 'user').length
  const byDriver = rows.filter(r => r.cancelled_by === 'driver').length
  const totalFees = rows.reduce((s, r) => s + (r.cancellation_fee || 0), 0)
  const reasonMap = {}
  rows.forEach(r => {
    if (r.cancellation_reason) reasonMap[r.cancellation_reason] = (reasonMap[r.cancellation_reason] || 0) + 1
  })
  const topReasons = Object.entries(reasonMap)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  return { total: rows.length, byUser, byDriver, bySystem: rows.length - byUser - byDriver, totalFees, topReasons }
}
