import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiRefreshCw, FiSearch, FiTruck, FiUsers, FiWifi, FiMapPin, FiStar, FiPhone } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MOCK_DRIVERS = [
  { id: 1, name: 'Moussa Diallo', vehicle: 'Moto', plate: 'DK-2341-A', status: 'on_ride', lat: 14.6937, lon: -17.4441, rating: 4.8, phone: '+221 77 123 45 67', client: 'Fatou Ba', destination: 'Almadies' },
  { id: 2, name: 'Ibrahima Sow', vehicle: 'Taxi', plate: 'DK-1892-B', status: 'available', lat: 14.7167, lon: -17.4677, rating: 4.6, phone: '+221 76 234 56 78', client: null, destination: null },
  { id: 3, name: 'Cheikh Ndiaye', vehicle: 'Moto', plate: 'DK-3456-C', status: 'on_ride', lat: 14.7295, lon: -17.4728, rating: 4.9, phone: '+221 77 345 67 89', client: 'Aminata Diop', destination: 'Plateau' },
  { id: 4, name: 'Oumar Fall', vehicle: 'Taxi', plate: 'DK-8821-D', status: 'available', lat: 14.6847, lon: -17.4738, rating: 4.5, phone: '+221 78 456 78 90', client: null, destination: null },
  { id: 5, name: 'Lamine Gaye', vehicle: 'Moto', plate: 'DK-5543-E', status: 'offline', lat: 14.6780, lon: -17.4380, rating: 4.3, phone: '+221 77 567 89 01', client: null, destination: null },
  { id: 6, name: 'Abdou Mbaye', vehicle: 'Taxi', plate: 'DK-7712-F', status: 'on_ride', lat: 14.7609, lon: -17.3655, rating: 4.7, phone: '+221 76 678 90 12', client: 'Rokhaya Ciss', destination: 'Medina' },
  { id: 7, name: 'Babacar Diop', vehicle: 'Moto', plate: 'DK-4490-G', status: 'available', lat: 14.6705, lon: -17.4459, rating: 4.8, phone: '+221 77 789 01 23', client: null, destination: null },
  { id: 8, name: 'Mamadou Sy', vehicle: 'Taxi', plate: 'DK-2278-H', status: 'on_ride', lat: 14.7040, lon: -17.4520, rating: 4.6, phone: '+221 78 890 12 34', client: 'Ndèye Sarr', destination: 'Parcelles' },
]

const STATUS_COLOR = { on_ride: '#4680ff', available: '#22c55e', offline: '#94a3b8' }
const STATUS_LABEL = { on_ride: 'En course', available: 'Disponible', offline: 'Hors ligne' }

function driverIcon(status) {
  const color = STATUS_COLOR[status] || '#94a3b8'
  const pulse = status === 'on_ride'
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:36px;height:36px;">
      ${pulse ? `<div style="position:absolute;inset:-4px;border-radius:50%;background:${color};opacity:0.3;animation:ping 1.5s infinite;"></div>` : ''}
      <div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;
        font-size:15px;position:relative;z-index:1;">${status === 'on_ride' ? '🚗' : status === 'available' ? '🏍️' : '⚫'}</div>
      <style>@keyframes ping{0%{transform:scale(1);opacity:.3}70%{transform:scale(1.8);opacity:0}100%{transform:scale(1.8);opacity:0}}</style>
    </div>`,
    iconSize: [36, 36], iconAnchor: [18, 18],
  })
}

function FlyTo({ position }) {
  const map = useMap()
  useEffect(() => { if (position) map.flyTo(position, 15, { duration: 1 }) }, [position])
  return null
}

export default function RealtimeTrackingPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(0)
  const [flyTo, setFlyTo] = useState(null)

  useEffect(() => {
    const t = setInterval(() => setLastUpdate(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const filtered = MOCK_DRIVERS.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    total: MOCK_DRIVERS.filter(d => d.status !== 'offline').length,
    on_ride: MOCK_DRIVERS.filter(d => d.status === 'on_ride').length,
    available: MOCK_DRIVERS.filter(d => d.status === 'available').length,
    offline: MOCK_DRIVERS.filter(d => d.status === 'offline').length,
  }

  const card = (label, value, color, icon) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 20px', flex: 1, minWidth: 130,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
    </div>
  )

  return (
    <div style={{ padding: '24px', background: '#f4f6f9', minHeight: '100vh' }}>
      <PageHeader title="🗺️ Suivi Temps Réel" subtitle="Positions GPS live des conducteurs actifs" />
      <style>{`.leaflet-container{border-radius:14px;}`}</style>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {card('En ligne', counts.total, '#4680ff', null)}
        {card('En course', counts.on_ride, '#4680ff', null)}
        {card('Disponibles', counts.available, '#22c55e', null)}
        {card('Hors ligne', counts.offline, '#94a3b8', null)}
      </div>

      <div style={{ display: 'flex', gap: 16, height: 560 }}>
        {/* Sidebar */}
        <div style={{ width: 300, background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ position: 'relative' }}>
              <FiSearch size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher conducteur…"
                style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8, border: '1px solid #e2e8f0',
                  fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
            {[['all','Tous'],['on_ride','En course'],['available','Dispo']].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: filter === v ? '#4680ff' : '#f1f5f9', color: filter === v ? '#fff' : '#64748b', border: 'none' }}>{l}</button>
            ))}
          </div>
          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(d => (
              <div key={d.id} onClick={() => { setSelected(d); setFlyTo([d.lat, d.lon]) }}
                style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #f8fafc',
                  background: selected?.id === d.id ? '#eff6ff' : 'transparent',
                  transition: 'background 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: STATUS_COLOR[d.status] + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {d.vehicle === 'Moto' ? '🏍️' : '🚗'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{d.plate} · ⭐ {d.rating}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[d.status], flexShrink: 0 }} />
                </div>
                {d.status === 'on_ride' && (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#4680ff', background: '#eff6ff', borderRadius: 6, padding: '3px 8px' }}>
                    → {d.destination} · client: {d.client}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Footer */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'ping 1.5s infinite' }} />
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Mis à jour il y a {lastUpdate}s</span>
            <button onClick={() => setLastUpdate(0)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#4680ff', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FiRefreshCw size={12} /> Actualiser
            </button>
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <MapContainer center={[14.6937, -17.4441]} zoom={12} style={{ width: '100%', height: '100%' }} zoomControl={true}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {flyTo && <FlyTo position={flyTo} />}
            {filtered.map(d => (
              <Marker key={d.id} position={[d.lat, d.lon]} icon={driverIcon(d.status)}
                eventHandlers={{ click: () => { setSelected(d); setFlyTo([d.lat, d.lon]) } }}>
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>{d.vehicle} · {d.plate}</div>
                    <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                      background: STATUS_COLOR[d.status] + '22', color: STATUS_COLOR[d.status], marginBottom: 6 }}>
                      {STATUS_LABEL[d.status]}
                    </div>
                    {d.status === 'on_ride' && <div style={{ fontSize: 12, color: '#4680ff' }}>→ {d.destination}<br/>Client: {d.client}</div>}
                    <div style={{ fontSize: 12, marginTop: 4, color: '#64748b' }}>⭐ {d.rating} · {d.phone}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
