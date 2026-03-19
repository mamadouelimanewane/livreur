import {
  MOBILE_DRIVER_EARNINGS,
  MOBILE_DRIVER_HOME_CONTENT,
  MOBILE_DRIVER_PROFILE,
  MOBILE_USER_HOME_CONTENT,
  MOBILE_USER_PROFILE,
  MOBILE_USER_RIDES,
} from '../../data/mockApiData'
import { resolveMock } from './utils'

export async function getMobileUserHomeContent() {
  return resolveMock(MOBILE_USER_HOME_CONTENT)
}

export async function getMobileUserRides() {
  return resolveMock(MOBILE_USER_RIDES)
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
