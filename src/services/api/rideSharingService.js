import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Données mock pour le partage de trajet
const MOCK_SHARED_RIDES = [
  {
    id: 'SHARE-001',
    rideId: 'RID-001',
    userId: 'USR-001',
    userName: 'Fatou Diallo',
    shareToken: 'abc123def456',
    shareLink: 'https://livigo.app/track/abc123def456',
    contacts: [
      { name: 'Maman', phone: '+221 77 000 00 00', notifiedAt: '2024-03-15T10:30:00Z' },
      { name: 'Ami', phone: '+221 77 111 11 11', notifiedAt: '2024-03-15T10:30:00Z' },
    ],
    driverName: 'Oumar Sall',
    driverPhone: '+221 77 100 22 33',
    vehicleType: 'Moto',
    vehiclePlate: 'DK-1234-AB',
    pickupAddress: 'Dakar Plateau',
    destinationAddress: 'Médina',
    status: 'active',
    startedAt: '2024-03-15T10:30:00Z',
    endedAt: null,
    createdAt: '2024-03-15T10:25:00Z',
  },
]

// Contacts d'urgence par défaut
const DEFAULT_EMERGENCY_CONTACTS = [
  { id: 'EC-001', name: 'Contact 1', phone: '', relation: 'family' },
  { id: 'EC-002', name: 'Contact 2', phone: '', relation: 'friend' },
]

/**
 * Crée un partage de trajet
 */
export async function createRideShare(rideData) {
  const shareToken = generateShareToken()
  
  const shareData = {
    ride_id: rideData.rideId,
    user_id: rideData.userId,
    user_name: rideData.userName,
    share_token: shareToken,
    share_link: `https://livigo.app/track/${shareToken}`,
    driver_name: rideData.driverName,
    driver_phone: rideData.driverPhone,
    vehicle_type: rideData.vehicleType,
    vehicle_plate: rideData.vehiclePlate,
    pickup_address: rideData.pickupAddress,
    destination_address: rideData.destinationAddress,
    status: 'active',
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('ride_shares')
      .insert(shareData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createRideShare: simulation locale', err)
    return {
      id: `SHARE-${Date.now()}`,
      ...shareData,
    }
  }
}

/**
 * Génère un token de partage unique
 */
function generateShareToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let token = ''
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Récupère un partage par token
 */
export async function getRideShareByToken(token) {
  try {
    const { data, error } = await supabase
      .from('ride_shares')
      .select('*')
      .eq('share_token', token)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getRideShareByToken: fallback mock', err)
    return MOCK_SHARED_RIDES.find(s => s.shareToken === token) || null
  }
}

/**
 * Ajoute des contacts à notifier
 */
export async function addShareContacts(shareId, contacts) {
  try {
    const { data, error } = await supabase
      .from('ride_share_contacts')
      .insert(contacts.map(c => ({
        share_id: shareId,
        name: c.name,
        phone: c.phone,
        notified_at: new Date().toISOString(),
      })))
      .select()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('addShareContacts: simulation', err)
    return contacts.map((c, i) => ({
      id: `SC-${Date.now()}-${i}`,
      share_id: shareId,
      ...c,
      notified_at: new Date().toISOString(),
    }))
  }
}

/**
 * Envoie une notification aux contacts
 */
export async function notifyContacts(shareId, message) {
  try {
    // Récupérer les contacts
    const { data: contacts, error } = await supabase
      .from('ride_share_contacts')
      .select('*')
      .eq('share_id', shareId)
    
    if (error) throw error
    
    // Envoyer via SMS/WhatsApp (intégration externe)
    for (const contact of contacts || []) {
      await sendShareNotification(contact.phone, message)
    }
    
    return true
  } catch (err) {
    console.warn('notifyContacts: simulation', err)
    return true
  }
}

/**
 * Envoie une notification de partage (simulation)
 */
async function sendShareNotification(phone, message) {
  // En production, intégrer avec un service SMS ou WhatsApp API
  console.log(`Sending to ${phone}: ${message}`)
  return true
}

/**
 * Met à jour la position en temps réel
 */
export async function updateShareLocation(shareId, location) {
  try {
    const { error } = await supabase
      .from('ride_share_locations')
      .insert({
        share_id: shareId,
        latitude: location.lat,
        longitude: location.lon,
        recorded_at: new Date().toISOString(),
      })
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('updateShareLocation: simulation', err)
    return true
  }
}

/**
 * Récupère l'historique des positions
 */
export async function getShareLocationHistory(shareId) {
  try {
    const { data, error } = await supabase
      .from('ride_share_locations')
      .select('*')
      .eq('share_id', shareId)
      .order('recorded_at', { ascending: true })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getShareLocationHistory: fallback mock', err)
    return [
      { latitude: 14.6928, longitude: -17.4467, recorded_at: '2024-03-15T10:30:00Z' },
      { latitude: 14.6950, longitude: -17.4480, recorded_at: '2024-03-15T10:35:00Z' },
      { latitude: 14.6980, longitude: -17.4500, recorded_at: '2024-03-15T10:40:00Z' },
    ]
  }
}

/**
 * Termine un partage de trajet
 */
export async function endRideShare(shareId) {
  try {
    const { data, error } = await supabase
      .from('ride_shares')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
      })
      .eq('id', shareId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('endRideShare: simulation', err)
    return { id: shareId, status: 'completed' }
  }
}

