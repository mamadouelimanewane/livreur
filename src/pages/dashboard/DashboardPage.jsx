import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiUsers, FiTruck, FiGlobe, FiMapPin, FiAlertTriangle,
  FiDollarSign, FiTag, FiActivity, FiCheckCircle, FiXCircle,
  FiClock, FiRepeat, FiTrendingUp, FiArrowUpRight, FiRefreshCw,
  FiWifi, FiWifiOff,
} from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdOutlineDeliveryDining } from 'react-icons/md'
import { getDashboardStats } from '../../services/api/dashboardService'

/* ─────────────────────────── StatCard ─────────────────────────── */
function StatCard({ icon, gradient, label, value, trend, loading }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '22px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      {/* Barre de dégradé haut */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: gradient, borderRadius: '16px 16px 0 0',
      }} />

      {/* Icône + trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}>
          <span style={{ color: '#fff', display: 'flex', fontSize: 20 }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 600,
            color: trend >= 0 ? '#22c55e' : '#ef4444',
            background: trend >= 0 ? '#f0fdf4' : '#fef2f2',
            padding: '3px 8px', borderRadius: 20,
          }}>
            <FiArrowUpRight size={12} style={{ transform: trend < 0 ? 'rotate(90deg)' : 'none' }} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Valeur */}
      <div>
        {loading ? (
          <div style={{
            height: 28, width: '60%', borderRadius: 8,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
          }} />
        ) : (
          <div style={{ fontSize: 26, fontWeight: 800, color: '#1a202c', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {value}
          </div>
        )}
        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── SectionTitle ─────────────────────────── */
function SectionTitle({ title, icon, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: color || 'linear-gradient(135deg, #4680ff 0%, #6366f1 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 2px 10px ${color ? color + '44' : 'rgba(70,128,255,0.3)'}`,
      }}>
        <span style={{ color: '#fff', display: 'flex' }}>{icon}</span>
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0', marginLeft: 8 }} />
    </div>
  )
}

/* ─────────────────────────── WelcomeBanner ─────────────────────────── */
function WelcomeBanner({ stats, loading }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const pills = [
    { label: `${stats?.taxi?.total ?? '…'} courses taxi`, icon: <FiActivity size={13} /> },
    { label: `${stats?.site?.drivers ?? '…'} conducteurs actifs`, icon: <FiTruck size={13} /> },
    { label: `${stats?.site?.users ?? '…'} utilisateurs`, icon: <FiUsers size={13} /> },
  ]

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1d2e 0%, #2d1f5e 50%, #4680ff 100%)',
      borderRadius: 20, padding: '28px 32px', marginBottom: 28,
      position: 'relative', overflow: 'hidden', color: '#fff',
    }}>
      <div style={{ position: 'absolute', top: -40, right: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', bottom: -60, right: 80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', top: 20, right: 140, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4, fontWeight: 500 }}>
          {greeting} 👋
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
          Tableau de bord LiviGo
        </h1>
        <p style={{ fontSize: 13, opacity: 0.65, marginTop: 6, maxWidth: 500, lineHeight: 1.5 }}>
          Vue d'ensemble en temps réel de votre plateforme — Gérez vos conducteurs, courses et transactions.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          {pills.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: loading ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px', borderRadius: 20,
              fontSize: 12, fontWeight: 600,
              transition: 'background 0.3s',
            }}>
              {p.icon} {p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── Indicateur source ─────────────────────────── */
function DataSourceBadge({ live }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 600,
      color: live ? '#22c55e' : '#f59e0b',
      background: live ? '#f0fdf4' : '#fffbeb',
      border: `1px solid ${live ? '#bbf7d0' : '#fde68a'}`,
      padding: '4px 12px', borderRadius: 20, marginBottom: 20,
    }}>
      {live ? <FiWifi size={12} /> : <FiWifiOff size={12} />}
      {live ? 'Données en direct — Supabase' : 'Données de démonstration (mode hors-ligne)'}
    </div>
  )
}

