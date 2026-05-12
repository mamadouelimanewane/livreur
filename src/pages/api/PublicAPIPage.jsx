import { useState } from 'react'
import { FiKey, FiCode, FiActivity, FiGlobe, FiCopy, FiEye, FiEyeOff, FiPlus, FiTrash2 } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const API_KEYS = [
  { id:'key-001', name:'Prod Frontend', key:'lk_live_4x8mK...zP9q', env:'production', calls:45234, limit:100000, created:'2026-01-15', status:'active', scopes:['rides:read','rides:write','drivers:read'] },
  { id:'key-002', name:'Mobile App v2', key:'lk_live_9nRt...Wk3m', env:'production', calls:123456, limit:500000, created:'2026-02-01', status:'active', scopes:['rides:read','rides:write','drivers:read','payments:read'] },
  { id:'key-003', name:'Test Staging',  key:'lk_test_zQ2p...Xm7v', env:'sandbox',    calls:8923,  limit:10000,  created:'2026-03-10', status:'active', scopes:['rides:read','drivers:read'] },
  { id:'key-004', name:'Partner B2B',   key:'lk_live_fR5s...Hn2k', env:'production', calls:2341,  limit:50000,  created:'2026-04-01', status:'suspended', scopes:['rides:read'] },
]

const WEBHOOKS = [
  { id:'wh-001', url:'https://partner.sn/hooks/rides', events:['ride.created','ride.completed'], status:'active', delivered:1234, failed:3, latency:'245ms' },
  { id:'wh-002', url:'https://erp.company.sn/api/payments', events:['payment.success','payment.failed'], status:'active', delivered:567, failed:0, latency:'180ms' },
  { id:'wh-003', url:'https://analytics.client.com/livigo', events:['ride.created','ride.cancelled','ride.completed'], status:'paused', delivered:234, failed:12, latency:'890ms' },
]

const ENDPOINTS = [
  { method:'GET',    path:'/v1/rides',           desc:'Liste toutes les courses',         auth:true,  rate:'100/min' },
  { method:'POST',   path:'/v1/rides',           desc:'Crée une nouvelle course',          auth:true,  rate:'30/min'  },
  { method:'GET',    path:'/v1/rides/:id',        desc:'Détails d\'une course',            auth:true,  rate:'200/min' },
  { method:'PATCH',  path:'/v1/rides/:id/status', desc:'Met à jour le statut',             auth:true,  rate:'60/min'  },
  { method:'GET',    path:'/v1/drivers',          desc:'Liste les conducteurs disponibles', auth:true,  rate:'60/min'  },
  { method:'GET',    path:'/v1/drivers/:id/location', desc:'Position GPS en temps réel',  auth:true,  rate:'300/min' },
  { method:'POST',   path:'/v1/payments',         desc:'Initie un paiement',               auth:true,  rate:'30/min'  },
  { method:'GET',    path:'/v1/analytics/summary', desc:'KPIs et métriques globaux',       auth:true,  rate:'10/min'  },
]

const METHOD_COLORS = { GET:'#22c55e', POST:'#4680ff', PATCH:'#f59e0b', DELETE:'#ef4444', PUT:'#a855f7' }

