import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Permissions disponibles
export const PERMISSIONS = {
  // Dashboard
  'dashboard.view': 'Voir le tableau de bord',
  
  // Utilisateurs
  'users.view': 'Voir les utilisateurs',
  'users.edit': 'Modifier les utilisateurs',
  'users.delete': 'Supprimer les utilisateurs',
  
  // Conducteurs
  'drivers.view': 'Voir les conducteurs',
  'drivers.edit': 'Modifier les conducteurs',
  'drivers.approve': 'Approuver les conducteurs',
  'drivers.reject': 'Rejeter les conducteurs',
  'drivers.delete': 'Supprimer les conducteurs',
  
  // Courses
  'rides.view': 'Voir les courses',
  'rides.dispatch': 'Dispatcher des courses',
  'rides.cancel': 'Annuler des courses',
  
  // Support
  'support.view': 'Voir le support',
  'support.respond': 'Répondre aux tickets',
  'support.sos': 'Gérer les alertes SOS',
  
  // Contenu
  'content.view': 'Voir le contenu',
  'content.edit': 'Modifier le contenu',
  
  // Promotions
  'promotions.view': 'Voir les promotions',
  'promotions.create': 'Créer des promotions',
  'promotions.edit': 'Modifier les promotions',
  'promotions.delete': 'Supprimer des promotions',
  
  // Paramètres
  'settings.view': 'Voir les paramètres',
  'settings.edit': 'Modifier les paramètres',
  
  // Admins
  'admins.view': 'Voir les administrateurs',
  'admins.create': 'Créer des administrateurs',
  'admins.edit': 'Modifier les administrateurs',
  'admins.delete': 'Supprimer des administrateurs',
  
  // Rapports
  'reports.view': 'Voir les rapports',
  'reports.export': 'Exporter les rapports',
  
  // Transactions
  'transactions.view': 'Voir les transactions',
  'transactions.validate': 'Valider les retraits',
}

