import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiZap, FiSend, FiMapPin, FiStar, FiTruck, FiClock, FiTrendingUp, FiTarget } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CANDIDATES = [
  { id:1, name:'Moussa Diallo', vehicle:'Moto', distance:0.8, eta:'3 min', rating:4.8, acceptance:94, score:96, lat:14.6960, lon:-17.4460, status:'available' },
  { id:2, name:'Babacar Diop', vehicle:'Taxi', distance:1.4, eta:'5 min', rating:4.7, acceptance:89, score:84, lat:14.6910, lon:-17.4400, status:'available' },
  { id:3, name:'Oumar Fall', vehicle:'Taxi', distance:2.1, eta:'7 min', rating:4.5, acceptance:82, score:72, lat:14.6980, lon:-17.4490, status:'available' },
]

const HISTORY = [
  { id:'AD-089', pickup:'Plateau', dropoff:'Almadies', driver:'Moussa Diallo', result:'accepté', time:'14:32', duration:'23s' },
  { id:'AD-088', pickup:'Médina', dropoff:'HLM', driver:'Cheikh Ndiaye', result:'accepté', time:'14:15', duration:'41s' },
  { id:'AD-087', pickup:'Parcelles', dropoff:'Plateau', driver:'Abdou Mbaye', result:'refusé', time:'13:58', duration:'30s' },
  { id:'AD-086', pickup:'Guédiawaye', dropoff:'Pikine', driver:'Ibrahima Sow', result:'accepté', time:'13:40', duration:'18s' },
  { id:'AD-085', pickup:'Almadies', dropoff:'Dakar Centre', driver:'Mamadou Sy', result:'expiré', time:'13:22', duration:'30s' },
]

const PREPOSITION = [
  { zone:'Plateau', demand:'Très forte', suggestion:'3 conducteurs → Plateau', confidence:92, color:'#ef4444' },
  { zone:'Almadies', demand:'Forte', suggestion:'2 conducteurs → Almadies', confidence:85, color:'#f59e0b' },
  { zone:'Médina', demand:'Modérée', suggestion:'1 conducteur → Médina', confidence:71, color:'#4680ff' },
]

