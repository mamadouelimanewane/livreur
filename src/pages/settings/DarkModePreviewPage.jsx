import { useState } from 'react'
import { FiMoon, FiSun, FiSmartphone, FiMonitor, FiCheck, FiDroplet } from 'react-icons/fi'
import { PageHeader } from '../../components/PageLayout'

const THEMES = [
  { id:'light',   name:'Clair',          icon:'☀️', primary:'#4680ff', bg:'#f4f6f9', card:'#ffffff', text:'#1e293b', sub:'#64748b' },
  { id:'dark',    name:'Sombre',         icon:'🌙', primary:'#4680ff', bg:'#0f172a', card:'#1e293b', text:'#f1f5f9', sub:'#94a3b8' },
  { id:'amoled',  name:'AMOLED',         icon:'⚫', primary:'#4680ff', bg:'#000000', card:'#111111', text:'#ffffff',  sub:'#aaaaaa' },
  { id:'sepia',   name:'Sépia',          icon:'📜', primary:'#b45309', bg:'#fdf6e3', card:'#fffbf0', text:'#3b2f0d', sub:'#8a6a2e' },
  { id:'highcon', name:'Contraste élevé',icon:'🔆', primary:'#ffffff', bg:'#000000', card:'#1a1a1a', text:'#ffffff',  sub:'#cccccc' },
]

const FONT_SIZES = ['Petit (12px)', 'Normal (14px)', 'Grand (16px)', 'Très grand (18px)']

const ACCESSIBILITY = [
  { id:'reduce_motion', label:'Réduire les animations', desc:'Désactive les transitions et animations', enabled:false },
  { id:'high_contrast', label:'Mode contraste élevé',  desc:'Augmente le contraste texte/fond', enabled:false },
  { id:'large_tap',     label:'Grandes zones tactiles', desc:'Agrandit les boutons et zones cliquables', enabled:true  },
  { id:'screen_reader', label:'Compatibilité lecteur d\'écran', desc:'Labels ARIA optimisés', enabled:true  },
  { id:'color_blind',   label:'Mode daltonisme',       desc:'Palette adaptée (deutéranopie/protanopie)', enabled:false },
]

const BRAND_COLORS = [
  { name:'LiviGo Bleu',    value:'#4680ff', default:true },
  { name:'LiviGo Violet',  value:'#a855f7', default:false },
  { name:'LiviGo Vert',    value:'#22c55e', default:false },
  { name:'LiviGo Orange',  value:'#f59e0b', default:false },
  { name:'Nuit Sénégal',   value:'#1a1d2e', default:false },
  { name:'Terracotta',     value:'#c2410c', default:false },
]

