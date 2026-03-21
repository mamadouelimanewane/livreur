import { useEffect, useState, useRef } from 'react'
import { 
  FiHome, FiUsers, FiMap, FiDollarSign, FiSettings, FiTrendingUp, FiActivity, 
  FiAlertCircle, FiCheckCircle, FiClock, FiArrowUp, FiArrowDown, FiSearch, 
  FiFilter, FiMoreVertical, FiPhone, FiMessageSquare, FiNavigation, FiLogOut,
  FiBarChart2, FiPieChart, FiCalendar, FiDownload, FiPrinter, FiEye, FiEdit2,
  FiTrash2, FiPlus, FiX, FiChevronDown, FiChevronRight, FiMenu, FiBell,
  FiShield, FiStar, FiTruck, FiPackage, FiCreditCard, FiSmartphone, FiMail,
  FiMapPin, FiUserCheck, FiUserX, FiRefreshCw, FiLayers, FiTool, FiFileText,
  FiImage, FiCamera, FiLock, FiUnlock, FiPower, FiRadio, FiZap
} from 'react-icons/fi'
import { 
  MdOutlineLocalTaxi, MdDeliveryDining, MdOutlineDashboard, MdAdminPanelSettings,
  MdOutlineRestaurant, MdOutlineShoppingBag, MdPeopleOutline, MdOutlineAnalytics,
  MdOutlinePayment, MdOutlineSettings, MdOutlineSupportAgent, MdCampaign,
  MdOutlineVerifiedUser, MdOutlineWarning, MdOutlineCancel, MdOutlineCheckCircle,
  MdPendingActions, MdOutlineTimer, MdSpeed, MdLocationOn, MdOutlineMap
} from 'react-icons/md'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
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
const PINK = '#ec4899'

// Icônes personnalisées
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

