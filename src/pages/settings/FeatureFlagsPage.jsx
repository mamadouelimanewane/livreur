import { useState } from 'react'
import { FiToggleLeft, FiToggleRight, FiPercent, FiUsers, FiBarChart2, FiPlay } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const FLAGS = [
  { id:'ff-001', name:'livifood_v2', label:'LiviFood v2 UI', description:'Nouvelle interface LiviFood avec catégories et filtres avancés', enabled:true,  rollout:100, env:'production', type:'release',  segment:'all',    impact:'high'   },
  { id:'ff-002', name:'surge_auto',  label:'Tarification dynamique auto', description:'Majoration automatique basée sur demande/offre en temps réel', enabled:true,  rollout:75,  env:'production', type:'ops',     segment:'all',    impact:'high'   },
  { id:'ff-003', name:'ai_chat',     label:'Chat IA LiviBrain',    description:'Assistant IA pour les conducteurs avec conseils personnalisés', enabled:true,  rollout:50,  env:'production', type:'feature', segment:'drivers', impact:'medium' },
  { id:'ff-004', name:'dark_mode',   label:'Mode sombre app',      description:'Thème sombre pour l\'app mobile conducteur et client', enabled:false, rollout:0,   env:'staging',    type:'feature', segment:'all',    impact:'low'    },
  { id:'ff-005', name:'biometric',   label:'Auth biométrique',     description:'Connexion par empreinte digitale / Face ID', enabled:false, rollout:0,   env:'staging',    type:'security',segment:'all',    impact:'high'   },
  { id:'ff-006', name:'co2_tracker', label:'Suivi CO₂ trajet',     description:'Affichage empreinte carbone en temps réel par course', enabled:true,  rollout:30,  env:'production', type:'feature', segment:'all',    impact:'low'    },
]

const AB_TESTS = [
  { id:'ab-001', name:'Checkout CTA', variantA:'Confirmer la course', variantB:'Réserver maintenant', traffic:50, convA:18.4, convB:22.1, status:'running', winner:'B', days:12 },
  { id:'ab-002', name:'Onboarding Flow', variantA:'3 étapes (actuel)', variantB:'1 étape simplifiée', traffic:30, convA:61.2, convB:74.8, status:'running', winner:'B', days:7 },
  { id:'ab-003', name:'Prix affiché', variantA:'Prix total TTC', variantB:'Prix HT + détail', traffic:50, convA:34.1, convB:31.9, status:'concluded', winner:'A', days:21 },
]

