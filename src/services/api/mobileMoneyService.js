import { supabase } from './supabaseClient'
import { resolveMock } from './utils'

// Opérateurs Mobile Money disponibles
export const MOBILE_MONEY_OPERATORS = {
  orange_money: {
    id: 'orange_money',
    name: 'Orange Money',
    code: 'OM',
    color: '#FF6600',
    logo: '/assets/orange-money.png',
    prefix: ['77', '78'],
    minAmount: 100,
    maxAmount: 1000000,
    fees: { percentage: 0, fixed: 0 }, // Pas de frais pour l'utilisateur
  },
  wave: {
    id: 'wave',
    name: 'Wave',
    code: 'WV',
    color: '#1DC8F2',
    logo: '/assets/wave.png',
    prefix: ['77', '78', '76', '70'],
    minAmount: 100,
    maxAmount: 2000000,
    fees: { percentage: 1, fixed: 0 },
  },
  free_money: {
    id: 'free_money',
    name: 'Free Money',
    code: 'FM',
    color: '#CD1E25',
    logo: '/assets/free-money.png',
    prefix: ['76'],
    minAmount: 100,
    maxAmount: 500000,
    fees: { percentage: 0, fixed: 0 },
  },
  wari: {
    id: 'wari',
    name: 'Wari',
    code: 'WR',
    color: '#00A651',
    logo: '/assets/wari.png',
    prefix: [], // Tous les numéros
    minAmount: 500,
    maxAmount: 300000,
    fees: { percentage: 2, fixed: 50 },
  },
}

// Statuts de transaction
export const TRANSACTION_STATUS = {
  pending: { label: 'En attente', color: '#ffb64d' },
  processing: { label: 'En cours', color: '#4680ff' },
  completed: { label: 'Complété', color: '#2ed8a3' },
  failed: { label: 'Échoué', color: '#ff5370' },
  cancelled: { label: 'Annulé', color: '#6f42c1' },
  refunded: { label: 'Remboursé', color: '#17a2b8' },
}

// Types de transaction
export const TRANSACTION_TYPES = {
  payment: 'Paiement course',
  topup: 'Recharge portefeuille',
  withdrawal: 'Retrait',
  refund: 'Remboursement',
  transfer: 'Transfert',
  bonus: 'Bonus',
}

// Données mock
const MOCK_TRANSACTIONS = [
  {
    id: 'TXN-001',
    type: 'payment',
    userId: 'USR-001',
    userName: 'Fatou Diallo',
    amount: 1500,
    fees: 0,
    netAmount: 1500,
    operator: 'orange_money',
    phoneNumber: '+221 77 123 45 67',
    reference: 'OM123456789',
    status: 'completed',
    rideId: 'RID-001',
    description: 'Paiement course Moto Taxi',
    createdAt: '2024-03-15T10:30:00Z',
    completedAt: '2024-03-15T10:30:45Z',
  },
  {
    id: 'TXN-002',
    type: 'topup',
    userId: 'USR-001',
    userName: 'Fatou Diallo',
    amount: 5000,
    fees: 0,
    netAmount: 5000,
    operator: 'wave',
    phoneNumber: '+221 77 123 45 67',
    reference: 'WV987654321',
    status: 'completed',
    description: 'Recharge LiviWallet',
    createdAt: '2024-03-14T15:00:00Z',
    completedAt: '2024-03-14T15:00:30Z',
  },
  {
    id: 'TXN-003',
    type: 'withdrawal',
    userId: 'DRV-001',
    userName: 'Oumar Sall',
    amount: 24500,
    fees: 245,
    netAmount: 24255,
    operator: 'orange_money',
    phoneNumber: '+221 77 100 22 33',
    reference: null,
    status: 'pending',
    description: 'Demande de retrait',
    createdAt: '2024-03-15T09:00:00Z',
    completedAt: null,
  },
]

/**
 * Détecte l'opérateur à partir du numéro de téléphone
 */
export function detectOperator(phoneNumber) {
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  const prefix = cleanNumber.slice(-9, -7)
  
  for (const [id, operator] of Object.entries(MOBILE_MONEY_OPERATORS)) {
    if (operator.prefix.includes(prefix)) {
      return operator
    }
  }
  
  return null
}

