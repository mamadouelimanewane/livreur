import { useState, useEffect } from 'react'
import { FiShield, FiCheck, FiX, FiEye, FiClock, FiUser, FiFileText, FiCamera, FiAlertTriangle } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'
import { supabase } from '../../services/api/supabaseClient'

const MOCK_KYC = [
  {
    id: 'KYC-001', driver_id: 'DRV-010', driver_name: 'Moussa Ndiaye', phone: '+221 77 456 78 90',
    submitted_at: new Date(Date.now() - 3600000 * 2).toISOString(), status: 'pending',
    documents: [
      { type: 'id_card',       label: "Carte d'identité nationale", status: 'ok',      url: null },
      { type: 'driver_license',label: 'Permis de conduire',          status: 'ok',      url: null },
      { type: 'vehicle_photo', label: 'Photo du véhicule',           status: 'ok',      url: null },
      { type: 'selfie',        label: 'Selfie de vérification',      status: 'ok',      url: null },
    ],
    selfie_match: 92,
    risk_score: 12,
  },
  {
    id: 'KYC-002', driver_id: 'DRV-011', driver_name: 'Aissatou Barry', phone: '+221 76 321 00 11',
    submitted_at: new Date(Date.now() - 3600000 * 5).toISOString(), status: 'pending',
    documents: [
      { type: 'id_card',       label: "Carte d'identité nationale", status: 'ok',      url: null },
      { type: 'driver_license',label: 'Permis de conduire',          status: 'missing', url: null },
      { type: 'vehicle_photo', label: 'Photo du véhicule',           status: 'ok',      url: null },
      { type: 'selfie',        label: 'Selfie de vérification',      status: 'ok',      url: null },
    ],
    selfie_match: 87,
    risk_score: 35,
  },
  {
    id: 'KYC-003', driver_id: 'DRV-012', driver_name: 'Ibrahima Cissé', phone: '+221 70 987 65 43',
    submitted_at: new Date(Date.now() - 3600000 * 12).toISOString(), status: 'approved',
    documents: [
      { type: 'id_card',       label: "Carte d'identité nationale", status: 'ok',      url: null },
      { type: 'driver_license',label: 'Permis de conduire',          status: 'ok',      url: null },
      { type: 'vehicle_photo', label: 'Photo du véhicule',           status: 'ok',      url: null },
      { type: 'selfie',        label: 'Selfie de vérification',      status: 'ok',      url: null },
    ],
    selfie_match: 96,
    risk_score: 5,
  },
]

const DOC_ICONS = {
  id_card: '🪪',
  driver_license: '🚗',
  vehicle_photo: '🏍️',
  selfie: '🤳',
}

const STATUS_STYLE = {
  pending:  { label: 'En attente', color: '#f59e0b', bg: '#fef3c7' },
  approved: { label: 'Approuvé',   color: '#22c55e', bg: '#f0fdf4' },
  rejected: { label: 'Rejeté',     color: '#ef4444', bg: '#fef2f2' },
}

