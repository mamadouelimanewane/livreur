import { useState } from 'react'
import { FiMapPin, FiClock, FiStar, FiUser, FiHome, FiNavigation, FiPhone, FiPackage, FiTruck, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdOutlineDeliveryDining } from 'react-icons/md'

const ACCENT = '#4680ff'
const DARK = '#1a1d2e'
const BG = '#f5f7fb'

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

function ServiceCard({ icon, title, desc, gradient, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', borderRadius: 16, padding: '20px 18px',
      border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', gap: 14,
      transition: 'transform 0.2s, box-shadow 0.2s',
      width: '100%',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 14, background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0,
      }}>
        <span style={{ color: '#fff', display: 'flex' }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
      </div>
    </button>
  )
}

function HomeTab() {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Welcome banner */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #2d1f5e 50%, ${ACCENT} 100%)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -10, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 13, opacity: 0.7 }}>Bienvenue sur</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>SÛR</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
          Réservez un taxi ou commandez une livraison en quelques secondes
        </div>
      </div>

      {/* Services */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>
        Nos services
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        <ServiceCard
          icon={<MdOutlineLocalTaxi size={24} />}
          title="Moto Taxi"
          desc="Course rapide en moto à travers la ville"
          gradient="linear-gradient(135deg, #f59e0b, #d97706)"
        />
        <ServiceCard
          icon={<MdOutlineDeliveryDining size={24} />}
          title="Livraison"
          desc="Envoyez ou recevez des colis partout"
          gradient="linear-gradient(135deg, #22c55e, #16a34a)"
        />
        <ServiceCard
          icon={<FiPackage size={22} />}
          title="Colis Express"
          desc="Livraison express en moins d'1 heure"
          gradient="linear-gradient(135deg, #4680ff, #6366f1)"
        />
      </div>

      {/* Quick actions */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>
        Actions rapides
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { icon: <FiNavigation size={20} />, label: 'Réserver', color: '#4680ff' },
          { icon: <FiClock size={20} />, label: 'Historique', color: '#f59e0b' },
          { icon: <FiPhone size={20} />, label: 'SOS', color: '#ef4444' },
        ].map((a, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: '18px 12px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: a.color + '15', color: a.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
            }}>{a.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RidesTab() {
  const rides = [
    { id: 'SUR-2849', type: 'Moto Taxi', from: 'Dakar Plateau', to: 'Ouakam', status: 'completed', price: '1 500 FCFA', date: '15 Mars 2026' },
    { id: 'SUR-2832', type: 'Livraison', from: 'Almadies', to: 'Parcelles Assainies', status: 'completed', price: '2 200 FCFA', date: '14 Mars 2026' },
    { id: 'SUR-2815', type: 'Moto Taxi', from: 'Médina', to: 'HLM Grand Yoff', status: 'cancelled', price: '800 FCFA', date: '13 Mars 2026' },
    { id: 'SUR-2801', type: 'Colis Express', from: 'Liberté 6', to: 'Sicap Foire', status: 'completed', price: '3 500 FCFA', date: '12 Mars 2026' },
  ]

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
        Mes courses
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rides.map(r => (
          <div key={r.id} style={{
            background: '#fff', borderRadius: 14, padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{r.id}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: r.type === 'Moto Taxi' ? '#fef3c7' : r.type === 'Livraison' ? '#dcfce7' : '#dbeafe',
                  color: r.type === 'Moto Taxi' ? '#b45309' : r.type === 'Livraison' ? '#15803d' : '#1d4ed8',
                }}>{r.type}</span>
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                color: r.status === 'completed' ? '#22c55e' : '#ef4444',
              }}>
                {r.status === 'completed' ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />}
                {r.status === 'completed' ? 'Terminée' : 'Annulée'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <FiMapPin size={12} color="#22c55e" />
              <span style={{ fontSize: 12, color: '#64748b' }}>{r.from}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <FiNavigation size={12} color="#ef4444" />
              <span style={{ fontSize: 12, color: '#64748b' }}>{r.to}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{r.date}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{r.price}</span>
            </div>
          </div>
        ))}
      </div>
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
        }}>AM</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Amadou Mbaye</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>+221 77 123 45 67</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>amadou.mbaye@gmail.com</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { value: '24', label: 'Courses', color: '#4680ff' },
          { value: '4.8', label: 'Note', color: '#f59e0b' },
          { value: '8', label: 'Mois', color: '#22c55e' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 14, padding: '16px 12px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: <FiUser size={18} />, label: 'Modifier mon profil' },
          { icon: <FiStar size={18} />, label: 'Mes avis' },
          { icon: <FiMapPin size={18} />, label: 'Adresses enregistrées' },
          { icon: <FiPhone size={18} />, label: 'Contacter le support' },
        ].map((m, i) => (
          <button key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: '#fff', borderRadius: 12, padding: '14px 16px',
            border: 'none', cursor: 'pointer', width: '100%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            fontSize: 14, fontWeight: 500, color: '#334155',
            textAlign: 'left',
          }}>
            <span style={{ color: ACCENT, display: 'flex' }}>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MobileUserApp() {
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
        <span>SÛR</span>
        <span style={{ opacity: 0.6 }}>Dakar, Sénégal</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {tab === 'home' && <HomeTab />}
        {tab === 'rides' && <RidesTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>

      {/* Bottom nav */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        padding: '4px 0 8px',
        flexShrink: 0,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
      }}>
        <BottomTab icon={<FiHome size={20} />} label="Accueil" active={tab === 'home'} onClick={() => setTab('home')} />
        <BottomTab icon={<FiClock size={20} />} label="Courses" active={tab === 'rides'} onClick={() => setTab('rides')} />
        <BottomTab icon={<FiUser size={20} />} label="Profil" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}
