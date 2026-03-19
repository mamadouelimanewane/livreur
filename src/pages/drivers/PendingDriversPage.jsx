import { useEffect, useState } from 'react'
import { FiTruck, FiDownload, FiInfo, FiCheck, FiX } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, Badge } from '../../components/PageLayout'
import { getPendingDrivers } from '../../services/api/driversService'

export default function PendingDriversPage() {
  const [drivers, setDrivers] = useState([])
  const [zone, setZone] = useState('Toutes zones')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDrivers() {
      try {
        setLoading(true)
        setError('')
        const nextDrivers = await getPendingDrivers()
        if (isMounted) {
          setDrivers(nextDrivers)
        }
      } catch {
        if (isMounted) {
          setError("Impossible de charger les conducteurs en attente d'approbation.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDrivers()

    return () => {
      isMounted = false
    }
  }, [])

  const zones = ['Toutes zones', ...new Set(drivers.map(driver => driver.zone))]
  const normalizedSearch = search.trim().toLowerCase()
  const filteredDrivers = drivers.filter(driver => {
    const matchesZone = zone === 'Toutes zones' || driver.zone === zone
    const matchesSearch = !normalizedSearch || [
      driver.id,
      driver.name,
      driver.phone,
      driver.email,
      driver.vehicle,
    ].some(value => value.toLowerCase().includes(normalizedSearch))

    return matchesZone && matchesSearch
  })

  return (
    <div>
      <PageHeader title="En attente d'approbation" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
        <Btn color="#4680ff"><FiInfo size={14} /></Btn>
      </PageHeader>

      <div style={{
        background: '#fff8ee',
        border: '1px solid #ffb64d',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: 13,
        color: '#7a5200',
        fontWeight: 600,
      }}>
        En attente d'approbation des détails ({drivers.length}) - Ces conducteurs ont soumis leurs documents et attendent votre approbation.
      </div>

      <FilterBar>
        <Select value={zone} onChange={event => setZone(event.target.value)} options={zones} />
        <TextInput placeholder="Rechercher..." value={search} onChange={event => setSearch(event.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => { setZone('Toutes zones'); setSearch('') }}>Réinitialiser</Btn>
      </FilterBar>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#718096', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Chargement des demandes...
        </div>
      ) : error ? (
        <div style={{ background: '#fff0f3', border: '1px solid #ff5370', borderRadius: 8, padding: 16, color: '#c53030' }}>
          {error}
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f6f7fb' }}>
                  {['S.No', 'ID', 'Conducteur', 'Zone', 'Véhicule', 'Documents', 'Date soumission', 'Actions'].map((header, index) => (
                    <th key={index} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#718096', borderBottom: '1px solid #edf2f7', whiteSpace: 'nowrap' }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver, index) => (
                  <tr
                    key={driver.id}
                    style={{ borderBottom: '1px solid #f7f9fb' }}
                    onMouseEnter={event => { event.currentTarget.style.background = '#fafbff' }}
                    onMouseLeave={event => { event.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{index + 1}</td>
                    <td style={{ padding: '10px 14px' }}><span style={{ color: '#4680ff', fontWeight: 600 }}>{driver.id}</span></td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#2d3748' }}>{driver.name}</div>
                      <div style={{ fontSize: 12, color: '#718096' }}>{driver.phone}</div>
                      <div style={{ fontSize: 12, color: '#718096' }}>{driver.email}</div>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{driver.zone}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13 }}>{driver.vehicle}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge color="#4680ff" bg="#ebf4ff">{driver.docs} docs</Badge>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: '#718096' }}>{driver.submittedDate}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button style={{ padding: '4px 10px', background: '#2ed8a3', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><FiCheck size={12} /> Approuver</button>
                        <button style={{ padding: '4px 10px', background: '#ff5370', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><FiX size={12} /> Rejeter</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid #edf2f7', fontSize: 12, color: '#718096' }}>
            Affichage de {filteredDrivers.length} entrées
          </div>
        </div>
      )}
    </div>
  )
}
