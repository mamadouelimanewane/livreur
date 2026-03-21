import { useEffect, useState } from 'react'
import { FiHome, FiMapPin, FiUser, FiClock, FiStar, FiPhone, FiMessageSquare, FiCreditCard, FiSmartphone, FiCheckCircle, FiNavigation, FiArrowRight, FiMenu, FiBell, FiSearch, FiHeart, FiShield } from 'react-icons/fi'
import { MdOutlineLocalTaxi, MdDeliveryDining, MdOutlinePayments } from 'react-icons/md'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

const ACCENT = '#22c55e'
const DARK = '#1a1d2e'
const BG = '#f5f7fb'
const ORANGE = '#f59e0b'

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
})

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
})

const MOCK_DATA = {
  user: {
    name: 'Aïcha Diallo',
    phone: '+221 77 888 99 00',
    rating: 4.9,
    rides: 47,
    favorites: [
      { name: 'Maison', address: 'Médina, Dakar' },
      { name: 'Travail', address: 'Plateau, Dakar' },
    ]
  },
  recentDrivers: [
    { id: 1, name: 'Amadou D.', rating: 4.8, vehicle: 'Moto Yamaha', plate: 'DK-2023-A', photo: 'AD' },
    { id: 2, name: 'Fatou N.', rating: 4.9, vehicle: 'Moto Honda', plate: 'DK-2022-B', photo: 'FN' },
  ],
  promotions: [
    { code: 'BIENVENUE', discount: '20%', desc: 'Sur votre première course' },
    { code: 'WEEKEND', discount: '15%', desc: 'Ce week-end uniquement' },
  ],
  rideHistory: [
    { id: 'LIV-2849', from: 'Médina', to: 'Plateau', price: 1200, date: '21 Mars', status: 'completed', driver: 'Amadou D.' },
    { id: 'LIV-2845', from: 'Ouakam', to: 'Almadies', price: 2000, date: '19 Mars', status: 'completed', driver: 'Fatou N.' },
  ]
}

function MapCenter({ position }) {
  const map = useMap()
  useEffect(() => { map.setView(position, 14) }, [position, map])
  return null
}

function BottomTab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      padding: '8px 0', border: 'none', cursor: 'pointer', background: 'transparent',
      color: active ? ACCENT : '#94a3b8', transition: 'color 0.2s',
    }}>
      <span style={{ display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
    </button>
  )
}

