import { useEffect, useState } from 'react'
import { FiDownload, FiStar, FiTruck, FiCheckCircle } from 'react-icons/fi'
import { exportCSV } from '../../services/api/exportService'
import { getAvailableDrivers } from '../../services/api/dashboardService'

function Panel({ title, children, action }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

function Stars({ n }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <FiStar key={i} size={14} style={{ color: i <= n ? '#f59e0b' : '#e2e8f0', fill: i <= n ? '#f59e0b' : 'none' }} />
      ))}
    </span>
  )
}

const MOCK_DRIVER_STATS = [
  { name: 'Ibrahima Ba',     rides: 61, rating: 4.9, hours: 42, acceptance: 95, revenue: '30 750', vehicle: 'Moto',    zone: 'Plateau' },
  { name: 'Oumar Sall',      rides: 48, rating: 4.8, hours: 36, acceptance: 88, revenue: '24 500', vehicle: 'Moto',    zone: 'Dakar Centre' },
  { name: 'Cheikh Fall',     rides: 32, rating: 4.6, hours: 28, acceptance: 82, revenue: '16 200', vehicle: 'Voiture', zone: 'Plateau' },
  { name: 'Abdoulaye Mbaye', rides: 27, rating: 4.5, hours: 22, acceptance: 79, revenue: '13 500', vehicle: 'Voiture', zone: 'Dakar Centre' },
  { name: 'Seydou Diop',     rides: 14, rating: 4.2, hours: 12, acceptance: 65, revenue: '5 600',  vehicle: 'Vélo',    zone: 'Guédiawaye' },
]

const WEEKLY_HOURS = [
  { label: 'Lun', value: 8 }, { label: 'Mar', value: 7 },
  { label: 'Mer', value: 9 }, { label: 'Jeu', value: 6 },
  { label: 'Ven', value: 10 },{ label: 'Sam', value: 11 },
  { label: 'Dim', value: 4 },
]

function BarSVG({ data, color = '#4680ff', height = 90 }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const bw = Math.floor(360 / data.length) - 4
  return (
    <svg width="100%" height={height} viewBox={`0 0 400 ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = Math.max(4, (d.value / max) * (height - 22))
        const x = i * (bw + 4) + 20
        return (
          <g key={i}>
            <rect x={x} y={height - h - 20} width={bw} height={h} rx={4} fill={color} opacity={0.85} />
            <text x={x + bw / 2} y={height - 4} textAnchor="middle" fontSize={9} fill="#94a3b8">{d.label}</text>
            <text x={x + bw / 2} y={height - h - 24} textAnchor="middle" fontSize={9} fill={color} fontWeight="700">{d.value}h</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function DriversReportPage() {
  const [drivers, setDrivers] = useState(MOCK_DRIVER_STATS)

  const handleExport = () => exportCSV(drivers, 'rapport_conducteurs', ['name', 'rides', 'rating', 'hours', 'acceptance', 'revenue'], {
    name: 'Conducteur', rides: 'Courses', rating: 'Note', hours: 'Heures', acceptance: 'Acceptation %', revenue: 'Gains FCFA',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Résumé global */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Conducteurs actifs',    value: '19',    color: '#22c55e', icon: <FiTruck /> },
          { label: 'Note moyenne',          value: '4.7 ★', color: '#f59e0b', icon: <FiStar /> },
          { label: 'Taux d\'acceptation',   value: '84%',   color: '#4680ff', icon: <FiCheckCircle /> },
          { label: 'Heures connectées/sem', value: '36h',   color: '#a855f7', icon: <FiTruck /> },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <span style={{ color: k.color }}>{k.icon}</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Classement conducteurs */}
      <Panel title="Classement des conducteurs" action={
        <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 12, cursor: 'pointer', color: '#475569', fontWeight: 600 }}>
          <FiDownload size={13} /> Exporter CSV
        </button>
      }>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['#', 'Conducteur', 'Zone', 'Véhicule', 'Courses', 'Note', 'Acceptation', 'Connexion', 'Gains'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: '50%',
                      background: i === 0 ? '#fef3c7' : '#f1f5f9',
                      color: i === 0 ? '#d97706' : '#64748b',
                      fontSize: 12, fontWeight: 800,
                    }}>
                      {i === 0 ? '🥇' : i + 1}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 13 }}>{d.name}</div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>{d.zone}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 10, background: '#f1f5f9', color: '#475569' }}>{d.vehicle}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 700, color: '#4680ff' }}>{d.rides}</td>
                  <td style={{ padding: '12px 14px' }}><Stars n={Math.round(d.rating)} /><span style={{ fontSize: 11, color: '#f59e0b', marginLeft: 4 }}>{d.rating}</span></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#f1f5f9' }}>
                        <div style={{ width: `${d.acceptance}%`, height: '100%', borderRadius: 3, background: d.acceptance > 85 ? '#22c55e' : d.acceptance > 70 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', width: 32 }}>{d.acceptance}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>{d.hours}h</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{d.revenue} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Temps de connexion */}
      <Panel title="Heures de connexion cette semaine (moyenne conducteurs)">
        <BarSVG data={WEEKLY_HOURS} color="#6366f1" height={100} />
      </Panel>

      {/* Distribution des notes */}
      <Panel title="Distribution des notes (toutes évaluations)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[5, 4, 3, 2, 1].map(star => {
            const counts = { 5: 284, 4: 156, 3: 45, 2: 18, 1: 7 }
            const total = Object.values(counts).reduce((s, v) => s + v, 0)
            const pct = Math.round((counts[star] / total) * 100)
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 2, width: 76, flexShrink: 0 }}><Stars n={star} /></div>
                <div style={{ flex: 1, height: 10, borderRadius: 5, background: '#f1f5f9' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 5, background: star >= 4 ? '#22c55e' : star === 3 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8', width: 52, textAlign: 'right' }}>{counts[star]} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
