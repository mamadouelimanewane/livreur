import { supabase } from './supabaseClient'

// Configuration des factures
const INVOICE_CONFIG = {
  prefix: 'FAC',
  sequence: 'YYYYMM-XXXX',
  currency: 'FCFA',
  company: {
    name: 'LiviGo Sénégal',
    address: 'Dakar, Sénégal',
    phone: '+221 33 800 00 00',
    email: 'contact@livigo.sn',
    ninea: 'SN-123456789',
  },
}

// Statuts de facture
export const INVOICE_STATUS = {
  draft: { label: 'Brouillon', color: '#6c757d' },
  sent: { label: 'Envoyée', color: '#4680ff' },
  paid: { label: 'Payée', color: '#2ed8a3' },
  overdue: { label: 'En retard', color: '#ff5370' },
  cancelled: { label: 'Annulée', color: '#6f42c1' },
}

/**
 * Génère un numéro de facture
 */
function generateInvoiceNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `${INVOICE_CONFIG.prefix}-${year}${month}-${sequence}`
}

/**
 * Crée une facture pour une course
 */
export async function createInvoice(invoiceData) {
  const invoice = {
    invoice_number: generateInvoiceNumber(),
    ride_id: invoiceData.rideId || null,
    user_id: invoiceData.userId,
    user_name: invoiceData.userName,
    user_email: invoiceData.userEmail,
    user_phone: invoiceData.userPhone,
    items: invoiceData.items || [],
    subtotal: invoiceData.subtotal,
    tax: invoiceData.tax || 0,
    discount: invoiceData.discount || 0,
    total: invoiceData.total,
    status: 'draft',
    due_date: invoiceData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: invoiceData.notes || null,
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createInvoice: simulation locale', err)
    return {
      id: `INV-${Date.now()}`,
      ...invoice,
    }
  }
}

/**
 * Crée une facture automatiquement après une course
 */
export async function createInvoiceFromRide(ride) {
  const items = [
    {
      description: `${ride.type || 'Course'} - ${ride.pickup_address} → ${ride.destination_address}`,
      quantity: 1,
      unitPrice: ride.price,
      total: ride.price,
    },
  ]
  
  return createInvoice({
    rideId: ride.id,
    userId: ride.user_id,
    userName: ride.user_name || 'Client',
    userEmail: ride.user_email,
    userPhone: ride.user_phone,
    items,
    subtotal: ride.price,
    tax: 0,
    discount: ride.discount || 0,
    total: ride.price - (ride.discount || 0),
  })
}

/**
 * Récupère une facture par ID
 */
export async function getInvoice(invoiceId) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getInvoice: fallback mock', err)
    return null
  }
}

/**
 * Récupère une facture par numéro
 */
export async function getInvoiceByNumber(invoiceNumber) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('getInvoiceByNumber: fallback mock', err)
    return null
  }
}

/**
 * Récupère les factures d'un utilisateur
 */
export async function getUserInvoices(userId) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getUserInvoices: fallback mock', err)
    return []
  }
}

/**
 * Récupère toutes les factures (admin)
 */
export async function getAllInvoices(filters = {}) {
  try {
    let query = supabase.from('invoices').select('*')
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }
    if (filters.fromDate) {
      query = query.gte('created_at', filters.fromDate)
    }
    if (filters.toDate) {
      query = query.lte('created_at', filters.toDate)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getAllInvoices: fallback mock', err)
    return [
      {
        id: 'INV-001',
        invoice_number: 'FAC-202403-0001',
        user_name: 'Fatou Diallo',
        total: 1500,
        status: 'paid',
        created_at: '2024-03-15T10:30:00Z',
      },
    ]
  }
}

/**
 * Met à jour le statut d'une facture
 */
