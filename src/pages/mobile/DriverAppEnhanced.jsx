import { useEffect, useState } from 'react'
import { FiHome, FiMapPin, FiDollarSign, FiUser, FiCheckCircle, FiXCircle, FiToggleLeft, FiToggleRight, FiTruck, FiPhone, FiStar, FiFileText, FiAlertCircle, FiCamera, FiList, FiClock, FiTrendingUp, FiNavigation, FiMessageSquare } from 'react-icons/fi'
import { MdOutlineLocalTaxi } from 'react-icons/md'
import MapView from '../../components/MapView'
import { decodePolyline } from '../../services/api/locationService'

const ACCENT = '#ef4444'
const DARK = '#1a1d2e'
const BG = '#f5f7fb'
const GREEN = '#22c55e'

// Données mock améliorées
const MOCK_DATA = {
  homeContent: {
    brand: 'LiviGo Conducteur',
    statusLabel: 'Statut actuel',
    onlineLabel: 'En ligne',
    offlineLabel: 'Hors ligne',
    onlineDescription: 'Vous recevez des demandes',
    offlineDescription: 'Activez pour recevoir des courses',
    todayStats: [
      { value: '12', label: 'Courses', color: ACCENT },
      { value: '18 500', label: 'Gains FCFA', color: GREEN },
      { value: '4.8', label: 'Note', color: '#f59e0b' },
    ],
    incomingRequest: {
      db_id: 'ride-001',
      title: 'Nouvelle course',
      price: '2 500 FCFA',
      pickup: 'Dakar Plateau - Avenue Lamine Guèye',
      destination: 'Ouakam - Cité Avion',
      distance: '8.5 km',
      duration: '25 min',
      clientName: 'Fatou N.',
      clientRating: 4.9
    },
    recentRides: [
      { id: 'LIV-2849', from: 'Médina', to: 'HLM', price: '1 200 FCFA', time: '14:30', status: 'done', date: 'Aujourd\'hui' },
      { id: 'LIV-2845', from: 'Parcelles', to: 'Almadies', price: '2 000 FCFA', time: '13:15', status: 'done', date: 'Aujourd\'hui' },
      { id: 'LIV-2840', from: 'Sicap', to: 'Liberté 6', price: '800 FCFA', time: '11:45', status: 'cancel', date: 'Aujourd\'hui' },
    ]
  },
  earnings: {
    weeklyTitle: 'Gains cette semaine',
    weeklyAmount: '45 750 FCFA',
    monthlyAmount: '185 000 FCFA',
    highlights: [
      { value: '32', label: 'Courses' },
      { value: '4.8', label: 'Note moy.' },
      { value: '28h', label: 'En ligne' },
    ],
    daily: [
      { day: 'Lun', amount: '8 200', rides: 5 },
      { day: 'Mar', amount: '6 500', rides: 4 },
      { day: 'Mer', amount: '9 100', rides: 6 },
      { day: 'Jeu', amount: '7 450', rides: 5 },
      { day: 'Ven', amount: '10 300', rides: 7 },
      { day: 'Sam', amount: '4 200', rides: 3 },
      { day: 'Dim', amount: '0', rides: 0 },
    ]
  },
  profile: {
    name: 'Amadou Diallo',
    phone: '+221 77 123 45 67',
    initials: 'AD',
    badge: 'Chauffeur Pro',
    rating: 4.8,
    totalRides: 1247,
    memberSince: '2023',
    vehicle: [
      { label: 'Type', value: 'Moto Yamaha' },
      { label: 'Immatriculation', value: 'DK-2023-A' },
      { label: 'Couleur', value: 'Noir/Rouge' },
      { label: 'Année', value: '2022' },
    ],
    documents: [
      { label: 'Permis de conduire', status: 'valid', expiry: '2026' },
      { label: 'Assurance', status: 'valid', expiry: '2025' },
      { label: 'Carte grise', status: 'valid', expiry: '2026' },
    ]
  },
  history: [
    { id: 'LIV-2849', from: 'Médina', to: 'HLM', price: 1200, time: '14:30', date: '21 Mars', status: 'completed', payment: 'Orange Money' },
    { id: 'LIV-2845', from: 'Parcelles', to: 'Almadies', price: 2000, time: '13:15', date: '21 Mars', status: 'completed', payment: 'Espèces' },
    { id: 'LIV-2840', from: 'Sicap', to: 'Liberté 6', price: 800, time: '11:45', date: '21 Mars', status: 'cancelled', payment: '-' },
    { id: 'LIV-2835', from: 'Ouakam', to: 'Plateau', price: 1500, time: '09:20', date: '20 Mars', status: 'completed', payment: 'Wave' },
    { id: 'LIV-2830', from: 'Yoff', to: 'Médina', price: 1000, time: '18:45', date: '19 Mars', status: 'completed', payment: 'Espèces' },
  ]
}

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

