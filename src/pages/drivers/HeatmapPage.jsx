import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import { FiActivity, FiRefreshCw, FiTrendingUp, FiZap, FiMapPin, FiClock } from 'react-icons/fi'
import { PageHeader, Btn, Select } from '../../components/PageLayout'
import 'leaflet/dist/leaflet.css'

// Points de demande avec coordonnées GPS réelles (Dakar)
const DEMAND_DATA = {
  "Aujourd'hui": [
    { lat: 14.6937, lon: -17.4441, intensity: 95, zone: 'Dakar Plateau',       rides: 34, prediction: 'forte' },
    { lat: 14.7167, lon: -17.4677, intensity: 82, zone: 'Médina',              rides: 28, prediction: 'forte' },
    { lat: 14.7295, lon: -17.4728, intensity: 70, zone: 'Parcelles Assainies', rides: 22, prediction: 'modérée' },
    { lat: 14.7441, lon: -17.4607, intensity: 58, zone: 'Guédiawaye',          rides: 16, prediction: 'modérée' },
    { lat: 14.6847, lon: -17.4738, intensity: 75, zone: 'Dakar Sud',           rides: 24, prediction: 'forte' },
    { lat: 14.6780, lon: -17.4380, intensity: 88, zone: 'Corniche',            rides: 31, prediction: 'forte' },
    { lat: 14.7609, lon: -17.3655, intensity: 42, zone: 'Rufisque',            rides: 11, prediction: 'faible' },
    { lat: 14.7534, lon: -17.4108, intensity: 35, zone: 'Pikine',              rides:  9, prediction: 'faible' },
    { lat: 14.6705, lon: -17.4459, intensity: 65, zone: 'Almadies',            rides: 19, prediction: 'modérée' },
    { lat: 14.7040, lon: -17.4520, intensity: 50, zone: 'HLM',                 rides: 14, prediction: 'modérée' },
    { lat: 14.6623, lon: -17.4265, intensity: 45, zone: 'Ouakam',              rides: 12, prediction: 'faible' },
    { lat: 14.7200, lon: -17.4100, intensity: 30, zone: 'Thiaroye',            rides:  7, prediction: 'faible' },
  ],
  'Cette semaine': [
    { lat: 14.6937, lon: -17.4441, intensity: 88, zone: 'Dakar Plateau',       rides: 210, prediction: 'forte' },
    { lat: 14.7167, lon: -17.4677, intensity: 75, zone: 'Médina',              rides: 175, prediction: 'forte' },
    { lat: 14.7295, lon: -17.4728, intensity: 60, zone: 'Parcelles Assainies', rides: 140, prediction: 'modérée' },
    { lat: 14.7441, lon: -17.4607, intensity: 50, zone: 'Guédiawaye',          rides: 110, prediction: 'modérée' },
    { lat: 14.6847, lon: -17.4738, intensity: 70, zone: 'Dakar Sud',           rides: 160, prediction: 'forte' },
    { lat: 14.6780, lon: -17.4380, intensity: 80, zone: 'Corniche',            rides: 195, prediction: 'forte' },
    { lat: 14.7609, lon: -17.3655, intensity: 35, zone: 'Rufisque',            rides:  75, prediction: 'faible' },
    { lat: 14.6705, lon: -17.4459, intensity: 55, zone: 'Almadies',            rides: 125, prediction: 'modérée' },
  ],
  'Ce mois': [
    { lat: 14.6937, lon: -17.4441, intensity: 92, zone: 'Dakar Plateau',       rides: 890, prediction: 'forte' },
    { lat: 14.7167, lon: -17.4677, intensity: 78, zone: 'Médina',              rides: 710, prediction: 'forte' },
    { lat: 14.7295, lon: -17.4728, intensity: 65, zone: 'Parcelles Assainies', rides: 580, prediction: 'modérée' },
    { lat: 14.7441, lon: -17.4607, intensity: 52, zone: 'Guédiawaye',          rides: 450, prediction: 'modérée' },
    { lat: 14.6847, lon: -17.4738, intensity: 72, zone: 'Dakar Sud',           rides: 640, prediction: 'forte' },
    { lat: 14.6780, lon: -17.4380, intensity: 85, zone: 'Corniche',            rides: 780, prediction: 'forte' },
    { lat: 14.7609, lon: -17.3655, intensity: 38, zone: 'Rufisque',            rides: 320, prediction: 'faible' },
    { lat: 14.6705, lon: -17.4459, intensity: 58, zone: 'Almadies',            rides: 510, prediction: 'modérée' },
  ],
}

// Prédictions LiviBrain pour les prochaines heures
const LIVIBRAIN_PREDICTIONS = [
  { time: '+1h', zone: 'Dakar Plateau', surge: true,  reason: 'Fin de bureaux',       confidence: 94 },
  { time: '+1h', zone: 'Médina',        surge: false, reason: 'Demande stable',        confidence: 78 },
  { time: '+2h', zone: 'Corniche',      surge: true,  reason: 'Heure de pointe soir', confidence: 91 },
  { time: '+2h', zone: 'Parcelles',     surge: false, reason: 'Demande modérée',       confidence: 82 },
  { time: '+3h', zone: 'Almadies',      surge: true,  reason: 'Sorties soirée',        confidence: 88 },
]

