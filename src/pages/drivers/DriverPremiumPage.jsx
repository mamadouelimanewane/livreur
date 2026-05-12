import { useState } from 'react'
import { FiAward, FiTrendingUp, FiGift, FiZap, FiTarget } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const LEVELS = [
  { name:'Bronze', icon:'🥉', min:0, max:99, color:'#cd7f32', bg:'#fef3e2', drivers:23, perks:['Accès plateforme','Accumulation points','Support standard'] },
  { name:'Argent', icon:'🥈', min:100, max:499, color:'#94a3b8', bg:'#f1f5f9', drivers:31, perks:['Priorité sur nouvelles zones','Commission -1%','Badge Argent sur profil'] },
  { name:'Or', icon:'🥇', min:500, max:999, color:'#f59e0b', bg:'#fefce8', drivers:18, perks:['Commission -2%','Accès zones premium','Formation gratuite','Assurance renforcée'] },
  { name:'Platine', icon:'💎', min:1000, max:2999, color:'#4680ff', bg:'#eff6ff', drivers:12, perks:['Commission -3%','Support dédié 24/7','Courses VIP','Véhicule prioritaire','Bonus mensuel garanti'] },
  { name:'Diamant', icon:'👑', min:3000, max:Infinity, color:'#a855f7', bg:'#faf5ff', drivers:5, perks:['Commission -5%','Account manager','Accès early features','Taux crédit zéro','Statut LiviGo Ambassadeur'] },
]

const DRIVERS_LIST = [
  { name:'Moussa Diallo', level:'Platine', rides:1234, score:96, earnings:1890000, tip:'Soyez dispo 18h-21h au Plateau pour +28% de gains' },
  { name:'Cheikh Ndiaye', level:'Or', rides:678, score:91, earnings:1456000, tip:'Votre zone Médina est sous-alimentée le matin — +22% possible entre 7h-9h' },
  { name:'Babacar Diop', level:'Or', rides:521, score:89, earnings:1234000, tip:'Améliorez votre taux d\'acceptation de 2 pts pour passer Platine' },
  { name:'Abdou Mbaye', level:'Argent', rides:234, score:84, earnings:867000, tip:'156 courses encore avant le niveau Or — vous y êtes dans 18 jours à ce rythme' },
  { name:'Mamadou Sy', level:'Argent', rides:187, score:79, earnings:654000, tip:'Vos gains augmenteraient de 23% si vous étiez disponible de 7h à 9h' },
  { name:'Ibrahima Sow', level:'Bronze', rides:45, score:72, earnings:234000, tip:'Complétez votre profil KYC pour accéder au niveau Argent' },
  { name:'Oumar Fall', level:'Bronze', rides:23, score:68, earnings:123000, tip:'Activez les notifications pour ne manquer aucune course en heure de pointe' },
  { name:'Lamine Gaye', level:'Diamant', rides:4521, score:99, earnings:5670000, tip:'Vous êtes notre meilleur conducteur ! Rejoignez le programme Ambassadeur' },
]

const LEVEL_MAP = { Bronze: LEVELS[0], Argent: LEVELS[1], Or: LEVELS[2], Platine: LEVELS[3], Diamant: LEVELS[4] }

