import {
  MOBILE_DRIVER_EARNINGS,
  MOBILE_DRIVER_HOME_CONTENT,
  MOBILE_DRIVER_PROFILE,
  MOBILE_USER_HOME_CONTENT,
  MOBILE_USER_PROFILE,
  MOBILE_USER_RIDES,
} from '../../data/mockApiData'
import { resolveMock } from './utils'
import { supabase } from './supabaseClient'

/**
 * Note : Les fonctions ci-dessous utilisent encore les mocks par défaut.
 * Pour basculer sur Supabase, décommentez les lignes correspondantes.
 */

export async function getMobileUserHomeContent() {
  return resolveMock(MOBILE_USER_HOME_CONTENT)
}

export async function getMobileUserRides() {
  // Récupération réelle des courses classées par date de création décroissante
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error("Erreur récupération courses:", error)
    return resolveMock(MOBILE_USER_RIDES)
  }
  
  // Formatage pour l'UI (mapping des champs DB vers champs UI)
  return data.map(r => ({
    id: r.id.substring(0, 8).toUpperCase(),
    type: r.type || 'Course',
    from: r.pickup_address,
    to: r.destination_address,
    status: r.status === 'pending' ? 'en cours' : r.status === 'accepted' ? 'completed' : 'cancelled', // Simplification pour démo
    price: `${r.price} FCFA`,
    date: new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }))
}

export async function getMobileUserProfile() {
  return resolveMock(MOBILE_USER_PROFILE)
}

export async function getMobileDriverHomeContent() {
  return resolveMock(MOBILE_DRIVER_HOME_CONTENT)
}

export async function getMobileDriverEarnings() {
  return resolveMock(MOBILE_DRIVER_EARNINGS)
}

export async function getMobileDriverProfile() {
  return resolveMock(MOBILE_DRIVER_PROFILE)
}
