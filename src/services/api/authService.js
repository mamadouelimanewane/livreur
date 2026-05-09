import { supabase } from './supabaseClient'

const STORAGE_KEY = 'sur_admin_user'

const FALLBACK_USERS = [
  { email: 'admin@livigo.sn',   password: 'admin123',   name: 'Administrateur LiviGo', role: 'superadmin', id: 'ADM-001' },
  { email: 'admin@livigo.com',  password: 'admin123',   name: 'Admin LiviGo',          role: 'superadmin', id: 'ADM-001' },
  { email: 'manager@livigo.sn', password: 'manager123', name: 'Manager Operations',    role: 'admin',      id: 'ADM-002' },
  { email: 'support@livigo.sn', password: 'support123', name: 'Equipe Support',        role: 'support',    id: 'ADM-003' },
  { email: 'driver@livigo.com', password: 'driver123',  name: 'Conducteur Demo',       role: 'driver',     id: 'DRV-001' },
  { email: 'user@livigo.com',   password: 'user123',    name: 'Client Demo',           role: 'user',       id: 'USR-001' },
]

export function getStoredUserSync() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  return getStoredUserSync()
}

export async function login(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('missing_credentials')
  }

  // 1. Essayer Supabase Auth si configuré
  const url = localStorage.getItem('LIVIGO_SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL
  const isSupabaseConfigured = url && !url.includes('placeholder')

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      if (!error && data?.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: data.user.user_metadata?.role || 'admin',
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        return user
      }
    } catch {
      // Supabase indisponible → fallback local
    }
  }

  // 2. Fallback local (mode démo)
  const found = FALLBACK_USERS.find(
    u => u.email === credentials.email && u.password === credentials.password
  )
  if (found) {
    const { password: _, ...user } = found
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
  }

  throw new Error('Identifiants invalides')
}

export async function logout() {
  try { await supabase.auth.signOut() } catch {}
  localStorage.removeItem(STORAGE_KEY)
}
