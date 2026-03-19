import { useEffect, useState } from 'react'
import { FiMapPin, FiClock, FiStar, FiUser, FiHome, FiNavigation, FiPhone, FiPackage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdOutlineDeliveryDining } from 'react-icons/md'
import {
  getMobileUserHomeContent,
  getMobileUserProfile,
  getMobileUserRides,
} from '../../services/api/mobileService'

const ACCENT = '#4680ff'
const DARK = '#1a1d2e'
const BG = '#f5f7fb'

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

function ServiceCard({ icon, title, desc, gradient, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', borderRadius: 16, padding: '20px 18px',
      border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', gap: 14,
      transition: 'transform 0.2s, box-shadow 0.2s',
      width: '100%',
    }}
      onMouseEnter={event => { event.currentTarget.style.transform = 'translateY(-2px)'; event.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)' }}
      onMouseLeave={event => { event.currentTarget.style.transform = 'translateY(0)'; event.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 14, background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0,
      }}>
        <span style={{ color: '#fff', display: 'flex' }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
      </div>
    </button>
  )
}

function getServiceIcon(icon) {
  if (icon === 'taxi') {
    return <MdOutlineLocalTaxi size={24} />
  }
  if (icon === 'delivery') {
    return <MdOutlineDeliveryDining size={24} />
  }
  return <FiPackage size={22} />
}

function getQuickActionIcon(icon) {
  if (icon === 'clock') {
    return <FiClock size={20} />
  }
  if (icon === 'phone') {
    return <FiPhone size={20} />
  }
  return <FiNavigation size={20} />
}

function getProfileMenuIcon(icon) {
  if (icon === 'star') {
    return <FiStar size={18} />
  }
  if (icon === 'map-pin') {
    return <FiMapPin size={18} />
  }
  if (icon === 'phone') {
    return <FiPhone size={18} />
  }
  return <FiUser size={18} />
}

function HomeTab({ homeContent }) {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #2d1f5e 50%, ${ACCENT} 100%)`,
        borderRadius: 20, padding: '24px 20px', color: '#fff',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -10, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 13, opacity: 0.7 }}>{homeContent.welcomeTitle}</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{homeContent.brand}</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
          {homeContent.welcomeDescription}
        </div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>
        Nos services
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {homeContent.services.map(service => (
          <ServiceCard
            key={service.id}
            icon={getServiceIcon(service.icon)}
            title={service.title}
            desc={service.desc}
            gradient={service.gradient}
          />
        ))}
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>
        Actions rapides
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {homeContent.quickActions.map(action => (
          <div key={action.id} style={{
            background: '#fff', borderRadius: 14, padding: '18px 12px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: action.color + '15', color: action.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
            }}>{getQuickActionIcon(action.icon)}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{action.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RidesTab({ rides }) {
  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
        Mes courses
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rides.map(ride => (
          <div key={ride.id} style={{
            background: '#fff', borderRadius: 14, padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{ride.id}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: ride.type === 'Moto Taxi' ? '#fef3c7' : ride.type === 'Livraison' ? '#dcfce7' : '#dbeafe',
                  color: ride.type === 'Moto Taxi' ? '#b45309' : ride.type === 'Livraison' ? '#15803d' : '#1d4ed8',
                }}>{ride.type}</span>
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                color: ride.status === 'completed' ? '#22c55e' : '#ef4444',
              }}>
                {ride.status === 'completed' ? <FiCheckCircle size={12} /> : <FiAlertCircle size={12} />}
                {ride.status === 'completed' ? 'Terminée' : 'Annulée'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <FiMapPin size={12} color="#22c55e" />
              <span style={{ fontSize: 12, color: '#64748b' }}>{ride.from}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <FiNavigation size={12} color="#ef4444" />
              <span style={{ fontSize: 12, color: '#64748b' }}>{ride.to}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{ride.date}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{ride.price}</span>
            </div>
          </div>
        ))}
      </div>
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
        <div style={{ fontSize: 12, opacity: 0.6 }}>{profile.email}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {profile.stats.map((stat, index) => (
          <div key={index} style={{
            background: '#fff', borderRadius: 14, padding: '16px 12px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {profile.menu.map(item => (
          <button key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: '#fff', borderRadius: 12, padding: '14px 16px',
            border: 'none', cursor: 'pointer', width: '100%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            fontSize: 14, fontWeight: 500, color: '#334155',
            textAlign: 'left',
          }}>
            <span style={{ color: ACCENT, display: 'flex' }}>{getProfileMenuIcon(item.icon)}</span>
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

export default function MobileUserApp() {
  const [tab, setTab] = useState('home')
  const [homeContent, setHomeContent] = useState(null)
  const [rides, setRides] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMobileUserApp() {
      try {
        setLoading(true)
        setError('')
        const [nextHomeContent, nextRides, nextProfile] = await Promise.all([
          getMobileUserHomeContent(),
          getMobileUserRides(),
          getMobileUserProfile(),
        ])

        if (isMounted) {
          setHomeContent(nextHomeContent)
          setRides(nextRides)
          setProfile(nextProfile)
        }
      } catch {
        if (isMounted) {
          setError("Impossible de charger l'application mobile utilisateur.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMobileUserApp()

    return () => {
      isMounted = false
    }
  }, [])

  const statusBrand = homeContent?.brand || 'SÛR'
  const statusCity = homeContent?.city || 'Dakar, Sénégal'

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
        <span style={{ opacity: 0.6 }}>{statusCity}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {loading ? (
          <LoadingPanel message="Chargement de l'application..." />
        ) : error ? (
          <ErrorPanel message={error} />
        ) : (
          <>
            {tab === 'home' && homeContent && <HomeTab homeContent={homeContent} />}
            {tab === 'rides' && <RidesTab rides={rides} />}
            {tab === 'profile' && profile && <ProfileTab profile={profile} />}
          </>
        )}
      </div>

      <div style={{
        background: '#fff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        padding: '4px 0 8px',
        flexShrink: 0,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
      }}>
        <BottomTab icon={<FiHome size={20} />} label="Accueil" active={tab === 'home'} onClick={() => setTab('home')} />
        <BottomTab icon={<FiClock size={20} />} label="Courses" active={tab === 'rides'} onClick={() => setTab('rides')} />
        <BottomTab icon={<FiUser size={20} />} label="Profil" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}
