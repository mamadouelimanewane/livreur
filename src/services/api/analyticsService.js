import { supabase } from './supabaseClient'

// Couleurs pour les graphiques
export const CHART_COLORS = {
  primary: '#4680ff',
  secondary: '#2ed8a3',
  warning: '#ffb64d',
  danger: '#ff5370',
  purple: '#6f42c1',
  cyan: '#17a2b8',
  gray: '#6c757d',
}

/**
 * Récupère les données de revenus pour les graphiques
 */
export async function getRevenueChartData(period = 'week') {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 90
  
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('rides')
      .select('price, created_at, category')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    if (error) throw error
    if (data && data.length > 0) {
      return aggregateByPeriod(data, days, 'price')
    }
  } catch (err) {
    console.warn('getRevenueChartData: fallback mock', err)
  }
  
  // Données mock
  return generateMockChartData(days, 'revenue')
}

/**
 * Récupère les données de courses pour les graphiques
 */
export async function getRidesChartData(period = 'week') {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 90
  
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('rides')
      .select('status, created_at, category')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    if (error) throw error
    if (data && data.length > 0) {
      return aggregateByPeriod(data, days, 'count')
    }
  } catch (err) {
    console.warn('getRidesChartData: fallback mock', err)
  }
  
  return generateMockChartData(days, 'rides')
}

/**
 * Récupère les données d'utilisateurs pour les graphiques
 */
export async function getUsersChartData(period = 'month') {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 90
  
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    if (error) throw error
    if (data && data.length > 0) {
      return aggregateByPeriod(data, days, 'count')
    }
  } catch (err) {
    console.warn('getUsersChartData: fallback mock', err)
  }
  
  return generateMockChartData(days, 'users')
}

/**
 * Récupère les données de conducteurs pour les graphiques
 */
export async function getDriversChartData(period = 'month') {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 90
  
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('drivers')
      .select('status, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    if (error) throw error
    if (data && data.length > 0) {
      return aggregateByPeriod(data, days, 'count')
    }
  } catch (err) {
    console.warn('getDriversChartData: fallback mock', err)
  }
  
  return generateMockChartData(days, 'drivers')
}

/**
 * Récupère la répartition par type de service
 */
export async function getServiceDistribution() {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('type, category')
      .eq('status', 'completed')
    
    if (error) throw error
    if (data && data.length > 0) {
      const distribution = {}
      data.forEach(ride => {
        const key = ride.type || ride.category
        distribution[key] = (distribution[key] || 0) + 1
      })
      return distribution
    }
  } catch (err) {
    console.warn('getServiceDistribution: fallback mock', err)
  }
  
  return {
    'Moto Taxi': 45,
    'Voiture Taxi': 25,
    'Livraison Express': 18,
    'Livraison Standard': 12,
  }
}

/**
 * Récupère la répartition par zone
 */
export async function getZoneDistribution() {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('pickup_address')
      .eq('status', 'completed')
      .limit(100)
    
    if (error) throw error
    if (data && data.length > 0) {
      const distribution = {}
      data.forEach(ride => {
        // Extraire la zone de l'adresse (simplifié)
        const zone = ride.pickup_address?.split(',')[0] || 'Inconnu'
        distribution[zone] = (distribution[zone] || 0) + 1
      })
      return distribution
    }
  } catch (err) {
    console.warn('getZoneDistribution: fallback mock', err)
  }
  
  return {
    'Dakar Centre': 35,
    'Plateau': 25,
    'Médina': 15,
    'Parcelles Assainies': 12,
    'Guédiawaye': 8,
    'Autres': 5,
  }
}

/**
 * Récupère les KPIs principaux
 */
export async function getKPIs() {
  try {
    const [usersRes, driversRes, ridesRes, revenueRes] = await Promise.allSettled([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('drivers').select('id', { count: 'exact', head: true }),
      supabase.from('rides').select('id', { count: 'exact', head: true }),
      supabase.from('rides').select('price').eq('status', 'completed'),
    ])
    
    const totalUsers = usersRes.status === 'fulfilled' && !usersRes.value.error ? usersRes.value.count : 18
    const totalDrivers = driversRes.status === 'fulfilled' && !driversRes.value.error ? driversRes.value.count : 19
    const totalRides = ridesRes.status === 'fulfilled' && !ridesRes.value.error ? ridesRes.value.count : 67
    
    let totalRevenue = 0
    if (revenueRes.status === 'fulfilled' && !revenueRes.value.error && revenueRes.value.data) {
      totalRevenue = revenueRes.value.data.reduce((sum, r) => sum + (Number(r.price) || 0), 0)
    } else {
      totalRevenue = 3246.53
    }
    
    return {
      totalUsers,
      totalDrivers,
      totalRides,
      totalRevenue,
      averageRating: 4.7,
      completionRate: 89.5,
      responseTime: '3.2 min',
    }
  } catch (err) {
    console.warn('getKPIs: fallback mock', err)
    return {
      totalUsers: 18,
      totalDrivers: 19,
      totalRides: 67,
      totalRevenue: 3246.53,
      averageRating: 4.7,
      completionRate: 89.5,
      responseTime: '3.2 min',
    }
  }
}

/**
 * Récupère les tendances de croissance
 */