// Écran d'accueil avec carte
function HomeTab({ onBookRide }) {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedService, setSelectedService] = useState('taxi')
  const [userPos] = useState([14.7167, -17.4677])
  const [showBooking, setShowBooking] = useState(false)

  const services = [
    { id: 'taxi', name: 'Taxi', icon: <MdOutlineLocalTaxi size={24} />, price: '1 200 FCFA', time: '3 min' },
    { id: 'delivery', name: 'Livraison', icon: <MdDeliveryDining size={24} />, price: '1 500 FCFA', time: '5 min' },
    { id: 'premium', name: 'Premium', icon: <FiStar size={24} />, price: '2 500 FCFA', time: '2 min' },
  ]

  const handleBook = () => {
    if (!pickup || !destination) {
      alert('Veuillez entrer le point de départ et la destination')
      return
    }
    setShowBooking(true)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Carte plein écran */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={userPos} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapCenter position={userPos} />
          <Marker position={userPos} icon={userIcon}>
            <Popup>Votre position</Popup>
          </Marker>
        </MapContainer>

        {/* Header overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '16px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700
              }}>AD</div>
              <div style={{ color: '#fff' }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Bonjour</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Aïcha</div>
              </div>
            </div>
            <button style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#fff', border: 'none', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <FiBell size={20} color={DARK} />
            </button>
          </div>
        </div>
      </div>

      {/* Panneau de réservation */}
      <div style={{
        background: '#fff', borderRadius: '24px 24px 0 0',
        padding: '20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        marginTop: '-20px', position: 'relative', zIndex: 10
      }}>
        {/* Champs de saisie */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            background: BG, borderRadius: 12, marginBottom: 8
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT }} />
            <input
              type="text"
              placeholder="D'où partez-vous?"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none' }}
            />
            <FiMapPin size={18} color="#94a3b8" />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            background: BG, borderRadius: 12
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <input
              type="text"
              placeholder="Où allez-vous?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none' }}
            />
            <FiNavigation size={18} color="#94a3b8" />
          </div>
        </div>

        {/* Services */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, overflowX: 'auto' }}>
          {services.map(service => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              style={{
                flex: '0 0 auto', padding: '12px 16px', borderRadius: 12,
                border: selectedService === service.id ? `2px solid ${ACCENT}` : '1px solid #e2e8f0',
                background: selectedService === service.id ? '#dcfce7' : '#fff',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: 'pointer', minWidth: 90
              }}
            >
              <span style={{ color: selectedService === service.id ? ACCENT : '#64748b' }}>{service.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{service.name}</span>
              <span style={{ fontSize: 10, color: ACCENT, fontWeight: 700 }}>{service.price}</span>
            </button>
          ))}
        </div>

        {/* Bouton réserver */}
        <button
          onClick={handleBook}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            background: `linear-gradient(135deg, ${ACCENT}, #16a34a)`,
            color: '#fff', border: 'none', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
        >
          Commander maintenant <FiArrowRight size={20} />
        </button>
      </div>

      {/* Modal de recherche de chauffeur */}
      {showBooking && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 300 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              border: `4px solid ${ACCENT}`, borderTopColor: 'transparent',
              margin: '0 auto 20px', animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h3 style={{ margin: '0 0 8px' }}>Recherche de chauffeur...</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>Un chauffeur sera bientôt disponible</p>
            <button
              onClick={() => {
                setShowBooking(false)
                onBookRide?.()
              }}
              style={{
                padding: '12px 24px', borderRadius: 10,
                background: ACCENT, color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Simuler acceptation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Écran activité/historique
function ActivityTab() {
  const [activeTab, setActiveTab] = useState('upcoming')

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ fontSize: 20, margin: '0 0 16px' }}>Vos courses</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'upcoming', label: 'À venir' },
          { id: 'completed', label: 'Terminées' },
          { id: 'cancelled', label: 'Annulées' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: activeTab === tab.id ? ACCENT : '#f1f5f9',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Liste des courses */}
      {MOCK_DATA.rideHistory.map((ride, i) => (
        <div key={i} style={{
          background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{ride.id}</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{ride.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
            <span style={{ fontSize: 13 }}>{ride.from}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ fontSize: 13 }}>{ride.to}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700
              }}>{ride.driver.split(' ').map(n => n[0]).join('')}</div>
              <span style={{ fontSize: 12 }}>{ride.driver}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{ride.price} FCFA</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Écran profil
function ProfileTab() {
  const menuItems = [
    { icon: <FiCreditCard size={20} />, label: 'Moyens de paiement', value: 'Orange Money, Wave' },
    { icon: <FiHeart size={20} />, label: 'Adresses favorites', value: '2 enregistrées' },
    { icon: <FiShield size={20} />, label: 'Sécurité', value: 'Vérifié' },
    { icon: <FiPhone size={20} />, label: 'Support', value: '24/7' },
  ]

  return (
    <div style={{ padding: '16px' }}>
      {/* Header profil */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK}, #2d1f5e)`,
        borderRadius: 20, padding: '24px', color: '#fff', textAlign: 'center', marginBottom: 20
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', fontSize: 28, fontWeight: 800
        }}>AD</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{MOCK_DATA.user.name}</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{MOCK_DATA.user.phone}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{MOCK_DATA.user.rating}</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>Note</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{MOCK_DATA.user.rides}</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>Courses</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      {menuItems.map((item, i) => (
        <button key={i} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px', background: '#fff', borderRadius: 12,
          border: 'none', marginBottom: 8, cursor: 'pointer', textAlign: 'left'
        }}>
          <span style={{ color: ACCENT }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{item.value}</div>
          </div>
          <FiArrowRight size={16} color="#94a3b8" />
        </button>
      ))}

      {/* Promotions */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Promotions</div>
        {MOCK_DATA.promotions.map((promo, i) => (
          <div key={i} style={{
            background: '#fef3c7', borderRadius: 12, padding: 12,
            marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ORANGE }}>{promo.code}</div>
              <div style={{ fontSize: 11, color: '#92400e' }}>{promo.desc}</div>
            </div>
            <span style={{
              background: ORANGE, color: '#fff', padding: '4px 10px',
              borderRadius: 8, fontSize: 12, fontWeight: 700
            }}>-{promo.discount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UserAppComplete() {
  const [tab, setTab] = useState('home')
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return (
      <div style={{
        minHeight: '100vh', background: `linear-gradient(135deg, ${ACCENT}, #16a34a)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, color: '#fff', textAlign: 'center'
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: 'rgba(255,255,255,0.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 24
        }}>
          <MdOutlineLocalTaxi size={50} />
        </div>
        <h1 style={{ fontSize: 36, margin: 0 }}>LiviGo</h1>
        <p style={{ fontSize: 16, opacity: 0.9, marginTop: 8 }}>Votre taxi, partout au Sénégal</p>
        <button
          onClick={() => setShowSplash(false)}
          style={{
            marginTop: 40, padding: '16px 48px', borderRadius: 30,
            background: '#fff', color: ACCENT, border: 'none',
            fontSize: 16, fontWeight: 700, cursor: 'pointer'
          }}
        >Commencer</button>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: 430, margin: '0 auto', minHeight: '100vh',
      background: BG, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'home' && <HomeTab onBookRide={() => setTab('activity')} />}
        {tab === 'activity' && <ActivityTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>

      <div style={{
        background: '#fff', borderTop: '1px solid #e2e8f0',
        display: 'flex', padding: '4px 0 8px',
      }}>
        <BottomTab icon={<FiHome size={22} />} label="Accueil" active={tab === 'home'} onClick={() => setTab('home')} />
        <BottomTab icon={<FiClock size={22} />} label="Activité" active={tab === 'activity'} onClick={() => setTab('activity')} />
        <BottomTab icon={<FiUser size={22} />} label="Profil" active={tab === 'profile'} onClick={() => setTab('profile')} />
      </div>
    </div>
  )
}
