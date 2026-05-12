import { useState } from 'react'
import { FiBell, FiSend, FiUsers, FiClock, FiTrendingUp, FiPlus } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const CAMPAIGNS = [
  { id:'camp-001', name:'Promo Vendredi Soir', type:'promo', target:'all', sent:4521, opened:2341, clicked:987, ctr:'21.8%', status:'sent', time:'Ven 18:00', channel:'push' },
  { id:'camp-002', name:'Rappel Conducteurs Inactifs', type:'retention', target:'drivers', sent:234, opened:189, clicked:145, ctr:'62.0%', status:'sent', time:'Lun 09:00', channel:'push+sms' },
  { id:'camp-003', name:'Nouveau service LiviFood', type:'feature', target:'clients', sent:8923, opened:3456, clicked:1234, ctr:'13.8%', status:'sent', time:'Mar 12:00', channel:'push' },
  { id:'camp-004', name:'Bonus Ramadan', type:'promo', target:'all', sent:0, opened:0, clicked:0, ctr:'—', status:'scheduled', time:'Demain 07:00', channel:'push+email' },
  { id:'camp-005', name:'NPS Post-Course', type:'survey', target:'clients', sent:1234, opened:789, clicked:456, ctr:'37.0%', status:'sent', time:'Continue', channel:'in-app' },
]

const SEGMENTS = [
  { id:'seg-001', name:'Clients actifs 30j', count:3421, color:'#22c55e', desc:'Ont effectué ≥1 course dans les 30 derniers jours' },
  { id:'seg-002', name:'Conducteurs top performers', count:89, color:'#4680ff', desc:'Score ≥ 90 et ≥ 50 courses ce mois' },
  { id:'seg-003', name:'Clients à risque churn', count:567, color:'#ef4444', desc:'Aucune course depuis 14 jours, habituellement actifs' },
  { id:'seg-004', name:'Nouveaux utilisateurs 7j', count:234, color:'#f59e0b', desc:'Inscription dans les 7 derniers jours' },
  { id:'seg-005', name:'Premium / VIP', count:156, color:'#a855f7', desc:'Clients avec ≥10 courses/mois ou statut corporate' },
]

const OPTIMAL_TIMES = [
  { segment:'Clients actifs', bestTime:'07:30 – 08:30', day:'Lun-Ven', lift:'+34%', icon:'☀️' },
  { segment:'Conducteurs', bestTime:'12:00 – 13:00', day:'Tous jours', lift:'+28%', icon:'🚗' },
  { segment:'Clients inactifs', bestTime:'19:00 – 20:00', day:'Mer-Sam', lift:'+41%', icon:'🌙' },
  { segment:'VIP / Corporate', bestTime:'08:00 – 09:00', day:'Lun-Jeu', lift:'+22%', icon:'💼' },
]

const TYPE_COLORS = { promo:'#f59e0b', retention:'#ef4444', feature:'#4680ff', survey:'#a855f7' }

