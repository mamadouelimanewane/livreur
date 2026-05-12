import { useState } from 'react'
import { FiPlus, FiBriefcase, FiUsers, FiDollarSign, FiTrendingUp, FiX, FiCheck, FiEdit2 } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'

const COMPANIES = [
  { id:'C-01', name:'Orange Sénégal', sector:'Télécoms', budget:500000, employees:34, ridesMonth:156, spent:423000, status:'actif', contact:'rh@orange.sn' },
  { id:'C-02', name:'Sonatel', sector:'Télécoms', budget:300000, employees:22, ridesMonth:89, spent:215000, status:'actif', contact:'admin@sonatel.sn' },
  { id:'C-03', name:'CBAO Banque', sector:'Finance', budget:200000, employees:18, ridesMonth:67, spent:178000, status:'actif', contact:'daf@cbao.sn' },
  { id:'C-04', name:'Sococim', sector:'Industrie', budget:150000, employees:12, ridesMonth:34, spent:89000, status:'actif', contact:'hr@sococim.sn' },
  { id:'C-05', name:'GIZ Dakar', sector:'ONG', budget:100000, employees:8, ridesMonth:21, spent:54000, status:'actif', contact:'admin@giz.sn' },
  { id:'C-06', name:'TotalEnergies', sector:'Énergie', budget:400000, employees:27, ridesMonth:112, spent:312000, status:'inactif', contact:'fleet@total.sn' },
]

const INVOICES = [
  { id:'INV-2026-05', company:'Orange Sénégal', period:'Mai 2026', amount:423000, status:'en attente' },
  { id:'INV-2026-04', company:'Orange Sénégal', period:'Avril 2026', amount:389000, status:'payé' },
  { id:'INV-2026-05', company:'Sonatel', period:'Mai 2026', amount:215000, status:'payé' },
  { id:'INV-2026-04', company:'CBAO Banque', period:'Avril 2026', amount:167000, status:'payé' },
]

