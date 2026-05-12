import { useState } from 'react'
import { FiAlertTriangle, FiCheckCircle, FiPhone, FiMapPin, FiClock, FiShield, FiX } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const ANOMALIES = [
  { id:'RC-041', rideId:'R-4521', driver:'Moussa Diallo', client:'Fatou Ba', type:'Arrêt prolongé', icon:'🛑', duration:'8 min', status:'actif', lat:14.6937, lon:-17.4441, desc:'Véhicule arrêté depuis 8 minutes sans mouvement', severity:'high' },
  { id:'RC-040', rideId:'R-4520', driver:'Cheikh Ndiaye', client:'Aminata Diop', type:'Déviation itinéraire', icon:'📍', duration:'3 min', status:'actif', lat:14.7167, lon:-17.4677, desc:'Déviation de 780m par rapport à l\'itinéraire optimal', severity:'medium' },
  { id:'RC-039', rideId:'R-4519', driver:'Abdou Mbaye', client:'Rokhaya Ciss', type:'Vitesse excessive', icon:'⚡', duration:'2 min', status:'résolu', lat:14.7295, lon:-17.4728, desc:'Vitesse de 98 km/h détectée en zone 50 km/h', severity:'high' },
  { id:'RC-038', rideId:'R-4518', driver:'Mamadou Sy', client:'Ndèye Sarr', type:'Trajet inhabituel', icon:'❓', duration:'5 min', status:'faux positif', lat:14.6847, lon:-17.4738, desc:'Trajet 40% plus long que la moyenne historique', severity:'low' },
]

const CHECKINS = [
  { id:'CI-021', client:'Fatou Ba', rideId:'R-4521', time:'14:35', status:'ok', message:'Client confirme que tout va bien' },
  { id:'CI-020', client:'Rokhaya Ciss', rideId:'R-4519', time:'12:48', status:'ok', message:'Situation normale confirmée' },
  { id:'CI-019', client:'Ndèye Sarr', rideId:'R-4516', time:'11:22', status:'ok', message:'Client a répondu au check-in' },
]

const EMERGENCY = [
  { name:'SAMU', number:'15', icon:'🚑', color:'#ef4444' },
  { name:'Police', number:'17', icon:'🚔', color:'#3b82f6' },
  { name:'Pompiers', number:'18', icon:'🚒', color:'#f59e0b' },
  { name:'LiviProtect', number:'+221 33 XXX XX XX', icon:'🛡️', color:'#a855f7' },
]

const SEVERITY = { high:'#ef4444', medium:'#f59e0b', low:'#94a3b8' }

