import { useState, useEffect } from 'react'
import { FiUserPlus, FiGift, FiTrendingUp, FiUsers, FiCopy, FiCheck, FiShare2 } from 'react-icons/fi'
import { PageHeader, Btn } from '../../components/PageLayout'
import { supabase } from '../../services/api/supabaseClient'

const MOCK_REFERRALS = [
  { id: 'REF-001', referrer: 'Fatou Diallo',    referrer_id: 'USR-001', referred: 'Oumar Ba',       referred_id: 'USR-020', status: 'completed', bonus: 1000, created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'REF-002', referrer: 'Cheikh Fall',     referrer_id: 'USR-002', referred: 'Aminata Sow',    referred_id: 'USR-021', status: 'completed', bonus: 1000, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'REF-003', referrer: 'Fatou Diallo',    referrer_id: 'USR-001', referred: 'Ibou Ndiaye',    referred_id: 'USR-022', status: 'pending',   bonus: 1000, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'REF-004', referrer: 'Rokhaya Sarr',    referrer_id: 'USR-005', referred: 'Mamadou Diop',   referred_id: 'USR-023', status: 'completed', bonus: 1000, created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'REF-005', referrer: 'Aminata Koné',    referrer_id: 'USR-003', referred: 'Seynabou Gaye',  referred_id: 'USR-024', status: 'completed', bonus: 1000, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'REF-006', referrer: 'Cheikh Fall',     referrer_id: 'USR-002', referred: 'Lamine Touré',   referred_id: 'USR-025', status: 'expired',   bonus: 0,    created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'REF-007', referrer: 'Ibou Ndoye',      referrer_id: 'USR-006', referred: 'Ndeye Mbaye',    referred_id: 'USR-026', status: 'pending',   bonus: 1000, created_at: new Date(Date.now() - 86400000 * 0.5).toISOString() },
]

const REFERRAL_CONFIG = {
  referrer_bonus: 1000,
  referred_bonus: 500,
  min_rides_to_unlock: 3,
  validity_days: 30,
  code_prefix: 'LIVI',
}

const STATUS_STYLE = {
  completed: { label: 'Complété', color: '#22c55e', bg: '#f0fdf4' },
  pending:   { label: 'En attente', color: '#f59e0b', bg: '#fef3c7' },
  expired:   { label: 'Expiré', color: '#94a3b8', bg: '#f8fafc' },
}

function TopReferrer({ user, rank, count, bonus }) {
  const medals = ['🥇', '🥈', '🥉']
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 16px', borderBottom: '1px solid #f8fafc',
    }}>
      <span style={{ fontSize: rank <= 3 ? 20 : 13, width: 28, textAlign: 'center', flexShrink: 0 }}>
        {rank <= 3 ? medals[rank - 1] : `#${rank}`}
      </span>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #4680ff, #6366f1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color: '#fff',
      }}>
        {user.charAt(0)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{user}</div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>{count} filleul{count > 1 ? 's' : ''}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#22c55e' }}>+{bonus.toLocaleString()}</div>
        <div style={{ fontSize: 9, color: '#94a3b8' }}>FCFA gagnés</div>
      </div>
    </div>
  )
}