/**
 * Initie un paiement Mobile Money
 */
export async function initiatePayment(paymentData) {
  const transaction = {
    type: paymentData.type || 'payment',
    user_id: paymentData.userId,
    user_name: paymentData.userName,
    amount: paymentData.amount,
    fees: calculateFees(paymentData.amount, paymentData.operator),
    net_amount: paymentData.amount - calculateFees(paymentData.amount, paymentData.operator),
    operator: paymentData.operator,
    phone_number: paymentData.phoneNumber,
    reference: null,
    status: 'pending',
    ride_id: paymentData.rideId || null,
    description: paymentData.description || '',
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()
    
    if (error) throw error
    
    // Initier le paiement via l'API de l'opérateur
    const paymentResult = await processMobileMoneyPayment(data)
    
    return paymentResult
  } catch (err) {
    console.warn('initiatePayment: simulation locale', err)
    return {
      id: `TXN-${Date.now()}`,
      ...transaction,
      status: 'processing',
      paymentUrl: null, // URL de paiement si nécessaire
      ussdCode: generateUSSDCode(paymentData.operator, paymentData.amount),
    }
  }
}

/**
 * Génère un code USSD pour le paiement
 */
function generateUSSDCode(operator, amount) {
  switch (operator) {
    case 'orange_money':
      return `#144*1*${amount}#`
    case 'wave':
      return `*99#`
    case 'free_money':
      return `*100#`
    default:
      return null
  }
}

/**
 * Calcule les frais de transaction
 */
function calculateFees(amount, operatorId) {
  const operator = MOBILE_MONEY_OPERATORS[operatorId]
  if (!operator) return 0
  
  const { percentage = 0, fixed = 0 } = operator.fees
  return Math.round((amount * percentage / 100) + fixed)
}

/**
 * Traite un paiement Mobile Money (simulation)
 */
async function processMobileMoneyPayment(transaction) {
  // En production, ceci appellerait l'API de l'opérateur
  // Pour la simulation, on retourne une réponse fictive
  
  return {
    ...transaction,
    status: 'processing',
    message: 'Veuillez confirmer le paiement sur votre téléphone',
    ussdCode: generateUSSDCode(transaction.operator, transaction.amount),
  }
}

/**
 * Vérifie le statut d'une transaction
 */
export async function checkTransactionStatus(transactionId) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('checkTransactionStatus: fallback mock', err)
    return MOCK_TRANSACTIONS.find(t => t.id === transactionId) || null
  }
}

/**
 * Confirme une transaction (callback de l'opérateur)
 */
export async function confirmTransaction(transactionId, operatorReference, status = 'completed') {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        status,
        reference: operatorReference,
        completed_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .select()
      .single()
    
    if (error) throw error
    
    // Si c'est un paiement de course, mettre à jour le statut
    if (status === 'completed' && data.ride_id) {
      await supabase
        .from('rides')
        .update({ payment_status: 'paid' })
        .eq('id', data.ride_id)
    }
    
    // Si c'est une recharge, mettre à jour le portefeuille
    if (status === 'completed' && data.type === 'topup') {
      await updateWalletBalance(data.user_id, data.net_amount)
    }
    
    return data
  } catch (err) {
    console.warn('confirmTransaction: simulation', err)
    return { id: transactionId, status, reference: operatorReference }
  }
}

/**
 * Met à jour le solde du portefeuille
 */
async function updateWalletBalance(userId, amount) {
  try {
    // Récupérer le solde actuel
    const { data: wallet, error: fetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()
    
    const currentBalance = wallet?.balance || 0
    const newBalance = currentBalance + amount
    
    // Mettre à jour
    const { error } = await supabase
      .from('wallets')
      .upsert({
        user_id: userId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
    
    if (error) throw error
    return newBalance
  } catch (err) {
    console.warn('updateWalletBalance: simulation', err)
    return amount
  }
}

/**
 * Récupère le solde du portefeuille
 */
export async function getWalletBalance(userId) {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data?.balance || 0
  } catch (err) {
    console.warn('getWalletBalance: fallback mock', err)
    return 5450
  }
}

/**
 * Récupère l'historique des transactions
 */
export async function getTransactionHistory(userId, filters = {}) {
  try {
    let query = supabase.from('transactions').select('*')
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.operator) {
      query = query.eq('operator', filters.operator)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false }).limit(100)
    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('getTransactionHistory: fallback mock', err)
    return MOCK_TRANSACTIONS
  }
}

