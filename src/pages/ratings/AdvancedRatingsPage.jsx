import { useState } from 'react'
import { FiStar, FiAlertCircle, FiFilter, FiDownload, FiTrendingUp, FiThumbsUp } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'

const RATINGS = [
  { id:'R-4521', driver:'Moussa Diallo', client:'Fatou Ba', driverRating:5, clientRating:4, comment:'Excellent service, très rapide', tags:['Conduite sûre','Très ponctuel'], date:'2026-05-09 14:32' },
  { id:'R-4520', driver:'Cheikh Ndiaye', client:'Aminata Diop', driverRating:4, clientRating:5, comment:'Bonne course', tags:['Voiture propre'], date:'2026-05-09 13:10' },
  { id:'R-4519', driver:'Abdou Mbaye', client:'Rokhaya Ciss', driverRating:5, clientRating:4, comment:'Parfait', tags:['Sympa','Très ponctuel'], date:'2026-05-09 12:45' },
  { id:'R-4518', driver:'Mamadou Sy', client:'Ndèye Sarr', driverRating:3, clientRating:3, comment:'Trajet trop long', tags:[], date:'2026-05-09 11:20' },
  { id:'R-4517', driver:'Ibrahima Sow', client:'Seydou Niang', driverRating:5, clientRating:5, comment:'Excellent !', tags:['Conduite sûre','Voiture propre','Sympa'], date:'2026-05-09 10:05' },
  { id:'R-4516', driver:'Lamine Gaye', client:'Marème Fall', driverRating:4, clientRating:4, comment:'Bien', tags:['Très ponctuel'], date:'2026-05-09 09:30' },
  { id:'R-4515', driver:'Oumar Fall', client:'Binta Sow', driverRating:2, clientRating:3, comment:'Conducteur impatient', tags:[], date:'2026-05-08 18:00', flagged:true },
  { id:'R-4514', driver:'Babacar Diop', client:'Aissatou Kane', driverRating:5, clientRating:5, comment:'Parfait comme toujours', tags:['Conduite sûre','Très ponctuel','Voiture propre'], date:'2026-05-08 17:15' },
]

const COMPLAINTS = [
  { id:'S-001', type:'Comportement', driver:'Oumar Fall', client:'Binta Sow', desc:'Conducteur agressif, a klaxonné plusieurs fois', status:'ouvert', date:'2026-05-09' },
  { id:'S-002', type:'Itinéraire', driver:'Lamine Gaye', client:'Marème Fall', desc:'Chemin plus long que nécessaire', status:'résolu', date:'2026-05-08' },
  { id:'S-003', type:'Propreté', driver:'Mamadou Sy', client:'Ndèye Sarr', desc:'Voiture sale', status:'ouvert', date:'2026-05-09' },
]

const COMPLIMENTS = [
  { tag: 'Conduite sûre', count: 234, color: '#22c55e' },
  { tag: 'Très ponctuel', count: 189, color: '#4680ff' },
  { tag: 'Voiture propre', count: 156, color: '#0ea5e9' },
  { tag: 'Sympa', count: 98, color: '#a855f7' },
  { tag: 'GPS précis', count: 76, color: '#f59e0b' },
  { tag: 'Musique agréable', count: 54, color: '#ef4444' },
]

const DIST = [
  { stars: 5, pct: 60, color: '#22c55e' },
  { stars: 4, pct: 25, color: '#4680ff' },
  { stars: 3, pct: 10, color: '#f59e0b' },
  { stars: 2, pct: 3, color: '#f97316' },
  { stars: 1, pct: 2, color: '#ef4444' },
]

function Stars({ n, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <FiStar key={i} size={size} fill={i <= n ? '#f59e0b' : 'none'} color={i <= n ? '#f59e0b' : '#e2e8f0'} />
      ))}
    </span>
  )
}

