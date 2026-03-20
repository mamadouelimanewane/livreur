import { useState, useEffect } from 'react'
import { FiSmartphone, FiDollarSign, FiRefreshCw, FiCheckCircle, FiAlertCircle, FiCopy } from 'react-icons/fi'
import PageLayout from '../../components/PageLayout'
import {
  MOBILE_MONEY_OPERATORS,
  TRANSACTION_STATUS,
  detectOperator,
  initiatePayment,
  getWalletBalance,
  getTransactionHistory,
  requestWithdrawal,
  confirmTransaction,
} from '../../services/api/mobileMoneyService'

export default function MobileMoneyTestPage() {
  const [activeTab, setActiveTab] = useState('payment') // payment, withdrawal, history
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('')
  const [detectedOperator, setDetectedOperator] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [simulationStep, setSimulationStep] = useState(0)

  // Détecter l'opérateur automatiquement
  useEffect(() => {
    if (phoneNumber.length >= 9) {
      const detected = detectOperator(phoneNumber)
      setDetectedOperator(detected)
      if (detected) {
        setSelectedOperator(detected.id)
      }
    } else {
      setDetectedOperator(null)
    }
  }, [phoneNumber])

  // Charger le solde et l'historique
  useEffect(() => {
    loadWalletData()
  }, [])

  const loadWalletData = async () => {
    const balance = await getWalletBalance('USR-001')
    setWalletBalance(balance)
    const history = await getTransactionHistory('USR-001')
    setTransactions(history)
  }

  // Simulation de paiement
  const handlePayment = async () => {
    if (!phoneNumber || !amount || !selectedOperator) return
    
    setLoading(true)
    setResult(null)
    setSimulationStep(1)

    // Étape 1: Initiation
    setTimeout(async () => {
      const paymentResult = await initiatePayment({
        type: 'payment',
        userId: 'USR-001',
        userName: 'Test User',
        amount: parseInt(amount),
        operator: selectedOperator,
        phoneNumber: phoneNumber,
        description: 'Test paiement course',
      })

      setResult(paymentResult)
      setSimulationStep(2)

      // Étape 2: Simulation confirmation utilisateur
      setTimeout(() => {
        setSimulationStep(3)
        
        // Étape 3: Confirmation transaction
        setTimeout(async () => {
          const confirmed = await confirmTransaction(
            paymentResult.id,
            `REF-${Date.now()}`,
            'completed'
          )
          setResult(confirmed)
          setSimulationStep(4)
          setLoading(false)
          loadWalletData()
        }, 2000)
      }, 3000)
    }, 1000)
  }

  // Simulation de retrait
  const handleWithdrawal = async () => {
    if (!phoneNumber || !amount || !selectedOperator) return
    
    setLoading(true)
    setResult(null)
    setSimulationStep(1)

    setTimeout(async () => {
      const withdrawalResult = await requestWithdrawal(
        'USR-001',
        parseInt(amount),
        selectedOperator,
        phoneNumber
      )

      setResult(withdrawalResult)
      setSimulationStep(2)
      setLoading(false)
      loadWalletData()
    }, 1500)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const operators = Object.values(MOBILE_MONEY_OPERATORS)

  return (
    <PageLayout 
      title="Test Mobile Money" 
      subtitle="Simulation Wave, Orange Money, Free Money"
    >
      {/* Solde du portefeuille */}
      <div style={{
        background: 'linear-gradient(135deg, #4680ff, #6366f1)',
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 24,
        color: '#fff',
        boxShadow: '0 8px 24px rgba(70,128,255,0.3)',
      }}>
        <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 8 }}>Solde du portefeuille</div>
        <div style={{ fontSize: 36, fontWeight: 800 }}>{walletBalance.toLocaleString()} FCFA</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>Dernière mise à jour: à l'instant</div>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'payment', label: '💳 Paiement', icon: FiDollarSign },
          { id: 'withdrawal', label: '💸 Retrait', icon: FiSmartphone },
          { id: 'history', label: '📜 Historique', icon: FiRefreshCw },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); setSimulationStep(0) }}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 10,
              border: 'none',
              background: activeTab === tab.id ? '#4680ff' : '#f1f5f9',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        
        {/* PAIEMENT */}
        {activeTab === 'payment' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 20px 0' }}>
              Simuler un paiement
            </h3>

            {/* Sélection opérateur */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Opérateur
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                {operators.map(op => (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOperator(op.id)}
                    style={{
                      flex: 1,
                      padding: '16px 12px',
                      borderRadius: 12,
                      border: `2px solid ${selectedOperator === op.id ? op.color : '#e2e8f0'}`,
                      background: selectedOperator === op.id ? op.color + '15' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: op.color,
                      margin: '0 auto 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 700,
                    }}>
                      {op.code}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{op.name}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{op.fees.percentage}% frais</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Numéro de téléphone
              </label>
              <input
                type="tel"
                placeholder="77 123 45 67"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: detectedOperator ? `2px solid ${detectedOperator.color}` : '2px solid #e2e8f0',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
              {detectedOperator && (
                <div style={{ marginTop: 8, fontSize: 12, color: detectedOperator.color, fontWeight: 600 }}>
                  ✅ {detectedOperator.name} détecté
                </div>
              )}
            </div>

            {/* Montant */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Montant (FCFA)
              </label>
              <input
                type="number"
                placeholder="1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e2e8f0',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            </div>

            {/* Bouton */}
            <button
              onClick={handlePayment}
              disabled={loading || !phoneNumber || !amount || !selectedOperator}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: 'none',
                background: loading ? '#94a3b8' : '#22c55e',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Traitement en cours...' : '💳 Simuler le paiement'}
            </button>
          </div>
        )}

        {/* RETRAIT */}
        {activeTab === 'withdrawal' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 20px 0' }}>
              Demander un retrait
            </h3>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Opérateur
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                {operators.map(op => (
                  <button
                    key={op.id}
                    onClick={() => setSelectedOperator(op.id)}
                    style={{
                      flex: 1,
                      padding: '16px 12px',
                      borderRadius: 12,
                      border: `2px solid ${selectedOperator === op.id ? op.color : '#e2e8f0'}`,
                      background: selectedOperator === op.id ? op.color + '15' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: op.color,
                      margin: '0 auto 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 700,
                    }}>
                      {op.code}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{op.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Numéro de téléphone
              </label>
              <input
                type="tel"
                placeholder="77 123 45 67"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e2e8f0',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Montant à retirer (FCFA)
              </label>
              <input
                type="number"
                placeholder="5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '2px solid #e2e8f0',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
              <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                Solde disponible: {walletBalance.toLocaleString()} FCFA
              </div>
            </div>

            <button
              onClick={handleWithdrawal}
              disabled={loading || !phoneNumber || !amount || !selectedOperator}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 10,
                border: 'none',
                background: loading ? '#94a3b8' : '#f59e0b',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Traitement en cours...' : '💸 Demander le retrait'}
            </button>
          </div>
        )}

        {/* HISTORIQUE */}
        {activeTab === 'history' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 20px 0' }}>
              Historique des transactions
            </h3>

            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {transactions.map((txn, i) => {
                const op = MOBILE_MONEY_OPERATORS[txn.operator]
                const status = TRANSACTION_STATUS[txn.status]
                return (
                  <div key={i} style={{
                    padding: '16px',
                    borderRadius: 12,
                    background: '#f8fafc',
                    marginBottom: 12,
                    borderLeft: `4px solid ${op?.color || '#94a3b8'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                          {txn.type === 'payment' ? 'Paiement course' : 
                           txn.type === 'topup' ? 'Recharge' : 
                           txn.type === 'withdrawal' ? 'Retrait' : txn.type}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                          {txn.phoneNumber} • {op?.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                          {new Date(txn.createdAt || txn.created_at).toLocaleString('fr-FR')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: txn.type === 'withdrawal' ? '#ef4444' : '#22c55e' }}>
                          {txn.type === 'withdrawal' ? '-' : '+'}{txn.amount.toLocaleString()} FCFA
                        </div>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '3px 10px',
                          borderRadius: 10,
                          background: status?.color + '20',
                          color: status?.color,
                        }}>
                          {status?.label}
                        </span>
                      </div>
                    </div>
                    {txn.reference && (
                      <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                        Réf: {txn.reference}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Simulation Steps */}
        {simulationStep > 0 && (
          <div style={{ marginTop: 24, padding: 20, background: '#f0f9ff', borderRadius: 12, border: '1px solid #bae6fd' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0369a1', margin: '0 0 16px 0' }}>
              🔵 Simulation en cours
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: simulationStep >= 1 ? '#22c55e' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 14,
                }}>1</div>
                <span style={{ fontSize: 13, color: simulationStep >= 1 ? '#166534' : '#64748b' }}>
                  Initiation de la transaction
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: simulationStep >= 2 ? '#22c55e' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 14,
                }}>2</div>
                <span style={{ fontSize: 13, color: simulationStep >= 2 ? '#166534' : '#64748b' }}>
                  En attente de confirmation sur le téléphone...
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: simulationStep >= 3 ? '#22c55e' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 14,
                }}>3</div>
                <span style={{ fontSize: 13, color: simulationStep >= 3 ? '#166534' : '#64748b' }}>
                  Validation de la transaction
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: simulationStep >= 4 ? '#22c55e' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 14,
                }}>4</div>
                <span style={{ fontSize: 13, color: simulationStep >= 4 ? '#166534' : '#64748b' }}>
                  Transaction complétée
                </span>
              </div>
            </div>

            {result?.ussdCode && (
              <div style={{ marginTop: 16, padding: 12, background: '#fff', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Code USSD à composer:</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', fontFamily: 'monospace' }}>
                    {result.ussdCode}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(result.ussdCode)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4680ff' }}
                  >
                    <FiCopy size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Résultat */}
        {result && simulationStep === 4 && (
          <div style={{ marginTop: 20, padding: 20, background: '#f0fdf4', borderRadius: 12, border: '1px solid #86efac' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <FiCheckCircle size={24} color="#22c55e" />
              <span style={{ fontSize: 16, fontWeight: 700, color: '#166534' }}>
                Transaction réussie!
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#166534' }}>
              <div>ID: {result.id}</div>
              <div>Montant: {result.amount?.toLocaleString()} FCFA</div>
              <div>Statut: {TRANSACTION_STATUS[result.status]?.label}</div>
              {result.reference && <div>Référence: {result.reference}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Info opérateurs */}
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {operators.map(op => (
          <div key={op.id} style={{ background: '#fff', borderRadius: 12, padding: 16, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: op.color,
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 20,
              fontWeight: 700,
            }}>
              {op.code}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{op.name}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Min: {op.minAmount.toLocaleString()} FCFA
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              Max: {op.maxAmount.toLocaleString()} FCFA
            </div>
            <div style={{ fontSize: 11, color: op.fees.percentage > 0 ? '#ef4444' : '#22c55e', marginTop: 4 }}>
              Frais: {op.fees.percentage}%
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 8 }}>
              Préfixes: {op.prefix.join(', ') || 'Tous'}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
