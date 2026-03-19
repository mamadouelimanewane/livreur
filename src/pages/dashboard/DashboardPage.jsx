import { FiUsers, FiTruck, FiGlobe, FiMapPin, FiAlertTriangle, FiDollarSign, FiTag, FiActivity, FiCheckCircle, FiXCircle, FiClock, FiRepeat, FiTrendingUp, FiArrowUpRight } from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdOutlineDeliveryDining } from 'react-icons/md'

/* ── Premium stat card with gradient accent ── */
function StatCard({ icon, gradient, label, value, trend }) {
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
      {/* Decorative gradient bar at top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: gradient,
        borderRadius: '16px 16px 0 0',
      }} />

      {/* Icon + trend row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: 12,
          background: gradient,
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
            padding: '3px 8px',
            borderRadius: 20,
          }}>
            <FiArrowUpRight size={12} style={{ transform: trend < 0 ? 'rotate(90deg)' : 'none' }} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <div style={{
          fontSize: 26, fontWeight: 800, color: '#1a202c',
          letterSpacing: '-0.02em', lineHeight: 1.1,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: 12, color: '#94a3b8', fontWeight: 500,
          marginTop: 4, textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {label}
        </div>
      </div>
    </div>
  )
}

/* ── Section header with icon ── */
function SectionTitle({ title, icon, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 16,
    }}>
      <div style={{
        width: 34, height: 34,
        borderRadius: 10,
        background: color || 'linear-gradient(135deg, #4680ff 0%, #6366f1 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 2px 10px ${color ? color + '44' : 'rgba(70,128,255,0.3)'}`,
      }}>
        <span style={{ color: '#fff', display: 'flex' }}>{icon}</span>
      </div>
      <h2 style={{
        fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0,
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0', marginLeft: 8 }} />
    </div>
  )
}

/* ── Welcome banner ── */
function WelcomeBanner() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1d2e 0%, #2d1f5e 50%, #4680ff 100%)',
      borderRadius: 20,
      padding: '28px 32px',
      marginBottom: 28,
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -40, right: -20,
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, right: 80,
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
      }} />
      <div style={{
        position: 'absolute', top: 20, right: 140,
        width: 60, height: 60, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4, fontWeight: 500 }}>
          {greeting} 👋
        </div>
        <h1 style={{
          fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.01em',
        }}>
          Tableau de bord LiviGo
        </h1>
        <p style={{
          fontSize: 13, opacity: 0.65, marginTop: 6, maxWidth: 500, lineHeight: 1.5,
        }}>
          Vue d'ensemble en temps réel de votre plateforme — Gérez vos conducteurs, courses et transactions.
        </p>

        {/* Mini summary pills */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: '67 courses', icon: <FiActivity size={13} /> },
            { label: '37 conducteurs', icon: <FiTruck size={13} /> },
            { label: '18 utilisateurs', icon: <FiUsers size={13} /> },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12, fontWeight: 600,
            }}>
              {p.icon}
              {p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <WelcomeBanner />

      {/* ── Statistiques du site ── */}
      <div style={{ marginBottom: 32 }}>
        <SectionTitle
          title="Statistiques du site"
          icon={<FiTrendingUp size={17} />}
          color="linear-gradient(135deg, #4680ff, #6366f1)"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <StatCard icon={<FiUsers size={20} />} gradient="linear-gradient(135deg, #22c55e, #16a34a)" label="Utilisateurs Actifs" value={18} trend={12} />
          <StatCard icon={<FiTruck size={20} />} gradient="linear-gradient(135deg, #4680ff, #6366f1)" label="Conducteurs actifs" value={19} trend={8} />
          <StatCard icon={<FiGlobe size={20} />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" label="Pays de service" value={1} />
          <StatCard icon={<FiMapPin size={20} />} gradient="linear-gradient(135deg, #f97316, #ea580c)" label="Zone de service" value={2} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard icon={<FiAlertTriangle size={20} />} gradient="linear-gradient(135deg, #ef4444, #dc2626)" label="Documents proche expiration" value={0} />
          <StatCard icon={<FiDollarSign size={20} />} gradient="linear-gradient(135deg, #14b8a6, #0d9488)" label="Gain total" value="3 246.53" trend={5} />
          <StatCard icon={<FiTag size={20} />} gradient="linear-gradient(135deg, #a855f7, #9333ea)" label="Remise totale" value={8} />
        </div>
      </div>

      {/* ── Moto Taxi ── */}
      <div style={{ marginBottom: 32 }}>
        <SectionTitle
          title="Moto Taxi Statistiques"
          icon={<MdOutlineLocalTaxi size={18} />}
          color="linear-gradient(135deg, #f59e0b, #d97706)"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <StatCard icon={<FiActivity size={20} />} gradient="linear-gradient(135deg, #4680ff, #6366f1)" label="Nombre total de courses" value={54} trend={15} />
          <StatCard icon={<FiClock size={20} />} gradient="linear-gradient(135deg, #22c55e, #16a34a)" label="Ongoing Rides" value={0} />
          <StatCard icon={<FiXCircle size={20} />} gradient="linear-gradient(135deg, #ef4444, #dc2626)" label="Cancelled Rides" value={3} trend={-2} />
          <StatCard icon={<FiCheckCircle size={20} />} gradient="linear-gradient(135deg, #22c55e, #16a34a)" label="Completed Rides" value={24} trend={18} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard icon={<FiRepeat size={20} />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" label="Annulation automatique" value={27} />
          <StatCard icon={<FiDollarSign size={20} />} gradient="linear-gradient(135deg, #14b8a6, #0d9488)" label="Gain total" value="3 233.09" trend={10} />
          <StatCard icon={<FiTag size={20} />} gradient="linear-gradient(135deg, #a855f7, #9333ea)" label="Remise totale" value={0} />
        </div>
      </div>

      {/* ── Livraison ── */}
      <div style={{ marginBottom: 32 }}>
        <SectionTitle
          title="Livraison Statistiques"
          icon={<MdOutlineDeliveryDining size={18} />}
          color="linear-gradient(135deg, #22c55e, #16a34a)"
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          <StatCard icon={<FiActivity size={20} />} gradient="linear-gradient(135deg, #4680ff, #6366f1)" label="Nombre total de courses" value={13} />
          <StatCard icon={<FiClock size={20} />} gradient="linear-gradient(135deg, #22c55e, #16a34a)" label="Ongoing Rides" value={0} />
          <StatCard icon={<FiXCircle size={20} />} gradient="linear-gradient(135deg, #ef4444, #dc2626)" label="Cancelled Rides" value={3} trend={-5} />
          <StatCard icon={<FiCheckCircle size={20} />} gradient="linear-gradient(135deg, #22c55e, #16a34a)" label="Completed Rides" value={7} trend={3} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard icon={<FiRepeat size={20} />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" label="Annulation automatique" value={3} />
          <StatCard icon={<FiDollarSign size={20} />} gradient="linear-gradient(135deg, #14b8a6, #0d9488)" label="Gain total" value="13.44" />
          <StatCard icon={<FiTag size={20} />} gradient="linear-gradient(135deg, #a855f7, #9333ea)" label="Remise totale" value={8} />
        </div>
      </div>

      {/* ── Accès rapides ── */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0' }}>
          Accès rapides
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { label: 'Conducteurs en attente', link: '/drivers/pending', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
            { label: 'Courses taxi actives', link: '/taxi/rides/active', gradient: 'linear-gradient(135deg, #4680ff, #6366f1)' },
            { label: 'Livraisons actives', link: '/delivery/rides/active', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
            { label: 'Retraits en attente', link: '/transactions/cashout', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
            { label: 'Tickets support', link: '/support/customer-service', gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
          ].map((q, i) => (
            <a
              key={i}
              href={q.link}
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
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)' }}
            >
              {q.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
