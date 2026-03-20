import { useEffect, useState } from 'react'
import { FiDownload, FiTrendingUp, FiDollarSign, FiStar } from 'react-icons/fi'
import { getDashboardStats } from '../../services/api/dashboardService'
import { exportCSV } from '../../services/api/exportService'

/* ─── Mini graphique à barres SVG ─── */
function BarChart({ data, color = '#4680ff', height = 110 }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const barW = Math.floor(400 / data.length) - 4
  return (
    <svg width="100%" height={height} viewBox={`0 0 400 ${height}`} preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = Math.max(4, (d.value / max) * (height - 24))
        const x = i * (barW + 4) + 2
        const y = height - h - 20
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx={4} fill={color} opacity={0.85} />
            <text x={x + barW / 2} y={height - 4} textAnchor="middle" fontSize={8} fill="#94a3b8">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Mini graphique linéaire SVG ─── */
function LineChart({ data, color = '#22c55e', height = 110 }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const w = 400, pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (w - 20) + 10
    const y = height - 20 - ((d.value / max) * (height - 30))
    return `${x},${y}`
  })
  const area = `M ${pts.join(' L ')} L ${400 - 10},${height - 20} L 10,${height - 20} Z`
  return (
    <svg width="100%" height={height} viewBox={`0 0 400 ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#lg-${color.replace('#','')})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * (w - 20) + 10
        const y = height - 20 - ((d.value / max) * (height - 30))
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill={color} />
            <text x={x} y={height - 4} textAnchor="middle" fontSize={8} fill="#94a3b8">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Carte stat ─── */
function StatBlock({ label, value, sub, color = '#4680ff' }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 18px' }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 4, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

/* ─── Card wrapper ─── */
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

/* ─── Bouton télécharger ─── */
function ExportBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 8,
      border: '1px solid #e2e8f0', background: '#f8fafc',
      fontSize: 12, cursor: 'pointer', color: '#475569', fontWeight: 600,
    }}>
      <FiDownload size={13} /> Exporter CSV
    </button>
  )
}

/* ──────────────────────────────────────
   Page Rapport Financier
────────────────────────────────────── */
const WEEKLY_REVENUE = [
  { label: 'Lun', value: 185000 }, { label: 'Mar', value: 220000 },
  { label: 'Mer', value: 198000 }, { label: 'Jeu', value: 245000 },
  { label: 'Ven', value: 310000 }, { label: 'Sam', value: 275000 },
  { label: 'Dim', value: 142000 },
]

const MONTHLY_REVENUE = [
  { label: 'Jan', value: 2100000 }, { label: 'Fév', value: 1850000 },
  { label: 'Mar', value: 2400000 }, { label: 'Avr', value: 2800000 },
  { label: 'Mai', value: 3100000 }, { label: 'Jun', value: 2750000 },
]

const TOP_DRIVERS_FINANCE = [
  { name: 'Ibrahima Ba',     rides: 61, revenue: '30 750', pct: 92 },
  { name: 'Oumar Sall',      rides: 48, revenue: '24 500', pct: 72 },
  { name: 'Abdoulaye Mbaye', rides: 27, revenue: '13 500', pct: 40 },
  { name: 'Cheikh Fall',     rides: 32, revenue: '16 200', pct: 48 },
  { name: 'Seydou Diop',     rides: 14, revenue: '5 600',  pct: 17 },
]

export default function FinancialReportPage() {
  const [stats, setStats] = useState(null)
  const [period, setPeriod] = useState('week')

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
  }, [])

  const chartData = period === 'week' ? WEEKLY_REVENUE : MONTHLY_REVENUE
  const totalRevenue = chartData.reduce((s, d) => s + d.value, 0)

  const handleExport = () => {
    exportCSV(TOP_DRIVERS_FINANCE, 'rapport_financier_conducteurs', ['name', 'rides', 'revenue'], {
      name: 'Conducteur', rides: 'Courses', revenue: 'Gains (FCFA)',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatBlock label="Revenus total" value={stats?.site?.revenue ?? '—'} sub="Toutes catégories" color="#22c55e" />
        <StatBlock label="Revenus Taxi" value={stats?.taxi?.revenue ?? '—'} sub={`${stats?.taxi?.completed ?? '—'} courses terminées`} color="#4680ff" />
        <StatBlock label="Revenus Livraison" value={stats?.delivery?.revenue ?? '—'} sub={`${stats?.delivery?.completed ?? '—'} livraisons terminées`} color="#f59e0b" />
        <StatBlock label="Commission plateforme" value="15%" sub="Commission LiviGo standard" color="#a855f7" />
      </div>

      {/* Graphique revenus */}
      <Panel title="Évolution des revenus"
        action={
          <div style={{ display: 'flex', gap: 6 }}>
            {['week', 'month'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: '4px 12px', borderRadius: 6, border: `1px solid ${period === p ? '#4680ff' : '#e2e8f0'}`,
                background: period === p ? '#4680ff' : '#fff', color: period === p ? '#fff' : '#64748b',
                fontSize: 12, cursor: 'pointer', fontWeight: 600,
              }}>
                {p === 'week' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
        }
      >
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1e293b' }}>
            {totalRevenue.toLocaleString('fr-FR')} FCFA
          </span>
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, marginLeft: 10 }}>
            ↑ +12.4% vs période précédente
          </span>
        </div>
        <LineChart data={chartData} color="#4680ff" height={130} />
      </Panel>

      {/* Top conducteurs */}
      <Panel title="Top conducteurs par revenus générés" action={<ExportBtn onClick={handleExport} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TOP_DRIVERS_FINANCE.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#f1f5f9',
                color: i === 0 ? '#fff' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>
                {i === 0 ? '🥇' : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{d.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{d.revenue} FCFA</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9' }}>
                  <div style={{ width: `${d.pct}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #4680ff, #22c55e)' }} />
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', width: 60, textAlign: 'right' }}>{d.rides} courses</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Répartition par zone */}
      <Panel title="Répartition des revenus par zone">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { zone: 'Dakar Centre', revenue: '45%', amount: '1 245 000', color: '#4680ff' },
            { zone: 'Plateau',      revenue: '25%', amount: '690 000',   color: '#22c55e' },
            { zone: 'Parcelles',    revenue: '18%', amount: '497 000',   color: '#f59e0b' },
            { zone: 'Guédiawaye',   revenue: '8%',  amount: '221 000',   color: '#ef4444' },
            { zone: 'Thiès',        revenue: '3%',  amount: '83 000',    color: '#a855f7' },
            { zone: 'Autres',       revenue: '1%',  amount: '28 000',    color: '#94a3b8' },
          ].map((z, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', borderLeft: `3px solid ${z.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{z.zone}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: z.color, margin: '4px 0 2px' }}>{z.revenue}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{z.amount} FCFA</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