export async function getGrowthTrends() {
  try {
    const thisMonth = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    const [thisMonthRes, lastMonthRes] = await Promise.allSettled([
      supabase.from('rides').select('price').eq('status', 'completed').gte('created_at', new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).toISOString()),
      supabase.from('rides').select('price').eq('status', 'completed').gte('created_at', new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString()).lt('created_at', new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).toISOString()),
    ])
    
    const thisMonthRevenue = thisMonthRes.status === 'fulfilled' && thisMonthRes.value.data 
      ? thisMonthRes.value.data.reduce((sum, r) => sum + (Number(r.price) || 0), 0) 
      : 1500
    const lastMonthRevenue = lastMonthRes.status === 'fulfilled' && lastMonthRes.value.data 
      ? lastMonthRes.value.data.reduce((sum, r) => sum + (Number(r.price) || 0), 0) 
      : 1200
    
    const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0
    
    return {
      revenueGrowth: parseFloat(revenueGrowth),
      usersGrowth: 12.5,
      driversGrowth: 8.3,
      ridesGrowth: 15.2,
    }
  } catch (err) {
    console.warn('getGrowthTrends: fallback mock', err)
    return {
      revenueGrowth: 25.0,
      usersGrowth: 12.5,
      driversGrowth: 8.3,
      ridesGrowth: 15.2,
    }
  }
}

/**
 * Récupère les données pour le graphique en anneau (statuts des courses)
 */
export async function getRideStatusDistribution() {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('status')
    
    if (error) throw error
    if (data && data.length > 0) {
      const distribution = {}
      data.forEach(ride => {
        distribution[ride.status] = (distribution[ride.status] || 0) + 1
      })
      return distribution
    }
  } catch (err) {
    console.warn('getRideStatusDistribution: fallback mock', err)
  }
  
  return {
    'completed': 54,
    'cancelled': 8,
    'auto-cancelled': 5,
    'failed': 2,
    'pending': 3,
  }
}

/**
 * Récupère les top conducteurs
 */
export async function getTopDrivers(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name, rides, rating, amount')
      .eq('status', 'Approuvé')
      .order('rides', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getTopDrivers: fallback mock', err)
  }
  
  return [
    { id: 'DRV-003', name: 'Ibrahima Ba', rides: 61, rating: 4.9, amount: '30 750 FCFA' },
    { id: 'DRV-001', name: 'Oumar Sall', rides: 48, rating: 4.8, amount: '24 500 FCFA' },
    { id: 'DRV-005', name: 'Abdoulaye Mbaye', rides: 27, rating: 4.6, amount: '13 500 FCFA' },
    { id: 'DRV-002', name: 'Cheikh Fall', rides: 32, rating: 4.5, amount: '16 200 FCFA' },
    { id: 'DRV-004', name: 'Seydou Diop', rides: 14, rating: 4.3, amount: '5 600 FCFA' },
  ]
}

/**
 * Récupère les données horaires pour heatmap
 */
export async function getHourlyDistribution() {
  // Données mock - en production, agréger depuis Supabase
  return {
    '06:00': 5,
    '07:00': 25,
    '08:00': 45,
    '09:00': 38,
    '10:00': 30,
    '11:00': 28,
    '12:00': 35,
    '13:00': 32,
    '14:00': 28,
    '15:00': 25,
    '16:00': 30,
    '17:00': 40,
    '18:00': 55,
    '19:00': 48,
    '20:00': 35,
    '21:00': 20,
    '22:00': 10,
    '23:00': 5,
  }
}

// Fonctions utilitaires

function aggregateByPeriod(data, days, type) {
  const result = {}
  const today = new Date()
  
  // Initialiser tous les jours
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const key = date.toISOString().split('T')[0]
    result[key] = 0
  }
  
  // Agréger les données
  data.forEach(item => {
    const date = new Date(item.created_at).toISOString().split('T')[0]
    if (result.hasOwnProperty(date)) {
      if (type === 'price') {
        result[date] += Number(item.price) || 0
      } else {
        result[date] += 1
      }
    }
  })
  
  return Object.entries(result).map(([date, value]) => ({
    date,
    value: type === 'price' ? value : value,
    label: formatDateLabel(date),
  }))
}

function generateMockChartData(days, type) {
  const result = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    let value
    switch (type) {
      case 'revenue':
        value = Math.floor(Math.random() * 500) + 100
        break
      case 'rides':
        value = Math.floor(Math.random() * 20) + 5
        break
      case 'users':
        value = Math.floor(Math.random() * 5) + 1
        break
      case 'drivers':
        value = Math.floor(Math.random() * 3) + 0
        break
      default:
        value = Math.floor(Math.random() * 50)
    }
    
    result.push({
      date: dateStr,
      value,
      label: formatDateLabel(dateStr),
    })
  }
  
  return result
}

function formatDateLabel(dateStr) {
  const date = new Date(dateStr)
  const options = { day: 'numeric', month: 'short' }
  return date.toLocaleDateString('fr-FR', options)
}

/**
 * Exporte les données analytics en CSV
 */
export function exportAnalyticsReport(data, title) {
  const headers = ['Date', 'Valeur']
  const rows = data.map(item => [item.date, item.value])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics_${title}_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