export default function AdvancedRatingsPage() {
  const [tab, setTab] = useState('ratings')
  const [filterRating, setFilterRating] = useState('all')

  const avgDriver = (RATINGS.reduce((s,r) => s + r.driverRating, 0) / RATINGS.length).toFixed(1)
  const avgClient = (RATINGS.reduce((s,r) => s + r.clientRating, 0) / RATINGS.length).toFixed(1)
  const lowDrivers = RATINGS.filter(r => r.driverRating < 3).length

  const kpi = (label, value, sub, color) => (
    <div style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 140,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{sub}</div>
    </div>
  )

  const filtered = RATINGS.filter(r => {
    if (filterRating === 'low') return r.driverRating < 3
    if (filterRating === '5') return r.driverRating === 5
    return true
  })

  return (
    <div style={{ padding: '24px', background: '#f4f6f9', minHeight: '100vh' }}>
      <PageHeader title="⭐ Notation Avancée" subtitle="Système de notes bidirectionnel conducteurs & clients" />

      {lowDrivers > 0 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10, color: '#dc2626' }}>
          <FiAlertCircle size={18} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>{lowDrivers} conducteur(s) sous 4.2 étoiles — intervention recommandée</span>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {kpi('Note Conducteurs', `${avgDriver}★`, 'Moyenne générale', '#f59e0b')}
        {kpi('Note Clients', `${avgClient}★`, 'Moyenne générale', '#4680ff')}
        {kpi('Courses notées', '78%', 'Sur 30 derniers jours', '#22c55e')}
        {kpi('Signalements', COMPLAINTS.filter(c=>c.status==='ouvert').length, 'Ouverts ce mois', '#ef4444')}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', borderRadius: 10, padding: 4, width: 'fit-content',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['ratings','Notes'],['distribution','Distribution'],['compliments','Compliments'],['signalements','Signalements']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
            background: tab === v ? '#4680ff' : 'transparent', color: tab === v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {/* Notes Table */}
      {tab === 'ratings' && (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>Historique des Évaluations</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {[['all','Toutes'],['5','5★'],['low','< 3★']].map(([v,l]) => (
                <button key={v} onClick={() => setFilterRating(v)} style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid #e2e8f0',
                  background: filterRating === v ? '#4680ff' : '#fff', color: filterRating === v ? '#fff' : '#64748b' }}>{l}</button>
              ))}
              <Btn onClick={() => {}} icon={<FiDownload size={13} />}>Export</Btn>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ background: '#f8fafc' }}>
                {['Course','Conducteur','Client','Note Conducteur','Note Client','Commentaire','Tags','Date'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b',
                    textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9', background: r.flagged ? '#fef2f2' : i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#4680ff' }}>{r.id}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{r.driver}</td>
                    <td style={{ padding: '10px 14px', color: '#475569' }}>{r.client}</td>
                    <td style={{ padding: '10px 14px' }}><Stars n={r.driverRating} /></td>
                    <td style={{ padding: '10px 14px' }}><Stars n={r.clientRating} /></td>
                    <td style={{ padding: '10px 14px', color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {r.tags.map(t => <span key={t} style={{ background: '#eff6ff', color: '#4680ff', borderRadius: 8, padding: '2px 7px', fontSize: 10, fontWeight: 600 }}>{t}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distribution */}
      {tab === 'distribution' && (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 20 }}>Distribution des Notes Conducteurs</div>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>{avgDriver}</div>
              <Stars n={5} size={20} />
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>sur {RATINGS.length} évaluations</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DIST.map(d => (
                <div key={d.stars} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 40, flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{d.stars}</span>
                    <FiStar size={12} fill={d.color} color={d.color} />
                  </div>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 8, height: 12, overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 8, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ width: 36, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#475569' }}>{d.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliments */}
      {tab === 'compliments' && (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 20 }}>🏅 Compliments reçus par les conducteurs</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {COMPLIMENTS.map(c => (
              <div key={c.tag} style={{ background: c.color + '11', border: `1px solid ${c.color}33`, borderRadius: 14, padding: '16px 20px', minWidth: 140, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: c.color }}>{c.count}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginTop: 4 }}>{c.tag}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signalements */}
      {tab === 'signalements' && (
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>Signalements & Plaintes</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['ID','Type','Conducteur','Client','Description','Statut','Date','Action'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {COMPLAINTS.map((c, i) => (
                <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 ? '#fafbfc' : '#fff' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#ef4444' }}>{c.id}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 8, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{c.type}</span></td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{c.driver}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{c.client}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', maxWidth: 200 }}>{c.desc}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: c.status === 'ouvert' ? '#fef2f2' : '#f0fdf4', color: c.status === 'ouvert' ? '#dc2626' : '#16a34a',
                      borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{c.date}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {c.status === 'ouvert' && (
                      <button style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        background: '#4680ff', color: '#fff', border: 'none' }}>Résoudre</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
