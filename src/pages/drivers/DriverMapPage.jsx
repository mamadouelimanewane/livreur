import { useState } from 'react'
import { FiMap, FiRefreshCw } from 'react-icons/fi'
import { PageHeader, Btn, Select } from '../../components/PageLayout'

const onlineDrivers = [
  { id: 'DRV-001', name: 'Oumar Sall', zone: 'Dakar Centre', status: 'En ligne', vehicle: 'Moto', rides: 8, lat: '14.7167', lng: '-17.4677' },
  { id: 'DRV-003', name: 'Ibrahima Ba', zone: 'Parcelles', status: 'En course', vehicle: 'Moto', rides: 12, lat: '14.7500', lng: '-17.4400' },
  { id: 'DRV-005', name: 'Abdoulaye Mbaye', zone: 'Dakar Sud', status: 'En ligne', vehicle: 'Voiture', rides: 4, lat: '14.6900', lng: '-17.4800' },
]

const statusStyle = {
  'En ligne': { color: '#2ed8a3', dot: '#2ed8a3' },
  'En course': { color: '#4680ff', dot: '#4680ff' },
  'Hors ligne': { color: '#718096', dot: '#a0aec0' },
}

export default function DriverMapPage() {
  const [filter, setFilter] = useState('Tous')

  return (
    <div>
      <PageHeader title="Carte des conducteurs" icon={<FiMap />}>
        <Btn color="#4680ff"><FiRefreshCw size={14} /> Actualiser</Btn>
      </PageHeader>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'En ligne', count: 2, color: '#2ed8a3', bg: '#e6faf4' },
          { label: 'En course', count: 1, color: '#4680ff', bg: '#ebf4ff' },
          { label: 'Hors ligne', count: 2, color: '#718096', bg: '#f7f9fb' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff',
            borderRadius: 8,
            padding: '12px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            border: filter === s.label ? `2px solid ${s.color}` : '2px solid transparent',
          }}
            onClick={() => setFilter(filter === s.label ? 'Tous' : s.label)}
          >
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{s.count} {s.label}</span>
          </div>
        ))}
        <Select value={filter} onChange={e => setFilter(e.target.value)} options={['Tous', 'En ligne', 'En course', 'Hors ligne']} />
      </div>

      {/* Map placeholder */}
      <div style={{
        background: '#e8f0fe',
        borderRadius: 8,
        height: 450,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        {/* Fake map grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(70,128,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(70,128,255,0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Map label */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#4680ff',
        }}>
          <FiMap size={48} style={{ opacity: 0.3 }} />
          <div style={{ fontSize: 14, color: '#718096', marginTop: 8 }}>
            Carte interactive — Dakar, Sénégal<br />
            <span style={{ fontSize: 12, color: '#a0aec0' }}>Intégrez Google Maps ou Leaflet ici</span>
          </div>
        </div>

        {/* Driver pins */}
        {onlineDrivers.map((d, i) => (
          <div key={d.id} style={{
            position: 'absolute',
            top: `${30 + i * 20}%`,
            left: `${25 + i * 20}%`,
            background: statusStyle[d.status].dot,
            color: '#fff',
            borderRadius: '50% 50% 50% 0',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transform: 'rotate(-45deg)',
            cursor: 'pointer',
          }}>
            <span style={{ transform: 'rotate(45deg)' }}>{d.name.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Driver list sidebar */}
      <div style={{ marginTop: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2d3748', margin: '0 0 12px 0' }}>Conducteurs actifs</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {onlineDrivers.map(d => (
            <div key={d.id} style={{
              background: '#f6f7fb',
              borderRadius: 8,
              padding: '10px 14px',
              minWidth: 200,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: statusStyle[d.status].dot,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>
                {d.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#2d3748' }}>{d.name}</div>
                <div style={{ fontSize: 11, color: '#718096' }}>{d.zone} · {d.vehicle}</div>
                <div style={{ fontSize: 11, color: statusStyle[d.status].color, fontWeight: 600 }}>{d.status} · {d.rides} courses</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
