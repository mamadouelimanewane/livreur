import { useState, useEffect } from 'react'
import { FiTrendingUp, FiUsers, FiTruck, FiDollarSign, FiActivity, FiDownload } from 'react-icons/fi'
import PageLayout from '../../components/PageLayout'
import {
  getRevenueChartData,
  getRidesChartData,
  getKPIs,
  getGrowthTrends,
  getServiceDistribution,
  getZoneDistribution,
  getTopDrivers,
  getHourlyDistribution,
  CHART_COLORS,
  exportAnalyticsReport,
} from '../../services/api/analyticsService'

const ACCENT = '#4680ff'
const DARK = '#1a1d2e'

function KPICard({ icon, label, value, change, changeType }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${ACCENT}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: ACCENT,
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: DARK }}>{value}</div>
      {change !== undefined && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          marginTop: 8, fontSize: 12, fontWeight: 600,
          color: changeType === 'up' ? '#22c55e' : '#ef4444',
        }}>
          <FiTrendingUp style={{ transform: changeType === 'down' ? 'rotate(180deg)' : 'none' }} />
          {change}% vs mois dernier
        </div>
      )}
    </div>
  )
}

function SimpleChart({ data, title, color = ACCENT, height = 200 }) {
  if (!data || data.length === 0) return null
  
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1
  
  const width = 100 / data.length
  
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>{title}</div>
      <div style={{ height, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
        {data.map((point, i) => {
          const barHeight = ((point.value - minValue) / range) * 100
          return (
            <div key={i} style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                width: '100%',
                height: `${Math.max(barHeight, 5)}%`,
                background: color,
                borderRadius: 4,
                transition: 'height 0.3s',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 10, color: '#64748b', whiteSpace: 'nowrap',
                }}>
                  {point.value}
                </div>
              </div>
              <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, textAlign: 'center' }}>
                {point.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DonutChart({ data, title }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0)
  const colors = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.purple]
  
  let currentAngle = 0
  const segments = Object.entries(data).map(([label, value], i) => {
    const angle = (value / total) * 360
    const segment = { label, value, angle, startAngle: currentAngle, color: colors[i % colors.length] }
    currentAngle += angle
    return segment
  })
  
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 120, height: 120, position: 'relative' }}>
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            {segments.map((seg, i) => {
              const startRad = (seg.startAngle * Math.PI) / 180
              const endRad = ((seg.startAngle + seg.angle) * Math.PI) / 180
              const largeArc = seg.angle > 180 ? 1 : 0
              
              const x1 = 50 + 40 * Math.cos(startRad)
              const y1 = 50 + 40 * Math.sin(startRad)
              const x2 = 50 + 40 * Math.cos(endRad)
              const y2 = 50 + 40 * Math.sin(endRad)
              
              return (
                <path
                  key={i}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={seg.color}
                />
              )
            })}
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          {segments.map((seg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: seg.color }} />
              <span style={{ fontSize: 12, color: '#475569' }}>{seg.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: DARK, marginLeft: 'auto' }}>
                {Math.round((seg.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TopDriversList({ drivers }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
        Top Conducteurs
      </div>
      {drivers.map((driver, i) => (
        <div key={driver.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 0', borderBottom: i < drivers.length - 1 ? '1px solid #f1f5f9' : 'none',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: i < 3 ? '#fff' : DARK,
          }}>
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{driver.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{driver.rides} courses</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{driver.amount}</div>
            <div style={{ fontSize: 11, color: '#fbbf24' }}>★ {driver.rating}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const [kpis, setKPIs] = useState(null)
  const [trends, setTrends] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [ridesData, setRidesData] = useState([])
  const [serviceDist, setServiceDist] = useState({})
  const [zoneDist, setZoneDist] = useState({})
  const [topDrivers, setTopDrivers] = useState([])
  const [hourlyDist, setHourlyDist] = useState({})

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [
          kpisData,
          trendsData,
          revenue,
          rides,
          services,
          zones,
          drivers,
          hourly,
        ] = await Promise.all([
          getKPIs(),
          getGrowthTrends(),
          getRevenueChartData(period),
          getRidesChartData(period),
          getServiceDistribution(),
          getZoneDistribution(),
          getTopDrivers(5),
          getHourlyDistribution(),
        ])
        
        setKPIs(kpisData)
        setTrends(trendsData)
        setRevenueData(revenue)
        setRidesData(rides)
        setServiceDist(services)
        setZoneDist(zones)
        setTopDrivers(drivers)
        setHourlyDist(hourly)
      } catch (err) {
        console.error('Error loading analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [period])

  const handleExport = () => {
    exportAnalyticsReport(revenueData, 'revenus')
  }

  if (loading) {
    return (
      <PageLayout title="Analytics">
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Chargement des données...
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      title="Analytics Avancé"
      actions={
        <button onClick={handleExport} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: ACCENT, color: '#fff', border: 'none',
          padding: '10px 16px', borderRadius: 10, fontSize: 13,
          fontWeight: 600, cursor: 'pointer',
        }}>
          <FiDownload size={16} /> Exporter
        </button>
      }
    >
      {/* Period Selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['week', 'month', 'quarter'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: period === p ? ACCENT : '#f1f5f9',
              color: period === p ? '#fff' : '#475569',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {p === 'week' ? '7 jours' : p === 'month' ? '30 jours' : '90 jours'}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard
          icon={<FiUsers size={20} />}
          label="Utilisateurs"
          value={kpis?.totalUsers || 0}
          change={trends?.usersGrowth}
          changeType={trends?.usersGrowth > 0 ? 'up' : 'down'}
        />
        <KPICard
          icon={<FiTruck size={20} />}
          label="Conducteurs"
          value={kpis?.totalDrivers || 0}
          change={trends?.driversGrowth}
          changeType={trends?.driversGrowth > 0 ? 'up' : 'down'}
        />
        <KPICard
          icon={<FiActivity size={20} />}
          label="Courses"
          value={kpis?.totalRides || 0}
          change={trends?.ridesGrowth}
          changeType={trends?.ridesGrowth > 0 ? 'up' : 'down'}
        />
        <KPICard
          icon={<FiDollarSign size={20} />}
          label="Revenus"
          value={`${kpis?.totalRevenue?.toLocaleString() || 0} FCFA`}
          change={trends?.revenueGrowth}
          changeType={trends?.revenueGrowth > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <SimpleChart data={revenueData} title="Évolution des Revenus" color={CHART_COLORS.primary} />
        <SimpleChart data={ridesData} title="Évolution des Courses" color={CHART_COLORS.secondary} />
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <DonutChart data={serviceDist} title="Répartition par Service" />
        <DonutChart data={zoneDist} title="Répartition par Zone" />
        <TopDriversList drivers={topDrivers} />
      </div>

      {/* Hourly Distribution */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>
          Distribution Horaire des Courses
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 100 }}>
          {Object.entries(hourlyDist).map(([hour, count]) => {
            const maxCount = Math.max(...Object.values(hourlyDist))
            const height = (count / maxCount) * 100
            return (
              <div key={hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%', height: `${height}%`,
                  background: height > 60 ? CHART_COLORS.primary : height > 30 ? CHART_COLORS.warning : '#e2e8f0',
                  borderRadius: 2, transition: 'height 0.3s',
                }} />
                <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 4 }}>{hour}</div>
              </div>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}
