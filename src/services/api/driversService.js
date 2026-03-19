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
  return resolveMock(MOCK_DRIVERS)
}

export async function getBasicSignupDrivers() {
  return resolveMock(MOCK_BASIC_SIGNUP_DRIVERS)
}

export async function getPendingDrivers() {
  return resolveMock(MOCK_PENDING_DRIVERS)
}

export async function getRejectedDrivers() {
  return resolveMock(MOCK_REJECTED_DRIVERS)
}

export async function getTempRejectedDrivers() {
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
