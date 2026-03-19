import { useEffect, useState } from 'react'
import { FiTruck, FiDownload } from 'react-icons/fi'
import { PageHeader, Btn, FilterBar, TextInput, DataTable, Badge } from '../../components/PageLayout'
import { getTempRejectedDrivers } from '../../services/api/driversService'

export default function TempRejectedDriversPage() {
  const [drivers, setDrivers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDrivers() {
      try {
        setLoading(true)
        setError('')
        const nextDrivers = await getTempRejectedDrivers()
        if (isMounted) {
          setDrivers(nextDrivers)
        }
      } catch {
        if (isMounted) {
          setError('Impossible de charger les conducteurs temporairement rejetés.')
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

  const normalizedSearch = search.trim().toLowerCase()
  const filteredDrivers = drivers.filter(driver => !normalizedSearch || [
    driver.id,
    driver.name,
    driver.phone,
    driver.zone,
    driver.reason,
  ].some(value => value.toLowerCase().includes(normalizedSearch)))

  const data = filteredDrivers.map((driver, index) => [
    index + 1,
    <span key={`${driver.id}-id`} style={{ color: '#4680ff', fontWeight: 600 }}>{driver.id}</span>,
    <div key={`${driver.id}-details`}>
      <div style={{ fontWeight: 600, color: '#2d3748' }}>{driver.name}</div>
      <div style={{ fontSize: 12, color: '#718096' }}>{driver.phone}</div>
    </div>,
    driver.zone,
    <span key={`${driver.id}-reason`} style={{ fontSize: 12, color: '#ffb64d' }}>{driver.reason}</span>,
    <span key={`${driver.id}-until`} style={{ fontSize: 12, color: '#ff5370' }}>Jusqu'au {driver.until}</span>,
    driver.rejectedDate,
    <Badge key={`${driver.id}-status`} color="#ffb64d" bg="#fff8ee">Temporaire</Badge>,
  ])

  return (
    <div>
      <PageHeader title="Temporairement rejetés" icon={<FiTruck />}>
        <Btn color="#4680ff"><FiDownload size={14} /></Btn>
      </PageHeader>

      <div style={{
        background: '#fff8ee',
        border: '1px solid #ffb64d',
        borderRadius: 8,
        padding: '10px 16px',
        marginBottom: 16,
        fontSize: 13,
        color: '#7a5200',
      }}>
        Ces conducteurs ont été temporairement suspendus. Ils pourront être réactivés après la date indiquée.
      </div>

      <FilterBar>
        <TextInput placeholder="Rechercher..." value={search} onChange={event => setSearch(event.target.value)} />
        <Btn color="#4680ff">Rechercher</Btn>
        <Btn outline color="#6c757d" onClick={() => setSearch('')}>Réinitialiser</Btn>
      </FilterBar>

      {loading ? (
        <div style={{ background: '#fff', borderRadius: 8, padding: 40, textAlign: 'center', color: '#718096', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          Chargement des suspensions temporaires...
        </div>
      ) : error ? (
        <div style={{ background: '#fff0f3', border: '1px solid #ff5370', borderRadius: 8, padding: 16, color: '#c53030' }}>
          {error}
        </div>
      ) : (
        <DataTable
          columns={['S.No', 'ID', 'Conducteur', 'Zone', 'Raison', 'Suspendu jusqu\'au', 'Date', 'Statut']}
          data={data}
        />
      )}
    </div>
  )
}