function StatCard({ value, label, color }) {
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

function HomeTab({ onNavigate }) {
  const [online, setOnline] = useState(true)
  const [hasRequest, setHasRequest] = useState(true)
  const data = MOCK_DATA.homeContent

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {/* Carte */}
      <div style={{ height: 200, marginBottom: 16, borderRadius: 16, overflow: 'hidden' }}>
        <MapView 
          height="200px" 
          zoom={13}
          markers={[
            { position: [14.7167, -17.4677], label: "Vous" },
            { position: [14.73, -17.45], label: "Client" }
          ]}
        />
      </div>

      {/* Statut En ligne/Hors ligne */}
      <div style={{
        background: online
          ? 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)'
          : 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
        borderRadius: 20, padding: '20px', color: '#fff',
        marginBottom: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{data.statusLabel}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>
              {online ? data.onlineLabel : data.offlineLabel}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
              {online ? data.onlineDescription : data.offlineDescription}
            </div>
          </div>
          <button 
            onClick={() => setOnline(!online)}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 14,
              padding: '10px 14px', cursor: 'pointer', color: '#fff', display: 'flex',
              alignItems: 'center', gap: 6,
            }}
          >
            {online ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
          </button>
        </div>
      </div>

      {/* Stats du jour */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {data.todayStats.map((stat, i) => (
          <StatCard key={i} value={stat.value} label={stat.label} color={stat.color} />
        ))}
      </div>

      {/* Nouvelle demande */}
      {hasRequest && online && (
        <div style={{
          background: '#fff', borderRadius: 18,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 20,
          border: `2px solid ${ACCENT}30`,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}, #dc2626)`,
            padding: '14px 18px', color: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdOutlineLocalTaxi size={18} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>{data.incomingRequest.title}</span>
            </div>
            <span style={{
              background: 'rgba(255,255,255,0.2)', padding: '3px 10px',
              borderRadius: 10, fontSize: 12, fontWeight: 700,
            }}>{data.incomingRequest.price}</span>
          </div>
          
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiUser size={14} color={ACCENT} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{data.incomingRequest.clientName}</span>
              <span style={{ fontSize: 12, color: '#f59e0b' }}>★ {data.incomingRequest.clientRating}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>{data.incomingRequest.pickup}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
              <span style={{ fontSize: 12, color: '#64748b' }}>{data.incomingRequest.destination}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#94a3b8', marginBottom: 12 }}>
              <span>{data.incomingRequest.distance}</span>
              <span>•</span>
              <span>{data.incomingRequest.duration}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => setHasRequest(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  background: GREEN, color: '#fff', border: 'none',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Accepter</button>
              <button 
                onClick={() => setHasRequest(false)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  background: '#fee2e2', color: ACCENT, border: 'none',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Refuser</button>
            </div>
          </div>
        </div>
      )}

      {/* Bouton Historique */}
      <button 
        onClick={() => onNavigate('history')}
        style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: '#fff', border: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 14, fontWeight: 600, color: '#475569', cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        <FiList size={18} />
        Voir l'historique complet
      </button>
    </div>
  )
}

function EarningsTab() {
  const data = MOCK_DATA.earnings
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #2d1f5e 100%)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        marginBottom: 20, textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{data.weeklyTitle}</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>{data.weeklyAmount}</div>
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>Ce mois: {data.monthlyAmount}</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {data.highlights.map((item, i) => (
          <div key={i} style={{ flex: 1, background: '#fff', borderRadius: 12, padding: '14px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: DARK }}>{item.value}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setShowWithdrawModal(true)}
        style={{
          width: '100%', padding: '16px', borderRadius: 14, marginBottom: 20,
          background: `linear-gradient(135deg, ${ACCENT}, #dc2626)`,
          color: '#fff', border: 'none', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', boxShadow: `0 4px 16px ${ACCENT}40`,
        }}
      >
        Retirer mes gains
      </button>

      {showWithdrawModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 320 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>Retrait d'espèces</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>
              Montant disponible: <strong>{data.weeklyAmount}</strong>
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['1000', '5000', '10000', 'Tout'].map(amount => (
                <button key={amount} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8,
                  border: '1px solid #e2e8f0', background: '#f8fafc',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>{amount}</button>
              ))}
            </div>
            <button 
              onClick={() => {
                alert('Demande de retrait envoyée! Vous recevrez un SMS de confirmation.')
                setShowWithdrawModal(false)
              }}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: ACCENT, color: '#fff', border: 'none',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Confirmer le retrait
            </button>
            <button 
              onClick={() => setShowWithdrawModal(false)}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: 'transparent', color: '#64748b', border: 'none',
                fontSize: 14, marginTop: 8, cursor: 'pointer',
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Détail par jour
      </div>
      {data.daily.map(day => (
        <div key={day.day} style={{
          background: '#fff', borderRadius: 12, padding: '14px 16px',
          marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{day.day}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{day.rides} courses</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: day.amount === '0' ? '#cbd5e1' : GREEN }}>
            {day.amount} FCFA
          </div>
        </div>
      ))}
    </div>
  )
}

function HistoryTab() {
  const data = MOCK_DATA.history

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
        Historique des courses
      </div>
      
      {data.map((ride, i) => (
        <div key={i} style={{
          background: '#fff', borderRadius: 14, padding: '16px',
          marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{ride.id}</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{ride.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <FiMapPin size={12} color={GREEN} />
            <span style={{ fontSize: 12, color: '#334155' }}>{ride.from}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <FiNavigation size={12} color={ACCENT} />
            <span style={{ fontSize: 12, color: '#334155' }}>{ride.to}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{ride.time}</span>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: ride.status === 'completed' ? '#dcfce7' : '#fee2e2',
                color: ride.status === 'completed' ? '#15803d' : '#dc2626',
              }}>{ride.status === 'completed' ? 'Terminée' : 'Annulée'}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{ride.price} FCFA</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{ride.payment}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileTab() {
  const data = MOCK_DATA.profile

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${DARK}, #2d1f5e)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        textAlign: 'center', marginBottom: 20,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACCENT}, #dc2626)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', fontSize: 24, fontWeight: 800,
        }}>{data.initials}</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{data.name}</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{data.phone}</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(34,197,94,0.2)', padding: '4px 12px',
          borderRadius: 12, marginTop: 8, fontSize: 12, fontWeight: 600,
        }}>
          <FiCheckCircle size={12} color={GREEN} />
          {data.badge}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '18px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiTruck size={16} color={ACCENT} />
          Mon véhicule
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {data.vehicle.map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: '18px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Documents</div>
        {data.documents.map((doc, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < data.documents.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <span style={{ fontSize: 12 }}>{doc.label}</span>
            <span style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>✓ Valide jusqu'en {doc.expiry}</span>
          </div>
        ))}
      </div>

      <button style={{
        width: '100%', padding: '14px', borderRadius: 12,
        background: '#fee2e2', color: ACCENT, border: 'none',
        fontSize: 14, fontWeight: 600, cursor: 'pointer',
      }}>
        Déconnexion
      </button>
    </div>
  )
}

export default function DriverAppEnhanced() {
  const [tab, setTab] = useState('home')

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: BG, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        background: DARK, padding: '12px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#fff', fontSize: 14, fontWeight: 600,
      }}>
        <span>LiviGo Conducteur</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
          <span style={{ fontSize: 12 }}>En ligne</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {tab === 'home' && <HomeTab onNavigate={setTab} />}
        {tab === 'earnings' && <EarningsTab />}
        {tab === 'history' && <HistoryTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>

      <div style={{
        background: '#fff', borderTop: '1px solid #e2e8f0',
        display: 'flex', padding: '4px 0 8px',
      }}>
        <BottomTab icon={<FiHome size={20} />} label="Accueil" active={tab === 'home'} onClick={() => setTab('home')} />
        <BottomTab icon={<FiDollarSign size={20} />} label="Gains" active={tab === 'earnings'} onClick={() => setTab('earnings')} />
        <BottomTab icon={<FiList size={20} />} label="Historique" active={tab === 'history'} onClick={() => setTab('history')} />
        <BottomTab icon={<FiUser size={20} />} label="Profil" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}
