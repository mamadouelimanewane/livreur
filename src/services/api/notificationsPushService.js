/**
 * Service de Notifications Push
 * Intégration avec Firebase Cloud Messaging (FCM)
 */

// Configuration Firebase (à remplacer par vos propres clés)
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Types de notifications
export const NOTIFICATION_TYPES = {
  // Courses
  RIDE_REQUEST: 'ride_request',
  RIDE_ACCEPTED: 'ride_accepted',
  RIDE_STARTED: 'ride_started',
  RIDE_COMPLETED: 'ride_completed',
  RIDE_CANCELLED: 'ride_cancelled',
  RIDE_DRIVER_ARRIVING: 'ride_driver_arriving',
  
  // Conducteurs
  DRIVER_APPROVED: 'driver_approved',
  DRIVER_REJECTED: 'driver_rejected',
  DRIVER_DOCUMENT_EXPIRING: 'driver_document_expiring',
  DRIVER_NEW_RIDE: 'driver_new_ride',
  
  // Paiements
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
  CASHOUT_APPROVED: 'cashout_approved',
  CASHOUT_REJECTED: 'cashout_rejected',
  
  // Promotions
  PROMO_AVAILABLE: 'promo_available',
  PROMO_EXPIRING: 'promo_expiring',
  
  // Support
  SOS_ALERT: 'sos_alert',
  SUPPORT_MESSAGE: 'support_message',
  TICKET_UPDATED: 'ticket_updated',
  
  // Admin
  NEW_DRIVER_PENDING: 'new_driver_pending',
  NEW_USER_REGISTERED: 'new_user_registered',
  SYSTEM_ALERT: 'system_alert',
}

// Configuration des notifications par type
const NOTIFICATION_CONFIG = {
  [NOTIFICATION_TYPES.RIDE_REQUEST]: {
    title: 'Nouvelle demande de course',
    icon: '🚗',
    sound: 'ride_request.mp3',
    vibrate: [200, 100, 200],
    priority: 'high',
  },
  [NOTIFICATION_TYPES.RIDE_ACCEPTED]: {
    title: 'Course acceptée',
    icon: '✅',
    sound: 'ride_accepted.mp3',
    vibrate: [100],
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.RIDE_DRIVER_ARRIVING]: {
    title: 'Votre conducteur arrive',
    icon: '📍',
    sound: 'driver_arriving.mp3',
    vibrate: [200, 100, 200, 100, 200],
    priority: 'high',
  },
  [NOTIFICATION_TYPES.RIDE_COMPLETED]: {
    title: 'Course terminée',
    icon: '🏁',
    sound: 'ride_completed.mp3',
    vibrate: [100],
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.DRIVER_APPROVED]: {
    title: 'Compte approuvé',
    icon: '🎉',
    sound: 'approved.mp3',
    vibrate: [200, 100, 200],
    priority: 'high',
  },
  [NOTIFICATION_TYPES.DRIVER_NEW_RIDE]: {
    title: 'Nouvelle course disponible',
    icon: '🚕',
    sound: 'new_ride.mp3',
    vibrate: [300, 100, 300],
    priority: 'high',
  },
  [NOTIFICATION_TYPES.SOS_ALERT]: {
    title: 'ALERTE SOS',
    icon: '🚨',
    sound: 'sos_alert.mp3',
    vibrate: [500, 100, 500, 100, 500],
    priority: 'critical',
  },
  [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: {
    title: 'Paiement reçu',
    icon: '💰',
    sound: 'payment.mp3',
    vibrate: [100],
    priority: 'normal',
  },
}

let messaging = null
let isInitialized = false

/**
 * Initialise Firebase Messaging
 */
export async function initPushNotifications() {
  if (isInitialized) return true
  
  try {
    // Vérifier si les notifications sont supportées
    if (!('Notification' in window)) {
      console.warn('Ce navigateur ne supporte pas les notifications')
      return false
    }
    
    // Vérifier si Firebase est configuré
    if (!FIREBASE_CONFIG.apiKey) {
      console.warn('Firebase non configuré - mode simulation')
      isInitialized = true
      return true
    }
    
    // Import dynamique de Firebase
    const { initializeApp } = await import('firebase/app')
    const { getMessaging, onMessage, getToken } = await import('firebase/messaging')
    
    const app = initializeApp(FIREBASE_CONFIG)
    messaging = getMessaging(app)
    
    // Écouter les messages en foreground
    onMessage(messaging, (payload) => {
      handleForegroundMessage(payload)
    })
    
    isInitialized = true
    return true
  } catch (error) {
    console.error('Erreur initialisation Firebase:', error)
    isInitialized = true // Mode simulation
    return true
  }
}

/**
 * Demande la permission pour les notifications
 */
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Erreur demande permission:', error)
    return false
  }
}

/**
 * Obtient le token FCM de l'appareil
 */
export async function getFCMToken() {
  if (!messaging) {
    // Mode simulation - retourner un token fictif
    return `SIMULATED_TOKEN_${Date.now()}`
  }
  
  try {
    const { getToken } = await import('firebase/messaging')
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || '',
    })
    return token
  } catch (error) {
    console.error('Erreur obtention token FCM:', error)
    return null
  }
}

/**
 * Enregistre le token auprès du serveur
 */
export async function registerDeviceToken(userId, token, deviceType = 'web') {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { error } = await supabase
      .from('device_tokens')
      .upsert({
        user_id: userId,
        token,
        device_type: deviceType,
        updated_at: new Date().toISOString(),
      })
    
    if (error) throw error
    return true
  } catch (error) {
    console.warn('registerDeviceToken: simulation', error)
    return true
  }
}

/**
 * Envoie une notification à un utilisateur spécifique
 */