export default function DarkModePreviewPage() {
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [fontSize, setFontSize] = useState(1)
  const [accessibility, setAccessibility] = useState(ACCESSIBILITY)
  const [brandColor, setBrandColor] = useState('#4680ff')
  const [previewDevice, setPreviewDevice] = useState('mobile')
  const [tab, setTab] = useState('themes')

  const toggleA11y = (id) => setAccessibility(prev => prev.map(a => a.id===id ? {...a, enabled: !a.enabled} : a))
  const theme = THEMES.find(t => t.id === selectedTheme)

  return (
    <div style={{ padding:'24px', background:'#f4f6f9', minHeight:'100vh' }}>
      <PageHeader title="🎨 Design System & Accessibilité" subtitle="Thèmes · Mode sombre · PWA · Polices · Contraste WCAG 2.1 AA" />

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'#fff', borderRadius:10, padding:4, width:'fit-content', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
        {[['themes','Thèmes & Couleurs'],['typography','Typographie'],['accessibility','Accessibilité'],['pwa','PWA']].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', border:'none',
            background: tab===v ? '#4680ff' : 'transparent', color: tab===v ? '#fff' : '#64748b' }}>{l}</button>
        ))}
      </div>

      {tab === 'themes' && (
        <div style={{ display:'flex', gap:16 }}>
          {/* Theme selector */}
          <div style={{ width:280, flexShrink:0 }}>
            <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', marginBottom:14 }}>
              <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:14 }}>Thème de l'interface</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {THEMES.map(t => (
                  <button key={t.id} onClick={() => setSelectedTheme(t.id)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, cursor:'pointer',
                      border: selectedTheme===t.id ? `2px solid ${brandColor}` : '2px solid #e2e8f0',
                      background: selectedTheme===t.id ? brandColor+'11' : '#fafbfc' }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:t.bg, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>{t.icon}</div>
                    <span style={{ fontWeight:600, fontSize:13, color:'#1e293b', flex:1, textAlign:'left' }}>{t.name}</span>
                    {selectedTheme===t.id && <FiCheck size={14} color={brandColor} />}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:14 }}>Couleur principale</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {BRAND_COLORS.map(c => (
                  <button key={c.value} onClick={() => setBrandColor(c.value)} title={c.name}
                    style={{ width:36, height:36, borderRadius:10, background:c.value, border: brandColor===c.value ? '3px solid #1e293b' : '2px solid transparent',
                      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {brandColor===c.value && <FiCheck size={14} color="#fff" />}
                  </button>
                ))}
              </div>
              <div style={{ marginTop:10, fontSize:12, color:'#94a3b8' }}>Sélectionné: <strong style={{ color:brandColor }}>{BRAND_COLORS.find(c=>c.value===brandColor)?.name}</strong></div>
            </div>
          </div>

          {/* Live preview */}
          <div style={{ flex:1 }}>
            <div style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>Aperçu en direct</div>
                <div style={{ display:'flex', gap:8 }}>
                  {[['mobile','📱'],['desktop','🖥️']].map(([d,ico]) => (
                    <button key={d} onClick={() => setPreviewDevice(d)}
                      style={{ padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', border:'none',
                        background: previewDevice===d ? brandColor : '#f1f5f9', color: previewDevice===d ? '#fff' : '#64748b' }}>{ico} {d}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'center' }}>
                <div style={{
                  width: previewDevice==='mobile' ? 320 : '100%',
                  background: theme?.bg, borderRadius:16, padding:20, border:'2px solid #e2e8f0',
                  boxShadow:'0 8px 32px rgba(0,0,0,0.12)', minHeight:300
                }}>
                  {/* Mock app UI */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                    <div style={{ fontWeight:800, fontSize:16, color:theme?.text }}>🚀 LiviGo</div>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:brandColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ color:'#fff', fontSize:14 }}>M</span>
                    </div>
                  </div>
                  <div style={{ background:theme?.card, borderRadius:12, padding:14, marginBottom:12, boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize:11, color:theme?.sub, fontWeight:600, textTransform:'uppercase', marginBottom:4 }}>Courses aujourd'hui</div>
                    <div style={{ fontSize:28, fontWeight:900, color:brandColor }}>156</div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                    {['Actives','Terminées','Annulées'].map((l,i) => (
                      <div key={l} style={{ flex:1, background:theme?.card, borderRadius:10, padding:10, textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontSize:16, fontWeight:800, color:[brandColor,'#22c55e','#ef4444'][i] }}>{[12,134,10][i]}</div>
                        <div style={{ fontSize:9, color:theme?.sub, fontWeight:600, textTransform:'uppercase' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <button style={{ width:'100%', padding:'10px', borderRadius:10, background:brandColor, color:'#fff', fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>
                    Nouvelle course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'typography' && (
        <div style={{ background:'#fff', borderRadius:14, padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.07)', maxWidth:600 }}>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:20 }}>Taille de police</div>
          <div style={{ display:'flex', gap:10, marginBottom:24 }}>
            {FONT_SIZES.map((f, i) => (
              <button key={i} onClick={() => setFontSize(i)}
                style={{ flex:1, padding:'10px', borderRadius:10, border: fontSize===i ? `2px solid ${brandColor}` : '2px solid #e2e8f0',
                  background: fontSize===i ? brandColor+'11' : '#fafbfc', fontWeight:600, fontSize:11+i, color: fontSize===i ? brandColor : '#475569', cursor:'pointer' }}>
                {f}
              </button>
            ))}
          </div>
          <div style={{ fontWeight:700, fontSize:15, color:'#1e293b', marginBottom:16 }}>Hiérarchie typographique</div>
          {[
            { tag:'H1', size:'28px', weight:900, label:'Titre principal' },
            { tag:'H2', size:'22px', weight:800, label:'Titre secondaire' },
            { tag:'H3', size:'18px', weight:700, label:'Sous-titre' },
            { tag:'Body', size:'14px', weight:400, label:'Texte courant — Lorem ipsum dolor sit amet.' },
            { tag:'Caption', size:'11px', weight:600, label:'LÉGENDE • ÉTIQUETTE • UPPERCASE' },
          ].map(t => (
            <div key={t.tag} style={{ display:'flex', alignItems:'baseline', gap:16, padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
              <span style={{ width:60, fontSize:11, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', flexShrink:0 }}>{t.tag}</span>
              <span style={{ fontSize: parseInt(t.size) + (fontSize-1)*2 + 'px', fontWeight:t.weight, color:'#1e293b' }}>{t.label}</span>
              <span style={{ fontSize:10, color:'#cbd5e1', marginLeft:'auto' }}>{t.size} / {t.weight}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'accessibility' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:640 }}>
          <div style={{ background:'#eff6ff', borderRadius:12, padding:14, border:'1px solid #bfdbfe', marginBottom:4 }}>
            <div style={{ fontWeight:700, color:'#1e293b', fontSize:13 }}>♿ Conformité WCAG 2.1 Niveau AA</div>
            <div style={{ fontSize:12, color:'#475569', marginTop:4 }}>LiviGo vise la conformité totale WCAG 2.1 AA pour l'accessibilité universelle.</div>
          </div>
          {accessibility.map(a => (
            <div key={a.id} style={{ background:'#fff', borderRadius:14, padding:18, boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
              display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, color:'#1e293b', marginBottom:2 }}>{a.label}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>{a.desc}</div>
              </div>
              <button onClick={() => toggleA11y(a.id)}
                style={{ width:52, height:28, borderRadius:14, border:'none', cursor:'pointer', transition:'background 0.2s',
                  background: a.enabled ? brandColor : '#cbd5e1', position:'relative', flexShrink:0 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'#fff', position:'absolute', top:4,
                  left: a.enabled ? 28 : 4, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'pwa' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, maxWidth:800 }}>
          {[
            { icon:'📱', title:'Installation PWA', desc:'L\'app peut être installée sur l\'écran d\'accueil sans passer par un store.', status:'Configuré', color:'#22c55e' },
            { icon:'⚡', title:'Service Worker', desc:'Cache intelligent pour une expérience hors-ligne et des temps de chargement réduits.', status:'Actif', color:'#22c55e' },
            { icon:'🔔', title:'Push Notifications Web', desc:'Notifications push directement depuis le navigateur, même app fermée.', status:'Actif', color:'#22c55e' },
            { icon:'📦', title:'App Cache Strategy', desc:'Cache-first pour assets statiques, network-first pour données dynamiques.', status:'Optimisé', color:'#22c55e' },
            { icon:'🔒', title:'HTTPS requis', desc:'Toutes les communications sont sécurisées via TLS 1.3.', status:'Sécurisé', color:'#22c55e' },
            { icon:'📊', title:'Lighthouse Score', desc:'Score de performance, accessibilité et PWA mesuré automatiquement.', status:'98/100', color:'#4680ff' },
          ].map(item => (
            <div key={item.icon} style={{ background:'#fff', borderRadius:14, padding:18, boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div style={{ fontSize:28 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#1e293b' }}>{item.title}</div>
                  <span style={{ background:item.color+'22', color:item.color, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700 }}>{item.status}</span>
                </div>
              </div>
              <div style={{ fontSize:12, color:'#64748b' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