export default function PublicAPIPage() {
  const [tab, setTab] = useState('keys')
  const [showKey, setShowKey] = useState({})
  const [copied, setCopied] = useState(null)

  const copyKey = (id, key) => {
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const totalCalls = API_KEYS.reduce((s, k) => s + k.calls, 0)

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🔌 API Publique LiviGo" subtitle="REST API v1 · Webhooks · Docs interactives · Rate limiting" />

      {/* KPIs */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          ['Clés API actives', API_KEYS.filter(k=>k.status==='active').length, '#4680ff'],
          ['Appels aujourd\'hui', totalCalls.toLocaleString('fr-FR'), '#22c55e'],
          ['Webhooks actifs', WEBHOOKS.filter(w=>w.status==='active').length, '#a855f7'],
          ['Uptime API', '99.98%', '#f59e0b'],
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
        {[['keys','Clés API'],['webhooks','Webhooks'],['docs','Documentation'],['usage','Utilisation']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'keys' && (
        <div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, background:'#4680ff', color:'#fff', fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>
              <FiPlus size={14} /> Créer une clé API
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {API_KEYS.map(k => (
              <div key={k.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
                borderLeft:`4px solid ${k.status==='active' ? '#22c55e' : '#ef4444'}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                      <span style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{k.name}</span>
                      <span style={{ background: k.env==='production' ? '#fef3c7' : '#f0fdf4',
                        color: k.env==='production' ? '#92400e' : '#16a34a',
                        borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{k.env}</span>
                      <span style={{ background: k.status==='active' ? '#f0fdf4' : '#fef2f2',
                        color: k.status==='active' ? '#16a34a' : '#dc2626',
                        borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{k.status}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <code style={{ background:'#f8fafc', borderRadius:8, padding:'4px 12px', fontSize:13, color:'#475569', fontFamily:'monospace' }}>
                        {showKey[k.id] ? k.key : k.key.replace(/[^.]/g, '●').substring(0,20) + '...'}
                      </code>
                      <button onClick={() => setShowKey(p => ({...p, [k.id]: !p[k.id]}))}
                        style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:4 }}>
                        {showKey[k.id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                      <button onClick={() => copyKey(k.id, k.key)}
                        style={{ background:'none', border:'none', cursor:'pointer', color: copied===k.id ? '#22c55e' : '#94a3b8', padding:4 }}>
                        <FiCopy size={14} />
                      </button>
                      {copied===k.id && <span style={{ fontSize:11, color:'#22c55e', fontWeight:600 }}>Copié!</span>}
                    </div>
                  </div>
                  <button style={{ padding:'6px 12px', borderRadius:8, background:'#fef2f2', color:'#ef4444', fontWeight:600, fontSize:12, border:'none', cursor:'pointer' }}>
                    <FiTrash2 size={12} />
                  </button>
                </div>

                {/* Usage bar */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#64748b', marginBottom:4 }}>
                    <span>Utilisation: {k.calls.toLocaleString('fr-FR')} / {k.limit.toLocaleString('fr-FR')} appels</span>
                    <span style={{ fontWeight:700, color: k.calls/k.limit > 0.8 ? '#ef4444' : '#22c55e' }}>{Math.round(k.calls/k.limit*100)}%</span>
                  </div>
                  <div style={{ background:'#f1f5f9', borderRadius:6, height:8, overflow:'hidden' }}>
                    <div style={{ width:`${Math.min(k.calls/k.limit*100, 100)}%`, height:'100%',
                      background: k.calls/k.limit > 0.8 ? '#ef4444' : '#22c55e', borderRadius:6 }} />
                  </div>
                </div>

                {/* Scopes */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {k.scopes.map(sc => (
                    <span key={sc} style={{ background:'#eff6ff', color:'#4680ff', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{sc}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'webhooks' && (
        <div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:14 }}>
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:10, background:'#a855f7', color:'#fff', fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>
              <FiPlus size={14} /> Ajouter un webhook
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {WEBHOOKS.map(w => (
              <div key={w.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div>
                    <code style={{ fontSize:13, color:'#4680ff', fontFamily:'monospace', fontWeight:700 }}>{w.url}</code>
                    <div style={{ display:'flex', gap:6, marginTop:6 }}>
                      {w.events.map(ev => (
                        <span key={ev} style={{ background:'#f8fafc', color:'#475569', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{ev}</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ background: w.status==='active' ? '#f0fdf4' : '#f1f5f9',
                    color: w.status==='active' ? '#16a34a' : '#64748b',
                    borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:700 }}>{w.status}</span>
                </div>
                <div style={{ display:'flex', gap:20, fontSize:12 }}>
                  <span style={{ color:'#22c55e' }}>✅ {w.delivered} livrés</span>
                  <span style={{ color: w.failed > 0 ? '#ef4444' : '#94a3b8' }}>❌ {w.failed} échoués</span>
                  <span style={{ color:'#94a3b8' }}>⏱ Latence moy: {w.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'docs' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#1e293b' }}>Endpoints disponibles</div>
            <div style={{ fontSize:12, color:'#94a3b8' }}>Base URL: <code style={{ color:'#4680ff' }}>https://api.livigo.sn</code></div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['Méthode','Endpoint','Description','Auth','Rate Limit'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {ENDPOINTS.map((ep, i) => (
                <tr key={i} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ background: METHOD_COLORS[ep.method]+'22', color:METHOD_COLORS[ep.method],
                      borderRadius:6, padding:'3px 8px', fontSize:11, fontWeight:800, fontFamily:'monospace' }}>{ep.method}</span>
                  </td>
                  <td style={{ padding:'10px 14px', fontFamily:'monospace', fontSize:12, color:'#475569' }}>{ep.path}</td>
                  <td style={{ padding:'10px 14px', color:'#64748b' }}>{ep.desc}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ color: ep.auth ? '#4680ff' : '#94a3b8', fontSize:12 }}>{ep.auth ? '🔑 Requis' : '—'}</span>
                  </td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'#94a3b8' }}>{ep.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'usage' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>Utilisation par endpoint (24h)</div>
            {[
              { path:'GET /v1/rides', calls:18234, pct:40, color:'#4680ff' },
              { path:'POST /v1/rides', calls:9123, pct:20, color:'#22c55e' },
              { path:'GET /v1/drivers/:id/location', calls:13689, pct:30, color:'#a855f7' },
              { path:'POST /v1/payments', calls:4561, pct:10, color:'#f59e0b' },
            ].map(ep => (
              <div key={ep.path} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#64748b', marginBottom:4 }}>
                  <code style={{ color:'#475569', fontFamily:'monospace' }}>{ep.path}</code>
                  <span style={{ fontWeight:700, color:ep.color }}>{ep.calls.toLocaleString('fr-FR')} appels</span>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:6, height:10, overflow:'hidden' }}>
                  <div style={{ width:`${ep.pct}%`, height:'100%', background:ep.color, borderRadius:6 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:'#f0fdf4', borderRadius:14, padding:20, border:'1px solid #bbf7d0' }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:8 }}>✅ Statut système</div>
            {['API REST','Webhooks','Realtime WS','Auth Service'].map(s => (
              <div key={s} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid #dcfce7' }}>
                <span style={{ fontSize:13, color:'#1e293b' }}>{s}</span>
                <span style={{ background:'#22c55e', color:'#fff', borderRadius:6, padding:'2px 10px', fontSize:11, fontWeight:700 }}>✓ Opérationnel</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
