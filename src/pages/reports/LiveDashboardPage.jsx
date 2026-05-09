import { useEffect, useRef, useState, useCallback } from 'react'
import { FiWifi, FiWifiOff, FiActivity, FiTruck, FiUsers, FiRefreshCw, FiMapPin, FiZap } from 'react-icons/fi'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getDriverPositions, subscribeToDriverPositions, subscribeToRideEvents } from '../../services/api/realtimeTrackingService'
import { getAllZonesSurge, getSurgeColor } from '../../services/api/surgePricingService'

// Fix icônes Leaflet (Vite)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_COLOR  = { on_ride: '#4680ff', available: '#22c55e', offline: '#94a3b8' }
const STATUS_LABEL  = { on_ride: 'En course', available: 'Disponible', offline: 'Hors ligne' }

function driverIcon(status, vehicle) {
  const color = STATUS_COLOR[status] || '#94a3b8'
  const emoji = vehicle?.toLowerCase().includes('voiture') ? '🚗' : '🏍️'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:34px;height:34px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;cursor:pointer;
      animation:${status === 'on_ride' ? 'driverpulse 2s infinite' : 'none'};
    ">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function MapUpdater({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => [p.lat, p.lon]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    }
  }, []) // eslint-disable-line
  return null
}

function LiveCounter({ label, value, color, icon, pulse }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '16px 20px',
      boxShadow: pulse ? `0 0 0 4px ${color}30, 0 1px 4px rgba(0,0,0,0.06)` : '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.4s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 900, color, letterSpacing: '-0.03em', transition: 'transform 0.3s', transform: pulse ? 'scale(1.06)' : 'scale(1)' }}>
        {value}
      </div>
    </div>
  )
}

function ActivityFeed({ events }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'livepulse 1.5s infinite' }} />
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Flux d'activité live</h3>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>{events.length} évènements</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {events.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>En attente d'événements…</div>
        ) : events.map((ev, i) => (
          <div key={ev.id || i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '8px 16px',
            background: i === 0 ? '#f0fdf4' : 'transparent',
            borderLeft: i === 0 ? '3px solid #22c55e' : '3px solid transparent',
            transition: 'all 0.4s',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{ev.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{ev.detail}</div>
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0, marginTop: 1 }}>{ev.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SurgeBadges({ zones }) {
  const active = zones.filter(z => z.multiplier > 1)
  if (active.length === 0) return null
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      {active.map(z => (
        <div key={z.zone} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 20,
          background: getSurgeColor(z.multiplier) + '18',
          border: `1px solid ${getSurgeColor(z.multiplier)}40`,
          fontSize: 12, fontWeight: 700, color: getSurgeColor(z.multiplier),
        }}>
          <FiZap size={12} />
          {z.zone} — ×{z.multiplier.toFixed(1)} {z.label ? `(${z.label})` : ''}
        </div>
      ))}
    </div>
  )
}

const NAMES = ['Oumar Sall', 'Ibrahima Ba', 'Fatou Diallo', 'Cheikh Fall', 'Aminata Koné']
const ZONES = ['Dakar Centre', 'Plateau', 'Parcelles', 'Guédiawaye', 'Almadies']
let _evId = 0
function makeEvent(type, data = {}) {
  _evId++
  const now = 'À l\'instant'
  const events = {
    ride_completed: { icon: '✅', title: `Course terminée — ${data.driver || NAMES[Math.floor(Math.random() * NAMES.length)]}`, detail: `${ZONES[Math.floor(Math.random() * ZONES.length)]} → ${ZONES[Math.floor(Math.random() * ZONES.length)]}`, time: now },
    driver_online:  { icon: '🟢', title: `Conducteur en ligne`, detail: `${data.name || NAMES[Math.floor(Math.random() * NAMES.length)]} · ${data.zone || ZONES[Math.floor(Math.random() * ZONES.length)]}`, time: now },
    ride_created:   { icon: '🆕', title: `Nouvelle course créée`, detail: `ID: ${data.id?.slice(0, 8) || 'RID-' + Math.floor(Math.random() * 9999)}`, time: now },
    ride_cancelled: { icon: '❌', title: `Course annulée`, detail: `Raison : ${data.reason || 'conducteur trop loin'}`, time: now },
    sos:            { icon: '🚨', title: `Alerte SOS reçue`, detail: `${data.zone || ZONES[Math.floor(Math.random() * ZONES.length)]}`, time: now },
    cashout:        { icon: '💸', title: `Retrait demandé`, detail: `${data.amount || (Math.random() * 50000 + 5000).toFixed(0)} FCFA`, time: now },
    position:       { icon: '📍', title: `Position mise à jour`, detail: `${data.name || ''} · ${data.zone || ''}`, time: now },
  }
  return { id: _evId, ...(events[type] || events.ride_completed) }
}

