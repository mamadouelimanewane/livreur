import { useState } from 'react'
import { FiDollarSign, FiCheckCircle, FiXCircle, FiZap, FiDownload, FiSliders } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'

const TIPS = [
  { driver:'Moussa Diallo', rides:89, totalTips:45000, avgTip:505, rating:4.9 },
  { driver:'Cheikh Ndiaye', rides:82, totalTips:38000, avgTip:463, rating:4.8 },
  { driver:'Babacar Diop', rides:76, totalTips:31000, avgTip:408, rating:4.8 },
  { driver:'Abdou Mbaye', rides:71, totalTips:28000, avgTip:394, rating:4.7 },
  { driver:'Mamadou Sy', rides:63, totalTips:22000, avgTip:349, rating:4.6 },
  { driver:'Ibrahima Sow', rides:57, totalTips:18000, avgTip:316, rating:4.5 },
]

const PAYOUTS = [
  { id:'PO-2341', driver:'Moussa Diallo', amount:120000, method:'Orange Money', phone:'+221 77 123 45 67', status:'en attente', date:'2026-05-09 14:30' },
  { id:'PO-2340', driver:'Cheikh Ndiaye', amount:95000, method:'Wave', phone:'+221 77 345 67 89', status:'traité', date:'2026-05-09 12:15' },
  { id:'PO-2339', driver:'Babacar Diop', amount:78000, method:'Orange Money', phone:'+221 77 789 01 23', status:'traité', date:'2026-05-09 10:00' },
  { id:'PO-2338', driver:'Abdou Mbaye', amount:112000, method:'Wave', phone:'+221 76 678 90 12', status:'en attente', date:'2026-05-09 09:45' },
  { id:'PO-2337', driver:'Mamadou Sy', amount:67000, method:'Orange Money', phone:'+221 78 890 12 34', status:'échoué', date:'2026-05-08 18:30' },
  { id:'PO-2336', driver:'Lamine Gaye', amount:89000, method:'Wave', phone:'+221 77 567 89 01', status:'traité', date:'2026-05-08 17:00' },
]

const INVOICES = [
  { id:'INV-R-4521', client:'Fatou Ba', driver:'Moussa Diallo', amount:2500, date:'2026-05-09 14:32' },
  { id:'INV-R-4520', client:'Aminata Diop', driver:'Cheikh Ndiaye', amount:1800, date:'2026-05-09 13:10' },
  { id:'INV-R-4519', client:'Rokhaya Ciss', driver:'Abdou Mbaye', amount:3200, date:'2026-05-09 12:45' },
  { id:'INV-R-4518', client:'Ndèye Sarr', driver:'Mamadou Sy', amount:1500, date:'2026-05-09 11:20' },
  { id:'INV-R-4517', client:'Seydou Niang', driver:'Ibrahima Sow', amount:2800, date:'2026-05-09 10:05' },
]