export default function ReferralPage() {
  const [referrals, setReferrals] = useState(MOCK_REFERRALS)
  const [loading, setLoading]     = useState(true)
  const [copied, setCopied]       = useState(false)
  const [config, setConfig]       = useState(REFERRAL_CONFIG)
  const [editingConfig, setEditingConfig] = useState(false)
  const [draft, setDraft]         = useState(REFERRAL_CONFIG)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && data?.length > 0) setReferrals(data)
      } catch { /* mock */ }
      setLoading(false)
    }
    load()
  }, [])

  const stats = {
    total:     referrals.length,
    completed: referrals.filter(r => r.status === 'completed').length,
    pending:   referrals.filter(r => r.status === 'pending').length,
    totalPaid: referrals.filter(r => r.status === 'completed').reduce((s, r) => s + (r.bonus || 0), 0),
  }

  // Top parrains
  const byReferrer = {}
  referrals.forEach(r => {
    if (!byReferrer[r.referrer]) byReferrer[r.referrer] = { count: 0, bonus: 0 }
    byReferrer[r.referrer].count++
    if (r.status === 'completed') byReferrer[r.referrer].bonus += r.bonus || 0
  })
  const topReferrers = Object.entries(byReferrer)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://livigo.sn/invite/LIVI-ADMIN')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveConfig = async () => {
    setConfig(draft)
    setEditingConfig(false)
    try {
      await supabase.from('referral_config').upsert({ id: 1, ...draft })
    } catch { /* simulation */ }
  }

  return (
    <div>
      <PageHeader title="Parrainage & Programme Referral" icon={<FiUserPlus />}>
        <Btn color="#4680ff" onClick={() => { setDraft(config); setEditingConfig(true) }}>
          Configurer
        </Btn>
      </PageHeader>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total parrainages',  value: stats.total,       color: '#4680ff', icon: <FiUsers size={16} /> },
          { label: 'Complétés',          value: stats.completed,   color: '#22c55e', icon: <FiCheck size={16} /> },
          { label: 'En attente',         value: stats.pending,     color: '#f59e0b', icon: <FiUserPlus size={16} /> },
          { label: 'Bonus distribués',   value: `${stats.totalPaid.toLocaleString()} FCFA`, color: '#a855f7', icon: <FiGift size={16} /> },
        ].map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1e293b' }}>{k.value}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        {/* Tableau des parrainages */}
        <div>
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                <FiShare2 size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Historique des parrainages
              </h3>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{referrals.length} enregistrements</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  {['ID', 'Parrain', 'Filleul', 'Date', 'Statut', 'Bonus'].map((h, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#94a3b8' }}>Chargement…</td></tr>
                ) : referrals.map((r, i) => {
                  const s = STATUS_STYLE[r.status]
                  const date = new Date(r.created_at).toLocaleDateString('fr-FR')
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 16px', fontSize: 11, color: '#94a3b8' }}>{r.id}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{r.referrer}</td>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#475569' }}>{r.referred}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: '#64748b' }}>{date}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 800, color: r.status === 'completed' ? '#22c55e' : '#94a3b8' }}>
                        {r.status === 'completed' ? `+${r.bonus.toLocaleString()} FCFA` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panneau droit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Config programme */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiGift size={13} color="#a855f7" /> Configuration du programme
            </div>
            {editingConfig ? (
              <div>
                {[
                  { key: 'referrer_bonus', label: 'Bonus parrain (FCFA)' },
                  { key: 'referred_bonus', label: 'Bonus filleul (FCFA)' },
                  { key: 'min_rides_to_unlock', label: 'Courses min. pour débloquer' },
                  { key: 'validity_days', label: 'Validité du lien (jours)' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>{f.label}</label>
                    <input
                      type="number"
                      value={draft[f.key]}
                      onChange={e => setDraft(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  <button onClick={handleSaveConfig} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#22c55e', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    Enregistrer
                  </button>
                  <button onClick={() => setEditingConfig(false)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 12, cursor: 'pointer' }}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {[
                  { label: 'Bonus parrain',         value: `${config.referrer_bonus.toLocaleString()} FCFA` },
                  { label: 'Bonus filleul',          value: `${config.referred_bonus.toLocaleString()} FCFA` },
                  { label: 'Courses min.',           value: `${config.min_rides_to_unlock} courses` },
                  { label: 'Validité lien',          value: `${config.validity_days} jours` },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                    <span style={{ color: '#64748b' }}>{r.label}</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lien de partage admin */}
          <div style={{ background: 'linear-gradient(135deg, #4680ff15, #6366f115)', borderRadius: 12, padding: '14px 16px', border: '1px solid #4680ff20' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Lien de parrainage admin</div>
            <div style={{ fontSize: 11, color: '#64748b', background: '#fff', borderRadius: 8, padding: '7px 10px', marginBottom: 8, wordBreak: 'break-all' }}>
              livigo.sn/invite/LIVI-ADMIN
            </div>
            <button onClick={handleCopyLink} style={{
              width: '100%', padding: '8px', borderRadius: 8, border: 'none',
              background: copied ? '#22c55e' : '#4680ff', color: '#fff',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {copied ? <><FiCheck size={13} /> Copié !</> : <><FiCopy size={13} /> Copier le lien</>}
            </button>
          </div>

          {/* Top parrains */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiTrendingUp size={13} color="#f59e0b" /> Top parrains
            </div>
            {topReferrers.map(([name, data], i) => (
              <TopReferrer key={name} user={name} rank={i + 1} count={data.count} bonus={data.bonus} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
