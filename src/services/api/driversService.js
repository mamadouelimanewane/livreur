import { supabase } from './supabaseClient'
import {
  DRIVER_STATUS_STYLES,
  MOCK_BASIC_SIGNUP_DRIVERS,
  MOCK_DRIVERS,
  MOCK_PENDING_DRIVERS,
  MOCK_REJECTED_DRIVERS,
  MOCK_TEMP_REJECTED_DRIVERS,
} from '../../data/mockApiData'
import { resolveMock } from './utils'

export async function getDrivers() {
  try {
    const { data, error } = await supabase.from('drivers').select('*')
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Supabase getDrivers failed, using mock data', err)
  }
  return resolveMock(MOCK_DRIVERS)
}

export async function getBasicSignupDrivers() {
  try {
    const { data, error } = await supabase.from('drivers').select('*').eq('signup_step', 'basic')
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Supabase getBasicSignupDrivers failed, using mock data', err)
  }
  return resolveMock(MOCK_BASIC_SIGNUP_DRIVERS)
}

export async function getPendingDrivers() {
  try {
    const { data, error } = await supabase.from('drivers').select('*').eq('status', 'En attente')
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Supabase getPendingDrivers failed, using mock data', err)
  }
  return resolveMock(MOCK_PENDING_DRIVERS)
}

export async function getRejectedDrivers() {
  try {
    const { data, error } = await supabase.from('drivers').select('*').eq('status', 'Rejete')
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Supabase getRejectedDrivers failed, using mock data', err)
  }
  return resolveMock(MOCK_REJECTED_DRIVERS)
}

export async function getTempRejectedDrivers() {
  try {
    const { data, error } = await supabase.from('drivers').select('*').eq('status', 'Rejete_Temp')
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Supabase getTempRejectedDrivers failed, using mock data', err)
  }
  return resolveMock(MOCK_TEMP_REJECTED_DRIVERS)
}

export async function getVehicleDrivers() {
  const drivers = await getDrivers()

  return drivers.map(driver => ({
    ...driver,
    vehicleType: driver.vehicleType || driver.vehicle,
  }))
}

export async function getDriverFilters() {
  const drivers = await getDrivers()

  return {
    statuses: ['Tous', ...new Set(drivers.map(driver => driver.status))],
    zones: ['Tous', ...new Set(drivers.map(driver => driver.zone))],
    vehicles: ['Tous', ...new Set(drivers.map(driver => driver.vehicle))],
  }
}

export function getDriverStatusStyles() {
  return DRIVER_STATUS_STYLES
}