function getHeatColor(intensity) {
  if (intensity >= 80) return '#ef4444'
  if (intensity >= 60) return '#f97316'
  if (intensity >= 40) return '#f59e0b'
  return '#22c55e'
}

function MapFitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length > 0) {
      map.setView([14.6937, -17.4441], 12)
    }
  }, [points, map])
  return null
}

export default function HeatmapPage() {
  const [period, setPeriod] = useState("Aujourd'hui")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const points = DEMAND_DATA[period] || DEMAND_DATA["Aujourd'hui"]

  const totalRides  = points.reduce((s, p) => s + p.rides, 0)
  const hotZones    = points.filter(p => p.intensity >= 70).length
  const avgIntensity = Math.round(points.reduce((s, p) => s + p.intensity, 0) / points.length)

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 800)
  }

  return (
    <div>
      <PageHeader title="Carte thermique — Demande prédictive" icon={<FiActivity />}>
        <Select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          options={["Aujourd'hui", 'Cette semaine', 'Ce mois']}
        />
        <Btn color="#4680ff" onClick={handleRefresh}>
          <FiRefreshCw size={13} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Actualiser
        </Btn>
      </PageHeader>

      <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Courses totales',  value: totalRides,    color: '#4680ff', icon: <FiActivity size={16} /> },
          { label: 'Zones actives',    value: `${hotZones}/${points.length}`, color: '#ef4444', icon: <FiMapPin size={16} /> },
          { label: 'Intensité moy.',   value: `${avgIntensity}%`, color: '#f59e0b', icon: <FiTrendingUp size={16} /> },
          { label: 'Prédictions IA',   value: LIVIBRAIN_PREDICTIONS.filter(p => p.surge).length + ' surges',
            color: '#a855f7', icon: <FiZap size={16} /> },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: k.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#1e293b' }}>{k.value}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        {/* Carte Leaflet */}
        <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 480 }}>
          <MapContainer
            center={[14.6937, -17.4441]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            <MapFitBounds points={points} />
            {points.map((p, i) => (
              <CircleMarker
                key={`${period}-${i}`}
                center={[p.lat, p.lon]}
                radius={8 + (p.intensity / 100) * 22}
                pathOptions={{
                  fillColor: getHeatColor(p.intensity),
                  fillOpacity: 0.45 + (p.intensity / 100) * 0.35,
                  color: getHeatColor(p.intensity),
                  weight: selected?.zone === p.zone ? 3 : 1,
                  opacity: 0.8,
                }}
                eventHandlers={{ click: () => setSelected(selected?.zone === p.zone ? null : p) }}
              >
                <Tooltip permanent={p.intensity >= 75} direction="top" offset={[0, -10]}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {p.zone}<br />
                    <span style={{ color: getHeatColor(p.intensity) }}>● {p.intensity}%</span> · {p.rides} courses
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Panneau latéral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Zone sélectionnée */}
          {selected && (
            <div style={{
              background: '#fff', borderRadius: 12, padding: '14px 16px',
              boxShadow: `0 0 0 2px ${getHeatColor(selected.intensity)}40, 0 2px 8px rgba(0,0,0,0.06)`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
                📍 {selected.zone}
              </div>
              {[
                { label: 'Intensité',  value: `${selected.intensity}%` },
                { label: 'Courses',    value: selected.rides },
                { label: 'Prédiction', value: selected.prediction === 'forte' ? '🔥 Forte' : selected.prediction === 'modérée' ? '📊 Modérée' : '📉 Faible' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                  <span style={{ color: '#64748b' }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${selected.intensity}%`, background: getHeatColor(selected.intensity), borderRadius: 3 }} />
                </div>
              </div>
            </div>
          )}

          {/* Légende */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>Légende</div>
            {[
              { color: '#ef4444', label: 'Très forte demande (≥80%)' },
              { color: '#f97316', label: 'Forte demande (60-79%)' },
              { color: '#f59e0b', label: 'Demande modérée (40-59%)' },
              { color: '#22c55e', label: 'Faible demande (<40%)' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Prédictions LiviBrain */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiZap size={13} color="#a855f7" /> Prédictions LiviBrain IA
            </div>
            {LIVIBRAIN_PREDICTIONS.map((p, i) => (
              <div key={i} style={{
                padding: '8px 10px', borderRadius: 8, marginBottom: 6,
                background: p.surge ? '#fef3c720' : '#f0fdf420',
                border: `1px solid ${p.surge ? '#fbbf2430' : '#86efac30'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>
                    {p.surge ? '🔥' : '✅'} {p.zone}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: p.surge ? '#f59e0b' : '#22c55e' }}>
                    {p.time}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{p.reason}</div>
                <div style={{ marginTop: 4, height: 3, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.confidence}%`, background: p.surge ? '#f59e0b' : '#22c55e', borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>Confiance : {p.confidence}%</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Classement zones */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', marginTop: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
          <FiTrendingUp size={14} style={{ marginRight: 6, verticalAlign: 'middle', color: '#4680ff' }} />
          Classement des zones par activité
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[...points].sort((a, b) => b.intensity - a.intensity).map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', width: 18 }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#1e293b' }}>{p.zone}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: getHeatColor(p.intensity) }}>{p.intensity}%</span>
                </div>
                <div style={{ height: 5, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.intensity}%`, background: getHeatColor(p.intensity), borderRadius: 3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
