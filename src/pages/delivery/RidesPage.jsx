import { useState } from 'react'
import { FiPackage, FiDownload, FiInfo, FiEye } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'

const allRides = [
  { id: 'RD-8820', client: 'Fatou Diallo', driver: 'Oumar Sall', from: 'Plateau, Dakar', to: 'Parcelles Assainies', product: 'Colis Standard', amount: '500 FCFA', date: '15/03/2024 14:32', status: 'Terminée' },
  { id: 'RD-8821', client: 'Moussa Ndiaye', driver: 'Ibrahima Ba', from: 'Dakar Centre', to: 'Guédiawaye', product: 'Colis Express', amount: '800 FCFA', date: '15/03/2024 15:10', status: 'En cours' },
  { id: 'RD-8822', client: 'Aminata Koné', driver: '-', from: 'Dakar Sud', to: 'Thiès', product: 'Courrier Document', amount: '300 FCFA', date: '15/03/2024 13:00', status: 'Annulée' },
  { id: 'RD-8823', client: 'Ibrahim Touré', driver: 'Abdoulaye Mbaye', from: 'Plateau', to: 'Rufisque', product: 'Grand Colis', amount: '1500 FCFA', date: '14/03/2024 09:45', status: 'Terminée' },
  { id: 'RD-8824', client: 'Mariama Balde', driver: 'Cheikh Fall', from: 'Dakar Centre', to: 'Dakar Sud', product: 'Alimentaire', amount: '600 FCFA', date: '14/03/2024 12:00', status: 'Échouée' },
  { id: 'RD-8825', client: 'Seydou Diouf', driver: '-', from: 'Parcelles', to: 'Plateau', product: 'Colis Standard', amount: '500 FCFA', date: '14/03/2024 08:30', status: 'Auto-annulée' },
]

const statusConfig = {
  'Terminée': { color: '#2ed8a3', bg: '#e6faf4' },
  'En cours': { color: '#4680ff', bg: '#ebf4ff' },
  'Annulée': { color: '#ff5370', bg: '#fff0f3' },
  'Échouée': { color: '#6f42c1', bg: '#f3eeff' },
  'Auto-annulée': { color: '#ffb64d', bg: '#fff8ee' },
}

const typeFilter = {
  active: ['En cours'],
  completed: ['Terminée'],
  cancelled: ['Annulée'],
  failed: ['Échouée'],
  'auto-cancelled': ['Auto-annulée'],
  all: Object.keys(statusConfig),
}

const typeTitles = {
  active: 'Courses en cours',
  completed: 'Courses terminées',
  cancelled: 'Courses annulées',
  failed: 'Courses échouées',
  'auto-cancelled': 'Courses auto-annulées',
  all: 'Toutes les courses (Livraison)',
}

export default function RidesPage({ type = 'all' }) {
  const [search, setSearch] = useState('')
  const allowed = typeFilter[type] || typeFilter.all
  const filtered = allRides.filter(r => {
    if (!allowed.includes(r.status)) return false
    if (search && !r.client.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <PageHeader title={typeTitles[type]} icon={<FiPackage />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      {type === 'all' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {Object.entries(statusConfig).map(([s, c]) => (
            <Badge key={s} color={c.color} bg={c.bg}>
              {s} ({allRides.filter(r => r.status === s).length})
            </Badge>
          ))}
        </div>
      )}

      <FilterBar>
        <Select value="Sénégal" onChange={() => {}} options={['Sénégal']} />
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Parcelles', 'Guédiawaye']} />
        <TextInput placeholder="ID course ou client..." value={search} onChange={e => setSearch(e.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => setSearch('')}>Réinitialiser</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID Course', 'Client', 'Conducteur', 'Départ', 'Arrivée', 'Produit', 'Montant', 'Date', 'Statut', 'Action'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: 30, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>Aucune course disponible</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id}
                  style={{ borderBottom: '1px solid #f7f9fb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ color: '#4680ff', fontWeight: 600 }}>{r.id}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{r.client}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: r.driver === '-' ? '#a0aec0' : '#4a5568' }}>{r.driver}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#718096' }}>{r.from}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#718096' }}>{r.to}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12 }}>{r.product}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>{r.amount}</td>
                  <td style={{ padding: '10px 14px', fontSize: 11, color: '#718096', whiteSpace: 'nowrap' }}>{r.date}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge color={statusConfig[r.status].color} bg={statusConfig[r.status].bg}>{r.status}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#718096' }}>
          <span>Affichage de {filtered.length} courses</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['«', '‹', '1', '›', '»'].map((p, i) => (
              <button key={i} style={{ padding: '3px 8px', border: '1px solid #ddd', borderRadius: 4, background: p === '1' ? '#4680ff' : '#fff', color: p === '1' ? '#fff' : '#4a5568', cursor: 'pointer', fontSize: 12 }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
