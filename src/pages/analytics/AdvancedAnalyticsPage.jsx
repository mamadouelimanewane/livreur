import { useState } from 'react'
import { FiTrendingUp, FiTrendingDown, FiDownload, FiUsers, FiDollarSign, FiActivity } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'

const PERIODS = ['7j', '30j', '90j']

const FUNNEL = [
  { label:'Demandes reçues', value:1240, pct:100, color:'#4680ff' },
  { label:'Assignées à conducteur', value:1118, pct:90.2, color:'#6366f1' },
  { label:'Acceptées par conducteur', value:1006, pct:81.1, color:'#a855f7' },
  { label:'Courses complétées', value:934, pct:75.3, color:'#22c55e' },
]

const COHORT = [
  { segment:'Clients — Jan 2026', j7:72, j30:54, j90:41, size:234 },
  { segment:'Clients — Fév 2026', j7:68, j30:51, j90:38, size:198 },
  { segment:'Clients — Mar 2026', j7:75, j30:58, j90:null, size:267 },
  { segment:'Clients — Avr 2026', j7:71, j30:null, j90:null, size:312 },
  { segment:'Conducteurs — Jan', j7:88, j30:76, j90:65, size:45 },
  { segment:'Conducteurs — Fév', j7:91, j30:80, j90:null, size:38 },
]

const CANCEL_REASONS = [
  { reason:'Conducteur pas trouvé', pct:34, color:'#ef4444' },
  { reason:'Client a annulé', pct:28, color:'#f59e0b' },
  { reason:'Timeout système', pct:22, color:'#4680ff' },
  { reason:'Conducteur a refusé', pct:10, color:'#a855f7' },
  { reason:'Autre', pct:6, color:'#94a3b8' },
]

const TOP_ZONES = [
  { zone:'Plateau', revenue:892000, rides:234, trend:'+12%' },
  { zone:'Almadies', revenue:734000, rides:189, trend:'+8%' },
  { zone:'Médina', revenue:612000, rides:178, trend:'+5%' },
  { zone:'Corniche', revenue:543000, rides:156, trend:'+15%' },
  { zone:'Parcelles', revenue:421000, rides:134, trend:'-3%' },
]

const TOP_DRIVERS = [
  { name:'Moussa Diallo', earnings:312000, rides:89, rating:4.9 },
  { name:'Cheikh Ndiaye', earnings:287000, rides:82, rating:4.8 },
  { name:'Babacar Diop', earnings:256000, rides:76, rating:4.8 },
  { name:'Abdou Mbaye', earnings:234000, rides:71, rating:4.7 },
  { name:'Mamadou Sy', earnings:198000, rides:63, rating:4.6 },
]

const FORECAST = [
  { day:'Lun', actual:145, predicted:140 },
  { day:'Mar', actual:132, predicted:138 },
  { day:'Mer', actual:158, predicted:150 },
  { day:'Jeu', actual:171, predicted:165 },
  { day:'Ven', actual:189, predicted:180 },
  { day:'Sam', actual:null, predicted:210 },
  { day:'Dim', actual:null, predicted:195 },
]

function heatColor(v) {
  if (v === null) return '#f1f5f9'
  if (v >= 80) return '#22c55e'
  if (v >= 60) return '#86efac'
  if (v >= 40) return '#fde68a'
  return '#fca5a5'
}

