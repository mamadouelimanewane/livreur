import { useState } from 'react'
import { FiShoppingBag, FiTruck, FiHeart, FiDollarSign, FiStar, FiTrendingUp, FiPackage, FiClock } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const SERVICES = [
  { id:'food',    icon:'🍽️', name:'LiviFood',   color:'#ef4444', bg:'#fef2f2', desc:'Restauration & livraison repas',   orders:1234, revenue:8900000, growth:'+34%', active:true },
  { id:'shop',    icon:'🛍️', name:'LiviShop',   color:'#4680ff', bg:'#eff6ff', desc:'E-commerce & achats express',      orders:892,  revenue:6700000, growth:'+28%', active:true },
  { id:'pharma',  icon:'💊', name:'LiviPharma', color:'#22c55e', bg:'#f0fdf4', desc:'Médicaments & parapharmacie',       orders:456,  revenue:3400000, growth:'+41%', active:true },
  { id:'move',    icon:'📦', name:'LiviMove',   color:'#f59e0b', bg:'#fefce8', desc:'Déménagement & transport colis',    orders:234,  revenue:4500000, growth:'+19%', active:true },
  { id:'cash',    icon:'💵', name:'LiviCash',   color:'#a855f7', bg:'#faf5ff', desc:'Mobile money & transferts',         orders:3421, revenue:12300000,growth:'+56%', active:true },
  { id:'market',  icon:'🏪', name:'LiviMarket', color:'#06b6d4', bg:'#ecfeff', desc:'Marchés locaux & artisans',         orders:123,  revenue:890000,  growth:'+12%', active:false },
]

const TOP_MERCHANTS = [
  { name:'Chez Mariama',   service:'LiviFood',  orders:234, rating:4.9, revenue:1890000, category:'Thiéboudienne & Yassa' },
  { name:'Dakar Express',  service:'LiviShop',  orders:187, rating:4.7, revenue:1450000, category:'Électronique & Accessoires' },
  { name:'Pharmacie Labo', service:'LiviPharma',orders:145, rating:4.8, revenue:980000,  category:'Parapharmacie complète' },
  { name:'Transport Ba',   service:'LiviMove',  orders:89,  rating:4.6, revenue:2340000, category:'Déménagement & Stockage' },
  { name:'SendMoney SN',   service:'LiviCash',  orders:512, rating:4.9, revenue:5670000, category:'Transferts & Paiements' },
]

const CROSS_SELL = [
  { from:'Taxi', to:'LiviFood',  conversions:234, revenue:1200000, rate:'18.4%' },
  { from:'LiviFood', to:'LiviCash', conversions:189, revenue:890000, rate:'22.1%' },
  { from:'LiviShop', to:'LiviMove', conversions:67, revenue:1560000, rate:'9.3%' },
]

