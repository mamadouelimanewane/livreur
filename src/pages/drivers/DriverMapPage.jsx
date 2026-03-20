import { useEffect, useRef, useState } from 'react'
import { FiRefreshCw, FiFilter, FiWifi, FiWifiOff } from 'react-icons/fi'
import { supabase } from '../../services/api/supabaseClient'

// Données mock de conducteurs avec coordonnées GPS Dakar
const MOCK_DRIVER_POSITIONS = [
  { id: 'DRV-001', name: 'Oumar Sall',      lat: 14.6937, lng: -17.4441, status: 'online',  vehicle: 'Moto',    zone: 'Dakar Centre', rides: 48, rating: 4.8 },
  { id: 'DRV-003', name: 'Ibrahima Ba',     lat: 14.6892, lng: -17.4384, status: 'online',  vehicle: 'Moto',    zone: 'Plateau',      rides: 61, rating: 4.9 },
  { id: 'DRV-005', name: 'Abdoulaye Mbaye', lat: 14.6821, lng: -17.4625, status: 'online',  vehicle: 'Voiture', zone: 'Dakar Centre', rides: 27, rating: 4.6 },
  { id: 'DRV-007', name: 'Mamadou Diallo',  lat: 14.7012, lng: -17.4556, status: 'busy',    vehicle: 'Moto',    zone: 'Parcelles',    rides: 35, rating: 4.7 },
  { id: 'DRV-009', name: 'Fatou Sarr',      lat: 14.7156, lng: -17.4473, status: 'busy',    vehicle: 'Voiture', zone: 'Guédiawaye',   rides: 19, rating: 4.4 },
  { id: 'DRV-011', name: 'Alioune Ndiaye',  lat: 14.6745, lng: -17.4318, status: 'offline', vehicle: 'Moto',    zone: 'Plateau',      rides: 42, rating: 4.5 },
]

const STATUS_CONFIG = {
  online:  { label: 'En ligne',         color: '#22c55e', emoji: '🟢' },
  busy:    { label: 'En course',        color: '#f59e0b', emoji: '🟡' },
  offline: { label: 'Hors ligne',       color: '#94a3b8', emoji: '⚫' },
}

