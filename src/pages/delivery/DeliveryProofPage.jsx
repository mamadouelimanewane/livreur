import { useState } from 'react'
import { FiCamera, FiCheckCircle, FiAlertCircle, FiDownload, FiX, FiMapPin, FiClock, FiKey } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'

const DELIVERIES = [
  { id:'D-1021', driver:'Moussa Diallo', client:'Fatou Ba', address:'12 Rue Carnot, Plateau', time:'2026-05-09 14:32', status:'Livré', hasPhoto:true, hasPin:true, hasSig:true, lat:14.6937, lon:-17.4441, note:'Livré en main propre' },
  { id:'D-1020', driver:'Cheikh Ndiaye', client:'Aminata Diop', address:'45 VDN, Almadies', time:'2026-05-09 13:10', status:'Livré', hasPhoto:true, hasPin:true, hasSig:false, lat:14.7167, lon:-17.4677, note:'Boîte aux lettres' },
  { id:'D-1019', driver:'Abdou Mbaye', client:'Rokhaya Ciss', address:'Parcelles Ass. U17', time:'2026-05-09 12:45', status:'Absent', hasPhoto:true, hasPin:false, hasSig:false, lat:14.7295, lon:-17.4728, note:'Personne absente, livré au gardien' },
  { id:'D-1018', driver:'Mamadou Sy', client:'Ndèye Sarr', address:'HLM Villa 34', time:'2026-05-09 11:20', status:'Litige', hasPhoto:false, hasPin:false, hasSig:false, lat:14.6847, lon:-17.4738, note:'Client dit ne pas avoir reçu', flagged:true },
  { id:'D-1017', driver:'Ibrahima Sow', client:'Seydou Niang', address:'Corniche Ouest 78', time:'2026-05-09 10:05', status:'Livré', hasPhoto:true, hasPin:true, hasSig:true, lat:14.6780, lon:-17.4380, note:'' },
  { id:'D-1016', driver:'Lamine Gaye', client:'Marème Fall', address:'Médina, Av. Cheikh Anta', time:'2026-05-09 09:30', status:'Retourné', hasPhoto:true, hasPin:false, hasSig:false, lat:14.7040, lon:-17.4520, note:'Colis refusé par le client' },
  { id:'D-1015', driver:'Oumar Fall', client:'Binta Sow', address:'Plateau, Rue Moussé Diop', time:'2026-05-08 18:00', status:'Livré', hasPhoto:true, hasPin:true, hasSig:true, lat:14.6705, lon:-17.4459, note:'' },
  { id:'D-1014', driver:'Babacar Diop', client:'Aissatou Kane', address:'Guédiawaye, Cité Mixta', time:'2026-05-08 17:15', status:'Livré', hasPhoto:true, hasPin:true, hasSig:false, lat:14.7441, lon:-17.4607, note:'' },
]

const STATUS_STYLE = {
  'Livré': { bg: '#f0fdf4', color: '#16a34a' },
  'Absent': { bg: '#fef3c7', color: '#92400e' },
  'Retourné': { bg: '#f1f5f9', color: '#475569' },
  'Litige': { bg: '#fef2f2', color: '#dc2626' },
}

