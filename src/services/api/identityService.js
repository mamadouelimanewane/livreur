import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Types de documents
export const DOCUMENT_TYPES = {
  id_card: { label: 'Carte d\'identité', required: true, bothSides: true },
  passport: { label: 'Passeport', required: false, bothSides: false },
  driver_license: { label: 'Permis de conduire', required: true, bothSides: true },
  vehicle_registration: { label: 'Carte grise', required: true, bothSides: true },
  insurance: { label: 'Assurance véhicule', required: true, bothSides: false },
  photo: { label: 'Photo de profil', required: true, bothSides: false },
  proof_of_address: { label: 'Justificatif de domicile', required: false, bothSides: false },
  criminal_record: { label: 'Casier judiciaire', required: false, bothSides: false },
}

// Statuts de vérification
export const VERIFICATION_STATUS = {
  pending: { label: 'En attente', color: '#ffb64d', bg: '#fff8ee' },
  under_review: { label: 'En cours de vérification', color: '#4680ff', bg: '#ebf4ff' },
  approved: { label: 'Approuvé', color: '#2ed8a3', bg: '#e6faf4' },
  rejected: { label: 'Rejeté', color: '#ff5370', bg: '#fff0f3' },
  expired: { label: 'Expiré', color: '#6f42c1', bg: '#f3eeff' },
}

// Données mock
const MOCK_VERIFICATIONS = [
  {
    id: 'VER-001',
    driverId: 'DRV-001',
    driverName: 'Oumar Sall',
    documents: [
      { type: 'photo', status: 'approved', uploadedAt: '2024-01-05T10:00:00Z', expiresAt: null },
      { type: 'id_card', status: 'approved', uploadedAt: '2024-01-05T10:05:00Z', expiresAt: '2029-01-05' },
      { type: 'driver_license', status: 'approved', uploadedAt: '2024-01-05T10:10:00Z', expiresAt: '2026-01-05' },
      { type: 'vehicle_registration', status: 'approved', uploadedAt: '2024-01-05T10:15:00Z', expiresAt: '2025-01-05' },
      { type: 'insurance', status: 'approved', uploadedAt: '2024-01-05T10:20:00Z', expiresAt: '2025-06-05' },
    ],
    overallStatus: 'approved',
    submittedAt: '2024-01-05T10:00:00Z',
    reviewedAt: '2024-01-05T14:00:00Z',
    reviewedBy: 'ADM-001',
    notes: null,
  },
  {
    id: 'VER-002',
    driverId: 'DRV-020',
    driverName: 'Khadija Ndiaye',
    documents: [
      { type: 'photo', status: 'approved', uploadedAt: '2024-03-14T09:00:00Z', expiresAt: null },
      { type: 'id_card', status: 'under_review', uploadedAt: '2024-03-14T09:05:00Z', expiresAt: null },
      { type: 'driver_license', status: 'pending', uploadedAt: null, expiresAt: null },
      { type: 'vehicle_registration', status: 'pending', uploadedAt: null, expiresAt: null },
      { type: 'insurance', status: 'pending', uploadedAt: null, expiresAt: null },
    ],
    overallStatus: 'under_review',
    submittedAt: '2024-03-14T09:00:00Z',
    reviewedAt: null,
    reviewedBy: null,
    notes: null,
  },
]

/**
 * Récupère toutes les vérifications d'identité
 */
