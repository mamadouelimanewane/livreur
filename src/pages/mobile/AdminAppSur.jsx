import { useState } from 'react'
import { 
  FiHome, FiUsers, FiMap, FiDollarSign, FiSettings, FiTrendingUp, 
  FiAlertCircle, FiCheckCircle, FiClock, FiArrowUp, FiArrowDown, 
  FiSearch, FiFilter, FiMoreVertical, FiPhone, FiMessageSquare, 
  FiNavigation, FiLogOut, FiBarChart2, FiDownload, FiFileText,
  FiCalendar, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiEye,
  FiShield, FiBell, FiMenu, FiX, FiChevronRight, FiChevronDown,
  FiUserCheck, FiUserX, FiActivity, FiZap, FiLayers, FiTool
} from 'react-icons/fi'
import { 
  MdOutlineLocalTaxi, MdDeliveryDining, MdOutlineDashboard,
  MdAdminPanelSettings, MdCampaign, MdOutlinePayment,
  MdOutlineVerifiedUser, MdOutlineWarning, MdPendingActions,
  MdSpeed, MdLocationOn, MdOutlineMap, MdSos
} from 'react-icons/md'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

const ACCENT = '#3b82f6'
const DARK = '#0f172a'
const BG = '#f1f5f9'
const GREEN = '#10b981'
const ORANGE = '#f59e0b'
const RED = '#ef4444'
const PURPLE = '#8b5cf6'

const onlineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
})

const busyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
})

const offlineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
})

