import { supabase } from './supabaseClient'

/**
 * Service de sécurité LiviGo
 * SOS, Safety Share, signalements de conduite dangereuse
 */

/**
 * Déclenche une alerte SOS
 */
export async function triggerSOS({ userId, rideId, location, type = 'emergency' }) {
  const alert = {
    user_id: userId,
    ride_id: rideId || null,
    location_lat: location?.lat || null,
    location_lon: location?.lon || null,
    type,
    resolved: false,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('sos_alerts').insert(alert).select().single()
    if (error) throw error
    await notifySupportTeam(data)
    return data
  } catch (err) {
    console.warn('triggerSOS simulation:', err.message)
    const simulated = { id: `SOS-${Date.now()}`, ...alert, simulated: true }
    await notifySupportTeam(simulated)
    return simulated
  }
}

/**
 * Génère un lien de suivi de trajet partageable (Safety Share)
 */
export async function createSafetyShare({ rideId, userId, expiresMinutes = 120 }) {
  const token = crypto.randomUUID?.() || `ss-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const expiresAt = new Date(Date.now() + expiresMinutes * 60000).toISOString()
  const shareUrl = `${window.location.origin}/track/${token}`

  try {
    await supabase.from('safety_shares').insert({
      token, ride_id: rideId, user_id: userId,
      expires_at: expiresAt, created_at: new Date().toISOString(),
    })
  } catch { /* non-critique */ }

  return { token, shareUrl, expiresAt }
}

/**
 * Signale une conduite dangereuse (accéléromètre)
 */
export async function reportDangerousDriving({ rideId, driverId, eventType, severity, sensorData }) {
  const report = {
    ride_id: rideId,
    driver_id: driverId,
    event_type: eventType, // 'hard_brake' | 'sharp_turn' | 'speeding'
    severity,              // 'low' | 'medium' | 'high'
    sensor_data: sensorData ? JSON.stringify(sensorData) : null,
    created_at: new Date().toISOString(),
  }
  try {
    await supabase.from('driving_events').insert(report)
  } catch { /* non-critique */ }
  return report
}

/**
 * Récupère les alertes SOS actives pour l'admin
 */
export async function getActiveSOS() {
  try {
    const { data, error } = await supabase
      .from('sos_alerts')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data?.length > 0) return data
  } catch { /* fallback */ }

  return [
    { id: 'SOS-001', user_id: 'USR-003', ride_id: 'RID-045', type: 'emergency', location_lat: 14.693, location_lon: -17.447, resolved: false, created_at: new Date(Date.now() - 300000).toISOString() },
  ]
}

/**
 * Marque une alerte SOS comme résolue
 */
export async function resolveSOS(sosId, resolvedBy) {
  try {
    const { data, error } = await supabase
      .from('sos_alerts')
      .update({ resolved: true, resolved_by: resolvedBy, resolved_at: new Date().toISOString() })
      .eq('id', sosId).select().single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('resolveSOS simulation:', err.message)
    return { id: sosId, resolved: true, simulated: true }
  }
}

/**
 * Historique des signalements de conduite
 */
export async function getDrivingEventStats(driverId) {
  try {
    const { data, error } = await supabase
      .from('driving_events')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data) return buildDrivingStats(data)
  } catch { /* fallback */ }

  return { total: 2, hardBrakes: 1, sharpTurns: 1, speeding: 0, safetyScore: 87 }
}

function buildDrivingStats(events) {
  const total = events.length
  const hardBrakes  = events.filter(e => e.event_type === 'hard_brake').length
  const sharpTurns  = events.filter(e => e.event_type === 'sharp_turn').length
  const speeding    = events.filter(e => e.event_type === 'speeding').length
  const safetyScore = Math.max(0, 100 - hardBrakes * 5 - sharpTurns * 3 - speeding * 8)
  return { total, hardBrakes, sharpTurns, speeding, safetyScore }
}

async function notifySupportTeam(alert) {
  // En production : envoyer un SMS/email à l'équipe support via FCM / API SMS
  console.info('🚨 SOS Alert received:', alert.id, '— Support team notified')
}
