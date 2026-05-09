import { useEffect, useState } from 'react'
import { FiAlertTriangle, FiMapPin, FiCheck, FiUser, FiClock, FiPhone } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'
import { getActiveSOS, resolveSOS } from '../../services/api/safetyService'

const TYPE_COLORS = { emergency: '#ef4444', accident: '#f97316', suspicious: '#f59e0b', other: '#94a3b8' }
const TYPE_LABELS = { emergency: 'Urgence', accident: 'Accident', suspicious: 'Comportement suspect', other: 'Autre' }

function SOSCard({ alert, onResolve }) {
  const color = TYPE_COLORS[alert.type] || '#ef4444'
  const elapsed = Math.round((Date.now() - new Date(alert.created_at).getTime()) / 60000)

  return (
    <div style={{
      background: '#fff', borderRadius: 14,
      border: `2px solid ${color}40`,
      boxShadow: `0 0 0 4px ${color}10, 0 2px 12px rgba(0,0,0,0.06)`,
      padding: '18px 20px', marginBottom: 12,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: color, animation: 'sosbar 1.5s ease-in-out infinite alternate',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FiAlertTriangle size={22} color={color} />
          </div>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>
                🚨 {TYPE_LABELS[alert.type] || 'SOS'}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                background: color + '20', color,
              }}>
                ID: {String(alert.id).slice(-6)}
              </span>
            </div>
            {alert.user_id && (
              <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiUser size={11} /> Utilisateur: {alert.user_id}
              </div>
            )}
            {alert.ride_id && (
              <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                🚗 Course: {alert.ride_id}
              </div>
            )}
            {(alert.location_lat && alert.location_lon) && (
              <div style={{ fontSize: 12, color: '#4680ff', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <FiMapPin size={11} />
                {alert.location_lat.toFixed(4)}, {alert.location_lon.toFixed(4)}
                <a
                  href={`https://www.openstreetmap.org/?mlat=${alert.location_lat}&mlon=${alert.location_lon}&zoom=16`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: '#4680ff', textDecoration: 'underline' }}
                >
                  Voir sur carte
                </a>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: color, fontWeight: 700, marginBottom: 8 }}>
            <FiClock size={12} />
            {elapsed < 1 ? 'À l\'instant' : `il y a ${elapsed} min`}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{
              padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: '#4680ff', color: '#fff', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <FiPhone size={11} /> Appeler
            </button>
            <button onClick={() => onResolve(alert.id)} style={{
              padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: '#22c55e', color: '#fff', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <FiCheck size={11} /> Résolu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SOSPageAdmin() {
  const [alerts, setAlerts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState(null)

  const load = async () => {
    setLoading(true)
    const data = await getActiveSOS()
    setAlerts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleResolve = async (id) => {
    setResolving(id)
    await resolveSOS(id, 'admin')
    setAlerts(prev => prev.filter(a => a.id !== id))
    setResolving(null)
  }

  return (
    <div>
      <PageHeader title="Alertes SOS Actives" icon={<FiAlertTriangle />}>
        <Btn color="#ef4444" onClick={load}>Actualiser</Btn>
      </PageHeader>

      <style>{`
        @keyframes sosbar { 0%{opacity:1} 100%{opacity:0.4} }
      `}</style>

      {/* Banner urgence si alertes actives */}
      {!loading && alerts.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          borderRadius: 12, padding: '14px 20px', marginBottom: 20,
          color: '#fff', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <FiAlertTriangle size={24} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              {alerts.length} alerte{alerts.length > 1 ? 's' : ''} SOS active{alerts.length > 1 ? 's' : ''} — Intervention requise
            </div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
              Contactez immédiatement les utilisateurs concernés
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Chargement…</div>
      ) : alerts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Aucune alerte SOS active</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Toutes les alertes ont été résolues</div>
        </div>
      ) : (
        alerts.map(alert => (
          <SOSCard
            key={alert.id}
            alert={alert}
            onResolve={handleResolve}
          />
        ))
      )}
    </div>
  )
}
