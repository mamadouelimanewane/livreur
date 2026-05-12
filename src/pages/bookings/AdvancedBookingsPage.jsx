import { useState } from 'react'
import { FiPlus, FiCalendar, FiClock, FiRepeat, FiMapPin, FiUser, FiTruck, FiX, FiCheck, FiBell } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'

const BOOKINGS = [
  { id:'B-0234', client:'Fatou Ba', pickup:'Almadies, Villa 12', dropoff:'Plateau, Bureau', datetime:'2026-05-10 08:00', service:'Taxi', driver:'Moussa Diallo', status:'confirmé', recurrence:'Quotidien' },
  { id:'B-0233', client:'Seydou Niang', pickup:'Parcelles Ass.', dropoff:'Aéroport LSS', datetime:'2026-05-10 10:30', service:'Taxi Premium', driver:'Non assigné', status:'en attente', recurrence:'Unique', flight:'DK204' },
  { id:'B-0232', client:'Aminata Diop', pickup:'Médina, Rue 10', dropoff:'HLM, Marché', datetime:'2026-05-10 14:00', service:'Livraison', driver:'Cheikh Ndiaye', status:'confirmé', recurrence:'Hebdomadaire (Lun)' },
  { id:'B-0231', client:'Rokhaya Ciss', pickup:'Guédiawaye', dropoff:'Clinique Pasteur', datetime:'2026-05-10 09:00', service:'Taxi', driver:'Abdou Mbaye', status:'confirmé', recurrence:'Unique' },
  { id:'B-0230', client:'Binta Sow', pickup:'Ouakam', dropoff:'Université UCAD', datetime:'2026-05-11 07:30', service:'Moto Taxi', driver:'Babacar Diop', status:'confirmé', recurrence:'Quotidien (Lun-Ven)' },
  { id:'B-0229', client:'Ibou Diallo', pickup:'Corniche', dropoff:'Port de Dakar', datetime:'2026-05-11 06:00', service:'Livraison Express', driver:'Non assigné', status:'en attente', recurrence:'Unique' },
]

const RECURRING = [
  { id:'RC-01', client:'Fatou Ba', route:'Almadies → Plateau', freq:'Quotidien', time:'08:00', next:'Demain 08:00', service:'Taxi', active:true },
  { id:'RC-02', client:'Aminata Diop', route:'Médina → HLM Marché', freq:'Hebdo (Lun)', time:'14:00', next:'Lundi 14:00', service:'Livraison', active:true },
  { id:'RC-03', client:'Binta Sow', route:'Ouakam → UCAD', freq:'Lun–Ven', time:'07:30', next:'Demain 07:30', service:'Moto Taxi', active:true },
]

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const SLOTS = ['06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h']
const HEAT = { '08h-Lun':8, '08h-Mar':6, '09h-Mer':4, '14h-Lun':3, '07h-Ven':7, '10h-Sam':2, '08h-Jeu':5, '09h-Ven':6, '14h-Mer':2 }