/**
 * Récupère les partages actifs d'un utilisateur
 */
export async function getActiveShares(userId) {
  try {
    const { data, error } = await supabase
      .from('ride_shares')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getActiveShares: fallback mock', err)
    return MOCK_SHARED_RIDES.filter(s => s.userId === userId && s.status === 'active')
  }
}

/**
 * Récupère les contacts d'urgence d'un utilisateur
 */
export async function getEmergencyContacts(userId) {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getEmergencyContacts: fallback mock', err)
  }
  return DEFAULT_EMERGENCY_CONTACTS
}

/**
 * Ajoute un contact d'urgence
 */
export async function addEmergencyContact(userId, contact) {
  const contactData = {
    user_id: userId,
    name: contact.name,
    phone: contact.phone,
    relation: contact.relation || 'other',
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert(contactData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('addEmergencyContact: simulation', err)
    return {
      id: `EC-${Date.now()}`,
      ...contactData,
    }
  }
}

/**
 * Met à jour un contact d'urgence
 */
export async function updateEmergencyContact(contactId, updates) {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateEmergencyContact: simulation', err)
    return { id: contactId, ...updates }
  }
}

/**
 * Supprime un contact d'urgence
 */
export async function deleteEmergencyContact(contactId) {
  try {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('deleteEmergencyContact: simulation', err)
    return true
  }
}

/**
 * Déclenche une alerte SOS
 */
export async function triggerSOSAlert(userId, location, rideId = null) {
  try {
    // Créer l'alerte SOS
    const { data: alert, error: alertError } = await supabase
      .from('sos_alerts')
      .insert({
        user_id: userId,
        ride_id: rideId,
        latitude: location.lat,
        longitude: location.lon,
        status: 'active',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (alertError) throw alertError
    
    // Notifier les contacts d'urgence
    const contacts = await getEmergencyContacts(userId)
    for (const contact of contacts) {
      if (contact.phone) {
        await sendSOSNotification(contact.phone, location)
      }
    }
    
    // Notifier le support admin
    await supabase.from('admin_notifications').insert({
      type: 'sos',
      title: 'ALERTE SOS',
      body: `Alerte SOS déclenchée par l'utilisateur ${userId}`,
      data: { alert_id: alert.id, location },
      created_at: new Date().toISOString(),
    })
    
    return alert
  } catch (err) {
    console.warn('triggerSOSAlert: simulation', err)
    return {
      id: `SOS-${Date.now()}`,
      user_id: userId,
      ride_id: rideId,
      status: 'active',
      created_at: new Date().toISOString(),
    }
  }
}

/**
 * Envoie une notification SOS
 */
async function sendSOSNotification(phone, location) {
  const message = `🚨 ALERTE SOS LiviGo 🚨
Votre contact a déclenché une alerte d'urgence.
Position: https://maps.google.com/?q=${location.lat},${location.lon}`
  
  console.log(`SOS to ${phone}: ${message}`)
  return true
}

/**
 * Résout une alerte SOS
 */
export async function resolveSOSAlert(alertId, resolvedBy, notes = null) {
  try {
    const { data, error } = await supabase
      .from('sos_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
        notes,
      })
      .eq('id', alertId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('resolveSOSAlert: simulation', err)
    return { id: alertId, status: 'resolved' }
  }
}

/**
 * Récupère les alertes SOS actives
 */
export async function getActiveSOSAlerts() {
  try {
    const { data, error } = await supabase
      .from('sos_alerts')
      .select('*, users(name, phone)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getActiveSOSAlerts: fallback mock', err)
    return []
  }
}

/**
 * Abonnement en temps réel aux mises à jour de position
 */
export function subscribeToLocationUpdates(shareToken, callback) {
  const channel = supabase
    .channel(`share_location:${shareToken}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'ride_share_locations',
      filter: `share_token=eq.${shareToken}`,
    }, (payload) => {
      callback({
        lat: payload.new.latitude,
        lon: payload.new.longitude,
        timestamp: payload.new.recorded_at,
      })
    })
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}

/**
 * Types de relations pour les contacts d'urgence
 */
export function getRelationTypes() {
  return [
    { id: 'family', label: 'Famille' },
    { id: 'friend', label: 'Ami(e)' },
    { id: 'colleague', label: 'Collègue' },
    { id: 'other', label: 'Autre' },
  ]
}
