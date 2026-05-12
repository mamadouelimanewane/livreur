import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiMapPin, FiCheckCircle, FiClock, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MULTISTOP_RIDES = [
  { id:'MS-041', driver:'Moussa Diallo', stops:[
      { address:'Almadies, Villa 12', status:'completed', time:'14:10' },
      { address:'Plateau, Rue Carnot', status:'completed', time:'14:28' },
      { address:'Médina, Av. Bourguiba', status:'current', time:'14:45 (prévu)' },
      { address:'HLM, Marché', status:'pending', time:'15:05 (prévu)' },
    ], totalKm:14.2, price:4800, etaTotal:'15:05', coords:[[14.6705,-17.4459],[14.6937,-17.4441],[14.7167,-17.4677],[14.7040,-17.4520]] },
  { id:'MS-040', driver:'Cheikh Ndiaye', stops:[
      { address:'Guédiawaye, Cité Soprim', status:'completed', time:'13:30' },
      { address:'Pikine, Marché Tilène', status:'current', time:'13:52' },
      { address:'Thiaroye, Gare', status:'pending', time:'14:15 (prévu)' },
    ], totalKm:11.8, price:3600, etaTotal:'14:15', coords:[[14.7441,-17.4607],[14.7534,-17.4108],[14.7200,-17.4100]] },
  { id:'MS-039', driver:'Abdou Mbaye', stops:[
      { address:'Corniche, Hôtel Terrou-Bi', status:'completed', time:'12:00' },
      { address:'Plateau, Ambassade Fr', status:'completed', time:'12:18' },
      { address:'Fann, UCAD', status:'completed', time:'12:35' },
    ], totalKm:8.9, price:2700, etaTotal:'Terminé', coords:[[14.6780,-17.4380],[14.6937,-17.4441],[14.6847,-17.4738]] },
]

const POOL_RIDES = [
  { id:'P-021', passengers:2, driver:'Mamadou Sy', route:'Almadies → Plateau', savings:'34%', duration:'22 min', co2saved:'1.2 kg' },
  { id:'P-020', passengers:3, driver:'Ibrahima Sow', route:'Parcelles → Médina', savings:'41%', duration:'18 min', co2saved:'1.8 kg' },
  { id:'P-019', passengers:2, driver:'Babacar Diop', route:'Ouakam → Corniche', savings:'28%', duration:'15 min', co2saved:'0.9 kg' },
]

const STATUS_STYLE = { completed:{ color:'#22c55e', bg:'#f0fdf4', label:'✅ Complété' }, current:{ color:'#4680ff', bg:'#eff6ff', label:'📍 En cours' }, pending:{ color:'#94a3b8', bg:'#f8fafc', label:'⏳ À venir' } }

