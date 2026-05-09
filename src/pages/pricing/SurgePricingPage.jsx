import { useEffect, useState } from 'react'
import { FiZap, FiSliders, FiTrendingUp, FiCheck, FiX } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'
import { getAllZonesSurge, setManualSurge, deactivateSurge, getSurgeColor } from '../../services/api/surgePricingService'

const MULTIPLIER_OPTIONS = [1.0, 1.2, 1.5, 1.7, 2.0, 2.5, 3.0]
const DURATION_OPTIONS   = [15, 30, 60, 120, 240]

function DemandBar({ level, demand }) {
  const pct = Math.min(100, (demand / 20) * 100)
  const color = level === 'critical' ? '#ef4444' : level === 'high' ? '#f97316' : level === 'medium' ? '#f59e0b' : '#22c55e'
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#64748b' }}>Demande actuelle</span>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{demand} requêtes</span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

function ZoneCard({ zone, onActivate, onDeactivate }) {
  const surgeColor = getSurgeColor(zone.multiplier)
  const isActive   = zone.multiplier > 1

  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '18px 20px',
      boxShadow: isActive ? `0 0 0 2px ${surgeColor}40, 0 2px 12px rgba(0,0,0,0.06)` : '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{zone.zone}</div>
          {zone.label && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{zone.label}</div>}
        </div>
        <div style={{
          fontSize: 20, fontWeight: 900, color: surgeColor,
          background: surgeColor + '15', padding: '4px 12px', borderRadius: 20,
        }}>
          ×{zone.multiplier.toFixed(1)}
        </div>
      </div>

      <DemandBar level={zone.demandLevel} demand={zone.demand} />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={() => onActivate(zone.zone)}
          style={{
            flex: 1, padding: '7px 0', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <FiZap size={12} /> Activer surge
        </button>
        {isActive && (
          <button
            onClick={() => onDeactivate(zone.zone)}
            style={{
              padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
              background: '#fff', color: '#64748b', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <FiX size={12} /> Désactiver
          </button>
        )}
      </div>
    </div>
  )
}

function SurgeModal({ zone, onClose, onSave }) {
  const [multiplier, setMultiplier] = useState(1.5)
  const [duration, setDuration]     = useState(60)
  const [label, setLabel]           = useState('')
  const [saving, setSaving]         = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave({ zone, multiplier, durationMinutes: duration, label: label || `Surge ×${multiplier}` })
    setSaving(false)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
          <FiZap size={16} style={{ marginRight: 8, color: '#f59e0b', verticalAlign: 'middle' }} />
          Activer Surge — {zone}
        </h3>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>
            Multiplicateur de prix
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {MULTIPLIER_OPTIONS.map(m => (
              <button key={m} onClick={() => setMultiplier(m)} style={{
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                background: multiplier === m ? getSurgeColor(m) : '#f1f5f9',
                color: multiplier === m ? '#fff' : '#475569',
                transition: 'all 0.15s',
              }}>
                ×{m.toFixed(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>
            Durée d'application
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DURATION_OPTIONS.map(d => (
              <button key={d} onClick={() => setDuration(d)} style={{
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: duration === d ? '#4680ff' : '#f1f5f9',
                color: duration === d ? '#fff' : '#475569',
                transition: 'all 0.15s',
              }}>
                {d < 60 ? `${d} min` : `${d / 60}h`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
            Raison (optionnel)
          </label>
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Ex : Pluie, Événement, Heure de pointe..."
            style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        {/* Aperçu */}
        <div style={{ background: getSurgeColor(multiplier) + '12', border: `1px solid ${getSurgeColor(multiplier)}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Aperçu : une course à 1 500 FCFA deviendra</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: getSurgeColor(multiplier), marginTop: 4 }}>
            {(1500 * multiplier).toLocaleString('fr-FR')} FCFA
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: '10px', borderRadius: 8, border: 'none',
            background: saving ? '#e2e8f0' : `linear-gradient(135deg, ${getSurgeColor(multiplier)}, ${getSurgeColor(multiplier)}cc)`,
            color: saving ? '#94a3b8' : '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <FiCheck size={14} />
            {saving ? 'Activation…' : `Activer ×${multiplier.toFixed(1)} pour ${duration < 60 ? duration + ' min' : duration / 60 + 'h'}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SurgePricingPage() {
  const [zones, setZones]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [toast, setToast]       = useState(null)

  const load = async () => {
    setLoading(true)
    const data = await getAllZonesSurge()
    setZones(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async (params) => {
    await setManualSurge(params)
    await load()
    setToast(`✅ Surge ×${params.multiplier.toFixed(1)} activé sur ${params.zone}`)
    setTimeout(() => setToast(null), 4000)
  }

  const handleDeactivate = async (zone) => {
    await deactivateSurge(zone)
    await load()
    setToast(`✅ Surge désactivé sur ${zone}`)
    setTimeout(() => setToast(null), 3000)
  }

  const activeCount = zones.filter(z => z.multiplier > 1).length

  return (
    <div>
      <PageHeader title="Surge Pricing" icon={<FiZap />}>
        <Btn color="#f59e0b" onClick={load}>
          <FiSliders size={14} /> Actualiser
        </Btn>
      </PageHeader>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 20, zIndex: 9999,
          background: '#1e293b', color: '#fff', padding: '12px 20px',
          borderRadius: 12, fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'slideInRight 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* Résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Zones avec surge</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b' }}>{activeCount}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>sur {zones.length} zones</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Surge max actif</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>
            ×{zones.length > 0 ? Math.max(...zones.map(z => z.multiplier)).toFixed(1) : '1.0'}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Revenu estimé +surge</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e' }}>
            +{activeCount > 0 ? Math.round(activeCount * 12) : 0}%
          </div>
        </div>
      </div>

      {/* Grille de zones */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Chargement des zones…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {zones.map(z => (
            <ZoneCard
              key={z.zone}
              zone={z}
              onActivate={(zone) => setModal(zone)}
              onDeactivate={handleDeactivate}
            />
          ))}
        </div>
      )}

      {modal && (
        <SurgeModal
          zone={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <style>{`
        @keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  )
}
