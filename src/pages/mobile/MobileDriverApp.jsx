import { useEffect, useState } from 'react'
import { FiHome, FiMapPin, FiDollarSign, FiUser, FiCheckCircle, FiXCircle, FiToggleLeft, FiToggleRight, FiTruck, FiPhone, FiStar, FiFileText, FiAlertCircle } from 'react-icons/fi'
import { MdOutlineLocalTaxi } from 'react-icons/md'
import {
  getMobileDriverEarnings,
  getMobileDriverHomeContent,
  getMobileDriverProfile,
} from '../../services/api/mobileService'

const ACCENT = '#4680ff'
const DARK = '#1a1d2e'
const BG = '#f5f7fb'
const GREEN = '#22c55e'
const ORANGE = '#f59e0b'

function BottomTab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '8px 0', border: 'none', cursor: 'pointer',
      background: 'transparent',
      color: active ? ACCENT : '#94a3b8',
      transition: 'color 0.2s',
    }}>
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
    </button>
  )
}

function StatMini({ value, label, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '16px 10px',
      textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flex: 1,
    }}>
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

function getDriverMenuIcon(icon) {
  if (icon === 'file-text') {
    return <FiFileText size={18} />
  }
  if (icon === 'star') {
    return <FiStar size={18} />
  }
  if (icon === 'phone') {
    return <FiPhone size={18} />
  }
  if (icon === 'alert-circle') {
    return <FiAlertCircle size={18} />
  }
  return <FiUser size={18} />
}

