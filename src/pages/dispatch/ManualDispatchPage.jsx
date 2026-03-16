import { useState } from 'react'
import { FiSend, FiSearch, FiMapPin, FiUser, FiTruck } from 'react-icons/fi'
import { PageHeader, Btn, Card } from '../../components/PageLayout'

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #ddd',
  borderRadius: 5,
  fontSize: 13,
  color: '#4a5568',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#4a5568',
  marginBottom: 5,
}

const availableDrivers = [
  { id: 'DRV-001', name: 'Oumar Sall', vehicle: 'Moto', zone: 'Dakar Centre', distance: '0.8 km', rating: 4.8 },
  { id: 'DRV-003', name: 'Ibrahima Ba', vehicle: 'Moto', zone: 'Plateau', distance: '1.2 km', rating: 4.9 },
  { id: 'DRV-005', name: 'Abdoulaye Mbaye', vehicle: 'Voiture', zone: 'Dakar Centre', distance: '2.1 km', rating: 4.6 },
]

export default function ManualDispatchPage() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [client, setClient] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [serviceType, setServiceType] = useState('Moto Taxi')
  const [dispatched, setDispatched] = useState(false)

  const handleDispatch = () => {
    if (selectedDriver && pickup && dropoff) {
      setDispatched(true)
      setTimeout(() => setDispatched(false), 3000)
    }
  }

  return (
    <div>
      <PageHeader title="Dispatch Manuel" icon={<FiSend />} />

      {dispatched && (
        <div style={{
          background: '#e6faf4',
          border: '1px solid #2ed8a3',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          color: '#1a7a56',
          fontWeight: 600,
          fontSize: 13,
        }}>
          Course dispatchée avec succès au conducteur {availableDrivers.find(d => d.id === selectedDriver)?.name}!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: Form */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', margin: '0 0 20px 0' }}>
            Détails de la course
          </h3>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Type de service <span style={{ color: '#ff5370' }}>*</span></label>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={inputStyle}>
              {['Moto Taxi', 'Livraison Express', 'Taxi Premium', 'Livraison Alimentaire'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}><FiUser size={12} style={{ marginRight: 4 }} />Client</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Nom ou numéro de téléphone..."
                value={client}
                onChange={e => setClient(e.target.value)}
                style={inputStyle}
              />
              <FiSearch size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#a0aec0' }} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}><FiMapPin size={12} style={{ marginRight: 4 }} color="#2ed8a3" />Point de départ <span style={{ color: '#ff5370' }}>*</span></label>
            <input
              type="text"
              placeholder="Adresse de départ..."
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}><FiMapPin size={12} style={{ marginRight: 4 }} color="#ff5370" />Point d'arrivée <span style={{ color: '#ff5370' }}>*</span></label>
            <input
              type="text"
              placeholder="Adresse d'arrivée..."
              value={dropoff}
              onChange={e => setDropoff(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Notes supplémentaires</label>
            <textarea
              placeholder="Instructions spéciales pour le conducteur..."
              style={{ ...inputStyle, height: 80, resize: 'vertical' }}
            />
          </div>

          {pickup && dropoff && (
            <div style={{ background: '#f6f7fb', borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#718096', marginBottom: 4 }}>Estimation</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div><span style={{ fontSize: 11, color: '#a0aec0' }}>Distance</span><br /><strong>3.2 km</strong></div>
                <div><span style={{ fontSize: 11, color: '#a0aec0' }}>Durée</span><br /><strong>~8 min</strong></div>
                <div><span style={{ fontSize: 11, color: '#a0aec0' }}>Prix estimé</span><br /><strong style={{ color: '#2ed8a3' }}>780 FCFA</strong></div>
              </div>
            </div>
          )}

          <Btn
            color={selectedDriver ? '#2ed8a3' : '#ccc'}
            onClick={handleDispatch}
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
          >
            <FiSend size={14} /> Dispatcher la course
          </Btn>
        </Card>

        {/* Right: Available drivers */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2d3748', margin: '0 0 20px 0' }}>
            <FiTruck size={14} style={{ marginRight: 6 }} />Conducteurs disponibles
          </h3>

          <div style={{ marginBottom: 12 }}>
            <select style={inputStyle}>
              <option>Toutes zones</option>
              <option>Dakar Centre</option>
              <option>Plateau</option>
            </select>
          </div>

          {availableDrivers.map(d => (
            <div
              key={d.id}
              onClick={() => setSelectedDriver(selectedDriver === d.id ? null : d.id)}
              style={{
                border: selectedDriver === d.id ? '2px solid #4680ff' : '1px solid #edf2f7',
                borderRadius: 8,
                padding: '12px 14px',
                marginBottom: 10,
                cursor: 'pointer',
                background: selectedDriver === d.id ? '#ebf4ff' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#4680ff',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0,
                  }}>
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#2d3748' }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: '#718096' }}>{d.vehicle} · {d.zone}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#4680ff' }}>{d.distance}</div>
                  <div style={{ fontSize: 11, color: '#ffb64d' }}>★ {d.rating}</div>
                </div>
              </div>
              {selectedDriver === d.id && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#4680ff', fontWeight: 600 }}>
                  ✓ Sélectionné — cliquez à nouveau pour désélectionner
                </div>
              )}
            </div>
          ))}

          {availableDrivers.length === 0 && (
            <div style={{ textAlign: 'center', padding: 30, color: '#a0aec0', fontSize: 13 }}>
              Aucun conducteur disponible dans cette zone
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
