import { supabase } from './supabaseClient'

const STORAGE_KEY = 'sur_admin_user'

export function getStoredUserSync() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await supabase.auth.getSession()
    if (data?.session?.user) {
      return {
        id: data.session.user.id,
        name: data.session.user.user_metadata?.name || 'Admin',
        email: data.session.user.email,
        role: data.session.user.user_metadata?.role || 'superadmin',
        avatar: null
      }
    }
  } catch (err) {
    console.warn('Supabase getSession failed:', err.message)
  }
  return getStoredUserSync()
}

export async function login(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('missing_credentials')
  }

  // Demo credentials for fallback
  const DEMO_CREDENTIALS = {
    email: 'admin@livigo.com',
    password: 'admin123'
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })
    
    if (data?.user && !error) {
      return {
        id: data.user.id,
        name: data.user.user_metadata?.name || 'Admin',
        email: data.user.email,
        role: data.user.user_metadata?.role || 'superadmin',
        avatar: null
      }
    }
  } catch (err) {
    console.warn('Supabase login failed, checking demo credentials')
  }

  // Fallback to demo auth
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // Check demo credentials
  if (credentials.email === DEMO_CREDENTIALS.email && credentials.password === DEMO_CREDENTIALS.password) {
    const userData = {
      id: 1,
      name: 'Admin LiviGo',
      email: credentials.email,
      role: 'superadmin',
      avatar: null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    return userData
  }
  
  throw new Error('Identifiants invalides')
}

export async function logout() {
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.warn('Supabase logout error:', err.message)
  }
  localStorage.removeItem(STORAGE_KEY)
}
