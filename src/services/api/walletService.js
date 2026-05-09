import { supabase } from './supabaseClient'

const MOCK_WALLETS = {
  'USR-001': { id: 'WAL-001', userId: 'USR-001', balance: 12500, currency: 'FCFA', transactions: [] },
  'DRV-001': { id: 'WAL-002', userId: 'DRV-001', balance: 45000, currency: 'FCFA', transactions: [] },
}

/**
 * Retourne le solde du wallet d'un utilisateur
 */
export async function getWallet(userId) {
  try {
    const { data, error } = await supabase
      .from('wallets').select('*').eq('user_id', userId).single()
    if (error) throw error
    return data
  } catch {
    return MOCK_WALLETS[userId] || { id: `WAL-${userId}`, userId, balance: 0, currency: 'FCFA' }
  }
}

/**
 * Recharge le wallet via Orange Money ou Wave
 */
export async function rechargeWallet({ userId, amount, provider, reference }) {
  const tx = {
    wallet_id: null,
    user_id: userId,
    type: 'recharge',
    amount,
    provider,
    reference,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  try {
    const { data: wallet } = await supabase.from('wallets').select('id, balance').eq('user_id', userId).single()
    if (wallet) {
      tx.wallet_id = wallet.id
      await supabase.from('wallet_transactions').insert(tx)
      const { data, error } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance + amount, updated_at: new Date().toISOString() })
        .eq('id', wallet.id)
        .select().single()
      if (error) throw error
      return { wallet: data, transaction: { ...tx, status: 'completed' } }
    }
  } catch (err) {
    console.warn('rechargeWallet simulation:', err.message)
  }

  return {
    wallet: { userId, balance: (MOCK_WALLETS[userId]?.balance || 0) + amount, currency: 'FCFA', simulated: true },
    transaction: { ...tx, status: 'completed', simulated: true },
  }
}

/**
 * Débit automatique du wallet pour payer une course
 */
export async function chargeWallet({ userId, amount, rideId }) {
  try {
    const { data: wallet } = await supabase.from('wallets').select('id, balance').eq('user_id', userId).single()
    if (!wallet || wallet.balance < amount) throw new Error('Solde insuffisant')

    await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      user_id: userId,
      type: 'payment',
      amount: -amount,
      ride_id: rideId,
      status: 'completed',
      created_at: new Date().toISOString(),
    })

    const { data, error } = await supabase
      .from('wallets')
      .update({ balance: wallet.balance - amount })
      .eq('id', wallet.id)
      .select().single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('chargeWallet simulation:', err.message)
    return { userId, balanceAfter: (MOCK_WALLETS[userId]?.balance || 0) - amount, simulated: true }
  }
}

/**
 * Historique des transactions du wallet
 */
export async function getWalletTransactions(userId, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    if (data?.length > 0) return data
  } catch { /* fallback */ }

  return [
    { id: 'TXW-001', type: 'recharge', amount:  10000, provider: 'Orange Money', status: 'completed', created_at: '2024-03-10T10:00:00Z' },
    { id: 'TXW-002', type: 'payment',  amount:  -1500, ride_id: 'RID-001',       status: 'completed', created_at: '2024-03-09T14:30:00Z' },
    { id: 'TXW-003', type: 'bonus',    amount:   500,  label: 'Parrainage',       status: 'completed', created_at: '2024-03-08T09:00:00Z' },
    { id: 'TXW-004', type: 'payment',  amount:  -800,  ride_id: 'RID-002',       status: 'completed', created_at: '2024-03-07T16:00:00Z' },
  ]
}

/**
 * Programme de parrainage — créditer les deux parties
 */
export async function applyReferralBonus({ referrerId, referredId, bonusAmount = 1000 }) {
  try {
    await Promise.all([
      rechargeWallet({ userId: referrerId, amount: bonusAmount, provider: 'bonus', reference: `REF-${referredId}` }),
      rechargeWallet({ userId: referredId, amount: bonusAmount, provider: 'bonus', reference: `REF-${referrerId}` }),
    ])
    return { success: true, bonusAmount }
  } catch (err) {
    console.warn('applyReferralBonus:', err.message)
    return { success: false, error: err.message }
  }
}
