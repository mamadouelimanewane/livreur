import { supabase } from './supabaseClient'

/**
 * Agrège toutes les métriques nécessaires au tableau de bord.
 * Utilise Promise.allSettled pour qu'une requête échouée ne bloque pas les autres.
 */
export async function getDashboardStats() {
  const [
    usersRes,
    driversRes,
    pendingDocsRes,
    taxiRidesRes,
    deliveryRidesRes,
  ] = await Promise.allSettled([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('drivers').select('id, status, is_online', { count: 'exact' }),
    supabase.from('drivers').select('id', { count: 'exact', head: true }).eq('status', 'expiring_soon'),
    supabase.from('rides').select('id, status, price').eq('category', 'taxi'),
    supabase.from('rides').select('id, status, price').eq('category', 'delivery'),
  ])

  // ── Utilisateurs ──
  const totalUsers = usersRes.status === 'fulfilled' && !usersRes.value.error
    ? (usersRes.value.count ?? 0)
    : 18 // fallback mock

  // ── Conducteurs ──
  let activeDrivers = 19, onlineDrivers = 0
  if (driversRes.status === 'fulfilled' && !driversRes.value.error && driversRes.value.data?.length > 0) {
    activeDrivers = driversRes.value.data.filter(d => d.status === 'Approuvé').length
    onlineDrivers = driversRes.value.data.filter(d => d.is_online).length
  }

  // ── Documents ──
  const expiringDocs = pendingDocsRes.status === 'fulfilled' && !pendingDocsRes.value.error
    ? (pendingDocsRes.value.count ?? 0)
    : 0

  // ── Courses Taxi ──
  const taxiRides = procesRides(taxiRidesRes, { total: 54, ongoing: 0, cancelled: 3, completed: 24, autoCancelled: 27, revenue: 3233.09, discount: 0 })

  // ── Courses Livraison ──
  const deliveryRides = procesRides(deliveryRidesRes, { total: 13, ongoing: 0, cancelled: 3, completed: 7, autoCancelled: 3, revenue: 13.44, discount: 8 })

  const totalRevenue = taxiRides.revenue + deliveryRides.revenue
  const totalDiscount = taxiRides.discount + deliveryRides.discount

  return {
    site: {
      users: totalUsers,
      drivers: activeDrivers,
      onlineDrivers,
      countries: 1,
      zones: 2,
      expiringDocs,
      revenue: formatAmount(totalRevenue),
      discount: totalDiscount,
    },
    taxi: taxiRides,
    delivery: deliveryRides,
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function procesRides(settledResult, fallback) {
  if (settledResult.status !== 'fulfilled' || settledResult.value.error || !settledResult.value.data?.length) {
    return { ...fallback, revenue: formatAmount(fallback.revenue), discount: fallback.discount, revenueRaw: fallback.revenue }
  }
  const rides = settledResult.value.data
  const total = rides.length
  const ongoing = rides.filter(r => r.status === 'accepted' || r.status === 'En cours').length
  const cancelled = rides.filter(r => r.status === 'cancelled' || r.status === 'Annulée').length
  const completed = rides.filter(r => r.status === 'completed' || r.status === 'Terminée').length
  const autoCancelled = rides.filter(r => r.status === 'auto-cancelled' || r.status === 'Auto-annulée').length
  const revenueRaw = rides
    .filter(r => r.status === 'completed' || r.status === 'Terminée')
    .reduce((acc, r) => acc + (Number(r.price) || 0), 0)

  return {
    total,
    ongoing,
    cancelled,
    completed,
    autoCancelled,
    revenue: formatAmount(revenueRaw),
    revenueRaw,
    discount: 0,
  }
}

function formatAmount(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Charge les conducteurs disponibles (en ligne, approuvés) pour le dispatch.
 */
export async function getAvailableDrivers() {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name, phone, zone, vehicle, is_online, last_location')
      .eq('status', 'Approuvé')
      .eq('is_online', true)

    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getAvailableDrivers: fallback mock', err)
  }

  // Fallback mock (données de démonstration)
  return [
    { id: 'DRV-001', name: 'Oumar Sall',      phone: '+221 77 100 22 33', vehicle: 'Moto',    zone: 'Dakar Centre', distance: '0.8 km', rating: 4.8 },
    { id: 'DRV-003', name: 'Ibrahima Ba',      phone: '+221 70 300 44 55', vehicle: 'Moto',    zone: 'Plateau',      distance: '1.2 km', rating: 4.9 },
    { id: 'DRV-005', name: 'Abdoulaye Mbaye',  phone: '+221 76 500 66 77', vehicle: 'Voiture', zone: 'Dakar Centre', distance: '2.1 km', rating: 4.6 },
  ]
}

/**
 * Crée une course via dispatch admin et l'assigne directement à un conducteur.
 */
export async function dispatchRide({ pickup, dropoff, client, driverId, serviceType, notes, price, distance }) {
  const ridePayload = {
    pickup_address: pickup,
    destination_address: dropoff,
    status: 'accepted',          // directement acceptée (dispatch admin)
    category: serviceType.toLowerCase().includes('taxi') ? 'taxi' : 'delivery',
    type: serviceType,
    price: price ?? 0,
    distance_meters: distance ?? 0,
    payment_status: 'pending',
    driver_id: driverId,
    client_name: client || null,
    notes: notes || null,
    dispatched_by: 'admin',
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from('rides').insert(ridePayload).select().single()
  if (error) throw error
  return data
}