// Données mock complètes
const MOCK_DATA = {
  stats: {
    todayRides: 156,
    activeDrivers: 42,
    revenue: '2.4M FCFA',
    pendingIssues: 3,
    newUsers: 28,
    completionRate: '94%',
    avgRating: 4.7,
    trend: '+12%',
    weeklyRevenue: [1.8, 2.1, 1.9, 2.4, 2.2, 2.8, 2.4],
    monthlyRevenue: [45, 52, 48, 61, 55, 72, 58, 65, 70, 68, 75, 82]
  },
  drivers: [
    { id: 1, name: 'Amadou Diallo', status: 'online', rating: 4.8, rides: 12, phone: '+221 77 123 45 67', location: [14.7167, -17.4677], vehicle: 'Moto Yamaha', plate: 'DK-2023-A', earnings: '45 000', joined: '2023' },
    { id: 2, name: 'Fatou Ndiaye', status: 'busy', rating: 4.9, rides: 8, phone: '+221 77 234 56 78', location: [14.73, -17.45], vehicle: 'Moto Honda', plate: 'DK-2022-B', earnings: '38 500', joined: '2023' },
    { id: 3, name: 'Ibrahima Fall', status: 'offline', rating: 4.6, rides: 0, phone: '+221 77 345 67 89', location: [14.70, -17.48], vehicle: 'Moto TVS', plate: 'DK-2021-C', earnings: '28 000', joined: '2022' },
    { id: 4, name: 'Mariama Sow', status: 'online', rating: 4.7, rides: 15, phone: '+221 77 456 78 90', location: [14.72, -17.46], vehicle: 'Moto Suzuki', plate: 'DK-2023-D', earnings: '52 000', joined: '2024' },
    { id: 5, name: 'Omar Sy', status: 'online', rating: 4.5, rides: 6, phone: '+221 77 567 89 01', location: [14.71, -17.47], vehicle: 'Moto Yamaha', plate: 'DK-2023-E', earnings: '32 000', joined: '2024' },
  ],
  users: [
    { id: 1, name: 'Aïcha Diallo', phone: '+221 77 888 99 00', rides: 47, rating: 4.9, status: 'active', joined: 'Jan 2024' },
    { id: 2, name: 'Jean Dupont', phone: '+221 77 777 88 99', rides: 23, rating: 4.7, status: 'active', joined: 'Fév 2024' },
    { id: 3, name: 'Moussa Kane', phone: '+221 77 666 77 88', rides: 12, rating: 4.5, status: 'blocked', joined: 'Déc 2023' },
    { id: 4, name: 'Sophie Martin', phone: '+221 77 555 66 77', rides: 8, rating: 4.8, status: 'active', joined: 'Mar 2024' },
  ],
  recentRides: [
    { id: 'LIV-2849', client: 'Aïcha D.', driver: 'Amadou D.', from: 'Médina', to: 'Plateau', price: 1200, status: 'completed', time: '2 min', type: 'taxi', payment: 'Orange Money' },
    { id: 'LIV-2848', client: 'Omar K.', driver: 'Fatou N.', from: 'Ouakam', to: 'Almadies', price: 2000, status: 'in_progress', time: '5 min', type: 'delivery', payment: 'Espèces' },
    { id: 'LIV-2847', client: 'Sophie L.', driver: 'Mariama S.', from: 'Yoff', to: 'Médina', price: 1000, status: 'completed', time: '12 min', type: 'taxi', payment: 'Wave' },
    { id: 'LIV-2846', client: 'Jean B.', driver: 'Amadou D.', from: 'Plateau', to: 'Ouakam', price: 1500, status: 'cancelled', time: '15 min', type: 'taxi', payment: '-' },
    { id: 'LIV-2845', client: 'Fatou N.', driver: 'Omar S.', from: 'Liberté 6', to: 'Sicap', price: 800, status: 'in_progress', time: '18 min', type: 'taxi', payment: 'Carte' },
  ],
  alerts: [
    { id: 1, type: 'sos', message: 'SOS reçu de Fatou Ndiaye', time: '2 min', priority: 'high', location: 'Médina' },
    { id: 2, type: 'payment', message: 'Échec paiement course LIV-2845', time: '5 min', priority: 'medium', amount: '2000 FCFA' },
    { id: 3, type: 'document', message: 'Permis expiré - Ibrahima F.', time: '1h', priority: 'low' },
    { id: 4, type: 'dispute', message: 'Litige client - Course LIV-2840', time: '2h', priority: 'high' },
  ],
  services: [
    { id: 'taxi', name: 'Moto Taxi', icon: 'taxi', active: true, basePrice: 500, perKm: 150 },
    { id: 'delivery', name: 'Livraison', icon: 'delivery', active: true, basePrice: 800, perKm: 200 },
    { id: 'premium', name: 'Premium', icon: 'premium', active: false, basePrice: 1000, perKm: 300 },
  ],
  zones: [
    { id: 1, name: 'Dakar Centre', active: true, drivers: 25 },
    { id: 2, name: 'Pikine', active: true, drivers: 12 },
    { id: 3, name: 'Rufisque', active: false, drivers: 0 },
    { id: 4, name: 'Almadies', active: true, drivers: 8 },
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

function StatCard({ title, value, trend, trendUp, icon, color, subtitle }) {
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
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 2,
            color: trendUp ? GREEN : RED, fontSize: 11, fontWeight: 600
          }}>
            {trendUp ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: DARK }}>{value}</div>
      {subtitle && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{subtitle}</div>}
    </div>
  )
}

