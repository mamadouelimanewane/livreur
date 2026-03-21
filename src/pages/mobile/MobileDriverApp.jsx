import { useEffect, useState } from 'react'
import { FiHome, FiMapPin, FiDollarSign, FiUser, FiCheckCircle, FiXCircle, FiToggleLeft, FiToggleRight, FiTruck, FiPhone, FiStar, FiFileText, FiAlertCircle, FiCamera } from 'react-icons/fi'
import { MdOutlineLocalTaxi } from 'react-icons/md'
import {
  getMobileDriverEarnings,
  getMobileDriverHomeContent,
  getMobileDriverProfile,
} from '../../services/api/mobileService'
import DriverSplashScreen from './DriverSplashScreen'

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

import { supabase } from '../../services/api/supabaseClient'

import { decodePolyline } from '../../services/api/locationService'
import MapView from '../../components/MapView'

function HomeTab({ homeContent, setHomeContent, activeRideId }) {
  const [online, setOnline] = useState(true)
  const [routeCoords, setRouteCoords] = useState(null)

  const handleUpdateStatus = async (rideId, status) => {
    try {
      // Essayer d'abord Supabase
      const { error } = await supabase
        .from('rides')
        .update({ status })
        .eq('id', rideId)
      
      if (error) {
        console.warn('Supabase update failed, using local state:', error.message)
      }

      // Mettre à jour l'état local dans tous les cas
      setHomeContent(prev => ({ 
        ...prev, 
        incomingRequest: null,
        recentRides: [
          {
            id: 'LIV-' + Math.floor(Math.random() * 9000 + 1000),
            from: prev.incomingRequest?.pickup?.split(' - ')[0] || 'Départ',
            to: prev.incomingRequest?.destination?.split(' - ')[0] || 'Destination',
            price: prev.incomingRequest?.price || '1 500 FCFA',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            status: status === 'accepted' ? 'done' : 'cancel'
          },
          ...prev.recentRides.slice(0, 4)
        ]
      }))
      setRouteCoords(null)

      if (status === 'accepted') {
        alert("✅ Course acceptée ! Le client a été notifié.")
      } else {
        alert("❌ Course refusée.")
      }
    } catch (err) {
      console.error("Erreur mise à jour course:", err)
      alert("Erreur lors de la mise à jour. Veuillez réessayer.")
    }
  }

  // Simuler le tracé quand une demande arrive
  useEffect(() => {
    if (homeContent?.incomingRequest) {
      // Pour la démo, on trace un itinéraire fixe ou simulé si on n'a pas les coordonnées réelles
      setRouteCoords(decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@")) 
    }
  }, [homeContent?.incomingRequest])

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

      {homeContent.incomingRequest && (
        <div style={{
          background: '#fff', borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: 24,
          border: `2px solid ${ACCENT}20`,
          animation: 'pulse 1.5s infinite'
        }}>
          <div style={{ height: 150 }}>
            <MapView 
              height="150px" 
              zoom={13} 
              route={routeCoords}
              markers={[
                { position: [14.7167, -17.4677], label: "Départ" },
                { position: [14.73, -17.45], label: "Destination" }
              ]} 
            />
          </div>
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
              <button 
                onClick={() => handleUpdateStatus(homeContent.incomingRequest.db_id, 'accepted')}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  background: GREEN, color: '#fff', border: 'none',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Accepter</button>
              <button 
                onClick={() => handleUpdateStatus(homeContent.incomingRequest.db_id, 'rejected')}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  background: '#fee2e2', color: '#ef4444', border: 'none',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Refuser</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Tableau de bord actif
      </div>
      {activeRideId && (
        <div style={{
          background: '#fff', borderRadius: 20, padding: '16px',
          marginBottom: 24, boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: `1px solid ${ACCENT}20`,
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: ACCENT }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, animation: 'pulse 1.5s infinite' }} />
            COURSE EN COURS
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
             <button 
              onClick={() => alert("LiviPro : Caméra activée... Photo du colis enregistrée !")}
              style={{
                background: '#f8fafc', border: `1px dashed ${ACCENT}`, borderRadius: 12,
                flex: 1, padding: '12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 12, color: '#475569', fontWeight: 600, cursor: 'pointer'
              }}
             >
              <FiCamera size={16} /> LiviPro Photo
             </button>
             <button 
              onClick={() => handleUpdateStatus(activeRideId, 'completed')}
              style={{
                background: GREEN, color: '#fff', border: 'none', borderRadius: 12,
                flex: 1, padding: '12px 8px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                boxShadow: `0 4px 12px ${GREEN}40`
              }}
             >
              Terminer
             </button>
          </div>
        </div>
      )}

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

import ChatOverlay from '../../components/ChatOverlay'

export default function MobileDriverApp() {
  const [showSplash, setShowSplash] = useState(true)
  const [tab, setTab] = useState('home')
  const [homeContent, setHomeContent] = useState(null)
  const [activeRideId, setActiveRideId] = useState(null)
  const [earnings, setEarnings] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Afficher la page de garde au démarrage
  if (showSplash) {
    return <DriverSplashScreen onComplete={() => setShowSplash(false)} />
  }

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
    
    // Mise à jour de la position GPS du conducteur (Toutes les 10s)
    const locationInterval = setInterval(async () => {
      if (isMounted) {
        // En prod, utiliser navigator.geolocation.getCurrentPosition
        // Ici on simule un petit mouvement autour de Dakar pour la démo
        const lat = 14.7167 + (Math.random() - 0.5) * 0.01
        const lon = -17.4677 + (Math.random() - 0.5) * 0.01

        console.log("Mise à jour GPS conducteur:", lat, lon)
        
        // Mettre à jour dans Supabase (table 'drivers' créée précédemment)
        await supabase
          .from('drivers')
          .update({ 
            last_location: `(${lat},${lon})`,
            updated_at: new Date().toISOString()
          })
          .match({ id: 'DRIVER_ID_SIMULATED' }) // Remplacez par l'ID réel du conducteur
      }
    }, 10000)

    // Écoute des mises à jour des courses pour ce conducteur
    const subscription = supabase
      .channel('public:driver_rides')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rides' }, payload => {
        if (payload.new.status === 'accepted') {
          setActiveRideId(payload.new.id)
        } else if (payload.new.status === 'completed' || payload.new.status === 'cancelled') {
          setActiveRideId(null)
        }
      })
      .subscribe()

    return () => {
      isMounted = false
      clearInterval(locationInterval)
      supabase.removeChannel(subscription)
    }
  }, [])

  const statusBrand = homeContent?.brand || 'LiviGo Conducteur'

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: BG, display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); border-color: #4680ff; }
          100% { transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
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
            {tab === 'home' && homeContent && <HomeTab homeContent={homeContent} setHomeContent={setHomeContent} activeRideId={activeRideId} />}
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

      {activeRideId && (
        <ChatOverlay 
          rideId={String(activeRideId)} 
          currentUser="driver" 
        />
      )}
    </div>
  )
}