export default function AdvancedBookingsPage() {
  const [tab, setTab] = useState('list')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ client:'', pickup:'', dropoff:'', date:'', time:'', service:'Taxi', recurrence:'unique', notes:'' })

  const confirmed = BOOKINGS.filter(b => b.status === 'confirmé').length
  const waiting = BOOKINGS.filter(b => b.status === 'en attente').length

  const kpi = (label, value, sub, color) => (
    <div style={{ background:'#fff', borderRadius:12, padding:'14px 20px', flex:1, minWidth:130, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderTop:`3px solid ${color}` }}>
      <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color, marginTop:4 }}>{value}</div>
      <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{sub}</div>
    </div>
  )

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="📅 Réservations Avancées" subtitle="Courses planifiées, récurrentes et transferts aéroport" />

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {kpi('Cette semaine', BOOKINGS.length, 'Réservations planifiées', '#4680ff')}
        {kpi('Confirmées', confirmed, 'Conducteur assigné', '#22c55e')}
        {kpi('En attente', waiting, 'Nécessitent assignation', '#f59e0b')}
        {kpi('Ponctualité', '94%', 'Courses à l\'heure', '#a855f7')}
      </div>

      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['list','Liste'],['calendar','Calendrier'],['recurring','Récurrentes'],['airport','Aéroport']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
        <Btn onClick={() => setShowModal(true)} icon={<FiPlus size={14} />}>Nouvelle réservation</Btn>
      </div>

      {tab === 'list' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['ID','Client','Départ','Arrivée','Date & Heure','Service','Conducteur','Récurrence','Statut'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {BOOKINGS.map((b, i) => (
                <tr key={b.id} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#4680ff' }}>{b.id}</td>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#1e293b' }}>{b.client}</td>
                  <td style={{ padding:'10px 14px', color:'#64748b', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.pickup}</td>
                  <td style={{ padding:'10px 14px', color:'#64748b', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.dropoff}</td>
                  <td style={{ padding:'10px 14px', color:'#475569', whiteSpace:'nowrap' }}>
                    <div style={{ fontWeight:600 }}>{b.datetime.split(' ')[0]}</div>
                    <div style={{ fontSize:11, color:'#94a3b8' }}>{b.datetime.split(' ')[1]}</div>
                  </td>
                  <td style={{ padding:'10px 14px' }}><span style={{ background:'#eff6ff', color:'#4680ff', borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{b.service}</span></td>
                  <td style={{ padding:'10px 14px', color: b.driver==='Non assigné' ? '#f59e0b' : '#475569', fontWeight: b.driver==='Non assigné' ? 600 : 400 }}>{b.driver}</td>
                  <td style={{ padding:'10px 14px', fontSize:11, color:'#a855f7' }}>{b.recurrence}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ background: b.status==='confirmé' ? '#f0fdf4' : '#fef3c7', color: b.status==='confirmé' ? '#16a34a' : '#92400e', borderRadius:8, padding:'3px 8px', fontSize:11, fontWeight:600 }}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'calendar' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:20 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>Calendrier hebdomadaire — Semaine du 9 Mai 2026</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ borderCollapse:'collapse', fontSize:12, minWidth:700 }}>
              <thead><tr>
                <th style={{ width:50, padding:'8px 10px', background:'#f8fafc', fontWeight:700, fontSize:11, color:'#64748b' }}>Heure</th>
                {DAYS.map(d => <th key={d} style={{ padding:'8px 14px', background:'#f8fafc', fontWeight:700, fontSize:12, color:'#1e293b', textAlign:'center', minWidth:90 }}>{d}</th>)}
              </tr></thead>
              <tbody>
                {SLOTS.map(slot => (
                  <tr key={slot}>
                    <td style={{ padding:'6px 10px', fontSize:11, color:'#94a3b8', background:'#fafbfc', fontWeight:600 }}>{slot}</td>
                    {DAYS.map(day => {
                      const key = `${slot}-${day}`
                      const count = HEAT[key] || 0
                      return (
                        <td key={day} style={{ padding:4, textAlign:'center', borderLeft:'1px solid #f1f5f9' }}>
                          {count > 0 && (
                            <div style={{ background: count >= 7 ? '#4680ff' : count >= 4 ? '#a5b4fc' : '#dbeafe',
                              color: count >= 4 ? '#fff' : '#3730a3', borderRadius:8, padding:'4px 0', fontSize:11, fontWeight:600 }}>
                              {count} course{count > 1 ? 's' : ''}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'recurring' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', fontWeight:700, fontSize:15, color:'#1e293b' }}>Courses Récurrentes ({RECURRING.length})</div>
          {RECURRING.map((r, i) => (
            <div key={r.id} style={{ padding:'16px 20px', borderTop: i>0 ? '1px solid #f1f5f9' : 'none', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'#a855f722', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🔄</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{r.client}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{r.route} · {r.time}</div>
                <div style={{ fontSize:11, color:'#a855f7', marginTop:3 }}>{r.freq} · {r.service}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Prochain</div>
                <div style={{ fontWeight:600, fontSize:13, color:'#4680ff' }}>{r.next}</div>
              </div>
              <div style={{ display:'flex', gap:8, marginLeft:12 }}>
                <button style={{ padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', background:'#f1f5f9', color:'#475569', border:'none' }}>Modifier</button>
                <button style={{ padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', background:'#fef2f2', color:'#dc2626', border:'none' }}>Annuler</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'airport' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:24 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:20 }}>✈️ Transferts Aéroport — LSS Dakar</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {BOOKINGS.filter(b => b.flight).map(b => (
              <div key={b.id} style={{ border:'1px solid #e0e7ff', borderRadius:12, padding:18, background:'#fafbff' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ fontWeight:700, color:'#1e293b' }}>{b.client}</div>
                  <span style={{ background:'#eff6ff', color:'#4680ff', borderRadius:8, padding:'3px 8px', fontSize:11, fontWeight:700 }}>✈️ {b.flight}</span>
                </div>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>📍 {b.pickup}</div>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>🕐 Prise en charge : {b.datetime.split(' ')[1]}</div>
                <div style={{ fontSize:11, color:'#22c55e', fontWeight:600 }}>✅ Buffer 45 min · Suivi vol activé</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'14px 18px' }}>
            <div style={{ fontWeight:700, color:'#16a34a', marginBottom:4 }}>Paramètres transferts aéroport</div>
            <div style={{ fontSize:13, color:'#15803d' }}>Buffer automatique : 45 min avant décollage · Suivi vol via FlightAware · SMS rappel J-1 et J0</div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}
          onClick={() => setShowModal(false)}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:480, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:18, color:'#1e293b' }}>Nouvelle Réservation</div>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><FiX size={20} /></button>
            </div>
            {[['client','Client'],['pickup','Adresse de départ'],['dropoff','Adresse d\'arrivée'],['date','Date'],['time','Heure']].map(([f,l]) => (
              <div key={f} style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#475569', marginBottom:5, textTransform:'uppercase' }}>{l}</label>
                <input type={f==='date'?'date':f==='time'?'time':'text'} value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                  style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#475569', marginBottom:5, textTransform:'uppercase' }}>Récurrence</label>
              <select value={form.recurrence} onChange={e => setForm(p=>({...p,recurrence:e.target.value}))}
                style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box' }}>
                <option value="unique">Unique</option>
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="weekdays">Lun-Ven</option>
              </select>
            </div>
            <button onClick={() => setShowModal(false)} style={{ width:'100%', padding:12, borderRadius:10, background:'#4680ff', color:'#fff', fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>
              <FiCalendar size={15} style={{ marginRight:8, verticalAlign:'middle' }} />Confirmer la réservation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