export default function DriverPremiumPage() {
  const [tab, setTab] = useState('levels')
  const [retentionBonus, setRetentionBonus] = useState(25000)
  const [minRides, setMinRides] = useState(20)

  const totalDrivers = LEVELS.reduce((s,l) => s + l.drivers, 0)

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🏆 Programme Conducteur Premium" subtitle="LiviPro — 5 niveaux d'excellence · Coaching IA · Bonus de rétention" />

      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['levels','Niveaux'],['drivers','Conducteurs'],['coaching','Coaching IA'],['bonus','Bonus Rétention']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'levels' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:20 }}>
            {LEVELS.map(l => (
              <div key={l.name} style={{ background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                border:`2px solid ${l.color}33`, textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:8 }}>{l.icon}</div>
                <div style={{ fontWeight:800, fontSize:16, color:l.color, marginBottom:4 }}>{l.name}</div>
                <div style={{ fontSize:12, color:'#94a3b8', marginBottom:14 }}>
                  {l.max === Infinity ? `${l.min}+ courses` : `${l.min}–${l.max} courses`}
                </div>
                <div style={{ background:l.bg, borderRadius:10, padding:'8px 12px', marginBottom:14 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:l.color }}>{l.drivers}</div>
                  <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600, textTransform:'uppercase' }}>conducteurs</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  {l.perks.map(p => (
                    <div key={p} style={{ fontSize:10, color:'#475569', display:'flex', alignItems:'flex-start', gap:4, textAlign:'left' }}>
                      <span style={{ color:l.color, flexShrink:0 }}>✓</span> {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Distribution bar */}
          <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>Distribution des conducteurs par niveau</div>
            <div style={{ display:'flex', borderRadius:10, overflow:'hidden', height:32, marginBottom:12 }}>
              {LEVELS.map(l => (
                <div key={l.name} style={{ flex:l.drivers, background:l.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>{l.icon} {l.drivers}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              {LEVELS.map(l => (
                <div key={l.name} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:l.color }}>{Math.round(l.drivers/totalDrivers*100)}%</div>
                  <div style={{ fontSize:10, color:'#94a3b8' }}>{l.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'drivers' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['Conducteur','Niveau','Courses','Score','Gains Total','Avantages actifs'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {DRIVERS_LIST.map((d, i) => {
                const lv = LEVEL_MAP[d.level]
                return (
                  <tr key={d.name} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                    <td style={{ padding:'10px 14px', fontWeight:700, color:'#1e293b' }}>{d.name}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ background:lv?.bg, color:lv?.color, borderRadius:8, padding:'4px 10px', fontSize:12, fontWeight:700 }}>{lv?.icon} {d.level}</span>
                    </td>
                    <td style={{ padding:'10px 14px', fontWeight:600, color:'#4680ff' }}>{d.rides.toLocaleString('fr-FR')}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, background:'#f1f5f9', borderRadius:6, height:8, overflow:'hidden' }}>
                          <div style={{ width:`${d.score}%`, height:'100%', background: d.score>=90?'#22c55e':d.score>=70?'#f59e0b':'#ef4444', borderRadius:6 }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:'#1e293b', minWidth:28 }}>{d.score}</span>
                      </div>
                    </td>
                    <td style={{ padding:'10px 14px', fontWeight:700, color:'#22c55e' }}>{(d.earnings/1000).toFixed(0)}K FCFA</td>
                    <td style={{ padding:'10px 14px', fontSize:11, color:'#64748b' }}>{lv?.perks.slice(0,2).join(', ')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'coaching' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {DRIVERS_LIST.map(d => {
            const lv = LEVEL_MAP[d.level]
            return (
              <div key={d.name} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', alignItems:'center', gap:18 }}>
                <div style={{ width:50, height:50, borderRadius:14, background:lv?.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{lv?.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:2 }}>{d.name}</div>
                  <div style={{ fontSize:11, color:lv?.color, fontWeight:600, marginBottom:8 }}>{d.level} · {d.rides} courses · Score {d.score}</div>
                  <div style={{ background:'#f8fafc', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#475569', borderLeft:`3px solid ${lv?.color}` }}>
                    🧠 <strong>LiviBrain :</strong> {d.tip}
                  </div>
                </div>
                <button style={{ padding:'8px 16px', borderRadius:10, background:'#4680ff', color:'#fff', fontWeight:600, fontSize:12, border:'none', cursor:'pointer', flexShrink:0 }}>
                  Envoyer le conseil
                </button>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'bonus' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', padding:28 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:24 }}>Configuration des Bonus de Rétention</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24 }}>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#475569', marginBottom:8, textTransform:'uppercase' }}>Montant du bonus de rétention</label>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <input type="range" min={5000} max={100000} step={5000} value={retentionBonus} onChange={e => setRetentionBonus(Number(e.target.value))}
                  style={{ flex:1, accentColor:'#4680ff' }} />
                <span style={{ fontSize:20, fontWeight:900, color:'#4680ff', minWidth:80 }}>{(retentionBonus/1000).toFixed(0)}K FCFA</span>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#475569', marginBottom:8, textTransform:'uppercase' }}>Courses minimum / 30 jours</label>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <input type="range" min={5} max={60} step={5} value={minRides} onChange={e => setMinRides(Number(e.target.value))}
                  style={{ flex:1, accentColor:'#22c55e' }} />
                <span style={{ fontSize:20, fontWeight:900, color:'#22c55e', minWidth:50 }}>{minRides}</span>
              </div>
            </div>
          </div>
          <div style={{ background:'#eff6ff', borderRadius:14, padding:20, marginBottom:20 }}>
            <div style={{ fontWeight:700, color:'#1e293b', marginBottom:8 }}>Conditions du bonus de rétention</div>
            <div style={{ display:'flex', gap:24 }}>
              <div style={{ fontSize:13, color:'#475569' }}>✅ 0 absence sur 30 jours calendaires</div>
              <div style={{ fontSize:13, color:'#475569' }}>✅ Minimum {minRides} courses complétées</div>
              <div style={{ fontSize:13, color:'#475569' }}>✅ Note ≥ 4.0 maintenue</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            {LEVELS.map(l => (
              <div key={l.name} style={{ flex:1, background:l.bg, borderRadius:12, padding:'14px', textAlign:'center', border:`1px solid ${l.color}33` }}>
                <div style={{ fontSize:24 }}>{l.icon}</div>
                <div style={{ fontWeight:700, fontSize:13, color:l.color, marginTop:4 }}>{l.name}</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#1e293b', marginTop:6 }}>
                  {(retentionBonus * (LEVELS.indexOf(l)+1) / 5 / 1000).toFixed(0)}K FCFA
                </div>
                <div style={{ fontSize:10, color:'#94a3b8', marginTop:2 }}>bonus/mois</div>
              </div>
            ))}
          </div>
          <button style={{ marginTop:24, width:'100%', padding:'12px', borderRadius:10, background:'#4680ff', color:'#fff', fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>
            💾 Sauvegarder la configuration
          </button>
        </div>
      )}
    </div>
  )
}
