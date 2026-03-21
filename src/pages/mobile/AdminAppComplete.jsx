import { useEffect, useState } from 'react'
import { FiHome, FiUsers, FiMap, FiDollarSign, FiSettings, FiTrendingUp, FiActivity, FiAlertCircle, FiCheckCircle, FiClock, FiArrowUp, FiArrowDown, FiSearch, FiFilter, FiMoreVertical, FiPhone, FiMessageSquare, FiNavigation, FiLogOut } from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdDeliveryDining, MdOutlineDashboard } from 'react-icons/md'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

const ACCENT = '#3b82f6'
const DARK = '#1e293b'
const BG = '#f8fafc'
const GREEN = '#22c55e'
const ORANGE = '#f59e0b'
const RED = '#ef4444'

const MOCK_DATA = {
  stats: {
    todayRides: 156,
    activeDrivers: 42,
    revenue: '2.4M FCFA',
    pendingIssues: 3,
    trend: '+12%',
    weeklyRevenue: [1.8, 2.1, 1.9, 2.4, 2.2, 2.8, 2.4]
  },
  drivers: [
    { id: 1, name: 'Amadou Diallo', status: 'online', rating: 4.8, rides: 12, phone: '+221 77 123 45 67', location: [14.7167, -17.4677] },
    { id: 2, name: 'Fatou Ndiaye', status: 'busy', rating: 4.9, rides: 8, phone: '+221 77 234 56 78', location: [14.73, -17.45] },
    { id: 3, name: 'Ibrahima Fall', status: 'offline', rating: 4.6, rides: 0, phone: '+221 77 345 67 89', location: [14.70, -17.48] },
    { id: 4, name: 'Mariama Sow', status: 'online', rating: 4.7, rides: 15, phone: '+221 77 456 78 90', location: [14.72, -17.46] },
  ],
  recentRides: [
    { id: 'LIV-2849', client: 'Aïcha D.', driver: 'Amadou D.', from: 'Médina', to: 'Plateau', price: 1200, status: 'completed', time: '2 min' },
    { id: 'LIV-2848', client: 'Omar K.', driver: 'Fatou N.', from: 'Ouakam', to: 'Almadies', price: 2000, status: 'in_progress', time: '5 min' },
    { id: 'LIV-2847', client: 'Sophie L.', driver: 'Mariama S.', from: 'Yoff', to: 'Médina', price: 1000, status: 'completed', time: '12 min' },
    { id: 'LIV-2846', client: 'Jean B.', driver: 'Amadou D.', from: 'Plateau', to: 'Ouakam', price: 1500, status: 'cancelled', time: '15 min' },
  ],
  alerts: [
    { id: 1, type: 'sos', message: 'SOS reçu de Fatou Ndiaye', time: '2 min', priority: 'high' },
    { id: 2, type: 'payment', message: 'Échec paiement course LIV-2845', time: '5 min', priority: 'medium' },
    { id: 3, type: 'document', message: 'Permis expiré - Ibrahima F.', time: '1h', priority: 'low' },
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

function StatCard({ title, value, trend, trendUp, icon, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}20`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: color
        }}>{icon}</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          color: trendUp ? GREEN : RED, fontSize: 11, fontWeight: 600
        }}>
          {trendUp ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
          {trend}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: DARK }}>{value}</div>
    </div>
  )
}

// Dashboard
function DashboardTab() {
  const data = MOCK_DATA.stats

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Bonjour,</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Administrateur</div>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#fff', border: 'none', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <FiSettings size={20} color={DARK} />
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <StatCard
          title="Courses aujourd'hui"
          value={data.todayRides}
          trend="12%"
          trendUp={true}
          icon={<MdOutlineLocalTaxi size={20} />}
          color={ACCENT}
        />
        <StatCard
          title="Chauffeurs actifs"
          value={data.activeDrivers}
          trend="5%"
          trendUp={true}
          icon={<FiUsers size={20} />}
          color={GREEN}
        />
        <StatCard
          title="Revenus"
          value={data.revenue}
          trend="8%"
          trendUp={true}
          icon={<FiDollarSign size={20} />}
          color={ORANGE}
        />
        <StatCard
          title="Problèmes"
          value={data.pendingIssues}
          trend="2"
          trendUp={false}
          icon={<FiAlertCircle size={20} />}
          color={RED}
        />
      </div>

      {/* Alertes */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Alertes récentes</div>
        {MOCK_DATA.alerts.map(alert => (
          <div key={alert.id} style={{
            background: alert.priority === 'high' ? '#fef2f2' : alert.priority === 'medium' ? '#fffbeb' : '#f0f9ff',
            borderRadius: 12, padding: 12, marginBottom: 8,
            borderLeft: `3px solid ${alert.priority === 'high' ? RED : alert.priority === 'medium' ? ORANGE : ACCENT}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{alert.message}</div>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>{alert.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dernières courses */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Dernières courses</div>
        {MOCK_DATA.recentRides.map(ride => (
          <div key={ride.id} style={{
            background: '#fff', borderRadius: 12, padding: 12, marginBottom: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{ride.id}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{ride.client} → {ride.driver}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{ride.from} → {ride.to}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{ride.price} FCFA</div>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: ride.status === 'completed' ? '#dcfce7' : ride.status === 'in_progress' ? '#dbeafe' : '#fee2e2',
                color: ride.status === 'completed' ? GREEN : ride.status === 'in_progress' ? ACCENT : RED
              }}>
                {ride.status === 'completed' ? 'Terminée' : ride.status === 'in_progress' ? 'En cours' : 'Annulée'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Carte en temps réel
function MapTab() {
  const [filter, setFilter] = useState('all')

  const drivers = MOCK_DATA.drivers.filter(d => filter === 'all' || d.status === filter)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Filtres */}
      <div style={{
        padding: '12px 16px', background: '#fff',
        display: 'flex', gap: 8, overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: 'Tous' },
          { id: 'online', label: 'En ligne' },
          { id: 'busy', label: 'En course' },
          { id: 'offline', label: 'Hors ligne' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              background: filter === f.id ? ACCENT : '#f1f5f9',
              color: filter === f.id ? '#fff' : '#64748b',
              border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Carte */}
      <div style={{ flex: 1 }}>
        <MapContainer center={[14.7167, -17.4677]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {drivers.map(driver => (
            <Marker key={driver.id} position={driver.location}>
              <Popup>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{driver.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>★ {driver.rating}</div>
                <div style={{
                  fontSize: 10, marginTop: 4,
                  color: driver.status === 'online' ? GREEN : driver.status === 'busy' ? ORANGE : '#94a3b8'
                }}>
                  {driver.status === 'online' ? 'En ligne' : driver.status === 'busy' ? 'En course' : 'Hors ligne'}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Liste des chauffeurs */}
      <div style={{
        background: '#fff', borderRadius: '20px 20px 0 0',
        padding: '16px', maxHeight: '40%', overflow: 'auto',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          Chauffeurs ({drivers.length})
        </div>
        {drivers.map(driver => (
          <div key={driver.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px', background: BG, borderRadius: 12, marginBottom: 8
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: driver.status === 'online' ? GREEN : driver.status === 'busy' ? ORANGE : '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 14, fontWeight: 700
            }}>{driver.name.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{driver.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>★ {driver.rating} • {driver.rides} courses</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#dbeafe', border: 'none', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}><FiPhone size={14} color={ACCENT} /></button>
              <button style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#dcfce7', border: 'none', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}><FiNavigation size={14} color={GREEN} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Gestion chauffeurs
function DriversTab() {
  const [search, setSearch] = useState('')

  const filteredDrivers = MOCK_DATA.drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Chauffeurs</div>

      {/* Recherche */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        background: '#fff', borderRadius: 12, marginBottom: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <FiSearch size={20} color="#94a3b8" />
        <input
          type="text"
          placeholder="Rechercher un chauffeur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', fontSize: 14, outline: 'none' }}
        />
        <FiFilter size={20} color="#94a3b8" />
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total', value: 48, color: DARK },
          { label: 'En ligne', value: 12, color: GREEN },
          { label: 'En attente', value: 3, color: ORANGE }
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, background: '#fff', borderRadius: 12, padding: 12, textAlign: 'center'
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      {filteredDrivers.map(driver => (
        <div key={driver.id} style={{
          background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: driver.status === 'online' ? GREEN : driver.status === 'busy' ? ORANGE : '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16, fontWeight: 700
            }}>{driver.name.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{driver.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{driver.phone}</div>
            </div>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <FiMoreVertical size={20} color="#94a3b8" />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{
              flex: 1, padding: '6px 12px', borderRadius: 8,
              background: driver.status === 'online' ? '#dcfce7' : driver.status === 'busy' ? '#fef3c7' : '#f1f5f9',
              color: driver.status === 'online' ? GREEN : driver.status === 'busy' ? ORANGE : '#64748b',
              fontSize: 11, fontWeight: 600, textAlign: 'center'
            }}>
              {driver.status === 'online' ? 'En ligne' : driver.status === 'busy' ? 'En course' : 'Hors ligne'}
            </span>
            <span style={{
              flex: 1, padding: '6px 12px', borderRadius: 8,
              background: '#dbeafe', color: ACCENT,
              fontSize: 11, fontWeight: 600, textAlign: 'center'
            }}>★ {driver.rating}</span>
            <span style={{
              flex: 1, padding: '6px 12px', borderRadius: 8,
              background: '#f3e8ff', color: '#7c3aed',
              fontSize: 11, fontWeight: 600, textAlign: 'center'
            }}>{driver.rides} courses</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Paramètres
function SettingsTab() {
  const menuItems = [
    { icon: <FiUsers size={20} />, label: 'Gestion utilisateurs', desc: 'Chauffeurs et clients' },
    { icon: <FiDollarSign size={20} />, label: 'Tarification', desc: 'Modifier les prix' },
    { icon: <FiMap size={20} />, label: 'Zones de service', desc: 'Définir les zones' },
    { icon: <FiActivity size={20} />, label: 'Rapports', desc: 'Statistiques détaillées' },
    { icon: <FiAlertCircle size={20} />, label: 'Support', desc: 'Tickets et problèmes' },
  ]

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Paramètres</div>

      {menuItems.map((item, i) => (
        <button key={i} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px', background: '#fff', borderRadius: 12,
          border: 'none', marginBottom: 8, cursor: 'pointer', textAlign: 'left'
        }}>
          <span style={{ color: ACCENT }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{item.desc}</div>
          </div>
        </button>
      ))}

      <button style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px', background: '#fef2f2', borderRadius: 12,
        border: 'none', marginTop: 20, cursor: 'pointer', color: RED
      }}>
        <FiLogOut size={20} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>Déconnexion</span>
      </button>
    </div>
  )
}

export default function AdminAppComplete() {
  const [tab, setTab] = useState('dashboard')
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return (
      <div style={{
        minHeight: '100vh', background: `linear-gradient(135deg, ${ACCENT}, #1d4ed8)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, color: '#fff', textAlign: 'center'
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: 'rgba(255,255,255,0.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 24
        }}>
          <MdOutlineDashboard size={50} />
        </div>
        <h1 style={{ fontSize: 36, margin: 0 }}>LiviGo</h1>
        <p style={{ fontSize: 16, opacity: 0.9, marginTop: 8 }}>Administration</p>
        <button
          onClick={() => setShowSplash(false)}
          style={{
            marginTop: 40, padding: '16px 48px', borderRadius: 30,
            background: '#fff', color: ACCENT, border: 'none',
            fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}
        >Accéder</button>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: BG, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'map' && <MapTab />}
        {tab === 'drivers' && <DriversTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>

      <div style={{
        background: '#fff', borderTop: '1px solid #e2e8f0',
        display: 'flex', padding: '4px 0 8px',
      }}>
        <BottomTab icon={<MdOutlineDashboard size={22} />} label="Dashboard" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} badge={0} />
        <BottomTab icon={<FiMap size={22} />} label="Carte" active={tab === 'map'} onClick={() => setTab('map')} badge={0} />
        <BottomTab icon={<FiUsers size={22} />} label="Chauffeurs" active={tab === 'drivers'} onClick={() => setTab('drivers')} badge={0} />
        <BottomTab icon={<FiSettings size={22} />} label="Paramètres" active={tab === 'settings'} onClick={() => setTab('settings')} badge={0} />
      </div>
    </div>
  )
}