export async function sendNotificationToUser(userId, notification) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    // Récupérer les tokens de l'utilisateur
    const { data: tokens, error } = await supabase
      .from('device_tokens')
      .select('token')
      .eq('user_id', userId)
    
    if (error) throw error
    
    if (!tokens || tokens.length === 0) {
      console.warn('Aucun token trouvé pour l\'utilisateur')
      return false
    }
    
    // Envoyer à tous les appareils de l'utilisateur
    const results = await Promise.all(
      tokens.map(t => sendPushNotification(t.token, notification))
    )
    
    return results.every(r => r)
  } catch (error) {
    console.error('sendNotificationToUser error:', error)
    return false
  }
}

/**
 * Envoie une notification push via FCM
 */
async function sendPushNotification(token, notification) {
  const config = NOTIFICATION_CONFIG[notification.type] || {}
  
  const message = {
    token,
    notification: {
      title: notification.title || config.title || 'LiviGo',
      body: notification.body || notification.message,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      image: notification.image,
    },
    data: {
      type: notification.type,
      ...notification.data,
      click_action: notification.clickAction || notification.link,
    },
    android: {
      priority: config.priority || 'normal',
      notification: {
        sound: config.sound,
        icon: 'ic_notification',
        color: '#4680ff',
        vibrateTimingsMillis: config.vibrate,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: config.sound,
          badge: notification.badge,
        },
      },
    },
  }
  
  // En production, ceci serait envoyé via Firebase Admin SDK côté serveur
  // Ici on simule l'envoi
  console.log('Sending push notification:', message)
  return true
}

/**
 * Gère les messages reçus en foreground
 */
function handleForegroundMessage(payload) {
  const { notification, data } = payload
  
  // Afficher une notification native
  if (Notification.permission === 'granted') {
    const config = NOTIFICATION_CONFIG[data?.type] || {}
    
    new Notification(notification.title, {
      body: notification.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      image: notification.image,
      vibrate: config.vibrate,
      data: data,
      requireInteraction: config.priority === 'high' || config.priority === 'critical',
    })
  }
  
  // Déclencher un événement personnalisé
  window.dispatchEvent(new CustomEvent('pushNotification', {
    detail: { notification, data },
  }))
}

/**
 * Envoie une notification à un topic (groupe d'utilisateurs)
 */
export async function sendNotificationToTopic(topic, notification) {
  // En production, ceci utiliserait Firebase Admin SDK
  console.log(`Sending to topic ${topic}:`, notification)
  return true
}

/**
 * Abonne un utilisateur à un topic
 */
export async function subscribeToTopic(userId, topic) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { error } = await supabase
      .from('topic_subscriptions')
      .insert({
        user_id: userId,
        topic,
        subscribed_at: new Date().toISOString(),
      })
    
    if (error && error.code !== '23505') throw error
    return true
  } catch (error) {
    console.warn('subscribeToTopic: simulation', error)
    return true
  }
}

/**
 * Désabonne un utilisateur d'un topic
 */
export async function unsubscribeFromTopic(userId, topic) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { error } = await supabase
      .from('topic_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('topic', topic)
    
    if (error) throw error
    return true
  } catch (error) {
    console.warn('unsubscribeFromTopic: simulation', error)
    return true
  }
}

/**
 * Récupère l'historique des notifications d'un utilisateur
 */
export async function getNotificationHistory(userId, limit = 50) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.warn('getNotificationHistory: fallback mock', error)
    return [
      {
        id: 'NOTIF-001',
        type: NOTIFICATION_TYPES.RIDE_COMPLETED,
        title: 'Course terminée',
        body: 'Votre course a été terminée avec succès. Merci de noter votre expérience!',
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'NOTIF-002',
        type: NOTIFICATION_TYPES.PROMO_AVAILABLE,
        title: 'Nouvelle promotion',
        body: 'Utilisez le code WEEKEND25 pour 25% de réduction ce weekend!',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
  }
}

/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.warn('markNotificationAsRead: simulation', error)
    return true
  }
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(userId) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false)
    
    if (error) throw error
    return true
  } catch (error) {
    console.warn('markAllNotificationsAsRead: simulation', error)
    return true
  }
}

/**
 * Compte les notifications non lues
 */
export async function getUnreadNotificationCount(userId) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)
    
    if (error) throw error
    return count || 0
  } catch (error) {
    console.warn('getUnreadNotificationCount: fallback', error)
    return 3
  }
}

/**
 * Crée une notification locale (sans push)
 */
export async function createLocalNotification(userId, notification) {
  try {
    const { supabase } = await import('./supabaseClient')
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        data: notification.data || null,
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.warn('createLocalNotification: simulation', error)
    return {
      id: `NOTIF-${Date.now()}`,
      ...notification,
      read: false,
      created_at: new Date().toISOString(),
    }
  }
}

/**
 * Hook React pour les notifications
 */
export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!userId) return
    
    async function loadNotifications() {
      setLoading(true)
      const [history, count] = await Promise.all([
        getNotificationHistory(userId),
        getUnreadNotificationCount(userId),
      ])
      setNotifications(history)
      setUnreadCount(count)
      setLoading(false)
    }
    
    loadNotifications()
    
    // Écouter les nouvelles notifications
    const handleNewNotification = (event) => {
      setNotifications(prev => [event.detail, ...prev])
      setUnreadCount(prev => prev + 1)
    }
    
    window.addEventListener('pushNotification', handleNewNotification)
    
    return () => {
      window.removeEventListener('pushNotification', handleNewNotification)
    }
  }, [userId])
  
  const markAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId)
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }
  
  const markAllRead = async () => {
    await markAllNotificationsAsRead(userId)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }
  
  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllRead,
  }
}

// Import React pour le hook
import { useState, useEffect } from 'react'
