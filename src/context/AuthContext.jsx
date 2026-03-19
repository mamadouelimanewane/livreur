import { useState, useCallback } from 'react'
import AuthContext from './auth-context'
import { getStoredUser, login as loginWithApi, logout as logoutWithApi } from '../services/api/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = useCallback(async (credentials) => {
    const userData = await loginWithApi(credentials)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(async () => {
    await logoutWithApi()
    setUser(null)
  }, [])

  const value = { user, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
