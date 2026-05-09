import { useEffect, useState } from 'react'
import { FiDollarSign, FiPlus, FiArrowDown, FiArrowUp, FiSmartphone, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'
import { getWallet, getWalletTransactions, rechargeWallet } from '../../services/api/walletService'
import { getLoyaltyProfile } from '../../services/api/loyaltyService'

const TX_ICONS = { recharge: '💰', payment: '🚗', bonus: '🎁', cashout: '💸', refund: '↩️' }
const TX_COLORS = { recharge: '#22c55e', payment: '#ef4444', bonus: '#a855f7', cashout: '#f59e0b', refund: '#4680ff' }

const PROVIDERS = [
  { id: 'orange_money', label: 'Orange Money', color: '#ff6900', emoji: '🟠' },
  { id: 'wave',         label: 'Wave',          color: '#1e90ff', emoji: '🔵' },
  { id: 'free_money',   label: 'Free Money',    color: '#e60026', emoji: '🔴' },
]

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 25000]

function RechargeModal({ onClose, onSuccess }) {
  const [provider, setProvider]   = useState('orange_money')
  const [amount, setAmount]       = useState(5000)
  const [phone, setPhone]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [step, setStep]           = useState(1) // 1=form, 2=confirm, 3=success

  const handleSubmit = async () => {
    if (step === 1) { setStep(2); return }
    setLoading(true)
    try {
      await rechargeWallet({ userId: 'USR-001', amount, provider, reference: `REF-${Date.now()}` })
      setStep(3)
      setTimeout(() => { onSuccess(amount); onClose() }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const provInfo = PROVIDERS.find(p => p.id === provider)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        {step === 3 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Rechargement réussi !</div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>{amount.toLocaleString('fr-FR')} FCFA ajoutés à votre wallet</div>
          </div>
        ) : (
          <>
            <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 700 }}>
              {step === 1 ? 'Recharger le wallet' : 'Confirmer le rechargement'}
            </h3>

            {step === 1 ? (
              <>
                {/* Provider */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Moyen de paiement</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {PROVIDERS.map(p => (
                      <button key={p.id} onClick={() => setProvider(p.id)} style={{
                        flex: 1, padding: '10px 0', borderRadius: 10, border: `2px solid ${provider === p.id ? p.color : '#e2e8f0'}`,
                        background: provider === p.id ? p.color + '12' : '#fff', cursor: 'pointer',
                        fontWeight: 600, fontSize: 12, color: provider === p.id ? p.color : '#64748b',
                        transition: 'all 0.15s',
                      }}>
                        <div style={{ fontSize: 20 }}>{p.emoji}</div>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Montant */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Montant (FCFA)</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {QUICK_AMOUNTS.map(a => (
                      <button key={a} onClick={() => setAmount(a)} style={{
                        padding: '5px 12px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        background: amount === a ? '#4680ff' : '#f1f5f9',
                        color: amount === a ? '#fff' : '#475569',
                      }}>
                        {a.toLocaleString()} F
                      </button>
                    ))}
                  </div>
                  <input
                    type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} min={500} max={500000}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 700, boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                {/* Téléphone */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                    <FiSmartphone size={12} style={{ marginRight: 4 }} />Numéro {provInfo?.label}
                  </label>
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Montant</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{amount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Via</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: provInfo?.color }}>{provInfo?.emoji} {provInfo?.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Numéro</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{phone || '—'}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                  Une confirmation sera envoyée par SMS sur votre numéro {provInfo?.label}.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={step === 2 ? () => setStep(1) : onClose} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
                {step === 2 ? 'Modifier' : 'Annuler'}
              </button>
              <button onClick={handleSubmit} disabled={loading || amount < 500} style={{
                flex: 2, padding: 10, borderRadius: 8, border: 'none',
                background: loading ? '#e2e8f0' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: loading ? '#94a3b8' : '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              }}>
                {loading ? 'Traitement…' : step === 1 ? 'Continuer →' : 'Confirmer le paiement'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function WalletPage() {
  const [wallet, setWallet]         = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loyalty, setLoyalty]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [showRecharge, setShowRecharge] = useState(false)

  useEffect(() => {
    Promise.all([
      getWallet('USR-001'),
      getWalletTransactions('USR-001'),
      getLoyaltyProfile('USR-001'),
    ]).then(([w, tx, loy]) => {
      setWallet(w)
      setTransactions(tx)
      setLoyalty(loy)
      setLoading(false)
    })
  }, [])

  const handleRechargeSuccess = (amount) => {
    setWallet(w => ({ ...w, balance: (w?.balance || 0) + amount }))
    setShowRecharge(false)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Chargement…</div>

  return (
    <div>
      <PageHeader title="LiviWallet" icon={<FiDollarSign />}>
        <Btn color="#22c55e" onClick={() => setShowRecharge(true)}>
          <FiPlus size={14} /> Recharger
        </Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Solde */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1d2e, #2d1f5e, #4680ff)',
          borderRadius: 16, padding: '28px 32px', color: '#fff',
        }}>
          <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Solde disponible</div>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em' }}>
            {(wallet?.balance || 0).toLocaleString('fr-FR')}
            <span style={{ fontSize: 18, opacity: 0.8, marginLeft: 6 }}>FCFA</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button onClick={() => setShowRecharge(true)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <FiArrowDown size={14} /> Recharger
            </button>
            <button style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <FiArrowUp size={14} /> Retirer
            </button>
          </div>
        </div>

        {/* Fidélité */}
        {loyalty && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Niveau fidélité</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{loyalty.levelInfo.emoji}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: loyalty.levelInfo.color }}>{loyalty.levelInfo.name}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#1e293b' }}>{loyalty.totalPoints?.toLocaleString?.()}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>points LiviStars</div>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                <span>{loyalty.levelInfo.name}</span>
                {loyalty.levelInfo.nextLevel && <span>{loyalty.levelInfo.nextLevel.name}</span>}
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${loyalty.levelInfo.progress}%`, background: `linear-gradient(90deg, ${loyalty.levelInfo.color}, ${loyalty.levelInfo.color}aa)`, borderRadius: 4, transition: 'width 0.8s' }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{loyalty.levelInfo.perksLabel}</div>
          </div>
        )}
      </div>

      {/* Historique transactions */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Historique des transactions</h3>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{transactions.length} transactions</span>
        </div>
        {transactions.map((tx, i) => (
          <div key={tx.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 20px', borderBottom: i < transactions.length - 1 ? '1px solid #f8fafc' : 'none',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: (TX_COLORS[tx.type] || '#94a3b8') + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              {TX_ICONS[tx.type] || '💳'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>
                {tx.type === 'recharge' ? `Rechargement ${tx.provider || ''}` : tx.type === 'payment' ? 'Paiement course' : tx.type === 'bonus' ? tx.label || 'Bonus' : tx.type}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                {new Date(tx.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })} — {new Date(tx.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: tx.amount > 0 ? '#22c55e' : '#ef4444' }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('fr-FR')} FCFA
              </div>
              <div style={{ marginTop: 2 }}>
                {tx.status === 'completed'
                  ? <FiCheckCircle size={12} color="#22c55e" />
                  : tx.status === 'pending'
                  ? <FiClock size={12} color="#f59e0b" />
                  : <FiXCircle size={12} color="#ef4444" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showRecharge && <RechargeModal onClose={() => setShowRecharge(false)} onSuccess={handleRechargeSuccess} />}
    </div>
  )
}