export default function TipsPayoutPage() {
  const [tab, setTab] = useState('tips')
  const [commission, setCommission] = useState(15)
  const [instantPayout, setInstantPayout] = useState(true)
  const [payouts, setPayouts] = useState(PAYOUTS)

  const totalTips = TIPS.reduce((s,t) => s + t.totalTips, 0)
  const avgTip = Math.round(totalTips / TIPS.reduce((s,t) => s + t.rides, 0))
  const pending = payouts.filter(p => p.status === 'en attente')

  const examplePrice = 2000
  const driverGets = Math.round(examplePrice * (1 - commission/100))

  const handleApprove = (id) => setPayouts(prev => prev.map(p => p.id === id ? {...p, status:'traité'} : p))
  const handleReject = (id) => setPayouts(prev => prev.map(p => p.id === id ? {...p, status:'échoué'} : p))

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="💰 Pourboires & Paiements" subtitle="Gestion des tips, paiements T+0 et commissions" />

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          ['Total pourboires/mois', `${(totalTips/1000).toFixed(0)}K FCFA`, '#f59e0b'],
          ['Moyenne par course', `${avgTip} FCFA`, '#4680ff'],
          ['% courses avec pourboire', '34%', '#22c55e'],
          ['Payouts en attente', pending.length, '#ef4444'],
        ].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', borderRadius:12, padding:'14px 20px', flex:1, minWidth:140,
            boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, marginTop:4 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['tips','Pourboires'],['payouts','Paiements T+0'],['commission','Commissions'],['invoices','Factures Auto']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'tips' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:15, color:'#1e293b' }}>Pourboires par conducteur</span>
            <Btn onClick={() => {}} icon={<FiDownload size={13} />}>Export</Btn>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['Conducteur','Courses','Total Pourboires','Moyenne/course','Note','Rang'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {TIPS.map((t, i) => (
                <tr key={t.driver} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                  <td style={{ padding:'10px 14px', fontWeight:700, color:'#1e293b' }}>{t.driver}</td>
                  <td style={{ padding:'10px 14px', color:'#475569' }}>{t.rides}</td>
                  <td style={{ padding:'10px 14px', fontWeight:700, color:'#f59e0b' }}>{t.totalTips.toLocaleString('fr-FR')} FCFA</td>
                  <td style={{ padding:'10px 14px', color:'#475569' }}>{t.avgTip} FCFA</td>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#1e293b' }}>⭐ {t.rating}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ fontSize:18 }}>{['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'payouts' && (
        <div>
          {/* Payout Stats */}
          <div style={{ display:'flex', gap:12, marginBottom:16 }}>
            {[['Payouts aujourd\'hui',payouts.filter(p=>p.status==='traité').length,'#22c55e'],['Montant traité',`${payouts.filter(p=>p.status==='traité').reduce((s,p)=>s+p.amount,0)/1000}K FCFA`,'#4680ff'],['Taux succès','94%','#a855f7']].map(([l,v,c]) => (
              <div key={l} style={{ background:'#fff', borderRadius:12, padding:'12px 18px', flex:1, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderLeft:`4px solid ${c}` }}>
                <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase' }}>{l}</div>
                <div style={{ fontSize:22, fontWeight:800, color:c, marginTop:4 }}>{v}</div>
              </div>
            ))}
            <div style={{ background:'#fff', borderRadius:12, padding:'12px 18px', flex:1, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderLeft:'4px solid #f59e0b', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Mode Payout</div>
                <div style={{ fontSize:14, fontWeight:700, color: instantPayout ? '#22c55e' : '#f59e0b' }}>{instantPayout ? '⚡ Instant T+0' : '📅 Batch T+24h'}</div>
              </div>
              <div onClick={() => setInstantPayout(p => !p)} style={{ width:44, height:24, borderRadius:12, background: instantPayout ? '#22c55e' : '#e2e8f0', cursor:'pointer', position:'relative', transition:'background 0.3s' }}>
                <div style={{ position:'absolute', top:2, left: instantPayout ? 22 : 2, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.3s' }} />
              </div>
            </div>
          </div>

          <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead><tr style={{ background:'#f8fafc' }}>
                {['ID','Conducteur','Montant','Méthode','Téléphone','Statut','Date','Action'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {payouts.map((p, i) => (
                  <tr key={p.id} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                    <td style={{ padding:'10px 14px', fontWeight:600, color:'#4680ff' }}>{p.id}</td>
                    <td style={{ padding:'10px 14px', fontWeight:600, color:'#1e293b' }}>{p.driver}</td>
                    <td style={{ padding:'10px 14px', fontWeight:700, color:'#1e293b' }}>{p.amount.toLocaleString('fr-FR')} FCFA</td>
                    <td style={{ padding:'10px 14px', color:'#475569' }}>{p.method}</td>
                    <td style={{ padding:'10px 14px', color:'#64748b' }}>{p.phone}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ background: p.status==='traité'?'#f0fdf4':p.status==='en attente'?'#fef3c7':'#fef2f2',
                        color: p.status==='traité'?'#16a34a':p.status==='en attente'?'#92400e':'#dc2626',
                        borderRadius:8, padding:'3px 8px', fontSize:11, fontWeight:600 }}>{p.status}</span>
                    </td>
                    <td style={{ padding:'10px 14px', color:'#94a3b8', whiteSpace:'nowrap' }}>{p.date.split(' ')[1]}</td>
                    <td style={{ padding:'10px 14px' }}>
                      {p.status === 'en attente' && (
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => handleApprove(p.id)} style={{ padding:'4px 8px', borderRadius:7, fontSize:11, fontWeight:700, cursor:'pointer', background:'#f0fdf4', color:'#16a34a', border:'none' }}><FiCheckCircle size={12} /></button>
                          <button onClick={() => handleReject(p.id)} style={{ padding:'4px 8px', borderRadius:7, fontSize:11, fontWeight:700, cursor:'pointer', background:'#fef2f2', color:'#dc2626', border:'none' }}><FiXCircle size={12} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'commission' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:28 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:24 }}>Configuration des Commissions LiviGo</div>
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:14, fontWeight:600, color:'#1e293b' }}>Taux de commission LiviGo</span>
                <span style={{ fontSize:20, fontWeight:900, color:'#4680ff' }}>{commission}%</span>
              </div>
              <input type="range" min="5" max="30" value={commission} onChange={e => setCommission(Number(e.target.value))}
                style={{ width:'100%', accentColor:'#4680ff' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8', marginTop:4 }}>
                <span>5%</span><span>30%</span>
              </div>
            </div>
          </div>
          <div style={{ background:'#f8fafc', borderRadius:14, padding:20, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
            {[
              { label:'Prix de la course', value:`${examplePrice.toLocaleString('fr-FR')} FCFA`, color:'#1e293b' },
              { label:`Commission LiviGo (${commission}%)`, value:`-${Math.round(examplePrice*commission/100).toLocaleString('fr-FR')} FCFA`, color:'#ef4444' },
              { label:'Net conducteur', value:`${driverGets.toLocaleString('fr-FR')} FCFA`, color:'#22c55e' },
            ].map(item => (
              <div key={item.label} style={{ textAlign:'center', padding:'16px', background:'#fff', borderRadius:12 }}>
                <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', marginBottom:8 }}>{item.label}</div>
                <div style={{ fontSize:22, fontWeight:900, color:item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, background:'#eff6ff', borderRadius:12, padding:'14px 18px', fontSize:13, color:'#3730a3' }}>
            💡 La commission par défaut du marché ouest-africain est entre 15% et 20%. Ajuster selon les zones géographiques peut augmenter la rétention conducteurs.
          </div>
        </div>
      )}

      {tab === 'invoices' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontWeight:700, fontSize:15, color:'#1e293b' }}>Factures Automatiques (PDF)</span>
            <span style={{ fontSize:12, color:'#22c55e', fontWeight:600 }}>✅ Envoi automatique par email activé</span>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['N° Facture','Client','Conducteur','Montant','Date','PDF'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={inv.id} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#4680ff' }}>{inv.id}</td>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#1e293b' }}>{inv.client}</td>
                  <td style={{ padding:'10px 14px', color:'#475569' }}>{inv.driver}</td>
                  <td style={{ padding:'10px 14px', fontWeight:700, color:'#1e293b' }}>{inv.amount.toLocaleString('fr-FR')} FCFA</td>
                  <td style={{ padding:'10px 14px', color:'#94a3b8' }}>{inv.date}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <button style={{ padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:600, cursor:'pointer', background:'#f1f5f9', color:'#475569', border:'none' }}>📄 Télécharger</button>
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
