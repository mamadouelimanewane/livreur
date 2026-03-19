import { useEffect, useState } from 'react'
import { FiTruck, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, Select, TextInput, DataTable, Badge } from '../../components/PageLayout'
import { getRejectedDrivers } from '../../services/api/driversService'

export default function RejectedDriversPage() {
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
        const nextDrivers = await getRejectedDrivers()
        if (isMounted) {
          setDrivers(nextDrivers)
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les conducteurs rejetés.')
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
      driver.reason,
    ].some(value => value.toLowerCase().includes(normalizedSearch))

    return matchesZone && matchesSearch
  })

  const data = filteredDrivers.map((driver, index) => [
    index + 1,
    <span key={`${driver.id}-id`} style={{ color: '#4680ff', fontWeight: 600 }}>{driver.id}</span>,
    <div key={`${driver.id}-details`}>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{driver.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{driver.phone}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{driver.email}</div>
    </div>,
    driver.zone,
    <span key={`${driver.id}-reason`} style={{ fontSize: 12, color: '#ff5370' }}>{driver.reason}</span>,
    driver.rejectedDate,
    <Badge key={`${driver.id}-status`} color="#ff5370" bg="#fff0f3">Rejeté</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Conducteurs rejetés" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <FilterBar>
        <Select value={zone} onChange={event => setZone(event.target.value)} options={zones} />
        <TextInput placeholder="Rechercher..." value={search} onChange={event => setSearch(event.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => { setZone('Toutes zones'); setSearch('') }}>Réinitialiser</Btn>
      </FilterBar>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#718096', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Chargement des conducteurs rejetés...
        </div>
      ) : error ? (
        <div style={{ background: '#fff0f3', border: '1px solid #ff5370', borderRadius: 8, padding: 16, color: '#c53030' }}>
          {error}
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#a0aec0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Aucun conducteur rejeté
        </div>
      ) : (
        <DataTable
          columns={['S.No', 'ID', 'Conducteur', 'Zone', 'Raison du rejet', 'Date de rejet', 'Statut']}
          data={data}
        />
      )}
    </div>
  )
}