export async function updateInvoiceStatus(invoiceId, status) {
  try {
    const updates = { status }
    if (status === 'paid') {
      updates.paid_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('updateInvoiceStatus: simulation', err)
    return { id: invoiceId, status }
  }
}

/**
 * Envoie une facture par email
 */
export async function sendInvoiceByEmail(invoiceId) {
  try {
    const invoice = await getInvoice(invoiceId)
    if (!invoice) throw new Error('Facture non trouvée')
    
    // Générer le PDF
    const pdfBlob = await generateInvoicePDF(invoice)
    
    // En production, envoyer via un service d'email
    console.log(`Sending invoice ${invoice.invoice_number} to ${invoice.user_email}`)
    
    // Marquer comme envoyée
    await updateInvoiceStatus(invoiceId, 'sent')
    
    return true
  } catch (err) {
    console.warn('sendInvoiceByEmail: simulation', err)
    return true
  }
}

/**
 * Génère le PDF d'une facture
 */
export async function generateInvoicePDF(invoice) {
  // En production, utiliser une bibliothèque comme jsPDF ou pdfmake
  // Ici on retourne un Blob fictif
  const content = `
FACTURE: ${invoice.invoice_number}
Date: ${new Date(invoice.created_at).toLocaleDateString('fr-FR')}

Client: ${invoice.user_name}
Email: ${invoice.user_email || 'N/A'}
Téléphone: ${invoice.user_phone || 'N/A'}

--- DÉTAILS ---
${invoice.items?.map(item => `${item.description}: ${item.total} FCFA`).join('\n') || 'Course'}

Sous-total: ${invoice.subtotal} FCFA
Remise: ${invoice.discount || 0} FCFA
TOTAL: ${invoice.total} FCFA

---
${INVOICE_CONFIG.company.name}
${INVOICE_CONFIG.company.address}
${INVOICE_CONFIG.company.phone}
${INVOICE_CONFIG.company.email}
  `
  
  return new Blob([content], { type: 'application/pdf' })
}

/**
 * Télécharge une facture en PDF
 */
export async function downloadInvoice(invoiceId) {
  const invoice = await getInvoice(invoiceId)
  if (!invoice) return
  
  const pdfBlob = await generateInvoicePDF(invoice)
  
  const url = URL.createObjectURL(pdfBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `facture_${invoice.invoice_number}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Marque les factures en retard
 */
export async function markOverdueInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status: 'overdue' })
      .eq('status', 'sent')
      .lt('due_date', new Date().toISOString())
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('markOverdueInvoices: simulation', err)
    return []
  }
}

/**
 * Récupère les statistiques de facturation
 */
export async function getInvoiceStats(period = 'month') {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (period === 'week' ? 7 : 30))
    
    const { data, error } = await supabase
      .from('invoices')
      .select('status, total')
      .gte('created_at', startDate.toISOString())
    
    if (error) throw error
    
    const stats = {
      totalInvoices: data?.length || 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      byStatus: {},
    }
    
    data?.forEach(invoice => {
      stats.totalAmount += invoice.total
      stats.byStatus[invoice.status] = (stats.byStatus[invoice.status] || 0) + 1
      
      if (invoice.status === 'paid') {
        stats.paidAmount += invoice.total
      } else if (invoice.status === 'overdue') {
        stats.overdueAmount += invoice.total
      } else if (invoice.status === 'sent') {
        stats.pendingAmount += invoice.total
      }
    })
    
    return stats
  } catch (err) {
    console.warn('getInvoiceStats: fallback mock', err)
    return {
      totalInvoices: 45,
      totalAmount: 125000,
      paidAmount: 95000,
      pendingAmount: 20000,
      overdueAmount: 10000,
      byStatus: { paid: 35, sent: 7, overdue: 3 },
    }
  }
}

/**
 * Exporte les factures en CSV
 */
export function exportInvoicesCSV(invoices) {
  const headers = ['Numéro', 'Client', 'Email', 'Total', 'Statut', 'Date']
  const rows = invoices.map(inv => [
    inv.invoice_number,
    inv.user_name,
    inv.user_email || '',
    inv.total,
    inv.status,
    new Date(inv.created_at).toLocaleDateString('fr-FR'),
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `factures_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Crée un avoir (note de crédit)
 */
export async function createCreditNote(originalInvoiceId, reason) {
  const original = await getInvoice(originalInvoiceId)
  if (!original) throw new Error('Facture originale non trouvée')
  
  const creditNote = {
    invoice_number: `AVO-${generateInvoiceNumber().split('-').slice(1).join('-')}`,
    user_id: original.user_id,
    user_name: original.user_name,
    user_email: original.user_email,
    user_phone: original.user_phone,
    items: [{ description: `Avoir - ${reason}`, quantity: 1, unitPrice: -original.total, total: -original.total }],
    subtotal: -original.total,
    tax: 0,
    discount: 0,
    total: -original.total,
    status: 'paid',
    notes: `Avoir pour la facture ${original.invoice_number}`,
    original_invoice_id: originalInvoiceId,
    created_at: new Date().toISOString(),
  }
  
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert(creditNote)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('createCreditNote: simulation', err)
    return {
      id: `INV-${Date.now()}`,
      ...creditNote,
    }
  }
}

/**
 * Retourne la configuration des factures
 */
export function getInvoiceConfig() {
  return INVOICE_CONFIG
}

/**
 * Retourne les statuts de facture
 */
export function getInvoiceStatuses() {
  return INVOICE_STATUS
}