// Rôles prédéfinis
const DEFAULT_ROLES = [
  {
    id: 'ROLE-001',
    name: 'superadmin',
    label: 'Super Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: Object.keys(PERMISSIONS),
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-002',
    name: 'admin',
    label: 'Administrateur',
    description: 'Accès à la plupart des fonctionnalités sauf gestion des admins',
    permissions: [
      'dashboard.view',
      'users.view', 'users.edit',
      'drivers.view', 'drivers.edit', 'drivers.approve', 'drivers.reject',
      'rides.view', 'rides.dispatch', 'rides.cancel',
      'support.view', 'support.respond', 'support.sos',
      'content.view', 'content.edit',
      'promotions.view', 'promotions.create', 'promotions.edit',
      'settings.view', 'settings.edit',
      'reports.view', 'reports.export',
      'transactions.view', 'transactions.validate',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-003',
    name: 'moderator',
    label: 'Modérateur',
    description: 'Gestion du support et modération des contenus',
    permissions: [
      'dashboard.view',
      'users.view',
      'drivers.view',
      'rides.view',
      'support.view', 'support.respond', 'support.sos',
      'content.view',
      'reports.view',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-004',
    name: 'support',
    label: 'Agent Support',
    description: 'Accès limité au support client',
    permissions: [
      'dashboard.view',
      'users.view',
      'drivers.view',
      'rides.view',
      'support.view', 'support.respond',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ROLE-005',
    name: 'viewer',
    label: 'Observateur',
    description: 'Lecture seule sur toutes les données',
    permissions: [
      'dashboard.view',
      'users.view',
      'drivers.view',
      'rides.view',
      'support.view',
      'content.view',
      'promotions.view',
      'settings.view',
      'reports.view',
      'transactions.view',
    ],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// Données mock pour les administrateurs
const MOCK_ADMINS = [
  {
    id: 'ADM-001',
    name: 'Admin Principal',
    email: 'admin@livigo.sn',
    phone: '+221 77 000 00 00',
    role: 'superadmin',
    roleName: 'Super Administrateur',
    status: 'active',
    lastLogin: '2024-03-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'ADM-002',
    name: 'Amadou Diallo',
    email: 'amadou@livigo.sn',
    phone: '+221 77 111 11 11',
    role: 'admin',
    roleName: 'Administrateur',
    status: 'active',
    lastLogin: '2024-03-15T09:00:00Z',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'ADM-003',
    name: 'Fatou Sow',
    email: 'fatou@livigo.sn',
    phone: '+221 77 222 22 22',
    role: 'support',
    roleName: 'Agent Support',
    status: 'active',
    lastLogin: '2024-03-14T16:00:00Z',
    createdAt: '2024-02-15T00:00:00Z',
  },
]

/**
 * Récupère tous les rôles
 */
export async function getRoles() {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getRoles: fallback mock', err)
  }
  return resolveMock(DEFAULT_ROLES)
}

/**
 * Récupère un rôle par son nom
 */
export async function getRoleByName(name) {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('name', name)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getRoleByName: fallback mock', err)
    return DEFAULT_ROLES.find(r => r.name === name) || null
  }
}

/**
 * Crée un nouveau rôle personnalisé
 */
export async function createRole(roleData) {
  const role = {
    name: roleData.name.toLowerCase().replace(/\s+/g, '_'),
    label: roleData.label,
    description: roleData.description || '',
    permissions: roleData.permissions || [],
    is_system: false,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('roles')
      .insert(role)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createRole: simulation locale', err)
    return {
      id: `ROLE-${Date.now()}`,
      ...role,
    }
  }
}

/**
 * Met à jour un rôle
 */
export async function updateRole(roleId, updates) {
  try {
    const { data, error } = await supabase
      .from('roles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', roleId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateRole: simulation', err)
    return { id: roleId, ...updates }
  }
}

/**
 * Supprime un rôle personnalisé
 */
export async function deleteRole(roleId) {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)
      .eq('is_system', false)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('deleteRole: simulation', err)
    return true
  }
}

/**
 * Vérifie si un utilisateur a une permission
 */
export async function hasPermission(userId, permission) {
  try {
    const { data: user, error } = await supabase
      .from('admins')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    
    const role = await getRoleByName(user.role)
    return role?.permissions?.includes(permission) || false
  } catch (err) {
    console.warn('hasPermission: fallback', err)
    // En mode démo, on autorise tout
    return true
  }
}

/**
 * Vérifie plusieurs permissions
 */
export async function hasPermissions(userId, permissions) {
  const results = await Promise.all(
    permissions.map(p => hasPermission(userId, p))
  )
  return results.every(r => r)
}

/**
 * Récupère toutes les permissions d'un utilisateur
 */
export async function getUserPermissions(userId) {
  try {
    const { data: user, error } = await supabase
      .from('admins')
      .select('role')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    
    const role = await getRoleByName(user.role)
    return role?.permissions || []
  } catch (err) {
    console.warn('getUserPermissions: fallback all', err)
    return Object.keys(PERMISSIONS)
  }
}

// ===== Gestion des Administrateurs =====

/**
 * Récupère tous les administrateurs
 */
export async function getAdmins(filters = {}) {
  try {
    let query = supabase.from('admins').select('*')
    
    if (filters.role) {
      query = query.eq('role', filters.role)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getAdmins: fallback mock', err)
  }
  return resolveMock(MOCK_ADMINS)
}

/**
 * Récupère un administrateur par son ID
 */
export async function getAdminById(adminId) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getAdminById: fallback mock', err)
    return MOCK_ADMINS.find(a => a.id === adminId) || null
  }
}

/**
 * Crée un nouvel administrateur
 */
export async function createAdmin(adminData) {
  const admin = {
    name: adminData.name,
    email: adminData.email,
    phone: adminData.phone || null,
    role: adminData.role,
    status: 'active',
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('admins')
      .insert(admin)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createAdmin: simulation locale', err)
    return {
      id: `ADM-${Date.now()}`,
      ...admin,
    }
  }
}

/**
 * Met à jour un administrateur
 */
export async function updateAdmin(adminId, updates) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', adminId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateAdmin: simulation', err)
    return { id: adminId, ...updates }
  }
}