const MOCK_DATA = {
  stats: {
    activeUsers: 18,
    activeDrivers: 19,
    countries: 1,
    zones: 2,
    expiringDocs: 0,
    totalEarnings: '3,246.53',
    totalDiscounts: '8',
    taxi: {
      totalRides: 54,
      ongoing: 0,
      cancelled: 3,
      completed: 24,
      autoCancelled: 27,
      earnings: '3,233.09',
      discounts: '0'
    },
    delivery: {
      totalRides: 13,
      ongoing: 0,
      cancelled: 3,
      completed: 7,
      autoCancelled: 3,
      earnings: '13.44',
      discounts: '8'
    }
  },
  drivers: [
    { id: 1, name: 'Amadou Diallo', status: 'online', rating: 4.8, rides: 156, phone: '+221 77 123 45 67', location: [14.7167, -17.4677], vehicle: 'Moto Yamaha', plate: 'DK-2023-A', earnings: '450 000', joined: '2023', docsValid: true },
    { id: 2, name: 'Fatou Ndiaye', status: 'busy', rating: 4.9, rides: 142, phone: '+221 77 234 56 78', location: [14.73, -17.45], vehicle: 'Moto Honda', plate: 'DK-2022-B', earnings: '380 000', joined: '2023', docsValid: true },
    { id: 3, name: 'Ibrahima Fall', status: 'offline', rating: 4.6, rides: 89, phone: '+221 77 345 67 89', location: [14.70, -17.48], vehicle: 'Moto TVS', plate: 'DK-2021-C', earnings: '280 000', joined: '2022', docsValid: false },
    { id: 4, name: 'Mariama Sow', status: 'online', rating: 4.7, rides: 98, phone: '+221 77 456 78 90', location: [14.72, -17.46], vehicle: 'Moto Suzuki', plate: 'DK-2023-D', earnings: '520 000', joined: '2024', docsValid: true },
    { id: 5, name: 'Omar Sy', status: 'pending', rating: 0, rides: 0, phone: '+221 77 567 89 01', location: [14.71, -17.47], vehicle: 'Moto Yamaha', plate: 'DK-2023-E', earnings: '0', joined: '2024', docsValid: false },
  ],
  rides: {
    taxi: [
      { id: 'TX-2849', client: 'Aïcha D.', driver: 'Amadou D.', from: 'Médina', to: 'Plateau', price: 1200, status: 'completed', time: '2 min', payment: 'Orange Money' },
      { id: 'TX-2848', client: 'Omar K.', driver: 'Fatou N.', from: 'Ouakam', to: 'Almadies', price: 2000, status: 'in_progress', time: '5 min', payment: 'Espèces' },
      { id: 'TX-2847', client: 'Sophie L.', driver: 'Mariama S.', from: 'Yoff', to: 'Médina', price: 1000, status: 'completed', time: '12 min', payment: 'Wave' },
      { id: 'TX-2846', client: 'Jean B.', driver: 'Amadou D.', from: 'Plateau', to: 'Ouakam', price: 1500, status: 'cancelled', time: '15 min', payment: '-' },
    ],
    delivery: [
      { id: 'DL-1042', client: 'Restaurant X', driver: 'Fatou N.', from: 'Plateau', to: 'Médina', price: 1500, status: 'completed', time: '25 min', payment: 'Carte' },
      { id: 'DL-1041', client: 'Boutique Y', driver: 'Amadou D.', from: 'Ouakam', to: 'Almadies', price: 2000, status: 'in_progress', time: '15 min', payment: 'Orange Money' },
    ]
  },
  documents: [
    { id: 1, driver: 'Amadou Diallo', type: 'Permis de conduire', expiry: '2025-06-15', status: 'valid', daysLeft: 120 },
    { id: 2, driver: 'Fatou Ndiaye', type: 'Assurance', expiry: '2024-12-20', status: 'warning', daysLeft: 15 },
    { id: 3, driver: 'Ibrahima Fall', type: 'Carte grise', expiry: '2024-11-30', status: 'expired', daysLeft: -5 },
    { id: 4, driver: 'Mariama Sow', type: 'Permis de conduire', expiry: '2025-03-10', status: 'valid', daysLeft: 85 },
  ],
  sos: {
    numbers: [
      { id: 1, name: 'Police', number: '17', icon: '🚔' },
      { id: 2, name: 'Pompiers', number: '18', icon: '🚒' },
      { id: 3, name: 'SAMU', number: '15', icon: '🚑' },
      { id: 4, name: 'Sûreté Urbaine', number: '800 00 20 20', icon: '🛡️' },
    ],
    requests: [
      { id: 1, driver: 'Fatou Ndiaye', type: 'Accident', location: 'Médina, Dakar', time: '5 min', status: 'pending', phone: '+221 77 234 56 78' },
      { id: 2, driver: 'Amadou Diallo', type: 'Panne', location: 'Plateau, Dakar', time: '15 min', status: 'resolved', phone: '+221 77 123 45 67' },
    ]
  },
  zones: [
    { id: 1, name: 'Dakar Centre', active: true, drivers: 25, rides: 450 },
    { id: 2, name: 'Pikine', active: true, drivers: 12, rides: 180 },
    { id: 3, name: 'Rufisque', active: false, drivers: 0, rides: 0 },
    { id: 4, name: 'Almadies', active: true, drivers: 8, rides: 95 },
  ],
  promotions: [
    { id: 1, code: 'BIENVENUE', discount: '20%', type: 'percentage', usage: 45, max: 100, active: true },
    { id: 2, code: 'WEEKEND', discount: '15%', type: 'percentage', usage: 23, max: 50, active: true },
    { id: 3, code: 'FIDELITE', discount: '1000 FCFA', type: 'fixed', usage: 12, max: 200, active: false },
  ]
}

