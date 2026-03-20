import { useEffect, useState } from 'react'
import { FiDownload, FiCheckCircle, FiXCircle, FiClock, FiTrendingUp } from 'react-icons/fi'
import { getDashboardStats } from '../../services/api/dashboardService'
import { exportCSV } from '../../services/api/exportService'

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

/* Mini donut SVG */
function DonutChart({ segments, size = 120 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 12
  let cumul = 0
  const total = segments.reduce((s, s2) => s + s2.value, 0)
  const paths = segments.map((seg) => {
    const start = (cumul / total) * 2 * Math.PI - Math.PI / 2
    cumul += seg.value
    const end = (cumul / total) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end)
    const large = seg.value / total > 0.5 ? 1 : 0
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: seg.color }
  })
  return (
    <svg width={size} height={size}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff" />
    </svg>
  )
}

/* Heatmap temporelle simulée */
function TimeHeatmap() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const hours = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h']
  const DATA = [
    [1, 2, 4, 6, 5, 3, 1, 4, 2],
    [2, 3, 5, 8, 7, 4, 2, 5, 3],
    [1, 2, 5, 7, 6, 4, 2, 6, 4],
    [2, 3, 6, 9, 8, 5, 3, 7, 4],
    [3, 5, 8, 10, 9, 7, 5, 9, 6],
    [4, 6, 7, 8, 8, 9, 8, 10, 7],
    [2, 3, 4, 5, 5, 6, 7, 8, 5],
  ]
  const max = 10
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
        <thead>
          <tr>
            <th style={{ width: 36, fontSize: 10, color: '#94a3b8' }} />
            {hours.map(h => <th key={h} style={{ width: 42, fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {days.map((day, di) => (
            <tr key={day}>
              <td style={{ fontSize: 11, color: '#64748b', fontWeight: 600, paddingRight: 6 }}>{day}</td>
              {DATA[di].map((v, hi) => {
                const intensity = v / max
                return (
                  <td key={hi} title={`${day} ${hours[hi]} — ${v * 10} courses`} style={{
                    width: 40, height: 28, borderRadius: 6, textAlign: 'center', fontSize: 10, fontWeight: 700,
                    background: `rgba(70,128,255,${0.08 + intensity * 0.85})`,
                    color: intensity > 0.6 ? '#fff' : '#4680ff',
                    cursor: 'default', transition: 'transform 0.1s',
                  }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    {v * 10}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>Nombre de courses par créneau horaire (×10)</div>
    </div>
  )
}

const CANCEL_REASONS = [
  { reason: 'Conducteur trop loin', count: 145, pct: 42 },
  { reason: 'Client non disponible', count: 87, pct: 25 },
  { reason: 'Prix trop élevé', count: 62, pct: 18 },
  { reason: 'Erreur de saisie adresse', count: 35, pct: 10 },
  { reason: 'Autre', count: 17, pct: 5 },
]

const FUNNEL = [
  { label: 'Courses demandées', value: 1240, color: '#4680ff' },
  { label: 'Assignées',         value: 1050, color: '#6366f1' },
  { label: 'Acceptées',         value: 890,  color: '#22c55e' },
  { label: 'Terminées',         value: 810,  color: '#16a34a' },
]

export default function OperationsReportPage() {
  const [stats, setStats] = useState(null)
  useEffect(() => { getDashboardStats().then(setStats).catch(() => {}) }, [])

  const completionRate = stats ? Math.round((stats.taxi.completed / (stats.taxi.total || 1)) * 100) : 68
  const cancellationRate = stats ? Math.round((stats.taxi.cancelled / (stats.taxi.total || 1)) * 100) : 12

  const handleExport = () => exportCSV(CANCEL_REASONS, 'raisons_annulation', ['reason', 'count', 'pct'], { reason: 'Raison', count: 'Nombre', pct: '%' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Taux de complétion', value: `${completionRate}%`, color: '#22c55e', icon: <FiCheckCircle /> },
          { label: 'Taux d\'annulation',  value: `${cancellationRate}%`, color: '#ef4444', icon: <FiXCircle /> },
          { label: 'Délai acceptation',   value: '~3.2 min',  color: '#f59e0b', icon: <FiClock /> },
          { label: 'Courses / heure',     value: '42',        color: '#4680ff', icon: <FiTrendingUp /> },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ color: k.color }}>{k.icon}</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <Panel title="Heures de pointe — Activité par jour et heure">
        <TimeHeatmap />
      </Panel>

      {/* Entonnoir + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Panel title="Entonnoir de conversion des courses">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FUNNEL.map((step, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{step.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: step.color }}>{step.value.toLocaleString()}</span>
                </div>
                <div style={{ height: 28, borderRadius: 6, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(step.value / FUNNEL[0].value) * 100}%`,
                    height: '100%', background: step.color, borderRadius: 6,
                    display: 'flex', alignItems: 'center', paddingLeft: 8,
                    transition: 'width 0.4s ease',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                      {Math.round((step.value / FUNNEL[0].value) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Répartition par statut de course">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <DonutChart segments={[
              { value: 810, color: '#22c55e' }, { value: 145, color: '#ef4444' },
              { value: 240, color: '#f59e0b' }, { value: 45, color: '#6366f1' },
            ]} size={130} />
            <div style={{ flex: 1 }}>
              {[
                { label: 'Terminées',     value: '810', color: '#22c55e' },
                { label: 'Annulées',      value: '145', color: '#ef4444' },
                { label: 'Auto-annulées', value: '240', color: '#f59e0b' },
                { label: 'Échouées',      value: '45',  color: '#6366f1' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#475569', flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Raisons d'annulation */}
      <Panel title="Raisons d'annulation les plus fréquentes" action={
        <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 12, cursor: 'pointer', color: '#475569', fontWeight: 600 }}>
          <FiDownload size={13} /> CSV
        </button>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CANCEL_REASONS.map((r, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#475569' }}>{r.reason}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.count} ({r.pct}%)</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#f1f5f9' }}>
                <div style={{ width: `${r.pct}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, #ef4444, #f97316)` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
