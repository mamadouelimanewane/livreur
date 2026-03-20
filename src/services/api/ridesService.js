import { supabase } from './supabaseClient'
import {
  DELIVERY_RIDE_TITLES,
  MOCK_DELIVERY_RIDES,
  MOCK_TAXI_RIDES,
  RIDE_STATUS_CONFIG,
  RIDE_TYPE_FILTER,
  TAXI_RIDE_TITLES,
} from '../../data/mockApiData'
import { resolveMock } from './utils'

export async function getDeliveryRides() {
  try {
    const { data, error } = await supabase.from('rides').select('*').eq('category', 'delivery')
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Supabase getDeliveryRides failed, using mock data', err)
  }
  return resolveMock(MOCK_DELIVERY_RIDES)
}

export async function getTaxiRides() {
  try {
    const { data, error } = await supabase.from('rides').select('*').eq('category', 'taxi')
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Supabase getTaxiRides failed, using mock data', err)
  }
  return resolveMock(MOCK_TAXI_RIDES)
}

export function getRideStatusConfig() {
  return RIDE_STATUS_CONFIG
}

export function getRideTypeFilter() {
  return RIDE_TYPE_FILTER
}

export function getRideTitles(kind = 'delivery') {
  return kind === 'taxi' ? TAXI_RIDE_TITLES : DELIVERY_RIDE_TITLES
}
