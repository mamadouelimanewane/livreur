import { useState, useCallback, useEffect } from 'react'
import AuthContext from './auth-context'
import { getStoredUserSync, getCurrentUser, login as loginWithApi, logout as logoutWithApi } from '../services/api/authService'
import { supabase } from '../services/api/supabaseClient'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUserSync)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const initAuth = async () => {
      const currentUser = await getCurrentUser()
      if (mounted) {
        setUser(currentUser)
        setIsLoading(false)
      }
    }
    
    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || 'Admin',
            email: session.user.email,
            role: session.user.user_metadata?.role || 'superadmin',
            avatar: null
          })
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    })

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const userData = await loginWithApi(credentials)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(async () => {
    await logoutWithApi()
    setUser(null)
  }, [])

  const value = { user, login, logout, isLoading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
