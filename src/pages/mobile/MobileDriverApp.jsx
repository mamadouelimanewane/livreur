import { useState } from 'react'
import { FiHome, FiMapPin, FiNavigation, FiDollarSign, FiUser, FiClock, FiCheckCircle, FiXCircle, FiToggleLeft, FiToggleRight, FiTruck, FiPhone, FiStar, FiFileText, FiAlertCircle } from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdOutlineDeliveryDining } from 'react-icons/md'

const ACCENT = '#4680ff'
const DARK = '#1a1d2e'
const BG = '#f5f7fb'
const GREEN = '#22c55e'
const ORANGE = '#f59e0b'

function BottomTab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '8px 0', border: 'none', cursor: 'pointer',
      background: 'transparent',
      color: active ? ACCENT : '#94a3b8',
      transition: 'color 0.2s',
    }}>
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
    </button>
  )
}

function StatMini({ value, label, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '16px 10px',
      textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flex: 1,
    }}>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

function HomeTab() {
  const [online, setOnline] = useState(true)

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Driver status banner */}
      <div style={{
        background: online
          ? 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)'
          : 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
        borderRadius: 20, padding: '20px', color: '#fff',
        marginBottom: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: 10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Statut actuel</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>
              {online ? 'En ligne' : 'Hors ligne'}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
              {online ? 'Vous recevez des demandes de course' : 'Activez pour recevoir des courses'}
            </div>
          </div>
          <button onClick={() => setOnline(o => !o)} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 14,
            padding: '10px 14px', cursor: 'pointer', color: '#fff', display: 'flex',
            alignItems: 'center', gap: 6,
          }}>
            {online ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
          </button>
        </div>
      </div>

      {/* Today stats */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Aujourd'hui
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <StatMini value="7" label="Courses" color={ACCENT} />
        <StatMini value="12 500" label="Gains (FCFA)" color={GREEN} />
        <StatMini value="4.9" label="Note" color={ORANGE} />
      </div>

      {/* Incoming request card */}
      <div style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 24,
        border: `2px solid ${ACCENT}20`,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
          padding: '14px 18px', color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MdOutlineLocalTaxi size={18} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Nouvelle demande</span>
          </div>
          <span style={{
            background: 'rgba(255,255,255,0.2)', padding: '3px 10px',
            borderRadius: 10, fontSize: 12, fontWeight: 700,
          }}>1 500 FCFA</span>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
            <span style={{ fontSize: 13, color: '#334155' }}>Dakar Plateau — Rue Félix Eboué</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: 13, color: '#334155' }}>Ouakam — Cité Avion</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: GREEN, color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Accepter</button>
            <button style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: '#fee2e2', color: '#ef4444', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Refuser</button>
          </div>
        </div>
      </div>

      {/* Recent rides */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Courses récentes
      </div>
      {[
        { id: 'SUR-2849', from: 'Médina', to: 'HLM', price: '1 200 FCFA', time: '14:30', status: 'done' },
        { id: 'SUR-2845', from: 'Parcelles', to: 'Almadies', price: '2 000 FCFA', time: '13:15', status: 'done' },
        { id: 'SUR-2840', from: 'Sicap', to: 'Liberté 6', price: '800 FCFA', time: '11:45', status: 'cancel' },
      ].map(r => (
        <div key={r.id} style={{
          background: '#fff', borderRadius: 12, padding: '14px 16px',
          marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: r.status === 'done' ? '#dcfce7' : '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {r.status === 'done' ? <FiCheckCircle size={18} color={GREEN} /> : <FiXCircle size={18} color="#ef4444" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{r.from} → {r.to}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{r.time} — {r.id}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{r.price}</div>
        </div>
      ))}
    </div>
  )
}

function EarningsTab() {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Earnings summary */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #2d1f5e 100%)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, opacity: 0.6 }}>Gains cette semaine</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>45 750 FCFA</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>32</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>Courses</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>4.8</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>Note moy.</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>28h</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>En ligne</div>
          </div>
        </div>
      </div>

      {/* Daily breakdown */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Détail par jour
      </div>
      {[
        { day: 'Lundi', amount: '8 200', rides: 5 },
        { day: 'Mardi', amount: '6 500', rides: 4 },
        { day: 'Mercredi', amount: '9 100', rides: 6 },
        { day: 'Jeudi', amount: '7 450', rides: 5 },
        { day: 'Vendredi', amount: '10 300', rides: 7 },
        { day: 'Samedi', amount: '4 200', rides: 3 },
        { day: 'Dimanche', amount: '0', rides: 0 },
      ].map((d, i) => (
        <div key={i} style={{
          background: '#fff', borderRadius: 12, padding: '14px 16px',
          marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{d.day}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{d.rides} courses</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: d.amount === '0' ? '#cbd5e1' : GREEN }}>
            {d.amount} FCFA
          </div>
        </div>
      ))}

      {/* Withdraw button */}
      <button style={{
        width: '100%', padding: '16px', borderRadius: 14, marginTop: 16,
        background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
        color: '#fff', border: 'none', fontSize: 15, fontWeight: 700,
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(70,128,255,0.35)',
      }}>
        Demander un retrait
      </button>
    </div>
  )
}

function ProfileTab() {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Profile card */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK}, #2d1f5e)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        textAlign: 'center', marginBottom: 24,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', fontSize: 24, fontWeight: 800,
          boxShadow: '0 4px 16px rgba(70,128,255,0.4)',
        }}>IB</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Ibrahima Ba</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>+221 78 456 78 90</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(34,197,94,0.2)', padding: '4px 12px',
          borderRadius: 12, marginTop: 8, fontSize: 12, fontWeight: 600,
        }}>
          <FiCheckCircle size={12} color={GREEN} />
          Conducteur vérifié
        </div>
      </div>

      {/* Vehicle info */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiTruck size={16} color={ACCENT} />
          Mon véhicule
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Type', value: 'Moto' },
            { label: 'Marque', value: 'Honda CG 125' },
            { label: 'Plaque', value: 'DK-2847-AF' },
            { label: 'Couleur', value: 'Noir' },
          ].map((v, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{v.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginTop: 2 }}>{v.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: <FiUser size={18} />, label: 'Modifier mon profil' },
          { icon: <FiFileText size={18} />, label: 'Mes documents' },
          { icon: <FiStar size={18} />, label: 'Mes avis (4.8/5)' },
          { icon: <FiPhone size={18} />, label: 'Contacter le support' },
          { icon: <FiAlertCircle size={18} />, label: 'SOS Urgence' },
        ].map((m, i) => (
          <button key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: '#fff', borderRadius: 12, padding: '14px 16px',
            border: 'none', cursor: 'pointer', width: '100%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            fontSize: 14, fontWeight: 500, color: '#334155', textAlign: 'left',
          }}>
            <span style={{ color: ACCENT, display: 'flex' }}>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MobileDriverApp() {
  const [tab, setTab] = useState('home')

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      {/* Status bar */}
      <div style={{
        background: DARK, padding: '10px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#fff', fontSize: 12, fontWeight: 600,
      }}>
        <span>SÛR Conducteur</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} />
          <span style={{ opacity: 0.6, fontSize: 11 }}>En ligne</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {tab === 'home' && <HomeTab />}
        {tab === 'earnings' && <EarningsTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>

      {/* Bottom nav */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex', padding: '4px 0 8px', flexShrink: 0,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
      }}>
        <BottomTab icon={<FiHome size={20} />} label="Accueil" active={tab === 'home'} onClick={() => setTab('home')} />
        <BottomTab icon={<FiDollarSign size={20} />} label="Gains" active={tab === 'earnings'} onClick={() => setTab('earnings')} />
        <BottomTab icon={<FiUser size={20} />} label="Profil" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}
