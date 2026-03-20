import { useEffect, useState } from 'react'
import { FiMapPin, FiClock, FiStar, FiUser, FiHome, FiNavigation, FiPhone, FiPackage, FiCheckCircle, FiAlertCircle, FiMic, FiShield, FiShare, FiCamera } from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdOutlineDeliveryDining } from 'react-icons/md'
import {
  getMobileUserHomeContent,
  getMobileUserProfile,
  getMobileUserRides,
} from '../../services/api/mobileService'
import { supabase } from '../../services/api/supabaseClient'

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

function ServiceCard({ icon, title, desc, gradient, onClick, isNew }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', borderRadius: 20, padding: '18px',
      border: 'none', cursor: 'pointer', textAlign: 'left',
      boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', gap: 14,
      width: '100%', position: 'relative', overflow: 'hidden'
    }}
      onMouseEnter={event => { event.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={event => { event.currentTarget.style.transform = 'translateY(0)' }}
    >
      {isNew && (
        <div style={{
          position: 'absolute', top: 10, right: -25, background: 'linear-gradient(90deg, #ff4d4d, #f97316)',
          color: '#fff', fontSize: 9, fontWeight: 900, padding: '1px 30px', transform: 'rotate(45deg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>ÉLITE</div>
      )}
      <div style={{
        width: 50, height: 50, borderRadius: 14, background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0,
      }}>
        <span style={{ color: '#fff', display: 'flex' }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, fontWeight: 500 }}>{desc}</div>
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

import { locationService, decodePolyline } from '../../services/api/locationService'
import MapView from '../../components/MapView'

function HomeTab({ 
  homeContent, 
  driverLocation, 
  onSelectService, 
  selectedAddress, 
  setSelectedAddress, 
  setDistance, 
  routeCoords, 
  setRouteCoords, 
  mapCenter, 
  setMapCenter, 
  getCalculatedPrice 
}) {
  const [query, setQuery] = useState(selectedAddress?.display_name || '')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query.length < 3 || selectedAddress?.display_name === query) {
      setTimeout(() => setResults([]), 0)
      return
    }
    const timer = setTimeout(async () => {
      const data = await locationService.search(query)
      setResults(data || [])
    }, 500)
    return () => clearTimeout(timer)
  }, [query, selectedAddress])

  useEffect(() => {
    if (selectedAddress) {
      const fetchRoute = async () => {
        const start = [14.7167, -17.4677]
        const dest = [parseFloat(selectedAddress.lat), parseFloat(selectedAddress.lon)]
        const routeData = await locationService.getRoute(start[0], start[1], dest[0], dest[1])
        if (routeData) {
          setRouteCoords(decodePolyline(routeData.geometry))
          setDistance(routeData.distance)
          setMapCenter(dest)
        }
      }
      fetchRoute()
    } else {
      setRouteCoords(null); setDistance(0); setMapCenter([14.7167, -17.4677])
    }
  }, [selectedAddress])

  const handleVoiceSearch = () => {
    alert("LiviVoice : Parlez maintenant... (Simulation)")
    setTimeout(() => {
      setQuery("Dakar Plateau, Boulevard de la République")
    }, 1500)
  }

  const activeMarkers = [{ position: [14.7167, -17.4677], label: "Moi" }]
  if (selectedAddress) activeMarkers.push({ position: [parseFloat(selectedAddress.lat), parseFloat(selectedAddress.lon)], label: "Destination" })
  if (driverLocation) activeMarkers.push({ position: driverLocation, label: "Conducteur" })

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{ marginBottom: 20 }}>
        <MapView height="180px" center={driverLocation || mapCenter} zoom={selectedAddress || driverLocation ? 14 : 12} route={routeCoords} markers={activeMarkers} />
      </div>
      
      {/* Search with LiviVoice */}
      <div style={{ position: 'relative', marginBottom: 24, marginTop: -25 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <FiMapPin color={ACCENT} size={20} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Où allez-vous ?" style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, fontWeight: 500, color: '#334155' }} />
          <button onClick={handleVoiceSearch} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, cursor: 'pointer' }}>
            <FiMic size={18} />
          </button>
        </div>
        {results.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 12, marginTop: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: 200, overflowY: 'auto' }}>
            {results.map((res, i) => (
              <div key={i} onClick={() => { setSelectedAddress(res); setQuery(res.display_name); setResults([]) }} style={{ padding: '10px 16px', fontSize: 13, color: '#475569', borderBottom: i < results.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>{res.display_name}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, #2d1f5e 50%, ${ACCENT} 100%)`, borderRadius: 20, padding: '24px 20px', color: '#fff', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -10, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 13, opacity: 0.7 }}>{homeContent.welcomeTitle}</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{homeContent.brand}</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>{homeContent.welcomeDescription}</div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Services Élite</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {[
          ...homeContent.services,
          { id: 'eco', title: 'LiviEco (Moto Électrique)', desc: 'Zéro émission • Prioritaire', icon: 'delivery', gradient: 'linear-gradient(135deg, #10b981, #059669)', isNew: true }
        ].map(service => (
          <ServiceCard key={service.id} icon={getServiceIcon(service.icon)} title={service.title} desc={`${service.desc} • Estimé: ${getCalculatedPrice(service.title)}`} gradient={service.gradient} onClick={() => onSelectService(service)} isNew={service.isNew} />
        ))}
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 14 }}>Actions rapides</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {homeContent.quickActions.map(action => (
          <button key={action.id} style={{ background: '#fff', borderRadius: 16, padding: '16px 8px', border: 'none', cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ color: ACCENT, marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{getQuickActionIcon(action.icon)}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>{action.label}</div>
          </button>
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

function ProfileTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(profile.name)
  const [editedPhone, setEditedPhone] = useState(profile.phone)

  const handleUpdateProfile = async () => {
    setProfile({
      ...profile,
      name: editedName,
      phone: editedPhone,
      initials: editedName.split(' ').map(n => n[0]).join('').toUpperCase()
    })
    setIsEditing(false)
    alert("Profil mis à jour !")
  }

  return (
    <div style={{ padding: '0 16px 24px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${DARK}, #2d1f5e)`,
        borderRadius: 24, padding: '24px 20px', color: '#fff',
        textAlign: 'center', marginBottom: 20,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACCENT}, #6366f1)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', fontSize: 24, fontWeight: 800,
          boxShadow: '0 4px 16px rgba(70,128,255,0.4)',
          position: 'relative', zIndex: 1
        }}>{profile.initials}</div>
        
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input value={editedName} onChange={e => setEditedName(e.target.value)} style={{ padding: '8px', borderRadius: 8, border: 'none', textAlign: 'center' }} />
            <input value={editedPhone} onChange={e => setEditedPhone(e.target.value)} style={{ padding: '8px', borderRadius: 8, border: 'none', textAlign: 'center' }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
              <button onClick={handleUpdateProfile} style={{ padding: '6px 12px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>Sauvegarder</button>
              <button onClick={() => setIsEditing(false)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 6 }}>Annuler</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.name}</div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{profile.phone}</div>
          </>
        )}
      </div>

      {/* LiviWallet Card */}
      <div style={{
        background: '#fff', borderRadius: 20, padding: '20px',
        marginBottom: 24, boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: `1px solid ${ACCENT}20`
      }}>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mon LiviWallet</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: DARK, marginTop: 4 }}>{profile.balance || '5 450'} <span style={{ fontSize: 14, color: ACCENT }}>FCFA</span></div>
        </div>
        <button style={{
          background: ACCENT, color: '#fff', border: 'none', borderRadius: 12,
          padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer'
        }}>Recharger</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {profile.stats.map((stat, index) => (
          <div key={index} style={{ background: '#fff', borderRadius: 14, padding: '16px 12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 12, padding: '14px 16px', border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontSize: 14, fontWeight: 500, color: '#334155', textAlign: 'left' }}>
          <span style={{ color: ACCENT, display: 'flex' }}><FiUser size={18} /></span> Modifier profil
        </button>
        {profile.menu.slice(1).map(item => (
          <button key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 12, padding: '14px 16px', border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontSize: 14, fontWeight: 500, color: '#334155', textAlign: 'left' }}>
            <span style={{ color: ACCENT, display: 'flex' }}>{getProfileMenuIcon(item.icon)}</span> {item.label}
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
import PaymentModal from '../../components/PaymentModal'

export default function MobileUserApp() {
  const [tab, setTab] = useState('home')
  const [homeContent, setHomeContent] = useState(null)
  const [rides, setRides] = useState([])
  const [activeRideId, setActiveRideId] = useState(null)
  const [driverLocation, setDriverLocation] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // États pour la course et le paiement
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [distance, setDistance] = useState(0)
  const [routeCoords, setRouteCoords] = useState(null)
  const [mapCenter, setMapCenter] = useState([14.7167, -17.4677])
  const [showPayment, setShowPayment] = useState(false)
  const [pendingService, setPendingService] = useState(null)

  const getCalculatedPrice = (serviceTitle) => {
    if (distance === 0) return "---"
    const km = distance / 1000
    let rate = serviceTitle === 'Moto Taxi' ? 150 : serviceTitle === 'Livraison Express' ? 250 : 200
    const total = Math.max(500, Math.round(km * rate))
    return `${total} FCFA`
  }

  const handleRequestRide = async (service) => {
    try {
      const rawPrice = getCalculatedPrice(service.title).replace(' FCFA', '')
      const { error: err } = await supabase.from('rides').insert({
        pickup_address: 'Position actuelle (Dakar Plateau)',
        destination_address: selectedAddress.display_name,
        status: 'pending',
        price: parseInt(rawPrice),
        type: service.title,
        distance_meters: distance,
        payment_status: 'paid'
      }).select()

      if (err) throw err
      setSelectedAddress(null)
      alert("Votre paiement a été confirmé et votre demande envoyée !")
    } catch (err) {
      console.error("Erreur réservation:", err)
      alert("Erreur lors de l'envoi de la demande.")
    }
  }

  // Écoute des mises à jour GPS du conducteur (Temps Réel)
  useEffect(() => {
    if (!activeRideId) {
      setDriverLocation(null)
      return
    }
    const subscription = supabase
      .channel('public:drivers_location')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'drivers' }, payload => {
        const point = payload.new.last_location
        if (point) {
          const coords = point.replace(/[()]/g, '').split(',')
          setDriverLocation([parseFloat(coords[0]), parseFloat(coords[1])])
        }
      })
      .subscribe()
    return () => supabase.removeChannel(subscription)
  }, [activeRideId])

  // Écoute des changements de statut
  useEffect(() => {
    const subscription = supabase
      .channel('public:rides_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rides' }, payload => {
        if (payload.new.status === 'accepted') {
          setActiveRideId(payload.new.id)
          alert("Votre course a été acceptée !")
        }
      })
      .subscribe()
    return () => supabase.removeChannel(subscription)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const [h, r, p] = await Promise.all([getMobileUserHomeContent(), getMobileUserRides(), getMobileUserProfile()])
        setHomeContent(h); setRides(r); setProfile(p)
        const active = r.find(x => x.status === 'accepted')
        if (active) setActiveRideId(active.db_id || active.id)
      } catch { setError("Erreur de chargement") } finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: DARK, padding: '10px 20px', display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 12, fontWeight: 600 }}>
        <span>{homeContent?.brand || 'LiviGo'}</span><span style={{ opacity: 0.6 }}>Dakar, Sénégal</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16 }}>
        {loading ? (
          <LoadingPanel message="Chargement..." />
        ) : error ? (
          <ErrorPanel message={error} />
        ) : (
          <>
            {tab === 'home' && (
              <HomeTab 
                homeContent={homeContent} 
                driverLocation={driverLocation} 
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                setDistance={setDistance}
                routeCoords={routeCoords}
                setRouteCoords={setRouteCoords}
                mapCenter={mapCenter}
                setMapCenter={setMapCenter}
                getCalculatedPrice={getCalculatedPrice}
                onSelectService={(service) => {
                  if (!selectedAddress) {
                    alert("Veuillez d'abord sélectionner une destination.")
                    return
                  }
                  setPendingService(service)
                  setShowPayment(true)
                }}
              />
            )}
            {tab === 'rides' && <RidesTab rides={rides} />}
            {tab === 'profile' && profile && <ProfileTab profile={profile} setProfile={setProfile} />}
          </>
        )}
      </div>

      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', padding: '4px 0 8px', boxShadow: '0 -2px 10px rgba(0,0,0,0.04)' }}>
        <BottomTab icon={<FiHome size={20} />} label="Accueil" active={tab === 'home'} onClick={() => setTab('home')} />
        <BottomTab icon={<FiClock size={20} />} label="Courses" active={tab === 'rides'} onClick={() => setTab('rides')} />
        <BottomTab icon={<FiUser size={20} />} label="Profil" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>

      {showPayment && (
        <PaymentModal 
          amount={getCalculatedPrice(pendingService?.title)}
          onClose={() => setShowPayment(false)}
          onConfirm={() => {
            setShowPayment(false)
            handleRequestRide(pendingService)
          }}
        />
      )}

      {/* LiviSafe Security Pack */}
      {activeRideId && (
        <div style={{
          position: 'fixed', bottom: 85, right: 16,
          display: 'flex', flexDirection: 'column', gap: 12, zIndex: 1000
        }}>
          <button 
            onClick={() => {
              const text = `Suis mon trajet LiviGo en temps réel : https://livigo.app/track/${activeRideId}`
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
            }}
            style={{
              width: 48, height: 48, borderRadius: '50%', background: '#fff', color: '#22c55e',
              border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <FiShare size={20} />
          </button>
          <button 
            onClick={() => {
              if (confirm("🚨 ALERTE SOS 🚨\n\nSouhaitez-vous envoyer votre position actuelle aux services d'urgence et à vos contacts de confiance ?")) {
                alert("Alerte envoyée ! Le support LiviGo vous contacte immédiatement.")
              }
            }}
            style={{
              width: 48, height: 48, borderRadius: '50%', background: '#ef4444', color: '#fff',
              border: 'none', boxShadow: '0 4px 15px rgba(239,68,68,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <FiShield size={20} />
          </button>
        </div>
      )}

      {activeRideId && <ChatOverlay rideId={String(activeRideId)} currentUser="client" />}
    </div>
  )
}
