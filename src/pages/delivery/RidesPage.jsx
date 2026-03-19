import { useEffect, useState } from 'react'
import { FiPackage, FiDownload, FiInfo, FiEye } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'
import {
  getDeliveryRides,
  getRideStatusConfig,
  getRideTitles,
  getRideTypeFilter,
} from '../../services/api/ridesService'

export default function RidesPage({ type = 'all' }) {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const statusConfig = getRideStatusConfig()
  const typeFilter = getRideTypeFilter()
  const typeTitles = getRideTitles('delivery')
  const allowed = typeFilter[type] || typeFilter.all

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const rideRows = await getDeliveryRides()
        if (!active) return
        setRides(rideRows)
      } catch {
        if (!active) return
        setError('Impossible de charger les courses de livraison.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => { active = false }
  }, [])

  const filtered = rides.filter(r => {
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
          {Object.entries(statusConfig).map(([statusLabel, style]) => (
            <Badge key={statusLabel} color={style.color} bg={style.bg}>
              {statusLabel} ({rides.filter(ride => ride.status === statusLabel).length})
            </Badge>
          ))}
        </div>
      )}

      <FilterBar>
        <Select value={'S\u00e9n\u00e9gal'} onChange={() => {}} options={['S\u00e9n\u00e9gal']} />
        <Select value="Toutes zones" onChange={() => {}} options={['Toutes zones', 'Dakar Centre', 'Plateau', 'Parcelles', 'Gu\u00e9diawaye']} />
        <TextInput placeholder="ID course ou client..." value={search} onChange={e => setSearch(e.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => setSearch('')}>{'R\u00e9initialiser'}</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID Course', 'Client', 'Conducteur', 'D\u00e9part', 'Arriv\u00e9e', 'Produit', 'Montant', 'Date', 'Statut', 'Action'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={11} style={{ padding: 30, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>Chargement des courses...</td></tr>
              ) : error ? (
                <tr><td colSpan={11} style={{ padding: 30, textAlign: 'center', color: '#c53030', fontSize: 13 }}>{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: 30, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>Aucune course disponible</td></tr>
              ) : filtered.map((r, i) => (
                <tr
                  key={r.id}
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
                  <td style={{ padding: '10px 14px' }}><Badge color={statusConfig[r.status].color} bg={statusConfig[r.status].bg}>{r.status}</Badge></td>
                  <td style={{ padding: '10px 14px' }}><button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#718096' }}>
          <span>Affichage de {filtered.length} courses</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['\u00ab', '\u2039', '1', '\u203a', '\u00bb'].map((p, i) => (
              <button key={i} style={{ padding: '3px 8px', border: '1px solid #ddd', borderRadius: 4, background: p === '1' ? '#4680ff' : '#fff', color: p === '1' ? '#fff' : '#4a5568', cursor: 'pointer', fontSize: 12 }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