function BottomTab({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '8px 0', border: 'none', cursor: 'pointer', background: 'transparent',
      color: active ? ACCENT : '#94a3b8', transition: 'color 0.2s', position: 'relative'
    }}>
      <span style={{ display: 'flex' }}>{icon}</span>
      {badge > 0 && (
        <span style={{
          position: 'absolute', top: 2, right: '25%',
          width: 16, height: 16, borderRadius: '50%',
          background: RED, color: '#fff', fontSize: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
        }}>{badge}</span>
      )}
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
    </button>
  )
}

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}20`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: color
        }}>{icon}</div>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: DARK }}>{value}</div>
      {subtitle && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>}
    </div>
  )
}

// Dashboard avec stats par service
function DashboardTab() {
  const [serviceView, setServiceView] = useState('all')
  const stats = MOCK_DATA.stats

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Tableau de bord</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Vue d'ensemble</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'taxi', 'delivery'].map(s => (
            <button
              key={s}
              onClick={() => setServiceView(s)}
              style={{
                padding: '6px 12px', borderRadius: 8,
                background: serviceView === s ? ACCENT : '#f1f5f9',
                color: serviceView === s ? '#fff' : '#64748b',
                border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer'
              }}
            >
              {s === 'all' ? 'Global' : s === 'taxi' ? 'Taxi' : 'Livraison'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats globales */}
      {serviceView === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <StatCard title="Utilisateurs" value={stats.activeUsers} icon={<FiUsers size={20} />} color={ACCENT} subtitle="Actifs" />
          <StatCard title="Chauffeurs" value={stats.activeDrivers} icon={<MdOutlineLocalTaxi size={20} />} color={GREEN} subtitle="En ligne" />
          <StatCard title="Gains" value={stats.totalEarnings} icon={<FiDollarSign size={20} />} color={ORANGE} subtitle="Total" />
          <StatCard title="Zones" value={stats.zones} icon={<FiMap size={20} />} color={PURPLE} subtitle="Actives" />
        </div>
      )}

      {/* Stats Taxi */}
      {serviceView === 'taxi' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MdOutlineLocalTaxi size={24} color={ACCENT} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>Moto Taxi</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{stats.taxi.totalRides}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Total courses</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>{stats.taxi.completed}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Terminées</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ORANGE }}>{stats.taxi.cancelled}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Annulées</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: PURPLE }}>{stats.taxi.earnings}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Gains</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Livraison */}
      {serviceView === 'delivery' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MdDeliveryDining size={24} color={GREEN} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>Livraison</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{stats.delivery.totalRides}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Total livraisons</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>{stats.delivery.completed}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Terminées</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: ORANGE }}>{stats.delivery.cancelled}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Annulées</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: BG, borderRadius: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: PURPLE }}>{stats.delivery.earnings}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Gains</div>
            </div>
          </div>
        </div>
      )}

      {/* Alertes */}
      <div style={{ background: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16, borderLeft: `4px solid ${RED}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: RED }}>
          <MdOutlineWarning size={20} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>1 document expiré • 3 en attente d'approbation</span>
        </div>
      </div>

      {/* Raccourcis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { icon: <FiUsers size={20} />, label: 'Chauffeurs', color: ACCENT },
          { icon: <MdOutlineLocalTaxi size={20} />, label: 'Courses', color: GREEN },
          { icon: <FiMap size={20} />, label: 'Carte', color: ORANGE },
          { icon: <MdSos size={20} />, label: 'SOS', color: RED },
        ].map((item, i) => (
          <button key={i} style={{
            background: '#fff', borderRadius: 12, padding: 16,
            border: 'none', cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 8
          }}>
            <span style={{ color: item.color }}>{item.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Menu principal avec toutes les options SÛR
function MainMenu({ onSelect }) {
  const menuItems = [
    { 
      category: 'SETUP OBLIGATOIRE',
      items: [
        { id: 'countries', icon: <FiMapPin size={18} />, label: 'Pays' },
        { id: 'documents', icon: <FiFileText size={18} />, label: 'Documents' },
        { id: 'services', icon: <MdOutlineLocalTaxi size={18} />, label: 'Prestations' },
        { id: 'zones', icon: <FiMap size={18} />, label: 'Zones de service' },
        { id: 'pricing', icon: <FiDollarSign size={18} />, label: 'Carte de prix' },
        { id: 'promotions', icon: <MdCampaign size={18} />, label: 'Code promo' },
      ]
    },
    {
      category: 'GESTION',
      items: [
        { id: 'drivers', icon: <FiUsers size={18} />, label: 'Chauffeurs', badge: 3 },
        { id: 'rides', icon: <MdOutlineLocalTaxi size={18} />, label: 'Courses' },
        { id: 'users', icon: <FiUserCheck size={18} />, label: 'Utilisateurs' },
        { id: 'documents_mgmt', icon: <FiFileText size={18} />, label: 'Documents', badge: 1 },
      ]
    },
    {
      category: 'SUPPORT',
      items: [
        { id: 'sos', icon: <MdSos size={18} />, label: 'SOS', badge: 1 },
        { id: 'support', icon: <FiMessageSquare size={18} />, label: 'Service client' },
      ]
    },
    {
      category: 'RAPPORTS',
      items: [
        { id: 'reports', icon: <FiBarChart2 size={18} />, label: 'Rapports et graphiques' },
        { id: 'map', icon: <FiMap size={18} />, label: 'Carte des chauffeurs' },
      ]
    },
  ]

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Menu</div>
      
      {menuItems.map((section, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>
            {section.category}
          </div>
          {section.items.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', background: '#fff', borderRadius: 12,
                border: 'none', marginBottom: 8, cursor: 'pointer', textAlign: 'left'
              }}
            >
              <span style={{ color: ACCENT }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: RED, color: '#fff', fontSize: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                }}>{item.badge}</span>
              )}
              <FiChevronRight size={16} color="#94a3b8" />
            </button>
          ))}
        </div>
      ))}

      <button style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', background: '#fef2f2', borderRadius: 12,
        border: 'none', cursor: 'pointer', color: RED
      }}>
        <FiLogOut size={18} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Déconnexion</span>
      </button>
    </div>
  )
}

export default function AdminAppSur() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return (
      <div style={{
        minHeight: '100vh', background: `linear-gradient(135deg, ${DARK}, #1e293b)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, color: '#fff', textAlign: 'center'
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: 'rgba(255,255,255,0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 24
        }}>
          <MdAdminPanelSettings size={50} />
        </div>
        <h1 style={{ fontSize: 32, margin: 0 }}>SÛR</h1>
        <p style={{ fontSize: 16, opacity: 0.7, marginTop: 8 }}>Administration</p>
        <div style={{ marginTop: 40, width: '100%', maxWidth: 280 }}>
          <input
            type="email"
            placeholder="Email"
            defaultValue="sur.senegal@gmail.com"
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 10, marginBottom: 12,
              border: 'none', fontSize: 14, background: 'rgba(255,255,255,0.1)', color: '#fff'
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            defaultValue="12345678"
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 10, marginBottom: 16,
              border: 'none', fontSize: 14, background: 'rgba(255,255,255,0.1)', color: '#fff'
            }}
          />
        </div>
        <button
          onClick={() => setShowSplash(false)}
          style={{
            padding: '14px 48px', borderRadius: 10,
            background: ACCENT, color: '#fff', border: 'none',
            fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}
        >Connexion</button>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: BG, display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: DARK, padding: '12px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setCurrentView('menu')} style={{ background: 'transparent', border: 'none', color: '#fff' }}>
            <FiMenu size={24} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 700 }}>SÛR Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Français</span>
          <button style={{ background: 'transparent', border: 'none', color: '#fff' }}>
            <FiBell size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {currentView === 'dashboard' && <DashboardTab />}
        {currentView === 'menu' && <MainMenu onSelect={setCurrentView} />}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        background: '#fff', borderTop: '1px solid #e2e8f0',
        display: 'flex', padding: '4px 0 8px',
      }}>
        <BottomTab icon={<MdOutlineDashboard size={22} />} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
        <BottomTab icon={<FiMap size={22} />} label="Carte" active={currentView === 'map'} onClick={() => setCurrentView('map')} />
        <BottomTab icon={<FiUsers size={22} />} label="Chauffeurs" active={currentView === 'drivers'} onClick={() => setCurrentView('drivers')} badge={3} />
        <BottomTab icon={<FiMenu size={22} />} label="Menu" active={currentView === 'menu'} onClick={() => setCurrentView('menu')} />
      </div>
    </div>
  )
}