export default function MultiStopPage() {
  const [selected, setSelected] = useState(MULTISTOP_RIDES[0])
  const [tab, setTab] = useState('multistop')

  const avgStops = (MULTISTOP_RIDES.reduce((s,r) => s + r.stops.length, 0) / MULTISTOP_RIDES.length).toFixed(1)

  const kpi = (label, value, sub, color) => (
    <div style={{ background:'#fff', borderRadius:12, padding:'14px 20px', flex:1, minWidth:130, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderTop:`3px solid ${color}` }}>
      <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color, marginTop:4 }}>{value}</div>
      <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{sub}</div>
    </div>
  )

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🛣️ Multi-Stops & Covoiturage" subtitle="Courses multi-arrêts et LiviShare Pool" />
      <style>{`.leaflet-container{border-radius:12px;}`}</style>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {kpi('Multi-stops actifs', MULTISTOP_RIDES.filter(r=>r.etaTotal!=='Terminé').length, 'En ce moment', '#4680ff')}
        {kpi('Stops moyens', avgStops, 'Par course multi-stops', '#a855f7')}
        {kpi('Pool actifs', POOL_RIDES.length, 'Covoiturages en cours', '#22c55e')}
        {kpi('Économie moyenne', '34%', 'Pour les passagers Pool', '#f59e0b')}
      </div>

      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['multistop','Multi-Stops'],['pool','LiviShare Pool']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'multistop' && (
        <div style={{ display:'flex', gap:16 }}>
          {/* List */}
          <div style={{ width:300, display:'flex', flexDirection:'column', gap:12 }}>
            {MULTISTOP_RIDES.map(r => (
              <div key={r.id} onClick={() => setSelected(r)} style={{ background:'#fff', borderRadius:12, padding:'14px 16px', cursor:'pointer',
                boxShadow:'0 1px 4px rgba(0,0,0,0.07)', border: selected?.id===r.id ? '2px solid #4680ff' : '2px solid transparent', transition:'border 0.15s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{r.id}</span>
                  <span style={{ fontSize:11, color:'#4680ff', fontWeight:600 }}>{r.stops.filter(s=>s.status==='completed').length}/{r.stops.length} stops</span>
                </div>
                <div style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>🚗 {r.driver}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  {r.stops.map((s, i) => {
                    const st = STATUS_STYLE[s.status]
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:20, height:20, borderRadius:'50%', background:st.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0, color:st.color }}>
                          {i+1}
                        </div>
                        <div style={{ flex:1, fontSize:11, color:s.status==='current' ? '#4680ff' : s.status==='completed' ? '#94a3b8' : '#475569',
                          fontWeight:s.status==='current' ? 600 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.address}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:'1px solid #f1f5f9' }}>
                  <span style={{ fontSize:11, color:'#64748b' }}>{r.totalKm} km</span>
                  <span style={{ fontSize:12, fontWeight:700, color:'#1e293b' }}>{r.price.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            ))}
          </div>

          {/* Map + Detail */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            {selected && (
              <>
                <div style={{ height:340 }}>
                  <MapContainer center={selected.coords[0]} zoom={13} style={{ width:'100%', height:'100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline positions={selected.coords} color="#4680ff" weight={4} dashArray="6,4" />
                    {selected.stops.map((s, i) => (
                      <Marker key={i} position={selected.coords[i]}>
                        <Popup><b>Stop {i+1}</b><br/>{s.address}<br/>{s.time}</Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
                <div style={{ background:'#fff', borderRadius:12, padding:18, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
                  <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:14 }}>Détail des arrêts — {selected.id}</div>
                  {selected.stops.map((s, i) => {
                    const st = STATUS_STYLE[s.status]
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:st.bg, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:st.color, flexShrink:0 }}>{i+1}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:13, color:'#1e293b' }}>{s.address}</div>
                          <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{s.time}</div>
                        </div>
                        <span style={{ background:st.bg, color:st.color, borderRadius:8, padding:'3px 8px', fontSize:11, fontWeight:600 }}>{st.label}</span>
                      </div>
                    )
                  })}
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, paddingTop:10, borderTop:'2px solid #f1f5f9' }}>
                    <span style={{ fontSize:13, color:'#64748b' }}>Total: {selected.totalKm} km</span>
                    <span style={{ fontSize:15, fontWeight:800, color:'#4680ff' }}>{selected.price.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'pool' && (
        <div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {POOL_RIDES.map(r => (
              <div key={r.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', alignItems:'center', gap:20 }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'#22c55e22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>🚗</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:4 }}>{r.route}</div>
                  <div style={{ fontSize:12, color:'#64748b' }}>Conducteur: {r.driver} · {r.duration}</div>
                </div>
                <div style={{ textAlign:'center', padding:'8px 16px', background:'#eff6ff', borderRadius:12 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:'#4680ff' }}>{r.passengers}</div>
                  <div style={{ fontSize:10, color:'#94a3b8' }}>passagers</div>
                </div>
                <div style={{ textAlign:'center', padding:'8px 16px', background:'#f0fdf4', borderRadius:12 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:'#22c55e' }}>-{r.savings}</div>
                  <div style={{ fontSize:10, color:'#94a3b8' }}>économies</div>
                </div>
                <div style={{ textAlign:'center', padding:'8px 16px', background:'#f0fdf4', borderRadius:12 }}>
                  <div style={{ fontSize:16, fontWeight:800, color:'#16a34a' }}>🌱 {r.co2saved}</div>
                  <div style={{ fontSize:10, color:'#94a3b8' }}>CO₂ économisé</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', gap:24 }}>
            {[['Courses Pool ce mois','234'],['Économies générées','1.34M FCFA'],['CO₂ économisé total','456 kg'],['Satisfaction Pool','4.7★']].map(([l,v]) => (
              <div key={l} style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:24, fontWeight:900, color:'#22c55e' }}>{v}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
