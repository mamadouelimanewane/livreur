import { MOCK_USERS, USER_STATUS_STYLES } from '../../data/mockApiData'
import { resolveMock } from './utils'

export async function getUsers() {
  return resolveMock(MOCK_USERS)
}

export async function getUserFilters() {
  const users = await getUsers()

  return {
    countries: ['Tous', ...new Set(users.map(user => user.country))],
    searchBy: ['Nom', 'Email', 'T\u00e9l\u00e9phone'],
  }
}

export function getUserStatusStyles() {
  return USER_STATUS_STYLES
}