export async function getIdentityVerifications(filters = {}) {
  try {
    let query = supabase.from('identity_verifications').select('*')
    
    if (filters.status) {
      query = query.eq('overall_status', filters.status)
    }
    if (filters.driverId) {
      query = query.eq('driver_id', filters.driverId)
    }
    
    const { data, error } = await query.order('submitted_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('getIdentityVerifications: fallback mock', err)
  }
  return resolveMock(MOCK_VERIFICATIONS)
}

/**
 * Récupère la vérification d'un conducteur
 */
export async function getDriverVerification(driverId) {
  try {
    const { data, error } = await supabase
      .from('identity_verifications')
      .select('*')
      .eq('driver_id', driverId)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getDriverVerification: fallback mock', err)
    return MOCK_VERIFICATIONS.find(v => v.driverId === driverId) || null
  }
}

/**
 * Upload un document
 */
export async function uploadDocument(driverId, documentType, file, side = 'front') {
  try {
    // Générer le nom du fichier
    const fileExt = file.name.split('.').pop()
    const fileName = `${driverId}/${documentType}_${side}_${Date.now()}.${fileExt}`
    
    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('identity_documents')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    
    // Obtenir l'URL publique
    const { data: urlData } = supabase
      .storage
      .from('identity_documents')
      .getPublicUrl(fileName)
    
    // Enregistrer dans la base
    const documentRecord = {
      driver_id: driverId,
      document_type: documentType,
      side,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      status: 'pending',
      uploaded_at: new Date().toISOString(),
    }
    
    const { data, error } = await supabase
      .from('identity_documents')
      .insert(documentRecord)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('uploadDocument: simulation', err)
    return {
      id: `DOC-${Date.now()}`,
      driver_id: driverId,
      document_type: documentType,
      side,
      file_url: URL.createObjectURL(file),
      file_name: file.name,
      status: 'pending',
      uploaded_at: new Date().toISOString(),
    }
  }
}

/**
 * Met à jour le statut d'un document
 */
export async function updateDocumentStatus(documentId, status, notes = null, expiresAt = null) {
  try {
    const { data, error } = await supabase
      .from('identity_documents')
      .update({
        status,
        notes,
        expires_at: expiresAt,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', documentId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateDocumentStatus: simulation', err)
    return { id: documentId, status, notes, expires_at: expiresAt }
  }
}

/**
 * Approuve un document
 */
export async function approveDocument(documentId, expiresAt = null) {
  return updateDocumentStatus(documentId, 'approved', null, expiresAt)
}

/**
 * Rejette un document
 */
export async function rejectDocument(documentId, reason) {
  return updateDocumentStatus(documentId, 'rejected', reason)
}

/**
 * Vérifie si tous les documents requis sont approuvés
 */
export async function checkVerificationComplete(driverId) {
  const verification = await getDriverVerification(driverId)
  
  if (!verification) return { complete: false, missing: Object.keys(DOCUMENT_TYPES).filter(k => DOCUMENT_TYPES[k].required) }
  
  const requiredDocs = Object.entries(DOCUMENT_TYPES)
    .filter(([_, config]) => config.required)
    .map(([type]) => type)
  
  const approvedDocs = verification.documents
    .filter(d => d.status === 'approved')
    .map(d => d.type)
  
  const missing = requiredDocs.filter(type => !approvedDocs.includes(type))
  
  return {
    complete: missing.length === 0,
    missing,
    approved: approvedDocs,
    pending: verification.documents.filter(d => d.status === 'pending').map(d => d.type),
    underReview: verification.documents.filter(d => d.status === 'under_review').map(d => d.type),
  }
}

/**
 * Approuve la vérification complète d'un conducteur
 */
export async function approveVerification(verificationId, adminId, notes = null) {
  try {
    const { data, error } = await supabase
      .from('identity_verifications')
      .update({
        overall_status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
        notes,
      })
      .eq('id', verificationId)
      .select()
      .single()
    
    if (error) throw error
    
    // Mettre à jour le statut du conducteur
    await supabase
      .from('drivers')
      .update({ status: 'Approuvé', verified_at: new Date().toISOString() })
      .eq('id', data.driver_id)
    
    return data
  } catch (err) {
    console.warn('approveVerification: simulation', err)
    return { id: verificationId, overall_status: 'approved' }
  }
}

/**
 * Rejette la vérification d'un conducteur
 */
export async function rejectVerification(verificationId, adminId, reason) {
  try {
    const { data, error } = await supabase
      .from('identity_verifications')
      .update({
        overall_status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminId,
        notes: reason,
      })
      .eq('id', verificationId)
      .select()
      .single()
    
    if (error) throw error
    
    // Mettre à jour le statut du conducteur
    await supabase
      .from('drivers')
      .update({ status: 'Rejeté', rejection_reason: reason })
      .eq('id', data.driver_id)
    
    return data
  } catch (err) {
    console.warn('rejectVerification: simulation', err)
    return { id: verificationId, overall_status: 'rejected', notes: reason }
  }
}

/**
 * Récupère les documents expirant bientôt
 */
export async function getExpiringDocuments(daysThreshold = 30) {
  try {
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold)
    
    const { data, error } = await supabase
      .from('identity_documents')
      .select('*, drivers(name, phone)')
      .eq('status', 'approved')
      .lte('expires_at', thresholdDate.toISOString())
      .gt('expires_at', new Date().toISOString())
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getExpiringDocuments: fallback mock', err)
    return [
      { id: 'DOC-010', driver_id: 'DRV-003', document_type: 'insurance', expires_at: '2024-04-01', drivers: { name: 'Ibrahima Ba', phone: '+221 70 300 44 55' } },
    ]
  }
}

/**
 * Récupère les documents expirés
 */
export async function getExpiredDocuments() {
  try {
    const { data, error } = await supabase
      .from('identity_documents')
      .select('*, drivers(name, phone)')
      .eq('status', 'approved')
      .lt('expires_at', new Date().toISOString())
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getExpiredDocuments: fallback mock', err)
    return []
  }
}

/**
 * Demande le renouvellement d'un document
 */
export async function requestDocumentRenewal(driverId, documentType) {
  try {
    // Créer une notification pour le conducteur
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: driverId,
        type: 'document_renewal_request',
        title: 'Renouvellement de document requis',
        body: `Votre ${DOCUMENT_TYPES[documentType]?.label || documentType} a expiré. Veuillez le mettre à jour.`,
        data: { document_type: documentType },
        created_at: new Date().toISOString(),
      })
    
    if (error) throw error
    return true
  } catch (err) {
    console.warn('requestDocumentRenewal: simulation', err)
    return true
  }
}

/**
 * Retourne les types de documents disponibles
 */
export function getDocumentTypes() {
  return DOCUMENT_TYPES
}

/**
 * Retourne les statuts de vérification
 */
export function getVerificationStatuses() {
  return VERIFICATION_STATUS
}

/**
 * Calcule le pourcentage de complétion de la vérification
 */
export function calculateVerificationProgress(verification) {
  if (!verification || !verification.documents) return 0
  
  const requiredDocs = Object.entries(DOCUMENT_TYPES)
    .filter(([_, config]) => config.required)
    .map(([type]) => type)
  
  const approvedCount = verification.documents
    .filter(d => d.status === 'approved' && requiredDocs.includes(d.type))
    .length
  
  return Math.round((approvedCount / requiredDocs.length) * 100)
}
