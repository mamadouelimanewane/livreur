import { useState } from 'react'
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, TextInput, Select, Badge } from '../../components/PageLayout'
import { exportCSV } from '../../services/api/exportService'

const MOCK_PROMOS = [
  { id: 'PROMO-001', code: 'BIENVENUE20',  type: 'Pourcentage', value: '20%',        target: 'Nouveaux',    uses: 142, maxUses: 500, starts: '01/03/2024', ends: '31/03/2024',  status: 'Actif' },
  { id: 'PROMO-002', code: 'LIVRAISON500', type: 'Montant fixe', value: '500 FCFA',  target: 'Tous',        uses: 67,  maxUses: 200, starts: '15/03/2024', ends: '15/04/2024', status: 'Actif' },
  { id: 'PROMO-003', code: 'WEEKEND30',   type: 'Pourcentage', value: '30%',         target: 'Récurrents',  uses: 200, maxUses: 200, starts: '01/02/2024', ends: '28/02/2024', status: 'Épuisé' },
  { id: 'PROMO-004', code: 'DAKAR10',     type: 'Pourcentage', value: '10%',         target: 'Zone Dakar',  uses: 0,   maxUses: 1000, starts: '01/04/2024', ends: '30/04/2024', status: 'Planifié' },
  { id: 'PROMO-005', code: 'GRATUIT1',    type: 'Course gratuite', value: '1 course', target: 'VIP',        uses: 12,  maxUses: 50,  starts: '01/01/2024', ends: '31/01/2024', status: 'Expiré' },
]

const STATUS_COLORS = {
  Actif:     { color: '#22c55e', bg: '#f0fdf4' },
  Épuisé:    { color: '#f59e0b', bg: '#fffbeb' },
  Planifié:  { color: '#4680ff', bg: '#eff6ff' },
  Expiré:    { color: '#94a3b8', bg: '#f8fafc' },
}

function PromoModal({ onClose }) {
  const [code, setCode] = useState('')
  const [type, setType] = useState('Pourcentage')
  const [value, setValue] = useState('')
  const [target, setTarget] = useState('Tous')
  const [maxUses, setMaxUses] = useState('')
  const [ends, setEnds] = useState('')

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setCode(rand)
  }

  const inputS = {
    width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0',
    borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: '28px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Créer un code promo</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#94a3b8' }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Code promo *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Ex: BIENVENUE20" style={{ ...inputS, flex: 1 }} />
              <button onClick={generateCode} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#4680ff', whiteSpace: 'nowrap' }}>
                🎲 Auto
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Type de remise *</label>
              <select value={type} onChange={e => setType(e.target.value)} style={inputS}>
                {['Pourcentage', 'Montant fixe', 'Course gratuite'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Valeur *</label>
              <input value={value} onChange={e => setValue(e.target.value)} placeholder={type === 'Pourcentage' ? '20%' : '500 FCFA'} style={inputS} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Cible</label>
              <select value={target} onChange={e => setTarget(e.target.value)} style={inputS}>
                {['Tous', 'Nouveaux utilisateurs', 'Utilisateurs récurrents', 'VIP', 'Zone Dakar'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Limite d'utilisation</label>
              <input value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="500" type="number" style={inputS} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Date d'expiration</label>
            <input value={ends} onChange={e => setEnds(e.target.value)} type="date" style={inputS} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#475569' }}>
            Annuler
          </button>
          <button onClick={() => { alert(`Code promo "${code || '(vide)'}" créé (démo) !`); onClose() }} style={{ flex: 2, padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #4680ff, #6366f1)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
            Créer le code promo
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PromoCodesPage() {
  const [promos, setPromos] = useState(MOCK_PROMOS)
  const [filterStatus, setFilterStatus] = useState('Tous')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = promos.filter(p => {
    const matchStatus = filterStatus === 'Tous' || p.status === filterStatus
    const matchSearch = !search || p.code.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div>
      {showModal && <PromoModal onClose={() => setShowModal(false)} />}

      <PageHeader title="Codes Promotionnels" icon={<FiTag />}>
        <Btn color="#4680ff" onClick={() => exportCSV(promos, 'codes_promo')}>
          <FiDownload size={13} /> CSV
        </Btn>
        <Btn color="#22c55e" onClick={() => setShowModal(true)}>
          <FiPlus size={14} /> Nouveau code
        </Btn>
      </PageHeader>

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Codes actifs',    value: promos.filter(p => p.status === 'Actif').length,    color: '#22c55e' },
          { label: 'Utilisations',    value: promos.reduce((s, p) => s + p.uses, 0),             color: '#4680ff' },
          { label: 'Codes expirés',   value: promos.filter(p => p.status === 'Expiré').length,   color: '#94a3b8' },
          { label: 'Codes planifiés', value: promos.filter(p => p.status === 'Planifié').length, color: '#a855f7' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <FilterBar>
        <TextInput placeholder="Rechercher un code…" value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          options={['Tous', 'Actif', 'Planifié', 'Épuisé', 'Expiré']}
        />
        <Btn outline color="#6c757d" onClick={() => { setSearch(''); setFilterStatus('Tous') }}>Réinitialiser</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Code', 'Type', 'Valeur', 'Cible', 'Utilisation', 'Période', 'Statut', 'Actions'].map((h, i) => (
                <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const s = STATUS_COLORS[p.status] || STATUS_COLORS.Expiré
              const usePct = Math.round((p.uses / p.maxUses) * 100)
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: '#4680ff', background: '#f0f4ff', padding: '3px 10px', borderRadius: 6 }}>{p.code}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.type}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#22c55e' }}>{p.value}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>{p.target}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#f1f5f9', minWidth: 60 }}>
                        <div style={{ width: `${Math.min(usePct, 100)}%`, height: '100%', borderRadius: 3, background: usePct >= 100 ? '#ef4444' : '#22c55e' }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#64748b', flexShrink: 0 }}>{p.uses}/{p.maxUses}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: '#64748b' }}>{p.starts} → {p.ends}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 10, background: s.bg, color: s.color }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ padding: '4px 10px', border: 'none', background: '#eff6ff', color: '#4680ff', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}><FiEdit2 size={12} /></button>
                      <button style={{ padding: '4px 10px', border: 'none', background: '#fff0f3', color: '#ef4444', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}><FiTrash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#94a3b8' }}>
          {filtered.length} codes affichés
        </div>
      </div>
    </div>
  )
}