export default function DeliveryProofPage() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const withProof = DELIVERIES.filter(d => d.hasPhoto).length
  const total = DELIVERIES.length

  const filtered = DELIVERIES.filter(d => {
    if (filter === 'proof') return d.hasPhoto
    if (filter === 'noproof') return !d.hasPhoto
    if (filter === 'litige') return d.status === 'Litige'
    return true
  })

  const kpi = (label, value, sub, color) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: '14px 20px', flex: 1,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{sub}</div>
    </div>
  )

  const check = (v) => v
    ? <FiCheckCircle size={16} color="#22c55e" />
    : <FiX size={16} color="#e2e8f0" />

  return (
    <div style={{ padding: '24px', background: '#f4f6f9', minHeight: '100vh' }}>
      <PageHeader title="📦 Preuves de Livraison" subtitle="Photo · Code PIN · Signature électronique" />

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {kpi('Avec preuve photo', `${Math.round(withProof/total*100)}%`, `${withProof}/${total} livraisons`, '#22c55e')}
        {kpi('Sans preuve', `${100 - Math.round(withProof/total*100)}%`, `${total-withProof}/${total} livraisons`, '#f59e0b')}
        {kpi('Litiges ouverts', DELIVERIES.filter(d=>d.status==='Litige').length, 'Nécessitent intervention', '#ef4444')}
        {kpi('Taux livraison OK', '87%', 'Livrés en main propre', '#4680ff')}
      </div>

      {/* Filters + Table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', flex: 1 }}>Historique des Livraisons</span>
          {[['all','Toutes'],['proof','Avec preuve'],['noproof','Sans preuve'],['litige','Litiges']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: filter === v ? '#4680ff' : '#f8fafc', color: filter === v ? '#fff' : '#64748b', border: '1px solid #e2e8f0' }}>{l}</button>
          ))}
          <Btn onClick={() => {}} icon={<FiDownload size={13} />}>Export</Btn>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['ID','Conducteur','Client','Adresse','Heure','Statut','Photo','PIN','Signature','Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
                  color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((d, i) => {
                const st = STATUS_STYLE[d.status] || {}
                return (
                  <tr key={d.id} style={{ borderTop: '1px solid #f1f5f9', background: d.flagged ? '#fef9f9' : i%2?'#fafbfc':'#fff' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#4680ff' }}>{d.id}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{d.driver}</td>
                    <td style={{ padding: '10px 14px', color: '#475569' }}>{d.client}</td>
                    <td style={{ padding: '10px 14px', color: '#64748b', maxWidth: 180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.address}</td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8', whiteSpace:'nowrap' }}>{d.time.split(' ')[1]}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: st.bg, color: st.color, borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>{d.status}</span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>{check(d.hasPhoto)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>{check(d.hasPin)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>{check(d.hasSig)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => setSelected(d)} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11,
                        fontWeight: 600, cursor: 'pointer', background: '#eff6ff', color: '#4680ff', border: 'none' }}>Voir</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 520, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#1e293b' }}>Preuve de livraison #{selected.id}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{selected.time}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><FiX size={20} /></button>
            </div>

            {/* Photo */}
            <div style={{ background: '#f8fafc', borderRadius: 12, height: 180, display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: 16, border: '2px dashed #e2e8f0', flexDirection: 'column', gap: 8 }}>
              {selected.hasPhoto ? (
                <>
                  <FiCamera size={40} color="#4680ff" />
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#4680ff' }}>Photo de livraison disponible</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Horodatée · GPS vérifié</div>
                </>
              ) : (
                <>
                  <FiCamera size={40} color="#e2e8f0" />
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>Aucune photo disponible</div>
                </>
              )}
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { icon: <FiMapPin size={14} />, label: 'Adresse', value: selected.address },
                { icon: <FiClock size={14} />, label: 'Heure', value: selected.time.split(' ')[1] },
                { icon: <FiKey size={14} />, label: 'Code PIN', value: selected.hasPin ? '✅ Confirmé' : '❌ Non confirmé' },
                { icon: <FiCheckCircle size={14} />, label: 'Signature', value: selected.hasSig ? '✅ Obtenue' : '❌ Non obtenue' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>
                    {icon} {label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{value}</div>
                </div>
              ))}
            </div>

            {selected.note && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#92400e', fontWeight: 600, marginBottom: 2 }}>NOTE DU CONDUCTEUR</div>
                <div style={{ fontSize: 13, color: '#78350f' }}>{selected.note}</div>
              </div>
            )}

            {selected.status === 'Litige' && (
              <button style={{ width: '100%', padding: 12, borderRadius: 10, background: '#ef4444', color: '#fff',
                fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                🚨 Ouvrir un dossier litige
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
