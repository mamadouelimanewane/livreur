import { supabase } from './supabaseClient'

/**
 * Charge le snapshot initial des alertes admin.
 * Retourne un tableau de notifications classées par urgence.
 */
export async function getAdminNotifications() {
  const [pendingDrivers, sosAlerts, pendingCashouts, expiringDocs] =
    await Promise.allSettled([
      supabase.from('drivers').select('id,name,created_at', { count: 'exact' }).eq('status', 'En attente'),
      supabase.from('sos_alerts').select('id,created_at').eq('resolved', false),
      supabase.from('rides').select('id').eq('payment_status', 'pending').eq('status', 'completed'),
      supabase.from('drivers').select('id,name').eq('status', 'expiring_soon'),
    ])

  const notifications = []

  // Conducteurs en attente
  const pd = pendingDrivers.value
  const pdCount = (!pd?.error && pd?.count) || 0
  if (pdCount > 0) {
    notifications.push({
      id: 'pending-drivers',
      type: 'warning',
      icon: '🚗',
      title: `${pdCount} conducteur${pdCount > 1 ? 's' : ''} en attente d'approbation`,
      link: '/drivers/pending',
      time: 'Action requise',
      priority: 1,
    })
  }

  // Alertes SOS
  const sa = sosAlerts.value
  const saCount = (!sa?.error && sa?.data?.length) || 0
  if (saCount > 0) {
    notifications.push({
      id: 'sos-alerts',
      type: 'danger',
      icon: '🚨',
      title: `${saCount} alerte${saCount > 1 ? 's' : ''} SOS active${saCount > 1 ? 's' : ''}`,
      link: '/support/sos-requests',
      time: 'URGENT',
      priority: 0,
    })
  }

  // Retraits en attente
  const pc = pendingCashouts.value
  const pcCount = (!pc?.error && pc?.data?.length) || 0
  if (pcCount > 0) {
    notifications.push({
      id: 'cashouts',
      type: 'info',
      icon: '💸',
      title: `${pcCount} retrait${pcCount > 1 ? 's' : ''} en attente de validation`,
      link: '/transactions/cashout',
      time: 'À traiter',
      priority: 2,
    })
  }

  // Documents expirant
  const ed = expiringDocs.value
  const edCount = (!ed?.error && ed?.data?.length) || 0
  if (edCount > 0) {
    notifications.push({
      id: 'expiring-docs',
      type: 'warning',
      icon: '📋',
      title: `${edCount} document${edCount > 1 ? 's' : ''} proche${edCount > 1 ? 's' : ''} d'expiration`,
      link: '/drivers/expiring-docs',
      time: 'Cette semaine',
      priority: 3,
    })
  }

  // Si Supabase hors ligne : retourner mock de démo
  if (notifications.length === 0) {
    return [
      { id: 'demo-1', type: 'warning', icon: '🚗', title: '3 conducteurs en attente d\'approbation', link: '/drivers/pending', time: 'il y a 5 min', priority: 1 },
      { id: 'demo-2', type: 'danger', icon: '🚨', title: '1 alerte SOS active', link: '/support/sos-requests', time: 'URGENT', priority: 0 },
      { id: 'demo-3', type: 'info', icon: '💸', title: '2 retraits en attente', link: '/transactions/cashout', time: 'il y a 12 min', priority: 2 },
    ]
  }

  return notifications.sort((a, b) => a.priority - b.priority)
}

/**
 * Abonnement Supabase Realtime pour les nouvelles notifications.
 * @param {Function} onNew — callback(notification) appelé à chaque changement
 * @returns cleanup function
 */
export function subscribeToAdminAlerts(onNew) {
  const channels = []

  // Nouveaux conducteurs → notification
  channels.push(
    supabase.channel('admin-alerts-drivers')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'drivers' }, payload => {
        onNew({
          id: `driver-${payload.new.id}`,
          type: 'warning',
          icon: '🚗',
          title: `Nouveau conducteur inscrit : ${payload.new.name || 'Inconnu'}`,
          link: '/drivers/pending',
          time: 'À l\'instant',
        })
      })
      .subscribe()
  )

  // Nouvelles alertes SOS
  channels.push(
    supabase.channel('admin-alerts-sos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, () => {
        onNew({
          id: `sos-${Date.now()}`,
          type: 'danger',
          icon: '🚨',
          title: 'Nouvelle alerte SOS reçue !',
          link: '/support/sos-requests',
          time: 'À l\'instant',
        })
      })
      .subscribe()
  )

  return () => channels.forEach(ch => supabase.removeChannel(ch))
}