/* ─────────────────────────── Page principale ─────────────────────────── */
export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  const loadStats = async () => {
    setLoading(true)
    try {
      const data = await getDashboardStats()
      // Si les conducteurs viennent de Supabase (> 0 online), c'est du live
      setIsLive(data.site.onlineDrivers > 0 || data.taxi.total !== 54)
      setStats(data)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Erreur chargement dashboard', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  const s = stats
  const tickerFormat = (n) => n?.toLocaleString?.() ?? n ?? '—'

  return (
    <div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <WelcomeBanner stats={s} loading={loading} />

      {/* Bandeau source + refresh */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <DataSourceBadge live={isLive} />
        <button
          onClick={loadStats}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: '1px solid #e2e8f0',
            borderRadius: 20, padding: '4px 14px',
            fontSize: 11, fontWeight: 600, color: '#64748b',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          <FiRefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {lastUpdate ? `Mis à jour ${lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'Actualiser'}
        </button>
      </div>

      {/* ── Statistiques du site ── */}
      <div style={{ marginBottom: 32 }}>
        <SectionTitle title="Statistiques du site" icon={<FiTrendingUp size={17} />} color="linear-gradient(135deg, #4680ff, #6366f1)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <StatCard loading={loading} icon={<FiUsers size={20} />}         gradient="linear-gradient(135deg, #22c55e, #16a34a)"   label="Utilisateurs actifs"           value={tickerFormat(s?.site?.users)}        trend={12} />
          <StatCard loading={loading} icon={<FiTruck size={20} />}         gradient="linear-gradient(135deg, #4680ff, #6366f1)"   label="Conducteurs approuvés"          value={tickerFormat(s?.site?.drivers)}      trend={8}  />
          <StatCard loading={loading} icon={<FiGlobe size={20} />}         gradient="linear-gradient(135deg, #f59e0b, #d97706)"   label="Pays de service"                value={tickerFormat(s?.site?.countries)}           />
          <StatCard loading={loading} icon={<FiMapPin size={20} />}        gradient="linear-gradient(135deg, #f97316, #ea580c)"   label="Zones de service"               value={tickerFormat(s?.site?.zones)}               />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard loading={loading} icon={<FiAlertTriangle size={20} />} gradient="linear-gradient(135deg, #ef4444, #dc2626)"   label="Documents proches expiration"   value={tickerFormat(s?.site?.expiringDocs)}        />
          <StatCard loading={loading} icon={<FiDollarSign size={20} />}    gradient="linear-gradient(135deg, #14b8a6, #0d9488)"   label="Gain total"                     value={s?.site?.revenue ?? '—'}             trend={5}  />
          <StatCard loading={loading} icon={<FiTag size={20} />}           gradient="linear-gradient(135deg, #a855f7, #9333ea)"   label="Remise totale"                  value={tickerFormat(s?.site?.discount)}            />
        </div>
      </div>

      {/* ── Moto Taxi ── */}
      <div style={{ marginBottom: 32 }}>
        <SectionTitle title="Moto Taxi — Statistiques" icon={<MdOutlineLocalTaxi size={18} />} color="linear-gradient(135deg, #f59e0b, #d97706)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <StatCard loading={loading} icon={<FiActivity size={20} />}      gradient="linear-gradient(135deg, #4680ff, #6366f1)"   label="Total courses"         value={tickerFormat(s?.taxi?.total)}         trend={15} />
          <StatCard loading={loading} icon={<FiClock size={20} />}         gradient="linear-gradient(135deg, #22c55e, #16a34a)"   label="En cours"              value={tickerFormat(s?.taxi?.ongoing)}              />
          <StatCard loading={loading} icon={<FiXCircle size={20} />}       gradient="linear-gradient(135deg, #ef4444, #dc2626)"   label="Annulées"              value={tickerFormat(s?.taxi?.cancelled)}     trend={-2} />
          <StatCard loading={loading} icon={<FiCheckCircle size={20} />}   gradient="linear-gradient(135deg, #22c55e, #16a34a)"   label="Terminées"             value={tickerFormat(s?.taxi?.completed)}     trend={18} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard loading={loading} icon={<FiRepeat size={20} />}        gradient="linear-gradient(135deg, #f59e0b, #d97706)"   label="Auto-annulées"         value={tickerFormat(s?.taxi?.autoCancelled)}       />
          <StatCard loading={loading} icon={<FiDollarSign size={20} />}    gradient="linear-gradient(135deg, #14b8a6, #0d9488)"   label="Gain total"            value={s?.taxi?.revenue ?? '—'}              trend={10} />
          <StatCard loading={loading} icon={<FiTag size={20} />}           gradient="linear-gradient(135deg, #a855f7, #9333ea)"   label="Remise totale"         value={tickerFormat(s?.taxi?.discount)}            />
        </div>
      </div>

      {/* ── Livraison ── */}
      <div style={{ marginBottom: 32 }}>
        <SectionTitle title="Livraison — Statistiques" icon={<MdOutlineDeliveryDining size={18} />} color="linear-gradient(135deg, #22c55e, #16a34a)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <StatCard loading={loading} icon={<FiActivity size={20} />}      gradient="linear-gradient(135deg, #4680ff, #6366f1)"   label="Total courses"         value={tickerFormat(s?.delivery?.total)}          />
          <StatCard loading={loading} icon={<FiClock size={20} />}         gradient="linear-gradient(135deg, #22c55e, #16a34a)"   label="En cours"              value={tickerFormat(s?.delivery?.ongoing)}         />
          <StatCard loading={loading} icon={<FiXCircle size={20} />}       gradient="linear-gradient(135deg, #ef4444, #dc2626)"   label="Annulées"              value={tickerFormat(s?.delivery?.cancelled)}  trend={-5} />
          <StatCard loading={loading} icon={<FiCheckCircle size={20} />}   gradient="linear-gradient(135deg, #22c55e, #16a34a)"   label="Terminées"             value={tickerFormat(s?.delivery?.completed)}  trend={3}  />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard loading={loading} icon={<FiRepeat size={20} />}        gradient="linear-gradient(135deg, #f59e0b, #d97706)"   label="Auto-annulées"         value={tickerFormat(s?.delivery?.autoCancelled)}   />
          <StatCard loading={loading} icon={<FiDollarSign size={20} />}    gradient="linear-gradient(135deg, #14b8a6, #0d9488)"   label="Gain total"            value={s?.delivery?.revenue ?? '—'}               />
          <StatCard loading={loading} icon={<FiTag size={20} />}           gradient="linear-gradient(135deg, #a855f7, #9333ea)"   label="Remise totale"         value={tickerFormat(s?.delivery?.discount)}        />
        </div>
      </div>

      {/* ── Accès rapides ── */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0' }}>Accès rapides</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { label: 'Conducteurs en attente', link: '/drivers/pending',           gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', count: s?.site?.expiringDocs },
            { label: 'Courses taxi actives',   link: '/taxi/rides/active',          gradient: 'linear-gradient(135deg, #4680ff, #6366f1)', count: s?.taxi?.ongoing },
            { label: 'Livraisons actives',     link: '/delivery/rides/active',      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', count: s?.delivery?.ongoing },
            { label: 'Retraits en attente',    link: '/transactions/cashout',        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
            { label: 'Tickets support',        link: '/support/customer-service',    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
            { label: 'Dispatch manuel',        link: '/dispatch/manual',             gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
          ].map((q, i) => (
            <Link
              key={i}
              to={q.link}
              style={{
                padding: '8px 18px',
                background: q.gradient,
                color: '#fff',
                borderRadius: 24,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'transform 0.18s, box-shadow 0.18s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)' }}
            >
              {q.label}
              {q.count !== undefined && !loading && (
                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '1px 7px', fontSize: 10 }}>
                  {q.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