export default function LiveDashboardPage() {
  const [positions, setPositions] = useState([])
  const [events, setEvents]       = useState([])
  const [connected, setConnected] = useState(false)
  const [surgeZones, setSurgeZones] = useState([])
  const [counts, setCounts]       = useState({ drivers: 0, rides: 0, users: 0 })
  const [pulseKey, setPulseKey]   = useState({})
  const [mapReady, setMapReady]   = useState(false)
  const posRef = useRef({})

  const addEvent = useCallback((ev) => {
    setEvents(prev => [ev, ...prev].slice(0, 40))
  }, [])

  const pulse = useCallback((key) => {
    setPulseKey(p => ({ ...p, [key]: true }))
    setTimeout(() => setPulseKey(p => ({ ...p, [key]: false })), 800)
  }, [])

  // Chargement initial
  useEffect(() => {
    getDriverPositions().then(data => {
      setPositions(data)
      data.forEach(d => { posRef.current[d.id] = d })
      const online = data.filter(d => d.status !== 'offline').length
      const onRide = data.filter(d => d.status === 'on_ride').length
      setCounts({ drivers: online, rides: onRide, users: Math.floor(online * 3.5) })
      setMapReady(true)

      // Seed événements
      const seed = data.slice(0, 5).map((d, i) => ({
        ...makeEvent('driver_online', d),
        time: `il y a ${(i + 1) * 2} min`,
      }))
      setEvents(seed)
    })

    getAllZonesSurge().then(setSurgeZones)
  }, [])

  // Suivi temps réel positions
  useEffect(() => {
    const cleanup = subscribeToDriverPositions((update) => {
      setConnected(true)
      posRef.current[update.driverId] = { ...posRef.current[update.driverId], ...update, id: update.driverId }
      setPositions(Object.values(posRef.current))
      addEvent(makeEvent('position', { name: update.name, zone: update.zone }))
      pulse('drivers')
    })
    return cleanup
  }, [addEvent, pulse])

  // Suivi événements courses
  useEffect(() => {
    const cleanup = subscribeToRideEvents(({ type, ride }) => {
      setConnected(true)
      if (type === 'INSERT') {
        addEvent(makeEvent('ride_created', { id: ride.id }))
        setCounts(c => ({ ...c, rides: c.rides + 1 }))
        pulse('rides')
      } else if (ride?.status === 'completed') {
        addEvent(makeEvent('ride_completed', {}))
        setCounts(c => ({ ...c, rides: Math.max(0, c.rides - 1) }))
        pulse('rides')
      } else if (ride?.status === 'cancelled') {
        addEvent(makeEvent('ride_cancelled', {}))
        setCounts(c => ({ ...c, rides: Math.max(0, c.rides - 1) }))
      }
    })
    return cleanup
  }, [addEvent, pulse])

  // Simulation quand hors ligne (pas Supabase)
  useEffect(() => {
    if (connected) return
    const interval = setInterval(() => {
      const types = ['ride_completed', 'driver_online', 'cashout']
      addEvent(makeEvent(types[Math.floor(Math.random() * types.length)]))
      setCounts(c => ({
        drivers: Math.max(2, c.drivers + (Math.random() > 0.5 ? 1 : -1)),
        rides:   Math.max(0, c.rides + (Math.random() > 0.4 ? 1 : -1)),
        users:   Math.max(5, c.users + Math.round((Math.random() - 0.5) * 4)),
      }))
      pulse(Math.random() > 0.5 ? 'drivers' : 'rides')
    }, 3500)
    return () => clearInterval(interval)
  }, [connected, addEvent, pulse])

  const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }
        @keyframes driverpulse { 0%,100%{box-shadow:0 2px 8px rgba(0,0,0,.3)} 50%{box-shadow:0 0 0 8px rgba(70,128,255,.2),0 2px 8px rgba(0,0,0,.3)} }
      `}</style>

      {/* Bandeau connexion */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: connected ? '#f0fdf4' : '#fffbeb',
        border: `1px solid ${connected ? '#86efac' : '#fde68a'}`,
        borderRadius: 10, padding: '10px 16px',
        fontSize: 13, fontWeight: 600,
        color: connected ? '#166534' : '#92400e',
      }}>
        {connected ? <FiWifi size={14} /> : <FiWifiOff size={14} />}
        {connected
          ? '🟢 Connecté — Données Supabase Realtime en direct'
          : '🟡 Mode simulation — Connectez Supabase pour les données réelles'}
        <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiRefreshCw size={10} /> {now}
        </span>
      </div>

      {/* Surge actif */}
      <SurgeBadges zones={surgeZones} />

      {/* Compteurs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <LiveCounter label="Conducteurs en ligne" value={counts.drivers} color="#22c55e" icon={<FiTruck size={16} />} pulse={!!pulseKey.drivers} />
        <LiveCounter label="Courses actives"       value={counts.rides}   color="#4680ff" icon={<FiActivity size={16} />} pulse={!!pulseKey.rides} />
        <LiveCounter label="Utilisateurs connectés"value={counts.users}   color="#a855f7" icon={<FiUsers size={16} />} pulse={false} />
      </div>

      {/* Carte + flux côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, minHeight: 480 }}>

        {/* Carte Leaflet temps réel */}
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 10, left: 10, zIndex: 1000,
            background: 'rgba(255,255,255,0.95)', borderRadius: 8,
            padding: '6px 12px', fontSize: 11, fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <FiMapPin size={12} color="#4680ff" />
            Suivi en temps réel
            <span style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
              {Object.entries(STATUS_COLOR).map(([s, c]) => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#64748b' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
                  {STATUS_LABEL[s]}
                </span>
              ))}
            </span>
          </div>

          {mapReady && (
            <MapContainer
              center={[14.6937, -17.4441]}
              zoom={12}
              style={{ height: '480px', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapUpdater positions={positions.filter(p => p.lat && p.lon)} />
              {positions.filter(p => p.lat && p.lon && p.status !== 'offline').map(d => (
                <Marker key={d.id} position={[d.lat, d.lon]} icon={driverIcon(d.status, d.vehicle)}>
                  <Popup>
                    <div style={{ minWidth: 160 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{d.vehicle} · {d.zone}</div>
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          background: STATUS_COLOR[d.status] + '20',
                          color: STATUS_COLOR[d.status],
                          padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                        }}>
                          {STATUS_LABEL[d.status]}
                        </span>
                        {d.rating && <span style={{ fontSize: 11, color: '#f59e0b' }}>⭐ {d.rating}</span>}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Flux d'activité */}
        <ActivityFeed events={events} />
      </div>

      {/* Légende zones surge */}
      {surgeZones.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiZap size={14} color="#f59e0b" /> Surge pricing par zone
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
            {surgeZones.map(z => (
              <div key={z.zone} style={{
                padding: '8px 12px', borderRadius: 8,
                background: getSurgeColor(z.multiplier) + '12',
                border: `1px solid ${getSurgeColor(z.multiplier)}30`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{z.zone}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Demande: {z.demand}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: getSurgeColor(z.multiplier) }}>×{z.multiplier.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
