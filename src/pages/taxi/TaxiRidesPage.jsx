import { useState } from 'react'
import { FiNavigation, FiDownload, FiInfo, FiEye } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'

const allRides = [
  { id: 'TX-4410', client: 'Ndeye Sarr', driver: 'Oumar Sall', from: 'Aéroport LSS', to: 'Dakar Centre', distance: '12.3 km', amount: '3200 FCFA', date: '15/03/2024 11:20', status: 'Terminée', rating: 5 },
  { id: 'TX-4411', client: 'Lamine Traoré', driver: 'Ibrahima Ba', from: 'Plateau', to: 'Parcelles Assainies', distance: '5.8 km', amount: '1500 FCFA', date: '15/03/2024 12:05', status: 'En cours', rating: null },
  { id: 'TX-4412', client: 'Rokhaya Faye', driver: '-', from: 'Guédiawaye', to: 'Dakar Centre', distance: '8.1 km', amount: '2100 FCFA', date: '15/03/2024 10:30', status: 'Annulée', rating: null },
  { id: 'TX-4413', client: 'Alioune Dione', driver: 'Abdoulaye Mbaye', from: 'Dakar Sud', to: 'Thiès', distance: '72.5 km', amount: '15000 FCFA', date: '14/03/2024 07:00', status: 'Terminée', rating: 4 },
  { id: 'TX-4414', client: 'Pape Diallo', driver: 'Cheikh Fall', from: 'Plateau', to: 'Rufisque', distance: '18.2 km', amount: '4500 FCFA', date: '14/03/2024 16:45', status: 'Échouée', rating: null },
  { id: 'TX-4415', client: 'Binta Sylla', driver: '-', from: 'Parcelles', to: 'Dakar Centre', distance: '3.4 km', amount: '900 FCFA', date: '14/03/2024 19:00', status: 'Auto-annulée', rating: null },
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
  active: 'Courses taxi en cours',
  completed: 'Courses taxi terminées',
  cancelled: 'Courses taxi annulées',
  failed: 'Courses taxi échouées',
  'auto-cancelled': 'Courses taxi auto-annulées',
  all: 'Toutes les courses (Taxi)',
}

export default function TaxiRidesPage({ type = 'all' }) {
  const [search, setSearch] = useState('')
  const allowed = typeFilter[type] || typeFilter.all

  const filtered = allRides.filter(r => {
    if (!allowed.includes(r.status)) return false
    if (search && !r.client.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stars = (n) => n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '-'

  return (
    <div>
      <PageHeader title={typeTitles[type]} icon={<FiNavigation />}>
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
                {['S.No', 'ID', 'Client', 'Conducteur', 'Départ', 'Arrivée', 'Distance', 'Montant', 'Note', 'Date', 'Statut', 'Action'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={12} style={{ padding: 30, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>Aucune course disponible</td></tr>
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
                  <td style={{ padding: '10px 14px', fontSize: 12 }}>{r.distance}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>{r.amount}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#ffb64d' }}>{stars(r.rating)}</td>
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