/**
 * Désactive un administrateur
 */
export async function deactivateAdmin(adminId) {
  return updateAdmin(adminId, { status: 'inactive' })
}

/**
 * Réactive un administrateur
 */
export async function activateAdmin(adminId) {
  return updateAdmin(adminId, { status: 'active' })
}

/**
 * Supprime un administrateur
 */
export async function deleteAdmin(adminId) {
  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', adminId)
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('deleteAdmin: simulation', err)
    return true
  }
}

/**
 * Enregistre une action dans l'audit log
 */
export async function logAdminAction({ adminId, action, targetType, targetId, details }) {
  const logEntry = {
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    details: details || null,
    ip_address: null, // Peut être renseigné côté serveur
    user_agent: navigator.userAgent,
    created_at: new Date().toISOString(),
  }

  try {
    const { error } = await supabase
      .from('admin_audit_log')
      .insert(logEntry)
    
    if (error) throw error
  } catch (err) {
    console.warn('logAdminAction: simulation', err)
  }
}

/**
 * Récupère l'historique des actions admin
 */
export async function getAuditLogs(filters = {}) {
  try {
    let query = supabase.from('admin_audit_log').select('*')
    
    if (filters.adminId) {
      query = query.eq('admin_id', filters.adminId)
    }
    if (filters.action) {
      query = query.eq('action', filters.action)
    }
    if (filters.targetType) {
      query = query.eq('target_type', filters.targetType)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getAuditLogs: fallback mock', err)
    return [
      { id: 'LOG-001', admin_id: 'ADM-001', action: 'create', target_type: 'driver', target_id: 'DRV-100', details: 'Approbation du conducteur', created_at: '2024-03-15T10:00:00Z' },
      { id: 'LOG-002', admin_id: 'ADM-002', action: 'update', target_type: 'promotion', target_id: 'PROMO-001', details: 'Modification de la date de validité', created_at: '2024-03-15T09:30:00Z' },
    ]
  }
}

/**
 * Retourne toutes les permissions disponibles
 */
export function getAllPermissions() {
  return PERMISSIONS
}

/**
 * Groupe les permissions par catégorie
 */
export function getPermissionsByCategory() {
  return {
    dashboard: {
      label: 'Tableau de bord',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('dashboard.'))
        .map(([key, label]) => ({ key, label })),
    },
    users: {
      label: 'Utilisateurs',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('users.'))
        .map(([key, label]) => ({ key, label })),
    },
    drivers: {
      label: 'Conducteurs',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('drivers.'))
        .map(([key, label]) => ({ key, label })),
    },
    rides: {
      label: 'Courses',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('rides.'))
        .map(([key, label]) => ({ key, label })),
    },
    support: {
      label: 'Support',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('support.'))
        .map(([key, label]) => ({ key, label })),
    },
    content: {
      label: 'Contenu',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('content.'))
        .map(([key, label]) => ({ key, label })),
    },
    promotions: {
      label: 'Promotions',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('promotions.'))
        .map(([key, label]) => ({ key, label })),
    },
    settings: {
      label: 'Paramètres',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('settings.'))
        .map(([key, label]) => ({ key, label })),
    },
    admins: {
      label: 'Administrateurs',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('admins.'))
        .map(([key, label]) => ({ key, label })),
    },
    reports: {
      label: 'Rapports',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('reports.'))
        .map(([key, label]) => ({ key, label })),
    },
    transactions: {
      label: 'Transactions',
      permissions: Object.entries(PERMISSIONS)
        .filter(([key]) => key.startsWith('transactions.'))
        .map(([key, label]) => ({ key, label })),
    },
  }
}
