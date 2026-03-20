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
    
    if (error && error.message !== 'Invalid URL' && !error.message.includes('fetch')) {
      throw error;
    }
  } catch (err) {
    if (err.status) {
       throw err; 
    }
    console.warn('Supabase login failed, using fallback demo auth');
  }

  await new Promise(resolve => setTimeout(resolve, 600))
  const userData = {
    id: 1,
    name: credentials.name ?? 'Admin LiviGo',
    email: credentials.email,
    role: 'superadmin',
    avatar: null,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  return userData
}

export async function logout() {
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.warn('Supabase logout error:', err.message)
  }
  localStorage.removeItem(STORAGE_KEY)
}