// Graphique simple en barres
function BarChart({ data, color }) {
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
      {data.map((val, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(val / max) * 100}%`,
          background: color,
          borderRadius: '4px 4px 0 0',
          minHeight: 4
        }} />
      ))}
    </div>
  )
}

// Dashboard Complet
function DashboardTab() {
  const data = MOCK_DATA.stats
  const [timeRange, setTimeRange] = useState('week')

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Tableau de bord</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Vue d'ensemble</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['day', 'week', 'month'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '6px 12px', borderRadius: 8,
                background: timeRange === range ? ACCENT : '#f1f5f9',
                color: timeRange === range ? '#fff' : '#64748b',
                border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer'
              }}
            >
              {range === 'day' ? 'Jour' : range === 'week' ? 'Semaine' : 'Mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <StatCard
          title="Courses"
          value={data.todayRides}
          trend="+12%"
          trendUp={true}
          icon={<MdOutlineLocalTaxi size={20} />}
          color={ACCENT}
          subtitle="Aujourd'hui"
        />
        <StatCard
          title="Chauffeurs"
          value={data.activeDrivers}
          trend="+5%"
          trendUp={true}
          icon={<FiUsers size={20} />}
          color={GREEN}
          subtitle="En ligne"
        />
        <StatCard
          title="Revenus"
          value={data.revenue}
          trend="+8%"
          trendUp={true}
          icon={<FiDollarSign size={20} />}
          color={ORANGE}
          subtitle="Ce mois"
        />
        <StatCard
          title="Note moy."
          value={data.avgRating}
          trend="+0.2"
          trendUp={true}
          icon={<FiStar size={20} />}
          color={PURPLE}
          subtitle="Sur 5"
        />
      </div>

      {/* Graphique des revenus */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Évolution des revenus</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '4px 8px', borderRadius: 6, background: '#f1f5f9', border: 'none', fontSize: 10 }}>
              <FiDownload size={12} />
            </button>
          </div>
        </div>
        <BarChart data={timeRange === 'week' ? data.weeklyRevenue : data.monthlyRevenue.slice(-7)} color={ACCENT} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {(timeRange === 'week' ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] : ['J-6', 'J-5', 'J-4', 'J-3', 'J-2', 'J-1', 'Auj']).map((day, i) => (
            <span key={i} style={{ fontSize: 10, color: '#94a3b8' }}>{day}</span>
          ))}
        </div>
      </div>

      {/* Alertes */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Alertes ({MOCK_DATA.alerts.length})</div>
          <button style={{ fontSize: 11, color: ACCENT }}>Voir tout</button>
        </div>
        {MOCK_DATA.alerts.map(alert => (
          <div key={alert.id} style={{
            background: alert.priority === 'high' ? '#fef2f2' : alert.priority === 'medium' ? '#fffbeb' : '#f0f9ff',
            borderRadius: 12, padding: 12, marginBottom: 8,
            borderLeft: `3px solid ${alert.priority === 'high' ? RED : alert.priority === 'medium' ? ORANGE : ACCENT}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {alert.type === 'sos' && <FiAlertCircle size={16} color={RED} />}
                {alert.type === 'payment' && <FiDollarSign size={16} color={ORANGE} />}
                {alert.type === 'document' && <FiFileText size={16} color={ACCENT} />}
                {alert.type === 'dispute' && <FiMessageSquare size={16} color={PURPLE} />}
                <div style={{ fontSize: 13, fontWeight: 600 }}>{alert.message}</div>
              </div>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>{alert.time}</span>
            </div>
            {alert.location && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, marginLeft: 24 }}>
                <FiMapPin size={10} /> {alert.location}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dernières courses */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Dernières courses</div>
          <button style={{ fontSize: 11, color: ACCENT }}>Voir tout</button>
        </div>
        {MOCK_DATA.recentRides.slice(0, 3).map(ride => (
          <div key={ride.id} style={{
            background: '#fff', borderRadius: 12, padding: 12, marginBottom: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{ride.id}</span>
                <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 8,
                  background: ride.type === 'taxi' ? '#dbeafe' : '#dcfce7',
                  color: ride.type === 'taxi' ? ACCENT : GREEN
                }}>{ride.type === 'taxi' ? 'Taxi' : 'Livraison'}</span>
              </div>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: ride.status === 'completed' ? '#dcfce7' : ride.status === 'in_progress' ? '#dbeafe' : '#fee2e2',
                color: ride.status === 'completed' ? GREEN : ride.status === 'in_progress' ? ACCENT : RED
              }}>
                {ride.status === 'completed' ? 'Terminée' : ride.status === 'in_progress' ? 'En cours' : 'Annulée'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{ride.client} → {ride.driver}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{ride.time}</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{ride.price} FCFA</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Carte en temps réel avec tous les chauffeurs
function MapTab() {
  const [filter, setFilter] = useState('all')
  const [selectedDriver, setSelectedDriver] = useState(null)

  const drivers = MOCK_DATA.drivers.filter(d => filter === 'all' || d.status === filter)

  const getIcon = (status) => {
    if (status === 'online') return onlineIcon
    if (status === 'busy') return busyIcon
    return offlineIcon
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Filtres */}
      <div style={{
        padding: '12px 16px', background: '#fff',
        display: 'flex', gap: 8, overflowX: 'auto'
      }}>
        {[
          { id: 'all', label: 'Tous', count: MOCK_DATA.drivers.length },
          { id: 'online', label: 'En ligne', count: MOCK_DATA.drivers.filter(d => d.status === 'online').length },
          { id: 'busy', label: 'En course', count: MOCK_DATA.drivers.filter(d => d.status === 'busy').length },
          { id: 'offline', label: 'Hors ligne', count: MOCK_DATA.drivers.filter(d => d.status === 'offline').length }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              background: filter === f.id ? ACCENT : '#f1f5f9',
              color: filter === f.id ? '#fff' : '#64748b',
              border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            {f.label}
            <span style={{
              background: filter === f.id ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
              padding: '2px 6px', borderRadius: 10, fontSize: 10
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Carte */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={[14.7167, -17.4677]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {drivers.map(driver => (
            <Marker 
              key={driver.id} 
              position={driver.location}
              icon={getIcon(driver.status)}
              eventHandlers={{
                click: () => setSelectedDriver(driver)
              }}
            >
              <Popup>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{driver.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>★ {driver.rating} • {driver.vehicle}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Bouton de localisation */}
        <button style={{
          position: 'absolute', bottom: 16, right: 16,
          width: 44, height: 44, borderRadius: '50%',
          background: '#fff', border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <MdLocationOn size={20} color={ACCENT} />
        </button>
      </div>

      {/* Fiche chauffeur sélectionné */}
      {selectedDriver && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#fff', borderRadius: '20px 20px 0 0',
          padding: '20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: selectedDriver.status === 'online' ? GREEN : selectedDriver.status === 'busy' ? ORANGE : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 18, fontWeight: 700
              }}>{selectedDriver.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selectedDriver.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{selectedDriver.vehicle} • {selectedDriver.plate}</div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedDriver(null)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <FiX size={20} color="#94a3b8" />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              flex: 1, padding: '12px', borderRadius: 10,
              background: '#dbeafe', color: ACCENT, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
              <FiPhone size={16} /> Appeler
            </button>
            <button style={{
              flex: 1, padding: '12px', borderRadius: 10,
              background: '#dcfce7', color: GREEN, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
              <FiMessageSquare size={16} /> Message
            </button>
            <button style={{
              flex: 1, padding: '12px', borderRadius: 10,
              background: '#f3e8ff', color: PURPLE, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
              <FiEye size={16} /> Profil
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Gestion complète des chauffeurs
function DriversTab() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [viewMode, setViewMode] = useState('list')

  const filteredDrivers = MOCK_DATA.drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search)
    const matchesFilter = filter === 'all' || d.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Chauffeurs</div>
        <button style={{
          padding: '8px 16px', borderRadius: 10,
          background: ACCENT, color: '#fff', border: 'none',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <FiPlus size={16} /> Ajouter
        </button>
      </div>

      {/* Recherche et filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
          background: '#fff', borderRadius: 10
        }}>
          <FiSearch size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', fontSize: 14, outline: 'none' }}
          />
        </div>
        <button style={{
          padding: '10px', borderRadius: 10, background: '#fff', border: 'none'
        }}>
          <FiFilter size={18} color="#64748b" />
        </button>
      </div>

      {/* Filtres rapides */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'Tous', color: DARK },
          { id: 'online', label: 'En ligne', color: GREEN },
          { id: 'busy', label: 'En course', color: ORANGE },
          { id: 'offline', label: 'Hors ligne', color: '#94a3b8' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '6px 14px', borderRadius: 20,
              background: filter === f.id ? f.color : '#f1f5f9',
              color: filter === f.id ? '#fff' : '#64748b',
              border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Total', value: 48, color: ACCENT },
          { label: 'Actifs', value: 35, color: GREEN },
          { label: 'En attente', value: 3, color: ORANGE }
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', borderRadius: 10, padding: 12, textAlign: 'center'
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Liste des chauffeurs */}
      {filteredDrivers.map(driver => (
        <div key={driver.id} style={{
          background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12
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
              <div style={{ fontSize: 11, color: '#64748b' }}>{driver.phone}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#dbeafe', border: 'none', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}><FiPhone size={14} color={ACCENT} /></button>
              <button style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#f1f5f9', border: 'none', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}><FiMoreVertical size={14} color="#64748b" /></button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 10px', borderRadius: 8,
              background: driver.status === 'online' ? '#dcfce7' : driver.status === 'busy' ? '#fef3c7' : '#f1f5f9',
              color: driver.status === 'online' ? GREEN : driver.status === 'busy' ? ORANGE : '#64748b',
              fontSize: 10, fontWeight: 600
            }}>
              {driver.status === 'online' ? 'En ligne' : driver.status === 'busy' ? 'En course' : 'Hors ligne'}
            </span>
            <span style={{
              padding: '4px 10px', borderRadius: 8,
              background: '#dbeafe', color: ACCENT,
              fontSize: 10, fontWeight: 600
            }}>★ {driver.rating}</span>
            <span style={{
              padding: '4px 10px', borderRadius: 8,
              background: '#f3e8ff', color: PURPLE,
              fontSize: 10, fontWeight: 600
            }}>{driver.rides} courses</span>
            <span style={{
              padding: '4px 10px', borderRadius: 8,
              background: '#ecfdf5', color: GREEN,
              fontSize: 10, fontWeight: 600
            }}>{driver.earnings} FCFA</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Gestion des utilisateurs/clients
function UsersTab() {
  const [search, setSearch] = useState('')

  const filteredUsers = MOCK_DATA.users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)
  )

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Clients</div>

      {/* Recherche */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        background: '#fff', borderRadius: 12, marginBottom: 16
      }}>
        <FiSearch size={20} color="#94a3b8" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, border: 'none', fontSize: 14, outline: 'none' }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: ACCENT }}>1,247</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Clients totaux</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: GREEN }}>89</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Nouveaux ce mois</div>
        </div>
      </div>

      {/* Liste */}
      {filteredUsers.map(user => (
        <div key={user.id} style={{
          background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: user.status === 'active' ? ACCENT : RED,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16, fontWeight: 700
            }}>{user.name.split(' ').map(n => n[0]).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{user.phone}</div>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: 10,
              background: user.status === 'active' ? '#dcfce7' : '#fee2e2',
              color: user.status === 'active' ? GREEN : RED,
              fontSize: 10, fontWeight: 600
            }}>{user.status === 'active' ? 'Actif' : 'Bloqué'}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{user.rides}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Courses</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>★ {user.rating}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Note</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>{user.joined}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Inscription</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Gestion des courses
function RidesTab() {
  const [filter, setFilter] = useState('all')

  const filteredRides = MOCK_DATA.recentRides.filter(r => filter === 'all' || r.status === filter)

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Courses</div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'Toutes' },
          { id: 'completed', label: 'Terminées' },
          { id: 'in_progress', label: 'En cours' },
          { id: 'cancelled', label: 'Annulées' }
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

      {/* Liste */}
      {filteredRides.map(ride => (
        <div key={ride.id} style={{
          background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{ride.id}</span>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: ride.type === 'taxi' ? '#dbeafe' : '#dcfce7',
                color: ride.type === 'taxi' ? ACCENT : GREEN
              }}>{ride.type === 'taxi' ? 'Taxi' : 'Livraison'}</span>
            </div>
            <span style={{
              fontSize: 10, padding: '4px 10px', borderRadius: 10,
              background: ride.status === 'completed' ? '#dcfce7' : ride.status === 'in_progress' ? '#dbeafe' : '#fee2e2',
              color: ride.status === 'completed' ? GREEN : ride.status === 'in_progress' ? ACCENT : RED,
              fontWeight: 600
            }}>
              {ride.status === 'completed' ? 'Terminée' : ride.status === 'in_progress' ? 'En cours' : 'Annulée'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <FiMapPin size={12} color={GREEN} />
            <span style={{ fontSize: 12, color: '#64748b' }}>{ride.from}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FiNavigation size={12} color={RED} />
            <span style={{ fontSize: 12, color: '#64748b' }}>{ride.to}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{ride.client} → {ride.driver}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{ride.time} • {ride.payment}</div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>{ride.price} FCFA</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Paramètres et configuration
function SettingsTab() {
  const [activeSection, setActiveSection] = useState(null)

  const sections = [
    { id: 'services', icon: <MdOutlineLocalTaxi size={20} />, label: 'Services', desc: 'Gérer les types de courses' },
    { id: 'pricing', icon: <FiDollarSign size={20} />, label: 'Tarification', desc: 'Prix et frais' },
    { id: 'zones', icon: <FiMap size={20} />, label: 'Zones', desc: 'Zones de service' },
    { id: 'promotions', icon: <MdCampaign size={20} />, label: 'Promotions', desc: 'Codes promo et offres' },
    { id: 'payments', icon: <MdOutlinePayment size={20} />, label: 'Paiements', desc: 'Méthodes de paiement' },
    { id: 'notifications', icon: <FiBell size={20} />, label: 'Notifications', desc: 'SMS et push' },
    { id: 'support', icon: <FiMessageSquare size={20} />, label: 'Support', desc: 'Centre d\'aide' },
    { id: 'security', icon: <FiShield size={20} />, label: 'Sécurité', desc: 'Accès et permissions' },
  ]

  if (activeSection === 'services') {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setActiveSection(null)} style={{ border: 'none', background: 'transparent' }}>
            <FiChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Services</div>
        </div>
        {MOCK_DATA.services.map(service => (
          <div key={service.id} style={{
            background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: service.active ? ACCENT : '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff'
                }}>
                  {service.icon === 'taxi' ? <MdOutlineLocalTaxi size={24} /> : <MdDeliveryDining size={24} />}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{service.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{service.active ? 'Actif' : 'Inactif'}</div>
                </div>
              </div>
              <div style={{
                width: 48, height: 26, borderRadius: 13,
                background: service.active ? GREEN : '#e2e8f0',
                position: 'relative', cursor: 'pointer'
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#fff', position: 'absolute',
                  top: 2, left: service.active ? 24 : 2,
                  transition: 'left 0.2s'
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: BG, borderRadius: 8, padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Prix base</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{service.basePrice} FCFA</div>
              </div>
              <div style={{ flex: 1, background: BG, borderRadius: 8, padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Par km</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{service.perKm} FCFA</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activeSection === 'promotions') {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setActiveSection(null)} style={{ border: 'none', background: 'transparent' }}>
            <FiChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Promotions</div>
        </div>
        <button style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: ACCENT, color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 16
        }}>
          <FiPlus size={18} /> Nouvelle promotion
        </button>
        {MOCK_DATA.promotions.map(promo => (
          <div key={promo.id} style={{
            background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT }}>{promo.code}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{promo.desc}</div>
              </div>
              <span style={{
                fontSize: 18, fontWeight: 800, color: GREEN
              }}>{promo.discount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                Utilisé: {promo.usage}/{promo.max}
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: 10,
                background: promo.active ? '#dcfce7' : '#f1f5f9',
                color: promo.active ? GREEN : '#64748b',
                fontSize: 10, fontWeight: 600
              }}>{promo.active ? 'Actif' : 'Inactif'}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Paramètres</div>

      {sections.map(section => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px', background: '#fff', borderRadius: 12,
            border: 'none', marginBottom: 8, cursor: 'pointer', textAlign: 'left'
          }}
        >
          <span style={{ color: ACCENT }}>{section.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{section.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{section.desc}</div>
          </div>
          <FiChevronRight size={18} color="#94a3b8" />
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

export default function AdminAppFull() {
  const [tab, setTab] = useState('dashboard')
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
        <h1 style={{ fontSize: 32, margin: 0 }}>LiviGo</h1>
        <p style={{ fontSize: 16, opacity: 0.7, marginTop: 8 }}>Administration</p>
        <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
          <input
            type="password"
            placeholder="Mot de passe"
            style={{
              padding: '14px 20px', borderRadius: 10,
              border: 'none', fontSize: 14, width: 200,
              background: 'rgba(255,255,255,0.1)', color: '#fff'
            }}
          />
        </div>
        <button
          onClick={() => setShowSplash(false)}
          style={{
            marginTop: 16, padding: '14px 48px', borderRadius: 10,
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
      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'map' && <MapTab />}
        {tab === 'drivers' && <DriversTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'rides' && <RidesTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>

      <div style={{
        background: '#fff', borderTop: '1px solid #e2e8f0',
        display: 'flex', padding: '4px 0 8px',
      }}>
        <BottomTab icon={<MdOutlineDashboard size={20} />} label="Dashboard" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
        <BottomTab icon={<FiMap size={20} />} label="Carte" active={tab === 'map'} onClick={() => setTab('map')} />
        <BottomTab icon={<FiUsers size={20} />} label="Chauffeurs" active={tab === 'drivers'} onClick={() => setTab('drivers')} />
        <BottomTab icon={<MdOutlineLocalTaxi size={20} />} label="Courses" active={tab === 'rides'} onClick={() => setTab('rides')} />
        <BottomTab icon={<FiSettings size={20} />} label="Plus" active={tab === 'settings' || tab === 'users'} onClick={() => setTab('settings')} />
      </div>
    </div>
  )
}