export default function CorporatePage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [tab, setTab] = useState('companies')
  const [form, setForm] = useState({ name:'', email:'', budget:'', zones:'' })

  const totalRevenue = COMPANIES.reduce((s,c) => s + c.spent, 0)
  const totalRides = COMPANIES.reduce((s,c) => s + c.ridesMonth, 0)
  const totalEmployees = COMPANIES.reduce((s,c) => s + c.employees, 0)

  const kpi = (label, value, sub, color) => (
    <div style={{ background:'#fff', borderRadius:12, padding:'14px 20px', flex:1, minWidth:130,
      boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderTop:`3px solid ${color}` }}>
      <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color, marginTop:4 }}>{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}</div>
      <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{sub}</div>
    </div>
  )

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🏢 Comptes Entreprise" subtitle="Gestion des clients corporate — facturation & politiques de déplacement" />

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {kpi('Entreprises actives', COMPANIES.filter(c=>c.status==='actif').length, 'Contrats en cours', '#4680ff')}
        {kpi('Courses corporate/mois', totalRides, 'Ce mois', '#22c55e')}
        {kpi('Revenu corporate', `${(totalRevenue/1000).toFixed(0)}K FCFA`, 'Ce mois', '#f59e0b')}
        {kpi('Employés actifs', totalEmployees, 'Tous comptes confondus', '#a855f7')}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['companies','Entreprises'],['invoices','Factures'],['policy','Politiques']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'companies' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:15, color:'#1e293b', flex:1 }}>Clients Entreprise ({COMPANIES.length})</span>
            <Btn onClick={() => setShowModal(true)} icon={<FiPlus size={14} />}>Ajouter entreprise</Btn>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16, padding:20 }}>
            {COMPANIES.map(c => {
              const pct = Math.min(100, Math.round(c.spent / c.budget * 100))
              return (
                <div key={c.id} onClick={() => setSelectedCompany(c)} style={{ border:'1px solid #e2e8f0', borderRadius:12, padding:20,
                  cursor:'pointer', transition:'box-shadow 0.15s', background: selectedCompany?.id===c.id ? '#eff6ff' : '#fff' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(70,128,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                    <div style={{ width:44, height:44, borderRadius:10, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏢</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{c.name}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{c.sector} · {c.employees} employés</div>
                    </div>
                    <span style={{ background: c.status==='actif' ? '#f0fdf4' : '#f1f5f9', color: c.status==='actif' ? '#16a34a' : '#64748b',
                      borderRadius:8, padding:'3px 8px', fontSize:11, fontWeight:600 }}>{c.status}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontWeight:700, fontSize:18, color:'#4680ff' }}>{c.ridesMonth}</div>
                      <div style={{ fontSize:10, color:'#94a3b8' }}>courses/mois</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontWeight:700, fontSize:18, color:'#22c55e' }}>{(c.spent/1000).toFixed(0)}K</div>
                      <div style={{ fontSize:10, color:'#94a3b8' }}>FCFA dépensés</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontWeight:700, fontSize:18, color:'#f59e0b' }}>{(c.budget/1000).toFixed(0)}K</div>
                      <div style={{ fontSize:10, color:'#94a3b8' }}>budget/mois</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:11, color:'#64748b' }}>Budget utilisé</span>
                      <span style={{ fontSize:11, fontWeight:600, color: pct>90 ? '#ef4444' : pct>70 ? '#f59e0b' : '#22c55e' }}>{pct}%</span>
                    </div>
                    <div style={{ background:'#f1f5f9', borderRadius:8, height:6, overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background: pct>90 ? '#ef4444' : pct>70 ? '#f59e0b' : '#22c55e', borderRadius:8, transition:'width 0.5s' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <span style={{ fontWeight:700, fontSize:15, color:'#1e293b' }}>Factures Corporate</span>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['N° Facture','Entreprise','Période','Montant','Statut','Action'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={i} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#4680ff' }}>{inv.id}</td>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#1e293b' }}>{inv.company}</td>
                  <td style={{ padding:'10px 14px', color:'#475569' }}>{inv.period}</td>
                  <td style={{ padding:'10px 14px', fontWeight:700, color:'#1e293b' }}>{inv.amount.toLocaleString('fr-FR')} FCFA</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ background: inv.status==='payé' ? '#f0fdf4' : '#fef3c7', color: inv.status==='payé' ? '#16a34a' : '#92400e',
                      borderRadius:8, padding:'3px 8px', fontSize:11, fontWeight:600 }}>{inv.status}</span>
                  </td>
                  <td style={{ padding:'10px 14px' }}>
                    <button style={{ padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:600, cursor:'pointer', background:'#f1f5f9', color:'#475569', border:'none' }}>
                      📄 PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'policy' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:20 }}>Politiques de Déplacement Globales</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {[
              { label:'Plafond par trajet', value:'5 000 FCFA', icon:'💰' },
              { label:'Horaires autorisés', value:'6h00 – 22h00', icon:'🕐' },
              { label:'Zones autorisées', value:'Dakar + Banlieue', icon:'📍' },
              { label:'Services autorisés', value:'Taxi, Livraison Express', icon:'🚗' },
              { label:'Approbation requise si > ', value:'3 000 FCFA', icon:'✅' },
              { label:'Rapport mensuel auto', value:'Activé · PDF par email', icon:'📊' },
            ].map(p => (
              <div key={p.label} style={{ background:'#f8fafc', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontSize:28 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' }}>{p.label}</div>
                  <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginTop:2 }}>{p.value}</div>
                </div>
                <FiEdit2 size={14} color="#94a3b8" style={{ marginLeft:'auto', cursor:'pointer' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:460, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:18, color:'#1e293b' }}>Nouvelle Entreprise</div>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><FiX size={20} /></button>
            </div>
            {[['name','Nom de l\'entreprise'],['email','Email de facturation'],['budget','Budget mensuel (FCFA)'],['zones','Zones autorisées']].map(([field, label]) => (
              <div key={field} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#475569', marginBottom:5, textTransform:'uppercase' }}>{label}</label>
                <input value={form[field]} onChange={e => setForm(p => ({...p, [field]:e.target.value}))}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:14, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <button onClick={() => setShowModal(false)} style={{ width:'100%', padding:12, borderRadius:10, background:'#4680ff', color:'#fff', fontWeight:700, fontSize:15, border:'none', cursor:'pointer', marginTop:8 }}>
              <FiCheck size={16} style={{ marginRight:8, verticalAlign:'middle' }} />Créer le compte
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