export default function SuperAppPage() {
  const [tab, setTab] = useState('overview')
  const [selected, setSelected] = useState(null)

  const totalRevenue = SERVICES.reduce((s, sv) => s + sv.revenue, 0)
  const totalOrders = SERVICES.reduce((s, sv) => s + sv.orders, 0)

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🚀 LiviGo Super-App" subtitle="Écosystème unifié · Food · Shop · Pharma · Move · Cash · Market" />

      {/* Global KPIs */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          ['Services actifs', SERVICES.filter(s=>s.active).length + '/6', '#4680ff'],
          ['Commandes totales', totalOrders.toLocaleString('fr-FR'), '#22c55e'],
          ['Revenus écosystème', (totalRevenue/1000000).toFixed(1)+'M FCFA', '#f59e0b'],
          ['Cross-sell actif', '3 flux', '#a855f7'],
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
        {[['overview','Vue d\'ensemble'],['merchants','Marchands'],['crosssell','Cross-Sell'],['settings','Paramètres']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
            {SERVICES.map(s => (
              <div key={s.id} style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                border:`2px solid ${s.active ? s.color+'33' : '#e2e8f0'}`, opacity: s.active ? 1 : 0.6 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:15, color:s.color }}>{s.name}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{s.desc}</div>
                    </div>
                  </div>
                  <span style={{ background: s.active ? '#f0fdf4' : '#f1f5f9', color: s.active ? '#16a34a' : '#94a3b8',
                    borderRadius:8, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{s.active ? 'Actif' : 'Bientôt'}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                  <div style={{ background:s.bg, borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
                    <div style={{ fontSize:16, fontWeight:800, color:s.color }}>{s.orders.toLocaleString('fr-FR')}</div>
                    <div style={{ fontSize:9, color:'#94a3b8', fontWeight:600, textTransform:'uppercase' }}>commandes</div>
                  </div>
                  <div style={{ background:s.bg, borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:s.color }}>{(s.revenue/1000).toFixed(0)}K</div>
                    <div style={{ fontSize:9, color:'#94a3b8', fontWeight:600, textTransform:'uppercase' }}>FCFA</div>
                  </div>
                  <div style={{ background:'#f0fdf4', borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#22c55e' }}>{s.growth}</div>
                    <div style={{ fontSize:9, color:'#94a3b8', fontWeight:600, textTransform:'uppercase' }}>croissance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue chart placeholder */}
          <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>Répartition des revenus par service</div>
            <div style={{ display:'flex', gap:2, height:40, borderRadius:10, overflow:'hidden', marginBottom:12 }}>
              {SERVICES.filter(s=>s.active).map(s => (
                <div key={s.id} style={{ flex: s.revenue, background:s.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#fff', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{s.icon}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {SERVICES.filter(s=>s.active).map(s => (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:s.color }} />
                  <span style={{ fontSize:12, color:'#64748b' }}>{s.name} — {Math.round(s.revenue/totalRevenue*100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'merchants' && (
        <div style={{ background:'#fff', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f1f5f9', fontWeight:700, fontSize:15, color:'#1e293b' }}>Top Marchands</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead><tr style={{ background:'#f8fafc' }}>
              {['Marchand','Service','Catégorie','Commandes','Note','Revenus'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {TOP_MERCHANTS.map((m, i) => {
                const svc = SERVICES.find(s => s.name === m.service)
                return (
                  <tr key={m.name} style={{ borderTop:'1px solid #f1f5f9', background: i%2 ? '#fafbfc' : '#fff' }}>
                    <td style={{ padding:'10px 14px', fontWeight:700, color:'#1e293b' }}>{m.name}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ background:svc?.bg, color:svc?.color, borderRadius:8, padding:'3px 10px', fontSize:12, fontWeight:700 }}>{svc?.icon} {m.service}</span>
                    </td>
                    <td style={{ padding:'10px 14px', fontSize:12, color:'#64748b' }}>{m.category}</td>
                    <td style={{ padding:'10px 14px', fontWeight:600, color:'#4680ff' }}>{m.orders}</td>
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <span style={{ color:'#f59e0b' }}>★</span>
                        <span style={{ fontWeight:700, color:'#1e293b' }}>{m.rating}</span>
                      </div>
                    </td>
                    <td style={{ padding:'10px 14px', fontWeight:700, color:'#22c55e' }}>{(m.revenue/1000).toFixed(0)}K FCFA</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'crosssell' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>🔄 Flux Cross-Sell actifs</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {CROSS_SELL.map((cs, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', background:'#f8fafc', borderRadius:12, border:'1px solid #e2e8f0' }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#4680ff', minWidth:100 }}>{cs.from}</div>
                  <div style={{ fontSize:18, color:'#94a3b8' }}>→</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#a855f7', minWidth:100 }}>{cs.to}</div>
                  <div style={{ flex:1, display:'flex', gap:20 }}>
                    <div><div style={{ fontSize:18, fontWeight:800, color:'#1e293b' }}>{cs.conversions}</div><div style={{ fontSize:10, color:'#94a3b8' }}>conversions</div></div>
                    <div><div style={{ fontSize:18, fontWeight:800, color:'#22c55e' }}>{(cs.revenue/1000).toFixed(0)}K</div><div style={{ fontSize:10, color:'#94a3b8' }}>FCFA</div></div>
                    <div><div style={{ fontSize:18, fontWeight:800, color:'#f59e0b' }}>{cs.rate}</div><div style={{ fontSize:10, color:'#94a3b8' }}>taux</div></div>
                  </div>
                  <button style={{ padding:'8px 14px', borderRadius:10, background:'#4680ff', color:'#fff', fontWeight:600, fontSize:12, border:'none', cursor:'pointer' }}>Optimiser</button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:'#eff6ff', borderRadius:14, padding:20, border:'1px solid #bfdbfe' }}>
            <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:8 }}>💡 Recommandations IA</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {['Proposer LiviCash aux clients LiviFood après chaque commande → +180K FCFA/mois estimé',
                'Ajouter LiviPharma dans le flux taxi post-course → +12% conversion',
                'Bundle LiviMove + LiviShop pour les nouveaux emménagements → haute valeur'].map((r,i) => (
                <div key={i} style={{ display:'flex', gap:8, fontSize:13, color:'#1e40af' }}>
                  <span>🧠</span> <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {SERVICES.map(s => (
            <div key={s.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:24 }}>{s.icon}</span>
                  <span style={{ fontWeight:700, fontSize:15, color:s.color }}>{s.name}</span>
                </div>
                <button style={{ padding:'6px 14px', borderRadius:8, background: s.active ? '#fef2f2' : '#f0fdf4',
                  color: s.active ? '#ef4444' : '#22c55e', fontWeight:700, fontSize:12, border:'none', cursor:'pointer' }}>
                  {s.active ? 'Désactiver' : 'Activer'}
                </button>
              </div>
              <div style={{ fontSize:12, color:'#94a3b8' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
