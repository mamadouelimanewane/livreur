import { useState } from 'react'
import { FiCheckCircle, FiShield, FiX } from 'react-icons/fi'

const ACCENT = '#4680ff'

/**
 * Simulateur de paiement Mobile Money (Wave / Orange Money).
 */
export default function PaymentModal({ amount, onConfirm, onClose }) {
  const [method, setMethod] = useState('wave') // wave, orange, wallet
  const [step, setStep] = useState('choice') // choice, processing, success

  const handlePay = () => {
    setStep('processing')
    // Simulation du temps de traitement bancaire/réseau
    setTimeout(() => {
      setStep('success')
      setTimeout(() => {
        onConfirm(method)
      }, 1500)
    }, 2000)
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 350,
        padding: '24px', position: 'relative', overflow: 'hidden'
      }}>
        {step !== 'processing' && (
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: '#f1f5f9', borderRadius: '50%', padding: 6 }}>
            <FiX size={18} color="#64748b" />
          </button>
        )}

        {step === 'choice' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: ACCENT + '15', color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <FiShield size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Paiement Sécurisé</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Choisissez votre mode de paiement</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { id: 'wave', name: 'Wave', color: '#1ca1f2', desc: 'Sans frais' },
                { id: 'orange', name: 'Orange Money', color: '#ff6600', desc: 'Rapide et sûr' },
                { id: 'wallet', name: 'Mon Compte LiviGo', color: ACCENT, desc: 'Solde: 5 000 FCFA' }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  style={{
                    padding: '16px', borderRadius: 16, border: method === m.id ? `2px solid ${m.color}` : '2px solid #f1f5f9',
                    background: method === m.id ? m.color + '05' : '#fff',
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #cbd5e1', background: method === m.id ? m.color : 'transparent' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={handlePay}
              style={{
                width: '100%', padding: '16px', borderRadius: 16, background: ACCENT, color: '#fff',
                border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(70,128,255,0.3)'
              }}
            >
              Payer {amount}
            </button>
          </>
        )}

        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ 
              width: 40, height: 40, border: '4px solid #f1f5f9', borderTop: `4px solid ${ACCENT}`,
              borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>Traitement du paiement...</div>
          </div>
        )}

        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{ color: '#22c55e', marginBottom: 16 }}><FiCheckCircle size={56} /></div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Paiement Réussi !</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Demande en cours d'envoi...</div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