export default function DriverMapPage() {
  const mapRef    = useRef(null)
  const leafletRef = useRef(null)    // Instance Leaflet map
  const markersRef = useRef({})      // { driverId: marker }
  const [filter, setFilter]     = useState('all')
  const [drivers, setDrivers]   = useState(MOCK_DRIVER_POSITIONS)
  const [selected, setSelected] = useState(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading]   = useState(true)

  /* ── Initialisation de la carte Leaflet ── */
  useEffect(() => {
    // Import dynamique de Leaflet (déjà installé dans le projet)
    import('leaflet').then(L => {
      if (leafletRef.current) return // déjà initialisée

      // Fix icônes Leaflet avec Vite
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: [14.6928, -17.4467], // Dakar
        zoom: 13,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      leafletRef.current = map
      setLoading(false)

      // Placer les marqueurs initiaux
      placeMarkers(L, map, MOCK_DRIVER_POSITIONS)
    }).catch(() => {
      setLoading(false)
    })

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [])

  /* ── Placement des marqueurs ── */
  function placeMarkers(L, map, driversData) {
    // Nettoyage des anciens marqueurs
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    driversData.forEach(driver => {
      const cfg = STATUS_CONFIG[driver.status]
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:36px; height:36px; border-radius:50%;
            background:${cfg.color}; color:#fff;
            display:flex; align-items:center; justify-content:center;
            font-size:16px; font-weight:700;
            border:3px solid #fff;
            box-shadow:0 2px 10px rgba(0,0,0,0.3);
            cursor:pointer;
          ">
            ${driver.vehicle === 'Moto' ? '🏍' : '🚗'}
          </div>
          <div style="
            position:absolute; bottom:-6px; left:50%; transform:translateX(-50%);
            width:0; height:0;
            border-left:6px solid transparent;
            border-right:6px solid transparent;
            border-top:8px solid ${cfg.color};
          "></div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
      })

      const marker = L.marker([driver.lat, driver.lng], { icon })
        .addTo(map)
        .on('click', () => setSelected(driver))

      marker.bindTooltip(`
        <strong>${driver.name}</strong><br/>
        ${cfg.emoji} ${cfg.label} · ${driver.vehicle}<br/>
        ⭐ ${driver.rating} · ${driver.rides} courses
      `, { sticky: true })

      markersRef.current[driver.id] = marker
    })
  }

  /* ── Mise à jour des marqueurs quand le filtre change ── */
  useEffect(() => {
    if (!leafletRef.current) return
    import('leaflet').then(L => {
      const filtered = filter === 'all' ? drivers : drivers.filter(d => d.status === filter)
      Object.values(markersRef.current).forEach(m => m.remove())
      markersRef.current = {}
      placeMarkers(L, leafletRef.current, filtered)
    })
  }, [filter, drivers])

  /* ── Supabase Realtime ── */
  useEffect(() => {
    try {
      const channel = supabase.channel('driver-locations')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'drivers' }, payload => {
          const d = payload.new
          if (!d.last_lat || !d.last_lng) return
          setConnected(true)
          setDrivers(prev => {
            const existing = prev.find(p => p.id === d.id)
            if (existing) {
              return prev.map(p => p.id === d.id ? { ...p, lat: d.last_lat, lng: d.last_lng, status: d.is_online ? 'online' : 'offline' } : p)
            } else {
              return [...prev, { id: d.id, name: d.name || 'Inconnu', lat: d.last_lat, lng: d.last_lng, status: d.is_online ? 'online' : 'offline', vehicle: d.vehicle || 'Moto', zone: d.zone || '—', rides: 0, rating: 0 }]
            }
          })
          // Déplacer le marqueur sur la carte
          if (leafletRef.current && markersRef.current[d.id]) {
            markersRef.current[d.id].setLatLng([d.last_lat, d.last_lng])
          }
        })
        .subscribe()
      return () => supabase.removeChannel(channel)
    } catch { /* offline */ }
  }, [])

  const counts = {
    all:     drivers.length,
    online:  drivers.filter(d => d.status === 'online').length,
    busy:    drivers.filter(d => d.status === 'busy').length,
    offline: drivers.filter(d => d.status === 'offline').length,
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: 0 }}>🗺️ Carte des conducteurs</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12,
            background: connected ? '#f0fdf4' : '#fffbeb',
            color: connected ? '#166534' : '#92400e',
            border: `1px solid ${connected ? '#bbf7d0' : '#fde68a'}`,
          }}>
            {connected ? <FiWifi size={11} /> : <FiWifiOff size={11} />}
            {connected ? 'Live GPS' : 'Simulation'}
          </span>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'all',     label: 'Tous',       color: '#4680ff' },
          { key: 'online',  label: '🟢 En ligne', color: '#22c55e' },
          { key: 'busy',    label: '🟡 En course', color: '#f59e0b' },
          { key: 'offline', label: '⚫ Hors ligne', color: '#94a3b8' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '7px 16px', borderRadius: 20,
            border: `1px solid ${filter === f.key ? f.color : '#e2e8f0'}`,
            background: filter === f.key ? f.color : '#fff',
            color: filter === f.key ? '#fff' : '#475569',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {f.label} ({counts[f.key]})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* Carte */}
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <div ref={mapRef} style={{ height: 520, background: '#e2e8f0' }} />
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontSize: 13, color: '#64748b' }}>
              Chargement de la carte…
            </div>
          )}
        </div>

        {/* Liste conducteurs */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
            Conducteurs ({(filter === 'all' ? drivers : drivers.filter(d => d.status === filter)).length})
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 468 }}>
            {(filter === 'all' ? drivers : drivers.filter(d => d.status === filter)).map(d => {
              const cfg = STATUS_CONFIG[d.status]
              const isSelected = selected?.id === d.id
              return (
                <div key={d.id}
                  onClick={() => {
                    setSelected(d)
                    if (leafletRef.current && markersRef.current[d.id]) {
                      leafletRef.current.setView([d.lat, d.lng], 15)
                    }
                  }}
                  style={{
                    padding: '12px 16px', cursor: 'pointer', transition: 'background 0.12s',
                    background: isSelected ? '#f0f4ff' : 'transparent',
                    borderLeft: isSelected ? '3px solid #4680ff' : '3px solid transparent',
                    borderBottom: '1px solid #f8fafc',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: cfg.color + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                      border: `2px solid ${cfg.color}`,
                    }}>
                      {d.vehicle === 'Moto' ? '🏍' : '🚗'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{d.zone} · ⭐ {d.rating}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px',
                      borderRadius: 10, background: cfg.color + '15', color: cfg.color,
                    }}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Détail conducteur sélectionné */}
      {selected && (
        <div style={{
          marginTop: 16, background: '#fff', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #4680ff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{selected.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              {selected.vehicle} · {selected.zone} · ⭐ {selected.rating} · {selected.rides} courses
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              GPS: {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
            </div>
          </div>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
      )}
    </div>
  )
}