function HomeTab({ homeContent }) {
  const [online, setOnline] = useState(true)

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{
        background: online
          ? 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)'
          : 'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
        borderRadius: 20, padding: '20px', color: '#fff',
        marginBottom: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: 10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{homeContent.statusLabel}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>
              {online ? homeContent.onlineLabel : homeContent.offlineLabel}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
              {online ? homeContent.onlineDescription : homeContent.offlineDescription}
            </div>
          </div>
          <button onClick={() => setOnline(current => !current)} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 14,
            padding: '10px 14px', cursor: 'pointer', color: '#fff', display: 'flex',
            alignItems: 'center', gap: 6,
          }}>
            {online ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
          </button>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Aujourd'hui
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {homeContent.todayStats.map(stat => (
          <StatMini key={stat.label} value={stat.value} label={stat.label} color={stat.color} />
        ))}
      </div>

      <div style={{
        background: '#fff', borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 24,
        border: `2px solid ${ACCENT}20`,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
          padding: '14px 18px', color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MdOutlineLocalTaxi size={18} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>{homeContent.incomingRequest.title}</span>
          </div>
          <span style={{
            background: 'rgba(255,255,255,0.2)', padding: '3px 10px',
            borderRadius: 10, fontSize: 12, fontWeight: 700,
          }}>{homeContent.incomingRequest.price}</span>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
            <span style={{ fontSize: 13, color: '#334155' }}>{homeContent.incomingRequest.pickup}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: 13, color: '#334155' }}>{homeContent.incomingRequest.destination}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: GREEN, color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Accepter</button>
            <button style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: '#fee2e2', color: '#ef4444', border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Refuser</button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Courses récentes
      </div>
      {homeContent.recentRides.map(ride => (
        <div key={ride.id} style={{
          background: '#fff', borderRadius: 12, padding: '14px 16px',
          marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: ride.status === 'done' ? '#dcfce7' : '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {ride.status === 'done' ? <FiCheckCircle size={18} color={GREEN} /> : <FiXCircle size={18} color="#ef4444" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{ride.from} → {ride.to}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{ride.time} - {ride.id}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{ride.price}</div>
        </div>
      ))}
    </div>
  )
}

function EarningsTab({ earnings }) {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #2d1f5e 100%)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        marginBottom: 24, textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{earnings.weeklyTitle}</div>
        <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>{earnings.weeklyAmount}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          {earnings.highlights.map((item, index) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{item.label}</div>
              </div>
              {index < earnings.highlights.length - 1 && <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.15)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Détail par jour
      </div>
      {earnings.daily.map(day => (
        <div key={day.day} style={{
          background: '#fff', borderRadius: 12, padding: '14px 16px',
          marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{day.day}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{day.rides} courses</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: day.amount === '0' ? '#cbd5e1' : GREEN }}>
            {day.amount} FCFA
          </div>
        </div>
      ))}

      <button style={{
        width: '100%', padding: '16px', borderRadius: 14, marginTop: 16,
        background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
        color: '#fff', border: 'none', fontSize: 15, fontWeight: 700,
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(70,128,255,0.35)',
      }}>
        Demander un retrait
      </button>
    </div>
  )
}

function ProfileTab({ profile }) {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${DARK}, #2d1f5e)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        textAlign: 'center', marginBottom: 24,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', fontSize: 24, fontWeight: 800,
          boxShadow: '0 4px 16px rgba(70,128,255,0.4)',
        }}>{profile.initials}</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.name}</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{profile.phone}</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(34,197,94,0.2)', padding: '4px 12px',
          borderRadius: 12, marginTop: 8, fontSize: 12, fontWeight: 600,
        }}>
          <FiCheckCircle size={12} color={GREEN} />
          {profile.badge}
        </div>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, padding: '18px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiTruck size={16} color={ACCENT} />
          Mon véhicule
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {profile.vehicle.map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginTop: 2 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {profile.menu.map(item => (
          <button key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: '#fff', borderRadius: 12, padding: '14px 16px',
            border: 'none', cursor: 'pointer', width: '100%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            fontSize: 14, fontWeight: 500, color: '#334155', textAlign: 'left',
          }}>
            <span style={{ color: ACCENT, display: 'flex' }}>{getDriverMenuIcon(item.icon)}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function LoadingPanel({ message }) {
  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', color: '#64748b', textAlign: 'center' }}>
        {message}
      </div>
    </div>
  )
}

function ErrorPanel({ message }) {
  return (
    <div style={{ padding: '24px 16px' }}>
      <div style={{ background: '#fff0f3', border: '1px solid #ff5370', borderRadius: 16, padding: 16, color: '#c53030' }}>
        {message}
      </div>
    </div>
  )
}

export default function MobileDriverApp() {
  const [tab, setTab] = useState('home')
  const [homeContent, setHomeContent] = useState(null)
  const [earnings, setEarnings] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMobileDriverApp() {
      try {
        setLoading(true)
        setError('')
        const [nextHomeContent, nextEarnings, nextProfile] = await Promise.all([
          getMobileDriverHomeContent(),
          getMobileDriverEarnings(),
          getMobileDriverProfile(),
        ])

        if (isMounted) {
          setHomeContent(nextHomeContent)
          setEarnings(nextEarnings)
          setProfile(nextProfile)
        }
      } catch {
        if (isMounted) {
          setError("Impossible de charger l'application mobile conducteur.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMobileDriverApp()

    return () => {
      isMounted = false
    }
  }, [])

  const statusBrand = homeContent?.brand || 'SÛR Conducteur'

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      <div style={{
        background: DARK, padding: '10px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#fff', fontSize: 12, fontWeight: 600,
      }}>
        <span>{statusBrand}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} />
          <span style={{ opacity: 0.6, fontSize: 11 }}>En ligne</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {loading ? (
          <LoadingPanel message="Chargement de l'application..." />
        ) : error ? (
          <ErrorPanel message={error} />
        ) : (
          <>
            {tab === 'home' && homeContent && <HomeTab homeContent={homeContent} />}
            {tab === 'earnings' && earnings && <EarningsTab earnings={earnings} />}
            {tab === 'profile' && profile && <ProfileTab profile={profile} />}
          </>
        )}
      </div>

      <div style={{
        background: '#fff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex', padding: '4px 0 8px', flexShrink: 0,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
      }}>
        <BottomTab icon={<FiHome size={20} />} label="Accueil" active={tab === 'home'} onClick={() => setTab('home')} />
        <BottomTab icon={<FiDollarSign size={20} />} label="Gains" active={tab === 'earnings'} onClick={() => setTab('earnings')} />
        <BottomTab icon={<FiUser size={20} />} label="Profil" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}
