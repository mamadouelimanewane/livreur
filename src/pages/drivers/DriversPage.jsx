import { useEffect, useState } from 'react'
import { FiTruck, FiPlus, FiDownload, FiInfo, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput } from '../../components/PageLayout'
import { getDrivers, getDriverFilters, getDriverStatusStyles } from '../../services/api/driversService'

const pillStyle = (color, bg) => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 600,
  background: bg,
  color: color,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
})

export default function DriversPage() {
  const [drivers, setDrivers] = useState([])
  const [filters, setFilters] = useState({ statuses: ['Tous'], zones: ['Tous'], vehicles: ['Tous'] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Tous')
  const [zone, setZone] = useState('Tous')
  const [vehicleType, setVehicleType] = useState('Tous')
  const [entries, setEntries] = useState('50')
  const statusStyle = getDriverStatusStyles()

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [driverRows, filterConfig] = await Promise.all([getDrivers(), getDriverFilters()])
        if (!active) return
        setDrivers(driverRows)
        setFilters(filterConfig)
      } catch {
        if (!active) return
        setError('Impossible de charger les conducteurs.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => { active = false }
  }, [])

  const filtered = drivers.filter(d => {
    if (status !== 'Tous' && d.status !== status) return false
    if (zone !== 'Tous' && d.zone !== zone) return false
    if (vehicleType !== 'Tous' && d.vehicle !== vehicleType) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <PageHeader title="Tous les conducteurs" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#2ed8a3"><FiPlus size={14} /> Ajouter</Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <span style={pillStyle('#ffb64d', '#fff8ee')}>Approbation en attente (0)</span>
        <span style={pillStyle('#4680ff', '#ebf4ff')}>Temps d'approbation docs (0)</span>
        <span style={pillStyle('#2ed8a3', '#e6faf4')}>Inscription de base (4)</span>
        <span style={{ ...pillStyle('#6c757d', '#f0f0f0'), border: '1px solid #ddd' }}>{'Effac\u00e9 Conducteurs'}</span>
        <span style={pillStyle('#ff5370', '#fff0f3')}>{'Conducteurs rejet\u00e9s (0)'}</span>
        <span style={pillStyle('#2ed8a3', '#e6faf4')}>En attente d'approbation (3)</span>
      </div>

      <FilterBar>
        <Select value={status} onChange={e => setStatus(e.target.value)} options={filters.statuses} />
        <Select value={'S\u00e9n\u00e9gal'} onChange={() => {}} options={['S\u00e9n\u00e9gal', 'C\u00f4te d\'Ivoire', 'Mali']} />
        <Select value={zone} onChange={e => setZone(e.target.value)} options={filters.zones} />
        <Select value={vehicleType} onChange={e => setVehicleType(e.target.value)} options={filters.vehicles} />
        <Select value={'S\u00e9lectionner par'} onChange={() => {}} options={['S\u00e9lectionner par', 'Nom', 'ID']} />
        <TextInput placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={entries} onChange={e => setEntries(e.target.value)} options={['10', '25', '50', '100']} style={{ width: 70 }} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => { setSearch(''); setStatus('Tous') }}>{'R\u00e9initialiser'}</Btn>
      </FilterBar>

      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f7fb' }}>
                {['S.No', 'ID', 'Zone de service', 'D\u00e9tails du conducteur', 'Stats services', 'Transactions', 'Date d\'inscription', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#a0aec0', fontSize: 13 }}>Chargement des conducteurs...</td></tr>
              ) : error ? (
                <tr><td colSpan={8} style={{ padding: 30, textAlign: 'center', color: '#c53030', fontSize: 13 }}>{error}</td></tr>
              ) : filtered.map((d, i) => (
                <tr
                  key={d.id}
                  style={{ borderBottom: '1px solid #f7f9fb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{i + 1}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 13, color: '#4680ff', fontWeight: 600 }}>{d.id}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}><div>{d.zone}</div><div style={{ fontSize: 11, color: '#a0aec0' }}>{d.vehicle}</div></td>
                  <td style={{ padding: '10px 14px' }}><div style={{ fontWeight: 600, fontSize: 13, color: '#2d3748' }}>{d.name}</div><div style={{ fontSize: 12, color: '#718096' }}>{d.phone}</div><div style={{ fontSize: 12, color: '#718096' }}>{d.email}</div></td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}><span style={{ background: '#ebf4ff', color: '#4680ff', borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{d.rides} courses</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#2d3748' }}>{d.amount}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096', whiteSpace: 'nowrap' }}>
                    {d.registered}
                    <br />
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: statusStyle[d.status].bg, color: statusStyle[d.status].color, marginTop: 4 }}>{d.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={{ padding: '4px 8px', background: '#4680ff', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEye size={12} /></button>
                      <button style={{ padding: '4px 8px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiEdit2 size={12} /></button>
                      <button style={{ padding: '4px 8px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer' }}><FiTrash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#718096' }}>
          <span>Affichage de {filtered.length} conducteurs</span>
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