function KYCCard({ kyc, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false)
  const s = STATUS_STYLE[kyc.status]
  const elapsed = Math.round((Date.now() - new Date(kyc.submitted_at).getTime()) / 3600000)
  const missingDocs = kyc.documents.filter(d => d.status === 'missing').length
  const riskColor = kyc.risk_score < 20 ? '#22c55e' : kyc.risk_score < 50 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      background: '#fff', borderRadius: 14, marginBottom: 12,
      boxShadow: kyc.status === 'pending' ? `0 0 0 2px ${s.color}30, 0 2px 12px rgba(0,0,0,0.05)` : '0 1px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #4680ff, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#fff',
        }}>
          {kyc.driver_name.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{kyc.driver_name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: s.bg, color: s.color }}>
              {s.label}
            </span>
            {missingDocs > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#fef2f2', color: '#ef4444' }}>
                ⚠ {missingDocs} doc{missingDocs > 1 ? 's' : ''} manquant{missingDocs > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'flex', gap: 12 }}>
            <span><FiUser size={10} style={{ marginRight: 3 }} />{kyc.driver_id}</span>
            <span>{kyc.phone}</span>
            <span><FiClock size={10} style={{ marginRight: 3 }} />Il y a {elapsed}h</span>
          </div>
        </div>

        {/* Scores */}
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#4680ff' }}>{kyc.selfie_match}%</div>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Selfie match</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: riskColor }}>{kyc.risk_score}</div>
            <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>Score risque</div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: 12, color: '#64748b', cursor: 'pointer', flexShrink: 0 }}
        >
          <FiEye size={13} /> {expanded ? 'Réduire' : 'Voir'}
        </button>
      </div>

      {/* Documents */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            {kyc.documents.map((doc, i) => (
              <div key={i} style={{
                borderRadius: 10, border: `1px solid ${doc.status === 'ok' ? '#22c55e30' : '#ef444430'}`,
                background: doc.status === 'ok' ? '#f0fdf4' : '#fef2f2',
                padding: '12px 14px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{DOC_ICONS[doc.type]}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{doc.label}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: doc.status === 'ok' ? '#22c55e' : '#ef4444',
                }}>
                  {doc.status === 'ok' ? '✅ Reçu' : '❌ Manquant'}
                </div>
              </div>
            ))}
          </div>

          {/* Selfie AI check */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiCamera size={18} color="#4680ff" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Vérification IA du selfie</div>
              <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${kyc.selfie_match}%`, background: kyc.selfie_match >= 90 ? '#22c55e' : '#f59e0b', borderRadius: 3 }} />
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 900, color: kyc.selfie_match >= 90 ? '#22c55e' : '#f59e0b' }}>
              {kyc.selfie_match}%
            </span>
          </div>

          {/* Risk score detail */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiShield size={18} color={riskColor} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>Score de risque LiviProtect</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {kyc.risk_score < 20 ? 'Profil à faible risque — Recommandé' :
                 kyc.risk_score < 50 ? 'Profil à risque modéré — Vérification manuelle recommandée' :
                 'Profil à risque élevé — Vérification approfondie requise'}
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 900, color: riskColor }}>{kyc.risk_score}/100</span>
          </div>

          {/* Actions */}
          {kyc.status === 'pending' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => onApprove(kyc.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                }}
                disabled={missingDocs > 0}
              >
                <FiCheck size={14} /> Approuver le KYC
              </button>
              <button
                onClick={() => onReject(kyc.id)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <FiX size={14} /> Rejeter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function KYCVerificationPage() {
  const [kycList, setKycList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const load = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .order('submitted_at', { ascending: false })
      if (!error && data?.length > 0) {
        setKycList(data)
        setLoading(false)
        return
      }
    } catch { /* fallback */ }
    setKycList(MOCK_KYC)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (id) => {
    try {
      await supabase.from('kyc_verifications').update({ status: 'approved', reviewed_at: new Date().toISOString() }).eq('id', id)
    } catch { /* ignore */ }
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'approved' } : k))
  }

  const handleReject = async (id) => {
    try {
      await supabase.from('kyc_verifications').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id)
    } catch { /* ignore */ }
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: 'rejected' } : k))
  }

  const counts = {
    pending:  kycList.filter(k => k.status === 'pending').length,
    approved: kycList.filter(k => k.status === 'approved').length,
    rejected: kycList.filter(k => k.status === 'rejected').length,
  }

  const displayed = filter === 'all' ? kycList : kycList.filter(k => k.status === filter)

  return (
    <div>
      <PageHeader title="Vérification KYC — Conducteurs" icon={<FiShield />}>
        <Btn color="#4680ff" onClick={load}>Actualiser</Btn>
      </PageHeader>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total soumis',   value: kycList.length,    color: '#4680ff' },
          { label: 'En attente',     value: counts.pending,    color: '#f59e0b' },
          { label: 'Approuvés',      value: counts.approved,   color: '#22c55e' },
          { label: 'Rejetés',        value: counts.rejected,   color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filtre */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: '#f1f5f9', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {[['all', 'Tous'], ['pending', '⏳ En attente'], ['approved', '✅ Approuvés'], ['rejected', '❌ Rejetés']].map(([val, lbl]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '7px 16px', borderRadius: 8, border: 'none',
            background: filter === val ? '#fff' : 'transparent',
            color: filter === val ? '#4680ff' : '#64748b',
            fontWeight: filter === val ? 700 : 500, fontSize: 12,
            cursor: 'pointer', boxShadow: filter === val ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s',
          }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Info banner for pending */}
      {counts.pending > 0 && filter === 'pending' && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b20, #d97706 10%)',
          border: '1px solid #f59e0b40',
          borderRadius: 10, padding: '10px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fffbeb', borderColor: '#fbbf24',
        }}>
          <FiAlertTriangle size={16} color="#f59e0b" />
          <span style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>
            {counts.pending} conducteur{counts.pending > 1 ? 's' : ''} en attente de vérification KYC
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Chargement des vérifications KYC…</div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 14, color: '#94a3b8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Aucune vérification dans cette catégorie</div>
        </div>
      ) : (
        displayed.map(kyc => (
          <KYCCard key={kyc.id} kyc={kyc} onApprove={handleApprove} onReject={handleReject} />
        ))
      )}
    </div>
  )
}
