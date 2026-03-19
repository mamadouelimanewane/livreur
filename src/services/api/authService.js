const STORAGE_KEY = 'sur_admin_user'

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function login(credentials) {
  await new Promise(resolve => setTimeout(resolve, 600))

  if (!credentials?.email || !credentials?.password) {
    throw new Error('missing_credentials')
  }

  const userData = {
    id: 1,
    name: credentials.name ?? 'Admin S\u00dbR',
    email: credentials.email,
    role: 'superadmin',
    avatar: null,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  return userData
}

export async function logout() {
  localStorage.removeItem(STORAGE_KEY)
}