export default function AIDispatchV2Page() {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [service, setService] = useState('Taxi')
  const [priority, setPriority] = useState('normal')
  const [notes, setNotes] = useState('')
  const [dispatching, setDispatching] = useState(false)
  const [success, setSuccess] = useState(null)
  const [selectedCandidate, setSelectedCandidate] = useState(CANDIDATES[0])

  const handleDispatch = () => {
    if (!pickup || !dropoff) return
    setDispatching(true)
    setTimeout(() => {
      setDispatching(false)
      setSuccess(`⚡ Course assignée à ${selectedCandidate.name} (score ${selectedCandidate.score}%) · ETA ${selectedCandidate.eta}`)
      setPickup(''); setDropoff(''); setNotes('')
    }, 1800)
  }

  const scoreBar = (label, value, color) => (
    <div style={{ marginBottom:6 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#64748b', marginBottom:3 }}>
        <span>{label}</span><span style={{ fontWeight:700, color }}>{value}%</span>
      </div>
      <div style={{ background:'#f1f5f9', borderRadius:6, height:6, overflow:'hidden' }}>
        <div style={{ width:`${value}%`, height:'100%', background:color, borderRadius:6 }} />
      </div>
    </div>
  )

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="⚡ Auto-Dispatch IA v2" subtitle="Algorithme Haversine · Scoring multicritères · Pré-positionnement prédictif" />

      {/* KPIs */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[['Temps moyen dispatch','47s','#4680ff'],['Taux acceptation IA','89%','#22c55e'],['Couverture zones','94%','#a855f7'],['Dispatches aujourd\'hui','156','#f59e0b']].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', borderRadius:12, padding:'14px 20px', flex:1, minWidth:130, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, marginTop:4 }}>{v}</div>
          </div>
        ))}
      </div>

      {success && (
        <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'12px 20px', marginBottom:16, color:'#16a34a', fontWeight:600, fontSize:14 }}>
          {success} <button onClick={() => setSuccess(null)} style={{ float:'right', background:'none', border:'none', color:'#16a34a', cursor:'pointer', fontSize:16 }}>×</button>
        </div>
      )}

      <div style={{ display:'flex', gap:16 }}>
        {/* Left Panel */}
        <div style={{ width:340, display:'flex', flexDirection:'column', gap:14 }}>
          {/* Form */}
          <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:20 }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>Nouvelle course</div>
            {[['pickup','📍 Départ',pickup,setPickup],['dropoff','🏁 Arrivée',dropoff,setDropoff]].map(([f,l,v,s]) => (
              <div key={f} style={{ marginBottom:12 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#475569', marginBottom:5, textTransform:'uppercase' }}>{l}</label>
                <input value={v} onChange={e => s(e.target.value)} placeholder={f==='pickup'?'Ex: Plateau, Rue Carnot':'Ex: Almadies, Villa 45'}
                  style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#475569', marginBottom:5, textTransform:'uppercase' }}>Service</label>
                <select value={service} onChange={e => setService(e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box' }}>
                  {['Moto Taxi','Taxi','Livraison Express','Taxi Premium'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#475569', marginBottom:5, textTransform:'uppercase' }}>Priorité</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}
                  style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box' }}>
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
            </div>
            <button onClick={handleDispatch} disabled={!pickup || !dropoff || dispatching}
              style={{ width:'100%', padding:'11px', borderRadius:10, border:'none', cursor: pickup&&dropoff ? 'pointer' : 'not-allowed',
                background: pickup&&dropoff ? 'linear-gradient(135deg,#4680ff,#6366f1)' : '#e2e8f0',
                color: pickup&&dropoff ? '#fff' : '#94a3b8', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {dispatching ? 'Dispatch en cours…' : <><FiZap size={16} /> Auto-Dispatch IA</>}
            </button>
          </div>

          {/* Best Candidates */}
          <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:18 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
              <FiTarget size={15} color="#4680ff" /> Meilleurs conducteurs
            </div>
            {CANDIDATES.map((c, i) => (
              <div key={c.id} onClick={() => setSelectedCandidate(c)} style={{ padding:'12px', borderRadius:12, marginBottom:8, cursor:'pointer',
                border: selectedCandidate?.id===c.id ? '2px solid #4680ff' : '2px solid #f1f5f9', background: selectedCandidate?.id===c.id ? '#eff6ff' : '#fafbfc',
                transition:'border 0.15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background: i===0?'#4680ff':i===1?'#22c55e':'#f59e0b',
                    color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, flexShrink:0 }}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'#1e293b' }}>{c.name}</div>
                    <div style={{ fontSize:11, color:'#94a3b8' }}>{c.vehicle} · {c.distance} km · {c.eta}</div>
                  </div>
                  <div style={{ fontWeight:800, fontSize:16, color: i===0?'#4680ff':i===1?'#22c55e':'#f59e0b' }}>{c.score}%</div>
                </div>
                {scoreBar('Distance', Math.round(100 - c.distance * 20), '#4680ff')}
                {scoreBar('Note', Math.round(c.rating / 5 * 100), '#f59e0b')}
                {scoreBar('Acceptation', c.acceptance, '#22c55e')}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Map + History */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:14 }}>
          {/* Map */}
          <div style={{ height:360, borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <MapContainer center={[14.6937, -17.4441]} zoom={13} style={{ width:'100%', height:'100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {CANDIDATES.map(c => (
                <Marker key={c.id} position={[c.lat, c.lon]}>
                  <Popup><b>{c.name}</b><br/>Score IA: {c.score}%<br/>{c.distance} km · {c.eta}</Popup>
                </Marker>
              ))}
              <Circle center={[14.6937, -17.4441]} radius={5000} color="#4680ff" fillColor="#4680ff" fillOpacity={0.05} weight={1} />
            </MapContainer>
          </div>

          {/* Pre-positioning */}
          <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:18 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
              🧠 Pré-positionnement LiviBrain — Prochaine heure
            </div>
            <div style={{ display:'flex', gap:12 }}>
              {PREPOSITION.map(p => (
                <div key={p.zone} style={{ flex:1, border:`1px solid ${p.color}33`, borderRadius:12, padding:'12px 14px', background:p.color+'08' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:p.color, marginBottom:4 }}>{p.zone}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginBottom:6 }}>Demande: {p.demand}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#1e293b', marginBottom:8 }}>{p.suggestion}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <div style={{ flex:1, background:'#f1f5f9', borderRadius:4, height:4, overflow:'hidden' }}>
                      <div style={{ width:`${p.confidence}%`, height:'100%', background:p.color, borderRadius:4 }} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:p.color }}>{p.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
            <div style={{ padding:'12px 18px', borderBottom:'1px solid #f1f5f9', fontWeight:700, fontSize:14, color:'#1e293b' }}>Historique dispatches (10 derniers)</div>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <tbody>
                {HISTORY.map((h, i) => (
                  <tr key={h.id} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                    <td style={{ padding:'9px 14px', fontWeight:600, color:'#4680ff' }}>{h.id}</td>
                    <td style={{ padding:'9px 14px', color:'#475569' }}>{h.pickup} → {h.dropoff}</td>
                    <td style={{ padding:'9px 14px', color:'#1e293b', fontWeight:500 }}>{h.driver}</td>
                    <td style={{ padding:'9px 14px' }}>
                      <span style={{ background: h.result==='accepté'?'#f0fdf4':h.result==='refusé'?'#fef2f2':'#f1f5f9',
                        color: h.result==='accepté'?'#16a34a':h.result==='refusé'?'#dc2626':'#64748b',
                        borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{h.result}</span>
                    </td>
                    <td style={{ padding:'9px 14px', color:'#94a3b8' }}>{h.time}</td>
                    <td style={{ padding:'9px 14px', color:'#64748b', fontSize:11 }}>⏱ {h.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
