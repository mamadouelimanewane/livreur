/**
 * Service de gestion du mode hors ligne
 * Utilise IndexedDB pour le stockage local
 */

const DB_NAME = 'livigo_offline_db'
const DB_VERSION = 1

// Stores disponibles
const STORES = {
  rides: 'Courses',
  drivers: 'Conducteurs',
  users: 'Utilisateurs',
  pendingActions: 'Actions en attente',
  settings: 'Paramètres',
  cache: 'Cache général',
}

let db = null

/**
 * Initialise la base de données IndexedDB
 */
export async function initOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result
      
      // Créer les stores
      Object.entries(STORES).forEach(([name, label]) => {
        if (!database.objectStoreNames.contains(name)) {
          const store = database.createObjectStore(name, { keyPath: 'id' })
          store.createIndex('synced', 'synced', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
        }
      })
    }
  })
}

/**
 * Vérifie si la base de données est initialisée
 */
export function isDBReady() {
  return db !== null
}

/**
 * Sauvegarde des données dans un store
 */
export async function saveOffline(storeName, data) {
  if (!isDBReady()) await initOfflineDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    
    const dataToSave = {
      ...data,
      synced: false,
      savedAt: new Date().toISOString(),
    }
    
    const request = store.put(dataToSave)
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Récupère des données depuis un store
 */
export async function getOffline(storeName, id) {
  if (!isDBReady()) await initOfflineDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(id)
    
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Récupère toutes les données d'un store
 */
export async function getAllOffline(storeName) {
  if (!isDBReady()) await initOfflineDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()
    
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

/**
 * Supprime des données d'un store
 */
export async function deleteOffline(storeName, id) {
  if (!isDBReady()) await initOfflineDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(id)
    
    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Efface toutes les données d'un store
 */
export async function clearStore(storeName) {
  if (!isDBReady()) await initOfflineDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.clear()
    
    request.onsuccess = () => resolve(true)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Ajoute une action en attente de synchronisation
 */
export async function addPendingAction(action) {
  const pendingAction = {
    id: `ACTION-${Date.now()}`,
    type: action.type, // 'create', 'update', 'delete'
    entity: action.entity, // 'ride', 'driver', 'user'
    data: action.data,
    endpoint: action.endpoint,
    method: action.method || 'POST',
    attempts: 0,
    maxAttempts: 3,
    createdAt: new Date().toISOString(),
  }
  
  return saveOffline('pendingActions', pendingAction)
}

/**
 * Récupère toutes les actions en attente
 */
export async function getPendingActions() {
  return getAllOffline('pendingActions')
}

/**
 * Supprime une action en attente
 */
export async function removePendingAction(actionId) {
  return deleteOffline('pendingActions', actionId)
}

/**
 * Met à jour le nombre de tentatives d'une action
 */
export async function incrementActionAttempts(actionId) {
  const action = await getOffline('pendingActions', actionId)
  if (action) {
    action.attempts += 1
    return saveOffline('pendingActions', action)
  }
}

/**
 * Sauvegarde le cache des données essentielles
 */
export async function cacheEssentialData(data) {
  const cacheData = {
    id: 'essential_cache',
    data,
    cachedAt: new Date().toISOString(),
    ttl: 24 * 60 * 60 * 1000, // 24 heures
  }
  
  return saveOffline('cache', cacheData)
}

/**
 * Récupère le cache des données essentielles
 */
export async function getCachedData() {
  const cache = await getOffline('cache', 'essential_cache')
  
  if (!cache) return null
  
  // Vérifier si le cache a expiré
  const cacheAge = Date.now() - new Date(cache.cachedAt).getTime()
  if (cacheAge > cache.ttl) {
    await deleteOffline('cache', 'essential_cache')
    return null
  }
  
  return cache.data
}

/**
 * Vérifie la connectivité réseau
 */
export function isOnline() {
  return navigator.onLine
}

/**
 * Ajoute un écouteur pour les changements de connectivité
 */
export function onConnectivityChange(callback) {
  const handleOnline = () => callback(true)
  const handleOffline = () => callback(false)
  
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Retourne une fonction de nettoyage
  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

/**
 * Synchronise les actions en attente
 */
export async function syncPendingActions(apiClient) {
  const actions = await getPendingActions()
  const results = []
  
  for (const action of actions) {
    if (action.attempts >= action.maxAttempts) {
      // Supprimer les actions qui ont échoué trop de fois
      await removePendingAction(action.id)
      results.push({ action, success: false, reason: 'max_attempts_reached' })
      continue
    }
    
    try {
      // Tenter la synchronisation
      const response = await apiClient({
        method: action.method,
        url: action.endpoint,
        data: action.data,
      })
      
      // Succès - supprimer l'action
      await removePendingAction(action.id)
      results.push({ action, success: true, response })
      
      // Marquer les données locales comme synchronisées
      if (action.entity && action.data.id) {
        const localData = await getOffline(action.entity + 's', action.data.id)
        if (localData) {
          localData.synced = true
          await saveOffline(action.entity + 's', localData)
        }
      }
    } catch (error) {
      // Échec - incrémenter les tentatives
      await incrementActionAttempts(action.id)
      results.push({ action, success: false, error })
    }
  }
  
  return results
}

/**
 * Précharge les données essentielles pour le mode hors ligne
 */
export async function preloadEssentialData(fetchFunctions) {
  try {
    const data = {}
    
    for (const [key, fetchFn] of Object.entries(fetchFunctions)) {
      try {
        data[key] = await fetchFn()
      } catch (err) {
        console.warn(`Failed to preload ${key}:`, err)
        data[key] = []
      }
    }
    
    await cacheEssentialData(data)
    return data
  } catch (err) {
    console.error('Failed to preload essential data:', err)
    throw err
  }
}

/**
 * Obtient les statistiques du stockage hors ligne
 */
export async function getOfflineStats() {
  const stats = {
    stores: {},
    pendingActions: 0,
    totalSize: 0,
  }
  
  for (const storeName of Object.keys(STORES)) {
    const data = await getAllOffline(storeName)
    stats.stores[storeName] = data.length
    stats.totalSize += JSON.stringify(data).length
  }
  
  const pendingActions = await getPendingActions()
  stats.pendingActions = pendingActions.length
  
  return stats
}

/**
 * Efface toutes les données hors ligne
 */
export async function clearAllOfflineData() {
  for (const storeName of Object.keys(STORES)) {
    await clearStore(storeName)
  }
}

/**
 * Hook React pour la connectivité
 */
export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  useEffect(() => {
    return onConnectivityChange((online) => {
      setIsOnline(online)
    })
  }, [])
  
  return {
    isOnline,
    isOffline: !isOnline,
  }
}

// Import React pour le hook
import { useState, useEffect } from 'react'