/**
 * Demande un retrait
 */
export async function requestWithdrawal(userId, amount, operator, phoneNumber) {
  const fees = calculateFees(amount, operator)
  
  const withdrawal = {
    type: 'withdrawal',
    user_id: userId,
    amount,
    fees,
    net_amount: amount - fees,
    operator,
    phone_number: phoneNumber,
    status: 'pending',
    description: 'Demande de retrait',
    created_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert(withdrawal)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('requestWithdrawal: simulation', err)
    return {
      id: `TXN-${Date.now()}`,
      ...withdrawal,
    }
  }
}

/**
 * Valide un retrait (admin)
 */
export async function validateWithdrawal(transactionId, adminId) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        status: 'processing',
        processed_by: adminId,
        processed_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .select()
      .single()
    
    if (error) throw error
    
    // Effectuer le virement via l'API Mobile Money
    await processWithdrawal(data)
    
    return data
  } catch (err) {
    console.warn('validateWithdrawal: simulation', err)
    return { id: transactionId, status: 'processing' }
  }
}

/**
 * Traite un retrait (simulation)
 */
async function processWithdrawal(transaction) {
  // En production, appeler l'API de l'opérateur pour effectuer le virement
  console.log(`Processing withdrawal: ${transaction.amount} to ${transaction.phone_number}`)
  return true
}

/**
 * Annule une transaction
 */
export async function cancelTransaction(transactionId, reason) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (err) {
    console.warn('cancelTransaction: simulation', err)
    return { id: transactionId, status: 'cancelled' }
  }
}

/**
 * Effectue un remboursement
 */
export async function refundTransaction(transactionId, reason) {
  try {
    const { data: originalTxn, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()
    
    if (fetchError) throw fetchError
    
    // Créer une transaction de remboursement
    const refund = {
      type: 'refund',
      user_id: originalTxn.user_id,
      amount: originalTxn.amount,
      fees: 0,
      net_amount: originalTxn.amount,
      operator: originalTxn.operator,
      phone_number: originalTxn.phone_number,
      status: 'completed',
      description: `Remboursement: ${reason}`,
      original_transaction_id: transactionId,
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(refund)
      .select()
      .single()
    
    if (error) throw error
    
    // Marquer la transaction originale comme remboursée
    await supabase
      .from('transactions')
      .update({ status: 'refunded' })
      .eq('id', transactionId)
    
    return data
  } catch (err) {
    console.warn('refundTransaction: simulation', err)
    return { id: `TXN-${Date.now()}`, status: 'completed' }
  }
}

/**
 * Récupère les statistiques de paiement
 */
export async function getPaymentStats(period = 'month') {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (period === 'week' ? 7 : 30))
    
    const { data, error } = await supabase
      .from('transactions')
      .select('type, status, amount, operator')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
    
    if (error) throw error
    
    const stats = {
      totalAmount: 0,
      totalTransactions: data?.length || 0,
      byType: {},
      byOperator: {},
    }
    
    data?.forEach(txn => {
      stats.totalAmount += txn.amount
      stats.byType[txn.type] = (stats.byType[txn.type] || 0) + txn.amount
      stats.byOperator[txn.operator] = (stats.byOperator[txn.operator] || 0) + 1
    })
    
    return stats
  } catch (err) {
    console.warn('getPaymentStats: fallback mock', err)
    return {
      totalAmount: 125000,
      totalTransactions: 89,
      byType: { payment: 80000, topup: 40000, withdrawal: 5000 },
      byOperator: { orange_money: 45, wave: 30, free_money: 14 },
    }
  }
}

/**
 * Retourne les opérateurs disponibles
 */
export function getOperators() {
  return Object.values(MOBILE_MONEY_OPERATORS)
}

/**
 * Retourne les statuts de transaction
 */
export function getTransactionStatuses() {
  return TRANSACTION_STATUS
}

/**
 * Retourne les types de transaction
 */
export function getTransactionTypes() {
  return TRANSACTION_TYPES
}
