import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiUser, FiPhone, FiTruck, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi'
import PageLayout from '../../components/PageLayout'
import {
  getScheduledRides,
  updateScheduledRide,
  cancelScheduledRide,
  assignDriverToScheduledRide,
  getRecurrenceOptions,
  getWeekdays,
} from '../../services/api/scheduledRidesService'
import { getAvailableDrivers } from '../../services/api/dashboardService'

const ACCENT = '#4680ff'
const DARK = '#1a1d2e'
const GREEN = '#22c55e'
const RED = '#ef4444'

const STATUS_STYLES = {
  pending: { color: '#ffb64d', bg: '#fff8ee', label: 'En attente' },
  confirmed: { color: '#4680ff', bg: '#ebf4ff', label: 'Confirmée' },
  assigned: { color: '#2ed8a3', bg: '#e6faf4', label: 'Assignée' },
  cancelled: { color: '#ff5370', bg: '#fff0f3', label: 'Annulée' },
  completed: { color: '#6f42c1', bg: '#f3eeff', label: 'Terminée' },
}

function ScheduledRideCard({ ride, onAssign, onCancel }) {
  const style = STATUS_STYLES[ride.status] || STATUS_STYLES.pending
  
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 12,
      border: `1px solid ${style.bg}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              padding: '4px 10px', borderRadius: 8,
              background: style.bg, color: style.color,
              fontSize: 11, fontWeight: 600,
            }}>
              {style.label}
            </span>
            {ride.recurrence !== 'none' && (
              <span style={{
                padding: '4px 10px', borderRadius: 8,
                background: '#f3eeff', color: '#6f42c1',
                fontSize: 11, fontWeight: 600,
              }}>
                Récurrente
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            ID: {ride.id}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: DARK }}>
            {ride.estimatedPrice?.toLocaleString() || 0} FCFA
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <FiCalendar size={14} color={ACCENT} />
            <span style={{ fontSize: 12, color: '#64748b' }}>Date</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>
            {new Date(ride.scheduledDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <FiClock size={14} color={ACCENT} />
            <span style={{ fontSize: 12, color: '#64748b' }}>Heure</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>
            {ride.scheduledTime}
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <FiMapPin size={14} color={GREEN} style={{ marginTop: 3 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Départ</div>
            <div style={{ fontSize: 13, color: DARK }}>{ride.pickupAddress}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <FiMapPin size={14} color={RED} style={{ marginTop: 3 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Destination</div>
            <div style={{ fontSize: 13, color: DARK }}>{ride.destinationAddress}</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px', background: '#f8fafc', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiUser size={14} color={ACCENT} />
          <span style={{ fontSize: 13, color: DARK }}>{ride.userName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiPhone size={14} color={ACCENT} />
          <span style={{ fontSize: 13, color: DARK }}>{ride.userPhone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiTruck size={14} color={ACCENT} />
          <span style={{ fontSize: 13, color: DARK }}>{ride.serviceType}</span>
        </div>
      </div>
      
      {ride.driverName && (
        <div style={{ padding: '12px', background: '#e6faf4', borderRadius: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, marginBottom: 4 }}>Conducteur assigné</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{ride.driverName}</div>
        </div>
      )}
      
      {ride.status !== 'cancelled' && ride.status !== 'completed' && (
        <div style={{ display: 'flex', gap: 8 }}>
          {ride.status === 'pending' && (
            <button
              onClick={() => onAssign(ride)}
              style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: GREEN, color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <FiCheck size={16} /> Assigner
            </button>
          )}
          <button
            onClick={() => onCancel(ride.id)}
            style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: '#fee2e2', color: RED, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <FiX size={16} /> Annuler
          </button>
        </div>
      )}
    </div>
  )
}

function AssignDriverModal({ ride, drivers, onClose, onConfirm }) {
  const [selectedDriver, setSelectedDriver] = useState(null)
  
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 24,
        width: 400, maxHeight: '80vh', overflowY: 'auto',
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 16 }}>
          Assigner un conducteur
        </div>
        
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
          Course: {ride.pickupAddress} → {ride.destinationAddress}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {drivers.map(driver => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(driver.id)}
              style={{
                padding: 12, borderRadius: 10, border: `2px solid ${selectedDriver === driver.id ? ACCENT : '#e2e8f0'}`,
                background: selectedDriver === driver.id ? `${ACCENT}10` : '#fff',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{driver.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{driver.vehicle} • {driver.distance}</div>
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', borderRadius: 10,
              background: '#f1f5f9', color: '#475569', border: 'none',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(ride.id, selectedDriver)}
            disabled={!selectedDriver}
            style={{
              flex: 1, padding: '12px', borderRadius: 10,
              background: selectedDriver ? ACCENT : '#e2e8f0',
              color: selectedDriver ? '#fff' : '#94a3b8',
              border: 'none', fontSize: 14, fontWeight: 600, cursor: selectedDriver ? 'pointer' : 'not-allowed',
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ScheduledRidesPage() {
  const [filter, setFilter] = useState('all')
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignModal, setAssignModal] = useState(null)
  const [availableDrivers, setAvailableDrivers] = useState([])

  useEffect(() => {
    loadData()
  }, [filter])

  const loadData = async () => {
    setLoading(true)
    try {
      const filters = filter === 'all' ? {} : { status: filter }
      const [ridesData, driversData] = await Promise.all([
        getScheduledRides(filters),
        getAvailableDrivers(),
      ])
      setRides(ridesData)
      setAvailableDrivers(driversData)
    } catch (err) {
      console.error('Error loading scheduled rides:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = (ride) => {
    setAssignModal(ride)
  }

  const handleCancel = async (rideId) => {
    if (confirm('Voulez-vous vraiment annuler cette course programmée ?')) {
      await cancelScheduledRide(rideId, 'Annulée par l\'administrateur')
      loadData()
    }
  }

  const handleConfirmAssign = async (rideId, driverId) => {
    const driver = availableDrivers.find(d => d.id === driverId)
    await assignDriverToScheduledRide(rideId, driverId, driver?.name)
    setAssignModal(null)
    loadData()
  }

  return (
    <PageLayout 
      title="Courses Programmées"
      subtitle={`${rides.length} course(s)`}
      actions={
        <button onClick={loadData} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f1f5f9', color: '#475569', border: 'none',
          padding: '10px 16px', borderRadius: 10, fontSize: 13,
          fontWeight: 600, cursor: 'pointer',
        }}>
          <FiRefreshCw size={16} /> Actualiser
        </button>
      }
    >
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'pending', 'confirmed', 'assigned', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: filter === f ? ACCENT : '#f1f5f9',
              color: filter === f ? '#fff' : '#475569',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {f === 'all' ? 'Toutes' : STATUS_STYLES[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Rides List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Chargement...
        </div>
      ) : rides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Aucune course programmée
        </div>
      ) : (
        <div>
          {rides.map(ride => (
            <ScheduledRideCard
              key={ride.id}
              ride={ride}
              onAssign={handleAssign}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <AssignDriverModal
          ride={assignModal}
          drivers={availableDrivers}
          onClose={() => setAssignModal(null)}
          onConfirm={handleConfirmAssign}
        />
      )}
    </PageLayout>
  )
}