export default function AdvancedAnalyticsPage() {
  const [period, setPeriod] = useState('30j')
  const maxForecast = Math.max(...FORECAST.map(f => f.actual || f.predicted))

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="📊 Analytics Avancés" subtitle="RevPAD · Cohortes · Entonnoir · Prévisions IA" />

      {/* Period selector */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ display:'flex', gap:4, background:'#fff', borderRadius:10, padding:4, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
              background: period===p ? '#4680ff' : 'transparent', color: period===p ? '#fff' : '#64748b' }}>{p}</button>
          ))}
        </div>
        <Btn onClick={() => {}} icon={<FiDownload size={13} />}>Export CSV</Btn>
      </div>

      {/* Executive KPIs */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          { label:'RevPAD', value:'8 450 FCFA', sub:'Revenu / conducteur / jour', trend:'+11%', up:true, color:'#4680ff' },
          { label:'Utilisation conducteurs', value:'67%', sub:'Temps actif / temps en ligne', trend:'+5%', up:true, color:'#22c55e' },
          { label:'Demand Fulfillment', value:'75.3%', sub:'Demandes → Complétées', trend:'-2%', up:false, color:'#f59e0b' },
          { label:'MTTP', value:'4.2 min', sub:'Temps moyen avant prise en charge', trend:'-18s', up:true, color:'#a855f7' },
        ].map(k => (
          <div key={k.label} style={{ background:'#fff', borderRadius:12, padding:'16px 20px', flex:1, minWidth:160, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', borderLeft:`4px solid ${k.color}` }}>
            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:24, fontWeight:900, color:k.color, marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:11, color:'#64748b', marginBottom:6 }}>{k.sub}</div>
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600, color: k.up ? '#22c55e' : '#ef4444' }}>
              {k.up ? <FiTrendingUp size={13} /> : <FiTrendingDown size={13} />} {k.trend} vs période précédente
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Funnel */}
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:22 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:18 }}>Entonnoir de Conversion</div>
          {FUNNEL.map((f, i) => (
            <div key={f.label} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#1e293b' }}>{f.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:f.color }}>{f.value.toLocaleString('fr-FR')} <span style={{ fontWeight:400, color:'#94a3b8', fontSize:11 }}>({f.pct}%)</span></span>
              </div>
              <div style={{ background:'#f1f5f9', borderRadius:8, height:18, overflow:'hidden', position:'relative' }}>
                <div style={{ width:`${f.pct}%`, height:'100%', background:f.color, borderRadius:8, transition:'width 0.6s ease',
                  display:'flex', alignItems:'center', paddingLeft:8 }}>
                  {f.pct > 20 && <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>{f.pct}%</span>}
                </div>
              </div>
              {i < FUNNEL.length-1 && (
                <div style={{ fontSize:11, color:'#ef4444', textAlign:'right', marginTop:2 }}>
                  -{(100 - FUNNEL[i+1].pct).toFixed(1)}% de perte
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cancellation */}
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:22 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:18 }}>Causes d'Annulation</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {CANCEL_REASONS.map(r => (
              <div key={r.reason}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:13 }}>
                  <span style={{ color:'#475569' }}>{r.reason}</span>
                  <span style={{ fontWeight:700, color:r.color }}>{r.pct}%</span>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:8, height:10, overflow:'hidden' }}>
                  <div style={{ width:`${r.pct}%`, height:'100%', background:r.color, borderRadius:8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohorts */}
      <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:22, marginBottom:16 }}>
        <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:4 }}>Rétention par Cohorte</div>
        <div style={{ fontSize:12, color:'#94a3b8', marginBottom:16 }}>% d'utilisateurs actifs après J7, J30, J90</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ borderCollapse:'collapse', fontSize:13, width:'100%' }}>
            <thead><tr>
              {['Cohorte','Taille','Rétention J7','Rétention J30','Rétention J90'].map(h => (
                <th key={h} style={{ padding:'8px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em', background:'#f8fafc' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {COHORT.map((c, i) => (
                <tr key={i} style={{ borderTop:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'9px 14px', fontWeight:600, color:'#1e293b' }}>{c.segment}</td>
                  <td style={{ padding:'9px 14px', color:'#64748b' }}>{c.size} utilisateurs</td>
                  {[c.j7, c.j30, c.j90].map((v, j) => (
                    <td key={j} style={{ padding:'9px 14px' }}>
                      <div style={{ background:heatColor(v), borderRadius:8, padding:'4px 10px', textAlign:'center', display:'inline-block', minWidth:50,
                        fontWeight:700, fontSize:13, color: v && v >= 60 ? '#15803d' : v && v >= 40 ? '#92400e' : v ? '#dc2626' : '#94a3b8' }}>
                        {v !== null ? `${v}%` : '—'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
        {/* Forecast */}
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:22 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:16 }}>Prévision Courses — Semaine</div>
          <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:120 }}>
            {FORECAST.map(f => (
              <div key={f.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:2, alignItems:'center' }}>
                  {f.actual && <div style={{ width:'100%', background:'#4680ff', borderRadius:'3px 3px 0 0',
                    height:`${f.actual / maxForecast * 90}px`, minHeight:4 }} />}
                  {!f.actual && <div style={{ width:'100%', background:'#e0e7ff', borderRadius:'3px 3px 0 0',
                    height:`${f.predicted / maxForecast * 90}px`, minHeight:4, border:'2px dashed #6366f1' }} />}
                </div>
                <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>{f.day}</div>
                <div style={{ fontSize:10, fontWeight:700, color: f.actual ? '#4680ff' : '#a5b4fc' }}>{f.actual || f.predicted}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:12, marginTop:10, fontSize:11 }}>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}><div style={{ width:12, height:12, background:'#4680ff', borderRadius:2 }} /><span style={{ color:'#64748b' }}>Réel</span></div>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}><div style={{ width:12, height:12, background:'#e0e7ff', border:'2px dashed #6366f1', borderRadius:2 }} /><span style={{ color:'#64748b' }}>Prévu</span></div>
          </div>
        </div>

        {/* Top Zones */}
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:22 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:16 }}>Top 5 Zones par Revenu</div>
          {TOP_ZONES.map((z, i) => (
            <div key={z.zone} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, padding:'8px 12px', background:'#f8fafc', borderRadius:10 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:['#4680ff','#22c55e','#f59e0b','#a855f7','#0ea5e9'][i]+'22',
                color:['#4680ff','#22c55e','#f59e0b','#a855f7','#0ea5e9'][i], fontWeight:800, fontSize:12,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, color:'#1e293b' }}>{z.zone}</div>
                <div style={{ fontSize:11, color:'#94a3b8' }}>{z.rides} courses</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontWeight:700, fontSize:12, color:'#1e293b' }}>{(z.revenue/1000).toFixed(0)}K</div>
                <div style={{ fontSize:11, fontWeight:600, color: z.trend.startsWith('+') ? '#22c55e' : '#ef4444' }}>{z.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Drivers */}
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:22 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:16 }}>Top 5 Conducteurs</div>
          {TOP_DRIVERS.map((d, i) => (
            <div key={d.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, padding:'8px 12px', background:'#f8fafc', borderRadius:10 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:['#ffd700','#c0c0c0','#cd7f32','#94a3b8','#94a3b8'][i]+'33',
                fontWeight:800, fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {['🥇','🥈','🥉','4','5'][i]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:12, color:'#1e293b' }}>{d.name}</div>
                <div style={{ fontSize:10, color:'#94a3b8' }}>{d.rides} courses · ⭐ {d.rating}</div>
              </div>
              <div style={{ fontWeight:700, fontSize:12, color:'#4680ff' }}>{(d.earnings/1000).toFixed(0)}K FCFA</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