export default function RideCheckPage() {
  const [anomalies, setAnomalies] = useState(ANOMALIES)
  const [selectedAnomaly, setSelectedAnomaly] = useState(null)
  const [tab, setTab] = useState('anomalies')

  const actifs = anomalies.filter(a => a.status === 'actif')

  const resolve = (id, status) => {
    setAnomalies(prev => prev.map(a => a.id === id ? {...a, status} : a))
    setSelectedAnomaly(null)
  }

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🛡️ RideCheck — Sécurité Active" subtitle="Détection d'anomalies en temps réel · LiviProtect 360°" />

      {/* Live Alert Banner */}
      {actifs.length > 0 && (
        <div style={{ background:'#fef2f2', border:'2px solid #ef4444', borderRadius:12, padding:'14px 20px', marginBottom:20,
          display:'flex', alignItems:'center', gap:12, animation:'pulse 2s infinite' }}>
          <div style={{ width:12, height:12, borderRadius:'50%', background:'#ef4444', animation:'ping 1s infinite', flexShrink:0 }} />
          <div>
            <span style={{ fontWeight:800, fontSize:15, color:'#dc2626' }}>🚨 {actifs.length} anomalie(s) active(s) en cours</span>
            <div style={{ fontSize:12, color:'#ef4444', marginTop:2 }}>Intervention recommandée immédiatement</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          ['Courses surveillées', '156', '#4680ff'],
          ['Anomalies détectées', anomalies.filter(a=>a.status==='actif').length, '#ef4444'],
          ['Faux positifs', anomalies.filter(a=>a.status==='faux positif').length, '#f59e0b'],
          ['Résolues', anomalies.filter(a=>a.status==='résolu').length, '#22c55e'],
        ].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', borderRadius:12, padding:'14px 20px', flex:1, minWidth:130,
            boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, marginTop:4 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['anomalies','Anomalies'],['checkins','Check-ins Silencieux'],['emergency','Contacts Urgence']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'anomalies' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {anomalies.map(a => (
            <div key={a.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
              borderLeft:`4px solid ${a.status==='actif' ? SEVERITY[a.severity] : a.status==='résolu' ? '#22c55e' : '#94a3b8'}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <span style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{a.type}</span>
                    <span style={{ background: a.status==='actif'?'#fef2f2':a.status==='résolu'?'#f0fdf4':'#f1f5f9',
                      color: a.status==='actif'?'#dc2626':a.status==='résolu'?'#16a34a':'#64748b',
                      borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{a.status}</span>
                    {a.status === 'actif' && <span style={{ background:SEVERITY[a.severity]+'22', color:SEVERITY[a.severity], borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:600 }}>
                      {a.severity === 'high' ? '🔴 Critique' : a.severity === 'medium' ? '🟡 Modéré' : '⚪ Faible'}
                    </span>}
                  </div>
                  <div style={{ fontSize:13, color:'#64748b', marginBottom:8 }}>{a.desc}</div>
                  <div style={{ display:'flex', gap:20, fontSize:12, color:'#94a3b8' }}>
                    <span>🚗 {a.driver}</span>
                    <span>👤 {a.client}</span>
                    <span>📋 {a.rideId}</span>
                    <span>⏱ {a.duration}</span>
                  </div>
                </div>
                {a.status === 'actif' && (
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <button onClick={() => setSelectedAnomaly(a)} style={{ padding:'8px 14px', borderRadius:10, fontSize:12, fontWeight:700, cursor:'pointer', background:'#4680ff', color:'#fff', border:'none' }}>Intervenir</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'checkins' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#1e293b' }}>Check-ins silencieux reçus</div>
            <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>Le client confirme silencieusement qu'il va bien sans alerter le conducteur</div>
          </div>
          {CHECKINS.map((c, i) => (
            <div key={c.id} style={{ padding:'14px 20px', borderTop: i>0 ? '1px solid #f1f5f9' : 'none', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>✅</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{c.client}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{c.message}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, color:'#94a3b8' }}>Course {c.rideId}</div>
                <div style={{ fontSize:12, fontWeight:600, color:'#22c55e' }}>{c.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'emergency' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
            {EMERGENCY.map(e => (
              <div key={e.name} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:56, height:56, borderRadius:14, background:e.color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>{e.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:16, color:'#1e293b' }}>{e.name}</div>
                  <div style={{ fontSize:20, fontWeight:900, color:e.color, letterSpacing:'0.05em' }}>{e.number}</div>
                </div>
                <button style={{ padding:'8px 14px', borderRadius:10, background:e.color, color:'#fff', border:'none', cursor:'pointer', fontWeight:700, fontSize:12, display:'flex', alignItems:'center', gap:6 }}>
                  <FiPhone size={13} /> Appeler
                </button>
              </div>
            ))}
          </div>
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:14, padding:20 }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#dc2626', marginBottom:12 }}>🚨 Désactivation d'urgence</div>
            <div style={{ fontSize:13, color:'#7f1d1d', marginBottom:16 }}>En cas d'urgence critique, ce bouton désactive toutes les courses actives et envoie une alerte à tous les superviseurs disponibles.</div>
            <button style={{ padding:'12px 24px', borderRadius:10, background:'#ef4444', color:'#fff', fontWeight:800, fontSize:15, border:'none', cursor:'pointer' }}>
              🛑 Arrêt d'urgence — Désactiver toutes les courses actives
            </button>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {selectedAnomaly && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}
          onClick={() => setSelectedAnomaly(null)}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:480, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontWeight:800, fontSize:18, color:'#1e293b' }}>{selectedAnomaly.icon} Intervention — {selectedAnomaly.type}</div>
              <button onClick={() => setSelectedAnomaly(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8' }}><FiX size={20} /></button>
            </div>
            <div style={{ background:'#f8fafc', borderRadius:12, padding:16, marginBottom:20 }}>
              <div style={{ fontSize:13, color:'#475569', marginBottom:8 }}>{selectedAnomaly.desc}</div>
              <div style={{ fontSize:12, color:'#94a3b8' }}>Conducteur: {selectedAnomaly.driver} · Client: {selectedAnomaly.client}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={() => resolve(selectedAnomaly.id, 'faux positif')} style={{ padding:'12px', borderRadius:10, background:'#f1f5f9', color:'#475569', fontWeight:700, border:'none', cursor:'pointer', fontSize:14 }}>
                ✅ Faux positif — Tout va bien
              </button>
              <button style={{ padding:'12px', borderRadius:10, background:'#eff6ff', color:'#4680ff', fontWeight:700, border:'none', cursor:'pointer', fontSize:14 }}>
                📱 Envoyer un check-in silencieux au client
              </button>
              <button onClick={() => resolve(selectedAnomaly.id, 'résolu')} style={{ padding:'12px', borderRadius:10, background:'#fef3c7', color:'#92400e', fontWeight:700, border:'none', cursor:'pointer', fontSize:14 }}>
                📞 J'ai contacté le conducteur — Résolu
              </button>
              <button style={{ padding:'12px', borderRadius:10, background:'#ef4444', color:'#fff', fontWeight:700, border:'none', cursor:'pointer', fontSize:14 }}>
                🚨 Escalader aux services d'urgence (15 / 17 / 18)
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes ping{0%{transform:scale(1);opacity:1}70%{transform:scale(2);opacity:0}100%{transform:scale(2);opacity:0}}`}</style>
    </div>
  )
}