export default function SmartNotificationsPage() {
  const [tab, setTab] = useState('campaigns')
  const [showCreate, setShowCreate] = useState(false)
  const [newMsg, setNewMsg] = useState({ title:'', body:'', target:'all', channel:'push', schedule:'now' })

  const totalSent = CAMPAIGNS.reduce((s,c) => s + c.sent, 0)
  const totalOpened = CAMPAIGNS.reduce((s,c) => s + c.opened, 0)

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🔔 Notifications Intelligentes" subtitle="Segmentation IA · Timing optimal · Push · SMS · In-App · Email" />

      {/* KPIs */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          ['Campagnes actives', CAMPAIGNS.filter(c=>c.status==='scheduled').length, '#4680ff'],
          ['Notifications envoyées', totalSent.toLocaleString('fr-FR'), '#22c55e'],
          ['Taux d\'ouverture', Math.round(totalOpened/totalSent*100)+'%', '#f59e0b'],
          ['Segments actifs', SEGMENTS.length, '#a855f7'],
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
        {[['campaigns','Campagnes'],['segments','Segments'],['timing','Timing optimal'],['create','+ Nouvelle']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'campaigns' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['Campagne','Type','Cible','Canal','Envoyées','Ouvertures','CTR','Statut','Heure'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {CAMPAIGNS.map((c, i) => (
                <tr key={c.id} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                  <td style={{ padding:'10px 14px', fontWeight:700, color:'#1e293b' }}>{c.name}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ background:TYPE_COLORS[c.type]+'22', color:TYPE_COLORS[c.type], borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{c.type}</span>
                  </td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'#64748b' }}>{c.target}</td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'#475569' }}>{c.channel}</td>
                  <td style={{ padding:'10px 14px', fontWeight:600, color:'#4680ff' }}>{c.sent.toLocaleString('fr-FR')}</td>
                  <td style={{ padding:'10px 14px' }}>
                    {c.sent > 0 && (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ flex:1, background:'#f1f5f9', borderRadius:4, height:6, overflow:'hidden', minWidth:50 }}>
                          <div style={{ width:`${Math.round(c.opened/c.sent*100)}%`, height:'100%', background:'#22c55e', borderRadius:4 }} />
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:'#22c55e' }}>{Math.round(c.opened/c.sent*100)}%</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding:'10px 14px', fontWeight:700, color:'#f59e0b' }}>{c.ctr}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ background: c.status==='sent'?'#f0fdf4':c.status==='scheduled'?'#eff6ff':'#f1f5f9',
                      color: c.status==='sent'?'#16a34a':c.status==='scheduled'?'#4680ff':'#64748b',
                      borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{c.status}</span>
                  </td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'#94a3b8' }}>{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'segments' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
          {SEGMENTS.map(s => (
            <div key={s.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderLeft:`4px solid ${s.color}` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{s.name}</div>
                <div style={{ background:s.color+'22', color:s.color, borderRadius:10, padding:'4px 12px', fontWeight:800, fontSize:16 }}>
                  {s.count.toLocaleString('fr-FR')}
                </div>
              </div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:12 }}>{s.desc}</div>
              <button style={{ padding:'7px 14px', borderRadius:8, background:s.color, color:'#fff', fontWeight:700, fontSize:12, border:'none', cursor:'pointer' }}>
                Envoyer une notification
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'timing' && (
        <div>
          <div style={{ background:'#eff6ff', borderRadius:14, padding:16, marginBottom:16, border:'1px solid #bfdbfe' }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:6 }}>🧠 LiviBrain — Fenêtres optimales d'envoi</div>
            <div style={{ fontSize:12, color:'#475569' }}>Basé sur l'analyse de 450 000 interactions utilisateurs sur les 90 derniers jours.</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
            {OPTIMAL_TIMES.map((t, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ fontSize:32 }}>{t.icon}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:15, color:'#1e293b' }}>{t.segment}</div>
                    <div style={{ fontSize:12, color:'#94a3b8' }}>{t.day}</div>
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', marginBottom:2 }}>Meilleure fenêtre</div>
                    <div style={{ fontSize:18, fontWeight:800, color:'#4680ff' }}>{t.bestTime}</div>
                  </div>
                  <div style={{ background:'#f0fdf4', borderRadius:10, padding:'8px 14px', textAlign:'center' }}>
                    <div style={{ fontSize:20, fontWeight:900, color:'#22c55e' }}>{t.lift}</div>
                    <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600, textTransform:'uppercase' }}>ouvertures</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'create' && (
        <div style={{ background:'#fff', borderRadius:14, padding:28, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', maxWidth:600 }}>
          <div style={{ fontWeight:700, fontSize:16, color:'#1e293b', marginBottom:20 }}>✉️ Nouvelle campagne de notification</div>
          {[
            { label:'Titre', field:'title', type:'text', placeholder:'Ex: Offre spéciale vendredi soir !' },
            { label:'Message', field:'body', type:'textarea', placeholder:'Ex: 20% de réduction sur votre prochaine course ce soir de 18h à 22h.' },
          ].map(({label, field, type, placeholder}) => (
            <div key={field} style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#475569', marginBottom:6, textTransform:'uppercase' }}>{label}</label>
              {type === 'textarea'
                ? <textarea value={newMsg[field]} onChange={e => setNewMsg(p=>({...p,[field]:e.target.value}))} placeholder={placeholder} rows={3}
                    style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box', resize:'vertical', fontFamily:'inherit' }} />
                : <input value={newMsg[field]} onChange={e => setNewMsg(p=>({...p,[field]:e.target.value}))} placeholder={placeholder}
                    style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box' }} />
              }
            </div>
          ))}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#475569', marginBottom:6, textTransform:'uppercase' }}>Cible</label>
              <select value={newMsg.target} onChange={e => setNewMsg(p=>({...p,target:e.target.value}))}
                style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box' }}>
                <option value="all">Tous les utilisateurs</option>
                <option value="clients">Clients uniquement</option>
                <option value="drivers">Conducteurs uniquement</option>
                <option value="inactive">Utilisateurs inactifs</option>
                <option value="vip">VIP / Premium</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#475569', marginBottom:6, textTransform:'uppercase' }}>Canal</label>
              <select value={newMsg.channel} onChange={e => setNewMsg(p=>({...p,channel:e.target.value}))}
                style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:13, outline:'none', background:'#fff', boxSizing:'border-box' }}>
                <option value="push">Push notification</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="in-app">In-App</option>
                <option value="push+sms">Push + SMS</option>
                <option value="all">Tous canaux</option>
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button style={{ flex:1, padding:'11px', borderRadius:10, background:'#4680ff', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
              <FiSend size={14} style={{ marginRight:6 }} />Envoyer maintenant
            </button>
            <button style={{ flex:1, padding:'11px', borderRadius:10, background:'#f1f5f9', color:'#475569', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
              <FiClock size={14} style={{ marginRight:6 }} />Planifier
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