const TYPE_COLORS = { release:'#22c55e', ops:'#f59e0b', feature:'#4680ff', security:'#ef4444' }

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(FLAGS)
  const [tab, setTab] = useState('flags')
  const [editFlag, setEditFlag] = useState(null)

  const toggle = (id) => setFlags(prev => prev.map(f => f.id===id ? {...f, enabled: !f.enabled, rollout: f.enabled ? 0 : 100} : f))

  const enabledCount = flags.filter(f => f.enabled).length

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🚩 Feature Flags & A/B Testing" subtitle="Déploiements progressifs · Expérimentation · Rollback instantané" />

      {/* KPIs */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          ['Flags actifs', `${enabledCount}/${flags.length}`, '#22c55e'],
          ['Tests A/B en cours', AB_TESTS.filter(t=>t.status==='running').length, '#4680ff'],
          ['Rollout moyen', Math.round(flags.filter(f=>f.enabled).reduce((s,f)=>s+f.rollout,0)/enabledCount||0)+'%', '#f59e0b'],
          ['Incidents évités', '3 ce mois', '#a855f7'],
        ].map(([l,v,c]) => (
          <div key={l} style={{ background:'#fff', borderRadius:12, padding:'14px 20px', flex:1, minWidth:150,
            boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderTop:`3px solid ${c}` }}>
            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, marginTop:4 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['flags','Feature Flags'],['abtests','Tests A/B'],['history','Historique']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'flags' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {flags.map(f => (
            <div key={f.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
              borderLeft:`4px solid ${f.enabled ? '#22c55e' : '#e2e8f0'}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
                <button onClick={() => toggle(f.id)} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0, marginTop:2 }}>
                  {f.enabled
                    ? <FiToggleRight size={28} color="#22c55e" />
                    : <FiToggleLeft size={28} color="#cbd5e1" />}
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <span style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{f.label}</span>
                    <code style={{ background:'#f1f5f9', borderRadius:6, padding:'2px 8px', fontSize:11, color:'#475569', fontFamily:'monospace' }}>{f.name}</code>
                    <span style={{ background: TYPE_COLORS[f.type]+'22', color:TYPE_COLORS[f.type], borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{f.type}</span>
                    <span style={{ background: f.env==='production'?'#fef3c7':'#f0fdf4', color:f.env==='production'?'#92400e':'#16a34a',
                      borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{f.env}</span>
                  </div>
                  <div style={{ fontSize:13, color:'#64748b', marginBottom:10 }}>{f.description}</div>
                  {f.enabled && (
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontSize:12, color:'#94a3b8' }}>Rollout:</span>
                      <div style={{ flex:1, maxWidth:200, background:'#f1f5f9', borderRadius:6, height:8, overflow:'hidden' }}>
                        <div style={{ width:`${f.rollout}%`, height:'100%', background:'#22c55e', borderRadius:6 }} />
                      </div>
                      <span style={{ fontSize:13, fontWeight:700, color:'#22c55e', minWidth:32 }}>{f.rollout}%</span>
                      <span style={{ fontSize:11, color:'#94a3b8' }}>Segment: {f.segment}</span>
                    </div>
                  )}
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button style={{ padding:'6px 12px', borderRadius:8, background:'#eff6ff', color:'#4680ff', fontWeight:600, fontSize:12, border:'none', cursor:'pointer' }}>Éditer</button>
                  {f.enabled && <button style={{ padding:'6px 12px', borderRadius:8, background:'#fef2f2', color:'#ef4444', fontWeight:600, fontSize:12, border:'none', cursor:'pointer' }}>Rollback</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'abtests' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {AB_TESTS.map(t => (
            <div key={t.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:'#1e293b', marginBottom:4 }}>{t.name}</div>
                  <div style={{ display:'flex', gap:10 }}>
                    <span style={{ background: t.status==='running'?'#eff6ff':'#f0fdf4',
                      color: t.status==='running'?'#4680ff':'#22c55e',
                      borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:700 }}>
                      {t.status==='running' ? '🔄 En cours' : '✅ Conclu'}
                    </span>
                    <span style={{ fontSize:12, color:'#94a3b8' }}>Trafic: {t.traffic}% · {t.days} jours</span>
                  </div>
                </div>
                {t.status === 'concluded' && (
                  <div style={{ background:'#f0fdf4', borderRadius:10, padding:'8px 16px', textAlign:'center' }}>
                    <div style={{ fontSize:12, color:'#16a34a', fontWeight:700 }}>🏆 Gagnant: Variante {t.winner}</div>
                  </div>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[{label:'A', name:t.variantA, conv:t.convA}, {label:'B', name:t.variantB, conv:t.convB}].map(v => (
                  <div key={v.label} style={{ border:`2px solid ${t.winner===v.label && t.status==='concluded' ? '#22c55e' : '#e2e8f0'}`,
                    borderRadius:12, padding:14, background: t.winner===v.label && t.status==='concluded' ? '#f0fdf4' : '#fafbfc' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ fontWeight:700, fontSize:13, color:'#1e293b' }}>Variante {v.label}</span>
                      {t.winner===v.label && t.status==='concluded' && <span style={{ color:'#22c55e', fontSize:12 }}>🏆</span>}
                    </div>
                    <div style={{ fontSize:12, color:'#64748b', marginBottom:10 }}>{v.name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, background:'#f1f5f9', borderRadius:6, height:10, overflow:'hidden' }}>
                        <div style={{ width:`${v.conv}%`, height:'100%', background: v.conv >= (v.label==='A'?t.convB:t.convA) ? '#22c55e' : '#94a3b8', borderRadius:6 }} />
                      </div>
                      <span style={{ fontWeight:800, fontSize:15, color:'#1e293b', minWidth:45 }}>{v.conv}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button style={{ padding:'12px', borderRadius:12, background:'#4680ff', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <FiPlay size={14} /> Créer un nouveau test A/B
          </button>
        </div>
      )}

      {tab === 'history' && (
        <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>Historique des changements</div>
          {[
            { date:'2026-05-09 14:32', user:'admin@livigo.sn', action:'Activé', flag:'ai_chat', rollout:'50%', color:'#22c55e' },
            { date:'2026-05-08 11:15', user:'manager@livigo.sn', action:'Rollback', flag:'dark_mode', rollout:'0%', color:'#ef4444' },
            { date:'2026-05-07 09:00', user:'admin@livigo.sn', action:'Rollout', flag:'surge_auto', rollout:'75%', color:'#4680ff' },
            { date:'2026-05-06 16:45', user:'admin@livigo.sn', action:'Créé', flag:'co2_tracker', rollout:'30%', color:'#a855f7' },
          ].map((h, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:h.color, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <span style={{ fontWeight:600, color:h.color }}>{h.action}</span>
                <span style={{ color:'#1e293b', fontWeight:700 }}> {h.flag} </span>
                <span style={{ fontSize:12, color:'#94a3b8' }}>({h.rollout}) par {h.user}</span>
              </div>
              <div style={{ fontSize:11, color:'#94a3b8' }}>{h.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
