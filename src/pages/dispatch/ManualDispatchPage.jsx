import { useState, useEffect } from 'react'
import { FiSend, FiSearch, FiMapPin, FiUser, FiTruck, FiCheckCircle, FiAlertCircle, FiLoader, FiPhone, FiStar } from 'react-icons/fi'
import { PageHeader, Btn, Card } from '../../components/PageLayout'
import { getAvailableDrivers, dispatchRide } from '../../services/api/dashboardService'
import { locationService } from '../../services/api/locationService'

const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 13, color: '#334155', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: '#475569', marginBottom: 6,
}

const SERVICE_TYPES = ['Moto Taxi', 'Livraison Express', 'Taxi Premium', 'Livraison Alimentaire']

const SERVICE_RATES = {
  'Moto Taxi': 150,
  'Livraison Express': 250,
  'Taxi Premium': 200,
  'Livraison Alimentaire': 220,
}

/* ─── Estimation tarifaire ─── */
function EstimationCard({ pickup, dropoff, distance, duration, serviceType, loading }) {
  if (!pickup || !dropoff) return null
  const km = (distance || 0) / 1000
  const rate = SERVICE_RATES[serviceType] || 150
  const price = Math.max(500, Math.round(km * rate))

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
        Estimation du trajet
      </div>
      {loading ? (
        <div style={{ color: '#94a3b8', fontSize: 12 }}>Calcul en cours…</div>
      ) : (
        <div style={{ display: 'flex', gap: 20 }}>
          <div>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>Distance</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
              {km > 0 ? `${km.toFixed(1)} km` : '—'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>Durée</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
              {duration ? `~${Math.round(duration / 60)} min` : '—'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>Prix estimé</span>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>
              {km > 0 ? `${price.toLocaleString()} FCFA` : '—'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Carte conducteur disponible ─── */
function DriverCard({ driver, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(driver.id === selected ? null : driver.id)}
      style={{
        border: selected ? '2px solid #4680ff' : '1px solid #e2e8f0',
        borderRadius: 12, padding: '12px 14px', marginBottom: 10,
        cursor: 'pointer', background: selected ? '#ebf4ff' : '#fff',
        transition: 'all 0.15s', boxShadow: selected ? '0 0 0 3px rgba(70,128,255,0.15)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: selected ? '#4680ff' : 'linear-gradient(135deg, #4680ff, #6366f1)',
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(70,128,255,0.3)',
          }}>
            {driver.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{driver.name}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {driver.vehicle} · {driver.zone}
            </div>
            {driver.phone && (
              <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <FiPhone size={10} /> {driver.phone}
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {driver.distance && (
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4680ff' }}>{driver.distance}</div>
          )}
          {driver.rating && (
            <div style={{ fontSize: 11, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginTop: 2 }}>
              <FiStar size={11} /> {driver.rating}
            </div>
          )}
        </div>
      </div>
      {selected && (
        <div style={{ marginTop: 8, fontSize: 11, color: '#4680ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiCheckCircle size={12} /> Sélectionné — cliquez à nouveau pour désélectionner
        </div>
      )}
    </div>
  )
}

/* ─── Alerte résultat dispatch ─── */
function DispatchAlert({ status, message, onClose }) {
  if (!status) return null
  const isSuccess = status === 'success'
  return (
    <div style={{
      background: isSuccess ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${isSuccess ? '#86efac' : '#fca5a5'}`,
      borderRadius: 10, padding: '12px 16px', marginBottom: 16,
      color: isSuccess ? '#166534' : '#b91c1c',
      fontWeight: 600, fontSize: 13,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isSuccess ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
        {message}
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'inherit', lineHeight: 1 }}>×</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Page principale
═══════════════════════════════════════════════ */
export default function ManualDispatchPage() {
  // Formulaire
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [client, setClient] = useState('')
  const [notes, setNotes] = useState('')
  const [serviceType, setServiceType] = useState('Moto Taxi')
  const [selectedDriver, setSelectedDriver] = useState(null)

  // Conducteurs
  const [drivers, setDrivers] = useState([])
  const [driversLoading, setDriversLoading] = useState(true)
  const [zoneFilter, setZoneFilter] = useState('Toutes zones')

  // Estimation itinéraire
  const [routeEstimation, setRouteEstimation] = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)

  // Dispatch
  const [dispatching, setDispatching] = useState(false)
  const [alert, setAlert] = useState(null) // { status: 'success'|'error', message }

  /* ── Chargement des conducteurs disponibles ── */
  useEffect(() => {
    let active = true
    setDriversLoading(true)
    getAvailableDrivers()
      .then(data => { if (active) setDrivers(data) })
      .catch(() => { if (active) setDrivers([]) })
      .finally(() => { if (active) setDriversLoading(false) })
    return () => { active = false }
  }, [])

  /* ── Calcul de l'itinéraire via LocationIQ ── */
  useEffect(() => {
    if (!pickup || !dropoff) {
      setRouteEstimation(null)
      return
    }
    const timer = setTimeout(async () => {
      setRouteLoading(true)
      try {
        // Géocodage du pickup
        const [pickupResults, dropoffResults] = await Promise.all([
          locationService.search(pickup),
          locationService.search(dropoff),
        ])
        const from = pickupResults?.[0]
        const to   = dropoffResults?.[0]
        if (from && to) {
          const route = await locationService.getRoute(
            parseFloat(from.lat), parseFloat(from.lon),
            parseFloat(to.lat),   parseFloat(to.lon)
          )
          setRouteEstimation(route)
        }
      } catch {
        setRouteEstimation(null)
      } finally {
        setRouteLoading(false)
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [pickup, dropoff])

  /* ── Filtrage des conducteurs par zone ── */
  const zones = ['Toutes zones', ...new Set(drivers.map(d => d.zone).filter(Boolean))]
  const filteredDrivers = zoneFilter === 'Toutes zones'
    ? drivers
    : drivers.filter(d => d.zone === zoneFilter)

  /* ── Dispatch ── */
  const handleDispatch = async () => {
    if (!selectedDriver || !pickup || !dropoff) return
    setDispatching(true)
    setAlert(null)
    try {
      const km = (routeEstimation?.distance || 0) / 1000
      const rate = SERVICE_RATES[serviceType] || 150
      const price = Math.max(500, Math.round(km * rate))

      await dispatchRide({
        pickup,
        dropoff,
        client,
        driverId: selectedDriver,
        serviceType,
        notes,
        price,
        distance: routeEstimation?.distance || 0,
      })
      const driverName = drivers.find(d => d.id === selectedDriver)?.name || selectedDriver
      setAlert({ status: 'success', message: `✅ Course dispatchée avec succès au conducteur ${driverName} !` })
      // Reset du formulaire
      setPickup('')
      setDropoff('')
      setClient('')
      setNotes('')
      setSelectedDriver(null)
      setRouteEstimation(null)
    } catch (err) {
      console.error('Dispatch error:', err)
      setAlert({ status: 'error', message: `Erreur lors du dispatch : ${err.message || 'Veuillez réessayer.'}` })
    } finally {
      setDispatching(false)
    }
  }

  const canDispatch = selectedDriver && pickup && dropoff && !dispatching

  return (
    <div>
      <PageHeader title="Dispatch Manuel" icon={<FiSend />} />

      <DispatchAlert
        status={alert?.status}
        message={alert?.message}
        onClose={() => setAlert(null)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* ── Colonne gauche : Formulaire ── */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: '0 0 20px 0' }}>
            Détails de la course
          </h3>

          {/* Type de service */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Type de service <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={inputStyle}>
              {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Client */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              <FiUser size={12} style={{ marginRight: 4 }} />Client
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Nom ou numéro de téléphone..."
                value={client}
                onChange={e => setClient(e.target.value)}
                style={inputStyle}
              />
              <FiSearch size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          {/* Pickup */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              <FiMapPin size={12} style={{ marginRight: 4, color: '#22c55e' }} />
              Point de départ <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ex : Dakar Plateau, Rue Félix Eboué..."
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: pickup ? '#22c55e' : '#e2e8f0',
                boxShadow: pickup ? '0 0 0 3px rgba(34,197,94,0.1)' : 'none',
              }}
            />
          </div>

          {/* Dropoff */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              <FiMapPin size={12} style={{ marginRight: 4, color: '#ef4444' }} />
              Point d'arrivée <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ex : Ouakam, Cité Avion..."
              value={dropoff}
              onChange={e => setDropoff(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: dropoff ? '#ef4444' : '#e2e8f0',
                boxShadow: dropoff ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
              }}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Notes supplémentaires</label>
            <textarea
              placeholder="Instructions spéciales pour le conducteur..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ ...inputStyle, height: 72, resize: 'vertical' }}
            />
          </div>

          {/* Estimation */}
          <EstimationCard
            pickup={pickup}
            dropoff={dropoff}
            distance={routeEstimation?.distance}
            duration={routeEstimation?.duration}
            serviceType={serviceType}
            loading={routeLoading}
          />

          {/* Bouton dispatch */}
          <button
            onClick={handleDispatch}
            disabled={!canDispatch}
            style={{
              width: '100%', padding: '12px', borderRadius: 10,
              background: canDispatch
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : '#e2e8f0',
              color: canDispatch ? '#fff' : '#94a3b8',
              border: 'none', fontSize: 14, fontWeight: 700,
              cursor: canDispatch ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: canDispatch ? '0 4px 14px rgba(34,197,94,0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {dispatching ? (
              <>
                <FiLoader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Dispatch en cours…
              </>
            ) : (
              <>
                <FiSend size={16} />
                {!selectedDriver ? 'Sélectionnez un conducteur' : !pickup || !dropoff ? 'Renseignez les adresses' : 'Dispatcher la course'}
              </>
            )}
          </button>
        </Card>

        {/* ── Colonne droite : Conducteurs ── */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', margin: 0 }}>
              <FiTruck size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Conducteurs disponibles
            </h3>
            {!driversLoading && (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4680ff', background: '#ebf4ff', padding: '3px 10px', borderRadius: 12 }}>
                {filteredDrivers.length} en ligne
              </span>
            )}
          </div>

          {/* Filtre zone */}
          <div style={{ marginBottom: 14 }}>
            <select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            >
              {zones.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>

          {/* Liste */}
          <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
            {driversLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{
                  height: 68, borderRadius: 12, marginBottom: 10,
                  background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
                }} />
              ))
            ) : filteredDrivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: 13 }}>
                <FiTruck size={32} style={{ opacity: 0.3, marginBottom: 10, display: 'block', margin: '0 auto 10px' }} />
                Aucun conducteur disponible dans cette zone
              </div>
            ) : (
              filteredDrivers.map(d => (
                <DriverCard
                  key={d.id}
                  driver={d}
                  selected={selectedDriver === d.id}
                  onSelect={setSelectedDriver}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
